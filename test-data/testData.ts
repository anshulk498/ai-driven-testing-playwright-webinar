// ─── Application URLs ─────────────────────────────────────────────────────────
export const URLS = {
  SSO:            'https://cert-comply.content.aws.lexis.com/sso',
  CONTENT_CENTER: 'https://cert-comply.content.aws.lexis.com/content-center',
  TOOL_CREATION:  'https://cert-comply.content.aws.lexis.com/content-center/toolCreation',
  SUBOBLIGATION:  'https://cert-comply.content.aws.lexis.com/content-center/subobligationCreation',
  ALERT_CREATION: 'https://cert-comply.content.aws.lexis.com/content-center/alertCreation',
} as const;

// ─── Report Menu Items ────────────────────────────────────────────────────────
export const REPORT_ITEMS = {
  INDUSTRY_REPORT:   'Industry Report',
  BROKEN_LINKS:      'Broken Links',
  HISTORICAL_NOTES:  'Historical Notes',
} as const;

// ─── Admin Menu Items ─────────────────────────────────────────────────────────
export const ADMIN_ITEMS = {
  RECORD_UNLOCK: 'Record Unlock',
} as const;

// ─── Tool Creation Data ───────────────────────────────────────────────────────
export const TOOL_DATA = {
  MODULE:          'Aged Care',
  TOPIC:           'Home Care',
  OBLIGATION:      'title 2',       // exact text of obligation to select
  TOOL_FUNCTIONS:  'Flowchart',
  CATEGORY:        'Ext',
  EXTERNAL_LINK:   'https://cert-comply.content.aws.lexis.com/content-center/toolCreation',
  // Jurisdiction dropdown indices: 3 = China, 8 = India
  JURISDICTION_INDICES: [3, 8],
  title: () => `Auto Tool ${Date.now()}`,
} as const;

// ─── Alert Creation Data ──────────────────────────────────────────────────────
export const ALERT_DATA = {
  MODULE: 'Aged Care',
  TOPIC:  'Home Care',
  TYPE:   'News',
  JURISDICTION_INDICES: [3, 8],
  title: () => `Test Alert - ${Date.now()}`,
} as const;

// ─── Subobligation Data ───────────────────────────────────────────────────────
export const SUBOBLIGATION_DATA = {
  MODULE:        'Aged Care',
  TOPIC:         'Home Care',
  MATERIAL_TYPE: 'Material',
  FREQUENCY:     '1',
  title: () => `Test Subobligation - ${Date.now()}`,
} as const;

// ─── Report Filter Data ───────────────────────────────────────────────────────
export const REPORT_DATA = {
  TYPE:         'Content Type',
  CONTENT_TYPE: 'Obligations',
  MODULE:       'Aged Care',
  MATERIAL:     'Material',
  CALENDAR_DAY: 22,
} as const;

// ─── Toast Messages ───────────────────────────────────────────────────────────
export const TOAST = {
  TOOL_SAVED:             'Tool saved successfully.',
  TOOL_IN_REVIEW:         'Tool marked as In Review.',
  TOOL_READY_TO_PUBLISH:  'Tool marked as Ready to Publish.',
  TOOL_PUBLISHED:         'Tool published successfully.',
  RECORD_UNLOCKED:        'Record unlocked successfully',
} as const;
