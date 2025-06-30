#!/bin/bash
# Отладочная версия setup.sh
set -x  # Включаем debug mode
set -e  # Остановка при любой ошибке

echo "🚀 DEBUG: Начинаем настройку Commitizen..."
echo "🔍 DEBUG: Текущая оболочка: $SHELL"
echo "🔍 DEBUG: Рабочая директория: $(pwd)"

# Проверяем, что мы в git репозитории
if [ ! -d ".git" ]; then
    echo "❌ DEBUG: Не git репозиторий!"
    exit 1
fi

echo "✅ DEBUG: Git репозиторий найден"

# Создаем простую .cz.toml конфигурацию
echo "📝 DEBUG: Создание .cz.toml..."
cat > .cz.toml << 'EOF'
[tool.commitizen]
name = "cz_customize"
version = "0.1.0"

[tool.commitizen.customize]
message_template = "{{task_type}}/{{branch_name}} | #{{aspro_id}} | {{description}}"
example = "feat/user-auth | #12345 | добавлена JWT аутентификация"

[[tool.commitizen.customize.questions]]
type = "list"
name = "task_type"
message = "🎯 Выберите тип задачи:"
choices = [
    {value = "feat", name = "feat - Новый функционал"},
    {value = "fix", name = "fix - Исправление бага"}
]

[[tool.commitizen.customize.questions]]
type = "input"
name = "branch_name" 
message = "🌿 Введите название ветки:"

[[tool.commitizen.customize.questions]]
type = "input"
name = "aspro_id"
message = "🔢 Введите ID задачи:"

[[tool.commitizen.customize.questions]]
type = "input"
name = "description"
message = "📝 Введите описание:"
EOF

echo "✅ DEBUG: .cz.toml создан"

# Проверяем Husky
echo "🔍 DEBUG: Проверяем наличие Husky..."
if [ -d ".husky" ]; then
    echo "🐕 DEBUG: Husky найден!"
    # Husky версия git hook
    cat > .husky/commit-msg << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

commit_regex='^(feat|fix)(/.+)? \| #[0-9]+ \| .+'
if ! grep -qE "$commit_regex" "$1"; then
  echo "❌ Неверный формат! Используйте cz c"
  exit 1
fi
EOF
    chmod +x .husky/commit-msg
    echo "✅ DEBUG: .husky/commit-msg создан"
else
    echo "📂 DEBUG: Husky не найден, создаем обычный git hook"
    cat > .git/hooks/commit-msg << 'EOF'
#!/bin/sh
commit_regex='^(feat|fix)(/.+)? \| #[0-9]+ \| .+'
if ! grep -qE "$commit_regex" "$1"; then
  echo "❌ Неверный формат! Используйте cz c"
  exit 1
fi
EOF
    chmod +x .git/hooks/commit-msg
    echo "✅ DEBUG: .git/hooks/commit-msg создан"
fi

echo ""
echo "🎉 DEBUG: Настройка завершена!"
echo "🚀 DEBUG: Теперь используйте: cz c" 