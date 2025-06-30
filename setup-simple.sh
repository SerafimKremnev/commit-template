#!/bin/bash
# Упрощенная автоматическая настройка Commitizen
# Использование: curl -sSL url/setup-simple.sh | bash

set -e  # Остановка при любой ошибке

echo "🚀 Автоматическая настройка Commitizen..."

# Проверяем, что мы в git репозитории
if [ ! -d ".git" ]; then
    echo "❌ Ошибка: Это не git репозиторий!"
    echo "Выполните сначала: git init"
    exit 1
fi

# 1. Создаем .cz.toml конфигурацию
echo "📝 Создание .cz.toml конфигурации..."
cat > .cz.toml << 'EOF'
[tool.commitizen]
name = "cz_customize"
version = "0.1.0"
tag_format = "v$version"
update_changelog_on_bump = true
bump_message = "bump: version $current_version → $new_version"
allow_abort = false

# Настройки bump
bump_pattern = "^(feat|fix)"
bump_map = {feat = "MINOR", fix = "PATCH"}

# Настройки changelog
changelog_pattern = "^(feat|fix|docs|style|refactor|test|chore)/\\S+ \\| #\\d+ \\|"
change_type_order = ["feat", "fix", "refactor", "docs", "style", "test", "chore"]
change_type_map = {feat = "🚀 Новый функционал", fix = "🐛 Исправления багов", refactor = "♻️ Рефакторинг", docs = "📝 Документация", style = "🎨 Стилизация", test = "✅ Тесты", chore = "🔧 Техническая работа"}

[tool.commitizen.customize]
message_template = "{{task_type}}/{{branch_name}} | #{{aspro_id}} | {{description}}"
example = "feat/user-auth | #12345 | добавлена JWT аутентификация"

[[tool.commitizen.customize.questions]]
type = "list"
name = "task_type"
message = "🎯 Выберите тип задачи:"
choices = [
    {value = "feat", name = "feat - Новый функционал"},
    {value = "fix", name = "fix - Исправление бага"},
    {value = "docs", name = "docs - Документация"},
    {value = "style", name = "style - Стилизация"},
    {value = "refactor", name = "refactor - Рефакторинг кода"},
    {value = "test", name = "test - Тесты"},
    {value = "chore", name = "chore - Техническая задача"}
]

[[tool.commitizen.customize.questions]]
type = "input"
name = "branch_name"
message = "🌿 Введите название ветки:"

[[tool.commitizen.customize.questions]]
type = "input"
name = "aspro_id"
message = "🔢 Введите ID задачи в Аспро (только цифры):"

[[tool.commitizen.customize.questions]]
type = "input"
name = "description"
message = "📝 Введите описание (минимум 3 символа):"
EOF

# 2. Создаем git hook для валидации коммитов
echo "🔒 Создание git hook для валидации..."

# Проверяем, используется ли Husky
if [ -d ".husky" ]; then
    echo "🐕 Обнаружен Husky, создаем .husky/commit-msg..."
    cat > .husky/commit-msg << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Валидация формата коммита для Commitizen
commit_regex='^(feat|fix|docs|style|refactor|test|chore)(/.+)? \| #[0-9]+ \| .+'

if ! grep -qE "$commit_regex" "$1"; then
  echo "❌ Неверный формат сообщения коммита! Используйте команду \"cz c\""
  echo "Используйте формат: {Тип задачи}/{название ветки} | #{ID задачи} | {Описание}"
  echo "Пример: feat/auth | #123 | Добавлена авторизация пользователей"
  exit 1
fi
EOF
    chmod +x .husky/commit-msg
    echo "✅ Создан .husky/commit-msg для валидации коммитов"
else
    # Стандартный git hook
    cat > .git/hooks/commit-msg << 'EOF'
#!/bin/sh
# Git commit message template hook

commit_regex='^(feat|fix|docs|style|refactor|test|chore)(/.+)? \| #[0-9]+ \| .+'

if ! grep -qE "$commit_regex" "$1"; then
  echo "❌ Неверный формат сообщения коммита! Используйте команду \"cz c\""
  echo "Используйте формат: {Тип задачи}/{название ветки} | #{ID задачи} | {Описание}"
  echo "Пример: feat/auth | #123 | Добавлена авторизация пользователей"
  exit 1
fi
EOF
    chmod +x .git/hooks/commit-msg
    echo "✅ Создан .git/hooks/commit-msg для валидации коммитов"
fi

# 3. Автоматически настраиваем умный перехват
echo "🔄 Настройка умного перехвата git commit -m → cz c..."

# Простой локальный git alias
git config alias.commit '!cz commit'

# Создаем .git-commit-wrapper.sh для shell функции
cat > .git-commit-wrapper.sh << 'EOF'
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
EOF
chmod +x .git-commit-wrapper.sh

echo ""
echo "🎉 Настройка завершена!"
echo ""
echo "📋 Что настроено:"
echo "  ✅ .cz.toml - конфигурация Commitizen"
if [ -d ".husky" ]; then
echo "  ✅ .husky/commit-msg - валидация коммитов (Husky)"
else
echo "  ✅ .git/hooks/commit-msg - валидация коммитов"
fi
echo "  ✅ git alias: git commit → cz commit"
echo "  ✅ .git-commit-wrapper.sh - умный wrapper"
echo ""
echo "🚀 Теперь используйте:"
echo "  git add ."
echo "  git commit        # теперь вызовет cz commit"
echo "  cz c              # короткая версия"
echo ""
echo "💡 Для shell wrapper добавьте в ~/.bashrc или ~/.zshrc:"
echo "function git() { if [ -f \"\$(pwd)/.git-commit-wrapper.sh\" ]; then \"\$(pwd)/.git-commit-wrapper.sh\" \"\$@\"; else command git \"\$@\"; fi; }"
echo ""
echo "🔍 Проверка установки:"
echo "  cz info           # Проверить конфигурацию"
echo "  cz --version      # Версия Commitizen" 