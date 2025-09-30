#!/usr/bin/env node

/**
 * Build Script for StudioForm
 * Automatically minifies index.js to index.min.js
 */

const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

const inputFile = path.join(__dirname, 'index.js');
const outputFile = path.join(__dirname, 'index.min.js');

console.log('🔧 Building StudioForm...\n');

// Read the source file
fs.readFile(inputFile, 'utf8', async (err, code) => {
  if (err) {
    console.error('❌ Error reading index.js:', err);
    process.exit(1);
  }

  console.log(`📖 Read index.js (${(code.length / 1024).toFixed(2)} KB)`);

  try {
    // Minify with Terser
    const result = await minify(code, {
      compress: {
        dead_code: true,
        drop_console: false,
        drop_debugger: true,
        keep_classnames: false,
        keep_fnames: false,
        passes: 2
      },
      mangle: {
        toplevel: false,
        safari10: true
      },
      format: {
        comments: false,
        preamble: '/* StudioForm Custom Fork - Minified */'
      },
      sourceMap: false
    });

    if (result.error) {
      throw result.error;
    }

    // Write minified file
    fs.writeFile(outputFile, result.code, 'utf8', (err) => {
      if (err) {
        console.error('❌ Error writing index.min.js:', err);
        process.exit(1);
      }

      const originalSize = code.length;
      const minifiedSize = result.code.length;
      const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(2);

      console.log(`✅ Minified index.min.js (${(minifiedSize / 1024).toFixed(2)} KB)`);
      console.log(`📊 Size reduction: ${savings}%`);
      console.log(`💾 Saved ${((originalSize - minifiedSize) / 1024).toFixed(2)} KB\n`);
      console.log('✨ Build complete!');
    });

  } catch (error) {
    console.error('❌ Minification error:', error);
    process.exit(1);
  }
});