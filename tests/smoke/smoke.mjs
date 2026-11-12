// Smoke test: build the production Docker image, run it, hit it with HTTP,
// assert the response, then tear it down. Cross-platform — invoked with `node`.
//
// Usage:  npm run test:smoke
// Override port:  PORT=9090 npm run test:smoke

import { spawnSync } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const IMAGE = 'portfolio-website:smoke';
const CONTAINER = 'portfolio-website-smoke';
const HOST_PORT = process.env.PORT ?? '8088';
const URL = `http://localhost:${HOST_PORT}/`;

const log = (msg) => console.log(`\x1b[36m[smoke]\x1b[0m ${msg}`);
const ok = (msg) => console.log(`\x1b[32m  ✓ ${msg}\x1b[0m`);
const fail = (msg) => console.error(`\x1b[31m  ✗ ${msg}\x1b[0m`);

function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { stdio: 'inherit', ...opts });
  if (res.status !== 0) {
    throw new Error(`${cmd} ${args.join(' ')} exited with ${res.status}`);
  }
}

function runQuiet(cmd, args) {
  return spawnSync(cmd, args, { stdio: 'pipe', encoding: 'utf8' });
}

async function waitForReady(timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;
  let lastErr;
  while (Date.now() < deadline) {
    try {
      const r = await fetch(URL);
      if (r.ok) return r;
    } catch (e) {
      lastErr = e;
    }
    await sleep(500);
  }
  throw new Error(`Server did not become ready in ${timeoutMs}ms: ${lastErr?.message ?? 'unknown'}`);
}

function teardown() {
  log('Tearing down container');
  runQuiet('docker', ['rm', '-f', CONTAINER]);
}

async function main() {
  // 0. Pre-flight — docker available?
  const probe = runQuiet('docker', ['version', '--format', '{{.Server.Version}}']);
  if (probe.status !== 0) {
    fail('Docker daemon not reachable. Is Docker Desktop running?');
    process.exit(2);
  }
  log(`Docker server: ${probe.stdout.trim()}`);

  // 1. Build
  log(`Building image ${IMAGE}`);
  run('docker', ['build', '-t', IMAGE, '.']);

  // 2. Clean any leftover container with the same name
  runQuiet('docker', ['rm', '-f', CONTAINER]);

  // 3. Run detached
  log(`Starting container ${CONTAINER} on :${HOST_PORT}`);
  run('docker', [
    'run', '-d',
    '--name', CONTAINER,
    '-p', `${HOST_PORT}:80`,
    IMAGE,
  ]);

  let failures = 0;
  const expect = (cond, label) => {
    if (cond) ok(label);
    else { fail(label); failures++; }
  };

  try {
    // 4. Wait until healthy
    log(`Waiting for ${URL}`);
    const res = await waitForReady();
    const body = await res.text();

    // 5. Assertions on production HTML
    expect(res.status === 200, `GET / returns 200 (got ${res.status})`);
    expect(body.includes('Yuzen Chen'), 'page contains "Yuzen Chen"');
    expect(body.includes('/logo.png'), 'nav logo rendered');
    expect(body.includes('aria-label="主選單"'), 'main nav rendered');
    expect(body.includes('流程自動化 × 系統開發'), 'nav tagline rendered');
    expect(body.includes('data-race'), 'hero race track rendered');
    expect((body.match(/data-lane /g) ?? []).length === 2, 'both race lanes rendered');
    expect(body.includes('人工處理') && body.includes('系統自動'), 'race lanes labelled');
    expect(body.includes('人工介入') && body.includes('鍵產出'), 'results row rendered');
    expect(body.includes('marquee-track'), 'marquee rendered');
    expect(body.includes('id="case"'), 'case study section rendered');
    expect(body.includes('已上線營運中'), 'case status badge rendered');
    expect(body.includes('bento'), 'case bento rendered');
    expect((body.match(/data-lightbox/g) ?? []).length === 3, 'three lightbox screenshots rendered');
    expect(body.includes('帳，系統自己對'), 'case reconciliation card rendered');
    expect(body.includes('<main'), 'main landmark rendered');
    expect((body.match(/<h1/g) ?? []).length === 1, 'exactly one h1');
    expect(body.includes('umimididi.com'), 'live-site link rendered');
    expect(body.includes('其他作品'), 'other work rendered');
    expect(body.includes('SECURITY'), 'cve category badge rendered');
    expect(body.includes('我能幫您做什麼'), 'services section rendered');
    expect(body.includes('id="process"') && body.includes('合作流程'), 'process section rendered');
    expect(body.includes('id="about"') && body.includes('關於我'), 'about section rendered');
    expect(body.includes('src="/about-yuzen.webp"'), 'about headshot rendered');
    expect(body.includes('href="https://www.linkedin.com/in/yuzen-chen-a82149167/"'), 'linkedin link rendered');
    expect(body.includes('href="#about"'), 'nav links to about');
    expect(body.includes('stack-details'), 'footer tech stack rendered');
    expect(body.includes('綠界科技 ECPay'), 'local logistics chip rendered');
    expect(body.includes('id="faq"'), 'faq section rendered');
    expect(body.includes('要怎麼跟您溝通'), 'communication question rendered');
    expect(body.includes('系統上線後壞掉怎麼辦'), 'maintenance question rendered');
    expect(body.includes('data-anim="order-flow"'), 'order flow animation rendered');
    expect(body.includes('data-anim="monitor"'), 'monitoring animation rendered');
    // Phones hold a still until this is tapped; it is CSS-hidden on desktop.
    expect((body.match(/class="anim-play"/g) ?? []).length === 2, 'both play buttons rendered');
    // Both animations ship their end state in the markup, so a visitor with JS
    // off or reduced motion on still gets a finished diagram.
    expect(body.includes('自動開立發票') && body.includes('已開立'), 'order flow settled state rendered');
    expect(body.includes('API 服務已恢復正常'), 'monitoring settled state rendered');
    expect(body.includes('公司裡有哪件事，每天都在重複做'), 'contact card rendered');
    expect((body.match(/data-booking/g) ?? []).length >= 2, 'at least two booking triggers rendered');
    expect(
      body.includes('href="https://line.me/R/oaMessage/@732byypo/?%E6%88%91%E5%BE%9E%E5%AE%98%E7%B6%B2%E4%BE%86%EF%BC%8C%E6%83%B3%E8%A9%A2%E5%95%8F%EF%BC%9A"'),
      'LINE message link with pre-filled source note',
    );
    expect(body.includes('src="/line-qr.svg"'), 'LINE add-friend QR rendered');
    // Absolute URL built from SITE. The Dockerfile defaults SITE to
    // http://localhost, so the image under test is http; production builds
    // (SITE unset or https) emit https://yuzen.tw/og.png.
    expect(/property="og:image" content="https?:\/\/[^"]*\/og\.png"/.test(body), 'absolute og:image share card');
    expect(
      ![
        '80% 作業時間',
        '數據爬蟲',
        '24 小時賺錢',
        'whoami',
        '貨運單',
        '托運單',
        '/ 從零到上線',
        '/ 三件事，做到好',
        '/ 發案前先問清楚',
      ].some((t) => body.includes(t)),
      'removed copy is gone',
    );
    expect(body.includes('寄件單'), 'case copy says 寄件單');
    expect(body.includes('開發期間您可以隨時上線試用'), 'process step 03 description rendered');
    expect(
      body.includes('訪談後您會拿到') && body.includes('監控會比您先發現'),
      'faq figcaptions address the reader as 您',
    );
    expect(body.includes('id="booking-dialog"'), 'booking dialog rendered');
    expect(
      ['web-development', 'consulting', 'automation', 'other'].every((v) =>
        body.includes(`<option value="${v}">`),
      ),
      'all service types offered',
    );
    expect(/href="\/_astro\/[^"]+\.css"/.test(body), 'fingerprinted CSS asset linked');
    // The page's client script is small enough that Astro may
    // inline it rather than emit a fingerprinted file — accept either.
    expect(
      /src="\/_astro\/[^"]+\.js"/.test(body) || body.includes('<script type="module">'),
      'page JS present (external or inlined)',
    );

    // 5b. The redesign mandates zero emoji sitewide. Typographic marks the
    // design does use (→ U+2192, ↗ U+2197, ✦ U+2726) are deliberately outside
    // these ranges, so they don't trip this.
    const EMOJI_RE = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{26FF}\u{FE0F}]/u;
    const emoji = body.match(new RegExp(EMOJI_RE, 'gu'));
    expect(emoji === null, `page contains no emoji${emoji ? ` (found: ${[...new Set(emoji)].join(' ')})` : ''}`);

    // 6. Hit a CSS asset and check cache headers
    const cssMatch = body.match(/href="(\/_astro\/[^"]+\.css)"/);
    if (cssMatch) {
      const cssRes = await fetch(`http://localhost:${HOST_PORT}${cssMatch[1]}`);
      expect(cssRes.status === 200, 'CSS asset returns 200');
      const cc = cssRes.headers.get('cache-control') ?? '';
      expect(cc.includes('immutable'), `CSS has immutable cache header (got "${cc}")`);
    } else {
      fail('could not extract CSS asset URL for cache-header test');
      failures++;
    }

    // 7. 404 fallback should yield index.html, not 404 (SPA-style fallback)
    const notFound = await fetch(`http://localhost:${HOST_PORT}/this-does-not-exist`);
    expect(notFound.status === 200, 'unknown path falls back to index.html');
  } finally {
    teardown();
  }

  if (failures > 0) {
    fail(`${failures} assertion(s) failed`);
    process.exit(1);
  }
  log('All smoke checks passed ✨');
}

process.on('SIGINT', () => { teardown(); process.exit(130); });

main().catch((err) => {
  fail(err.message);
  teardown();
  process.exit(1);
});
