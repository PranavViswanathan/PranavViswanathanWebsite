import os
import json
from pathlib import Path

PHOTOGRAPHY_DIR = "assets/photography"
SUPPORTED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'}

def is_image_file(filename):
    return Path(filename).suffix.lower() in SUPPORTED_EXTENSIONS

def generate_photo_name(filename):
    name = Path(filename).stem
    name = name.replace('_', ' ').replace('-', ' ')
    return ' '.join(word.capitalize() for word in name.split())

def load_existing_albums():
    albums_file = os.path.join(PHOTOGRAPHY_DIR, "albums.json")
    
    if os.path.exists(albums_file):
        try:
            with open(albums_file, 'r') as f:
                return {album['folder']: album for album in json.load(f)}
        except json.JSONDecodeError:
            print("Warning: Existing albums.json is invalid, will create fresh")
            return {}
    return {}

def select_cover_image(album_folder, photos, existing_cover=None):
    print(f"\n📸 Select cover image for '{album_folder}':")
    print("0. Use cover.jpg/cover.png (if exists)")
    
    for idx, photo in enumerate(photos, 1):
        print(f"{idx}. {photo['filename']}")
    
    if existing_cover:
        cover_filename = existing_cover.split('/')[-1]
        print(f"\nCurrent cover: {cover_filename}")
    
    print("\nEnter number (or press Enter to keep current/use default):")
    
    choice = input("> ").strip()
    
    if not choice:
        if existing_cover:
            return existing_cover
        cover_files = ['cover.jpg', 'cover.png', 'cover.jpeg']
        album_path = os.path.join(PHOTOGRAPHY_DIR, album_folder)
        for cover_file in cover_files:
            if os.path.exists(os.path.join(album_path, cover_file)):
                return f"assets/photography/{album_folder}/{cover_file}"
        return f"assets/photography/{album_folder}/{photos[0]['filename']}"
    
    try:
        choice = int(choice)
        if choice == 0:
            cover_files = ['cover.jpg', 'cover.png', 'cover.jpeg']
            album_path = os.path.join(PHOTOGRAPHY_DIR, album_folder)
            for cover_file in cover_files:
                if os.path.exists(os.path.join(album_path, cover_file)):
                    return f"assets/photography/{album_folder}/{cover_file}"
            print("⚠️  No cover.jpg/cover.png found, using first photo")
            return f"assets/photography/{album_folder}/{photos[0]['filename']}"
        elif 1 <= choice <= len(photos):
            return f"assets/photography/{album_folder}/{photos[choice-1]['filename']}"
        else:
            print("Invalid choice, using default")
            return f"assets/photography/{album_folder}/{photos[0]['filename']}"
    except ValueError:
        print("Invalid input, using default")
        return f"assets/photography/{album_folder}/{photos[0]['filename']}"

def scan_photography_folder(interactive=True):
    albums = []
    existing_albums = load_existing_albums()
    
    if not os.path.exists(PHOTOGRAPHY_DIR):
        print(f"Error: {PHOTOGRAPHY_DIR} directory not found!")
        return albums
    
    for album_folder in sorted(os.listdir(PHOTOGRAPHY_DIR)):
        album_path = os.path.join(PHOTOGRAPHY_DIR, album_folder)
        
        if not os.path.isdir(album_path):
            continue
        
        if album_folder.startswith('.'):
            continue
        
        existing_album = existing_albums.get(album_folder)
        existing_photo_map = {}
        
        if existing_album:
            existing_photo_map = {
                photo['filename']: photo['name'] 
                for photo in existing_album.get('photos', [])
            }
        
        photos = []
        
        for filename in sorted(os.listdir(album_path)):
            if not is_image_file(filename):
                continue
            
            if filename.lower() in ['cover.jpg', 'cover.png', 'cover.jpeg']:
                continue
            
            if filename in existing_photo_map:
                photo_name = existing_photo_map[filename]
            else:
                photo_name = generate_photo_name(filename)
            
            photos.append({
                "filename": filename,
                "name": photo_name
            })
        
        if not photos:
            print(f"Skipping {album_folder}: no photos found")
            continue
        
        if interactive and (not existing_album or input(f"\nCustomize cover for '{album_folder}'? (y/N): ").lower() == 'y'):
            cover_image = select_cover_image(album_folder, photos, existing_album.get('cover') if existing_album else None)
        elif existing_album and existing_album.get('cover'):
            cover_image = existing_album['cover']
        else:
            cover_files = ['cover.jpg', 'cover.png', 'cover.jpeg']
            cover_image = None
            for cover_file in cover_files:
                if os.path.exists(os.path.join(album_path, cover_file)):
                    cover_image = f"assets/photography/{album_folder}/{cover_file}"
                    break
            if not cover_image:
                cover_image = f"assets/photography/{album_folder}/{photos[0]['filename']}"
        
        if existing_album and existing_album.get('name'):
            album_name = existing_album['name']
        else:
            album_name = album_folder.replace('_', ' ').replace('-', ' ').title()
            if interactive:
                custom_name = input(f"\nAlbum name for '{album_folder}' (press Enter for '{album_name}'): ").strip()
                if custom_name:
                    album_name = custom_name
        
        albums.append({
            "name": album_name,
            "folder": album_folder,
            "cover": cover_image,
            "photos": photos
        })
        
        if existing_album:
            new_photos = len(photos) - len(existing_photo_map)
            if new_photos > 0:
                print(f"✓ Updated album '{album_name}' (+{new_photos} new photos, {len(photos)} total)")
            else:
                print(f"✓ Refreshed album '{album_name}' ({len(photos)} photos)")
        else:
            print(f"✓ Added new album '{album_name}' with {len(photos)} photos")
    
    removed_albums = set(existing_albums.keys()) - {album['folder'] for album in albums}
    for removed in removed_albums:
        print(f"✗ Removed album '{existing_albums[removed]['name']}' (folder no longer exists)")
    
    return albums

def main():
    import sys
    
    interactive = '--auto' not in sys.argv
    
    print("Photography Portfolio Generator")
    print("================================")
    print(f"Scanning: {PHOTOGRAPHY_DIR}\n")
    
    if not interactive:
        print("Running in AUTO mode (no prompts)\n")
    
    albums = scan_photography_folder(interactive)
    
    if not albums:
        print("\nNo albums found! Make sure you have:")
        print(f"1. Created the {PHOTOGRAPHY_DIR} directory")
        print("2. Added subfolders for each album (e.g., nature/, portraits/)")
        print("3. Added image files to those folders")
        return
    
    output_file = os.path.join(PHOTOGRAPHY_DIR, "albums.json")
    
    with open(output_file, 'w') as f:
        json.dump(albums, f, indent=4)
    
    print(f"\n✓ Successfully updated {output_file}")
    print(f"✓ Total albums: {len(albums)}")
    print(f"✓ Total photos: {sum(len(album['photos']) for album in albums)}")
    print("\n💡 Tips:")
    print("   - Name a file 'cover.jpg' to auto-use it as album cover")
    print("   - Run 'python generate_albums.py --auto' to skip prompts")
    print("   - Edit albums.json manually for fine-tuning")
    print("\nYour portfolio is ready to use!")

if __name__ == "__main__":
    main()