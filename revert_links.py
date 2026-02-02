import os
import re

def revert_links_and_images(root_dir):
    # Regex to catch <a href="../filename/" ...> and change back to filename.md (relative)
    # However, it's safer to just handle the common patterns I introduced.
    
    # Pattern 1: HTML cards <a href="../filename/" ...>
    # If the file is docs/day2/index.md and link is ../MDRM_.../ -> it should be MDRM_...md
    # If the file is docs/day2/A.md and link is ../B/ -> it should be B.md
    # Actually, MkDocs handles relative links perfectly if we use .md.
    
    html_card_pattern = re.compile(r'href="\.\./([^"/]+)/"')
    
    # Pattern 2: Markdown links [text](../filename/) -> [text](filename.md)
    md_link_pattern = re.compile(r'\]\(\.\./([^)]+)/\)')
    
    # Pattern 3: Image paths ../../assets/ -> ../assets/
    img_pattern = re.compile(r'\!\[(.*?)\]\(\.\./\.\./assets/')

    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    new_content = content
                    
                    # Revert HTML cards
                    # If it was ../name/, it was intended to be sibling or child.
                    # In my previous script I added ../ for siblings.
                    # So we should remove ../ and add .md
                    new_content = html_card_pattern.sub(r'href="\1.md"', new_content)
                    
                    # Revert MD links
                    new_content = md_link_pattern.sub(r'](\1.md)', new_content)
                    
                    # Revert Images
                    new_content = img_pattern.sub(r'![\1](../assets/', new_content)
                    
                    if new_content != content:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Reverted links/images in: {file_path}")
                except Exception as e:
                    print(f"Failed {file_path}: {e}")

if __name__ == "__main__":
    docs_dir = r"d:\Dropbox\00.우주곰프로젝트\00.MDRM\MDRM 교육매뉴얼\mkdocs\docs"
    revert_links_and_images(docs_dir)
