from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
SLUG = "paella-espagnole-aux-fruits-de-mer"

# Recipe banners are wide 3:1 crops; icons are square 1:1 crops.
banner_master_path = ASSETS / f"{SLUG}_banner_big.webp"
icon_master_path = ASSETS / f"{SLUG}_icon_big.webp"

banner_master = Image.open(banner_master_path).convert("RGB")
icon_master = Image.open(icon_master_path).convert("RGB")

def save_variant(master, suffix, size):
    image = ImageOps.fit(
        master,
        size,
        method=Image.Resampling.LANCZOS,
        centering=(0.5, 0.5),
    )
    image.save(ASSETS / f"{SLUG}_{suffix}.webp", format="WEBP", quality=82, method=6)

save_variant(banner_master, "banner_big", (1774, 592))
save_variant(banner_master, "banner_medium", (1024, 341))
save_variant(banner_master, "banner_small", (512, 171))
save_variant(icon_master, "icon_big", (512, 512))
save_variant(icon_master, "icon_medium", (256, 256))
save_variant(icon_master, "icon_small", (128, 128))

print("Generated paella assets: 3:1 WebP banners and 1:1 WebP icons.")
