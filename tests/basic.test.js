const { formatCommitMessage } = require('../src/formatter');
const { loadConfig } = require('../src/config');

describe('Commit Template Tests', () => {
  describe('formatCommitMessage', () => {
    it('should format basic commit message', () => {
      const answers = {
        type: 'feat',
        taskId: '123',
        subject: 'add new feature'
      };
      
      const config = {};
      const branch = 'main';
      
      const result = formatCommitMessage(answers, config, branch);
      expect(result).toBe('feat/[main] | #123 | add new feature');
    });
    
    it('should format commit message with scope', () => {
      const answers = {
        type: 'fix',
        taskId: '456',
        subject: 'fix login bug'
      };
      
      const config = {};
      const branch = 'main';
      
      const result = formatCommitMessage(answers, config, branch);
      expect(result).toBe('fix/[main] | #456 | fix login bug');
    });
    
    it('should format commit message with custom format', () => {
      const answers = {
        type: 'docs',
        taskId: '789',
        subject: 'update README'
      };
      
      const config = {
        messageFormat: (answers, config, branch) => {
          return `${answers.type}/[${branch}] | #${answers.taskId} | ${answers.subject}`;
        }
      };
      
      const branch = 'main';
      
      const result = formatCommitMessage(answers, config, branch);
      expect(result).toBe('docs/[main] | #789 | update README');
    });
    
    it('should use custom message format', () => {
      const answers = {
        type: 'feat',
        taskId: '999',
        subject: 'add feature'
      };
      
      const config = {
        messageFormat: (answers, config, branch) => {
          return `✨ ${answers.type}: ${answers.subject} (Task: ${answers.taskId})`;
        }
      };
      
      const branch = 'main';
      
      const result = formatCommitMessage(answers, config, branch);
      expect(result).toBe('✨ feat: add feature (Task: 999)');
    });
  });
  
  describe('loadConfig', () => {
    it('should return default config when no config file exists', async () => {
      const config = await loadConfig();
      
      expect(config).toHaveProperty('types');
      expect(config).toHaveProperty('scopes');
      expect(config).toHaveProperty('issuePrefix');
      expect(config).toHaveProperty('additionalQuestions');
      
      expect(Array.isArray(config.types)).toBe(true);
      expect(Array.isArray(config.scopes)).toBe(true);
      expect(Array.isArray(config.additionalQuestions)).toBe(true);
    });
  });
}); 