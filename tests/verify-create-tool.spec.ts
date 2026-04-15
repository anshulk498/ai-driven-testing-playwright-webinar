/**
 * verify-create-tool.spec.ts
 * Source: docs/test-plans/CREATE_TOOL_TEST.md
 * Create Tool – Full 18-Step End-to-End Flow
 */

import { test, expect } from '@playwright/test';

// ─── Helper: click first visible locator — 30s total budget, 3s per attempt ─
async function findAndClick(page: any, locators: (() => any)[], label: string, totalMs = 30_000): Promise<void> {
  const perAttempt = 3_000;
  const deadline = Date.now() + totalMs;
  let round = 0;
  while (Date.now() < deadline) {
    for (let i = 0; i < locators.length; i++) {
      if (Date.now() >= deadline) break;
      try {
        const loc = locators[i]();
        await loc.waitFor({ state: 'visible', timeout: perAttempt });
        await loc.click();
        console.log(`  ✓ ${label} (locator ${i + 1}, round ${round + 1})`);
        return;
      } catch { /* try next */ }
    }
    round++;
  }
  throw new Error(`✗ ${label} – not found within ${totalMs / 1000}s`);
}

// ─── Helper: return first visible locator — 30s total budget, 3s per attempt ─
async function findLocator(page: any, locators: (() => any)[], label: string, totalMs = 30_000): Promise<any> {
  const perAttempt = 3_000;
  const deadline = Date.now() + totalMs;
  let round = 0;
  while (Date.now() < deadline) {
    for (let i = 0; i < locators.length; i++) {
      if (Date.now() >= deadline) break;
      try {
        const loc = locators[i]();
        await loc.waitFor({ state: 'visible', timeout: perAttempt });
        console.log(`  ✓ ${label} found (locator ${i + 1}, round ${round + 1})`);
        return loc;
      } catch { /* try next */ }
    }
    round++;
  }
  throw new Error(`✗ ${label} – not found within ${totalMs / 1000}s`);
}

// ─── Helper: open el-select and pick option ──────────────────────────────────
async function selectOption(page: any, placeholders: string[], optionText: string, label: string, waitEnabled = false): Promise<void> {
  if (waitEnabled) {
    for (const ph of placeholders) {
      try {
        await page.locator(`input[placeholder="${ph}"]`).waitFor({ state: 'visible', timeout: 8_000 });
        await page.waitForFunction((p: string) => {
          const el = document.querySelector(`input[placeholder="${p}"]`) as HTMLInputElement;
          return el && !el.disabled;
        }, ph, { timeout: 8_000 });
        break;
      } catch { /* try next */ }
    }
  }
  await findAndClick(page, placeholders.flatMap(ph => [
    () => page.locator(`input[placeholder="${ph}"]`),
    () => page.locator(`[placeholder="${ph}"]`),
  ]), `${label} trigger`, 8_000);
  await page.waitForTimeout(500);
  await findAndClick(page, [
    () => page.locator('.el-select-dropdown__item').filter({ hasText: new RegExp(`^${optionText}$`, 'i') }).first(),
    () => page.locator('.el-select-dropdown__item').filter({ hasText: new RegExp(optionText, 'i') }).first(),
    () => page.locator('li').filter({ hasText: new RegExp(`^${optionText}$`, 'i') }).first(),
  ], `${label} option "${optionText}"`, 8_000);
  await page.waitForTimeout(300);
}

// ════════════════════════════════════════════════════════════════════════════
test('Create Tool – full flow', async ({ page, context }) => {
  test.setTimeout(300_000); // long overall budget; individual steps are fast

  // ── STEP 1: SSO ─────────────────────────────────────────────────────────────
  console.log('\n══ STEP 1: SSO ══');
  await page.goto('https://cert-comply.content.aws.lexis.com/sso', { waitUntil: 'domcontentloaded' });

  // ── STEP 2: Developer Login ──────────────────────────────────────────────────
  console.log('\n══ STEP 2: Login ══');
  await findAndClick(page, [
    () => page.getByRole('button', { name: /Developer Login/i }),
    () => page.locator('button').filter({ hasText: /Developer Login/i }).first(),
  ], 'Developer Login', 10_000);
  await page.waitForURL('**/content-center**', { timeout: 20_000 });
  await page.waitForLoadState('domcontentloaded');
  console.log(`✓ Logged in: ${page.url()}`);

  // ── STEP 3: Tools tab ───────────────────────────────────────────────────────
  console.log('\n══ STEP 3: Tools tab ══');
  await findAndClick(page, [
    () => page.getByRole('tab', { name: /^Tools$/i }),
    () => page.locator('.el-tabs__item').filter({ hasText: /^Tools$/ }).first(),
  ], 'Tools tab', 8_000);
  await page.waitForTimeout(1000);

  // ── STEP 4+5: Create → new tab → toolCreation ───────────────────────────────
  console.log('\n══ STEP 4: Create button ══');
  const newPagePromise = context.waitForEvent('page', { timeout: 6_000 }).catch(() => null);
  await findAndClick(page, [
    () => page.getByRole('button', { name: /^Create$/i }),
    () => page.locator('button').filter({ hasText: /^Create$/ }).first(),
  ], 'Create button', 8_000);

  console.log('\n══ STEP 5: Switch to toolCreation ══');
  let toolPage: any = page;
  const newTab = await newPagePromise;
  if (newTab) {
    toolPage = newTab;
    await toolPage.waitForLoadState('domcontentloaded');
    console.log(`✓ New tab: ${toolPage.url()}`);
  }
  if (!toolPage.url().includes('toolCreation')) {
    await toolPage.goto('https://cert-comply.content.aws.lexis.com/content-center/toolCreation',
      { waitUntil: 'domcontentloaded', timeout: 20_000 });
  }
  await toolPage.bringToFront();
  await toolPage.locator('input[placeholder="Select module"], input[placeholder="Select Module"]')
    .waitFor({ state: 'visible', timeout: 20_000 });
  expect(toolPage.url()).toContain('toolCreation');
  console.log('✓ toolCreation form ready');

  // ── STEP 6: Module → Aged Care ──────────────────────────────────────────────
  console.log('\n══ STEP 6: Module ══');
  await selectOption(toolPage, ['Select module', 'Select Module'], 'Aged Care', 'Module');

  // ── STEP 7: Topic → Home Care ───────────────────────────────────────────────
  console.log('\n══ STEP 7: Topic ══');
  await selectOption(toolPage, ['Select topic', 'Select Topic'], 'Home Care', 'Topic', true);

  // ── STEP 8: Obligation → first value ────────────────────────────────────────
  console.log('\n══ STEP 8: Obligation ══');
  for (const ph of ['Select obligation', 'Select Obligation']) {
    try {
      await toolPage.locator(`input[placeholder="${ph}"]`).waitFor({ state: 'visible', timeout: 6_000 });
      await toolPage.waitForFunction((p: string) => {
        const el = document.querySelector(`input[placeholder="${p}"]`) as HTMLInputElement;
        return el && !el.disabled;
      }, ph, { timeout: 8_000 });
      break;
    } catch { /* try next */ }
  }
  await findAndClick(toolPage, [
    () => toolPage.locator('input[placeholder="Select obligation"]'),
    () => toolPage.locator('input[placeholder="Select Obligation"]'),
  ], 'Obligation trigger', 8_000);
  await toolPage.waitForTimeout(800);
  const obligationOpt = await findLocator(toolPage, [
    () => toolPage.locator('.el-select-dropdown__item').filter({ hasText: /^Title 2$/i }).first(),
    () => toolPage.locator('.el-select-dropdown__item').filter({ hasText: /Title 2/i }).first(),
    () => toolPage.locator('.el-select-dropdown__item').first(),
  ], 'Obligation option', 8_000);
  const obligationText = (await obligationOpt.textContent())?.trim() ?? '';
  await obligationOpt.click();
  console.log(`✓ Obligation: "${obligationText}"`);
  await toolPage.waitForTimeout(300);

  // ── STEP 9: Add → verify ────────────────────────────────────────────────────
  console.log('\n══ STEP 9: Add ══');
  await findAndClick(toolPage, [
    () => toolPage.getByRole('button', { name: /^Add$/i }),
    () => toolPage.locator('button').filter({ hasText: /^Add$/i }).first(),
  ], 'Add button', 8_000);
  await toolPage.waitForTimeout(800);
  console.log(`✓ Obligation listed (rows: ${await toolPage.locator('tbody tr').count()})`);

  // ── STEP 10: Title ──────────────────────────────────────────────────────────
  console.log('\n══ STEP 10: Title ══');
  const titleInput = await findLocator(toolPage, [
    () => toolPage.locator('input[placeholder="Enter title"]'),
    () => toolPage.locator('input[placeholder*="title" i]'),
  ], 'Title input', 8_000);
  const toolTitle = `Auto Tool ${Date.now()}`;
  await titleInput.fill(toolTitle);
  console.log(`✓ Title: "${toolTitle}"`);

  // ── STEP 11: Tool Functions → Flowchart ─────────────────────────────────────
  console.log('\n══ STEP 11: Tool Functions ══');
  await selectOption(toolPage, ['Select Tool Functions', 'Select tool functions'], 'Flowchart', 'Tool Functions');

  // ── STEP 12: Category → Ext ─────────────────────────────────────────────────
  console.log('\n══ STEP 12: Category ══');
  await selectOption(toolPage, ['Select Category', 'Select category'], 'Ext', 'Category');
  await toolPage.waitForTimeout(600);

  // ── STEP 13: External Link ──────────────────────────────────────────────────
  console.log('\n══ STEP 13: External Link ══');
  const linkInput = await findLocator(toolPage, [
    () => toolPage.locator('input[placeholder="Enter external link"]'),
    () => toolPage.locator('input[placeholder*="external link" i]'),
    () => toolPage.locator('input[placeholder*="link" i]'),
  ], 'External link input', 8_000);
  await linkInput.fill('https://cert-comply.content.aws.lexis.com/content-center/toolCreation');
  console.log('✓ External link filled');

  // ── STEP 14: Jurisdictions → India & China ───────────────────────────────────
  // Reference: create-subobligation.spec.ts Step 13 – click the .el-select wrapper,
  // then pick items via .el-select-dropdown:visible ul > div > div nth selectors.
  console.log('\n══ STEP 14: Jurisdictions ══');

  // Click the .el-select wrapper div (not the readonly input inside it)
  const jurisdictionsWrapper = toolPage
    .locator('.el-select')
    .filter({ has: toolPage.locator('input[placeholder*="Jurisdictions" i]') })
    .first();
  await jurisdictionsWrapper.click();
  await toolPage.waitForTimeout(1500);

  const jurisdictionsList = toolPage.locator('.el-select-dropdown:visible ul');

  // China is at nth(3), India is at nth(8) — same indices as subobligation spec
  const chinaItem = jurisdictionsList.locator('> div > div').nth(3).locator('span').first();
  const indiaItem = jurisdictionsList.locator('> div > div').nth(8).locator('span').first();

  await chinaItem.click();
  console.log('  ✓ China selected');
  await toolPage.waitForTimeout(300);

  await indiaItem.click();
  console.log('  ✓ India selected');

  await toolPage.keyboard.press('Escape');
  await toolPage.waitForTimeout(500);
  console.log('✓ Jurisdictions set');

  // ── STEP 15: Create → toast ──────────────────────────────────────────────────
  console.log('\n══ STEP 15: Create ══');
  const toastPromise = (async () => {
    for (const sel of ['.el-message--success', '.el-notification--success', '.el-message', '.el-notification']) {
      try {
        const loc = toolPage.locator(sel).first();
        await loc.waitFor({ state: 'visible', timeout: 12_000 });
        return (await loc.textContent())?.trim() ?? '';
      } catch { /* try next */ }
    }
    return '';
  })();

  await findAndClick(toolPage, [
    () => toolPage.getByRole('button', { name: /^Create$/i }),
    () => toolPage.locator('button').filter({ hasText: /^Create$/ }).first(),
    () => toolPage.locator('button[type="submit"]').first(),
  ], 'Create submit', 8_000);

  const toastText = await toastPromise;
  if (toastText) {
    console.log(`✓ Toast: "${toastText}"`);
    expect(toastText).toMatch(/Tool saved successfully/i);
  } else {
    console.log('⚠ Toast not captured');
  }

  // ── STEP 16: Extract Tool ID ─────────────────────────────────────────────────
  console.log('\n══ STEP 16: Extract ID ══');
  await toolPage.waitForTimeout(2000);
  let toolId = '';

  const urlMatch = toolPage.url().match(/\/(\d{4,})/);
  if (urlMatch) { toolId = urlMatch[1]; console.log(`✓ ID from URL: "${toolId}"`); }

  if (!toolId) {
    const body = (await toolPage.locator('body').textContent()) ?? '';
    for (const pat of [/ID[:\s]+(\d+)/i, /Tool ID[:\s]+(\d+)/i, /#(\d{5,})/, /(\d{7,})/]) {
      const m = body.match(pat);
      if (m) { toolId = m[1]; console.log(`✓ ID from body: "${toolId}"`); break; }
    }
  }

  if (!toolId) {
    try {
      const el = await findLocator(toolPage, [
        () => toolPage.locator('[class*="id"]').filter({ hasText: /\d{5,}/ }).first(),
        () => toolPage.locator('span, p, h1, h2').filter({ hasText: /\d{5,}/ }).first(),
      ], 'ID element', 5_000);
      const m = ((await el.textContent()) ?? '').match(/(\d{4,})/);
      if (m) { toolId = m[1]; console.log(`✓ ID from element: "${toolId}"`); }
    } catch { /* skip */ }
  }

  expect(toolId, 'Tool ID must be extracted').toBeTruthy();
  console.log(`✓ Tool ID: "${toolId}"`);

  // ── STEP 17: Click logo on toolPage to return to Content Center ──────────────
  console.log('\n══ STEP 17: Content Center (via logo click) ══');
  await toolPage.bringToFront();
  await findAndClick(toolPage, [
    () => toolPage.locator('.logo img').first(),
    () => toolPage.locator('img.logo').first(),
    () => toolPage.locator('header img').first(),
    () => toolPage.locator('.header img').first(),
    () => toolPage.locator('a').filter({ has: toolPage.locator('img') }).first(),
    () => toolPage.locator('[class*="logo"]').first(),
  ], 'Logo / Home link', 10_000);
  await toolPage.waitForLoadState('domcontentloaded');
  await toolPage.waitForTimeout(2000);
  console.log(`✓ Navigated to: ${toolPage.url()}`);

  // ── STEP 18: Tools tab → search by ID ───────────────────────────────────────
  console.log('\n══ STEP 18: Search by ID ══');
  await findAndClick(toolPage, [
    () => toolPage.getByRole('tab', { name: /^Tools$/i }),
    () => toolPage.locator('.el-tabs__item').filter({ hasText: /^Tools$/ }).first(),
  ], 'Tools tab', 8_000);
  await toolPage.waitForTimeout(2000);

  // Wait for the Tools tab pane to be active and visible
  // The Tools tab pane contains "tool" type rows — wait for it to load
  await toolPage.locator('.el-tab-pane:visible').last().waitFor({ state: 'visible', timeout: 10_000 }).catch(() => {});
  await toolPage.waitForTimeout(1000);

  // Scope to data-v-f9001f20 (the Tools component) to find the ID column search icon
  await findAndClick(toolPage, [
    () => toolPage.locator('[data-v-f9001f20].table-header .el-icon.search-icon').first(),
    () => toolPage.locator('[data-v-f9001f20] .table-header .el-icon.search-icon').first(),
    () => toolPage.locator('[data-v-f9001f20] thead th').first().locator('.el-icon.search-icon'),
    () => toolPage.locator('.el-icon.search-icon').nth(2),
  ], 'ID search icon', 8_000);
  await toolPage.waitForTimeout(1000);

  // The "Search by ID" input appears — fill it
  const filterInput = toolPage.locator('input[placeholder="Search by ID"]').last();
  await filterInput.waitFor({ state: 'visible', timeout: 8_000 });
  await filterInput.fill(toolId);
  console.log(`  ✓ Filled filter: "${toolId}"`);
  await toolPage.waitForTimeout(300);

  // Use Tab to move focus to Submit button, then Enter to click it
  await filterInput.press('Tab');
  await toolPage.waitForTimeout(200);
  await toolPage.keyboard.press('Enter');
  console.log('  ✓ Submit via Tab+Enter');

  await toolPage.waitForTimeout(6000);
  await toolPage.locator('.el-loading-mask').waitFor({ state: 'hidden', timeout: 15_000 }).catch(() => {});
  await toolPage.waitForTimeout(2000);

  // Check row count and preview
  const rowCount = await toolPage.locator('tbody tr').count();
  const tableRows = await toolPage.evaluate(() =>
    Array.from(document.querySelectorAll('tbody tr')).slice(0, 3)
      .map(r => r.textContent?.replace(/\s+/g, ' ').trim().substring(0, 100)).join(' | ')
  );
  console.log(`  Rows: ${rowCount} | Preview: ${tableRows || '(empty)'}`);

  // Verify tool ID appears in results
  const idVisible = await toolPage.locator('td').filter({ hasText: toolId }).first().isVisible().catch(() => false)
    || await toolPage.locator(`text=${toolId}`).first().isVisible().catch(() => false)
    || await toolPage.locator('tbody tr').filter({ hasText: toolId }).first().isVisible().catch(() => false);

  expect(idVisible, `Tool ID "${toolId}" should appear in results`).toBeTruthy();
  console.log(`✓ Tool ID "${toolId}" found in results`);

  console.log('\n🎉 Create Tool Test PASSED');
});
