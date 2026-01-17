<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	onMount(async () => {
		if (!browser) return;

		try {
			// Dynamically import to avoid SSR issues
			const { default: initWallet, initThreadPool, WebWallet, generate_seed_phrase } =
				await import('@chainsafe/webzjs-wallet');

			// Initialize WASM module
			await initWallet();

			// Initialize thread pool for parallel processing
			const numThreads = navigator.hardwareConcurrency || 4;
			await initThreadPool(numThreads);
			console.log(`Thread pool initialized with ${numThreads} threads`);

			// Generate random seed phrase
			const seedPhrase = generate_seed_phrase();
			console.log('Seed Phrase:', seedPhrase);

			// Create wallet connected to testnet via local gRPC-web proxy
			const wallet = new WebWallet('test', 'http://localhost:1234/testnet', 1);
			console.log('Wallet created, connecting to testnet...');

			// Get latest block height as birthday
			const latestBlock = await wallet.get_latest_block();
			const birthdayHeight = Number(latestBlock);
			console.log('Birthday Height (latest block):', birthdayHeight);

			// Create account with seed phrase
			const accountId = await wallet.create_account('default', seedPhrase, 0, birthdayHeight);
			console.log('Account created with ID:', accountId);

			// Get and log the address
			const address = await wallet.get_current_address(accountId);
			console.log('Zcash Address:', address);

			// Sync wallet
			console.log('Starting wallet sync...');
			await wallet.sync();
			console.log('Wallet has been synced');

			// Get wallet summary with balances
			const summary = await wallet.get_wallet_summary();
			if (summary) {
				console.log('Chain tip height:', summary.chain_tip_height);
				console.log('Fully scanned height:', summary.fully_scanned_height);

				// Get first account's balances (account_balances is an array of [accountId, balanceMap])
				const balances = summary.account_balances;
				if (balances && balances.length > 0) {
					const [, balance] = balances[0];
					console.log('Sapling balance:', balance.sapling_balance, 'zatoshi');
					console.log('Orchard balance:', balance.orchard_balance, 'zatoshi');
					console.log('Unshielded balance:', balance.unshielded_balance, 'zatoshi');
				}
			} else {
				console.log('No wallet summary available yet');
			}
		} catch (error) {
			console.error('Error:', error);
		}
	});
</script>

<h1>Hello World</h1>
