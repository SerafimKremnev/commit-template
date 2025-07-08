/**
 * Форматирует сообщение коммита на основе ответов пользователя
 */
function formatCommitMessage(answers, config, currentBranch) {
  // Если есть кастомная функция форматирования, используем её
  if (config.messageFormat && typeof config.messageFormat === 'function') {
    return config.messageFormat(answers, config, currentBranch);
  }

  // Новый дефолтный формат
  const type = answers.type;
  const branch = currentBranch;
  const taskId = answers.taskId;
  const subject = answers.subject;
  return `${type}/[${branch}] | #${taskId} | ${subject}`;
}

/**
 * Валидирует формат сообщения коммита
 */
function validateCommitMessage(message) {
  const errors = [];
  
  // Проверяем длину первой строки (должна быть <= 72 символа)
  const lines = message.split('\n');
  if (lines[0].length > 72) {
    errors.push('Первая строка сообщения должна быть короче 72 символов');
  }
  
  // Проверяем, что сообщение не пустое
  if (!message.trim()) {
    errors.push('Сообщение коммита не может быть пустым');
  }
  
  // Проверяем формат типа коммита
  const typeMatch = lines[0].match(/^(feat|fix|docs|style|refactor|perf|test|chore)(\([a-z-]+\))?:/);
  if (!typeMatch) {
    errors.push('Сообщение должно начинаться с типа коммита (feat, fix, docs, etc.)');
  }
  
  return errors;
}

/**
 * Форматирует ветку для отображения
 */
function formatBranch(branch, config) {
  if (config.branchFormat && typeof config.branchFormat === 'function') {
    return config.branchFormat(branch);
  }
  
  return branch;
}

module.exports = {
  formatCommitMessage,
  validateCommitMessage,
  formatBranch
}; 