/**
 * Configuration Management
 * Centralized configuration for all tests and agents
 */

export interface TestConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  headless: boolean;
  screenshots: boolean;
  domSnapshots: boolean;
}

export interface AgentConfig {
  supervisor: {
    enabled: boolean;
    timeout: number;
  };
  browser: {
    enabled: boolean;
    headless: boolean;
    captureSnapshots: boolean;
  };
  patch: {
    enabled: boolean;
    formatCode: boolean;
  };
  runner: {
    enabled: boolean;
    workers: number;
  };
  git: {
    enabled: boolean;
    autoPush: boolean;
    createPR: boolean;
  };
}

export interface MCPConfig {
  playwright: {
    command: string;
    args: string[];
  };
  github?: {
    command: string;
    args: string[];
    env: {
      GITHUB_PERSONAL_ACCESS_TOKEN: string;
    };
  };
  filesystem?: {
    command: string;
    args: string[];
  };
}

export class Config {
  static readonly TEST: TestConfig = {
    baseUrl: 'https://cert-comply.content.aws.lexis.com',
    timeout: 30000, // 30 seconds
    retries: 0,
    headless: false,
    screenshots: true,
    domSnapshots: true
  };

  static readonly AGENT: AgentConfig = {
    supervisor: {
      enabled: true,
      timeout: 30000
    },
    browser: {
      enabled: true,
      headless: false,
      captureSnapshots: true
    },
    patch: {
      enabled: true,
      formatCode: true
    },
    runner: {
      enabled: true,
      workers: 1
    },
    git: {
      enabled: false,
      autoPush: false,
      createPR: false
    }
  };

  static readonly PATHS = {
    tests: {
      e2e: 'tests/e2e',
      examples: 'tests/examples',
      generated: 'tests/generated'
    },
    results: 'test-results',
    reports: 'playwright-report',
    docs: 'docs',
    agents: 'src/agents'
  };

  static readonly URLS = {
    sso: 'https://cert-comply.content.aws.lexis.com/sso',
    contentCenter: 'https://cert-comply.content.aws.lexis.com/content-center',
    alertCreation: 'https://cert-comply.content.aws.lexis.com/content-center/alertCreation'
  };
}

export default Config;
