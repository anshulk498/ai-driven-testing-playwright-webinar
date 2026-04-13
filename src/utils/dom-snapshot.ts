/**
 * DOM Snapshot Utility
 * Reusable helper for capturing DOM state in tests
 */

import * as fs from 'fs';
import * as path from 'path';
import { Page } from '@playwright/test';

export interface DOMSnapshot {
  url: string;
  title: string;
  timestamp: string;
  inputs: Array<{
    type: string;
    placeholder: string;
    name: string;
    id: string;
    value: string;
    className: string;
    ariaLabel: string | null;
  }>;
  buttons: Array<{
    text: string;
    className: string;
    id: string;
    type: string;
    disabled: boolean;
    ariaLabel: string | null;
  }>;
  selects: Array<{
    className: string;
    id: string;
    value: string | null;
    ariaLabel: string | null;
  }>;
  labels: Array<{
    text: string;
    for: string | null;
    className: string;
  }>;
  links: Array<{
    text: string;
    href: string;
    className: string;
  }>;
  tables: Array<{
    className: string;
    id: string;
    rowCount: number;
    columnCount: number;
  }>;
}

/**
 * Capture comprehensive DOM snapshot
 */
export async function captureDOMSnapshot(
  page: Page,
  stepName: string,
  outputDir: string = 'test-results'
): Promise<DOMSnapshot> {
  const domSnapshot = await page.evaluate(() => {
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
          value: (el as HTMLInputElement).value,
          className: el.className,
          ariaLabel: el.getAttribute('aria-label')
        })),
      buttons: Array.from(document.querySelectorAll('button'))
        .filter(el => isVisible(el as HTMLElement))
        .map(el => ({
          text: el.textContent?.trim() || '',
          className: el.className,
          id: el.id,
          type: (el as HTMLButtonElement).type,
          disabled: (el as HTMLButtonElement).disabled,
          ariaLabel: el.getAttribute('aria-label')
        })),
      selects: Array.from(document.querySelectorAll('select, .el-select'))
        .filter(el => isVisible(el as HTMLElement))
        .map(el => ({
          className: el.className,
          id: el.id,
          value: (el as HTMLSelectElement).value || null,
          ariaLabel: el.getAttribute('aria-label')
        })),
      labels: Array.from(document.querySelectorAll('label'))
        .filter(el => isVisible(el as HTMLElement))
        .map(el => ({
          text: el.textContent?.trim() || '',
          for: el.getAttribute('for'),
          className: el.className
        })),
      links: Array.from(document.querySelectorAll('a'))
        .filter(el => isVisible(el as HTMLElement))
        .map(el => ({
          text: el.textContent?.trim() || '',
          href: (el as HTMLAnchorElement).href,
          className: el.className
        })),
      tables: Array.from(document.querySelectorAll('table'))
        .filter(el => isVisible(el as HTMLElement))
        .map(el => ({
          className: el.className,
          id: el.id,
          rowCount: el.querySelectorAll('tr').length,
          columnCount: el.querySelector('tr')?.querySelectorAll('td, th').length || 0
        }))
    };
  });

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Save snapshot
  const snapshotPath = path.join(outputDir, `dom-${stepName}.json`);
  fs.writeFileSync(snapshotPath, JSON.stringify(domSnapshot, null, 2));
  console.log(`📸 DOM snapshot saved: dom-${stepName}.json`);

  return domSnapshot as DOMSnapshot;
}

/**
 * Find element in DOM snapshot by text
 */
export function findElementInSnapshot(
  snapshot: DOMSnapshot,
  text: string,
  elementType: 'button' | 'input' | 'link' = 'button'
): any | null {
  const lowerText = text.toLowerCase();

  switch (elementType) {
    case 'button':
      return snapshot.buttons.find(b => 
        b.text.toLowerCase().includes(lowerText)
      );
    case 'input':
      return snapshot.inputs.find(i => 
        i.placeholder.toLowerCase().includes(lowerText) ||
        i.name.toLowerCase().includes(lowerText)
      );
    case 'link':
      return snapshot.links.find(l => 
        l.text.toLowerCase().includes(lowerText)
      );
  }

  return null;
}

/**
 * Compare two snapshots to detect changes
 */
export function compareSnapshots(
  before: DOMSnapshot,
  after: DOMSnapshot
): {
  buttonsAdded: number;
  buttonsRemoved: number;
  inputsChanged: number;
  urlChanged: boolean;
} {
  return {
    buttonsAdded: after.buttons.length - before.buttons.length,
    buttonsRemoved: before.buttons.length - after.buttons.length,
    inputsChanged: after.inputs.filter((input, i) => 
      input.value !== before.inputs[i]?.value
    ).length,
    urlChanged: before.url !== after.url
  };
}
