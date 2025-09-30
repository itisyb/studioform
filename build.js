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

    // Strip any unwanted external service comments
    let cleanedCode = result.code;
    const unwantedPatterns = [
      /\/\*[\s\S]*?jsDelivr[\s\S]*?\*\//gi,
      /\/\*[\s\S]*?Original file:[\s\S]*?\*\//gi,
      /\/\*[\s\S]*?Do NOT use SRI[\s\S]*?\*\//gi,
      /\/\*[\s\S]*?unpkg[\s\S]*?\*\//gi,
      /\/\*[\s\S]*?cdnjs[\s\S]*?\*\//gi
    ];

    unwantedPatterns.forEach(pattern => {
      cleanedCode = cleanedCode.replace(pattern, '');
    });

    // Validate: ensure only our preamble exists at the start of the file
    const allowedComment = '/* StudioForm Custom Fork - Minified */';
    const firstLine = cleanedCode.split('\n')[0];
    const hasCorrectPreamble = firstLine === allowedComment;

    // Check for any external service comments (only in comment blocks, not code)
    const commentBlocks = cleanedCode.match(/\/\*[\s\S]*?\*\//g) || [];
    const hasJsDelivrComment = commentBlocks.some(c => /jsDelivr/i.test(c));
    const hasOriginalFileComment = commentBlocks.some(c => /Original file:/i.test(c));
    const hasSRIComment = commentBlocks.some(c => /Do NOT use SRI/i.test(c));
    const hasUnpkgComment = commentBlocks.some(c => /unpkg\.com/i.test(c));

    const hasUnwantedComments = hasJsDelivrComment || hasOriginalFileComment || hasSRIComment || hasUnpkgComment;

    if (hasUnwantedComments) {
      console.warn('⚠️  Warning: External service comments detected!');
      if (hasJsDelivrComment) console.warn('   - jsDelivr comment found');
      if (hasOriginalFileComment) console.warn('   - Original file reference found');
      if (hasSRIComment) console.warn('   - SRI warning found');
      if (hasUnpkgComment) console.warn('   - unpkg reference found');
    }

    const commentValidation = hasCorrectPreamble && !hasUnwantedComments;

    // Write minified file
    fs.writeFile(outputFile, cleanedCode, 'utf8', (err) => {
      if (err) {
        console.error('❌ Error writing index.min.js:', err);
        process.exit(1);
      }

      const originalSize = code.length;
      const minifiedSize = cleanedCode.length;
      const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(2);

      console.log(`✅ Minified index.min.js (${(minifiedSize / 1024).toFixed(2)} KB)`);
      console.log(`📊 Size reduction: ${savings}%`);
      console.log(`💾 Saved ${((originalSize - minifiedSize) / 1024).toFixed(2)} KB`);
      console.log(`🔒 Comment validation: ${commentValidation ? 'PASSED ✓' : 'WARNING ⚠️'}\n`);
      console.log('✨ Build complete!');
    });

  } catch (error) {
    console.error('❌ Minification error:', error);
    process.exit(1);
  }
});