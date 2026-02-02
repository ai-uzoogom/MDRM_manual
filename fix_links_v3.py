import os
import re

def fix_links_v3(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.md'):
                is_index = file == 'index.md'
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    new_content = content
                    
                    # 1. Fix HTML Cards
                    # Match <a href="filename.md" class="next-step-card">
                    card_pattern = re.compile(r'href="([^"/]+)\.md"(?=.*class="next-step-card")')
                    if is_index:
                        # From /day2/ to /day2/name/ -> just name/
                        new_content = card_pattern.sub(r'href="\1/"', new_content)
                    else:
                        # From /day2/name/ to /day2/other/ -> ../other/
                        new_content = card_pattern.sub(r'href="../\1/"', new_content)
                    
                    # 2. Revert images to standard relative paths (relative to .md file)
                    new_content = re.sub(r'\!\[(.*?)\]\(\.\./\.\./assets/', r'![\1](../assets/', new_content)
                    
                    # 3. Ensure standard Markdown links are just the filename.md (no ../)
                    # Use a negative lookahead to avoid changing cards again
                    new_content = re.sub(r'\]\((?!\.\.|\/|http)([^)]+)\/(?!\))', r'](\1.md)', new_content)
                    
                    if new_content != content:
                        with open(path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Fixed: {path}")
                except Exception as e:
                    print(f"Error {path}: {e}")

if __name__ == "__main__":
    fix_links_v3(r"d:\Dropbox\00.우주곰프로젝트\00.MDRM\MDRM 교육매뉴얼\mkdocs\docs")
