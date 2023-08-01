import os

def remove_empty_lines(filepath):
    # 以读模式打开文件，并读取所有行
    with open(filepath, 'r', encoding='utf-8') as file:
        lines = file.readlines()

    # 删除空白行
    non_empty_lines = [line for line in lines if line.strip() != '']

    # 以写模式重新打开文件，覆盖原内容
    with open(filepath, 'w', encoding='utf-8') as file:
        file.writelines(non_empty_lines)


# 当前文件所在的目录
directory_path = os.path.dirname(os.path.realpath(__file__))

# 调用函数，你需要替换为你的文件路径
remove_empty_lines(directory_path + '/build/three.module.js')
remove_empty_lines(directory_path + '/build/three.cjs')
