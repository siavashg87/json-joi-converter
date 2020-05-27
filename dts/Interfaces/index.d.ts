import { ArraySortOptions, ArrayUniqueOptions, Base64Options, DataUriOptions, DomainOptions, EmailOptions, GuidOptions, HexOptions, HierarchySeparatorOptions, IpOptions, LanguageMessages, ObjectPatternOptions, PresenceMode, RenameOptions, RuleOptions, StringRegexOptions, UriOptions, ValidationOptions, WhenOptions, WhenSchemaOptions, Context, ReferenceOptions } from "@hapi/joi";
export interface Reference extends Omit<ReferenceOptions, "adjust"> {
    $ref: string;
    adjust?: string;
}
export declare type SchemaLike = string | number | boolean | object | null | Schema | SchemaMap;
export declare type JsonRegex = {
    $regex: string;
    flags?: string;
};
declare type SchemaMap<TSchema = any> = {
    [key in keyof TSchema]?: SchemaLike | SchemaLike[];
};
declare type ArrayMinOneItem<T> = {
    0: T;
} & Array<T>;
export declare type Schema = AnySchema | ArraySchema | AlternativesSchema | BinarySchema | BooleanSchema | DateSchema | NumberSchema | ObjectSchema | StringSchema | LinkSchema | SymbolSchema;
export declare type TypeWhen = ({
    reference: string | Reference;
    schema?: never;
} & WhenOptions) | ({
    schema: Schema;
    reference?: never;
    is?: never;
    switch?: never;
    not?: never;
    break?: never;
} & WhenSchemaOptions);
export interface AnySchema<T = any> {
    type: "any" | "number" | "string" | "boolean" | "binary" | "link" | "alternatives" | "object" | "array" | "symbol" | "date";
    allow?: T | ArrayMinOneItem<T>;
    alter?: Record<string, Schema>;
    cast?: 'map' | 'number' | 'set' | 'string';
    concat?: Schema;
    default?: T | Reference | {
        parent: any;
    };
    description?: string;
    disallow?: T | ArrayMinOneItem<T>;
    empty?: boolean | SchemaLike;
    equal?: any | Array<any>;
    error?: string;
    example?: string | {
        example: string;
        override?: boolean;
    };
    exist?: boolean;
    external?: string | {
        method: string;
        description?: string;
    };
    extract?: string | ArrayMinOneItem<string>;
    failover?: any;
    forbidden?: boolean;
    fork?: {
        key: string | ArrayMinOneItem<string> | ArrayMinOneItem<ArrayMinOneItem<string>>;
        adjuster?: Schema;
    };
    id?: string;
    invalid?: T | ArrayMinOneItem<T>;
    keep?: boolean;
    label?: string;
    message?: string;
    messages?: LanguageMessages;
    meta?: object;
    not?: T | ArrayMinOneItem<T>;
    note?: string | ArrayMinOneItem<string>;
    only?: boolean;
    optional?: boolean;
    options?: ValidationOptions;
    prefs?: ValidationOptions;
    preferences?: ValidationOptions;
    presence?: PresenceMode;
    raw?: boolean;
    required?: boolean;
    rule?: RuleOptions;
    shared?: Schema;
    strict?: boolean;
    strip?: boolean;
    tag?: string | ArrayMinOneItem<string>;
    tailor?: string | ArrayMinOneItem<string>;
    unit?: string;
    valid?: T | ArrayMinOneItem<T>;
    warn?: boolean;
    warning?: {
        code: string;
        context: Context;
    };
    when?: TypeWhen | ArrayMinOneItem<TypeWhen>;
}
export interface BooleanSchema extends AnySchema<boolean> {
    default?: boolean;
    falsy?: ArrayMinOneItem<string | number>;
    sensitive?: boolean;
    truthy?: ArrayMinOneItem<string | number>;
}
declare type NumberLimit = number | Reference | {
    limit: number | Reference;
};
export interface NumberSchema extends AnySchema<number> {
    type: "number";
    greater?: NumberLimit;
    integer?: boolean;
    less?: NumberLimit;
    max?: NumberLimit;
    min?: NumberLimit;
    multiple?: number | Reference | {
        base: number | Reference;
    };
    negative?: boolean;
    port?: boolean;
    positive?: boolean;
    precision?: number;
    sign?: "positive" | "negative";
    unsafe?: any;
}
declare type StringLength = number | Reference | {
    limit: number | Reference;
    encoding?: string;
};
export declare type TypeReplace = {
    find: string | JsonRegex;
    replace: string;
};
export interface StringSchema extends AnySchema<string> {
    type: "string";
    alphanum?: boolean;
    base64?: boolean | Base64Options;
    case?: "upper" | "lower";
    creditCard?: boolean;
    dataUri?: boolean | DataUriOptions;
    domain?: boolean | DomainOptions;
    email?: boolean | EmailOptions;
    guid?: boolean | GuidOptions;
    hex?: boolean | HexOptions;
    hostname?: boolean;
    insensitive?: boolean;
    ip?: boolean | IpOptions;
    isoDate?: boolean;
    isoDuration?: boolean;
    length?: StringLength;
    lowercase?: boolean;
    max?: StringLength;
    min?: StringLength;
    normalize?: boolean | 'NFC' | 'NFD' | 'NFKC' | 'NFKD';
    pattern?: string | {
        pattern: JsonRegex;
        options?: string | StringRegexOptions;
    };
    regex?: string | {
        pattern: JsonRegex;
        options?: string | StringRegexOptions;
    };
    replace?: TypeReplace | ArrayMinOneItem<TypeReplace>;
    token?: boolean;
    trim?: any;
    truncate?: boolean;
    uppercase?: boolean;
    uri?: boolean | (Omit<UriOptions, "scheme"> & {
        scheme?: string | JsonRegex;
    });
    uuid?: boolean | GuidOptions;
}
declare type Peers = ArrayMinOneItem<string | HierarchySeparatorOptions> | {
    peers: ArrayMinOneItem<string>;
    options?: HierarchySeparatorOptions;
};
export declare type TypeWithOut = {
    key: string;
    peers: string | ArrayMinOneItem<string>;
    options?: HierarchySeparatorOptions;
} | [string, string | ArrayMinOneItem<string>, HierarchySeparatorOptions?];
export declare type TypeAssert = [string | Reference, any, string?] | {
    reference: string | Reference;
    schema: SchemaLike;
    message?: string;
};
export interface ObjectSchema<T = any> extends AnySchema<T> {
    type: "object";
    properties: {
        [key: string]: Schema;
    };
    and?: Peers;
    append?: {
        [key: string]: Schema;
    };
    assert?: TypeAssert;
    keys?: {
        [key: string]: Schema;
    };
    length?: number;
    max?: number | Reference;
    min?: number | Reference;
    nand?: Peers;
    or?: Peers;
    oxor?: Peers;
    pattern?: {
        pattern: JsonRegex | SchemaLike;
        schema: SchemaLike;
        options?: ObjectPatternOptions;
    };
    ref?: boolean;
    regex?: boolean;
    rename?: {
        from: string;
        to: string;
    } & RenameOptions;
    schema?: SchemaLike;
    unknown?: boolean;
    with?: TypeWithOut;
    without?: TypeWithOut;
    xor?: Peers;
}
export interface ArraySchema<T = any> extends AnySchema<T> {
    type: "array";
    has?: SchemaLike;
    items?: SchemaLike | ArrayMinOneItem<SchemaLike>;
    length?: number | Reference;
    min?: number;
    max?: number;
    ordered?: ArrayMinOneItem<SchemaLike>;
    single?: any;
    sort?: boolean | ArraySortOptions;
    sparse?: any;
    unique?: boolean | string | {
        comparator: string;
        options?: ArrayUniqueOptions;
    };
}
export interface BinarySchema extends AnySchema {
    type: "binary";
    encoding?: string;
    min?: number | Reference;
    max?: number | Reference;
    length?: number | Reference;
}
declare type DateArg = 'now' | Date | number | string | Reference;
export interface DateSchema extends AnySchema {
    type: "date";
    greater?: DateArg;
    iso?: boolean;
    less?: DateArg;
    min?: DateArg;
    max?: DateArg;
    timetamp?: 'javascript' | 'unix';
}
export interface AlternativesSchema extends AnySchema {
    type: "alternatives";
    conditional?: TypeWhen | ArrayMinOneItem<TypeWhen>;
    match?: 'any' | 'all' | 'one';
    try?: ArrayMinOneItem<SchemaLike>;
}
export interface LinkSchema extends AnySchema {
    type: "link";
    concat?: Schema;
    ref?: string;
}
export interface SymbolSchema extends AnySchema {
    type: "symbol";
    map?: Iterable<[string | number | boolean | symbol, symbol]> | {
        [key: string]: symbol;
    };
}
export {};
