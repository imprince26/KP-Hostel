/**
 * Converts the large photographic assets in `public/` into optimised WebP
 * files.
 *
 * The hostel photographs were originally committed as multi-megabyte PNGs.
 * `next/image` re-encodes them at request time, but the optimizer still has to
 * download and decode the oversized original on a cold cache, which is the
 * slowest part of the very first request for each new size. Shipping an
 * already-optimised source keeps the first byte fast and shrinks the
 * deployment.
 *
 * Usage:
 *   bun run images:optimize
 */
import { readdir, stat } from "node:fs/promises";
import { join, relative, parse } from "node:path";
import sharp from "sharp";

const PUBLIC_DIR = join(process.cwd(), "public");

/** Only convert assets that are actually large enough to matter. */
const MIN_BYTES = 400 * 1024;

/** Longest edge kept in the optimised output. */
const MAX_EDGE = 2400;

const QUALITY = 82;

async function* walk(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      yield* walk(fullPath);
    } else if (/\.(png|jpe?g)$/i.test(entry.name)) {
      yield fullPath;
    }
  }
}

async function main() {
  const files: string[] = [];

  for await (const file of walk(PUBLIC_DIR)) {
    const { size } = await stat(file);
    if (size >= MIN_BYTES) files.push(file);
  }

  if (files.length === 0) {
    console.log("No oversized images found. Nothing to do.");
    return;
  }

  let saved = 0;

  for (const file of files) {
    const { name, dir } = parse(file);
    const target = join(dir, `${name}.webp`);

    const before = (await stat(file)).size;

    await sharp(file)
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(target);

    const after = (await stat(target)).size;
    saved += before - after;

    console.log(
      `${relative(process.cwd(), file)} -> ${relative(process.cwd(), target)}  ` +
        `${(before / 1024 / 1024).toFixed(2)}MB -> ${(after / 1024).toFixed(0)}KB`
    );
  }

  console.log(`\nTotal saved: ${(saved / 1024 / 1024).toFixed(2)}MB`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
