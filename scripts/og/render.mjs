// Renders scripts/og/og.html to public/og.png (1200x630) with headless Chrome.
// No dependencies. Usage: npm run og   (Chrome path: env CHROME_PATH)
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const WIDTH = 1200;
const HEIGHT = 630;

const here = dirname(fileURLToPath(import.meta.url));
const htmlPath = resolve(here, 'og.html');
const outPath = resolve(here, '../../public/og.png');
const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

if (!existsSync(chrome)) {
  console.error(`Chrome not found at ${chrome}. Set CHROME_PATH.`);
  process.exit(1);
}

function readPngSize(file) {
  const buf = readFileSync(file);
  const sig = '89504e470d0a1a0a';
  if (buf.length < 24 || buf.subarray(0, 8).toString('hex') !== sig || buf.toString('ascii', 12, 16) !== 'IHDR') {
    return null;
  }
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function render(heightOffset) {
  const profile = mkdtempSync(join(tmpdir(), 'og-chrome-'));
  try {
    if (existsSync(outPath)) unlinkSync(outPath);
    const args = [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--no-first-run',
      '--no-default-browser-check',
      `--user-data-dir=${profile}`,
      '--force-device-scale-factor=1',
      `--window-size=${WIDTH},${HEIGHT + heightOffset}`,
      '--virtual-time-budget=8000',
      `--screenshot=${outPath}`,
      pathToFileURL(htmlPath).href,
    ];
    const res = spawnSync(chrome, args, { stdio: 'inherit', timeout: 60000 });
    if (res.error) throw res.error;
  } finally {
    rmSync(profile, { recursive: true, force: true });
  }
  return existsSync(outPath) ? readPngSize(outPath) : null;
}

let size = render(0);
if (size && size.height !== HEIGHT && size.width === WIDTH) {
  // Some headless builds subtract browser chrome from the window; compensate once.
  size = render(HEIGHT - size.height);
}

if (!size) {
  console.error(`Failed: ${outPath} was not written or is not a PNG.`);
  process.exit(1);
}
if (size.width !== WIDTH || size.height !== HEIGHT) {
  console.error(`Failed: og.png is ${size.width}x${size.height}, expected ${WIDTH}x${HEIGHT}.`);
  process.exit(1);
}
console.log(`Wrote ${outPath} (${size.width}x${size.height}, ${statSync(outPath).size} bytes)`);
