import os
import re

base_dir = r"d:/Dropbox/00.우주곰프로젝트/00.MDRM/MDRM 교육매뉴얼/mkdocs"
docs_dir = os.path.join(base_dir, 'docs')

overview_files = [
    'MDRM_운영_학습_안내_기본', 'MDRM_메뉴_대시보드', 'MDRM_대시보드_관리', 'MDRM_대시보드_위젯',
    'MDRM_메뉴_시스템', 'MDRM_시스템_구성_관리', 'MDRM_시스템_등록_추가', 'MDRM_시스템_모니터링_알림',
    'MDRM_시스템_배포_작업', 'MDRM_시스템_계정_관리', 'MDRM_메뉴_워크플로우', 'MDRM_워크플로우_구성_관리',
    'MDRM_워크플로우_설계_컴포넌트', 'MDRM_워크플로우_변수_분기', 'MDRM_워크플로우_실행_모니터링',
    'MDRM_워크플로우_관리_리포트', 'MDRM_점검작업_개요', 'MDRM_점검작업_구성_관리', 'MDRM_점검_작업_관리',
    'MDRM_점검_실행_결과', 'MDRM_점검_스케줄_알림'
]

operation_files = [
    'MDRM_운영_학습_안내_심화', 'MDRM_자동화_영역', 'MDRM_워크플로우_유형', 'MDRM_워크플로우_시스템',
    'MDRM_워크플로우_그룹', 'MDRM_워크플로우_시나리오', 'MDRM_컴포넌트_설계_로직', 'MDRM_컴포넌트_실행_프로세스',
    'MDRM_주요_컴포넌트', 'MDRM_컴포넌트_템플릿_제작', 'MDRM_점검작업_스크립트', 'MDRM_점검작업_리스트'
]

practice_files = [
    'MDRM_운영_학습_안내_실전', 'MDRM_자동화_구현_체크포인트', 'MDRM_실전_시나리오_실습',
    'MDRM_트러블슈팅_가이드', 'MDRM_교육_마무리'
]

file_to_folder = {}
for f in overview_files: file_to_folder[f] = 'overview'
for f in operation_files: file_to_folder[f] = 'operation'
for f in practice_files: file_to_folder[f] = 'practice'

for root, _, files in os.walk(base_dir):
    for f in files:
        if f.endswith('.md') or f == 'mkdocs.yml':
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            new_content = content
            for target_file, target_folder in file_to_folder.items():
                # Replace 'operation/target' with 'overview/target' or 'practice/target'
                new_content = re.sub(rf'operation/{target_file}', f'{target_folder}/{target_file}', new_content)
            
            # Since my regex might not catch things safely earlier:
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                print(f"Updated links in {f}")
print("Transformation complete")
