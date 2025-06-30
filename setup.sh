#!/bin/bash
# Полная настройка Commitizen одной командой
# Использование: ./setup.sh

set -e  # Остановка при любой ошибке

echo "🚀 Настройка Commitizen для вашего проекта..."
echo ""

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

# Делаем hook исполняемым
chmod +x .git/hooks/commit-msg

# 3. Настраиваем git алиас (опционально)
echo ""
read -p "🔄 Заменить 'git commit' на 'cz commit'? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git config alias.commit '!cz commit'
    echo "✅ Git алиас настроен: git commit → cz commit"
fi

echo ""
echo "🎉 Настройка завершена!"
echo ""
echo "📋 Что настроено:"
echo "  ✅ .cz.toml - конфигурация Commitizen"
echo "  ✅ .git/hooks/commit-msg - валидация коммитов"
if [[ $REPLY =~ ^[Yy]$ ]]; then
echo "  ✅ git alias: git commit → cz commit"
fi
echo ""
echo "🚀 Теперь используйте:"
echo "  git add ."
echo "  cz c         # или git commit (если настроили алиас)"
echo ""
echo "🔍 Проверка установки:"
echo "  cz info      # Проверить конфигурацию"
echo "  cz --version # Версия Commitizen" 