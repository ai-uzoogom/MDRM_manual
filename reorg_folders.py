import os
import re
import shutil

base_dir = r"d:/Dropbox/00.우주곰프로젝트/00.MDRM/MDRM 교육매뉴얼/mkdocs"
docs_dir = os.path.join(base_dir, 'docs')

overview_files = [
    'MDRM_운영_학습_안내_기본.md', 'MDRM_메뉴_대시보드.md', 'MDRM_대시보드_관리.md', 'MDRM_대시보드_위젯.md',
    'MDRM_메뉴_시스템.md', 'MDRM_시스템_구성_관리.md', 'MDRM_시스템_등록_추가.md', 'MDRM_시스템_모니터링_알림.md',
    'MDRM_시스템_배포_작업.md', 'MDRM_시스템_계정_관리.md', 'MDRM_메뉴_워크플로우.md', 'MDRM_워크플로우_구성_관리.md',
    'MDRM_워크플로우_설계_컴포넌트.md', 'MDRM_워크플로우_변수_분기.md', 'MDRM_워크플로우_실행_모니터링.md',
    'MDRM_워크플로우_관리_리포트.md', 'MDRM_점검작업_개요.md', 'MDRM_점검작업_구성_관리.md', 'MDRM_점검_작업_관리.md',
    'MDRM_점검_실행_결과.md', 'MDRM_점검_스케줄_알림.md'
]

operation_files = [
    'MDRM_운영_학습_안내_심화.md', 'MDRM_자동화_영역.md', 'MDRM_워크플로우_유형.md', 'MDRM_워크플로우_시스템.md',
    'MDRM_워크플로우_그룹.md', 'MDRM_워크플로우_시나리오.md', 'MDRM_컴포넌트_설계_로직.md', 'MDRM_컴포넌트_실행_프로세스.md',
    'MDRM_주요_컴포넌트.md', 'MDRM_컴포넌트_템플릿_제작.md', 'MDRM_점검작업_스크립트.md', 'MDRM_점검작업_리스트.md'
]

practice_files = [
    'MDRM_운영_학습_안내_실전.md', 'MDRM_자동화_구현_체크포인트.md', 'MDRM_실전_시나리오_실습.md',
    'MDRM_트러블슈팅_가이드.md', 'MDRM_교육_마무리.md'
]

file_to_folder = {}
for f in overview_files: file_to_folder[f] = 'overview'
for f in operation_files: file_to_folder[f] = 'operation'
for f in practice_files: file_to_folder[f] = 'practice'

# 1. Update mkdocs.yml
mkdocs_path = os.path.join(base_dir, 'mkdocs.yml')
with open(mkdocs_path, 'r', encoding='utf-8') as f:
    mkdocs_content = f.read()

for filename, folder in file_to_folder.items():
    # Replace references like 'operation/filename' with 'folder/filename'
    mkdocs_content = re.sub(rf'operation/{filename}', rf'{folder}/{filename}', mkdocs_content)

with open(mkdocs_path, 'w', encoding='utf-8') as f:
    f.write(mkdocs_content)
    
print("Updated mkdocs.yml")

# 2. Update inter-document links and move files
os.makedirs(os.path.join(docs_dir, 'overview'), exist_ok=True)
os.makedirs(os.path.join(docs_dir, 'operation'), exist_ok=True)
os.makedirs(os.path.join(docs_dir, 'practice'), exist_ok=True)

# First change links in ALL files (even those not in these lists, just to be safe)
for root, _, files in os.walk(docs_dir):
    for md_file in files:
        if not md_file.endswith('.md'): continue
        file_path = os.path.join(root, md_file)
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content
        
        # We need to know where the current file will end up to calculate relative paths properly
        current_folder = os.path.basename(root)
        if md_file in file_to_folder:
            current_folder = file_to_folder[md_file]
            
        for target_file, target_folder in file_to_folder.items():
            if current_folder == target_folder:
                # Target is in the same folder, so link should just be 'target_file' or './target_file'
                # But it might currently be written as '../operation/target' if linking from another folder
                # We'll regex replace just the filename links to be safe, if they don't contain directories
                new_content = re.sub(rf'(?<!/){target_file}', target_file, new_content)
                new_content = re.sub(rf'\.\./operation/{target_file}', target_file, new_content)
            else:
                # Target is in a different folder, link should be '../target_folder/target_file'
                new_content = re.sub(rf'(?<!/){target_file}', f'../{target_folder}/{target_file}', new_content)
                new_content = re.sub(rf'\.\./operation/{target_file}', f'../{target_folder}/{target_file}', new_content)
                
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)

# Now move the files
for filename, folder in file_to_folder.items():
    src = os.path.join(docs_dir, 'operation', filename)
    dst = os.path.join(docs_dir, folder, filename)
    if os.path.exists(src) and src != dst:
        shutil.move(src, dst)
        print(f"Moved {filename} to {folder}")

print("Done organizing MD files!")
