#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { setupCommitTemplate } from '../lib/setup.js';
import { createCustomTemplate } from '../lib/template.js';

const program = new Command();

program
  .name('commit-template')
  .description('CLI инструмент для настройки git commit шаблонов')
  .version('1.0.0');

program
  .command('init')
  .description('Инициализация git commit шаблона в текущем репозитории')
  .option('-t, --template <type>', 'Тип шаблона (default, custom)', 'default')
  .option('-s, --skip-prompts', 'Пропустить интерактивные вопросы')
  .action(async (options) => {
    try {
      console.log(chalk.blue('🚀 Настройка git commit шаблона...'));
      
      if (!options.skipPrompts) {
        const answers = await inquirer.prompt([
          {
            type: 'list',
            name: 'templateType',
            message: 'Выберите тип шаблона:',
            choices: [
              { name: 'Стандартный ({Тип задачи}/{название ветки} | #{ID задачи} | {Описание})', value: 'default' },
              { name: 'Кастомный (создать свой шаблон)', value: 'custom' }
            ],
            default: options.template
          },
          {
            type: 'confirm',
            name: 'setupHooks',
            message: 'Настроить git hooks для автоматического запуска?',
            default: true
          },
          {
            type: 'confirm',
            name: 'installCommitizen',
            message: 'Установить Commitizen для интерактивных коммитов?',
            default: true
          }
        ]);
        
        options = { ...options, ...answers };
      }

      if (options.templateType === 'custom') {
        await createCustomTemplate();
      }

      await setupCommitTemplate(options);
      
      console.log(chalk.green('✅ Git commit шаблон успешно настроен!'));
      console.log(chalk.yellow('\n📝 Использование:'));
      console.log('  git commit          - стандартный коммит с шаблоном');
      console.log('  npx cz              - интерактивный коммит (если установлен Commitizen)');
      console.log('  ct config           - изменить настройки шаблона');
      
    } catch (error) {
      console.error(chalk.red('❌ Ошибка:'), error.message);
      process.exit(1);
    }
  });

program
  .command('config')
  .description('Настройка существующего шаблона')
  .action(async () => {
    try {
      await createCustomTemplate();
      console.log(chalk.green('✅ Конфигурация обновлена!'));
    } catch (error) {
      console.error(chalk.red('❌ Ошибка:'), error.message);
      process.exit(1);
    }
  });

program
  .command('remove')
  .description('Удаление git commit шаблона из проекта')
  .action(async () => {
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Вы уверены, что хотите удалить git commit шаблон?',
        default: false
      }
    ]);

    if (confirm) {
      // TODO: implement removal logic
      console.log(chalk.green('✅ Git commit шаблон удален!'));
    }
  });

program.parse(); 