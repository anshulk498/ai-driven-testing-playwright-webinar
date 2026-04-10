/**
 * Patch Agent - Filesystem MCP Wrapper
 * Generates and writes test files
 */

import * as fs from 'fs';
import * as path from 'path';
import { UIFlow } from './browser-agent';

export interface TestPattern {
  imports: string;
  setup: string;
  structure: string;
}

export class PatchAgent {
  private workspaceRoot: string;

  constructor(workspaceRoot: string) {
    this.workspaceRoot = workspaceRoot;
  }

  /**
   * Analyze existing test patterns
   */
  async analyzeTestPattern(sampleTestPath: string): Promise<TestPattern> {
    console.log(`[Patch Agent] Analyzing test pattern: ${sampleTestPath}`);
    
    const fullPath = path.join(this.workspaceRoot, sampleTestPath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`[Patch Agent] Sample test not found, using default pattern`);
      return this.getDefaultPattern();
    }

    const content = fs.readFileSync(fullPath, 'utf-8');
    
    // Extract imports
    const imports = content.match(/import.*?;/g)?.join('\n') || '';
    
    // Extract test structure
    const hasDescribe = content.includes('test.describe');
    const structure = hasDescribe ? 'describe' : 'single';

    return {
      imports,
      setup: '',
      structure
    };
  }

  /**
   * Generate test code from UI flow
   */
  async generateTest(config: {
    flow: UIFlow;
    pattern: TestPattern;
    name: string;
    outputPath: string;
  }): Promise<string> {
    console.log(`[Patch Agent] Generating test: ${config.name}`);
    
    const testCode = this.buildTestCode(config);
    
    return testCode;
  }

  /**
   * Build complete test code
   */
  private buildTestCode(config: {
    flow: UIFlow;
    pattern: TestPattern;
    name: string;
  }): string {
    const { flow, pattern, name } = config;
    
    // Generate test steps
    const testSteps = flow.steps.map((step, index) => {
      return this.generateStepCode(step, index + 1);
    }).join('\n\n');

    const testName = this.formatTestName(name);
    const suiteName = this.formatSuiteName(name);

    const code = `${pattern.imports || this.getDefaultPattern().imports}

test.describe('${suiteName}', () => {
  test.setTimeout(300000); // 5 minutes

  test('${testName}', async ({ page, context }) => {
    console.log('\\n=== Starting ${testName} ===\\n');

    // Navigate to application
    console.log('Navigating to: ${flow.url}');
    await page.goto('${flow.url}');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/step-0-initial.png', fullPage: true });

${testSteps}

    console.log('\\n✅ Test completed successfully');
  });
});
`;

    return code;
  }

  /**
   * Generate code for a single step
   */
  private generateStepCode(step: any, stepNumber: number): string {
    const { action, element, locator } = step;

    let code = `    // Step ${stepNumber}: ${action} ${element}\n`;
    code += `    console.log('Step ${stepNumber}: ${action} ${element}...');\n`;

    if (action === 'click') {
      code += `    const element${stepNumber} = page.locator('${locator}');\n`;
      code += `    await element${stepNumber}.click();\n`;
      code += `    await page.waitForTimeout(1000);\n`;
      code += `    console.log('✓ Clicked ${element}');\n`;
    } else if (action === 'fill') {
      code += `    const element${stepNumber} = page.locator('${locator}');\n`;
      code += `    await element${stepNumber}.fill('${step.value || 'test value'}');\n`;
      code += `    await page.waitForTimeout(500);\n`;
      code += `    console.log('✓ Filled ${element}');\n`;
    } else if (action === 'verify') {
      code += `    const element${stepNumber} = page.locator('${locator}');\n`;
      code += `    await expect(element${stepNumber}).toBeVisible();\n`;
      code += `    console.log('✓ Verified ${element}');\n`;
    }

    code += `    await page.screenshot({ path: 'test-results/step-${stepNumber}.png', fullPage: true });`;

    return code;
  }

  /**
   * Write test file to disk
   */
  async writeFile(filePath: string, content: string): Promise<void> {
    const fullPath = path.join(this.workspaceRoot, filePath);
    const dir = path.dirname(fullPath);

    console.log(`[Patch Agent] Writing test file: ${filePath}`);

    // Create directory if needed
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`[Patch Agent] ✓ File written: ${fullPath}`);
  }

  /**
   * Format test name
   */
  private formatTestName(name: string): string {
    return name
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Format suite name
   */
  private formatSuiteName(name: string): string {
    const parts = name.split('-');
    return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' - ');
  }

  /**
   * Get default test pattern
   */
  private getDefaultPattern(): TestPattern {
    return {
      imports: `import { test, expect } from '@playwright/test';`,
      setup: '',
      structure: 'describe'
    };
  }

  /**
   * Save DOM snapshot
   */
  async saveDOMSnapshot(stepName: string, snapshot: any): Promise<void> {
    const filePath = path.join(this.workspaceRoot, 'test-results', `dom-${stepName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(snapshot, null, 2));
    console.log(`[Patch Agent] DOM snapshot saved: dom-${stepName}.json`);
  }
}
