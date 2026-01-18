/* tslint:disable */
/* eslint-disable */
/**
 * Generate a new BIP39 24-word seed phrase
 *
 * IMPORTANT: This probably does not use secure randomness when used in the browser
 * and should not be used for anything other than testing
 *
 * # Returns
 *
 * A string containing a 24-word seed phrase
 */
export function generate_seed_phrase(): string;
/**
 * Signs and applies signatures to a PCZT.
 * Should in a secure environment (e.g. Metamask snap).
 *
 * # Arguments
 *
 * * `pczt` - The PCZT that needs to signed
 * * `usk` - UnifiedSpendingKey used to sign the PCZT
 * * `seed_fp` - The fingerprint of the seed used to create `usk`
 */
export function pczt_sign(network: string, pczt: Pczt, usk: UnifiedSpendingKey, seed_fp: SeedFingerprint): Promise<Pczt>;
export class Pczt {
  private constructor();
  free(): void;
  /**
   * Returns a JSON object with the details of the Pczt.
   */
  to_json(): any;
  /**
   * Returns a Pczt from a JSON object
   */
  static from_json(s: any): Pczt;
  /**
   * Returns the postcard serialization of the Pczt.
   */
  serialize(): Uint8Array;
  /**
   * Deserialize to a Pczt from postcard bytes.
   */
  static from_bytes(bytes: Uint8Array): Pczt;
}
/**
 * A Zcash Sapling proof generation key
 *
 * This is a wrapper around the `sapling::ProofGenerationKey` type. It is used for generating proofs for Sapling PCZTs.
 */
export class ProofGenerationKey {
  private constructor();
  free(): void;
}
/**
 * A ZIP32 seed fingerprint. Essentially a Blake2b hash of the seed.
 *
 * This is a wrapper around the `zip32::fingerprint::SeedFingerprint` type.
 */
export class SeedFingerprint {
  free(): void;
  /**
   * Construct a new SeedFingerprint
   *
   * # Arguments
   *
   * * `seed` - At least 32 bytes of entry. Care should be taken as to how this is derived
   */
  constructor(seed: Uint8Array);
  to_bytes(): Uint8Array;
  static from_bytes(bytes: Uint8Array): SeedFingerprint;
}
/**
 * A Zcash viewing key
 *
 * This is a wrapper around the `zcash_keys::keys::ViewingKey` type.
 * UFVKs should be generated from a spending key by calling `to_unified_full_viewing_key`
 * They can also be encoded and decoded to a canonical string representation
 */
export class UnifiedFullViewingKey {
  free(): void;
  /**
   * Encode the UFVK to a string
   *
   * # Arguments
   *
   * * `network` - Must be either "main" or "test"
   */
  encode(network: string): string;
  /**
   * Construct a UFVK from its encoded string representation
   *
   * # Arguments
   *
   * * `network` - Must be either "main" or "test"
   * * `encoding` - The encoded string representation of the UFVK
   */
  constructor(network: string, encoding: string);
}
/**
 * A Zcash spending key
 *
 * This is a wrapper around the `zcash_keys::keys::SpendingKey` type. It can be created from at least 32 bytes of seed entropy
 */
export class UnifiedSpendingKey {
  free(): void;
  /**
   * Construct a new UnifiedSpendingKey
   *
   * # Arguments
   *
   * * `network` - Must be either "main" or "test"
   * * `seed` - At least 32 bytes of entry. Care should be taken as to how this is derived
   * * `hd_index` - [ZIP32](https://zips.z.cash/zip-0032) hierarchical deterministic index of the account
   */
  constructor(network: string, seed: Uint8Array, hd_index: number);
  /**
   * Obtain the UFVK corresponding to this spending key
   */
  to_unified_full_viewing_key(): UnifiedFullViewingKey;
  to_sapling_proof_generation_key(): ProofGenerationKey;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly __wbg_seedfingerprint_free: (a: number, b: number) => void;
  readonly seedfingerprint_new: (a: number, b: number) => [number, number, number];
  readonly seedfingerprint_to_bytes: (a: number) => [number, number];
  readonly seedfingerprint_from_bytes: (a: number, b: number) => [number, number, number];
  readonly __wbg_proofgenerationkey_free: (a: number, b: number) => void;
  readonly __wbg_unifiedspendingkey_free: (a: number, b: number) => void;
  readonly unifiedspendingkey_new: (a: number, b: number, c: number, d: number, e: number) => [number, number, number];
  readonly unifiedspendingkey_to_unified_full_viewing_key: (a: number) => number;
  readonly unifiedspendingkey_to_sapling_proof_generation_key: (a: number) => number;
  readonly __wbg_unifiedfullviewingkey_free: (a: number, b: number) => void;
  readonly unifiedfullviewingkey_encode: (a: number, b: number, c: number) => [number, number, number, number];
  readonly unifiedfullviewingkey_new: (a: number, b: number, c: number, d: number) => [number, number, number];
  readonly generate_seed_phrase: () => [number, number];
  readonly pczt_sign: (a: number, b: number, c: number, d: number, e: number) => any;
  readonly __wbg_pczt_free: (a: number, b: number) => void;
  readonly pczt_to_json: (a: number) => any;
  readonly pczt_from_json: (a: any) => number;
  readonly pczt_serialize: (a: number) => [number, number];
  readonly pczt_from_bytes: (a: number, b: number) => number;
  readonly rustsecp256k1_v0_8_1_context_create: (a: number) => number;
  readonly rustsecp256k1_v0_8_1_context_destroy: (a: number) => void;
  readonly rustsecp256k1_v0_8_1_default_illegal_callback_fn: (a: number, b: number) => void;
  readonly rustsecp256k1_v0_8_1_default_error_callback_fn: (a: number, b: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly memory: WebAssembly.Memory;
  readonly __wbindgen_export_4: WebAssembly.Table;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly closure54_externref_shim: (a: number, b: number, c: any) => void;
  readonly closure223_externref_shim: (a: number, b: number, c: any, d: any) => void;
  readonly __wbindgen_thread_destroy: (a?: number, b?: number, c?: number) => void;
  readonly __wbindgen_start: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput, memory?: WebAssembly.Memory, thread_stack_size?: number }} module - Passing `SyncInitInput` directly is deprecated.
* @param {WebAssembly.Memory} memory - Deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput, memory?: WebAssembly.Memory, thread_stack_size?: number } | SyncInitInput, memory?: WebAssembly.Memory): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput>, memory?: WebAssembly.Memory, thread_stack_size?: number }} module_or_path - Passing `InitInput` directly is deprecated.
* @param {WebAssembly.Memory} memory - Deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput>, memory?: WebAssembly.Memory, thread_stack_size?: number } | InitInput | Promise<InitInput>, memory?: WebAssembly.Memory): Promise<InitOutput>;
