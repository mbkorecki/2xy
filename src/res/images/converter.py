import os
from PIL import Image

# Get the current folder where the script is running
folder_path = "."

print("Starting balanced PNG compression (Targeting under 100MB safely)...\n")

for filename in os.listdir(folder_path):
    if filename.lower().endswith(".png"):
        file_path = os.path.join(folder_path, filename)
        
        try:
            old_size = os.path.getsize(file_path) / 1024
            
            with Image.open(file_path) as img:
                # Ensure we work with clean RGBA data to protect alpha transparent layers
                img = img.convert("RGBA")
                
                # FIX: Uses FASTOCTREE (which supports transparency) but uses a 
                # maximum 256 color depth per image to avoid aggressive quality degradation.
                optimized_img = img.quantize(colors=256, method=Image.Quantize.FASTOCTREE)
                
                # Save with maximum file-structure compression
                optimized_img.save(file_path, "PNG", optimize=True, compress_level=9)
            
            new_size = os.path.getsize(file_path) / 1024
            savings = ((old_size - new_size) / old_size) * 100 if old_size > 0 else 0
            
            print(f"Optimized: {filename}")
            print(f"   Size: {old_size:.1f} KB -> {new_size:.1f} KB ({savings:.1f}% reduction)")
            
        except Exception as e:
            print(f"Error processing {filename}: {e}")

print("\nAll PNG images have been optimized to your target profile!")
