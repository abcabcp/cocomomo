const sharp = require('sharp');
const fs = require('node:fs');
const path = require('node:path');

const TEXTURE_FILES = [
  {
    input: 'public/flower/rose/texture-green-paper-pattern-scratch-background-photo-hd-wallpaper.jpg',
    output: 'public/flower/rose/texture-green-paper-pattern-scratch-background-photo-hd-wallpaper.jpg',
    maxSize: 1024,
    quality: 80
  },
  {
    input: 'public/flower/rose/wildtextures-leather-Campo-rose.jpg',
    output: 'public/flower/rose/wildtextures-leather-Campo-rose.jpg',
    maxSize: 1024,
    quality: 80
  },
  {
    input: 'public/flower/rose/grass_texture225.jpg',
    output: 'public/flower/rose/grass_texture225.jpg',
    maxSize: 1024,
    quality: 80
  },
  {
    input: 'public/tree/pinetree/Tree/tree.jpeg',
    output: 'public/tree/pinetree/Tree/tree.jpeg',
    maxSize: 1024,
    quality: 75
  },
  {
    input: 'public/tree/pinetree/Tree/DB2X2_L01_Spec.png',
    output: 'public/tree/pinetree/Tree/DB2X2_L01_Spec.png',
    maxSize: 1024,
    quality: 80
  },
  {
    input: 'public/tree/pinetree/Tree/bark_0021.jpg',
    output: 'public/tree/pinetree/Tree/bark_0021.jpg',
    maxSize: 1024,
    quality: 75
  },
  {
    input: 'public/tree/pinetree/Tree/Tree.fbm/DB2X2_L01_Spec.png',
    output: 'public/tree/pinetree/Tree/Tree.fbm/DB2X2_L01_Spec.png',
    maxSize: 1024,
    quality: 80
  },
  {
    input: 'public/tree/pinetree/Tree/Tree.fbm/bark_0021.jpg',
    output: 'public/tree/pinetree/Tree/Tree.fbm/bark_0021.jpg',
    maxSize: 1024,
    quality: 75
  },
  {
    input: 'public/flower/anemone/12973_anemone_flower_diff.jpg',
    output: 'public/flower/anemone/12973_anemone_flower_diff.jpg',
    maxSize: 512,
    quality: 80
  },
  {
    input: 'public/flower/crocus/12974_crocus_flower_diff.jpg',
    output: 'public/flower/crocus/12974_crocus_flower_diff.jpg',
    maxSize: 512,
    quality: 80
  },
  {
    input: 'public/tree/mapletree/maple_bark.png',
    output: 'public/tree/mapletree/maple_bark.png',
    maxSize: 512,
    quality: 80
  },
  {
    input: 'public/tree/mapletree/maple_leaf.png',
    output: 'public/tree/mapletree/maple_leaf.png',
    maxSize: 512,
    quality: 80
  }
];

async function optimizeTexture(config) {
  const inputPath = path.join(__dirname, '..', config.input);
  const outputPath = path.join(__dirname, '..', config.output);
  
  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️  Skipping ${config.input} (not found)`);
    return;
  }

  const backupPath = `${inputPath}.backup`;
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(inputPath, backupPath);
  }

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    const needsResize = metadata.width > config.maxSize || metadata.height > config.maxSize;
    
    await image
      .resize(config.maxSize, config.maxSize, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: config.quality, mozjpeg: true })
      .toFile(`${outputPath}.tmp`);
    
    fs.renameSync(`${outputPath}.tmp`, outputPath);
    
    const originalSize = fs.statSync(backupPath).size;
    const newSize = fs.statSync(outputPath).size;
    const saved = ((originalSize - newSize) / originalSize * 100).toFixed(1);
    
    console.log(`✓ ${config.input}`);
    console.log(`  ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(newSize / 1024 / 1024).toFixed(2)}MB (${saved}% saved)`);
  } catch (error) {
    console.error(`✗ Failed to optimize ${config.input}:`, error.message);
  }
}

async function main() {
  console.log('🎨 Optimizing textures...\n');
  
  for (const config of TEXTURE_FILES) {
    await optimizeTexture(config);
  }
  
  console.log('\n✅ Texture optimization complete!');
  console.log('💡 Original files backed up with .backup extension');
}

main().catch(console.error);
