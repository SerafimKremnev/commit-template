#!/usr/bin/env node

const { runCommit } = require('../src/index.js');

// Обработка ошибок
process.on('unhandledRejection', (error) => {
  console.error('Ошибка:', error.message);
  process.exit(1);
});

// Запуск утилиты
runCommit().catch((error) => {
  console.error('Критическая ошибка:', error.message);
  process.exit(1);
}); 