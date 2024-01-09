import { validator } from './jsonSchemaValidator.js';

(async () => {
  try {
    const marketplace_id = "ATVPDKIKX0DER"
    const language_tag = "ja_JP";
    const payload = {
      "brand": [
        {
        "language_tag": language_tag,
        "value": "ノーブランド Tシャツ",
        "marketplace_id": marketplace_id
        }
      ],
      "bullet_point": [
        {
        "language_tag": language_tag,
        "value": "SMART TV WITH UNIVERSAL GUIDE: シンプルなオンスクリーンガイドでストリーミングコンテンツやライブTV番組を簡単に見つけることができます",
        "marketplace_id": marketplace_id
        }
      ],
      "fabric_type": [
        {
          "language_tag": language_tag,
          "value": "コットン100％",
          "marketplace_id": marketplace_id
        }
      ],
      "item_name": [
          {
            "language_tag": language_tag,
            "value": "ノーブランドのTシャツです。これは商品名です。",
            "marketplace_id": marketplace_id
          }
      ],
      "product_description": [
        {
        "language_tag": language_tag,
        "value": "商品説明です。",
        "marketplace_id": marketplace_id
        }
      ],
      "recommended_browse_nodes": [
        {
        "value": "4556171",
        "marketplace_id": marketplace_id
        }
      ],
      "target_gender": [
        {
          "value": "male",
          "marketplace_id": marketplace_id,
        },
      ]
    };
    await validator(payload);
  } catch(err:any){
    console.log(err.stack);
  }
})();