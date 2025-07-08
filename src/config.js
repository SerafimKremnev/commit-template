const path = require('path');
const fs = require('fs');

/**
 * Загружает конфигурацию из файла commit.config.js
 */
async function loadConfig() {
  const configPath = path.resolve(process.cwd(), 'commit.config.js');
  
  // Базовая конфигурация по умолчанию
  const defaultConfig = {
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
    scopes: [],
    issuePrefix: null,
    additionalQuestions: [],
    messageFormat: null,
    branchFormat: null
  };
  
  // Проверяем существование файла конфигурации
  if (fs.existsSync(configPath)) {
    try {
      const userConfig = require(configPath);
      
      // Объединяем с конфигурацией по умолчанию
      return {
        ...defaultConfig,
        ...userConfig,
        // Специальная обработка для массивов
        types: userConfig.types || defaultConfig.types,
        scopes: userConfig.scopes || defaultConfig.scopes,
        additionalQuestions: userConfig.additionalQuestions || defaultConfig.additionalQuestions
      };
    } catch (error) {
      console.warn(`⚠️  Ошибка загрузки конфигурации: ${error.message}`);
      return defaultConfig;
    }
  }
  
  return defaultConfig;
}

/**
 * Создает пример файла конфигурации
 */
function createExampleConfig() {
  const exampleConfig = `module.exports = {
  // Типы коммитов (можно переопределить полностью)
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
  
  // Области изменений (опционально)
  scopes: ['frontend', 'backend', 'api', 'ui', 'docs'],
  
  // Префикс для задач (например, JIRA-123)
  issuePrefix: 'JIRA',
  
  // Дополнительные вопросы (опционально)
  additionalQuestions: [
    {
      type: 'list',
      name: 'breaking',
      message: 'Это breaking change?',
      choices: [
        { name: 'Нет', value: false },
        { name: 'Да', value: true }
      ]
    },
    {
      type: 'input',
      name: 'breakingDescription',
      message: 'Опишите breaking change:',
      when: (answers) => answers.breaking,
      validate: (input) => {
        if (!input.trim()) {
          return 'Описание breaking change обязательно';
        }
        return true;
      }
    }
  ],
  
  // Кастомное форматирование сообщения (опционально)
  messageFormat: (answers, config, branch) => {
    let message = \`\${answers.type}\`;
    
    if (answers.scope) {
      message += \`(\${answers.scope})\`;
    }
    
    message += \`: \${answers.subject}\`;
    
    if (answers.body) {
      message += \`\\n\\n\${answers.body}\`;
    }
    
    if (answers.breaking) {
      message += \`\\n\\nBREAKING CHANGE: \${answers.breakingDescription}\`;
    }
    
    if (answers.issues) {
      message += \`\\n\\nCloses \${answers.issues}\`;
    }
    
    return message;
  },
  
  // Кастомное форматирование ветки (опционально)
  branchFormat: (branch) => {
    // Пример: извлекаем номер задачи из названия ветки
    const match = branch.match(/(JIRA-\\d+)/);
    return match ? match[1] : null;
  }
};`;

  return exampleConfig;
}

module.exports = {
  loadConfig,
  createExampleConfig
}; 