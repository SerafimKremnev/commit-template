const { formatCommitMessage } = require('../src/formatter');
const { loadConfig } = require('../src/config');

describe('Commit Template Tests', () => {
  describe('formatCommitMessage', () => {
    it('should format basic commit message', () => {
      const answers = {
        type: 'feat',
        subject: 'add new feature'
      };
      
      const config = {};
      const branch = 'main';
      
      const result = formatCommitMessage(answers, config, branch);
      expect(result).toBe('feat: add new feature');
    });
    
    it('should format commit message with scope', () => {
      const answers = {
        type: 'fix',
        scope: 'auth',
        subject: 'fix login bug'
      };
      
      const config = {};
      const branch = 'main';
      
      const result = formatCommitMessage(answers, config, branch);
      expect(result).toBe('fix(auth): fix login bug');
    });
    
    it('should format commit message with body', () => {
      const answers = {
        type: 'docs',
        subject: 'update README',
        body: 'Added installation instructions'
      };
      
      const config = {};
      const branch = 'main';
      
      const result = formatCommitMessage(answers, config, branch);
      expect(result).toBe('docs: update README\n\nAdded installation instructions');
    });
    
    it('should format commit message with breaking change', () => {
      const answers = {
        type: 'feat',
        subject: 'change API',
        breaking: true,
        breakingDescription: 'API now returns Promise'
      };
      
      const config = {};
      const branch = 'main';
      
      const result = formatCommitMessage(answers, config, branch);
      expect(result).toBe('feat: change API\n\nBREAKING CHANGE: API now returns Promise');
    });
    
    it('should use custom message format', () => {
      const answers = {
        type: 'feat',
        subject: 'add feature'
      };
      
      const config = {
        messageFormat: (answers, config, branch) => {
          return `✨ ${answers.type}: ${answers.subject}`;
        }
      };
      
      const branch = 'main';
      
      const result = formatCommitMessage(answers, config, branch);
      expect(result).toBe('✨ feat: add feature');
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