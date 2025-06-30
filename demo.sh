#!/bin/bash

echo "🎬 Демонстрация Git Commit Template CLI"
echo "======================================="
echo ""

# Переходим в демо проект
cd demo/test-project

echo "📂 Перешли в тестовый проект: $(pwd)"
echo ""

# Инициализируем git если не инициализирован
if [ ! -d ".git" ]; then
    echo "🔧 Инициализируем git репозиторий..."
    git init
    echo ""
fi

echo "🚀 Демонстрация команд CLI:"
echo ""

echo "1️⃣ Показать справку:"
echo "   > commit-template --help"
echo ""
node ../../bin/cli.js --help
echo ""

echo "2️⃣ Инициализация шаблона (в тестовом режиме):"
echo "   > commit-template init --template default --skip-prompts"
echo ""

# Запускаем инициализацию в неинтерактивном режиме
echo "y" | node ../../bin/cli.js init --template default --skip-prompts

echo ""
echo "3️⃣ Проверяем созданные файлы:"
echo ""

if [ -f "cz-config.js" ]; then
    echo "✅ Файл cz-config.js создан"
    echo "📄 Содержимое (первые 10 строк):"
    head -10 cz-config.js
    echo "..."
else
    echo "❌ Файл cz-config.js не найден"
fi

echo ""

if [ -f "package.json" ]; then
    echo "✅ package.json обновлен"
    if grep -q "commitizen" package.json; then
        echo "📦 Зависимости commitizen добавлены"
    fi
    if grep -q "commit.*cz" package.json; then
        echo "🔧 Скрипт commit добавлен"
    fi
else
    echo "❌ package.json не найден"
fi

echo ""

if [ -f ".git/hooks/commit-msg" ]; then
    echo "✅ Git hook commit-msg настроен"
    echo "🪝 Содержимое:"
    cat .git/hooks/commit-msg | head -5
    echo "..."
else
    echo "❌ Git hook не настроен"
fi

echo ""
echo "4️⃣ Пример использования:"
echo ""

# Добавляем файлы в git
git add .

echo "   > git add ."
echo "   > git commit -m 'feat/demo | #123 | Инициализация тестового проекта'"
echo ""

# Пытаемся сделать тестовый коммит
if git commit -m "feat/demo | #123 | Инициализация тестового проекта" 2>/dev/null; then
    echo "✅ Коммит успешно создан с правильным форматом!"
    echo ""
    echo "📋 История коммитов:"
    git log --oneline -3
else
    echo "❌ Ошибка при создании коммита"
fi

echo ""
echo "5️⃣ Пример неправильного формата:"
echo "   > git commit -m 'неправильный формат'"
echo ""

# Создаем еще один файл для тестирования
echo "// Тестовое изменение" >> index.js
git add index.js

# Пытаемся сделать коммит с неправильным форматом
if git commit -m "неправильный формат" 2>&1 | grep -q "Неверный формат"; then
    echo "✅ Git hook корректно отклонил неправильный формат"
else
    echo "❌ Git hook не сработал"
fi

echo ""
echo "🎉 Демонстрация завершена!"
echo ""
echo "💡 Для использования в реальном проекте:"
echo "   1. Установите CLI: npm install -g git-commit-template-cli"
echo "   2. Перейдите в ваш git репозиторий"
echo "   3. Выполните: commit-template init"
echo "   4. Следуйте инструкциям"
echo ""
echo "📚 Подробная документация в README.md" 