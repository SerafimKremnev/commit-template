import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function setupCommitTemplate(options) {
  const cwd = process.cwd();
  
  // Проверяем, что мы находимся в git репозитории
  if (!await isGitRepository(cwd)) {
    throw new Error('Текущая директория не является git репозиторием. Выполните "git init" сначала.');
  }

  // Создаем конфигурацию commitizen
  await setupCommitizenConfig(cwd, options);
  
  // Настраиваем git hooks
  if (options.setupHooks) {
    await setupGitHooks(cwd);
  }
  
  // Устанавливаем commitizen если нужно
  if (options.installCommitizen) {
    await installCommitizen(cwd);
  }
  
  // Создаем шаблон коммита
  await createCommitTemplate(cwd, options.templateType || 'default');
}

async function isGitRepository(dir) {
  try {
    execSync('git rev-parse --git-dir', { cwd: dir, stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function setupCommitizenConfig(cwd, options) {
  const packageJsonPath = path.join(cwd, 'package.json');
  let packageJson = {};
  
  // Читаем существующий package.json или создаем новый
  if (await fs.pathExists(packageJsonPath)) {
    packageJson = await fs.readJson(packageJsonPath);
  }
  
  // Добавляем конфигурацию commitizen
  packageJson.config = packageJson.config || {};
  packageJson.config.commitizen = {
    path: './cz-config.js'
  };
  
  // Добавляем скрипты
  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.commit = 'cz';
  
  // Добавляем зависимости
  packageJson.devDependencies = packageJson.devDependencies || {};
  if (options.installCommitizen) {
    packageJson.devDependencies.commitizen = '^4.3.0';
    packageJson.devDependencies['cz-customizable'] = '^7.0.0';
  }
  
  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  console.log(chalk.green('📦 package.json обновлен'));
}

async function setupGitHooks(cwd) {
  const hooksDir = path.join(cwd, '.git', 'hooks');
  const commitMsgHookPath = path.join(hooksDir, 'commit-msg');
  
  // Создаем git hook для валидации коммитов
  const hookContent = `#!/bin/sh
# Git commit message template hook
# Добавлен автоматически через commit-template CLI

commit_regex='^(feat|fix|docs|style|refactor|test|chore)(\/.+)? \\| #[0-9]+ \\| .+'

if ! grep -qE "$commit_regex" "$1"; then
  echo "❌ Неверный формат сообщения коммита!"
  echo "Используйте формат: {Тип задачи}/{название ветки} | #{ID задачи} | {Описание}"
  echo "Пример: feat/auth | #123 | Добавлена авторизация пользователей"
  exit 1
fi`;

  await fs.ensureDir(hooksDir);
  await fs.writeFile(commitMsgHookPath, hookContent);
  await fs.chmod(commitMsgHookPath, '755');
  
  console.log(chalk.green('🪝 Git hooks настроены'));
}

async function installCommitizen(cwd) {
  console.log(chalk.blue('📦 Установка Commitizen...'));
  
  try {
    // Проверяем наличие package.json
    const packageJsonPath = path.join(cwd, 'package.json');
    if (!await fs.pathExists(packageJsonPath)) {
      console.log(chalk.yellow('Создание package.json...'));
      execSync('npm init -y', { cwd, stdio: 'inherit' });
    }
    
    // Устанавливаем зависимости
    execSync('npm install --save-dev commitizen cz-customizable', { 
      cwd, 
      stdio: 'inherit' 
    });
    
    console.log(chalk.green('✅ Commitizen установлен'));
  } catch (error) {
    console.log(chalk.yellow('⚠️  Не удалось установить Commitizen автоматически'));
    console.log(chalk.yellow('Выполните вручную: npm install --save-dev commitizen cz-customizable'));
  }
}

async function createCommitTemplate(cwd, templateType) {
  const templatesDir = path.resolve(__dirname, '../templates');
  let templateFile;
  
  switch (templateType) {
    case 'custom':
      templateFile = path.join(cwd, 'cz-config.js');
      break;
    default:
      templateFile = path.join(templatesDir, 'default-cz-config.js');
  }
  
  const targetPath = path.join(cwd, 'cz-config.js');
  
  if (templateType === 'custom') {
    // Кастомный шаблон уже создан в createCustomTemplate
    return;
  }
  
  // Копируем шаблон
  await fs.copy(templateFile, targetPath);
  console.log(chalk.green('📝 Шаблон коммита создан: cz-config.js'));
} 