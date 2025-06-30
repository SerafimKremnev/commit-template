#!/bin/bash

echo "🚀 Установка Git Commit Template CLI..."

# Проверяем наличие Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не найден. Установите Node.js версии 16 или выше."
    echo "Скачать: https://nodejs.org/"
    exit 1
fi

# Проверяем версию Node.js
NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Требуется Node.js версии 16 или выше. Текущая версия: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) найден"

# Клонируем репозиторий или устанавливаем из npm
if [ "$1" = "dev" ]; then
    echo "📦 Установка в режиме разработки..."
    npm link
else
    echo "📦 Установка через npm..."
    npm install -g git-commit-template-cli
fi

echo "✅ Установка завершена!"
echo ""
echo "📝 Использование:"
echo "  commit-template init    # Настроить шаблон в текущем репозитории"
echo "  ct init                 # Короткая команда"
echo "  commit-template --help  # Показать справку"
echo ""
echo "🎉 Готово! Перейдите в любой git репозиторий и выполните 'commit-template init'" 