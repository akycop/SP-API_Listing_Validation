import * as Instance from "@hyperjump/json-schema/instance/experimental";
import * as Browser from "@hyperjump/browser";

const compile = async(schema: any, ast: any): Promise<number> => Browser.value(schema) as number;

const interpret = (maxUtf8ByteLength: number, instance: any, ast: any): boolean =>
    Instance.typeOf(instance) === "string" &&
    Buffer.byteLength(instance.value) <= maxUtf8ByteLength;

export { compile, interpret };
