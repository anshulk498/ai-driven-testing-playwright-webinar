/**
 * Supervisor Agent - Main Orchestrator
 * Coordinates all agents to generate tests automatically
 */

import { chromium, Browser, Page } from '@playwright/test';
import { BrowserAgent } from './browser-agent';
import { PatchAgent } from './patch-agent';
import { RunnerAgent } from './runner-agent';
import * as path from 'path';

export interface TestSpecification {
  name: string;
  url: string;
  steps: string[];
  description?: string;
}

export interface GenerationResult {
  success: boolean;
  testFile: string;
  testPassed: boolean;
  duration: number;
  errors: string[];
  message: string;
}

export class SupervisorAgent {
  private workspaceRoot: string;
  private browser: Browser | null = null;
  private page: Page | null = null;

  constructor(workspaceRoot: string) {
    this.workspaceRoot = workspaceRoot;
  }

  /**
   * Main workflow: Generate and validate a test
   */
  async generateTest(spec: TestSpecification): Promise<GenerationResult> {
    console.log('\n═══════════════════════════════════════════');
    console.log(`🤖 SUPERVISOR: Starting test generation`);
    console.log(`📝 Test: ${spec.name}`);
    console.log(`🌐 URL: ${spec.url}`);
    console.log(`📋 Steps: ${spec.steps.length}`);
    console.log('═══════════════════════════════════════════\n');

    const startTime = Date.now();

    try {
      // Step 1: Initialize browser
      await this.initializeBrowser();
      if (!this.page) throw new Error('Browser initialization failed');

      // Step 2: Explore UI with Browser Agent
      console.log('\n🌐 PHASE 1: UI Exploration');
      const browserAgent = new BrowserAgent(this.page);
      const uiFlow = await browserAgent.recordFlow(spec.steps, spec.url);
      console.log(`✓ Recorded ${uiFlow.steps.length} steps`);

      // Step 3: Generate test code with Patch Agent
      console.log('\n📝 PHASE 2: Test Generation');
      const patchAgent = new PatchAgent(this.workspaceRoot);
      
      // Analyze existing test pattern
      const pattern = await patchAgent.analyzeTestPattern('tests/verify-obligation-export.spec.ts');
      
      // Generate test file
      const testFileName = this.sanitizeFileName(spec.name);
      const testFilePath = `tests/${testFileName}.spec.ts`;
      
      const testCode = await patchAgent.generateTest({
        flow: uiFlow,
        pattern,
        name: testFileName,
        outputPath: testFilePath
      });

      // Write test file
      await patchAgent.writeFile(testFilePath, testCode);
      console.log(`✓ Generated: ${testFilePath}`);

      // Save DOM snapshots
      for (let i = 0; i < uiFlow.steps.length; i++) {
        const step = uiFlow.steps[i];
        if (step.snapshot) {
          await patchAgent.saveDOMSnapshot(`${testFileName}-step-${i + 1}`, step.snapshot);
        }
      }

      // Step 4: Run test with Runner Agent
      console.log('\n🧪 PHASE 3: Test Execution');
      const runnerAgent = new RunnerAgent(this.workspaceRoot);
      const testResult = await runnerAgent.runTest(testFilePath, { headed: false });

      // Step 5: Analyze results
      console.log('\n📊 PHASE 4: Results Analysis');
      const duration = Date.now() - startTime;

      if (testResult.passed) {
        console.log('✅ TEST GENERATION SUCCESSFUL!');
        console.log(`✓ Test file: ${testFilePath}`);
        console.log(`✓ Test execution: PASSED`);
        console.log(`✓ Duration: ${duration}ms`);

        await this.cleanup();

        return {
          success: true,
          testFile: testFilePath,
          testPassed: true,
          duration,
          errors: [],
          message: `Successfully generated and validated test: ${testFilePath}`
        };
      } else {
        console.log('⚠️ TEST GENERATED BUT FAILED');
        console.log(`Test file: ${testFilePath}`);
        console.log(`Errors found: ${testResult.errors.length}`);

        // Debug with Browser Agent
        if (this.page) {
          const debugInfo = await browserAgent.debugFailure(testResult.errors);
          console.log(`Debug snapshot saved: ${debugInfo.screenshot}`);
        }

        await this.cleanup();

        return {
          success: true, // Test was generated
          testFile: testFilePath,
          testPassed: false,
          duration,
          errors: testResult.errors,
          message: `Test generated but failed execution. Debug info captured.`
        };
      }
    } catch (error: any) {
      console.error('❌ SUPERVISOR ERROR:', error.message);
      
      await this.cleanup();

      return {
        success: false,
        testFile: '',
        testPassed: false,
        duration: Date.now() - startTime,
        errors: [error.message],
        message: `Test generation failed: ${error.message}`
      };
    }
  }

  /**
   * Initialize browser for UI exploration
   */
  private async initializeBrowser(): Promise<void> {
    console.log('[Supervisor] Initializing browser...');
    this.browser = await chromium.launch({ headless: false });
    const context = await this.browser.newContext();
    this.page = await context.newPage();
    console.log('[Supervisor] ✓ Browser ready');
  }

  /**
   * Cleanup browser resources
   */
  private async cleanup(): Promise<void> {
    console.log('\n[Supervisor] Cleaning up...');
    if (this.page) await this.page.close();
    if (this.browser) await this.browser.close();
    console.log('[Supervisor] ✓ Cleanup complete');
  }

  /**
   * Sanitize filename
   */
  private sanitizeFileName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * Generate multiple tests from specifications
   */
  async generateMultipleTests(specs: TestSpecification[]): Promise<GenerationResult[]> {
    console.log(`\n🚀 Generating ${specs.length} tests...\n`);
    
    const results: GenerationResult[] = [];

    for (const spec of specs) {
      const result = await this.generateTest(spec);
      results.push(result);
      
      // Wait between tests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Summary
    const successful = results.filter(r => r.success && r.testPassed).length;
    const generated = results.filter(r => r.success).length;
    
    console.log('\n═══════════════════════════════════════════');
    console.log(`📊 BATCH GENERATION SUMMARY`);
    console.log(`Total: ${specs.length}`);
    console.log(`Generated: ${generated}`);
    console.log(`Passed: ${successful}`);
    console.log('═══════════════════════════════════════════\n');

    return results;
  }
}
