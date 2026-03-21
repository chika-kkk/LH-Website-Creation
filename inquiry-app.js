//届いたデータを転送するだけの処理

// 設計書読み込み
const express = require('express');
const cors = require('cors');

const kintoneModule = require('@kintone/rest-api-client');
console.log("中身:", kintoneModule);

const app = express();
app.use(cors());
app.use(express.json());

// フォルダの中を公開
app.use(express.static('public'));

const client = new kintoneModule.KintoneRestAPIClient({
	baseUrl: 'https://${process.env.KINTONE_DOMAIN}',
	auth: {
		apiToken: '${process.env.KINTONE_API_TOKEN}'
	}
});

// kintoneへPOST
app.post('/submit', async (Request, Response) => {
	try {
		const data = Request.body;
		console.log("届いたもの：", data);
		const postData = {
			app: process.env.KINTONE_APP_ID,
			record: {
				"姓": { value: data.姓 },
				"名": { value: data.名 },
				"名カナ": { value: data.名カナ },
				"姓カナ": { value: data.姓カナ },
				"郵便番号": { value: data.郵便番号 },
				"都道府県": { value: data.都道府県 },
				"市区町村": { value: data.市区町村 },
				"番地": { value: data.番地 },
				"建物名_お部屋番号": { value: data.建物名_お部屋番号 },
				"メールアドレス": { value: data.メールアドレス },
				"電話番号": { value: data.電話番号 },
				"お問い合わせ種別": { value: data.お問い合わせ種別 },
				"お問い合わせ内容": { value: data.お問い合わせ内容 }
			}
		};
		console.log("お問い合わせ種別の値:", data.お問い合わせ種別);

		await client.record.addRecord(postData);

		Response.json({ message: "送信完了いたしました" });
	} catch (error) {
		console.error("kintone送信エラー詳細:", error);
		Response.status(500).json({ message: "送信に失敗しました" });
	}
});

// Renderのポートかローカルの3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`${PORT}番ポートで受付開始`);
});