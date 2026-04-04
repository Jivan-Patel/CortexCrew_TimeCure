import os
import shutil
import filecmp

dir1 = r"d:\Time Cure\Temp"
dir2 = r"d:\Time Cure\CortexCrew_TimeCure"
exclude_dirs = ['.git', 'node_modules', '__pycache__', '.venv', 'dist', 'build']
exclude_files = [r'ml\train_model.py', 'compare.py', 'diff_output.txt', 'diff_results.txt']

def sync_dirs(d1, d2, rel_path=""):
    try:
        items1 = set(os.listdir(os.path.join(d1, rel_path)))
    except:
        items1 = set()

    for ex in exclude_dirs:
        if ex in items1: items1.remove(ex)

    for item in items1:
        p1 = os.path.join(d1, rel_path, item)
        p2 = os.path.join(d2, rel_path, item)
        curr_rel = os.path.join(rel_path, item)
        
        # Skip excluded files
        skip = False
        for ef in exclude_files:
            if curr_rel == ef or curr_rel.replace('/', '\\') == ef.replace('/', '\\'):
                skip = True
        if skip:
            continue

        if os.path.isdir(p1):
            if not os.path.exists(p2):
                os.makedirs(p2)
            sync_dirs(d1, d2, curr_rel)
        else:
            if not os.path.exists(p2):
                print(f"Copying new file: {curr_rel}")
                shutil.copy2(p1, p2)
            else:
                if not filecmp.cmp(p1, p2, shallow=False):
                    print(f"Updating modified file: {curr_rel}")
                    shutil.copy2(p1, p2)

sync_dirs(dir1, dir2)
print("Sync complete.")
