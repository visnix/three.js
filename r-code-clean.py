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

def traverse_directory(directory_path):
    # 遍历给定目录中的所有文件和子目录
    for foldername, subfolders, filenames in os.walk(directory_path):
        for filename in filenames:
            # 检查文件是否是.html或.js文件
            if filename.endswith('.html') or filename.endswith('.js'):
                # 获取文件的完整路径
                filepath = os.path.join(foldername, filename)
                # 调用函数移除文件中的空白行
                remove_empty_lines(filepath)


# 当前文件所在的目录
directory_path = os.path.dirname(os.path.realpath(__file__))
print(directory_path)

# # 调用函数，文件路径
# remove_empty_lines(directory_path + '/build/three.module.js')

# # 调用函数，文件目录
traverse_directory(directory_path + "/src")

