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

## 部署 (GitHub Pages)

`.github/workflows/deploy.yml` 在 push 到 `main` 時自動 build + 推到 GH Pages，目前接 project page，網址為：

> https://yuzenchen.github.io/portfolio-website/

### 一次性設定

1. Repo **Settings → Pages → Build and deployment → Source**: `Deploy from a branch`
2. **Branch** 選 `gh-pages` / `/ (root)`，存檔（首次 deploy 跑完後 `gh-pages` 才存在；workflow 會自動建立並推上去）
3. Repo **Settings → Secrets and variables → Actions** 加：
   - `PUBLIC_FORMSPREE_ENDPOINT` = `https://formspree.io/f/<id>`

### Base path / 自訂網域

`astro.config.mjs` 從環境變數讀 base，所以同一份 code 可以服侍三種情境：

| 情境 | `BASE_PATH` | `SITE` |
|---|---|---|
| GH Pages project page (預設, workflow 自動帶) | `/portfolio-website` | `https://yuzenchen.github.io` |
| Custom domain `yuzen.life` | `/` | `https://yuzen.life` |
| Local Docker smoke test | `/` (Dockerfile ARG 預設) | `http://localhost` |

切到 custom domain 時：
1. 在 repo 加一份 `public/CNAME` 檔，內容是 `yuzen.life`
2. workflow 裡 `BASE_PATH: /` 與 `SITE: https://yuzen.life`
3. DNS 設 `CNAME yuzen.life → yuzenchen.github.io`（或四筆 A record）

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
