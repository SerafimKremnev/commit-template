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
# Скачать и запустить setup.sh одной командой:
curl -sSL https://raw.githubusercontent.com/SerafimKremnev/commit-template/refs/heads/main/setup.sh | bash

# Или через wget:
wget -qO- https://raw.githubusercontent.com/SerafimKremnev/commit-template/refs/heads/main/setup.sh | bash
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
- ✅ Настраивает git hook `.git/hooks/commit-msg`
- ✅ Предлагает настроить алиас `git commit` → `cz commit`
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
├── setup.sh                  # 🚀 Автоматическая настройка одной командой
├── .cz.toml                 # Конфигурация Commitizen
├── .pre-commit-config.yaml  # Конфигурация pre-commit hooks
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

## 🆘 Возможные проблемы

**Ошибка "command not found: cz"**
```bash
# Проверьте установку
which cz
# Переустановите если нужно
pip install --upgrade commitizen
```

**Git hook отклоняет коммиты**
```bash
# Проверьте права доступа к hook
ls -la .git/hooks/commit-msg
# Сделайте исполняемым если нужно  
chmod +x .git/hooks/commit-msg
```

**Ошибка парсинга .cz.toml**
```bash
# Проверьте конфигурацию
cz info
# Скопируйте рабочую версию из шаблона
cp /путь/к/шаблону/.cz.toml .
```

---

**📚 Подробная документация:** см. [COMMITIZEN_SETUP.md](./COMMITIZEN_SETUP.md)

**🏢 Использование в Аспро:** см. [aspro-usage.md](./aspro-usage.md) 