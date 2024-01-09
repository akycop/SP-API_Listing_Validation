import fs from "fs";
import { registerSchema,InvalidSchemaError, addSchema, setMetaSchemaOutputFormat, validate, OutputUnit} from "@hyperjump/json-schema/draft-2019-09";
import { defineVocabulary, BASIC, loadDialect, addKeyword } from "@hyperjump/json-schema/experimental";

import * as maxUniqueItemsKeyword from "./Schemes/keywords/MaxUniqueItemsKeyword.js";
import * as maxUtf8ByteLengthKeyword from "./Schemes/keywords/MaxUtf8ByteLengthKeyword.js";
import * as minUtf8ByteLengthKeyword from "./Schemes/keywords/MinUtf8ByteLengthKeyword.js";

const metaSchemaPath = "./SP-API_CrowdWorks/Schemes/MetaSchemes/amazon-product-type-definition-meta-schema-v1.json";
const luggageSchemaPath = "./SP-API_CrowdWorks/Schemes/productSchemes/SHIRT.json";
const customVocabularyId = "https://schemas.amazon.com/selling-partners/definitions/product-types/vocabulary/v1";
const maxUniqueItemsId = "https://schemas.amazon.com/selling-partners/keywords/maxUniqueItems/v1";
const minUtf8ByteLengthId = "https://schemas.amazon.com/selling-partners/keywords/minUtf8ByteLength/v1";
const maxUtf8ByteLengthId = "https://schemas.amazon.com/selling-partners/keywords/maxUtf8ByteLength/v1";

function removeEmptyAnyOf(obj:any) {
  if (typeof obj === 'object' && obj !== null) {
    Object.keys(obj).forEach(key => {
      if (key === 'anyOf' && Array.isArray(obj[key]) && obj[key].length === 0) {
        delete obj[key];
      } else {
        removeEmptyAnyOf(obj[key]);
      }
    });
  }
  return obj;
}

export async function validator(payload:any) {
  setMetaSchemaOutputFormat(BASIC);

  const metaSchemaJSON = JSON.parse(fs.readFileSync(metaSchemaPath,"utf8"));
  const luggageSchemaJSON = JSON.parse(fs.readFileSync(luggageSchemaPath, "utf8"));
  luggageSchemaJSON['allOf'] = removeEmptyAnyOf(luggageSchemaJSON['allOf']);
  luggageSchemaJSON

  for (const [key, value] of Object.entries(luggageSchemaJSON.properties) as [string, any][]) {
    const item = value.items
    if(item.additionalProperties){
      console.log(key)
    }
  }

  const schemaId = metaSchemaJSON['$id'];
  const luggageSchemaId = luggageSchemaJSON['$id'];

  defineVocabulary(customVocabularyId, {
    maxUniqueItems: maxUniqueItemsId,
    minUtf8ByteLength: minUtf8ByteLengthId,
    maxUtf8ByteLength: maxUtf8ByteLengthId
  });

  addKeyword({
    id: maxUniqueItemsId,
    compile: maxUniqueItemsKeyword.compile,
    interpret: maxUniqueItemsKeyword.interpret
  })

  addKeyword({
    id: minUtf8ByteLengthId,
    compile: minUtf8ByteLengthKeyword.compile,
    interpret: minUtf8ByteLengthKeyword.interpret
  })

  addKeyword({
    id: maxUtf8ByteLengthId,
    compile: maxUtf8ByteLengthKeyword.compile,
    interpret: maxUtf8ByteLengthKeyword.interpret
  })

  loadDialect(
    schemaId,
    metaSchemaJSON['$vocabulary'],
    true
  );

  registerSchema(metaSchemaJSON)
  registerSchema(luggageSchemaJSON)


  try {
    const result = await validate(luggageSchemaId, payload, BASIC)
    handleResult(result)
    luggageSchemaJSON
    return result
  } catch (error: any) {
    console.log(error.stack);
    throw new Error(error.message);
  }
}

function handleResult(result: OutputUnit) {
  if(!result.errors) return;
  const errors = result.errors
  errors.map(error =>{
    if(error.valid) return
    const location_On_Schema = (error.absoluteKeywordLocation.match('#/'))
      ? error.absoluteKeywordLocation.split('#/')[1]
      : error.absoluteKeywordLocation
    const location_On_Payload = error.instanceLocation
    const hint = error.keyword.replace("https://json-schema.org/","");
    const text = `バリデーション失敗\n→ポジション：${location_On_Payload}\n→スキーマ：${location_On_Schema}\n→ヒント：${hint}`
    console.log(text);
  })
}