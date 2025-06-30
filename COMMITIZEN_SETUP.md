# 🚀 Настройка Commitizen с нуля

## 1. Установка

```bash
# Через pip (Python)
pip install commitizen

# Через homebrew (macOS) 
brew install commitizen

# Через npm (Node.js)
npm install -g commitizen
```

## 2. Создание конфигурации

Создайте файл `.cz.toml` в корне проекта:

## 3. Настройка Git Hook

Если нужна дополнительная валидация сообщений коммитов, создайте файл `.git/hooks/commit-msg`:

Сделайте hook исполняемым:
```bash
chmod +x .git/hooks/commit-msg
```
