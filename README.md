# Git Commit Template CLI

🚀 CLI инструмент для настройки git commit шаблонов в любом репозитории одной командой.

## Формат коммитов

Инструмент настраивает шаблон коммитов в формате:
```
{Тип задачи}/{название ветки} | #{ID задачи в Аспро} | {Описание}
```

### Примеры:
- `feat/auth | #123 | Добавлена авторизация пользователей`
- `fix/payment | #456 | Исправлена ошибка в обработке платежей`
- `docs | #789 | Обновлена документация API`

## Установка

### Глобальная установка
```bash
npm install -g git-commit-template-cli
```

### Локальная установка в проект
```bash
npm install --save-dev git-commit-template-cli
```

### Использование через npx (без установки)
```bash
npx git-commit-template-cli init
```

## Быстрый старт

1. Перейдите в директорию вашего git репозитория
2. Выполните команду инициализации:
   ```bash
   commit-template init
   # или короткая команда
   ct init
   ```
3. Следуйте интерактивным инструкциям
4. Начинайте использовать новый формат коммитов!

## Команды

### `init` - Инициализация шаблона
```bash
commit-template init [опции]
```

**Опции:**
- `-t, --template <type>` - Тип шаблона (default, custom)
- `-s, --skip-prompts` - Пропустить интерактивные вопросы

**Примеры:**
```bash
# Интерактивная настройка
commit-template init

# Быстрая настройка со стандартным шаблоном
commit-template init --template default --skip-prompts

# Создание кастомного шаблона
commit-template init --template custom
```

### `config` - Настройка существующего шаблона
```bash
commit-template config
```

Позволяет изменить настройки уже установленного шаблона.

### `remove` - Удаление шаблона
```bash
commit-template remove
```

Удаляет настройки git commit шаблона из проекта.

## Что делает инструмент

1. **Устанавливает Commitizen** - для интерактивных коммитов
2. **Создает конфигурацию** - файл `cz-config.js` с вашим шаблоном
3. **Настраивает git hooks** - для валидации формата коммитов
4. **Обновляет package.json** - добавляет необходимые зависимости и скрипты

## Использование после установки

### Интерактивные коммиты (рекомендуется)
```bash
npx cz
# или если настроен скрипт
npm run commit
```

### Обычные git коммиты
```bash
git commit -m "feat/auth | #123 | Добавлена авторизация"
```

## Кастомизация

### Создание кастомного шаблона

При выборе кастомного шаблона инструмент позволяет настроить:

- **Типы коммитов** - добавить/изменить доступные типы
- **Дополнительные поля** - номер спринта, приоритет и т.д.
- **Длину заголовка** - максимальное количество символов
- **Обязательные поля** - какие поля должны быть заполнены

### Пример кастомной конфигурации

```javascript
module.exports = {
  types: [
    { value: 'feature', name: 'feature: Новая функция' },
    { value: 'bugfix', name: 'bugfix: Исправление бага' },
    { value: 'hotfix', name: 'hotfix: Критическое исправление' }
  ],
  
  customFields: [
    {
      name: 'sprint',
      message: 'Номер спринта:',
      type: 'input',
      required: true
    },
    {
      name: 'priority',
      message: 'Приоритет:',
      type: 'list',
      choices: ['low', 'medium', 'high', 'critical']
    }
  ]
};
```

## Git Hooks

Инструмент автоматически настраивает git hook `commit-msg`, который проверяет, что ваши коммиты соответствуют заданному формату.

Если коммит не соответствует формату, вы увидите ошибку:
```
❌ Неверный формат сообщения коммита!
Используйте формат: {Тип задачи}/{название ветки} | #{ID задачи} | {Описание}
Пример: feat/auth | #123 | Добавлена авторизация пользователей
```

## Файлы, создаваемые инструментом

- `cz-config.js` - конфигурация commitizen
- `.git/hooks/commit-msg` - git hook для валидации
- Обновления в `package.json`:
  - Зависимости: `commitizen`, `cz-customizable`
  - Скрипты: `"commit": "cz"`
  - Конфигурация: commitizen path

## Совместимость

- **Node.js**: 16+
- **Git**: любая версия
- **OS**: macOS, Linux, Windows

## Примеры интеграции

### С GitHub Actions
```yaml
name: Validate Commits
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Validate commit messages
        run: |
          # Проверка последнего коммита
          git log -1 --pretty=format:"%s" | grep -E "^(feat|fix|docs|style|refactor|test|chore)(\/.+)? \| #[0-9]+ \| .+"
```

### С pre-commit hooks
```yaml
# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: commit-msg-format
        name: Commit message format
        entry: sh -c 'echo "$1" | grep -E "^(feat|fix|docs|style|refactor|test|chore)(\/.+)? \| #[0-9]+ \| .+"'
        language: system
        stages: [commit-msg]
```

## Поддержка

Если у вас возникли вопросы или проблемы, создайте issue в репозитории проекта.

## Лицензия

MIT 