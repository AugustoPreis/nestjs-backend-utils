# Contribution Guide

Thank you for considering contributing to NestJS Utils! This document provides guidelines for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Environment Setup](#environment-setup)
- [Code Standards](#code-standards)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Improvements](#suggesting-improvements)

## Code of Conduct

This project follows a Code of Conduct. By participating, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

There are several ways to contribute:

- 🐛 Report bugs  
- 💡 Suggest new features  
- 📝 Improve documentation  
- 🔧 Fix existing bugs  
- ✨ Implement new features  

## Environment Setup

### 1. Fork and Clone

```bash
git clone https://github.com/AugustoPreis/nestjs-backend-utils.git
cd nestjs-backend-utils


### 2. Install Dependencies

```bash
npm install
```

### 3. Create a Branch

```bash
git checkout -b feat/my-feature
```

or

```bash
git checkout -b fix/bug-fix
```

### 4. Build

```bash
npm run build
```

## Code Standards

### TypeScript

- ✅ TypeScript strict mode
- ✅ Always define explicit types
- ✅ Avoid `any` - use specific types or `unknown`
- ✅ Use interfaces for public contracts
- ✅ Use types for unions and intersections

### Naming Conventions

- **Classes**: PascalCase - `ValidationHelper`, `PasswordHelper`
- **Interfaces**: PascalCase with `I` prefix - `ILoggedUser`, `IExceptionResponse`
- **Functions**: camelCase - `buildValidators`, `extractMessages`
- **Constants**: SCREAMING_SNAKE_CASE - `DEFAULT_SALT_ROUNDS`
- **Files**: kebab-case - `password.helper.ts`, `property.decorator.ts`

### Formatação

The project uses **Prettier** and **ESLint**:

```bash
npm run format
npm run lint
npm run lint:fix
```

**Prettier Configuration:**

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "endOfLine": "auto"
}
```

### Comments

- ❌ Do not add obvious comments
- ✅ Document public functions with JSDoc (only when necessary)
- ✅ Explain the *why*, not the *how*

## Pull Request Process

### 1. Before Submitting

- ✅ Run the linter: `npm run lint`
- ✅ Format the code: `npm run format`
- ✅ Successful build: `npm run build`
- ✅ Update documentation if needed

### 2. Commit Messages

Use clear and descriptive messages:

```bash
feat: add Brazilian phone validator
fix: fix CPF validation with punctuation
docs: update PasswordHelper examples
refactor: split validators into individual files
test: add tests for StringHelper
```

**Pattern:**

```
<type>: <short description>

<optional detailed description>

<optional footer>
```

**Types:**

- `feat`: New Feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Adding or fixing tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

### 3. Create a Pull Request

1. Push to your fork
2. Open a Pull Request to the `main` branch
3. Fill in the PR template
4. Wait for review
