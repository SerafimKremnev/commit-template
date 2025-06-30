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

## 🎯 Настройка нового проекта (3 простых шага)

### 1. Скопируйте конфигурацию
```bash
# Скопируйте .cz.toml в корень вашего проекта
cp .cz.toml /путь/к/вашему/проекту/
```

### 2. Настройте валидацию коммитов
```bash
# Скопируйте git hook
cp hooks/commit-msg /путь/к/вашему/проекту/.git/hooks/
chmod +x /путь/к/вашему/проекту/.git/hooks/commit-msg
```

### 3. (Опционально) Настройте pre-commit
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
├── .cz.toml                   # Конфигурация Commitizen
├── .pre-commit-config.yaml    # Конфигурация pre-commit hooks
├── hooks/
│   └── commit-msg            # Git hook для валидации
├── README.md                 # Эта инструкция
├── COMMITIZEN_SETUP.md       # Подробная документация
└── aspro-usage.md           # Документация по использованию в Аспро
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