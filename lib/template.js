import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';

export async function createCustomTemplate() {
  console.log(chalk.blue('\n🎨 Создание кастомного шаблона коммита'));
  
  const config = await inquirer.prompt([
    {
      type: 'input',
      name: 'maxSubjectLength',
      message: 'Максимальная длина заголовка коммита:',
      default: 100,
      validate: (input) => {
        const num = parseInt(input);
        return (num > 0 && num <= 200) || 'Введите число от 1 до 200';
      }
    },
    {
      type: 'confirm',
      name: 'includeBody',
      message: 'Включить поле для подробного описания?',
      default: true
    },
    {
      type: 'confirm',
      name: 'includeBreakingChange',
      message: 'Включить поле для breaking changes?',
      default: true
    },
    {
      type: 'confirm',
      name: 'includeIssues',
      message: 'Включить поле для связанных задач/issues?',
      default: true
    }
  ]);

  // Настройка типов коммитов
  const types = await configureCommitTypes();
  
  // Настройка дополнительных полей
  const customFields = await configureCustomFields();
  
  // Генерация конфигурации
  const czConfig = generateCzConfig({
    ...config,
    types,
    customFields
  });
  
  // Сохранение конфигурации
  const targetPath = path.join(process.cwd(), 'cz-config.js');
  await fs.writeFile(targetPath, czConfig);
  
  console.log(chalk.green('✅ Кастомный шаблон создан!'));
}

async function configureCommitTypes() {
  console.log(chalk.blue('\n📋 Настройка типов коммитов'));
  
  const defaultTypes = [
    { value: 'feat', name: 'feat: Новая функциональность' },
    { value: 'fix', name: 'fix: Исправление бага' },
    { value: 'docs', name: 'docs: Изменения в документации' },
    { value: 'style', name: 'style: Изменения стилей кода' },
    { value: 'refactor', name: 'refactor: Рефакторинг кода' },
    { value: 'test', name: 'test: Добавление/изменение тестов' },
    { value: 'chore', name: 'chore: Изменения инфраструктуры' }
  ];
  
  const { useDefaultTypes } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'useDefaultTypes',
      message: 'Использовать стандартные типы коммитов?',
      default: true
    }
  ]);
  
  if (useDefaultTypes) {
    return defaultTypes;
  }
  
  const types = [];
  let addMore = true;
  
  while (addMore) {
    const typeConfig = await inquirer.prompt([
      {
        type: 'input',
        name: 'value',
        message: 'Тип коммита (например: feat):',
        validate: (input) => input.trim() !== '' || 'Тип не может быть пустым'
      },
      {
        type: 'input',
        name: 'name',
        message: 'Описание типа:',
        validate: (input) => input.trim() !== '' || 'Описание не может быть пустым'
      }
    ]);
    
    types.push(typeConfig);
    
    const { continue_ } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continue_',
        message: 'Добавить еще один тип?',
        default: false
      }
    ]);
    
    addMore = continue_;
  }
  
  return types;
}

async function configureCustomFields() {
  console.log(chalk.blue('\n🔧 Настройка дополнительных полей'));
  
  const { addCustomFields } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'addCustomFields',
      message: 'Добавить дополнительные поля (номер спринта, номер задачи и т.д.)?',
      default: true
    }
  ]);
  
  if (!addCustomFields) {
    return [];
  }
  
  const fields = [];
  let addMore = true;
  
  while (addMore) {
    const fieldConfig = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Название поля (например: sprint):',
        validate: (input) => input.trim() !== '' || 'Название не может быть пустым'
      },
      {
        type: 'input',
        name: 'message',
        message: 'Текст вопроса для пользователя:',
        validate: (input) => input.trim() !== '' || 'Текст вопроса не может быть пустым'
      },
      {
        type: 'list',
        name: 'type',
        message: 'Тип поля:',
        choices: [
          { name: 'Текст', value: 'input' },
          { name: 'Список выбора', value: 'list' },
          { name: 'Да/Нет', value: 'confirm' }
        ]
      },
      {
        type: 'confirm',
        name: 'required',
        message: 'Обязательное поле?',
        default: false
      }
    ]);
    
    if (fieldConfig.type === 'list') {
      const choices = [];
      let addChoices = true;
      
      while (addChoices) {
        const { choice } = await inquirer.prompt([
          {
            type: 'input',
            name: 'choice',
            message: 'Вариант выбора:',
            validate: (input) => input.trim() !== '' || 'Вариант не может быть пустым'
          }
        ]);
        
        choices.push(choice);
        
        const { continue_ } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'continue_',
            message: 'Добавить еще один вариант?',
            default: false
          }
        ]);
        
        addChoices = continue_;
      }
      
      fieldConfig.choices = choices;
    }
    
    fields.push(fieldConfig);
    
    const { continue_ } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continue_',
        message: 'Добавить еще одно поле?',
        default: false
      }
    ]);
    
    addMore = continue_;
  }
  
  return fields;
}

function generateCzConfig(config) {
  return `module.exports = {
  types: [
${config.types.map(type => `    { value: '${type.value}', name: '${type.name}' }`).join(',\n')}
  ],

  scopes: [],

  // Шаблон сообщения коммита
  // {Тип задачи}/{название ветки} | #{ID задачи} | {Описание}
  messages: {
    type: 'Выберите тип изменений:',
    scope: 'Выберите область изменений (опционально):',
    customScope: 'Укажите область изменений:',
    subject: 'Краткое описание изменений:',
    body: 'Подробное описание изменений (опционально):',
    breaking: 'Описание breaking changes (опционально):',
    footer: 'Связанные задачи/issues (опционально):',
    confirmCommit: 'Вы уверены, что хотите создать коммит с таким сообщением?'
  },

  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  skipQuestions: [],

  // Максимальная длина заголовка
  subjectLimit: ${config.maxSubjectLength},

  // Формат сообщения коммита
  subjectPattern: '^(.{1,${config.maxSubjectLength}})$',
  
  // Добавляем ID задачи в формат
  footerPrefix: '',
  
  // Кастомные поля
${config.customFields.length > 0 ? `  customFields: [
${config.customFields.map(field => generateFieldConfig(field)).join(',\n')}
  ],` : ''}

  // Автоматическое форматирование сообщения
  subjectSeparator: ' | ',
  typePrefix: '',
  
  // Функция форматирования финального сообщения
  formatCommitMessage: function(answers) {
    const type = answers.type;
    const scope = answers.scope ? '/' + answers.scope : '';
    const subject = answers.subject;
    const body = answers.body ? '\\n\\n' + answers.body : '';
    const breaking = answers.breaking ? '\\n\\nBREAKING CHANGE: ' + answers.breaking : '';
    const footer = answers.footer ? '\\n\\n' + answers.footer : '';
    
    // Формат: {Тип задачи}/{область} | #{ID} | {Описание}
    let commitMessage = \`\${type}\${scope} | #\${answers.issueId || 'TBD'} | \${subject}\`;
    
    return commitMessage + body + breaking + footer;
  }
};`;
}

function generateFieldConfig(field) {
  let config = `    {
      name: '${field.name}',
      message: '${field.message}',
      type: '${field.type}'`;

  if (field.required) {
    config += `,
      required: true`;
  }

  if (field.choices) {
    config += `,
      choices: [${field.choices.map(choice => `'${choice}'`).join(', ')}]`;
  }

  config += `
    }`;

  return config;
} 