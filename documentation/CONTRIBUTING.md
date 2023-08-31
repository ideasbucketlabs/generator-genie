# Contributing

Thanks for your interest in contributing to Generator Genie!!! Please take a moment to review this document **before submitting a pull request**.

## Pull requests

**Please ask first before starting work on any significant new features.**

It's never a fun experience to have your pull request declined after investing a lot of time and effort into a new feature. To avoid this from happening, we request that contributors create [a feature request](https://github.com/ideasbucketlabs/generator-genie/discussions/new?category=ideas) to first discuss any significant new ideas. This includes things like adding new utilities, new features, etc.

## Getting set up locally
* `git clone`
* `npm ci`
* `npm run dev`

If you need to change the template then you can run `npm run process-template` after the changes. If you want to automate this process then you can run `npm run process-template:watch` this will read your template and processes it automatically when changes are made in the template.

### Coding standards
Generator Genie uses Prettier and ESLint for code formatting and enforcement.
For lint simply run `npm run lint` and for format run `npm run format`

### Commands that can be used in project
#### Process Templates

```sh
npm run process-template
```

#### Process Templates and Hot-Reload for development
```sh
npm run process-template:watch
```


#### Compile and Hot-Reload for Development

```sh
npm run dev
```

#### Type-Check, Compile and Minify for Production

```sh
npm run build
```

#### Run Unit Tests

```sh
npm run test:unit
```

#### Run End-to-End Tests

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
npm run test:e2e -- tests/app.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

#### Code Linting

```sh
npm run lint
```

#### Code Formatting

```sh
npm run format
```
## How to extend or add other project support
(This is a work-in-progress)

