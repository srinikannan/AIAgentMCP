# Playwright Project

A Playwright testing project for end-to-end and component testing.

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in UI mode
```bash
npm run test:ui
```

### Run tests in headed mode (browser visible)
```bash
npm run test:headed
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Generate tests with codegen
```bash
npm run codegen
```

## Project Structure

```
├── tests/                 # Test files
│   └── example.spec.ts   # Example test file
├── playwright.config.ts   # Playwright configuration
├── tsconfig.json         # TypeScript configuration
├── package.json          # Project dependencies
└── README.md            # This file
```

## Configuration

The Playwright configuration is in `playwright.config.ts`. Key settings:

- **Test directory**: `./tests`
- **Browsers**: Chromium, Firefox, WebKit
- **Reporter**: HTML report (view with `npx playwright show-report`)
- **Timeout**: 30 seconds per test

## Writing Tests

Create new test files in the `tests` directory with `.spec.ts` extension. Use the following template:

```typescript
import { test, expect } from '@playwright/test';

test('test description', async ({ page }) => {
  // Your test code here
});
```

## Viewing Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```

## Learn More

- [Playwright Documentation](https://playwright.dev)
- [Playwright API Reference](https://playwright.dev/docs/api/class-browser)
