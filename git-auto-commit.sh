#!/bin/bash

# ================= 配置区 =================
FIXED_USER="mtdcmz"
FIXED_EMAIL="meitadechangmingzi@gmail.com"
REMOTE_URL="https://github.com/mtdcmz/66rpg-games-archive.git"
# ==========================================

pause_exit() {
    echo ""
    read -p "按回车键退出窗口..."
    exit
}

echo "--- 🚀 正在执行【强力同步】模式 ---"

# 1. 环境初始化
git config --global user.name "$FIXED_USER"
git config --global user.email "$FIXED_EMAIL"
[ ! -d ".git" ] && git init && git remote add origin "$REMOTE_URL"
git remote set-url origin "$REMOTE_URL"

# 2. 刷新索引，避免 stat 信息混乱
git update-index --refresh

# 3. 找出所有真正变化的文件（修改、删除、新增未跟踪）
echo "正在分析文件变动..."
CHANGED_FILES=$(git diff --name-only HEAD 2>/dev/null)       # 已跟踪文件的修改/删除
UNTRACKED_FILES=$(git ls-files --others --exclude-standard) # 未跟踪的新增文件

# 合并两个列表，排除脚本自身
SCRIPT_PATH="$0"
if [[ "$SCRIPT_PATH" == /* ]]; then
    REPO_ROOT=$(git rev-parse --show-toplevel)
    SCRIPT_PATH="${SCRIPT_PATH#$REPO_ROOT/}"
fi

ALL_FILES=$(echo -e "$CHANGED_FILES\n$UNTRACKED_FILES" | sort -u | grep -v "^$SCRIPT_PATH$")

if [ -z "$ALL_FILES" ]; then
    echo "ℹ️  没有新文件需要提交，准备直接同步远程..."
else
    echo "检测到以下文件变动："
    echo "$ALL_FILES"
    echo "$ALL_FILES" | xargs -r git add
    git commit -m "Auto-sync: $(date +'%Y-%m-%d %H:%M')"
fi

# 4. 分支强制为 main
BRANCH="main"
git branch -M "$BRANCH"

# 5. 强力推送
echo "--- 📦 正在上传 (强制覆盖模式) ---"
git push -u origin "$BRANCH" --force --progress

if [ $? -eq 0 ]; then
    echo "--- 🎉 【成功】文件已强制同步到 GitHub！ ---"
else
    echo "❌ 【失败】即便使用强制模式也无法上传。"
    echo "请检查：1. 网络是否通畅  2. GitHub 是否需要 Token 登录"
fi

pause_exit