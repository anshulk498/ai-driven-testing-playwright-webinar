# 📂 Project Structure Guide

## Overview

This document describes the clean, production-ready structure of the AI-Driven Playwright Test Automation project.
Built using **Page Object Model (POM)** with **TypeScript** and **Playwright 1.57.0**.

---

## 🗂️ Directory Layout

```
ai-driven-testing-playwright-webinar/
│
├── 📁 pages/                        # Page Object Model classes
│   ├── BasePage.ts                  # Base: findAndClick, waitForLoader, selectDropdown, toasts
│   ├── LoginPage.ts                 # SSO page + Developer Login
│   ├── DashboardPage.ts             # Tabs (Obligations/Alerts/Tools), Create, Export, Search by ID
│   ├── ReportPage.ts                # Report menu hover/click, filters, GO, Export
│   ├── ToolPage.ts                  # Tool creation form + workflow buttons (Edit, Save Draft, Review, Publish)
│   └── AdminPage.ts                 # Admin menu + Record Unlock flow
│
├── 🧪 tests/                        # All Playwright spec files (flat, POM-based)
│   ├── alert-export.spec.ts         # Login → Alerts tab → Export → verify download
│   ├── broken-links-report.spec.ts  # Login → Broken Links → GO → Export
│   ├── create-tool.spec.ts          # Full 24-step tool creation + publish workflow
│   ├── historical-report.spec.ts    # Login → Historical Notes → GO → Export
│   ├── industry-report.spec.ts      # Login → Industry Report → GO → Export
│   ├── obligation-export.spec.ts    # Login → Obligations tab → Export → verify download
│   └── record-unlock.spec.ts        # Login → Admin → Record Unlock → confirm
│
├── 🛠️ utils/                        # Shared test utilities
│   └── helpers.ts                   # assertToast, assertDownload, assertUrl, waitForLoader, assertTableHasData
│
├── 📦 test-data/                    # Test constants & input data
│   └── testData.ts                  # URLS, TOOL_DATA, ALERT_DATA, REPORT_DATA, TOAST messages, ADMIN_ITEMS
│
├── 📚 docs/                         # Documentation
│   ├── PROJECT_STRUCTURE.md         # This file
│   ├── test-plans/                  # MD test plans (one per feature)
│   │   ├── CREATE_TOOL_TEST.md
│   │   ├── BROKEN_LINKS_TEST.md
│   │   ├── INDUSTRY_REPORT_TEST.md
│   │   ├── RECORD_UNLOCK_TEST.md
│   │   ├── SSO_Historical_Report_Test.md
│   │   ├── ALERT_TEST_STEPS.md
│   │   ├── CREATE_SUBOBLIGATION.md
│   │   ├── EXPORT_TEST_SUMMARY.md
│   │   └── TEST_PLAN.md
│   ├── guides/                      # Setup and integration guides
│   │   ├── GETTING_STARTED.md
│   │   ├── CONTENT_CENTER_GUIDE.md
│   │   └── MCP_INTEGRATION_PLAN.md
│   └── artifacts/                   # Agent planning artifacts
│
├── 🤖 src/                          # AI Agent & workflow source (non-test)
│   ├── agents/
│   │   ├── supervisor.ts            # Orchestrator agent
│   │   ├── browser-agent.ts         # UI exploration via Playwright MCP
│   │   ├── patch-agent.ts           # Test code generation agent
│   │   └── runner-agent.ts          # Test execution agent
│   ├── workflows/
│   │   └── generate-test.ts         # Test generation workflow
│   ├── utils/
│   │   ├── dom-snapshot.ts          # DOM capture for test healing
│   │   └── test-helpers.ts          # Legacy helper functions
│   └── config/
│       ├── config.ts                # App configuration
│       └── mcp-config.json          # MCP server config
│
├── 📜 scripts/                      # Utility scripts
│   ├── demo.ts
│   └── restructure.ps1
│
├── 🖼️ assets/                       # Static assets
│
├── global-setup.ts                  # Global auth setup (saves storageState → auth.json)
├── playwright.config.ts             # Playwright config (timeout, browser, baseURL)
├── tsconfig.json                    # TypeScript configuration
└── package.json                     # Dependencies
```

---

## 🏗️ Architecture: Page Object Model

```
Test Spec (tests/*.spec.ts)
    │
    ├── uses → LoginPage       (login flow)
    ├── uses → DashboardPage   (tab navigation, export, search)
    ├── uses → ReportPage      (report filters, GO, export)
    ├── uses → ToolPage        (form fill, workflow buttons)
    └── uses → AdminPage       (admin menu, record unlock)
              │
              └── all extend → BasePage  (common helpers)

Test Data  →  test-data/testData.ts   (constants consumed by specs + pages)
Helpers    →  utils/helpers.ts        (assertion utilities used in specs)
```

---

## 🔑 Key Design Principles

| Principle | Implementation |
|-----------|---------------|
| **No hard waits** | `expect(locator).toBeVisible()` / `locator.waitFor()` only |
| **No locators in tests** | All locators live in page classes only |
| **No assertions in pages** | Pages contain only actions + locators |
| **Multi-fallback locators** | `findAndClick([...4 selectors...])` for resilience |
| **DRY login** | `LoginPage.loginAsDeveloper()` reused across all specs |
| **Typed constants** | `testData.ts` with `as const` for all strings/values |

---

## ▶️ Running Tests

```bash
# Run all tests
npx playwright test

# Run a specific spec
npx playwright test tests/create-tool.spec.ts

# Run with visible browser
npx playwright test --headed

# Run with HTML report
npx playwright test --reporter=html
```

---

## 📋 Test Coverage

| Spec | Feature | Steps |
|------|---------|-------|
| `create-tool.spec.ts` | Full tool creation + publish workflow | 24 |
| `broken-links-report.spec.ts` | Broken Links report + export | 11 |
| `industry-report.spec.ts` | Industry Report + export | 11 |
| `historical-report.spec.ts` | Historical Notes report + export | 9 |
| `alert-export.spec.ts` | Alerts tab export | 5 |
| `obligation-export.spec.ts` | Obligations tab export | 5 |
| `record-unlock.spec.ts` | Admin → Record Unlock | 9 |

---

## 📝 File Naming Conventions

| File Type | Pattern | Example |
|-----------|---------|---------|
| Page class | `{Name}Page.ts` | `ToolPage.ts` |
| Spec file | `{feature}.spec.ts` | `create-tool.spec.ts` |
| Test data | `testData.ts` | constants only |
| Helpers | `helpers.ts` | assertion utilities |
| Test plan | `{FEATURE}_TEST.md` | `CREATE_TOOL_TEST.md` |

---

*Last updated: April 16, 2026*
*Framework: Playwright 1.57.0 | TypeScript | Chromium*