const obj2gltf = require('obj2gltf');
const { processGlb } = require('gltf-pipeline');
const fs = require('node:fs');
const path = require('node:path');

const MODELS = [
  {
    input: 'public/flower/anemone/12973_anemone_flower_v1_l2.obj',
    output: 'public/flower/anemone/anemone.glb',
    mtl: 'public/flower/anemone/12973_anemone_flower_v1_l2.mtl'
  },
  {
    input: 'public/flower/crocus/12974_crocus_flower_v1_l3.obj',
    output: 'public/flower/crocus/crocus.glb',
    mtl: 'public/flower/crocus/12974_crocus_flower_v1_l3.mtl'
  },
  {
    input: 'public/flower/rose/rose.obj',
    output: 'public/flower/rose/rose.glb',
    mtl: 'public/flower/rose/rose.mtl'
  },
  {
    input: 'public/tree/pinetree/Tree/Tree.obj',
    output: 'public/tree/pinetree/Tree/tree.glb',
    mtl: 'public/tree/pinetree/Tree/Tree.mtl'
  }
];

async function convertObjToGlb(config) {
  const inputPath = path.join(__dirname, '..', config.input);
  const outputPath = path.join(__dirname, '..', config.output);
  const mtlPath = config.mtl ? path.join(__dirname, '..', config.mtl) : null;

  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️  Skipping ${config.input} (not found)`);
    return;
  }

  try {
    console.log(`🔄 Converting ${config.input}...`);

    const options = {
      binary: true,
      separate: false,
      separateTextures: false,
      checkTransparency: true,
      secure: false,
      packOcclusion: false,
      metallicRoughness: true,
      specularGlossiness: false,
      unlit: false,
      overridingTextures: {},
      logger: () => {}
    };

    if (mtlPath && fs.existsSync(mtlPath)) {
      options.inputUpAxis = 'Z';
      options.outputUpAxis = 'Y';
    }

    const gltf = await obj2gltf(inputPath, options);

    const compressedGltf = await processGlb(gltf, {
      dracoOptions: {
        compressionLevel: 10,
        quantizePositionBits: 14,
        quantizeNormalBits: 10,
        quantizeTexcoordBits: 12,
        quantizeColorBits: 8,
        quantizeGenericBits: 12,
        unifiedQuantization: true
      }
    });

    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, compressedGltf.glb);

    const inputSize = fs.statSync(inputPath).size;
    const outputSize = fs.statSync(outputPath).size;
    const saved = ((inputSize - outputSize) / inputSize * 100).toFixed(1);

    console.log(`✓ ${config.output}`);
    console.log(`  ${(inputSize / 1024 / 1024).toFixed(2)}MB → ${(outputSize / 1024 / 1024).toFixed(2)}MB (${saved}% saved)`);
  } catch (error) {
    console.error(`✗ Failed to convert ${config.input}:`, error.message);
  }
}

async function main() {
  console.log('🎨 Converting OBJ/FBX models to GLB with Draco compression...\n');

  for (const config of MODELS) {
    await convertObjToGlb(config);
  }

  console.log('\n✅ Model conversion complete!');
  console.log('💡 Original OBJ files are preserved');
}

main().catch(console.error);
