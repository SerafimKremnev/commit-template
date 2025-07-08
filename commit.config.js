module.exports = {
  types: [
    { name: '✨ feat: новая функция', value: 'feat' },
    { name: '🐛 fix: исправление бага', value: 'fix' },
    { name: '📝 docs: документация', value: 'docs' },
    { name: '💄 style: форматирование кода', value: 'style' },
    { name: '♻️ refactor: рефакторинг', value: 'refactor' },
    { name: '⚡ perf: улучшение производительности', value: 'perf' },
    { name: '✅ test: тесты', value: 'test' },
    { name: '🔧 chore: настройки', value: 'chore' },
    { name: '🚀 deploy: деплой', value: 'deploy' }
  ],
  // Можно добавить scopes, issuePrefix, дополнительные вопросы и messageFormat
  // Пример messageFormat для вашего шаблона:
  messageFormat: (answers, config, branch) => {
    return `${answers.type}/[${branch}] | #${answers.taskId} | ${answers.subject}`;
  }
}; 