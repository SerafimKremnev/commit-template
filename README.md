# Commit Template

Утилита для стандартизации коммитов с интерактивным интерфейсом и расширяемой конфигурацией.

## 🚀 Возможности

- ✨ Интерактивный выбор типа коммита
- 📝 Автоматическое определение текущей ветки
- 🔧 Расширяемая конфигурация через `commit.config.js`
- 🎨 Кастомное форматирование сообщений
- 📋 Дополнительные вопросы и валидация
- 🏷️ Поддержка областей изменений (scopes)
- 🔗 Интеграция с системами задач (JIRA, GitHub Issues)
- 🚨 Поддержка breaking changes

## 📦 Установка

### Локальная установка в проект

```bash
npm install --save-dev commit-template
```

### Глобальная установка

```bash
npm install -g commit-template
```

## 🎯 Использование

### Базовое использование

```bash
# Локальная установка
npm run commit

# Глобальная установка
commit-template
```

### Добавление скрипта в package.json

```json
{
  "scripts": {
    "commit": "commit-template"
  }
}
```

## ⚙️ Конфигурация

Создайте файл `commit.config.js` в корне проекта для кастомизации:

```javascript
module.exports = {
  // Типы коммитов
  types: [
    { name: '✨ feat: новая функция', value: 'feat' },
    { name: '🐛 fix: исправление бага', value: 'fix' },
    { name: '📝 docs: документация', value: 'docs' },
    { name: '💄 style: форматирование кода', value: 'style' },
    { name: '♻️ refactor: рефакторинг', value: 'refactor' },
    { name: '⚡ perf: улучшение производительности', value: 'perf' },
    { name: '✅ test: тесты', value: 'test' },
    { name: '🔧 chore: настройки', value: 'chore' }
  ],
  
  // Области изменений
  scopes: ['frontend', 'backend', 'api', 'ui', 'docs'],
  
  // Префикс для задач
  issuePrefix: 'JIRA',
  
  // Дополнительные вопросы
  additionalQuestions: [
    {
      type: 'list',
      name: 'breaking',
      message: 'Это breaking change?',
      choices: [
        { name: 'Нет', value: false },
        { name: 'Да', value: true }
      ]
    }
  ],
  
  // Кастомное форматирование
  messageFormat: (answers, config, branch) => {
    let message = `${answers.type}`;
    if (answers.scope) message += `(${answers.scope})`;
    message += `: ${answers.subject}`;
    return message;
  }
};
```

## 🔧 Опции конфигурации

### `types`
Массив типов коммитов. Каждый тип должен иметь `name` (отображаемое имя) и `value` (значение).

### `scopes`
Массив областей изменений (опционально).

### `issuePrefix`
Префикс для систем задач (например, "JIRA" для JIRA-123).

### `additionalQuestions`
Массив дополнительных вопросов в формате [inquirer](https://github.com/SBoudrias/Inquirer.js).

### `messageFormat`
Функция для кастомного форматирования сообщения коммита.

### `branchFormat`
Функция для форматирования информации о ветке.

## 📝 Примеры сообщений

### Стандартный коммит
```
feat: добавить новую функцию авторизации
```

### Коммит с областью
```
feat(auth): добавить OAuth2 провайдер
```

### Коммит с breaking change
```
feat(auth): изменить API авторизации

BREAKING CHANGE: метод login() теперь возвращает Promise
```

### Коммит с задачей
```
fix(ui): исправить отображение кнопки

Closes JIRA-123
```

## 🎨 Расширенные примеры

### Кастомные типы коммитов
```javascript
types: [
  { name: '🚀 deploy: деплой', value: 'deploy' },
  { name: '🔒 security: безопасность', value: 'security' },
  { name: '🌐 i18n: интернационализация', value: 'i18n' }
]
```

### Условные вопросы
```javascript
additionalQuestions: [
  {
    type: 'list',
    name: 'environment',
    message: 'Окружение:',
    choices: ['development', 'staging', 'production'],
    when: (answers) => answers.type === 'deploy'
  }
]
```

### Кастомное форматирование с эмодзи
```javascript
messageFormat: (answers, config, branch) => {
  const emoji = {
    feat: '✨',
    fix: '🐛',
    docs: '📝',
    style: '💄',
    refactor: '♻️',
    perf: '⚡',
    test: '✅',
    chore: '🔧'
  };
  
  return `${emoji[answers.type]} ${answers.type}: ${answers.subject}`;
}
```

## 🔗 Интеграция с Git Hooks

### Pre-commit hook
Создайте `.git/hooks/pre-commit`:

```bash
#!/bin/sh
npm run commit
```

### Commit-msg hook
Создайте `.git/hooks/commit-msg`:

```bash
#!/bin/sh
# Валидация формата сообщения
npx commit-template validate "$1"
```

## 🛠️ Разработка

### Установка зависимостей
```bash
npm install
```

### Запуск тестов
```bash
npm test
```

### Линтинг
```bash
npm run lint
```

## 📄 Лицензия

MIT

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Добавьте тесты
5. Создайте Pull Request

## 📞 Поддержка

Если у вас есть вопросы или предложения, создайте Issue в репозитории. 