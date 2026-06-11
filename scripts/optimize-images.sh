#!/bin/bash

# VCARE Image Optimization Bash Script
# Quick optimization using ImageMagick or ffmpeg

set -e

LOGO_FILE="FINAL LOGO BLUE .png"
OUTPUT_DIR="assets/images"
QUALITY=85
MAX_WIDTH=1200

echo "🖼️  VCARE Logo Optimization"
echo "===================================="

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Check if file exists
if [ ! -f "$LOGO_FILE" ]; then
    echo "❌ Error: Logo file not found: $LOGO_FILE"
    exit 1
fi

echo "📋 Input: $LOGO_FILE"
ORIGINAL_SIZE=$(du -h "$LOGO_FILE" | cut -f1)
echo "📊 Original size: $ORIGINAL_SIZE"

# Check available tools
if command -v convert &> /dev/null; then
    echo "✅ ImageMagick found"
    TOOL="imagemagick"
elif command -v ffmpeg &> /dev/null; then
    echo "✅ FFmpeg found"
    TOOL="ffmpeg"
else
    echo "❌ Neither ImageMagick nor FFmpeg found"
    echo "Install with: sudo apt-get install imagemagick"
    exit 1
fi

# Optimize PNG
echo ""
echo "🔄 Optimizing PNG..."
if [ "$TOOL" = "imagemagick" ]; then
    convert "$LOGO_FILE" \
        -quality $QUALITY \
        -strip \
        -interlace Plane \
        -resize ${MAX_WIDTH}x \
        "$OUTPUT_DIR/logo-large.png"
else
    ffmpeg -i "$LOGO_FILE" \
        -vf scale=$MAX_WIDTH:-1 \
        -q:v 3 \
        "$OUTPUT_DIR/logo-large.png"
fi
echo "✅ Saved: $OUTPUT_DIR/logo-large.png"

# Create medium version
echo "🔄 Creating medium version..."
if [ "$TOOL" = "imagemagick" ]; then
    convert "$LOGO_FILE" \
        -quality $QUALITY \
        -strip \
        -resize 800x \
        "$OUTPUT_DIR/logo-medium.png"
else
    ffmpeg -i "$LOGO_FILE" \
        -vf scale=800:-1 \
        -q:v 3 \
        "$OUTPUT_DIR/logo-medium.png"
fi
echo "✅ Saved: $OUTPUT_DIR/logo-medium.png"

# Create small version
echo "🔄 Creating small version..."
if [ "$TOOL" = "imagemagick" ]; then
    convert "$LOGO_FILE" \
        -quality $QUALITY \
        -strip \
        -resize 400x \
        "$OUTPUT_DIR/logo-small.png"
else
    ffmpeg -i "$LOGO_FILE" \
        -vf scale=400:-1 \
        -q:v 3 \
        "$OUTPUT_DIR/logo-small.png"
fi
echo "✅ Saved: $OUTPUT_DIR/logo-small.png"

# Convert to WebP
echo ""
echo "🔄 Converting to WebP..."
if [ "$TOOL" = "imagemagick" ]; then
    convert "$OUTPUT_DIR/logo-large.png" -quality $QUALITY "$OUTPUT_DIR/logo-large.webp"
    convert "$OUTPUT_DIR/logo-medium.png" -quality $QUALITY "$OUTPUT_DIR/logo-medium.webp"
    convert "$OUTPUT_DIR/logo-small.png" -quality $QUALITY "$OUTPUT_DIR/logo-small.webp"
else
    ffmpeg -i "$OUTPUT_DIR/logo-large.png" -q:v 3 "$OUTPUT_DIR/logo-large.webp" -y
    ffmpeg -i "$OUTPUT_DIR/logo-medium.png" -q:v 3 "$OUTPUT_DIR/logo-medium.webp" -y
    ffmpeg -i "$OUTPUT_DIR/logo-small.png" -q:v 3 "$OUTPUT_DIR/logo-small.webp" -y
fi
echo "✅ WebP files created"

# Display results
echo ""
echo "===================================="
echo "📊 Results:"
echo ""

for file in "$OUTPUT_DIR"/logo-*.png; do
    SIZE=$(du -h "$file" | cut -f1)
    echo "✅ $(basename $file): $SIZE"
done

for file in "$OUTPUT_DIR"/logo-*.webp; do
    SIZE=$(du -h "$file" | cut -f1)
    echo "✅ $(basename $file): $SIZE (WebP)"
done

echo ""
echo "===================================="
echo "🎉 Optimization Complete!"
echo ""
echo "💡 Next steps:"
echo "   1. Update HTML to use optimized images"
echo "   2. Use responsive <picture> element"
echo "   3. Add loading=\"lazy\" attribute"
echo "   4. Test with Lighthouse"
