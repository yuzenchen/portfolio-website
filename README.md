# yuzen.tw — 個人作品集

Yuzen Chen 的個人技術服務網站，使用 [Astro](https://astro.build) + TypeScript 重構。
靜態輸出，部署於 Cloudflare Pages，聯絡表單交給 Formspree。

## 技術棧

- **Astro 4** — 0 JS by default、Islands Architecture
- **TypeScript** — strict mode
- **CSS Variables** — 設計 tokens 集中於 `src/styles/tokens.css`
- **Content Collections** — 作品集用 markdown 管理（Zod schema 驗證）
- **Formspree** — 聯絡表單（無自架後端）

## 開發

```bash
npm install
cp .env.example .env   # 填入 PUBLIC_FORMSPREE_ENDPOINT
npm run dev            # http://localhost:4321
```

## Build / Preview

```bash
npm run build          # astro check + astro build → dist/
npm run preview        # 預覽 production bundle
```

## 測試

```bash
npm run test:unit      # vitest — debounce / throttle 等純邏輯
npm run test:smoke     # 在本機 Docker 內 build + 跑 nginx 容器 + curl 驗證 (需 Docker Desktop)
npm test               # 上面兩個一起跑
```

`test:smoke` 會：build production image → 起 container 在 :8088 → 對 `/` 與 fingerprinted CSS 逐項斷言（HTML 內容、無 emoji、cache header、SPA fallback）→ 自動 teardown。可用 `PORT=9090 npm run test:smoke` 換 port。

`test:unit` 除了 `debounce` / `throttle`，也把兩支 FAQ 說明動畫的時間軸完整跑一遍（0–6s 掃描，比對 build 產出的 `data-k`），確保沒有 NaN、opacity 不越界、顏色有回到原色。

## 專案結構

```
src/
├── pages/index.astro          # 首頁
├── layouts/BaseLayout.astro   # head/meta、引入 global CSS 與 main.ts
├── components/                # 6 個 section + Footer
├── content/
│   ├── config.ts              # portfolio collection schema
│   └── portfolio/*.md         # 4 個作品（新增作品只要加新 .md）
├── scripts/                   # 客戶端 TS 模組
│   ├── main.ts                # 入口（DOMContentLoaded）
│   ├── nav.ts
│   ├── particles.ts
│   ├── typing.ts
│   ├── counters.ts
│   ├── reveal.ts              # IntersectionObserver fade-in
│   ├── contact-form.ts        # Formspree 提交
│   ├── notify.ts
│   ├── hover.ts               # hero 視差
│   └── utils.ts               # debounce / throttle
└── styles/
    ├── tokens.css             # 色票、間距、字體、漸變
    ├── animations.css         # 所有 @keyframes
    └── global.css             # 主樣式
```

## 新增作品

```bash
# 在 src/content/portfolio/ 新增一份 .md
---
title: 新作品標題
placeholderTitle: "簡短標題<br>副標"
icon: "🚀"
description: 一段話描述
tags: [Tech1, Tech2]
order: 5
---
```

build 時若 frontmatter 缺欄位或型別不符，`astro check` 會擋下。

## 部署 (Cloudflare Pages)

Cloudflare Pages 直接接 GitHub repo，push 到 `main` 就自動 build + 發布，網址 https://yuzen.tw。

### Pages 專案設定

| 項目 | 值 |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Production branch | `main` |

環境變數（Settings → Environment variables，Production 與 Preview 都要加）：

| 變數 | 值 | 必要性 |
|---|---|---|
| `PUBLIC_FORMSPREE_ENDPOINT` | `https://formspree.io/f/<id>` | 必要，沒設表單會報錯 |
| `NODE_VERSION` | `20` | 必要，CF 預設 Node 版本對 Astro 4 太舊 |

`BASE_PATH` / `SITE` 不用設 —— `astro.config.mjs` 的預設值就是 `/` 與 `https://yuzen.tw`。

### Base path / 自訂網域

`astro.config.mjs` 從環境變數讀 base，需要時可覆寫：

| 情境 | `BASE_PATH` | `SITE` |
|---|---|---|
| Cloudflare Pages / 自訂網域（預設，免設定） | `/` | `https://yuzen.tw` |
| Local Docker smoke test | `/`（Dockerfile ARG 預設） | `http://localhost` |

自訂網域在 CF Pages 專案的 **Custom domains** 加 `yuzen.tw` 即可，DNS 記錄 Cloudflare 會自動代管。

## 從舊版遷移的重點

| 舊 | 新 |
|---|---|
| `index.html` 單檔 ~355 行 | `src/pages/index.astro` + 6 個 component |
| `script.js` 480 行單檔 | `src/scripts/*.ts` 9 個模組 |
| `styles.css` 1050 行寫死色碼 | `tokens.css` 集中變數 + 拆出 `animations.css` |
| Flask `/api/send-telegram` | Formspree（無自架後端） |
| nginx Dockerfile + hardcoded `172.17.0.4` | Static `dist/` 推 CF Pages |
| `.github/workflows/telegram-backend.yml` (compileall only) | Cloudflare Pages 接 repo，push 即 build + deploy（無 CI workflow） |

## 授權

© 2025 Yuzen Chen. MIT.
