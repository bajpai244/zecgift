<script lang="ts">
	import { onMount } from 'svelte';
	import init, { generate_seed_phrase, UnifiedSpendingKey } from '@chainsafe/webzjs-keys';
	import { mnemonicToSeedSync } from '@scure/bip39';

	onMount(async () => {
		// Initialize WASM
		await init();

		// Generate random seed phrase
		const seedPhrase = generate_seed_phrase();
		console.log('Seed Phrase:', seedPhrase);

		// Convert mnemonic to seed bytes
		const seedBytes = mnemonicToSeedSync(seedPhrase);

		// Create spending key (mainnet, seed, account index 0)
		const spendingKey = new UnifiedSpendingKey('main', seedBytes, 0);

		// Get viewing key and encode to address string
		const ufvk = spendingKey.to_unified_full_viewing_key();
		const address = ufvk.encode('main');

		console.log('Zcash Unified Full Viewing Key:', address);
	});
</script>

<h1>Hello World</h1>
