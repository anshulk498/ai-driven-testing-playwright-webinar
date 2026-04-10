/**
 * Example Workflow - Automated Test Generation
 * Demonstrates the supervisor agent in action
 */

import { SupervisorAgent, TestSpecification } from '../agents/supervisor';
import * as path from 'path';

const workspaceRoot = path.resolve(__dirname, '..');

/**
 * Example 1: Generate a simple login test
 */
async function generateLoginTest() {
  const supervisor = new SupervisorAgent(workspaceRoot);

  const testSpec: TestSpecification = {
    name: 'Login Flow',
    url: 'https://cert-comply.content.aws.lexis.com/sso',
    steps: [
      'Click Developer Login',
      'Verify redirect to content center'
    ],
    description: 'Automated test for login functionality'
  };

  const result = await supervisor.generateTest(testSpec);
  
  console.log('\n📋 RESULT:');
  console.log(JSON.stringify(result, null, 2));
  
  return result;
}

/**
 * Example 2: Generate obligations export test
 */
async function generateExportTest() {
  const supervisor = new SupervisorAgent(workspaceRoot);

  const testSpec: TestSpecification = {
    name: 'Export Obligations Automated',
    url: 'https://cert-comply.content.aws.lexis.com/content-center',
    steps: [
      'Click Export button',
      'Verify file download'
    ],
    description: 'Automated test for export functionality'
  };

  const result = await supervisor.generateTest(testSpec);
  
  console.log('\n📋 RESULT:');
  console.log(JSON.stringify(result, null, 2));
  
  return result;
}

/**
 * Example 3: Generate multiple tests in batch
 */
async function generateBatchTests() {
  const supervisor = new SupervisorAgent(workspaceRoot);

  const specs: TestSpecification[] = [
    {
      name: 'Create Obligation',
      url: 'https://cert-comply.content.aws.lexis.com/content-center',
      steps: [
        'Click Create button',
        'Fill obligation details',
        'Click Save'
      ]
    },
    {
      name: 'Search Obligations',
      url: 'https://cert-comply.content.aws.lexis.com/content-center',
      steps: [
        'Enter search term',
        'Click search',
        'Verify results'
      ]
    }
  ];

  const results = await supervisor.generateMultipleTests(specs);
  
  console.log('\n📋 BATCH RESULTS:');
  results.forEach((result, index) => {
    console.log(`\nTest ${index + 1}:`);
    console.log(`  Success: ${result.success}`);
    console.log(`  File: ${result.testFile}`);
    console.log(`  Passed: ${result.testPassed}`);
  });
  
  return results;
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || 'login';

  console.log('🤖 Automated Test Generation System');
  console.log('═══════════════════════════════════\n');

  try {
    switch (mode) {
      case 'login':
        await generateLoginTest();
        break;
      case 'export':
        await generateExportTest();
        break;
      case 'batch':
        await generateBatchTests();
        break;
      default:
        console.log('Usage: npm run generate-test [login|export|batch]');
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { generateLoginTest, generateExportTest, generateBatchTests };
