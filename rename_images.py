import os

path = "public/images"
files = os.listdir(path)

for filename in files:
    if filename.startswith("Bild") and filename.endswith(".jpg"):
        try:
            # Extract number
            num_part = filename.replace("Bild", "").replace(".jpg", "")
            if num_part.isdigit():
                num = int(num_part)
                new_name = f"wunde_{num:02d}.jpg"
                src = os.path.join(path, filename)
                dst = os.path.join(path, new_name)
                os.rename(src, dst)
                print(f"Renamed {filename} to {new_name}")
        except Exception as e:
            print(f"Error renaming {filename}: {e}")
