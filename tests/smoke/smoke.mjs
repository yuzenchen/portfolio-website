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
    expect(body.includes('id="typeWord"'), 'terminal prompt typewriter rendered');
    expect(body.includes('id="cvWave"'), 'hero wave canvas rendered');
    expect(body.includes('marquee-track'), 'marquee rendered');
    expect(body.includes('id="case"'), 'case study section rendered');
    expect(body.includes('已上線營運中'), 'case status badge rendered');
    expect(body.includes('data-auto-open'), 'expandable detail rendered');
    expect(body.includes('case-gallery'), 'case gallery rendered');
    expect(body.includes('bento-cell--wide'), 'bento results rendered');
    expect(body.includes('umimididi.com'), 'live-site link rendered');
    expect(body.includes('其他作品'), 'other work rendered');
    expect(body.includes('SECURITY'), 'cve category badge rendered');
    expect(body.includes('專業服務'), 'services section rendered');
    expect(body.includes('id="stack"'), 'tech stack section rendered');
    expect(body.includes('綠界科技 ECPay'), 'local logistics chip rendered');
    expect(body.includes('有專案想討論嗎'), 'contact card rendered');
    expect(body.includes('id="booking-dialog"'), 'booking dialog rendered');
    expect(/href="\/_astro\/[^"]+\.css"/.test(body), 'fingerprinted CSS asset linked');
    // The page's only script (wave canvas) is small enough that Astro may
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
