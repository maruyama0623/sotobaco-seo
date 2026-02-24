# UI Button Presets

## `SBK_HEADER_ACTION_BUTTON_V1`

問い合わせ管理（アプリ93）の一覧ヘッダーで使用している共通ボタンデザインです。  
今後ほかのアプリでも同じ見た目を使う場合は、`sbk-header-action-btn` クラスを付与してください。

### 用途
- 一覧ヘッダー上のアクションボタン（例: レポート作成）
- kintone標準ボタンとの高さ合わせ

### 仕様（PC）
- `min-width`: `163px`
- `height`: `44px`
- `padding`: `0 16px`
- `border`: `1px solid #d3d8dd`
- `background`: `#f7f9fb`
- `color`: `#3493df`
- `font-size`: `16px`
- `font-weight`: `500`

### 仕様（モバイル）
- `min-width`: `163px`
- `height`: `40px`
- `padding`: `0 16px`
- `font-size`: `16px`

### 利用クラス
- `kintoneplugin-button-normal sbk-header-action-btn`

### 実装箇所（参照）
- `/Users/maruyama/Documents/Git/sotobaco/kintone/src/app93-contact-list.js`
