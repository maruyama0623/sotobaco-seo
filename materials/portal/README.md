# ソトバコポータル 資料

共通ルールは `materials/README.md` を参照。

## ファイル構成

| ファイル | 用途 |
|---------|------|
| `sotobaco-portal-material.html` | 資料のソースHTML（スライド形式） |
| `ソトバコポータル資料請求.pdf` | 生成済みPDF（R2にもアップロード） |

## R2アップロード

- バケット: `sotobaco-material`
- キー: `sotobaco-portal-material.pdf`

```bash
cd workers/material-api && npx wrangler r2 object put \
  "sotobaco-material/sotobaco-portal-material.pdf" \
  --file="materials/portal/ソトバコポータル資料請求.pdf" \
  --content-type="application/pdf"
```
