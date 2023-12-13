# {{ metadata.name | capitalize }}

{{ metadata.description }}

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

{%- if typescriptSelected -%}
## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.
{%- endif -%}

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
# Expose host
npm run dev -- --host
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

{%- if metadata.includeUnitTest -%}

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```
{%- endif -%}

{%- if metadata.integrationTest == 'playwright' -%}

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

{%- elsif metadata.integrationTest == 'nightwatch' -%}

### Run End-to-End Tests with [Nightwatch](https://nightwatchjs.org/)

```sh
# When using CI, the project must be built first.
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chrome
npm run test:e2e -- --env chrome
# Runs the tests of a specific file
npm run test:e2e -- tests/e2e/example.js
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Run Headed Component Tests with [Nightwatch Component Testing](https://nightwatchjs.org/guide/component-testing/introduction.html)

```sh
npm run test:unit
npm run test:unit -- --headless # for headless testing
```
{%- elsif metadata.integrationTest == 'cypress' -%}

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

{%- endif -%}
{%- if metadata.includeEslint -%}

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
{%- endif -%}

{%- if metadata.includePrettier -%}

### Format Code with [Prettify](https://prettier.io/)

```sh
npm run format
```
{%- endif -%}
