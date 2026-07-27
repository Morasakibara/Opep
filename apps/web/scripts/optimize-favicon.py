#!/usr/bin/env python3
"""Optimise favicon.png and ensure favicon.ico exists."""
import os, sys

def optimize():
    try:
        from PIL import Image
    except ImportError:
        print("[ERROR] Pillow not available")
        return False
    
    public_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'public')
    favicon_png = os.path.join(public_dir, 'favicon.png')
    
    if not os.path.exists(favicon_png):
        print(f"[ERROR] {favicon_png} not found!")
        return False
    
    original_size = os.path.getsize(favicon_png)
    print(f"[INFO] Original favicon.png: {original_size} bytes ({original_size/1024:.1f} KB)")
    
    img = Image.open(favicon_png)
    
    # 1. Create favicon.ico (multi-size)
    ico_path = os.path.join(public_dir, 'favicon.ico')
    img.save(ico_path, format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
    ico_size = os.path.getsize(ico_path)
    print(f"[OK] favicon.ico: {ico_size} bytes ({ico_size/1024:.1f} KB)")
    
    # 2. Create optimized 32x32 PNG (no quantize for RGBA)
    small_path = os.path.join(public_dir, 'favicon-32x32.png')
    small = img.resize((32, 32), Image.LANCZOS)
    # Convert to P mode with palette for smaller size (only if not RGBA needed)
    if small.mode == 'RGBA':
        # Keep RGBA but optimize
        small.save(small_path, optimize=True)
    else:
        small = small.quantize(colors=256)
        small.save(small_path, optimize=True)
    small_size = os.path.getsize(small_path)
    print(f"[OK] favicon-32x32.png: {small_size} bytes ({small_size/1024:.1f} KB)")
    
    # 3. Optimize original PNG (in-place)
    opt_path = os.path.join(public_dir, 'favicon-optimized.png')
    img.save(opt_path, optimize=True)
    opt_size = os.path.getsize(opt_path)
    print(f"[OK] favicon-optimized.png: {opt_size} bytes ({opt_size/1024:.1f} KB)")
    
    # Replace original with optimized version
    if opt_size < original_size:
        os.replace(opt_path, favicon_png)
        print(f"[OK] Replaced original with optimized version (saved {original_size - opt_size} bytes)")
    else:
        os.remove(opt_path)
        print(f"[OK] Original already optimized, keeping as-is")
    
    return True

if __name__ == '__main__':
    success = optimize()
    sys.exit(0 if success else 1)
