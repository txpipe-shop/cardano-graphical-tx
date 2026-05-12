declare module "cbor-core" {
  // ============================================================
  //  Base type for all CBOR value objects
  // ============================================================
  interface CborObject {
    /** Encode to deterministic CBOR binary */
    encode(): Uint8Array;

    /** Return diagnostic notation string */
    toDiagnostic(prettyPrint: boolean): string;

    /** Return pretty-printed diagnostic notation */
    toString(): string;

    /** Deep equality check via encoded bytes */
    equals(other: CborObject): boolean;

    /** Deep clone via encode + decode round-trip */
    clone(): CborObject;

    /** Mark self and all descendants as read (no-op for "read") */
    scan(): this;

    /** Traverse and verify every node was read; throws if any unread */
    checkForUnread(): void;

    /** Length (bytes for Float/NonFinite, element count for Array/Map; throws on others) */
    readonly length: number;

    // ---- Typed getters (any type, runtime-checked) ----

    /** Extract bigint value (must be CBOR.Int) */
    getBigInt(): bigint;

    getInt8(): number;
    getUint8(): number;
    getInt16(): number;
    getUint16(): number;
    getInt32(): number;
    getUint32(): number;
    getInt53(): number;
    getInt64(): bigint;
    getUint64(): bigint;
    getInt128(): bigint;
    getUint128(): bigint;

    /** Extract string (must be CBOR.String) */
    getString(): string;

    /** Parse ISO date string from CBOR.String */
    getDateTime(): Date;

    /** Convert number (Int or Float) to Epoch Date */
    getEpochTime(): Date;

    /** Extract byte array (must be CBOR.Bytes) */
    getBytes(): Uint8Array;

    getFloat16(): number;
    getFloat32(): number;
    getFloat64(): number;

    /** Get raw non-finite value as bigint (must be CBOR.NonFinite) */
    getNonFinite64(): bigint;

    /** Get float64 or convert simple NaN/Infinity (CBOR.NonFinite or CBOR.Float) */
    getExtendedFloat64(): number;

    /** Extract boolean (must be CBOR.Boolean) */
    getBoolean(): boolean;

    /** Test for null (any type, doesn't throw) */
    isNull(): boolean;

    /** Extract simple value (must be CBOR.Simple) */
    getSimple(): number;

    /** Always throws on base types; only CBOR.Tag overrides */
    get(): never;
  }

  // ============================================================
  //  Concrete CBOR value types
  // ============================================================

  interface CborInt extends CborObject {
    getBigInt(): bigint;
  }
  interface CborIntConstructor {
    (value: number | bigint): CborInt;
    createInt8(value: number | bigint): CborInt;
    createUint8(value: number | bigint): CborInt;
    createInt16(value: number | bigint): CborInt;
    createUint16(value: number | bigint): CborInt;
    createInt32(value: number | bigint): CborInt;
    createUint32(value: number | bigint): CborInt;
    createInt53(value: number | bigint): CborInt;
    createInt64(value: number | bigint): CborInt;
    createUint64(value: number | bigint): CborInt;
    createInt128(value: number | bigint): CborInt;
    createUint128(value: number | bigint): CborInt;
    new(): never;
  }

  interface CborFloat extends CborObject {
    getFloat64(): number;
    readonly length: number;
  }
  interface CborFloatConstructor {
    (value: number): CborFloat;
    createExtendedFloat(value: number): CborFloat | CborNonFinite;
    createFloat32(value: number): CborFloat;
    createFloat16(value: number): CborFloat;
    new(): never;
  }

  interface CborString extends CborObject {
    getString(): string;
  }
  interface CborStringConstructor {
    (value: string): CborString;
    new(): never;
  }

  interface CborBytes extends CborObject {
    getBytes(): Uint8Array;
  }
  interface CborBytesConstructor {
    (value: Uint8Array): CborBytes;
    new(): never;
  }

  interface CborBoolean extends CborObject {
    getBoolean(): boolean;
  }
  interface CborBooleanConstructor {
    (value: boolean): CborBoolean;
    new(): never;
  }

  interface CborNull extends CborObject {
    isNull(): true;
  }
  interface CborNullConstructor {
    (): CborNull;
    new(): never;
  }

  interface CborArray extends CborObject {
    add(object: CborObject): this;
    get(index: number): CborObject;
    insert(index: number, object: CborObject): this;
    update(index: number, object: CborObject): CborObject;
    remove(index: number): CborObject;
    toArray(): CborObject[];
    encodeAsSequence(): Uint8Array;
    readonly length: number;
  }
  interface CborArrayConstructor {
    (): CborArray;
    new(): never;
  }

  interface CborMap extends CborObject {
    set(key: CborObject, value: CborObject): this;
    get(key: CborObject): CborObject;
    getKeys(): CborObject[];
    remove(key: CborObject): CborObject;
    containsKey(key: CborObject): boolean;
    update(key: CborObject, value: CborObject, existing: boolean): CborObject | null;
    getConditionally(key: CborObject, defaultObject: CborObject | null): CborObject | null;
    merge(map: CborMap): this;
    setDynamic(dynamic: (map: CborMap) => CborMap): this;
    setSortingMode(preSortedKeys: boolean): this;
    readonly length: number;
  }
  interface CborMapConstructor {
    (): CborMap;
    new(): never;
  }

  interface CborTag extends CborObject {
    getTagNumber(): bigint;
    get(): CborObject;
    getDateTime(): Date;
    getEpochTime(): Date;
    readonly cotxId: string;
    readonly cotxObject: CborObject;
  }
  interface CborTagConstructor {
    (tagNumber: number | bigint, object: CborObject): CborTag;
    readonly TAG_DATE_TIME: bigint;
    readonly TAG_EPOCH_TIME: bigint;
    readonly TAG_COTX: bigint;
    new(): never;
  }

  interface CborSimple extends CborObject {
    getSimple(): number;
  }
  interface CborSimpleConstructor {
    (value: number): CborSimple;
    new(): never;
  }

  interface CborNonFinite extends CborObject {
    getNonFinite(): bigint;
    getNonFinite64(): bigint;
    getExtendedFloat64(): number;
    isNaN(): boolean;
    isSimple(): boolean;
    getSign(): boolean;
    setSign(sign: boolean): this;
    getPayload(): bigint;
    readonly length: number;
  }
  interface CborNonFiniteConstructor {
    (value: bigint): CborNonFinite;
    createPayload(payload: bigint): CborNonFinite;
    new(): never;
  }

  // ============================================================
  //  CborException — thrown on all CBOR errors
  // ============================================================
  class CborException extends Error {
    constructor(message: string);
  }

  // ============================================================
  //  Decoder — streaming/incremental CBOR decoder
  // ============================================================
  class Decoder {
    constructor(cbor: Uint8Array, options?: number);
    /** Decode next object; returns null at EOF in sequence mode */
    decodeWithOptions(): CborObject | null;
    /** Total bytes consumed so far */
    getByteCount(): number;
    /** Set max nesting depth (default 100) */
    setMaxNestingLevel(maxLevel: number): this;
  }

  // ============================================================
  //  DiagnosticNotation — parser for CBOR diagnostic notation
  // ============================================================
  class DiagnosticNotation {
    static ParserError: typeof ParserError;
    constructor(cborText: string, sequenceMode: boolean);
    /** Parse all objects until EOF; returns array */
    readSequenceToEOF(): CborObject[];
    /** Parse and return a single object */
    getObject(): CborObject;
  }

  class ParserError extends Error {
    constructor(message: string);
  }

  // ============================================================
  //  Main CBOR static class (default export)
  // ============================================================
  class CBOR {
    private constructor();

    // -- Version --
    static readonly version: string;

    // -- Decoder options (bitmask flags) --
    static readonly SEQUENCE_MODE: number;
    static readonly LENIENT_MAP_DECODING: number;
    static readonly LENIENT_NUMBER_DECODING: number;

    // -- Type constructors (wrapped in Proxy; call like CBOR.Int(5)) --
    static Int: CborIntConstructor;
    static Float: CborFloatConstructor;
    static String: CborStringConstructor;
    static Bytes: CborBytesConstructor;
    static Boolean: CborBooleanConstructor;
    static Null: CborNullConstructor;
    static Array: CborArrayConstructor;
    static Map: CborMapConstructor;
    static Tag: CborTagConstructor;
    static Simple: CborSimpleConstructor;
    static NonFinite: CborNonFiniteConstructor;

    // -- Nested classes --
    static CborException: typeof CborException;
    static Decoder: typeof Decoder;
    static DiagnosticNotation: typeof DiagnosticNotation;

    // -- Decode CBOR binary --
    static decode(cbor: Uint8Array): CborObject;
    static initDecoder(cbor: Uint8Array, options?: number): Decoder;

    // -- Parse diagnostic notation --
    static fromDiagnostic(cborText: string): CborObject;
    static fromDiagnosticSeq(cborText: string): CborObject[];

    // -- Hex utilities --
    static toHex(byteArray: Uint8Array): string;
    static fromHex(hexString: string): Uint8Array;

    // -- Base64Url utilities --
    static toBase64Url(byteArray: Uint8Array): string;
    static fromBase64Url(base64: string): Uint8Array;

    // -- BigInt / byte array conversion --
    static toBigInt(byteArray: Uint8Array): bigint;
    static fromBigInt(bigint: bigint): Uint8Array;

    // -- Array utility --
    static addArrays(a: Uint8Array, b: Uint8Array): Uint8Array;
    static compareArrays(a: Uint8Array, b: Uint8Array): number;

    // -- Date / time creators --
    static createDateTime(instant: Date, millis: boolean, utc: boolean): CborString;
    static createEpochTime(instant: Date, millis: boolean): CborInt | CborFloat;
  }

  export default CBOR;
}
