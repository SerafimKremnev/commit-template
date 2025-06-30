#!/bin/bash
# Умный wrapper для git команд
# Перехватывает git commit -m в проектах с Commitizen
# 
# Установка:
# 1. Добавьте в ~/.bashrc или ~/.zshrc:
#    source /путь/к/git-wrapper.sh
# 
# Или скопируйте функцию git() в ваш shell конфиг

function git() {
    # Проверяем есть ли .git-commit-wrapper.sh в текущей директории
    if [ -f "$(pwd)/.git-commit-wrapper.sh" ]; then
        # Есть wrapper - используем его (проект с Commitizen)
        "$(pwd)/.git-commit-wrapper.sh" "$@"
    else
        # Нет wrapper - обычный git
        command git "$@"
    fi
}

# Альтернативная функция для более точной проверки
function git_smart() {
    local git_root
    git_root=$(git rev-parse --show-toplevel 2>/dev/null)
    
    if [ -n "$git_root" ] && [ -f "$git_root/.git-commit-wrapper.sh" ]; then
        # В git проекте с Commitizen wrapper
        "$git_root/.git-commit-wrapper.sh" "$@"
    else
        # Обычный git
        command git "$@"
    fi
}

echo "✅ Git wrapper загружен!"
echo "💡 Теперь git commit -m в проектах с Commitizen → cz c" 