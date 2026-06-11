#!/usr/bin/env python3
"""
VCARE Image Optimization Script
Automatically optimizes all images in the repository
"""

import os
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("ERROR: PIL/Pillow not installed")
    print("Install with: pip install Pillow")
    sys.exit(1)


class ImageOptimizer:
    """Optimize images with various strategies"""

    def __init__(self, quality=85, max_width=1200):
        self.quality = quality
        self.max_width = max_width

    def get_file_size(self, filepath):
        """Get file size in KB"""
        return os.path.getsize(filepath) / 1024

    def optimize_png(self, input_path, output_path=None):
        """Optimize PNG image"""
        if output_path is None:
            output_path = input_path

        original_size = self.get_file_size(input_path)

        try:
            img = Image.open(input_path)

            # Resize if needed
            if img.width > self.max_width:
                ratio = self.max_width / img.width
                new_height = int(img.height * ratio)
                img = img.resize((self.max_width, new_height), Image.Resampling.LANCZOS)

            # Save optimized
            img.save(
                output_path,
                'PNG',
                optimize=True,
                quality=self.quality
            )

            optimized_size = self.get_file_size(output_path)
            reduction = ((original_size - optimized_size) / original_size) * 100

            return {
                'success': True,
                'original_size': original_size,
                'optimized_size': optimized_size,
                'reduction_percent': reduction,
                'output_path': output_path
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

    def optimize_jpg(self, input_path, output_path=None):
        """Optimize JPEG image"""
        if output_path is None:
            output_path = input_path

        original_size = self.get_file_size(input_path)

        try:
            img = Image.open(input_path)

            # Resize if needed
            if img.width > self.max_width:
                ratio = self.max_width / img.width
                new_height = int(img.height * ratio)
                img = img.resize((self.max_width, new_height), Image.Resampling.LANCZOS)

            # Convert RGBA to RGB if needed
            if img.mode == 'RGBA':
                rgb_img = Image.new('RGB', img.size, (255, 255, 255))
                rgb_img.paste(img, mask=img.split()[3])
                img = rgb_img

            # Save optimized
            img.save(output_path, 'JPEG', quality=self.quality, optimize=True)

            optimized_size = self.get_file_size(output_path)
            reduction = ((original_size - optimized_size) / original_size) * 100

            return {
                'success': True,
                'original_size': original_size,
                'optimized_size': optimized_size,
                'reduction_percent': reduction,
                'output_path': output_path
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

    def to_webp(self, input_path, output_path, quality=85):
        """Convert image to WebP format"""
        original_size = self.get_file_size(input_path)

        try:
            img = Image.open(input_path)

            # Convert RGBA to RGB if needed
            if img.mode == 'RGBA':
                rgb_img = Image.new('RGB', img.size, (255, 255, 255))
                rgb_img.paste(img, mask=img.split()[3])
                img = rgb_img

            # Save as WebP
            img.save(output_path, 'WEBP', quality=quality)

            webp_size = self.get_file_size(output_path)
            reduction = ((original_size - webp_size) / original_size) * 100

            return {
                'success': True,
                'original_size': original_size,
                'webp_size': webp_size,
                'reduction_percent': reduction,
                'output_path': output_path
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }


def main():
    """Main optimization script"""
    print("🖼️  VCARE Image Optimization Script")
    print("=" * 50)

    optimizer = ImageOptimizer(quality=85, max_width=1200)

    # Find and optimize images
    image_extensions = ('.png', '.jpg', '.jpeg')
    optimized_count = 0

    # Create assets directory if needed
    assets_dir = Path('assets/images')
    assets_dir.mkdir(parents=True, exist_ok=True)

    for root, dirs, files in os.walk('.'):
        # Skip node_modules and hidden directories
        dirs[:] = [d for d in dirs if not d.startswith('.') and d != 'node_modules']

        for file in files:
            if file.lower().endswith(image_extensions):
                filepath = os.path.join(root, file)

                # Skip if already in assets/images
                if 'assets/images' in filepath:
                    continue

                print(f"\n📷 Processing: {filepath}")

                if file.lower().endswith('.png'):
                    result = optimizer.optimize_png(filepath)
                else:
                    result = optimizer.optimize_jpg(filepath)

                if result['success']:
                    print(f"   ✅ Original: {result['original_size']:.1f} KB")
                    print(f"   ✅ Optimized: {result['optimized_size']:.1f} KB")
                    print(f"   ✅ Reduction: {result['reduction_percent']:.1f}%")

                    # Also create WebP version
                    webp_path = os.path.splitext(filepath)[0] + '.webp'
                    webp_result = optimizer.to_webp(filepath, webp_path, quality=85)

                    if webp_result['success']:
                        print(f"   ✅ WebP: {webp_result['webp_size']:.1f} KB")
                        print(f"   ✅ WebP Reduction: {webp_result['reduction_percent']:.1f}%")

                    optimized_count += 1
                else:
                    print(f"   ❌ Error: {result['error']}")

    print(f"\n{'=' * 50}")
    print(f"✅ Optimization Complete!")
    print(f"📊 Total images optimized: {optimized_count}")
    print(f"\n💡 Next steps:")
    print(f"   1. Review optimized images")
    print(f"   2. Update HTML to use new images")
    print(f"   3. Use <picture> element for WebP fallback")
    print(f"   4. Run Lighthouse audit: npm run lighthouse")


if __name__ == '__main__':
    main()
