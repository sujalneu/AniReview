/**
 * Downloads anime GIFs using the Tenor v1 API (public demo key)
 * Saves real .gif files to the public/gifs/ folder for local hosting.
 */
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GIFS_DIR = path.join(__dirname, "gifs");

if (!fs.existsSync(GIFS_DIR)) {
  fs.mkdirSync(GIFS_DIR, { recursive: true });
}

// Tenor public demo key (officially documented by Tenor/Google)
const TENOR_KEY = "LIVDSRZULELA";

// Each entry: [filename, search query]
const SEARCHES = [
  ["naruto-rasengan.gif",    "naruto rasengan"],
  ["luffy-laugh.gif",        "luffy laugh one piece"],
  ["goku-transform.gif",     "goku super saiyan"],
  ["deku-smash.gif",         "deku smash my hero academia"],
  ["saitama-ok.gif",         "saitama ok one punch man"],
  ["l-think.gif",            "L death note thinking"],
  ["killua-lightning.gif",   "killua godspeed hunter x hunter"],
  ["eren-fight.gif",         "eren attack on titan"],
  ["hinata-jump.gif",        "hinata spike haikyuu"],
  ["gojo-domain.gif",        "gojo domain expansion jujutsu kaisen"],
  ["zenitsu-thunder.gif",    "zenitsu thunder breathing demon slayer"],
  ["tanjiro-water.gif",      "tanjiro water breathing demon slayer"],
  ["anya-smug.gif",          "anya spy x family smug"],
  ["nezuko-dance.gif",       "nezuko demon slayer"],
  ["spirited-noface.gif",    "no face spirited away"],
  ["totoro-wave.gif",        "totoro studio ghibli"],
  ["sailor-moon.gif",        "sailor moon transformation"],
  ["chopper-dance.gif",      "chopper one piece dance"],
  ["power-happy.gif",        "power chainsaw man"],
  ["lelouch-plan.gif",       "lelouch code geass"],
  ["luffy-gear5.gif",        "luffy gear 5"],
  ["itachi-susanoo.gif",     "itachi susanoo naruto"],
  ["levi-spin.gif",          "levi ackerman attack on titan"],
  ["light-laugh.gif",        "light yagami death note"],
  ["violet-cry.gif",         "violet evergarden"],
  ["rem-smile.gif",          "rem re zero"],
  ["miku-dance.gif",         "hatsune miku dance"],
  ["shikamaru-think.gif",    "shikamaru naruto thinking"],
  ["kiki-fly.gif",           "kiki delivery service"],
  ["ponyo-run.gif",          "ponyo studio ghibli"],
];

// --- Helpers ---

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "AniReview-GIF-Downloader/1.0" } }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error("JSON parse error: " + data.slice(0, 200))); }
      });
    }).on("error", reject);
  });
}

function downloadFile(destPath, url, maxRedirects = 8) {
  return new Promise((resolve) => {
    const proto = url.startsWith("https") ? https : http;
    const req = proto.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "image/gif,image/*,*/*;q=0.8",
        "Referer": "https://tenor.com/",
      }
    }, (res) => {
      // Follow redirects
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && maxRedirects > 0) {
        const next = res.headers.location.startsWith("http")
          ? res.headers.location
          : new URL(res.headers.location, url).toString();
        res.resume();
        return downloadFile(destPath, next, maxRedirects - 1).then(resolve);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return resolve({ ok: false, reason: `HTTP ${res.statusCode}` });
      }
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        const bytes = fs.statSync(destPath).size;
        resolve({ ok: true, bytes });
      });
      file.on("error", (err) => {
        fs.unlink(destPath, () => {});
        resolve({ ok: false, reason: err.message });
      });
    });
    req.setTimeout(20000, () => { req.destroy(); resolve({ ok: false, reason: "timeout" }); });
    req.on("error", (err) => resolve({ ok: false, reason: err.message }));
  });
}

// --- Main ---

async function run() {
  console.log(`\n🎌 Downloading ${SEARCHES.length} anime GIFs via Tenor API...\n`);
  let success = 0;

  for (const [filename, query] of SEARCHES) {
    const destPath = path.join(GIFS_DIR, filename);
    process.stdout.write(`[${filename}] Searching for "${query}"... `);

    try {
      // 1. Search Tenor for the GIF
      const apiUrl = `https://api.tenor.com/v1/search?q=${encodeURIComponent(query)}&key=${TENOR_KEY}&limit=3&media_filter=minimal`;
      const json = await fetchJson(apiUrl);

      if (!json.results || json.results.length === 0) {
        console.log("⚠ No results found");
        continue;
      }

      // Pick the first result that has a gif URL
      let gifUrl = null;
      for (const result of json.results) {
        const media = result.media?.[0];
        gifUrl = media?.gif?.url || media?.mediumgif?.url || media?.tinygif?.url;
        if (gifUrl) break;
      }

      if (!gifUrl) {
        console.log("⚠ No GIF URL in results");
        continue;
      }

      // 2. Download the GIF
      const result = await downloadFile(destPath, gifUrl);
      if (result.ok) {
        console.log(`✓ ${(result.bytes / 1024).toFixed(0)} KB`);
        success++;
      } else {
        console.log(`✗ ${result.reason}`);
      }
    } catch (err) {
      console.log(`✗ ${err.message}`);
    }
  }

  console.log(`\n✅ Done: ${success}/${SEARCHES.length} GIFs downloaded successfully.\n`);
  if (success < SEARCHES.length) {
    console.log("Tip: Missing GIFs will fall back to CDN URLs in the app.");
  }
}

run();
