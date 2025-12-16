# NestJS Utils

Conjunto completo de utilitários, validadores, transformadores e helpers para aplicações NestJS.

## 📋 Índice

- [Características](#-características)
- [Instalação](#-instalação)
- [Configuração](#️-configuração)
- [Documentação](#-documentação)
- [Exemplos Rápidos](#-exemplos-rápidos)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

## ✨ Características

### Sistema de Exceções

- **ExceptionResponse**: Classe padronizada para respostas de erro
- **GlobalExceptionFilter**: Filtro global para captura e formatação de exceções
- **ValidationPipeConfig**: Configuração otimizada do ValidationPipe

### Validadores Customizados

- Validadores para strings, números, datas, emails, UUIDs, URLs, JSON, arrays, objetos e enums
- Suporte a transformação automática de dados
- Mensagens de erro personalizáveis

### Transformadores

- Trim, ToLowerCase, ToUpperCase
- Conversão entre tipos (string ↔ number, string ↔ date, string ↔ boolean)
- ParseJSON, StringifyJSON
- Sanitize, RemoveSpaces, Slugify

### Helpers

- **PasswordHelper**: Hash e comparação de senhas com bcrypt
- **StringHelper**: Manipulação avançada de strings
- **DateHelper**: Operações com datas usando date-fns
- **ObjectHelper**: Manipulação de objetos (deepClone, deepMerge, pick, omit, flatten)
- **ArrayHelper**: Operações com arrays (unique, groupBy, chunk, shuffle)
- **NumberHelper**: Formatação e conversão de números
- **ValidationHelper**: Validações brasileiras (CPF, CNPJ, telefone, CEP)
- **CryptoHelper**: Operações criptográficas (hash, encrypt, decrypt, UUID)

### Decorators

- **@Property()**: Decorator unificado para validação, transformação e documentação Swagger
- **@LoggedUser()**: Extração de dados do usuário autenticado
- **@ApiPaginatedResponse()**: Documentação Swagger para respostas paginadas

### Guards & Interceptors

- **JwtAuthGuard**: Guard de autenticação JWT
- **TransformResponseInterceptor**: Padronização de respostas
- **LoggingInterceptor**: Log de requisições e respostas
- **TimeoutInterceptor**: Timeout configurável para requisições

### Database

- **BaseEntity**: Entidade base com campos comuns e soft delete
- **EStatus**: Enum para status de registros

### DTOs

- **FindManyFiltersDTO**: DTO base para paginação e filtros
- **PaginatedResponseDTO**: DTO para respostas paginadas
- **MessageResponseDTO**: DTO para mensagens simples

## 🚀 Exemplos Rápidos

### Decorator @Property

```typescript
import { Property, PropertyType } from 'nestjs-utils';

export class CreateUserDTO {
  @Property({
    type: PropertyType.STRING,
    name: 'Nome',
    required: true,
    transform: { trim: true },
    validation: { minLength: 3, maxLength: 100 },
    description: 'Nome completo do usuário',
    example: 'João Silva',
  })
  name: string;

  @Property({
    type: PropertyType.EMAIL,
    name: 'E-mail',
    required: true,
    transform: { trim: true, toLowerCase: true },
    description: 'E-mail do usuário',
    example: 'joao@example.com',
  })
  email: string;

  @Property({
    type: PropertyType.NUMBER,
    name: 'Idade',
    required: true,
    validation: { min: 18, max: 120, integerOnly: true },
    description: 'Idade do usuário',
    example: 25,
  })
  age: number;
}
```

### Helpers

```typescript
import { PasswordHelper, StringHelper } from 'nestjs-utils';

const hashedPassword = await PasswordHelper.hash('myPassword123');
const isValid = await PasswordHelper.compare('myPassword123', hashedPassword);

const masked = StringHelper.mask('12345678900', '###.###.###-##');
```

### BaseEntity com Soft Delete

```typescript
import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'nestjs-utils';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column()
  email: string;
}

const user = new User();
user.activate();
user.softDelete();

console.log(user.isActive());
console.log(user.isDeleted());
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Veja [CONTRIBUTING.md](./CONTRIBUTING.md) para mais detalhes.

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](./LICENSE) para detalhes.

## 👤 Autor

**Augusto Preis Tomasi**

- Email: augustopreisthomasi@gmail.com
- GitHub: [@augustopreis](https://github.com/augustopreis)

## 🌟 Apoie o Projeto

Se este projeto te ajudou, considere dar uma ⭐️ no GitHub!
