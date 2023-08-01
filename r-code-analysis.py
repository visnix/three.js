import os
import re

def count_glsl_lines(directory):
    glsl_regex = re.compile(r'/\* glsl \*/\`(.*?)\`', re.DOTALL)
    total_lines = 0

    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.js'):
                with open(os.path.join(root, file), encoding='utf-8') as f:
                    contents = f.read()
                    matches = glsl_regex.findall(contents)
                    for match in matches:
                        lines = match.strip().split('\n')
                        non_empty_lines = [line for line in lines if line.strip() != '']  # 只统计非空行
                        total_lines += len(non_empty_lines)

    return total_lines

# 当前文件所在的目录
directory_path = os.path.dirname(os.path.realpath(__file__))

print(f"src: {count_glsl_lines(directory_path + '/src')}")


