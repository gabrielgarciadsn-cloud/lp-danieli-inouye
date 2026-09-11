"""Generate lossless WebP copies; leave original PNG files untouched."""
from pathlib import Path
from PIL import Image

image_dir = Path(__file__).resolve().parents[1] / "assets" / "images"
names = ("gravar-celular", "ensinar-sem-aparecer", "organizar-ideias",
         "assistir-curso", "bonus-canva", "bonus-prompts-ia", "bonus-apresentacoes")
for name in names:
    source = image_dir / f"{name}.png"
    destination = image_dir / f"{name}.webp"
    with Image.open(source) as original:
        options = {"icc_profile": original.info["icc_profile"]} if original.info.get("icc_profile") else {}
        original.save(destination, "WEBP", lossless=True, method=6, **options)
        with Image.open(destination) as converted:
            assert original.convert("RGBA").tobytes() == converted.convert("RGBA").tobytes()
        print(f"{name}: {original.width}x{original.height}, {source.stat().st_size} -> {destination.stat().st_size} bytes; pixels unchanged")
