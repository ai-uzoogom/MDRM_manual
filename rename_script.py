import os
import sys

base_dir = r"d:\Dropbox\00.우주곰프로젝트\00.MDRM\MDRM 교육매뉴얼\mkdocs\docs"
yaml_path = r"d:\Dropbox\00.우주곰프로젝트\00.MDRM\MDRM 교육매뉴얼\mkdocs\mkdocs.yml"

replacements = {
    "DAY 1": "PART 1",
    "DAY 2": "PART 2",
    "DAY 3": "PART 3",
    "DAY 4": "PART 4",
    "DAY1": "PART1",
    "DAY2": "PART2",
    "DAY3": "PART3",
    "DAY4": "PART4",
    "day1": "part1",
    "day2": "part2",
    "day3": "part3",
    "day4": "part4"
}

def replace_content(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        new_content = content
        for k, v in replacements.items():
            new_content = new_content.replace(k, v)

        if content != new_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated content in {filepath}")
    except Exception as e:
        print(f"Error reading/writing {filepath}: {e}")

# Update mkdocs.yml
replace_content(yaml_path)

# Ensure docs dir exists
if not os.path.exists(base_dir):
    print("Cannot find base_dir:", base_dir)
    sys.exit(1)

# Update all files in docs
for root, dirs, files in os.walk(base_dir):
    for filename in files:
        if filename.endswith(('.md', '.html', '.js', '.css', '.yml')):
            filepath = os.path.join(root, filename)
            replace_content(filepath)

# Rename files and directories bottom-up
for root, dirs, files in os.walk(base_dir, topdown=False):
    for filename in files:
        new_filename = filename
        for k, v in replacements.items():
            new_filename = new_filename.replace(k, v)
        if new_filename != filename:
            old_path = os.path.join(root, filename)
            new_path = os.path.join(root, new_filename)
            os.rename(old_path, new_path)
            print(f"Renamed file: {filename} -> {new_filename}")
            
    for dirname in dirs:
        new_dirname = dirname
        for k, v in replacements.items():
            new_dirname = new_dirname.replace(k, v)
        if new_dirname != dirname:
            old_path = os.path.join(root, dirname)
            new_path = os.path.join(root, new_dirname)
            os.rename(old_path, new_path)
            print(f"Renamed dir: {dirname} -> {new_dirname}")

print("Done.")
