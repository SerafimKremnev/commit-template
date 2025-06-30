module.exports = {
  types: [
    { value: 'feat', name: 'feat: Новая функциональность' },
    { value: 'fix', name: 'fix: Исправление бага' },
    { value: 'docs', name: 'docs: Изменения в документации' },
    { value: 'style', name: 'style: Изменения стилей кода (форматирование, отступы)' },
    { value: 'refactor', name: 'refactor: Рефакторинг кода' },
    { value: 'test', name: 'test: Добавление или изменение тестов' },
    { value: 'chore', name: 'chore: Изменения в сборке, настройках, зависимостях' },
    { value: 'perf', name: 'perf: Улучшение производительности' },
    { value: 'ci', name: 'ci: Изменения в CI/CD' },
    { value: 'build', name: 'build: Изменения в сборке проекта' }
  ],

  scopes: [],

  // Шаблон сообщения коммита: {Тип задачи}/{название ветки} | #{ID задачи в Аспро} | {Описание}
  messages: {
    type: 'Выберите тип изменений:',
    scope: 'Выберите область изменений (опционально):',
    customScope: 'Укажите область изменений:',
    subject: 'Краткое описание изменений:',
    body: 'Подробное описание изменений (опционально):',
    breaking: 'Описание breaking changes (опционально):',
    footer: 'ID задачи в Аспро (например: 12345):',
    confirmCommit: 'Подтвердить создание коммита?'
  },

  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  skipQuestions: ['body', 'breaking'],

  // Максимальная длина заголовка
  subjectLimit: 100,

  // Кастомные вопросы для нашего формата
  askForBreakingChangeFirst: false,
  
  // Автоматическое форматирование в нужный формат
  formatCommitMessage: function({type, scope, subject, body, breaking, footer}) {
    let message = '';
    
    // Получаем текущую ветку
    const branch = require('child_process')
      .execSync('git rev-parse --abbrev-ref HEAD')
      .toString()
      .trim();
    
    // Формируем сообщение в формате: {Тип}/{ветка} | #{ID} | {Описание}
    const branchPart = scope || branch;
    const issueId = footer || 'TBD';
    
    message = `${type}${branchPart !== 'main' && branchPart !== 'master' ? '/' + branchPart : ''} | #${issueId} | ${subject}`;
    
    if (body) {
      message += '\n\n' + body;
    }
    
    if (breaking) {
      message += '\n\nBREAKING CHANGE: ' + breaking;
    }
    
    return message;
  }
}; 