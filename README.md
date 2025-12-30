# NestJS Utils

Complete set of utilities, validators, transformers and helpers for NestJS applications.

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Configuration](#️-configuration)
- [Documentation](#-documentation)
- [Quick Examples](#-quick-examples)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Exception System

- **ExceptionResponse**: Standardized class for error responses
- **GlobalExceptionFilter**: Global filter for catching and formatting exceptions
- **ValidationPipeConfig**: Optimized ValidationPipe configuration

### Custom Validators

- Validators for strings, numbers, dates, emails, UUIDs, URLs, JSON, arrays, objects and enums
- Support for automatic data transformation
- Customizable error messages

### Transformers

- Trim, ToLowerCase, ToUpperCase
- Type conversion (string ↔ number, string ↔ date, string ↔ boolean)
- ParseJSON, StringifyJSON
- Sanitize, RemoveSpaces, Slugify

### Helpers

- **PasswordHelper**: Password hashing and comparison with bcrypt
- **StringHelper**: Advanced string manipulation
- **DateHelper**: Date operations using date-fns
- **ObjectHelper**: Object manipulation (deepClone, deepMerge, pick, omit, flatten)
- **ArrayHelper**: Array operations (unique, groupBy, chunk, shuffle)
- **NumberHelper**: Number formatting and conversion
- **ValidationHelper**: Brazilian validations (CPF, CNPJ, phone, ZIP code)
- **CryptoHelper**: Cryptographic operations (hash, encrypt, decrypt, UUID)

### Decorators

- **@Property()**: Unified decorator for validation, transformation and Swagger documentation
- **@LoggedUser()**: Authenticated user data extraction
- **@ApiPaginatedResponse()**: Swagger documentation for paginated responses

### Guards & Interceptors

- **JwtAuthGuard**: JWT authentication guard
- **TransformResponseInterceptor**: Response standardization
- **LoggingInterceptor**: Request and response logging
- **TimeoutInterceptor**: Configurable timeout for requests

### Database

- **BaseEntity**: Base entity with common fields and soft delete
- **EStatus**: Enum for record status

### DTOs

- **FindManyFiltersDTO**: Base DTO for pagination and filters
- **PaginatedResponseDTO**: DTO for paginated responses
- **MessageResponseDTO**: DTO for simple messages

## 🚀 Quick Examples

### @Property Decorator

```typescript
import { Property, PropertyType } from 'nestjs-utils';

export class CreateUserDTO {
  @Property({
    type: PropertyType.STRING,
    name: 'Name',
    required: true,
    transform: { trim: true },
    validation: { minLength: 3, maxLength: 100 },
    description: 'User full name',
    example: 'John Doe',
  })
  name: string;

  @Property({
    type: PropertyType.EMAIL,
    name: 'Email',
    required: true,
    transform: { trim: true, toLowerCase: true },
    description: 'User email',
    example: 'john@example.com',
  })
  email: string;

  @Property({
    type: PropertyType.NUMBER,
    name: 'Age',
    required: true,
    validation: { min: 18, max: 120, integerOnly: true },
    description: 'User age',
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

### BaseEntity with Soft Delete

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

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for more details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 👤 Author

**Augusto Preis Tomasi**

- Email: augustopreisthomasi@gmail.com
- GitHub: [@augustopreis](https://github.com/augustopreis)

## 🌟 Support the Project

If this project helped you, consider giving it a ⭐️ on GitHub!
