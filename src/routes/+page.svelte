<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	// State
	let address = $state('');
	let seedPhrase = $state('');
	let birthdayHeight = $state(0);
	let balance = $state(0); // in zatoshi
	let isLoading = $state(true);
	let isSyncing = $state(false);
	let copied = $state(false);
	let linkCopied = $state(false);
	let wallet: any = null;
	let accountId: number = 0;
	let pollInterval: ReturnType<typeof setInterval> | null = null;

	// Convert zatoshi to ZEC
	function formatZec(zatoshi: number): string {
		return (zatoshi / 100_000_000).toFixed(8);
	}

	// Truncate address for display
	function truncateAddress(addr: string): string {
		if (addr.length <= 20) return addr;
		return `${addr.slice(0, 12)}...${addr.slice(-8)}`;
	}

	// Copy to clipboard
	async function copyAddress() {
		await navigator.clipboard.writeText(address);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	// Generate gift link
	function generateGiftLink(): string {
		const data = { seed: seedPhrase, birthday: birthdayHeight };
		const encoded = btoa(JSON.stringify(data));
		return `${window.location.origin}?gift=${encoded}`;
	}

	async function copyGiftLink() {
		const link = generateGiftLink();
		await navigator.clipboard.writeText(link);
		linkCopied = true;
		setTimeout(() => (linkCopied = false), 2000);
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

			wallet = new WebWallet('test', 'http://localhost:1234/testnet', 1);

			if (giftData) {
				// Restore from gift link
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
		<div class="logo">ZecGift</div>

		<p class="tagline">
			Fund this address to create<br />a Zcash gift card
		</p>

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
				<div class="balance">{formatZec(balance)} ZEC</div>
				{#if isSyncing}
					<div class="sync-status">Checking balance...</div>
				{:else}
					<div class="sync-status">Balance updated</div>
				{/if}
			</div>

			<button class="generate-btn" onclick={copyGiftLink}>
				{linkCopied ? 'Link Copied!' : 'Generate Gift Link'}
			</button>
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
	}

	.sync-status {
		font-size: 13px;
		color: #999;
		margin-top: 8px;
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
</style>
