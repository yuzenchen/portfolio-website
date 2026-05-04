# yuzen.life — 個人作品集

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

`test:smoke` 會：build production image → 起 container 在 :8088 → 對 `/` 與 fingerprinted CSS 做 12 項斷言（HTML 內容、cache header、SPA fallback）→ 自動 teardown。可用 `PORT=9090 npm run test:smoke` 換 port。

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

## 部署

預設透過 GitHub Actions 推到 Cloudflare Pages。需要在 repo Secrets 設定：

| Secret | 用途 |
|---|---|
| `CLOUDFLARE_API_TOKEN` | CF Pages deploy token (Account → API Tokens) |
| `CLOUDFLARE_ACCOUNT_ID` | CF dashboard 右下角 Account ID |
| `PUBLIC_FORMSPREE_ENDPOINT` | `https://formspree.io/f/<id>` |

或者更簡單：直接在 Cloudflare Pages dashboard 接 GitHub repo，CF 會自動偵測 Astro，build command `npm run build`、output `dist`，把 `PUBLIC_FORMSPREE_ENDPOINT` 設成環境變數即可，這時候可以把 workflow 裡的 `deploy` job 整段拿掉。

## 從舊版遷移的重點

| 舊 | 新 |
|---|---|
| `index.html` 單檔 ~355 行 | `src/pages/index.astro` + 6 個 component |
| `script.js` 480 行單檔 | `src/scripts/*.ts` 9 個模組 |
| `styles.css` 1050 行寫死色碼 | `tokens.css` 集中變數 + 拆出 `animations.css` |
| Flask `/api/send-telegram` | Formspree（無自架後端） |
| nginx Dockerfile + hardcoded `172.17.0.4` | Static `dist/` 推 CF Pages |
| `.github/workflows/telegram-backend.yml` (compileall only) | `.github/workflows/deploy.yml`（build + deploy） |

## 授權

© 2025 Yuzen Chen. MIT.
