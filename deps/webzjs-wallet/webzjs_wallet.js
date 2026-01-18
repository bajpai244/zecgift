import { startWorkers } from './snippets/wasm-bindgen-rayon-38edf6e439f6d70d/src/workerHelpers.js';
import * as __wbg_star0 from './snippets/wasm_thread-8ee53d0673203880/src/wasm32/js/module_worker_start.js';
import * as __wbg_star1 from './snippets/wasm_thread-8ee53d0673203880/src/wasm32/js/module_workers_polyfill.min.js';

let wasm;

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.buffer !== wasm.memory.buffer) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().slice(ptr, ptr + len));
}

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_3.set(idx, obj);
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
};

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer !== wasm.memory.buffer) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => {
    wasm.__wbindgen_export_7.get(state.dtor)(state.a, state.b)
});

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_7.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state);
            } else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_export_3.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    for (let i = 0; i < array.length; i++) {
        const add = addToExternrefTable0(array[i]);
        getDataViewMemory0().setUint32(ptr + 4 * i, add, true);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}

export function start() {
    wasm.start();
}

/**
 * @param {number} num_threads
 * @returns {Promise<any>}
 */
export function initThreadPool(num_threads) {
    const ret = wasm.initThreadPool(num_threads);
    return ret;
}

/**
 * @param {number} receiver
 */
export function wbg_rayon_start_worker(receiver) {
    wasm.wbg_rayon_start_worker(receiver);
}

/**
 * Generate a new BIP39 24-word seed phrase
 *
 * IMPORTANT: This probably does not use secure randomness when used in the browser
 * and should not be used for anything other than testing
 *
 * # Returns
 *
 * A string containing a 24-word seed phrase
 * @returns {string}
 */
export function generate_seed_phrase() {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.generate_seed_phrase();
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

/**
 * Signs and applies signatures to a PCZT.
 * Should in a secure environment (e.g. Metamask snap).
 *
 * # Arguments
 *
 * * `pczt` - The PCZT that needs to signed
 * * `usk` - UnifiedSpendingKey used to sign the PCZT
 * * `seed_fp` - The fingerprint of the seed used to create `usk`
 * @param {string} network
 * @param {Pczt} pczt
 * @param {UnifiedSpendingKey} usk
 * @param {SeedFingerprint} seed_fp
 * @returns {Promise<Pczt>}
 */
export function pczt_sign(network, pczt, usk, seed_fp) {
    const ptr0 = passStringToWasm0(network, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    _assertClass(pczt, Pczt);
    var ptr1 = pczt.__destroy_into_raw();
    _assertClass(usk, UnifiedSpendingKey);
    var ptr2 = usk.__destroy_into_raw();
    _assertClass(seed_fp, SeedFingerprint);
    var ptr3 = seed_fp.__destroy_into_raw();
    const ret = wasm.pczt_sign(ptr0, len0, ptr1, ptr2, ptr3);
    return ret;
}

/**
 * Entry point for web workers
 * @param {number} ptr
 */
export function wasm_thread_entry_point(ptr) {
    wasm.wasm_thread_entry_point(ptr);
}

function __wbg_adapter_62(arg0, arg1, arg2) {
    wasm.closure1701_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_67(arg0, arg1, arg2) {
    wasm.closure1756_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_370(arg0, arg1, arg2, arg3) {
    wasm.closure3036_externref_shim(arg0, arg1, arg2, arg3);
}

const __wbindgen_enum_ReferrerPolicy = ["", "no-referrer", "no-referrer-when-downgrade", "origin", "origin-when-cross-origin", "unsafe-url", "same-origin", "strict-origin", "strict-origin-when-cross-origin"];

const __wbindgen_enum_RequestCache = ["default", "no-store", "reload", "no-cache", "force-cache", "only-if-cached"];

const __wbindgen_enum_RequestCredentials = ["omit", "same-origin", "include"];

const __wbindgen_enum_RequestMode = ["same-origin", "no-cors", "cors", "navigate"];

const __wbindgen_enum_RequestRedirect = ["follow", "error", "manual"];

const __wbindgen_enum_WorkerType = ["classic", "module"];

const BlockRangeFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_blockrange_free(ptr >>> 0, 1));

export class BlockRange {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BlockRangeFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_blockrange_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get 0() {
        const ret = wasm.__wbg_get_blockrange_0(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} arg0
     */
    set 0(arg0) {
        wasm.__wbg_set_blockrange_0(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get 1() {
        const ret = wasm.__wbg_get_blockrange_1(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} arg0
     */
    set 1(arg0) {
        wasm.__wbg_set_blockrange_1(this.__wbg_ptr, arg0);
    }
}

const IntoUnderlyingByteSourceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_intounderlyingbytesource_free(ptr >>> 0, 1));

export class IntoUnderlyingByteSource {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IntoUnderlyingByteSourceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_intounderlyingbytesource_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get type() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.intounderlyingbytesource_type(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    get autoAllocateChunkSize() {
        const ret = wasm.intounderlyingbytesource_autoAllocateChunkSize(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {ReadableByteStreamController} controller
     */
    start(controller) {
        wasm.intounderlyingbytesource_start(this.__wbg_ptr, controller);
    }
    /**
     * @param {ReadableByteStreamController} controller
     * @returns {Promise<any>}
     */
    pull(controller) {
        const ret = wasm.intounderlyingbytesource_pull(this.__wbg_ptr, controller);
        return ret;
    }
    cancel() {
        const ptr = this.__destroy_into_raw();
        wasm.intounderlyingbytesource_cancel(ptr);
    }
}

const IntoUnderlyingSinkFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_intounderlyingsink_free(ptr >>> 0, 1));

export class IntoUnderlyingSink {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IntoUnderlyingSinkFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_intounderlyingsink_free(ptr, 0);
    }
    /**
     * @param {any} chunk
     * @returns {Promise<any>}
     */
    write(chunk) {
        const ret = wasm.intounderlyingsink_write(this.__wbg_ptr, chunk);
        return ret;
    }
    /**
     * @returns {Promise<any>}
     */
    close() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.intounderlyingsink_close(ptr);
        return ret;
    }
    /**
     * @param {any} reason
     * @returns {Promise<any>}
     */
    abort(reason) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.intounderlyingsink_abort(ptr, reason);
        return ret;
    }
}

const IntoUnderlyingSourceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_intounderlyingsource_free(ptr >>> 0, 1));

export class IntoUnderlyingSource {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IntoUnderlyingSourceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_intounderlyingsource_free(ptr, 0);
    }
    /**
     * @param {ReadableStreamDefaultController} controller
     * @returns {Promise<any>}
     */
    pull(controller) {
        const ret = wasm.intounderlyingsource_pull(this.__wbg_ptr, controller);
        return ret;
    }
    cancel() {
        const ptr = this.__destroy_into_raw();
        wasm.intounderlyingsource_cancel(ptr);
    }
}

const PcztFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_pczt_free(ptr >>> 0, 1));

export class Pczt {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Pczt.prototype);
        obj.__wbg_ptr = ptr;
        PcztFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    static __unwrap(jsValue) {
        if (!(jsValue instanceof Pczt)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PcztFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_pczt_free(ptr, 0);
    }
    /**
     * Returns a JSON object with the details of the Pczt.
     * @returns {any}
     */
    to_json() {
        const ret = wasm.pczt_to_json(this.__wbg_ptr);
        return ret;
    }
    /**
     * Returns a Pczt from a JSON object
     * @param {any} s
     * @returns {Pczt}
     */
    static from_json(s) {
        const ret = wasm.pczt_from_json(s);
        return Pczt.__wrap(ret);
    }
    /**
     * Returns the postcard serialization of the Pczt.
     * @returns {Uint8Array}
     */
    serialize() {
        const ret = wasm.pczt_serialize(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * Deserialize to a Pczt from postcard bytes.
     * @param {Uint8Array} bytes
     * @returns {Pczt}
     */
    static from_bytes(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.pczt_from_bytes(ptr0, len0);
        return Pczt.__wrap(ret);
    }
}

const ProofGenerationKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_proofgenerationkey_free(ptr >>> 0, 1));
/**
 * A Zcash Sapling proof generation key
 *
 * This is a wrapper around the `sapling::ProofGenerationKey` type. It is used for generating proofs for Sapling PCZTs.
 */
export class ProofGenerationKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ProofGenerationKey.prototype);
        obj.__wbg_ptr = ptr;
        ProofGenerationKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ProofGenerationKeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_proofgenerationkey_free(ptr, 0);
    }
}

const ProposalFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_proposal_free(ptr >>> 0, 1));
/**
 * A handler to an immutable proposal. This can be passed to `create_proposed_transactions` to prove/authorize the transactions
 * before they are sent to the network.
 *
 * The proposal can be reviewed by calling `describe` which will return a JSON object with the details of the proposal.
 */
export class Proposal {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Proposal.prototype);
        obj.__wbg_ptr = ptr;
        ProposalFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ProposalFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_proposal_free(ptr, 0);
    }
}

const SeedFingerprintFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_seedfingerprint_free(ptr >>> 0, 1));
/**
 * A ZIP32 seed fingerprint. Essentially a Blake2b hash of the seed.
 *
 * This is a wrapper around the `zip32::fingerprint::SeedFingerprint` type.
 */
export class SeedFingerprint {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SeedFingerprint.prototype);
        obj.__wbg_ptr = ptr;
        SeedFingerprintFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SeedFingerprintFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_seedfingerprint_free(ptr, 0);
    }
    /**
     * Construct a new SeedFingerprint
     *
     * # Arguments
     *
     * * `seed` - At least 32 bytes of entry. Care should be taken as to how this is derived
     * @param {Uint8Array} seed
     */
    constructor(seed) {
        const ptr0 = passArray8ToWasm0(seed, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.seedfingerprint_new(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        SeedFingerprintFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
        const ret = wasm.seedfingerprint_to_bytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {SeedFingerprint}
     */
    static from_bytes(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.seedfingerprint_from_bytes(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return SeedFingerprint.__wrap(ret[0]);
    }
}

const UnifiedFullViewingKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_unifiedfullviewingkey_free(ptr >>> 0, 1));
/**
 * A Zcash viewing key
 *
 * This is a wrapper around the `zcash_keys::keys::ViewingKey` type.
 * UFVKs should be generated from a spending key by calling `to_unified_full_viewing_key`
 * They can also be encoded and decoded to a canonical string representation
 */
export class UnifiedFullViewingKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(UnifiedFullViewingKey.prototype);
        obj.__wbg_ptr = ptr;
        UnifiedFullViewingKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        UnifiedFullViewingKeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_unifiedfullviewingkey_free(ptr, 0);
    }
    /**
     * Encode the UFVK to a string
     *
     * # Arguments
     *
     * * `network` - Must be either "main" or "test"
     * @param {string} network
     * @returns {string}
     */
    encode(network) {
        let deferred3_0;
        let deferred3_1;
        try {
            const ptr0 = passStringToWasm0(network, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.unifiedfullviewingkey_encode(this.__wbg_ptr, ptr0, len0);
            var ptr2 = ret[0];
            var len2 = ret[1];
            if (ret[3]) {
                ptr2 = 0; len2 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
     * Construct a UFVK from its encoded string representation
     *
     * # Arguments
     *
     * * `network` - Must be either "main" or "test"
     * * `encoding` - The encoded string representation of the UFVK
     * @param {string} network
     * @param {string} encoding
     */
    constructor(network, encoding) {
        const ptr0 = passStringToWasm0(network, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(encoding, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.unifiedfullviewingkey_new(ptr0, len0, ptr1, len1);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        UnifiedFullViewingKeyFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}

const UnifiedSpendingKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_unifiedspendingkey_free(ptr >>> 0, 1));
/**
 * A Zcash spending key
 *
 * This is a wrapper around the `zcash_keys::keys::SpendingKey` type. It can be created from at least 32 bytes of seed entropy
 */
export class UnifiedSpendingKey {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        UnifiedSpendingKeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_unifiedspendingkey_free(ptr, 0);
    }
    /**
     * Construct a new UnifiedSpendingKey
     *
     * # Arguments
     *
     * * `network` - Must be either "main" or "test"
     * * `seed` - At least 32 bytes of entry. Care should be taken as to how this is derived
     * * `hd_index` - [ZIP32](https://zips.z.cash/zip-0032) hierarchical deterministic index of the account
     * @param {string} network
     * @param {Uint8Array} seed
     * @param {number} hd_index
     */
    constructor(network, seed, hd_index) {
        const ptr0 = passStringToWasm0(network, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(seed, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.unifiedspendingkey_new(ptr0, len0, ptr1, len1, hd_index);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        UnifiedSpendingKeyFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Obtain the UFVK corresponding to this spending key
     * @returns {UnifiedFullViewingKey}
     */
    to_unified_full_viewing_key() {
        const ret = wasm.unifiedspendingkey_to_unified_full_viewing_key(this.__wbg_ptr);
        return UnifiedFullViewingKey.__wrap(ret);
    }
    /**
     * @returns {ProofGenerationKey}
     */
    to_sapling_proof_generation_key() {
        const ret = wasm.unifiedspendingkey_to_sapling_proof_generation_key(this.__wbg_ptr);
        return ProofGenerationKey.__wrap(ret);
    }
}

const WalletSummaryFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_walletsummary_free(ptr >>> 0, 1));

export class WalletSummary {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WalletSummary.prototype);
        obj.__wbg_ptr = ptr;
        WalletSummaryFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    toJSON() {
        return {
            chain_tip_height: this.chain_tip_height,
            fully_scanned_height: this.fully_scanned_height,
            next_sapling_subtree_index: this.next_sapling_subtree_index,
            next_orchard_subtree_index: this.next_orchard_subtree_index,
            account_balances: this.account_balances,
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WalletSummaryFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_walletsummary_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get chain_tip_height() {
        const ret = wasm.__wbg_get_walletsummary_chain_tip_height(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} arg0
     */
    set chain_tip_height(arg0) {
        wasm.__wbg_set_walletsummary_chain_tip_height(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get fully_scanned_height() {
        const ret = wasm.__wbg_get_walletsummary_fully_scanned_height(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} arg0
     */
    set fully_scanned_height(arg0) {
        wasm.__wbg_set_walletsummary_fully_scanned_height(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {bigint}
     */
    get next_sapling_subtree_index() {
        const ret = wasm.__wbg_get_walletsummary_next_sapling_subtree_index(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} arg0
     */
    set next_sapling_subtree_index(arg0) {
        wasm.__wbg_set_walletsummary_next_sapling_subtree_index(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {bigint}
     */
    get next_orchard_subtree_index() {
        const ret = wasm.__wbg_get_walletsummary_next_orchard_subtree_index(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} arg0
     */
    set next_orchard_subtree_index(arg0) {
        wasm.__wbg_set_walletsummary_next_orchard_subtree_index(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {any}
     */
    get account_balances() {
        const ret = wasm.walletsummary_account_balances(this.__wbg_ptr);
        return ret;
    }
}

const WebWalletFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_webwallet_free(ptr >>> 0, 1));
/**
 * # A Zcash wallet
 *
 * This is the main entry point for interacting with this library.
 * For the most part you will only need to create and interact with a Wallet instance.
 *
 * A wallet is a set of accounts that can be synchronized together with the blockchain.
 * Once synchronized, the wallet can be used to propose, build and send transactions.
 *
 * Create a new WebWallet with
 * ```javascript
 * const wallet = new WebWallet("main", "https://zcash-mainnet.chainsafe.dev", 10);
 * ```
 *
 * ## Adding Accounts
 *
 * Accounts can be added by either importing a seed phrase or a Unified Full Viewing Key (UFVK).
 * If you do import via a UFVK it is important that you also have access to the Unified Spending Key (USK) for that account otherwise the wallet will not be able to create transactions.
 *
 * When importing an account you can also specify the block height at which the account was created. This can significantly reduce the time it takes to sync the account as the wallet will only scan for transactions after this height.
 * Failing to provide a birthday height will result in extremely slow sync times as the wallet will need to scan the entire blockchain.
 *
 * e.g.
 * ```javascript
 * const account_id = await wallet.create_account("...", 1, 2657762)
 *
 * // OR
 *
 * const account_id = await wallet.import_ufvk("...", 2657762)
 * ``
 *
 * ## Synchronizing
 *
 * The wallet can be synchronized with the blockchain by calling the `sync` method. This will fetch compact blocks from the connected lightwalletd instance and scan them for transactions.
 * The sync method uses a built-in strategy to determine which blocks is needs to download and scan in order to gain full knowledge of the balances for all accounts that are managed.
 *
 * Syncing is a long running process and so is delegated to a WebWorker to prevent from blocking the main thread. It is safe to call other methods on the wallet during syncing although they may take
 * longer than usual while they wait for a write-lock to be released.
 *
 * ```javascript
 * await wallet.sync();
 * ```
 *
 * ## Transacting
 *
 * Sending a transaction is a three step process: proposing, authorizing, and sending.
 *
 * A transaction proposal is created by calling `propose_transfer` with the intended recipient and amount. This will create a proposal object that describes which notes will be spent in order to fulfil this request.
 * The proposal should be presented to the user for review before being authorized.
 *
 * To authorize the transaction the caller must currently provide the seed phrase and account index of the account that will be used to sign the transaction. This method also perform the SNARK proving which is an expensive operation and performed in parallel by a series of WebWorkers.
 *
 * Finally, A transaction can be sent to the network by calling `send_authorized_transactions` with the list of transaction IDs that were generated by the authorization step.
 *
 * ## PCZT Transactions
 *
 * PCZT (Partially Constructed Zcash Transaction)
 *
 * 1. **`pczt_create`** - Creates a PCZT which designates how funds from this account can be spent to realize the requested transfer (does NOT sign, generate proofs, or send)
 * 2. **`pczt_sign`** - Signs the PCZT using USK (should be done in secure environment)
 * 3. **`pczt_prove`** - Creates and inserts proofs for the PCZT
 *
 * The full flow looks like
 * The full PCZT flow: `pczt_create` → `pczt_sign` → `pczt_prove` → `pczt_send`
 * ```
 */
export class WebWallet {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WebWalletFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_webwallet_free(ptr, 0);
    }
    /**
     * Create a new instance of a Zcash wallet for a given network. Only one instance should be created per page.
     *
     * # Arguments
     *
     * * `network` - Must be one of "main" or "test"
     * * `lightwalletd_url` - Url of the lightwalletd instance to connect to (e.g. https://zcash-mainnet.chainsafe.dev)
     * * `min_confirmations` - Number of confirmations required before a transaction is considered final
     * * `db_bytes` - (Optional) UInt8Array of a serialized wallet database. This can be used to restore a wallet from a previous session that was serialized by `db_to_bytes`
     *
     * # Examples
     *
     * ```javascript
     * const wallet = new WebWallet("main", "https://zcash-mainnet.chainsafe.dev", 10);
     * ```
     * @param {string} network
     * @param {string} lightwalletd_url
     * @param {number} min_confirmations
     * @param {Uint8Array | null} [db_bytes]
     */
    constructor(network, lightwalletd_url, min_confirmations, db_bytes) {
        const ptr0 = passStringToWasm0(network, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(lightwalletd_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        var ptr2 = isLikeNone(db_bytes) ? 0 : passArray8ToWasm0(db_bytes, wasm.__wbindgen_malloc);
        var len2 = WASM_VECTOR_LEN;
        const ret = wasm.webwallet_new(ptr0, len0, ptr1, len1, min_confirmations, ptr2, len2);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        WebWalletFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Add a new account to the wallet using a given seed phrase
     *
     * # Arguments
     *
     * * `seed_phrase` - 24 word mnemonic seed phrase
     * * `account_hd_index` - [ZIP32](https://zips.z.cash/zip-0032) hierarchical deterministic index of the account
     * * `birthday_height` - Block height at which the account was created. The sync logic will assume no funds are send or received prior to this height which can VERY significantly reduce sync time
     *
     * # Examples
     *
     * ```javascript
     * const wallet = new WebWallet("main", "https://zcash-mainnet.chainsafe.dev", 10);
     * const account_id = await wallet.create_account("...", 1, 2657762)
     * ```
     * @param {string} account_name
     * @param {string} seed_phrase
     * @param {number} account_hd_index
     * @param {number | null} [birthday_height]
     * @returns {Promise<number>}
     */
    create_account(account_name, seed_phrase, account_hd_index, birthday_height) {
        const ptr0 = passStringToWasm0(account_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(seed_phrase, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.webwallet_create_account(this.__wbg_ptr, ptr0, len0, ptr1, len1, account_hd_index, isLikeNone(birthday_height) ? 0x100000001 : (birthday_height) >>> 0);
        return ret;
    }
    /**
     * Add a new account to the wallet by directly importing a Unified Full Viewing Key (UFVK)
     *
     * # Arguments
     *
     * * `key` - [ZIP316](https://zips.z.cash/zip-0316) encoded UFVK
     * * `birthday_height` - Block height at which the account was created. The sync logic will assume no funds are send or received prior to this height which can VERY significantly reduce sync time
     *
     * # Examples
     *
     * ```javascript
     * const wallet = new WebWallet("main", "https://zcash-mainnet.chainsafe.dev", 10);
     * const account_id = await wallet.import_ufvk("...", 2657762)
     * ```
     * @param {string} account_name
     * @param {string} encoded_ufvk
     * @param {SeedFingerprint} seed_fingerprint
     * @param {number} account_hd_index
     * @param {number | null} [birthday_height]
     * @returns {Promise<number>}
     */
    create_account_ufvk(account_name, encoded_ufvk, seed_fingerprint, account_hd_index, birthday_height) {
        const ptr0 = passStringToWasm0(account_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(encoded_ufvk, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        _assertClass(seed_fingerprint, SeedFingerprint);
        var ptr2 = seed_fingerprint.__destroy_into_raw();
        const ret = wasm.webwallet_create_account_ufvk(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, account_hd_index, isLikeNone(birthday_height) ? 0x100000001 : (birthday_height) >>> 0);
        return ret;
    }
    /**
     * Add a new view-only account to the wallet by directly importing a Unified Full Viewing Key (UFVK)
     *
     * # Arguments
     *
     * * `key` - [ZIP316](https://zips.z.cash/zip-0316) encoded UFVK
     * * `birthday_height` - Block height at which the account was created. The sync logic will assume no funds are send or received prior to this height which can VERY significantly reduce sync time
     *
     * # Examples
     *
     * ```javascript
     * const wallet = new WebWallet("main", "https://zcash-mainnet.chainsafe.dev", 10);
     * const account_id = await wallet.import_ufvk("...", 2657762)
     * ```
     * @param {string} account_name
     * @param {string} encoded_ufvk
     * @param {number | null} [birthday_height]
     * @returns {Promise<number>}
     */
    create_account_view_ufvk(account_name, encoded_ufvk, birthday_height) {
        const ptr0 = passStringToWasm0(account_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(encoded_ufvk, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.webwallet_create_account_view_ufvk(this.__wbg_ptr, ptr0, len0, ptr1, len1, isLikeNone(birthday_height) ? 0x100000001 : (birthday_height) >>> 0);
        return ret;
    }
    /**
     *
     * Start a background sync task which will fetch and scan blocks from the connected lighwalletd server
     *
     * IMPORTANT: This will spawn a new webworker which will handle the sync task. The sync task will continue to run in the background until the sync process is complete.
     * During this time the main thread will not block but certain wallet methods may temporarily block while the wallet is being written to during the sync.
     * @returns {Promise<void>}
     */
    sync() {
        const ret = wasm.webwallet_sync(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Promise<WalletSummary | undefined>}
     */
    get_wallet_summary() {
        const ret = wasm.webwallet_get_wallet_summary(this.__wbg_ptr);
        return ret;
    }
    /**
     * Create a new transaction proposal to send funds to a given address
     *
     * Not this does NOT sign, generate a proof, or send the transaction. It will only craft the proposal which designates how notes from this account can be spent to realize the requested transfer.
     *
     * # Arguments
     *
     * * `account_id` - The ID of the account in this wallet to send funds from
     * * `to_address` - [ZIP316](https://zips.z.cash/zip-0316) encoded address to send funds to
     * * `value` - Amount to send in Zatoshis (1 ZEC = 100_000_000 Zatoshis)
     *
     * # Returns
     *
     * A proposal object which can be inspected and later used to generate a valid transaction
     *
     * # Examples
     *
     * ```javascript
     * const proposal = await wallet.propose_transfer(1, "u18rakpts0de589sx9dkamcjms3apruqqax9k2s6e7zjxx9vv5kc67pks2trg9d3nrgd5acu8w8arzjjuepakjx38dyxl6ahd948w0mhdt9jxqsntan6px3ysz80s04a87pheg2mqvlzpehrgup7568nfd6ez23xd69ley7802dfvplnfn7c07vlyumcnfjul4pvv630ac336rjhjyak5", 100000000);
     * ```
     * @param {number} account_id
     * @param {string} to_address
     * @param {bigint} value
     * @returns {Promise<Proposal>}
     */
    propose_transfer(account_id, to_address, value) {
        const ptr0 = passStringToWasm0(to_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.webwallet_propose_transfer(this.__wbg_ptr, account_id, ptr0, len0, value);
        return ret;
    }
    /**
     * Generate a valid Zcash transaction from a given proposal
     *
     * IMPORTANT: This will spawn a new webworker which will handle the proving task which may take 10s of seconds
     *
     * # Arguments
     *
     * * `proposal` - A proposal object generated by `propose_transfer`
     * * `seed_phrase` - 24 word mnemonic seed phrase. This MUST correspond to the accountID used when creating the proposal.
     * * `account_hd_index` - [ZIP32](https://zips.z.cash/zip-0032) hierarchical deterministic index of the account. This MUST correspond to the accountID used when creating the proposal.
     *
     * # Returns
     *
     * A list of transaction IDs which can be used to track the status of the transaction on the network.
     * It is returned in a flattened form where each ID is 32 bytes.
     * The transactions themselves are stored within the wallet.
     *
     * # Examples
     *
     * ```javascript
     * const proposal = await wallet.propose_transfer(1, "u18rakpts0de589sx9dkamcjms3apruqqax9k2s6e7zjxx9vv5kc67pks2trg9d3nrgd5acu8w8arzjjuepakjx38dyxl6ahd948w0mhdt9jxqsntan6px3ysz80s04a87pheg2mqvlzpehrgup7568nfd6ez23xd69ley7802dfvplnfn7c07vlyumcnfjul4pvv630ac336rjhjyak5", 100000000);
     * const authorized_txns = await wallet.create_proposed_transactions(proposal, "...", 1);
     * ```
     * @param {Proposal} proposal
     * @param {string} seed_phrase
     * @param {number} account_hd_index
     * @returns {Promise<Uint8Array>}
     */
    create_proposed_transactions(proposal, seed_phrase, account_hd_index) {
        _assertClass(proposal, Proposal);
        var ptr0 = proposal.__destroy_into_raw();
        const ptr1 = passStringToWasm0(seed_phrase, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.webwallet_create_proposed_transactions(this.__wbg_ptr, ptr0, ptr1, len1, account_hd_index);
        return ret;
    }
    /**
     * Serialize the internal wallet database to bytes
     *
     * This should be used for persisting the wallet between sessions. The resulting byte array can be used to construct a new wallet instance.
     * Note this method is async and will block until a read-lock can be acquired on the wallet database
     *
     * # Returns
     *
     * A postcard encoded byte array of the wallet database
     * @returns {Promise<Uint8Array>}
     */
    db_to_bytes() {
        const ret = wasm.webwallet_db_to_bytes(this.__wbg_ptr);
        return ret;
    }
    /**
     * Send a list of authorized transactions to the network to be included in the blockchain
     *
     * These will be sent via the connected lightwalletd instance
     *
     * # Arguments
     *
     * * `txids` - A list of transaction IDs (typically generated by `create_proposed_transactions`). It is in flatten form which means it's just a concatination of the 32 byte IDs.
     *
     * # Examples
     *
     * ```javascript
     * const proposal = wallet.propose_transfer(1, "u18rakpts0de589sx9dkamcjms3apruqqax9k2s6e7zjxx9vv5kc67pks2trg9d3nrgd5acu8w8arzjjuepakjx38dyxl6ahd948w0mhdt9jxqsntan6px3ysz80s04a87pheg2mqvlzpehrgup7568nfd6ez23xd69ley7802dfvplnfn7c07vlyumcnfjul4pvv630ac336rjhjyak5", 100000000);
     * const authorized_txns = wallet.create_proposed_transactions(proposal, "...", 1);
     * await wallet.send_authorized_transactions(authorized_txns);
     * ```
     * @param {Uint8Array} txids
     * @returns {Promise<void>}
     */
    send_authorized_transactions(txids) {
        const ptr0 = passArray8ToWasm0(txids, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.webwallet_send_authorized_transactions(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * Get the current unified address for a given account. This is returned as a string in canonical encoding
     *
     * # Arguments
     *
     * * `account_id` - The ID of the account to get the address for
     * @param {number} account_id
     * @returns {Promise<string>}
     */
    get_current_address(account_id) {
        const ret = wasm.webwallet_get_current_address(this.__wbg_ptr, account_id);
        return ret;
    }
    /**
     * Create a Shielding PCZT (Partially Constructed Zcash Transaction).
     *
     * A Proposal for shielding funds is created and the the PCZT is constructed for it
     *
     * # Arguments
     *
     * * `account_id` - The ID of the account which transparent funds will be shielded.
     * @param {number} account_id
     * @returns {Promise<Pczt>}
     */
    pczt_shield(account_id) {
        const ret = wasm.webwallet_pczt_shield(this.__wbg_ptr, account_id);
        return ret;
    }
    /**
     * Creates a PCZT (Partially Constructed Zcash Transaction).
     *
     * A Proposal is created similar to `create_proposed_transactions` and then a PCZT is constructed from it.
     * Note: This does NOT sign, generate a proof, or send the transaction.
     * It will only craft the PCZT which designates how notes from this account can be spent to realize the requested transfer.
     * The PCZT will still need to be signed and proofs will need to be generated before sending.
     *
     * # Arguments
     *
     * * `account_id` - The ID of the account in this wallet to send funds from
     * * `to_address` - [ZIP316](https://zips.z.cash/zip-0316) encoded address to send funds to
     * * `value` - Amount to send in Zatoshis (1 ZEC = 100_000_000 Zatoshis)
     * @param {number} account_id
     * @param {string} to_address
     * @param {bigint} value
     * @returns {Promise<Pczt>}
     */
    pczt_create(account_id, to_address, value) {
        const ptr0 = passStringToWasm0(to_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.webwallet_pczt_create(this.__wbg_ptr, account_id, ptr0, len0, value);
        return ret;
    }
    /**
     * Creates and inserts proofs for a PCZT.
     *
     * If there are Sapling spends, a ProofGenerationKey needs to be supplied. It can be derived from the UFVK.
     *
     * # Arguments
     *
     * * `pczt` - The PCZT that needs to be signed
     * * `sapling_proof_gen_key` - The Sapling proof generation key (needed only if there are Sapling spends)
     * @param {Pczt} pczt
     * @param {ProofGenerationKey | null} [sapling_proof_gen_key]
     * @returns {Promise<Pczt>}
     */
    pczt_prove(pczt, sapling_proof_gen_key) {
        _assertClass(pczt, Pczt);
        var ptr0 = pczt.__destroy_into_raw();
        let ptr1 = 0;
        if (!isLikeNone(sapling_proof_gen_key)) {
            _assertClass(sapling_proof_gen_key, ProofGenerationKey);
            ptr1 = sapling_proof_gen_key.__destroy_into_raw();
        }
        const ret = wasm.webwallet_pczt_prove(this.__wbg_ptr, ptr0, ptr1);
        return ret;
    }
    /**
     * @param {Pczt} pczt
     * @returns {Promise<void>}
     */
    pczt_send(pczt) {
        _assertClass(pczt, Pczt);
        var ptr0 = pczt.__destroy_into_raw();
        const ret = wasm.webwallet_pczt_send(this.__wbg_ptr, ptr0);
        return ret;
    }
    /**
     * @param {Pczt[]} pczts
     * @returns {Pczt}
     */
    pczt_combine(pczts) {
        const ptr0 = passArrayJsValueToWasm0(pczts, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.webwallet_pczt_combine(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Pczt.__wrap(ret[0]);
    }
    /**
     * Get the current unified address for a given account and extracts the transparent component. This is returned as a string in canonical encoding
     *
     * # Arguments
     *
     * * `account_id` - The ID of the account to get the address for
     * @param {number} account_id
     * @returns {Promise<string>}
     */
    get_current_address_transparent(account_id) {
        const ret = wasm.webwallet_get_current_address_transparent(this.__wbg_ptr, account_id);
        return ret;
    }
    /**
     *
     * Get the highest known block height from the connected lightwalletd instance
     * @returns {Promise<bigint>}
     */
    get_latest_block() {
        const ret = wasm.webwallet_get_latest_block(this.__wbg_ptr);
        return ret;
    }
}

const wbg_rayon_PoolBuilderFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wbg_rayon_poolbuilder_free(ptr >>> 0, 1));

export class wbg_rayon_PoolBuilder {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(wbg_rayon_PoolBuilder.prototype);
        obj.__wbg_ptr = ptr;
        wbg_rayon_PoolBuilderFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        wbg_rayon_PoolBuilderFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wbg_rayon_poolbuilder_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    numThreads() {
        const ret = wasm.wbg_rayon_poolbuilder_numThreads(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    receiver() {
        const ret = wasm.wbg_rayon_poolbuilder_receiver(this.__wbg_ptr);
        return ret >>> 0;
    }
    build() {
        wasm.wbg_rayon_poolbuilder_build(this.__wbg_ptr);
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_append_8c7dd8d641a5f01b = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.append(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_async_9ff6d9e405f13772 = function(arg0) {
        const ret = arg0.async;
        return ret;
    };
    imports.wbg.__wbg_body_0b8fd1fe671660df = function(arg0) {
        const ret = arg0.body;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_buffer_09165b52af8c5237 = function(arg0) {
        const ret = arg0.buffer;
        return ret;
    };
    imports.wbg.__wbg_buffer_609cc3eee51ed158 = function(arg0) {
        const ret = arg0.buffer;
        return ret;
    };
    imports.wbg.__wbg_byobRequest_77d9adf63337edfb = function(arg0) {
        const ret = arg0.byobRequest;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_byteLength_e674b853d9c77e1d = function(arg0) {
        const ret = arg0.byteLength;
        return ret;
    };
    imports.wbg.__wbg_byteOffset_fd862df290ef848d = function(arg0) {
        const ret = arg0.byteOffset;
        return ret;
    };
    imports.wbg.__wbg_call_672a4d21634d4a24 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.call(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_call_7cccdd69e0791ae2 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.call(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_cancel_8a308660caa6cadf = function(arg0) {
        const ret = arg0.cancel();
        return ret;
    };
    imports.wbg.__wbg_catch_a6e601879b2610e9 = function(arg0, arg1) {
        const ret = arg0.catch(arg1);
        return ret;
    };
    imports.wbg.__wbg_close_304cc1fef3466669 = function() { return handleError(function (arg0) {
        arg0.close();
    }, arguments) };
    imports.wbg.__wbg_close_5ce03e29be453811 = function() { return handleError(function (arg0) {
        arg0.close();
    }, arguments) };
    imports.wbg.__wbg_createObjectURL_6e98d2f9c7bd9764 = function() { return handleError(function (arg0, arg1) {
        const ret = URL.createObjectURL(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_create_cfe43ccc88c64e0a = function(arg0) {
        const ret = Object.create(arg0);
        return ret;
    };
    imports.wbg.__wbg_crypto_ed58b8e10a292839 = function(arg0) {
        const ret = arg0.crypto;
        return ret;
    };
    imports.wbg.__wbg_data_432d9c3df2630942 = function(arg0) {
        const ret = arg0.data;
        return ret;
    };
    imports.wbg.__wbg_debug_3cb59063b29f58c1 = function(arg0) {
        console.debug(arg0);
    };
    imports.wbg.__wbg_debug_e17b51583ca6a632 = function(arg0, arg1, arg2, arg3) {
        console.debug(arg0, arg1, arg2, arg3);
    };
    imports.wbg.__wbg_done_769e5ede4b31c67b = function(arg0) {
        const ret = arg0.done;
        return ret;
    };
    imports.wbg.__wbg_done_9e178b857484d3df = function(arg0) {
        const ret = arg0.done;
        return ret;
    };
    imports.wbg.__wbg_enqueue_bb16ba72f537dc9e = function() { return handleError(function (arg0, arg1) {
        arg0.enqueue(arg1);
    }, arguments) };
    imports.wbg.__wbg_entries_3265d4158b33e5dc = function(arg0) {
        const ret = Object.entries(arg0);
        return ret;
    };
    imports.wbg.__wbg_error_524f506f44df1645 = function(arg0) {
        console.error(arg0);
    };
    imports.wbg.__wbg_error_7534b8e9a36f1ab4 = function(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_error_80de38b3f7cc3c3c = function(arg0, arg1, arg2, arg3) {
        console.error(arg0, arg1, arg2, arg3);
    };
    imports.wbg.__wbg_eval_e10dc02e9547f640 = function() { return handleError(function (arg0, arg1) {
        const ret = eval(getStringFromWasm0(arg0, arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_fetch_07cd86dd296a5a63 = function(arg0, arg1, arg2) {
        const ret = arg0.fetch(arg1, arg2);
        return ret;
    };
    imports.wbg.__wbg_fetch_3079ee47bab2b144 = function(arg0, arg1) {
        const ret = fetch(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbg_getRandomValues_bcb4912f16000dc4 = function() { return handleError(function (arg0, arg1) {
        arg0.getRandomValues(arg1);
    }, arguments) };
    imports.wbg.__wbg_getReader_f5255c829ee10d2f = function() { return handleError(function (arg0) {
        const ret = arg0.getReader();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getTime_46267b1c24877e30 = function(arg0) {
        const ret = arg0.getTime();
        return ret;
    };
    imports.wbg.__wbg_get_67b2ba62fc30de12 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.get(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_get_b9b93047fe3cf45b = function(arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return ret;
    };
    imports.wbg.__wbg_getwithrefkey_1dc361bd10053bfe = function(arg0, arg1) {
        const ret = arg0[arg1];
        return ret;
    };
    imports.wbg.__wbg_has_a5ea9117f258a0ec = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.has(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_headers_9cb51cfd2ac780a4 = function(arg0) {
        const ret = arg0.headers;
        return ret;
    };
    imports.wbg.__wbg_info_033d8b8a0838f1d3 = function(arg0, arg1, arg2, arg3) {
        console.info(arg0, arg1, arg2, arg3);
    };
    imports.wbg.__wbg_info_3daf2e093e091b66 = function(arg0) {
        console.info(arg0);
    };
    imports.wbg.__wbg_instanceof_ArrayBuffer_e14585432e3737fc = function(arg0) {
        let result;
        try {
            result = arg0 instanceof ArrayBuffer;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_DedicatedWorkerGlobalScope_a688e81380e34e02 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof DedicatedWorkerGlobalScope;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Uint8Array_17156bcf118086a9 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Uint8Array;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Window_def73ea0955fc569 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Window;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_WorkerGlobalScope_dbdbdea7e3b56493 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof WorkerGlobalScope;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_isArray_a1eab7e0d067391b = function(arg0) {
        const ret = Array.isArray(arg0);
        return ret;
    };
    imports.wbg.__wbg_isSafeInteger_343e2beeeece1bb0 = function(arg0) {
        const ret = Number.isSafeInteger(arg0);
        return ret;
    };
    imports.wbg.__wbg_iterator_9a24c88df860dc65 = function() {
        const ret = Symbol.iterator;
        return ret;
    };
    imports.wbg.__wbg_length_a446193dc22c12f8 = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_length_e2d2a49132c1b256 = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_log_c222819a41e063d3 = function(arg0) {
        console.log(arg0);
    };
    imports.wbg.__wbg_mark_05056c522bddc362 = function() { return handleError(function (arg0, arg1, arg2) {
        arg0.mark(getStringFromWasm0(arg1, arg2));
    }, arguments) };
    imports.wbg.__wbg_mark_24a1a597f4f00679 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.mark(getStringFromWasm0(arg1, arg2), arg3);
    }, arguments) };
    imports.wbg.__wbg_measure_0b7379f5cfacac6d = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        arg0.measure(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4), getStringFromWasm0(arg5, arg6));
    }, arguments) };
    imports.wbg.__wbg_measure_7728846525e2cced = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.measure(getStringFromWasm0(arg1, arg2), arg3);
    }, arguments) };
    imports.wbg.__wbg_msCrypto_0a36e2ec3a343d26 = function(arg0) {
        const ret = arg0.msCrypto;
        return ret;
    };
    imports.wbg.__wbg_new0_f788a2397c7ca929 = function() {
        const ret = new Date();
        return ret;
    };
    imports.wbg.__wbg_new_018dcc2d6c8c2f6a = function() { return handleError(function () {
        const ret = new Headers();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_23a2665fac83c611 = function(arg0, arg1) {
        try {
            var state0 = {a: arg0, b: arg1};
            var cb0 = (arg0, arg1) => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return __wbg_adapter_370(a, state0.b, arg0, arg1);
                } finally {
                    state0.a = a;
                }
            };
            const ret = new Promise(cb0);
            return ret;
        } finally {
            state0.a = state0.b = 0;
        }
    };
    imports.wbg.__wbg_new_405e22f390576ce2 = function() {
        const ret = new Object();
        return ret;
    };
    imports.wbg.__wbg_new_5e0be73521bc8c17 = function() {
        const ret = new Map();
        return ret;
    };
    imports.wbg.__wbg_new_78feb108b6472713 = function() {
        const ret = new Array();
        return ret;
    };
    imports.wbg.__wbg_new_8a6f238a6ece86ea = function() {
        const ret = new Error();
        return ret;
    };
    imports.wbg.__wbg_new_a12002a7f91c75be = function(arg0) {
        const ret = new Uint8Array(arg0);
        return ret;
    };
    imports.wbg.__wbg_new_b1a33e5095abf678 = function() { return handleError(function (arg0, arg1) {
        const ret = new Worker(getStringFromWasm0(arg0, arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_c68d7209be747379 = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_new_e9a4a67dbababe57 = function(arg0) {
        const ret = new Int32Array(arg0);
        return ret;
    };
    imports.wbg.__wbg_newnoargs_105ed471475aaf50 = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_d97e637ebe145a9a = function(arg0, arg1, arg2) {
        const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithlength_a381634e90c276d4 = function(arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithstrandinit_06c535e0a867c635 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = new Request(getStringFromWasm0(arg0, arg1), arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_newwithstrsequence_a242b062eda81d0b = function() { return handleError(function (arg0) {
        const ret = new Blob(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_next_25feadfc0913fea9 = function(arg0) {
        const ret = arg0.next;
        return ret;
    };
    imports.wbg.__wbg_next_6574e1a8a62d1055 = function() { return handleError(function (arg0) {
        const ret = arg0.next();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_node_02999533c4ea02e3 = function(arg0) {
        const ret = arg0.node;
        return ret;
    };
    imports.wbg.__wbg_of_4a05197bfc89556f = function(arg0, arg1, arg2) {
        const ret = Array.of(arg0, arg1, arg2);
        return ret;
    };
    imports.wbg.__wbg_pczt_new = function(arg0) {
        const ret = Pczt.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_pczt_unwrap = function(arg0) {
        const ret = Pczt.__unwrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_performance_121b9855d716e029 = function() {
        const ret = globalThis.performance;
        return ret;
    };
    imports.wbg.__wbg_postMessage_6edafa8f7b9c2f52 = function() { return handleError(function (arg0, arg1) {
        arg0.postMessage(arg1);
    }, arguments) };
    imports.wbg.__wbg_postMessage_83a8d58d3fcb6c13 = function() { return handleError(function (arg0, arg1) {
        arg0.postMessage(arg1);
    }, arguments) };
    imports.wbg.__wbg_process_5c1d670bc53614b8 = function(arg0) {
        const ret = arg0.process;
        return ret;
    };
    imports.wbg.__wbg_proposal_new = function(arg0) {
        const ret = Proposal.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_push_737cfc8c1432c2c6 = function(arg0, arg1) {
        const ret = arg0.push(arg1);
        return ret;
    };
    imports.wbg.__wbg_queueMicrotask_97d92b4fcc8a61c5 = function(arg0) {
        queueMicrotask(arg0);
    };
    imports.wbg.__wbg_queueMicrotask_d3219def82552485 = function(arg0) {
        const ret = arg0.queueMicrotask;
        return ret;
    };
    imports.wbg.__wbg_randomFillSync_ab2cfe79ebbf2740 = function() { return handleError(function (arg0, arg1) {
        arg0.randomFillSync(arg1);
    }, arguments) };
    imports.wbg.__wbg_random_3ad904d98382defe = function() {
        const ret = Math.random();
        return ret;
    };
    imports.wbg.__wbg_read_a2434af1186cb56c = function(arg0) {
        const ret = arg0.read();
        return ret;
    };
    imports.wbg.__wbg_releaseLock_091899af97991d2e = function(arg0) {
        arg0.releaseLock();
    };
    imports.wbg.__wbg_require_79b1e9274cde3c87 = function() { return handleError(function () {
        const ret = module.require;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_resolve_4851785c9c5f573d = function(arg0) {
        const ret = Promise.resolve(arg0);
        return ret;
    };
    imports.wbg.__wbg_respond_1f279fa9f8edcb1c = function() { return handleError(function (arg0, arg1) {
        arg0.respond(arg1 >>> 0);
    }, arguments) };
    imports.wbg.__wbg_set_37837023f3d740e8 = function(arg0, arg1, arg2) {
        arg0[arg1 >>> 0] = arg2;
    };
    imports.wbg.__wbg_set_3f1d0b984ed272ed = function(arg0, arg1, arg2) {
        arg0[arg1] = arg2;
    };
    imports.wbg.__wbg_set_65595bdd868b3009 = function(arg0, arg1, arg2) {
        arg0.set(arg1, arg2 >>> 0);
    };
    imports.wbg.__wbg_set_8fc6bf8a5b1071d1 = function(arg0, arg1, arg2) {
        const ret = arg0.set(arg1, arg2);
        return ret;
    };
    imports.wbg.__wbg_set_bb8cecf6a62b9f46 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = Reflect.set(arg0, arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_setbody_5923b78a95eedf29 = function(arg0, arg1) {
        arg0.body = arg1;
    };
    imports.wbg.__wbg_setcache_12f17c3a980650e4 = function(arg0, arg1) {
        arg0.cache = __wbindgen_enum_RequestCache[arg1];
    };
    imports.wbg.__wbg_setcredentials_c3a22f1cd105a2c6 = function(arg0, arg1) {
        arg0.credentials = __wbindgen_enum_RequestCredentials[arg1];
    };
    imports.wbg.__wbg_setheaders_834c0bdb6a8949ad = function(arg0, arg1) {
        arg0.headers = arg1;
    };
    imports.wbg.__wbg_setintegrity_564a2397cf837760 = function(arg0, arg1, arg2) {
        arg0.integrity = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setmethod_3c5280fe5d890842 = function(arg0, arg1, arg2) {
        arg0.method = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setmode_5dc300b865044b65 = function(arg0, arg1) {
        arg0.mode = __wbindgen_enum_RequestMode[arg1];
    };
    imports.wbg.__wbg_setname_73878b09a5ee3d0c = function(arg0, arg1, arg2) {
        arg0.name = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setonerror_57eeef5feb01fe7a = function(arg0, arg1) {
        arg0.onerror = arg1;
    };
    imports.wbg.__wbg_setonmessage_5a885b16bdc6dca6 = function(arg0, arg1) {
        arg0.onmessage = arg1;
    };
    imports.wbg.__wbg_setonmessageerror_9c25f59c328a0274 = function(arg0, arg1) {
        arg0.onmessageerror = arg1;
    };
    imports.wbg.__wbg_setredirect_40e6a7f717a2f86a = function(arg0, arg1) {
        arg0.redirect = __wbindgen_enum_RequestRedirect[arg1];
    };
    imports.wbg.__wbg_setreferrer_fea46c1230e5e29a = function(arg0, arg1, arg2) {
        arg0.referrer = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setreferrerpolicy_b73612479f761b6f = function(arg0, arg1) {
        arg0.referrerPolicy = __wbindgen_enum_ReferrerPolicy[arg1];
    };
    imports.wbg.__wbg_settype_47fae7d6c82625e7 = function(arg0, arg1) {
        arg0.type = __wbindgen_enum_WorkerType[arg1];
    };
    imports.wbg.__wbg_size_3808d41635a9c259 = function(arg0) {
        const ret = arg0.size;
        return ret;
    };
    imports.wbg.__wbg_slice_8c197bf0b6dfc84a = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        const ret = arg0.slice(arg1, arg2, getStringFromWasm0(arg3, arg4));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_stack_0ed75d68575b0f3c = function(arg0, arg1) {
        const ret = arg1.stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_startWorkers_2ca11761e08ff5d5 = function(arg0, arg1, arg2) {
        const ret = startWorkers(arg0, arg1, wbg_rayon_PoolBuilder.__wrap(arg2));
        return ret;
    };
    imports.wbg.__wbg_static_accessor_GLOBAL_88a902d13a557d07 = function() {
        const ret = typeof global === 'undefined' ? null : global;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0 = function() {
        const ret = typeof globalThis === 'undefined' ? null : globalThis;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_SELF_37c5d418e4bf5819 = function() {
        const ret = typeof self === 'undefined' ? null : self;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_WINDOW_5de37043a91a9c40 = function() {
        const ret = typeof window === 'undefined' ? null : window;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_status_f6360336ca686bf0 = function(arg0) {
        const ret = arg0.status;
        return ret;
    };
    imports.wbg.__wbg_subarray_aa9065fa9dc5df96 = function(arg0, arg1, arg2) {
        const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_then_44b73946d2fb3e7d = function(arg0, arg1) {
        const ret = arg0.then(arg1);
        return ret;
    };
    imports.wbg.__wbg_then_48b406749878a531 = function(arg0, arg1, arg2) {
        const ret = arg0.then(arg1, arg2);
        return ret;
    };
    imports.wbg.__wbg_toString_5285597960676b7b = function(arg0) {
        const ret = arg0.toString();
        return ret;
    };
    imports.wbg.__wbg_value_cd1ffa7b1ab794f1 = function(arg0) {
        const ret = arg0.value;
        return ret;
    };
    imports.wbg.__wbg_value_dab73d3d5d4abaaf = function(arg0) {
        const ret = arg0.value;
        return ret;
    };
    imports.wbg.__wbg_value_e5170ceef06c5805 = function(arg0) {
        const ret = arg0.value;
        return ret;
    };
    imports.wbg.__wbg_versions_c71aa1626a93e0a1 = function(arg0) {
        const ret = arg0.versions;
        return ret;
    };
    imports.wbg.__wbg_view_fd8a56e8983f448d = function(arg0) {
        const ret = arg0.view;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_waitAsync_61f0a081053dd3c2 = function(arg0, arg1, arg2) {
        const ret = Atomics.waitAsync(arg0, arg1 >>> 0, arg2);
        return ret;
    };
    imports.wbg.__wbg_waitAsync_7ce6c8a047c752c3 = function() {
        const ret = Atomics.waitAsync;
        return ret;
    };
    imports.wbg.__wbg_walletsummary_new = function(arg0) {
        const ret = WalletSummary.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_warn_4ca3906c248c47c4 = function(arg0) {
        console.warn(arg0);
    };
    imports.wbg.__wbg_warn_aaf1f4664a035bd6 = function(arg0, arg1, arg2, arg3) {
        console.warn(arg0, arg1, arg2, arg3);
    };
    imports.wbg.__wbindgen_as_number = function(arg0) {
        const ret = +arg0;
        return ret;
    };
    imports.wbg.__wbindgen_bigint_from_i128 = function(arg0, arg1) {
        const ret = arg0 << BigInt(64) | BigInt.asUintN(64, arg1);
        return ret;
    };
    imports.wbg.__wbindgen_bigint_from_i64 = function(arg0) {
        const ret = arg0;
        return ret;
    };
    imports.wbg.__wbindgen_bigint_from_u64 = function(arg0) {
        const ret = BigInt.asUintN(64, arg0);
        return ret;
    };
    imports.wbg.__wbindgen_bigint_get_as_i64 = function(arg0, arg1) {
        const v = arg1;
        const ret = typeof(v) === 'bigint' ? v : undefined;
        getDataViewMemory0().setBigInt64(arg0 + 8 * 1, isLikeNone(ret) ? BigInt(0) : ret, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    };
    imports.wbg.__wbindgen_boolean_get = function(arg0) {
        const v = arg0;
        const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
        return ret;
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = arg0.original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper4352 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 1702, __wbg_adapter_62);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper4354 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 1702, __wbg_adapter_62);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper4516 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 1757, __wbg_adapter_67);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper4518 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 1757, __wbg_adapter_67);
        return ret;
    };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbindgen_in = function(arg0, arg1) {
        const ret = arg0 in arg1;
        return ret;
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_3;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };
    imports.wbg.__wbindgen_is_bigint = function(arg0) {
        const ret = typeof(arg0) === 'bigint';
        return ret;
    };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(arg0) === 'function';
        return ret;
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = arg0;
        const ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        const ret = typeof(arg0) === 'string';
        return ret;
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = arg0 === undefined;
        return ret;
    };
    imports.wbg.__wbindgen_jsval_eq = function(arg0, arg1) {
        const ret = arg0 === arg1;
        return ret;
    };
    imports.wbg.__wbindgen_jsval_loose_eq = function(arg0, arg1) {
        const ret = arg0 == arg1;
        return ret;
    };
    imports.wbg.__wbindgen_link_9579f016b4522a24 = function(arg0) {
        const val = `onmessage = function (ev) {
            let [ia, index, value] = ev.data;
            ia = new Int32Array(ia.buffer);
            let result = Atomics.wait(ia, index, value);
            postMessage(result);
        };
        `;
        const ret = typeof URL.createObjectURL === 'undefined' ? "data:application/javascript," + encodeURIComponent(val) : URL.createObjectURL(new Blob([val], { type: "text/javascript" }));
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return ret;
    };
    imports.wbg.__wbindgen_module = function() {
        const ret = __wbg_init.__wbindgen_wasm_module;
        return ret;
    };
    imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'number' ? obj : undefined;
        getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        const ret = arg0;
        return ret;
    };
    imports.wbg.__wbindgen_rethrow = function(arg0) {
        throw arg0;
    };
    imports.wbg.__wbindgen_shr = function(arg0, arg1) {
        const ret = arg0 >> arg1;
        return ret;
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_uint8_array_new = function(arg0, arg1) {
        var v0 = getArrayU8FromWasm0(arg0, arg1).slice();
        wasm.__wbindgen_free(arg0, arg1 * 1, 1);
        const ret = v0;
        return ret;
    };
    imports['./snippets/wasm_thread-8ee53d0673203880/src/wasm32/js/module_worker_start.js'] = __wbg_star0;
    imports['./snippets/wasm_thread-8ee53d0673203880/src/wasm32/js/module_workers_polyfill.min.js'] = __wbg_star1;

    return imports;
}

function __wbg_init_memory(imports, memory) {
    imports.wbg.memory = memory || new WebAssembly.Memory({initial:840,maximum:16384,shared:true});
}

function __wbg_finalize_init(instance, module, thread_stack_size) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;

    if (typeof thread_stack_size !== 'undefined' && (typeof thread_stack_size !== 'number' || thread_stack_size === 0 || thread_stack_size % 65536 !== 0)) { throw 'invalid stack size' }
    wasm.__wbindgen_start(thread_stack_size);
    return wasm;
}

function initSync(module, memory) {
    if (wasm !== undefined) return wasm;

    let thread_stack_size
    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module, memory, thread_stack_size} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports, memory);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module, thread_stack_size);
}

async function __wbg_init(module_or_path, memory) {
    if (wasm !== undefined) return wasm;

    let thread_stack_size
    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path, memory, thread_stack_size} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('webzjs_wallet_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports, memory);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module, thread_stack_size);
}

export { initSync };
export default __wbg_init;
