/**
 * Runner Agent - Test Execution
 * Runs Playwright tests and captures results
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface TestResult {
  passed: boolean;
  duration: number;
  errors: string[];
  output: string;
  testFile: string;
}

export class RunnerAgent {
  private workspaceRoot: string;

  constructor(workspaceRoot: string) {
    this.workspaceRoot = workspaceRoot;
  }

  /**
   * Run a Playwright test
   */
  async runTest(testFile: string, options: { headed?: boolean } = {}): Promise<TestResult> {
    console.log(`[Runner Agent] Running test: ${testFile}`);
    
    const headed = options.headed ? '--headed' : '';
    const command = `npx playwright test ${testFile} ${headed} --workers=1`;

    const startTime = Date.now();
    
    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: this.workspaceRoot,
        maxBuffer: 1024 * 1024 * 10 // 10MB buffer
      });

      const duration = Date.now() - startTime;
      const output = stdout + stderr;

      const passed = this.parseTestResult(output);
      const errors = this.extractErrors(output);

      console.log(`[Runner Agent] Test ${passed ? 'PASSED' : 'FAILED'} in ${duration}ms`);

      return {
        passed,
        duration,
        errors,
        output,
        testFile
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      const output = error.stdout + error.stderr;
      const errors = this.extractErrors(output);

      console.log(`[Runner Agent] Test FAILED in ${duration}ms`);

      return {
        passed: false,
        duration,
        errors,
        output,
        testFile
      };
    }
  }

  /**
   * Parse test result from output
   */
  private parseTestResult(output: string): boolean {
    // Look for pass indicators
    const passPatterns = [
      /(\d+) passed/,
      /✓/,
      /Test passed/i
    ];

    const failPatterns = [
      /(\d+) failed/,
      /Error:/,
      /Test failed/i,
      /expected/i
    ];

    const hasFail = failPatterns.some(pattern => pattern.test(output));
    const hasPass = passPatterns.some(pattern => pattern.test(output));

    return hasPass && !hasFail;
  }

  /**
   * Extract error messages from output
   */
  private extractErrors(output: string): string[] {
    const errors: string[] = [];
    const lines = output.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.includes('Error:') || line.includes('failed') || line.includes('Expected')) {
        // Capture error and next few lines for context
        const errorBlock = lines.slice(i, Math.min(i + 5, lines.length)).join('\n');
        errors.push(errorBlock.trim());
      }
    }

    return errors;
  }

  /**
   * Run all tests in a directory
   */
  async runAllTests(directory: string = 'tests'): Promise<TestResult[]> {
    console.log(`[Runner Agent] Running all tests in: ${directory}`);
    
    const command = `npx playwright test ${directory} --workers=1`;
    
    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: this.workspaceRoot,
        maxBuffer: 1024 * 1024 * 10
      });

      const output = stdout + stderr;
      
      // Parse summary
      console.log(`[Runner Agent] Test suite completed`);
      console.log(output);

      return [{
        passed: this.parseTestResult(output),
        duration: 0,
        errors: this.extractErrors(output),
        output,
        testFile: directory
      }];
    } catch (error: any) {
      return [{
        passed: false,
        duration: 0,
        errors: this.extractErrors(error.stdout + error.stderr),
        output: error.stdout + error.stderr,
        testFile: directory
      }];
    }
  }

  /**
   * Generate HTML report
   */
  async generateReport(): Promise<void> {
    console.log(`[Runner Agent] Generating HTML report...`);
    
    try {
      await execAsync('npx playwright show-report', {
        cwd: this.workspaceRoot
      });
      console.log(`[Runner Agent] ✓ Report generated`);
    } catch (error) {
      console.log(`[Runner Agent] Report generation failed`);
    }
  }
}
