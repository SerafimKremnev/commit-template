# 🚀 Шаблон Commitizen для проектов

Готовый шаблон для настройки стандартизированных коммитов в ваших проектах.

## 📦 Что включает шаблон

- ✅ Готовая конфигурация Commitizen (`.cz.toml`)
- ✅ Git hook для валидации коммитов (`hooks/commit-msg`)
- ✅ Pre-commit конфигурация (`.pre-commit-config.yaml`)
- ✅ Подробная документация по настройке

## 🛠️ Глобальная установка (один раз на машину)

```bash
# Установка Commitizen
pip install commitizen

# Или через homebrew (macOS)
brew install commitizen

# Или через npm (для Node.js проектов)
npm install -g commitizen
```

## ⚡ Быстрая настройка (одна команда)

### Вариант А - Автоматическая настройка (одна команда):

**🚀 Самый быстрый способ (скачать и сразу запустить):**
```bash
# Автоматическая настройка (рекомендуется для curl | bash):
curl -sSL https://raw.githubusercontent.com/SerafimKremnev/commit-template/refs/heads/main/setup-simple.sh | bash

# Интерактивная настройка (скачать локально):
curl -O https://raw.githubusercontent.com/SerafimKremnev/commit-template/refs/heads/main/setup.sh
chmod +x setup.sh
./setup.sh

# Или через wget:
wget -qO- https://raw.githubusercontent.com/SerafimKremnev/commit-template/refs/heads/main/setup-simple.sh | bash
```

**📁 Или скачать локально и запустить:**
```bash
# Из этого репозитория:
./setup.sh

# Или скачайте в ваш проект:
curl -O https://raw.githubusercontent.com/SerafimKremnev/commit-template/refs/heads/main/setup.sh
chmod +x setup.sh
./setup.sh
```

**📦 Или клонировать репозиторий и использовать:**
```bash
git clone https://github.com/SerafimKremnev/commit-template.git
cd commit-template
./setup.sh
# Затем скопируйте setup.sh в ваши проекты
```

**Что делает скрипт `setup.sh`:**
- ✅ Создает `.cz.toml` конфигурацию
- ✅ Настраивает git hook `.git/hooks/commit-msg` (или `.husky/commit-msg` для Husky)
- ✅ **Перехватывает `git commit -m` → автоматически вызывает `cz c`**
- ✅ Работает только в рамках текущего проекта
- ✅ Проверяет, что проект является git репозиторием

### Вариант Б - Ручная настройка (3 шага):

#### 1. Скопируйте конфигурацию
```bash
# Скопируйте .cz.toml в корень вашего проекта
cp .cz.toml /путь/к/вашему/проекту/
```

#### 2. Настройте валидацию коммитов
```bash
# Скопируйте git hook
cp hooks/commit-msg /путь/к/вашему/проекту/.git/hooks/
chmod +x /путь/к/вашему/проекту/.git/hooks/commit-msg
```

#### 3. (Опционально) Настройте pre-commit
```bash
# Скопируйте конфигурацию pre-commit
cp .pre-commit-config.yaml /путь/к/вашему/проекту/

# Установите pre-commit hooks
cd /путь/к/вашему/проекту
pip install pre-commit
pre-commit install
```

## 🚀 Использование

```bash
# Вместо git commit используйте:
cz commit
# или короткую версию:
cz c
```

### Интерактивный процесс:
1. 🎯 Выберите тип задачи: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
2. 🌿 Введите название ветки: `user-auth`
3. 🔢 Введите ID задачи в Аспро: `12345`
4. 📝 Введите описание: `добавлена JWT аутентификация`

**Результат:** `feat/user-auth | #12345 | добавлена JWT аутентификация`

## 📁 Структура файлов шаблона

```
commit-template/
├── setup.sh                  # 🚀 Интерактивная настройка (локально)
├── setup-simple.sh           # ⚡ Автоматическая настройка (curl | bash)
├── setup-debug.sh            # 🔍 Отладочная версия для диагностики
├── git-wrapper.sh            # 🔄 Shell wrapper для перехвата git commit -m
├── .cz.toml                 # Конфигурация Commitizen
├── hooks/
│   └── commit-msg           # Git hook для валидации
├── README.md                # Эта инструкция
├── COMMITIZEN_SETUP.md      # Подробная документация
└── aspro-usage.md          # Документация по использованию в Аспро
```

## 🔧 Управление версиями

```bash
# Автоматическое повышение версии
cz bump

# Генерация changelog
cz changelog
```

## 📝 Типы коммитов

- **feat** - новый функционал (повышает MINOR версию)
- **fix** - исправление бага (повышает PATCH версию)  
- **docs** - изменения в документации
- **style** - форматирование кода
- **refactor** - рефакторинг без изменения функциональности
- **test** - добавление или изменение тестов
- **chore** - технические задачи, обновление зависимостей

## 🎨 Кастомизация

Отредактируйте `.cz.toml` для настройки под ваш проект:
- Измените типы задач в секции `choices`
- Настройте шаблон сообщения в `message_template`
- Обновите правила версионирования в `bump_map`

**Настройка (включена в setup.sh):**

**Вариант 1 - Готовый файл:**
```bash
# Скачайте готовый wrapper:
curl -O https://raw.githubusercontent.com/SerafimKremnev/commit-template/refs/heads/main/git-wrapper.sh

# Добавьте в ~/.bashrc или ~/.zshrc:
source /путь/к/git-wrapper.sh
```

**Вариант 2 - Ручная настройка:**
```bash
# Добавьте в ~/.bashrc или ~/.zshrc:
function git() {
    if [ -f "$(pwd)/.git-commit-wrapper.sh" ]; then
        "$(pwd)/.git-commit-wrapper.sh" "$@"
    else
        command git "$@"
    fi
}
```

**✅ Преимущества:**
- 🎯 Работает **только в проектах с Commitizen**
- 🔒 Не влияет на другие проекты
- 💡 Автоматически предлагает правильный формат коммитов
- 🚀 Привычная команда `git commit -m` → интерактивный `cz c`

**🧪 Проверка:**
```bash
# В проекте с Commitizen:
git commit -m "test"  # → запустит cz c

# В другом проекте:
git commit -m "test"  # → обычный git commit
```

## 🐕 Интеграция с Husky

Если в вашем проекте используется **Husky**, наш `setup.sh` автоматически создаст `.husky/commit-msg` вместо `.git/hooks/commit-msg`.

**Ручная настройка для Husky:**
```bash
# 1. Создайте .husky/commit-msg
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

# 2. Сделайте исполняемым
chmod +x .husky/commit-msg
```

**Проверка интеграции с Husky:**
```bash
# Убедитесь что файл создан
ls -la .husky/commit-msg

# Протестируйте валидацию
echo "invalid commit" | .husky/commit-msg /dev/stdin
```

## 🆘 Возможные проблемы

**Ошибка "command not found: cz"**
```bash
# Проверьте установку
which cz
# Переустановите если нужно
pip install --upgrade commitizen
```

**Git hook отклоняет коммиты (стандартный Git)**
```bash
# Проверьте права доступа к hook
ls -la .git/hooks/commit-msg
# Сделайте исполняемым если нужно  
chmod +x .git/hooks/commit-msg
```

**Git hook отклоняет коммиты (Husky)**
```bash
# Проверьте права доступа к Husky hook
ls -la .husky/commit-msg
# Сделайте исполняемым если нужно  
chmod +x .husky/commit-msg
```

**Ошибка парсинга .cz.toml**
```bash
# Проверьте конфигурацию
cz info
# Скопируйте рабочую версию из шаблона
cp /путь/к/шаблону/.cz.toml .
```