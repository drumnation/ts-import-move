# Contributing to ts-import-move

We love your input! We want to make contributing to ts-import-move as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/ts-import-move.git`
3. Install dependencies: `pnpm install`
4. Create a branch for your feature: `git checkout -b feature/amazing-feature`

## Local Development

```bash
# Run in development mode
pnpm dev -- src/file.ts src/newlocation/

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code with Prettier
pnpm format

# Build the package
pnpm build
```

## Testing

Please ensure that your changes pass all tests:

```bash
pnpm test
```

When adding new features, please include appropriate tests. The testing stack uses:

- Vitest for unit and integration testing
- E2E tests for CLI functionality

## Pull Request Process

1. Update the README.md and CHANGELOG.md with details of changes if applicable
2. Update the version in package.json following [Semantic Versioning](https://semver.org/)
3. Submit your pull request with a clear description of the changes

## Coding Standards

- Use TypeScript for all code
- Follow existing code style and formatting
- Add appropriate comments and documentation
- Ensure code passes linting (`pnpm lint`)
- Format code with Prettier (`pnpm format`)

## Commit Message Format

Use clear, descriptive commit messages in the present tense:

```
feat: add ability to move multiple files at once
fix: correct import path resolution for recursive directories
docs: update README with new CLI options
test: add test for pattern matching functionality
```

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.

## Last Updated

2025-04-13 