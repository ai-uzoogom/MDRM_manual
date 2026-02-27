import os
import shutil

base_dir = r"d:/Dropbox/00.우주곰프로젝트/00.MDRM/MDRM 교육매뉴얼/mkdocs"
docs_dir = os.path.join(base_dir, 'docs')
assets_dir = os.path.join(docs_dir, 'assets', 'images')

def rename_and_merge(base):
    setup_dir = os.path.join(base, 'setup')
    operation_dir = os.path.join(base, 'operation')
    
    if os.path.exists(os.path.join(base, 'part1')):
        print(f"Renaming {os.path.join(base, 'part1')} to {setup_dir}")
        os.rename(os.path.join(base, 'part1'), setup_dir)

    os.makedirs(operation_dir, exist_ok=True)
    for p in ['part2', 'part3', 'part4']:
        p_dir = os.path.join(base, p)
        if os.path.exists(p_dir):
            for item in os.listdir(p_dir):
                print(f"Moving {item} from {p_dir} to {operation_dir}")
                shutil.move(os.path.join(p_dir, item), os.path.join(operation_dir, item))
            os.rmdir(p_dir)

rename_and_merge(docs_dir)
if os.path.exists(assets_dir):
    rename_and_merge(assets_dir)

# Rename files mapping
file_renames = {
    'MDRM_PART1_학습_안내.md': 'MDRM_설치_학습_안내.md',
    'MDRM_PART2_학습_안내.md': 'MDRM_운영_학습_안내_기본.md',
    'MDRM_PART3_학습_안내.md': 'MDRM_운영_학습_안내_심화.md',
    'MDRM_PART4_학습_안내.md': 'MDRM_운영_학습_안내_실전.md',
    'MDRM_PART1_학습_안내': 'MDRM_설치_학습_안내',
    'MDRM_PART2_학습_안내': 'MDRM_운영_학습_안내_기본',
    'MDRM_PART3_학습_안내': 'MDRM_운영_학습_안내_심화',
    'MDRM_PART4_학습_안내': 'MDRM_운영_학습_안내_실전'
}

for root, dirs, files in os.walk(docs_dir):
    for f in files:
        if f in file_renames:
            print(f"Renaming file {f} -> {file_renames[f]}")
            os.rename(os.path.join(root, f), os.path.join(root, file_renames[f]))
    for d in dirs:
        if d in file_renames:
            os.rename(os.path.join(root, d), os.path.join(root, file_renames[d]))

# String replacements across all .md and mkdocs.yml
replacements = [
    ('part1/MDRM_PART1_학습_안내', 'setup/MDRM_설치_학습_안내'),
    ('part2/MDRM_PART2_학습_안내', 'operation/MDRM_운영_학습_안내_기본'),
    ('part3/MDRM_PART3_학습_안내', 'operation/MDRM_운영_학습_안내_심화'),
    ('part4/MDRM_PART4_학습_안내', 'operation/MDRM_운영_학습_안내_실전'),
    ('MDRM_PART1_학습_안내', 'MDRM_설치_학습_안내'),
    ('MDRM_PART2_학습_안내', 'MDRM_운영_학습_안내_기본'),
    ('MDRM_PART3_학습_안내', 'MDRM_운영_학습_안내_심화'),
    ('MDRM_PART4_학습_안내', 'MDRM_운영_학습_안내_실전'),
    ('part1/', 'setup/'),
    ('part2/', 'operation/'),
    ('part3/', 'operation/'),
    ('part4/', 'operation/'),
]

for root, _, files in os.walk(base_dir):
    for f in files:
        if f.endswith('.md') or f == 'mkdocs.yml':
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            new_content = content
            for old, new in replacements:
                new_content = new_content.replace(old, new)
            
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                print(f"Updated links in {f}")
print("Transformation complete")
