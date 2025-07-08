#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createExampleConfig } = require('../src/config');

/**
 * Скрипт инициализации утилиты коммитов
 */
async function init() {
  try {
    console.log('🚀 Инициализация утилиты коммитов...\n');
    
    const projectRoot = process.cwd();
    
    // Проверяем, что мы в git репозитории
    if (!fs.existsSync(path.join(projectRoot, '.git'))) {
      console.error('❌ Ошибка: Не найден git репозиторий');
      console.log('Запустите git init перед инициализацией утилиты');
      process.exit(1);
    }
    
    // Проверяем package.json
    const packageJsonPath = path.join(projectRoot, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      console.error('❌ Ошибка: Не найден package.json');
      console.log('Создайте package.json перед инициализацией утилиты');
      process.exit(1);
    }
    
    // Читаем package.json
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Добавляем скрипт commit
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }
    
    if (!packageJson.scripts.commit) {
      packageJson.scripts.commit = 'commit-template';
      console.log('✅ Добавлен скрипт "commit" в package.json');
    } else {
      console.log('ℹ️  Скрипт "commit" уже существует в package.json');
    }
    
    // Записываем обновленный package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    
    // Создаем конфигурационный файл
    const configPath = path.join(projectRoot, 'commit.config.js');
    if (!fs.existsSync(configPath)) {
      const exampleConfig = createExampleConfig();
      fs.writeFileSync(configPath, exampleConfig);
      console.log('✅ Создан файл commit.config.js с примером конфигурации');
    } else {
      console.log('ℹ️  Файл commit.config.js уже существует');
    }
    
    // Создаем .gitignore если не существует
    const gitignorePath = path.join(projectRoot, '.gitignore');
    if (!fs.existsSync(gitignorePath)) {
      fs.writeFileSync(gitignorePath, 'node_modules/\n.DS_Store\n');
      console.log('✅ Создан файл .gitignore');
    }
    
    console.log('\n🎉 Инициализация завершена!');
    console.log('\n📋 Следующие шаги:');
    console.log('1. Установите утилиту: npm install --save-dev commit-template');
    console.log('2. Настройте commit.config.js под ваши нужды');
    console.log('3. Используйте npm run commit для создания коммитов');
    console.log('\n📖 Подробная документация: README.md');
    
  } catch (error) {
    console.error('❌ Ошибка инициализации:', error.message);
    process.exit(1);
  }
}

// Запуск если скрипт вызван напрямую
if (require.main === module) {
  init();
}

module.exports = { init }; 