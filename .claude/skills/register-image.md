# /register-image — 画像登録スキル

## 概要
新しい画像がプロジェクトに追加された際に、命名規則に従ったリネーム・カタログ追記・出典記載を行う。

## 実行手順

### 1. 画像の確認
- 追加された画像ファイルを Read ツールで確認する（画像の内容を把握）
- 社長から出典情報を確認する（他社サイトからの引用かどうか）

### 2. 命名規則に従ったリネーム
- 命名フォーマット: `{feature}_{description}.png`
  - feature: 機能名（announce / tab / graph / app-list / notification / unprocessed / space / smartphone / setup / kintone / portal）
  - description: 何の画面か（overview / settings / before / after / category / list / drag-drop / mobile / add）
  - すべて小文字・ハイフン区切り
  - 拡張子: スクリーンショット → `.png` / 写真素材 → `.jpg`
- 例: `announce_category.png`

### 3. images/ フォルダへの配置
- `images/` フォルダ直下に配置する

### 4. images/README.md（画像カタログ）への追記
- ファイル名・Altテキスト（SEO用の日本語説明）・使いどころを記載
- 使いどころ: どの記事・どのセクション・何を説明する文脈で使われるかを具体的に記載

### 5. 引用画像の出典記載（該当する場合のみ）
- 他社Webサイト・ヘルプページ・外部素材からの引用の場合:
  - `images/README.md` の「引用画像の出典一覧」に出典を記載
  - 記事内で使用する際は画像直下に出典表記を追加:
    ```markdown
    出典：[サイト名](URL)
    ```
- 自社で撮影・作成した画像は出典記載不要

### 6. 完了報告
- リネーム後のファイル名
- カタログに追記した内容
- 引用画像の場合は出典記載箇所
を社長に報告する

## 記事への埋め込みフォーマット
```markdown
![Altテキスト](../images/ファイル名.png)
```
- Altテキストは `images/README.md` のカタログからコピーする
