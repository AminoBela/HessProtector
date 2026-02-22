import os
import re

def remove_comments_from_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    ext = os.path.splitext(file_path)[1]

    if ext == '.py':
        # Remove docstrings (tripole quotes)
        content = re.sub(r'"""[\s\S]*?"""', '', content)
        content = re.sub(r"'''[\s\S]*?'''", '', content)
        # Remove single line comments, but preserve shebangs
        lines = content.split('\n')
        new_lines = []
        for line in lines:
            if line.strip().startswith('#') and not line.startswith('#!'):
                 continue
            # Remove inline comments (naive approach, strict is hard without parser)
            # We will avid removing '#' inside strings by simple check, or just keep inline comments to be safe?
            # User said "all comments".
            # Let's remove lines starting with #. Inline is risky.
            new_lines.append(line)
        content = '\n'.join(new_lines)
        
        # Remove empty lines created by docstring removal
        content = re.sub(r'\n\s*\n', '\n\n', content)

    elif ext in ['.ts', '.tsx', '.js', '.jsx']:
        # Remove block comments
        content = re.sub(r'/\*[\s\S]*?\*/', '', content)
        # Remove single line comments
        lines = content.split('\n')
        new_lines = []
        for line in lines:
            if line.strip().startswith('//'):
                continue
            new_lines.append(line)
        content = '\n'.join(new_lines)
         # Remove empty lines
        content = re.sub(r'\n\s*\n', '\n\n', content)

    if content != original_content:
        print(f"Cleaning {file_path}")
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

def main():
    target_dirs = [
        '/home/aminobela/HessProtector/backend/app',
        '/home/aminobela/HessProtector/frontend/components/hess',
        '/home/aminobela/HessProtector/frontend/app',
        '/home/aminobela/HessProtector/frontend/lib'
    ]
    
    for directory in target_dirs:
        for root, _, files in os.walk(directory):
            for file in files:
                if file.endswith(('.py', '.ts', '.tsx')):
                    remove_comments_from_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
