# Guia de Contribuição

Obrigado por considerar contribuir com o NestJS Utils! Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Padrões de Código](#padrões-de-código)
- [Processo de Pull Request](#processo-de-pull-request)
- [Reportando Bugs](#reportando-bugs)
- [Sugerindo Melhorias](#sugerindo-melhorias)

## Código de Conduta

Este projeto segue um Código de Conduta. Ao participar, você concorda em manter um ambiente respeitoso e inclusivo para todos.

## Como Contribuir

Existem várias formas de contribuir:

- 🐛 Reportar bugs
- 💡 Sugerir novas funcionalidades
- 📝 Melhorar a documentação
- 🔧 Corrigir bugs existentes
- ✨ Implementar novas funcionalidades

## Configuração do Ambiente

### 1. Fork e Clone

```bash
git clone https://github.com/AugustoPreis/nestjs-utils.git
cd nestjs-utils
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Criar Branch

```bash
git checkout -b feature/minha-funcionalidade
```

ou

```bash
git checkout -b fix/correcao-bug
```

### 4. Executar Testes

```bash
npm test
```

### 5. Build

```bash
npm run build
```

## Padrões de Código

### TypeScript

- ✅ Use TypeScript strict mode
- ✅ Sempre defina tipos explícitos
- ✅ Evite `any` - use tipos específicos ou `unknown`
- ✅ Use interfaces para contratos públicos
- ✅ Use types para unions e intersections

### Naming Conventions

- **Classes**: PascalCase - `ValidationHelper`, `PasswordHelper`
- **Interfaces**: PascalCase com prefixo `I` - `ILoggedUser`, `IExceptionResponse`
- **Functions**: camelCase - `buildValidators`, `extractMessages`
- **Constants**: SCREAMING_SNAKE_CASE - `DEFAULT_SALT_ROUNDS`
- **Files**: kebab-case - `password.helper.ts`, `property.decorator.ts`

### Formatação

O projeto usa **Prettier** e **ESLint**:

```bash
npm run format
npm run lint
npm run lint:fix
```

**Configuração Prettier:**

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "endOfLine": "auto"
}
```

### Comentários

- ❌ Não adicione comentários óbvios
- ✅ Documente funções públicas com JSDoc (apenas quando necessário)
- ✅ Explique o "porquê", não o "como"

## Processo de Pull Request

### 1. Antes de Submeter

- ✅ Execute o linter: `npm run lint`
- ✅ Formate o código: `npm run format`
- ✅ Build com sucesso: `npm run build`
- ✅ Atualize a documentação se necessário

### 2. Commit Messages

Use mensagens claras e descritivas:

```bash
feat: adiciona validador de telefone brasileiro
fix: corrige validação de CPF com pontuação
docs: atualiza exemplos do PasswordHelper
refactor: separa validadores em arquivos individuais
test: adiciona testes para StringHelper
```

**Padrão:**

```
<tipo>: <descrição curta>

<descrição detalhada opcional>

<footer opcional>
```

**Tipos:**

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Alterações na documentação
- `refactor`: Refatoração de código
- `test`: Adição ou correção de testes
- `chore`: Tarefas de manutenção
- `perf`: Melhorias de performance

### 3. Criar Pull Request

1. Push para seu fork
2. Abra um Pull Request para a branch `main`
3. Preencha o PR
4. Aguarde a revisão
