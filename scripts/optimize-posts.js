const sharp = require('sharp');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = 'public/posts';
const MAX_WIDTH = 1600;

const walk = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((d) =>
      d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)],
    );

(async () => {
  for (const file of walk(ROOT).filter((f) => /\.(png|jpe?g)$/i.test(f))) {
    const before = fs.statSync(file).size;
    const buffer = await sharp(file)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .toFormat(path.extname(file).toLowerCase() === '.png' ? 'png' : 'jpeg', {
        quality: 82,
      })
      .toBuffer();
    if (buffer.length < before) {
      fs.writeFileSync(file, buffer);
      console.log(
        `${file}: ${(before / 1024).toFixed(0)}KB → ${(buffer.length / 1024).toFixed(0)}KB`,
      );
    }
  }
})();
