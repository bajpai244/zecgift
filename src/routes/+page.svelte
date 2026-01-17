<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { PUBLIC_ZCASH_NETWORK, PUBLIC_LIGHTWALLETD_URL } from '$env/static/public';

	// State
	let address = $state('');
	let seedPhrase = $state('');
	let birthdayHeight = $state(0);
	let balance = $state(0); // in zatoshi
	let isLoading = $state(true);
	let isSyncing = $state(false);
	let copied = $state(false);
	let linkCopied = $state(false);
	let linkGenerated = $state(false);
	let isButtonHovered = $state(false);
	// Claim mode state
	let isClaimMode = $state(false);
	let recipientAddress = $state('');
	let isSending = $state(false);
	let sendError = $state('');
	let sendSuccess = $state(false);
	let txId = $state('');
	let wallet: any = null;
	let accountId: number = 0;
	let pollInterval: ReturnType<typeof setInterval> | null = null;

	// Convert zatoshi to ZEC
	function formatZec(zatoshi: number): string {
		if (zatoshi === 0) return '0';
		const zec = zatoshi / 100_000_000;
		// Remove trailing zeros but keep at least one decimal if needed
		return parseFloat(zec.toFixed(8)).toString();
	}

	// Truncate address for display
	function truncateAddress(addr: string): string {
		if (addr.length <= 20) return addr;
		return `${addr.slice(0, 12)}...${addr.slice(-8)}`;
	}

	// Truncate link for display
	function truncateLink(link: string): string {
		if (link.length <= 40) return link;
		return `${link.slice(0, 28)}...${link.slice(-8)}`;
	}

	// Truncate transaction ID for display
	function truncateTxId(id: string): string {
		if (id.length <= 16) return id;
		return `${id.slice(0, 8)}...${id.slice(-8)}`;
	}

	// Reactive gift link
	let giftLink = $derived(
		browser && seedPhrase && birthdayHeight
			? `${window.location.origin}?gift=${btoa(JSON.stringify({ seed: seedPhrase, birthday: birthdayHeight }))}`
			: ''
	);

	// Copy to clipboard
	async function copyAddress() {
		await navigator.clipboard.writeText(address);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	// Generate the gift link (reveal it)
	function generateLink() {
		linkGenerated = true;
	}

	// Copy gift link to clipboard
	async function copyGiftLink() {
		await navigator.clipboard.writeText(giftLink);
		linkCopied = true;
		setTimeout(() => (linkCopied = false), 2000);
	}

	// Fee reserve for ZIP-317 shielded transaction (20000 zatoshi = 0.0002 ZEC)
	const FEE_RESERVE = 30000;

	// Claim gift - send ZEC to recipient address
	async function claimGift() {
		if (!wallet || !recipientAddress || balance === 0) return;

		sendError = '';
		isSending = true;

		try {
			// Send all available funds minus fee reserve
			const sendAmount = balance - FEE_RESERVE;
			console.log('Balance:', balance);
			console.log('Fee reserve:', FEE_RESERVE);
			console.log('Send amount (balance - fee):', sendAmount);
			console.log('Recipient:', recipientAddress);
			console.log('Account ID:', accountId);

			if (sendAmount <= 0) {
				sendError = 'Balance too low to send (need more than 0.0002 ZEC for fees)';
				isSending = false;
				return;
			}

			// Create proposal
			console.log('Creating proposal...');
			const proposal = await wallet.propose_transfer(
				accountId,
				recipientAddress,
				BigInt(sendAmount)
			);
			console.log('Proposal created:', proposal);

			// Sign and create transaction
			console.log('Signing transaction with seed phrase...');
			const authorizedTxns = await wallet.create_proposed_transactions(
				proposal,
				seedPhrase,
				0 // account HD index
			);
			console.log('Transaction signed, txids:', authorizedTxns);
			console.log('Transaction bytes (hex):', Array.from(authorizedTxns).map(b => b.toString(16).padStart(2, '0')).join(''));

			// Extract txId from the authorized transactions (first 32 bytes reversed for txid)
			// The authorizedTxns is a flat byte array where each txid is 32 bytes
			const txIdBytes = authorizedTxns.slice(0, 32);
			// Reverse bytes for display (Zcash txids are displayed in reverse byte order)
			const txIdHex = Array.from(txIdBytes).reverse().map((b: number) => b.toString(16).padStart(2, '0')).join('');
			console.log('Transaction ID:', txIdHex);

			// Send to network
			console.log('Sending to network...');
			try {
				await wallet.send_authorized_transactions(authorizedTxns);
				console.log('Transaction sent successfully!');
				txId = txIdHex;
				sendSuccess = true;
			} catch (sendErr: any) {
				console.error('Send error details:');
				console.error('- message:', sendErr.message);
				console.error('- name:', sendErr.name);
				console.error('- stack:', sendErr.stack);
				console.error('- full object:', JSON.stringify(sendErr, Object.getOwnPropertyNames(sendErr)));
				throw sendErr;
			}
		} catch (e: any) {
			console.error('Claim error:', e);
			console.error('Error keys:', Object.keys(e));
			console.error('Error full:', JSON.stringify(e, Object.getOwnPropertyNames(e)));
			sendError = e.message || 'Failed to send transaction';
		} finally {
			isSending = false;
		}
	}

	// Sync and update balance
	async function syncAndUpdateBalance() {
		if (!wallet || isSyncing) return;

		isSyncing = true;
		try {
			await wallet.sync();
			const summary = await wallet.get_wallet_summary();
			if (summary) {
				const balances = summary.account_balances;
				if (balances && balances.length > 0) {
					const [, bal] = balances[0];
					balance = (bal.sapling_balance || 0) + (bal.orchard_balance || 0) + (bal.unshielded_balance || 0);
				}
			}
		} catch (e) {
			console.error('Sync error:', e);
		} finally {
			isSyncing = false;
		}
	}

	// Parse gift data from URL
	function parseGiftFromUrl(): { seed: string; birthday: number } | null {
		if (!browser) return null;
		const giftParam = $page.url.searchParams.get('gift');
		if (!giftParam) return null;

		try {
			const decoded = atob(giftParam);
			return JSON.parse(decoded);
		} catch {
			return null;
		}
	}

	onMount(async () => {
		if (!browser) return;

		try {
			const { default: initWallet, initThreadPool, WebWallet, generate_seed_phrase } =
				await import('@chainsafe/webzjs-wallet');

			await initWallet();
			const numThreads = navigator.hardwareConcurrency || 4;
			await initThreadPool(numThreads);

			// Check if restoring from gift link
			const giftData = parseGiftFromUrl();

			const network = PUBLIC_ZCASH_NETWORK || 'test';
			const lightwalletdUrl = PUBLIC_LIGHTWALLETD_URL || 'https://zcash-testnet.chainsafe.dev';
			wallet = new WebWallet(network, lightwalletdUrl, 1);

			if (giftData) {
				// Restore from gift link - enter claim mode
				isClaimMode = true;
				seedPhrase = giftData.seed;
				birthdayHeight = giftData.birthday;
			} else {
				// Generate new ephemeral wallet
				seedPhrase = generate_seed_phrase();
				const latestBlock = await wallet.get_latest_block();
				birthdayHeight = Number(latestBlock);
			}

			accountId = await wallet.create_account('default', seedPhrase, 0, birthdayHeight);
			address = await wallet.get_current_address(accountId);

			isLoading = false;

			// Initial sync
			await syncAndUpdateBalance();

			// Poll every 10 seconds
			pollInterval = setInterval(syncAndUpdateBalance, 10000);
		} catch (error) {
			console.error('Error:', error);
			isLoading = false;
		}
	});

	onDestroy(() => {
		if (pollInterval) {
			clearInterval(pollInterval);
		}
	});
</script>

<div class="container">
	<div class="card">
		{#if isClaimMode}
			<!-- CLAIM MODE UI -->
			<div class="logo">ZecGift</div>
			<p class="tagline">You've received a Zcash gift!</p>

			{#if isLoading}
				<div class="loading">
					<div class="spinner"></div>
					<p>Loading your gift...</p>
				</div>
			{:else if sendSuccess}
				<div class="success-container">
					<div class="success-icon">✓</div>
					<p class="success-text">Gift claimed successfully!</p>
					<p class="success-hint">ZEC has been sent to your address</p>
					{#if txId}
						<a
							href="https://mainnet.zcashexplorer.app/transactions/{txId}"
							target="_blank"
							rel="noopener noreferrer"
							class="explorer-link"
						>
							View on Explorer: {truncateTxId(txId)}
						</a>
					{/if}
				</div>
			{:else}
				<div class="balance-container">
					<div class="balance">
						{formatZec(balance)} ZEC
						{#if isSyncing}
							<span class="balance-spinner"></span>
						{/if}
					</div>
					<p class="balance-label">Available to claim</p>
					<p class="fee-hint">0.0002 ZEC will be deducted for network fees</p>
				</div>

				<div class="claim-form">
					<label for="recipient" class="input-label">Your Zcash Address</label>
					<input
						id="recipient"
						type="text"
						bind:value={recipientAddress}
						placeholder="u1..."
						class="address-input"
						disabled={isSending}
					/>

					{#if sendError}
						<p class="error-text">{sendError}</p>
					{/if}

					<button
						class="claim-btn"
						onclick={claimGift}
						disabled={isSending || !recipientAddress || balance === 0}
					>
						{#if isSending}
							<span class="btn-spinner"></span>
							Sending...
						{:else}
							Claim Gift
						{/if}
					</button>
				</div>
			{/if}
		{:else}
			<!-- CREATE MODE UI -->
			<div class="logo">ZecGift</div>

			<p class="tagline">
				Fund this address to create<br />a Zcash gift card
			</p>
			<p class="deposit-hint">Fund with at least 0.001 ZEC</p>

			{#if isLoading}
				<div class="loading">
					<div class="spinner"></div>
					<p>Initializing wallet...</p>
				</div>
			{:else}
				<div class="address-container">
					<div class="address" title={address}>
						{truncateAddress(address)}
					</div>
					<button class="copy-btn" onclick={copyAddress} title="Copy address">
						{copied ? '✓' : '📋'}
					</button>
				</div>

				<div class="balance-container">
					<div class="balance">
						{formatZec(balance)} ZEC
						{#if isSyncing}
							<span class="balance-spinner"></span>
						{/if}
					</div>
				</div>

				<div class="gift-link-section">
					{#if !linkGenerated}
						<button
							class="generate-btn"
							onclick={generateLink}
							onmouseenter={() => (isButtonHovered = true)}
							onmouseleave={() => (isButtonHovered = false)}
						>
							Generate Gift Link
						</button>
						<p class="hint-text" class:highlighted={isButtonHovered}>
							Click generate link once account is funded
						</p>
					{:else}
						<div class="link-reveal">
							<div class="link-text" title={giftLink}>
								{giftLink ? truncateLink(giftLink) : 'Generating...'}
							</div>
							<button class="copy-link-btn" onclick={copyGiftLink} title="Copy gift link">
								{linkCopied ? 'Copied!' : 'Copy'}
							</button>
						</div>
						<p class="share-hint">Share this link with your recipient</p>
					{/if}
				</div>
			{/if}
		{/if}
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			sans-serif;
		background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
		min-height: 100vh;
	}

	.container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
		box-sizing: border-box;
	}

	.card {
		background: white;
		border-radius: 24px;
		padding: 48px;
		box-shadow:
			0 4px 6px rgba(0, 0, 0, 0.05),
			0 10px 40px rgba(0, 0, 0, 0.08);
		max-width: 420px;
		width: 100%;
		text-align: center;
	}

	.logo {
		font-size: 32px;
		font-weight: 700;
		color: #1a1a1a;
		margin-bottom: 8px;
		letter-spacing: -0.5px;
	}

	.tagline {
		color: #666;
		font-size: 16px;
		line-height: 1.5;
		margin: 0 0 32px 0;
	}

	.loading {
		padding: 40px 0;
	}

	.spinner {
		width: 32px;
		height: 32px;
		border: 3px solid #e4e8ec;
		border-top-color: #1a1a1a;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
		margin: 0 auto 16px;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.loading p {
		color: #666;
		margin: 0;
	}

	.address-container {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		background: #f5f7fa;
		border-radius: 12px;
		padding: 16px 20px;
		margin-bottom: 24px;
	}

	.address {
		font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
		font-size: 14px;
		color: #1a1a1a;
		word-break: break-all;
	}

	.copy-btn {
		background: none;
		border: none;
		font-size: 18px;
		cursor: pointer;
		padding: 4px;
		opacity: 0.6;
		transition: opacity 0.2s;
	}

	.copy-btn:hover {
		opacity: 1;
	}

	.balance-container {
		margin-bottom: 32px;
	}

	.balance {
		font-size: 36px;
		font-weight: 600;
		color: #1a1a1a;
		letter-spacing: -1px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
	}

	.balance-spinner {
		width: 18px;
		height: 18px;
		border: 2px solid #e4e8ec;
		border-top-color: #1a1a1a;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	.gift-link-section {
		margin-top: 24px;
	}

	.generate-btn {
		background: #1a1a1a;
		color: white;
		border: none;
		border-radius: 12px;
		padding: 16px 32px;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		width: 100%;
	}

	.generate-btn:hover {
		background: #333;
		transform: translateY(-1px);
	}

	.generate-btn:active {
		transform: translateY(0);
	}

	.hint-text {
		font-size: 14px;
		color: #999;
		margin: 12px 0 0 0;
		transition: color 0.2s;
	}

	.hint-text.highlighted {
		color: #1a1a1a;
	}

	.link-reveal {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 12px 0;
		animation: fadeSlideIn 0.3s ease-out;
	}

	@keyframes fadeSlideIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.link-text {
		font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
		font-size: 13px;
		color: #1a1a1a;
		word-break: break-all;
		flex: 1;
		text-align: left;
	}

	.copy-link-btn {
		background: #1a1a1a;
		color: white;
		border: none;
		border-radius: 8px;
		padding: 8px 16px;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
		white-space: nowrap;
	}

	.copy-link-btn:hover {
		background: #333;
	}

	.share-hint {
		font-size: 13px;
		color: #999;
		margin: 12px 0 0 0;
	}

	.deposit-hint {
		font-size: 13px;
		color: #666;
		margin: -20px 0 24px 0;
		background: #f0f7ff;
		padding: 8px 16px;
		border-radius: 8px;
		border: 1px solid #d0e3ff;
	}

	.fee-hint {
		font-size: 12px;
		color: #888;
		margin: 4px 0 0 0;
	}

	/* Claim mode styles */
	.balance-label {
		font-size: 14px;
		color: #666;
		margin-top: 8px;
	}

	.claim-form {
		margin-top: 32px;
	}

	.input-label {
		display: block;
		font-size: 14px;
		color: #666;
		margin-bottom: 8px;
		text-align: left;
	}

	.address-input {
		width: 100%;
		padding: 16px;
		border: 2px solid #e4e8ec;
		border-radius: 12px;
		font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
		font-size: 14px;
		box-sizing: border-box;
		transition: border-color 0.2s;
	}

	.address-input:focus {
		outline: none;
		border-color: #1a1a1a;
	}

	.address-input:disabled {
		background: #f5f7fa;
		color: #999;
	}

	.error-text {
		color: #e53935;
		font-size: 14px;
		margin: 12px 0 0 0;
		text-align: left;
	}

	.claim-btn {
		background: #1a1a1a;
		color: white;
		border: none;
		border-radius: 12px;
		padding: 16px 32px;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		width: 100%;
		margin-top: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}

	.claim-btn:hover:not(:disabled) {
		background: #333;
	}

	.claim-btn:disabled {
		background: #ccc;
		cursor: not-allowed;
	}

	.btn-spinner {
		width: 16px;
		height: 16px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	.success-container {
		padding: 40px 0;
		animation: fadeSlideIn 0.3s ease-out;
	}

	.success-icon {
		width: 64px;
		height: 64px;
		background: #4caf50;
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32px;
		margin: 0 auto 16px;
	}

	.success-text {
		font-size: 20px;
		font-weight: 600;
		color: #1a1a1a;
		margin: 0 0 8px 0;
	}

	.success-hint {
		font-size: 14px;
		color: #666;
		margin: 0;
	}

	.explorer-link {
		display: inline-block;
		margin-top: 16px;
		color: #1a73e8;
		text-decoration: none;
		font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
		font-size: 13px;
		padding: 8px 16px;
		background: #f0f7ff;
		border-radius: 8px;
		transition: background 0.2s;
	}

	.explorer-link:hover {
		background: #e0efff;
		text-decoration: underline;
	}
</style>
