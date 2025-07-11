const inquirer = require('inquirer');
const simpleGit = require('simple-git');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

const { loadConfig } = require('./config');
const { formatCommitMessage } = require('./formatter');

/**
 * Основная функция запуска утилиты коммитов
 */
async function runCommit() {
  try {
    console.log(chalk.blue('🚀 Запуск утилиты коммитов...\n'));
    
    // Инициализация git
    const git = simpleGit();
    
    // Проверка, что мы в git репозитории
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      throw new Error('Не найден git репозиторий. Запустите команду в папке с git проектом.');
    }
    
    // Получение текущей ветки
    const currentBranch = await git.branch();
    console.log(chalk.green(`📍 Текущая ветка: ${currentBranch.current}\n`));
    
    // Загрузка конфигурации
    const config = await loadConfig();
    
    // Получение изменений
    const status = await git.status();
    
    // Фильтруем только файлы в staging area (готовые к коммиту)
    const stagedFiles = status.files.filter(file => 
      file.index === 'M' || file.index === 'A' || file.index === 'D' || file.index === 'R'
    );
    
    if (stagedFiles.length === 0) {
      console.log(chalk.yellow('⚠️  Нет файлов в staging area для коммита'));
      console.log(chalk.gray('💡 Используйте git add для добавления файлов в staging area'));
      return;
    }
    
    console.log(chalk.cyan('📝 Файлы готовые к коммиту:'));
    stagedFiles.forEach(file => {
      const status = file.index === 'M' ? 'modified' : 
                    file.index === 'A' ? 'added' : 
                    file.index === 'D' ? 'deleted' : 
                    file.index === 'R' ? 'renamed' : 'unknown';
      console.log(`  ${chalk.gray(status)} ${file.path}`);
    });
    console.log('');
    
    // Интерактивный опрос
    const answers = await promptUser(config, currentBranch.current);
    
    // Форматирование сообщения коммита
    const commitMessage = formatCommitMessage(answers, config, currentBranch.current);
    
    // Подтверждение коммита
    const { confirm } = await inquirer.prompt([
      {
        type: 'input',
        name: 'confirm',
        message: `Создать коммит с сообщением:\n\n${chalk.cyan(commitMessage)}\n\nНажмите Enter для подтверждения или 'n' для отмены:`,
        default: '',
        filter: (input) => input.trim().toLowerCase(),
        validate: (input) => {
          const value = input.trim().toLowerCase();
          if (value === '' || value === 'y' || value === 'yes' || value === 'n' || value === 'no') {
            return true;
          }
          return 'Введите Enter для подтверждения или n для отмены';
        }
      }
    ]);
    
    const shouldCommit = confirm === '' || confirm === 'y' || confirm === 'yes';
    if (!shouldCommit) {
      console.log(chalk.yellow('❌ Коммит отменен'));
      return;
    }
    
    // Выполнение коммита
    await git.commit(commitMessage);
    console.log(chalk.green('✅ Коммит успешно создан!'));
    
  } catch (error) {
    console.error(chalk.red('❌ Ошибка:'), error.message);
    throw error;
  }
}

/**
 * Интерактивный опрос пользователя
 */
async function promptUser(config, currentBranch) {
  const questions = [];
  
  // Тип коммита
  questions.push({
    type: 'list',
    name: 'type',
    message: 'Выберите тип коммита:',
    choices: config.types || [
      { name: '✨ feat: новая функция', value: 'feat' },
      { name: '🐛 fix: исправление бага', value: 'fix' },
      { name: '📝 docs: документация', value: 'docs' },
      { name: '💄 style: форматирование кода', value: 'style' },
      { name: '♻️ refactor: рефакторинг', value: 'refactor' },
      { name: '⚡ perf: улучшение производительности', value: 'perf' },
      { name: '✅ test: тесты', value: 'test' },
      { name: '🔧 chore: настройки', value: 'chore' }
    ]
  });

  // ID задачи (обязательный, только цифры)
  questions.push({
    type: 'input',
    name: 'taskId',
    message: 'ID задачи (только цифры):',
    validate: (input) => {
      if (!input.trim()) return 'ID задачи обязателен';
      if (!/^\d+$/.test(input.trim())) return 'ID задачи должен содержать только цифры';
      return true;
    }
  });

  // Область изменений
  if (config.scopes && config.scopes.length > 0) {
    questions.push({
      type: 'list',
      name: 'scope',
      message: 'Выберите область изменений:',
      choices: [
        { name: '❌ без области', value: '' },
        ...config.scopes.map(scope => ({ name: scope, value: scope }))
      ]
    });
  }
  
  // Краткое описание
  questions.push({
    type: 'input',
    name: 'subject',
    message: 'Краткое описание изменений:',
    validate: (input) => {
      if (!input.trim()) {
        return 'Описание обязательно';
      }
      if (input.length > 50) {
        return 'Описание должно быть короче 50 символов';
      }
      return true;
    }
  });
  
  // Подробное описание
  questions.push({
    type: 'input',
    name: 'body',
    message: 'Подробное описание (необязательно):',
    filter: (input) => input.trim() || undefined
  });
  
  // Ссылки на задачи
  if (config.issuePrefix) {
    questions.push({
      type: 'input',
      name: 'issues',
      message: `Ссылки на задачи (${config.issuePrefix}-123):`,
      filter: (input) => {
        if (!input.trim()) return undefined;
        return input.split(',').map(issue => issue.trim()).join(', ');
      }
    });
  }
  
  // Дополнительные вопросы из конфигурации
  if (config.additionalQuestions) {
    questions.push(...config.additionalQuestions);
  }
  
  return inquirer.prompt(questions);
}

module.exports = {
  runCommit
}; 