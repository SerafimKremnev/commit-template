#!/bin/bash
# Wrapper для git commit в этом проекте

# Определяем корень проекта
PROJECT_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)"
CURRENT_DIR="$(pwd)"

# Проверяем, что мы в том же git проекте где установлен wrapper
if [ "$PROJECT_ROOT" = "$CURRENT_DIR" ] || [[ "$CURRENT_DIR" == "$PROJECT_ROOT"* ]]; then
    # Мы в проекте с Commitizen - перехватываем git commit
    if [ "$1" = "commit" ]; then
        if [ "$2" = "-m" ]; then
            echo "🚀 Перехват git commit -m → cz c"
            echo "💡 Для быстрого коммита используйте: cz commit --message=\"$3\""
            cz c
        else
            echo "🚀 Перехват git commit → cz commit"
            cz commit "${@:2}"
        fi
    else
        # Для других git команд используем обычный git
        command git "$@"
    fi
else
    # Вне проекта - обычный git
    command git "$@"
fi
