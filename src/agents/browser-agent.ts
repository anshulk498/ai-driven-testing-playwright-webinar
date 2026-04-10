/**
 * Browser Agent - Playwright MCP Wrapper
 * Handles UI exploration, DOM capture, and locator generation
 */

import { Page } from '@playwright/test';

export interface UIFlow {
  url: string;
  steps: Array<{
    action: string;
    element: string;
    locator: string;
    snapshot?: any;
  }>;
  screenshots: string[];
  domSnapshots: string[];
}

export class BrowserAgent {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to URL and capture initial state
   */
  async navigate(url: string): Promise<void> {
    console.log(`[Browser Agent] Navigating to: ${url}`);
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Capture DOM snapshot of current page
   */
  async captureSnapshot(stepName: string): Promise<any> {
    console.log(`[Browser Agent] Capturing DOM snapshot: ${stepName}`);
    
    const domSnapshot = await this.page.evaluate(() => {
      const isVisible = (el: HTMLElement) => {
        return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
      };

      return {
        url: window.location.href,
        title: document.title,
        timestamp: new Date().toISOString(),
        inputs: Array.from(document.querySelectorAll('input, textarea'))
          .filter(el => isVisible(el as HTMLElement))
          .map(el => ({
            type: (el as HTMLInputElement).type,
            placeholder: (el as HTMLInputElement).placeholder,
            name: (el as HTMLInputElement).name,
            id: el.id,
            className: el.className,
            ariaLabel: el.getAttribute('aria-label')
          })),
        buttons: Array.from(document.querySelectorAll('button'))
          .filter(el => isVisible(el as HTMLElement))
          .map(el => ({
            text: el.textContent?.trim(),
            className: el.className,
            id: el.id,
            disabled: (el as HTMLButtonElement).disabled,
            ariaLabel: el.getAttribute('aria-label')
          })),
        links: Array.from(document.querySelectorAll('a'))
          .filter(el => isVisible(el as HTMLElement))
          .map(el => ({
            text: el.textContent?.trim(),
            href: (el as HTMLAnchorElement).href,
            className: el.className
          }))
      };
    });

    return domSnapshot;
  }

  /**
   * Find element by text and generate robust locator
   */
  async findElement(text: string): Promise<{ element: any; locator: string } | null> {
    console.log(`[Browser Agent] Finding element: ${text}`);
    
    // Try multiple strategies
    const strategies = [
      `button:has-text("${text}")`,
      `a:has-text("${text}")`,
      `[aria-label="${text}"]`,
      `input[placeholder*="${text}" i]`,
      `:text("${text}")`
    ];

    for (const locator of strategies) {
      const element = this.page.locator(locator).first();
      const count = await element.count();
      
      if (count > 0) {
        console.log(`[Browser Agent] Found with locator: ${locator}`);
        return { element, locator };
      }
    }

    console.log(`[Browser Agent] Element not found: ${text}`);
    return null;
  }

  /**
   * Generate optimized locator for an element
   */
  async generateLocator(elementInfo: { text?: string; id?: string; className?: string }): Promise<string> {
    // Prioritize: ID > Text > Class > Fallback
    if (elementInfo.id) {
      return `#${elementInfo.id}`;
    }
    if (elementInfo.text) {
      return `:has-text("${elementInfo.text}")`;
    }
    if (elementInfo.className) {
      return `.${elementInfo.className.split(' ')[0]}`;
    }
    return 'element';
  }

  /**
   * Record a complete UI flow
   */
  async recordFlow(steps: string[], baseUrl: string): Promise<UIFlow> {
    console.log(`[Browser Agent] Recording flow with ${steps.length} steps`);
    
    const flow: UIFlow = {
      url: baseUrl,
      steps: [],
      screenshots: [],
      domSnapshots: []
    };

    await this.navigate(baseUrl);

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      console.log(`[Browser Agent] Step ${i + 1}: ${step}`);

      // Capture state before action
      const snapshot = await this.captureSnapshot(`step-${i + 1}-before`);
      flow.domSnapshots.push(`step-${i + 1}-snapshot.json`);

      // Parse and execute step
      const actionParts = this.parseStep(step);
      
      if (actionParts.action === 'click') {
        const found = await this.findElement(actionParts.target);
        if (found) {
          await found.element.click();
          flow.steps.push({
            action: 'click',
            element: actionParts.target,
            locator: found.locator,
            snapshot
          });
        }
      } else if (actionParts.action === 'fill') {
        const found = await this.findElement(actionParts.target);
        if (found) {
          await found.element.fill(actionParts.value || '');
          flow.steps.push({
            action: 'fill',
            element: actionParts.target,
            locator: found.locator,
            snapshot
          });
        }
      }

      await this.page.waitForTimeout(1000);
      
      // Take screenshot
      const screenshotPath = `step-${i + 1}.png`;
      await this.page.screenshot({ path: `test-results/${screenshotPath}` });
      flow.screenshots.push(screenshotPath);
    }

    return flow;
  }

  /**
   * Parse natural language step into action
   */
  private parseStep(step: string): { action: string; target: string; value?: string } {
    const lowerStep = step.toLowerCase();
    
    if (lowerStep.includes('click')) {
      const target = step.replace(/click|on|the/gi, '').trim();
      return { action: 'click', target };
    }
    
    if (lowerStep.includes('fill') || lowerStep.includes('enter')) {
      const parts = step.split(/with|:|=/);
      const target = parts[0].replace(/fill|enter|the/gi, '').trim();
      const value = parts[1]?.trim();
      return { action: 'fill', target, value };
    }
    
    if (lowerStep.includes('verify') || lowerStep.includes('check')) {
      const target = step.replace(/verify|check|that|the/gi, '').trim();
      return { action: 'verify', target };
    }

    return { action: 'unknown', target: step };
  }

  /**
   * Debug test failure by capturing state
   */
  async debugFailure(errors: string[]): Promise<any> {
    console.log(`[Browser Agent] Debugging ${errors.length} failures`);
    
    const debugInfo = {
      url: this.page.url(),
      errors,
      snapshot: await this.captureSnapshot('debug'),
      screenshot: 'debug-failure.png'
    };

    await this.page.screenshot({ path: `test-results/${debugInfo.screenshot}`, fullPage: true });
    
    return debugInfo;
  }
}
