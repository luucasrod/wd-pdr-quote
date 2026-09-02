from PIL import Image, ImageFilter
import os

SRC = "src/assets/vehicles"
SCALE = 2

for f in sorted(os.listdir(SRC)):
    if not f.endswith(".jpg"):
        continue
    p = os.path.join(SRC, f)
    im = Image.open(p).convert("RGB")
    w, h = im.size
    up = im.resize((w * SCALE, h * SCALE), Image.LANCZOS)
    up = up.filter(ImageFilter.UnsharpMask(radius=1.4, percent=95, threshold=2))
    up.save(p, "JPEG", quality=90, optimize=True)
    print(f, im.size, "->", up.size, os.path.getsize(p))
