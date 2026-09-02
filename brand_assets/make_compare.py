from PIL import Image, ImageDraw
import os

OLD = "brand_assets/vehicle_backup"
NEW = "src/assets/vehicles"
OUT = "brand_assets/compare_sheet.png"

all_names = sorted(os.listdir(OLD))
vehicle_types = sorted(set(n.split("-")[0] for n in all_names))
cell_w, cell_h = 340, 240
pad = 10
label_h = 22

for vt in vehicle_types:
    names = [n for n in all_names if n.startswith(vt + "-")]
    rows = len(names)
    sheet = Image.new("RGB", (2 * cell_w + pad * 3, rows * (cell_h + label_h) + pad), "white")
    draw = ImageDraw.Draw(sheet)
    for i, name in enumerate(names):
        y = pad + i * (cell_h + label_h)
        old_im = Image.open(os.path.join(OLD, name)).convert("RGB")
        new_im = Image.open(os.path.join(NEW, name)).convert("RGB")
        old_im.thumbnail((cell_w, cell_h), Image.LANCZOS)
        new_im.thumbnail((cell_w, cell_h), Image.LANCZOS)
        sheet.paste(old_im, (pad, y + label_h))
        sheet.paste(new_im, (pad * 2 + cell_w, y + label_h))
        draw.text((pad, y), f"{name}  BEFORE (left) / AFTER (right)", fill="black")
    out_path = f"brand_assets/compare_{vt}.png"
    sheet.save(out_path)
    print("saved", out_path, sheet.size)
