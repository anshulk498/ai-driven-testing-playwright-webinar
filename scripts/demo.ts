/**
 * Demo Script - Show Agent System in Action
 * Run: npx ts-node demo.ts
 */

import { SupervisorAgent } from './agents/supervisor';
import * as path from 'path';

async function demo() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║   🤖 AI-Driven Test Generation System - DEMO              ║');
  console.log('║   Automated Playwright Test Generation with MCP Agents    ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const workspaceRoot = __dirname;
  const supervisor = new SupervisorAgent(workspaceRoot);

  // Demo Test Specification
  const demoSpec = {
    name: 'Simple Login Test',
    url: 'https://cert-comply.content.aws.lexis.com/sso',
    steps: [
      'Click Developer Login'
    ],
    description: 'Automated demo of test generation'
  };

  console.log('📋 Test Specification:');
  console.log('─────────────────────────────────────────────────────────');
  console.log(`Name: ${demoSpec.name}`);
  console.log(`URL: ${demoSpec.url}`);
  console.log(`Steps: ${demoSpec.steps.length}`);
  demoSpec.steps.forEach((step, i) => {
    console.log(`  ${i + 1}. ${step}`);
  });
  console.log('─────────────────────────────────────────────────────────\n');

  console.log('⏱️  Starting test generation...\n');

  try {
    const result = await supervisor.generateTest(demoSpec);

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                     📊 FINAL RESULT                        ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    if (result.success) {
      console.log('✅ Status: SUCCESS');
      console.log(`📁 Test File: ${result.testFile}`);
      console.log(`✓ Test Execution: ${result.testPassed ? 'PASSED' : 'FAILED'}`);
      console.log(`⏱️  Duration: ${(result.duration / 1000).toFixed(2)}s`);
      
      if (result.errors.length > 0) {
        console.log(`\n⚠️  Warnings: ${result.errors.length}`);
        result.errors.forEach((err, i) => {
          console.log(`  ${i + 1}. ${err.substring(0, 100)}...`);
        });
      }
      
      console.log(`\n💬 ${result.message}`);
    } else {
      console.log('❌ Status: FAILED');
      console.log(`⏱️  Duration: ${(result.duration / 1000).toFixed(2)}s`);
      console.log(`\n❌ Errors: ${result.errors.length}`);
      result.errors.forEach((err, i) => {
        console.log(`  ${i + 1}. ${err}`);
      });
      console.log(`\n💬 ${result.message}`);
    }

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                   🎯 NEXT STEPS                            ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    
    if (result.success && result.testPassed) {
      console.log('1. ✅ Review generated test: ' + result.testFile);
      console.log('2. ✅ Check DOM snapshots in: test-results/');
      console.log('3. ✅ Run the test: npx playwright test ' + result.testFile);
      console.log('4. 🚀 Generate more tests: npm run generate:export');
      console.log('5. 🔧 Setup GitHub MCP for auto-commit');
    } else {
      console.log('1. 🔍 Check error messages above');
      console.log('2. 🔧 Verify test specification');
      console.log('3. 🌐 Ensure URL is accessible');
      console.log('4. 🔄 Try again with simpler steps');
    }

    console.log('\n');
    
  } catch (error: any) {
    console.error('\n❌ CRITICAL ERROR:');
    console.error(error.message);
    console.error('\nStack trace:');
    console.error(error.stack);
    process.exit(1);
  }
}

// Run demo
demo().catch(console.error);
