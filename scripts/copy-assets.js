const fs = require('fs');
const path = require('path');

// Logic for cross-platform assets copying
const assetsToCopy = [
    {
        src: path.join(__dirname, '../src/prompts/system-prompt.md'),
        dest: path.join(__dirname, '../dist/prompts/system-prompt.md')
    }
];

// Ensure directories exist
assetsToCopy.forEach(asset => {
    const destDir = path.dirname(asset.dest);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    // Copy file
    try {
        if (fs.existsSync(asset.src)) {
            fs.copyFileSync(asset.src, asset.dest);
            console.log(`✅ Copied: ${asset.src} -> ${asset.dest}`);
        } else {
            console.warn(`⚠️ Source file not found: ${asset.src}`);
        }
    } catch (err) {
        console.error(`❌ Error copying ${asset.src}:`, err);
        process.exit(1);
    }
});
console.log('🎉 Assets copy complete.');
