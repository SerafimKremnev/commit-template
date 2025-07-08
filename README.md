# commit-template

## Быстрый старт

1. Установите пакет:
   ```bash
   npm install --save-dev commit-template
   ```

2. Добавьте скрипт в package.json:
   ```json
   {
     "scripts": {
       "commit": "commit-template"
     }
   }
   ```

3. Создайте файл `commit.config.js` в корне проекта:

```javascript
// commit.config.js

module.exports = {
  // Типы коммитов (выводятся в select)
  types: [
    { name: '✨ feat: новая функция', value: 'feat' },
    { name: '🐛 fix: исправление бага', value: 'fix' },
    { name: '📝 docs: документация', value: 'docs' },
    { name: '💄 style: стилизация', value: 'style' },
    { name: '♻️ refactor: рефакторинг', value: 'refactor' },
    { name: '✅ test: тесты', value: 'test' },
    { name: '🔧 chore: техническое', value: 'chore' }
  ],

  // Дополнительные вопросы (можно добавить сколько угодно)
  additionalQuestions: [
    {
      type: 'list', // select
      name: 'priority',
      message: 'Приоритет задачи:',
      choices: [
        { name: '🔴 Высокий', value: 'high' },
        { name: '🟡 Средний', value: 'medium' },
        { name: '🟢 Низкий', value: 'low' }
      ]
    }
    // Можно добавить другие вопросы: input, confirm, list, и т.д.
  ],

  // Формат итогового сообщения коммита
  messageFormat: (answers, config, branch) => {
    // answers содержит все ответы пользователя
    // branch — текущая ветка
    let msg = `${answers.type}/[${branch}] | #${answers.taskId} | ${answers.subject}`;
    if (answers.priority) {
      msg += ` | Priority: ${answers.priority}`;
    }
    return msg;
  }
};
```

4. Используйте:
   ```bash
   npm run commit
   ```

---

- Формат, вопросы и типы коммитов — полностью настраиваются через `commit.config.js`.
- Можно добавлять любые вопросы (select, input, confirm и др.).
- Итоговое сообщение формируется через функцию `messageFormat`. 