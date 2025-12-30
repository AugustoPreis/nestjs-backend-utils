# Exception Handling

Complete guide to exception handling utilities available in this package.

## Table of Contents

- [GlobalExceptionFilter](#globalexceptionfilter)
- [ExceptionResponse](#exceptionresponse)
- [ValidationPipeConfig](#validationpipeconfig)
- [Error Handling Patterns](#error-handling-patterns)

---

## GlobalExceptionFilter

Global exception filter for standardized error handling.

### Description

Catches all exceptions in the application and formats them into a consistent response structure. Handles different exception types (HTTP exceptions, validation errors, etc.) and provides detailed error messages.

### Import

```typescript
import { GlobalExceptionFilter } from 'nestjs-backend-utils';
```

### Basic Usage

#### Register Globally

```typescript
import { NestFactory } from '@nestjs/core';
import { GlobalExceptionFilter } from 'nestjs-backend-utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Register global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(3000);
}
bootstrap();
```

#### Module Registration

```typescript
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from 'nestjs-backend-utils';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
```

---

### Response Format

#### Standard Error Response

The GlobalExceptionFilter uses the `IExceptionResponse` interface for all error responses:

```typescript
interface IExceptionResponse {
  message: string; // Main error message
  errors: string[]; // Array of detailed error messages
  statusCode: number; // HTTP status code
  uuid?: string; // Optional UUID for internal error tracking
}
```

**Example Response:**

```json
{
  "message": "Validation error",
  "errors": [
    "email must be an email",
    "password must be longer than or equal to 8 characters"
  ],
  "statusCode": 400
}
```

---

### Exception Types Handled

#### 1. HTTP Exceptions

```typescript
import { NotFoundException, BadRequestException } from '@nestjs/common';

@Get(':id')
async findOne(@Param('id') id: number) {
  const user = await this.usersService.findOne(id);

  if (!user) {
    throw new NotFoundException('User not found');
  }

  return user;
}
```

**Response (404):**

```json
{
  "message": "User not found",
  "errors": [],
  "statusCode": 404
}
```

#### 2. Validation Errors

```typescript
@Post()
async create(@Body() createDto: CreateUserDTO) {
  return this.usersService.create(createDto);
}
```

**Response (400) for invalid data:**

```json
{
  "message": "email must be an email",
  "errors": [
    "email must be an email",
    "password must be longer than or equal to 8 characters"
  ],
  "statusCode": 400
}
```

#### 3. Unhandled Exceptions

```typescript
@Get('error')
async throwError() {
  throw new Error('Unexpected error occurred');
}
```

**Response (500):**

```json
{
  "message": "An internal server error occurred. ID: 550e8400-e29b-41d4-a716-446655440000",
  "errors": [],
  "statusCode": 500,
  "uuid": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

## ExceptionResponse

Standard exception response class.

### Description

Utility class for creating standardized exception responses. Used internally by `GlobalExceptionFilter`.

### Import

```typescript
import { ExceptionResponse } from 'nestjs-backend-utils';
```

### Interface

```typescript
interface IExceptionResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
}
```

### Usage

#### Creating Custom Exception Response

```typescript
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { ExceptionResponse } from 'nestjs-backend-utils';

@Catch(CustomException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: CustomException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const errorResponse: IExceptionResponse = {
      statusCode: exception.getStatus(),
      message: exception.message,
      error: exception.name,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(exception.getStatus()).json(errorResponse);
  }
}
```

---

## ValidationPipeConfig

Pre-configured validation pipe settings.

### Description

Standard configuration for `class-validator` validation pipe with sensible defaults for production use.

### Import

```typescript
import { ValidationPipeConfig } from 'nestjs-backend-utils';
```

### Configuration

```typescript
{
  whitelist: true, // Strip properties not in DTO
  forbidNonWhitelisted: true, // Throw error on extra properties
  transform: true, // Auto-transform to DTO types
  transformOptions: {
    enableImplicitConversion: true, // Auto-convert types
  },
}
```

### Basic Usage

#### Global Registration

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipeConfig } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(ValidationPipeConfig.create());

  await app.listen(3000);
}
bootstrap();
```

#### Module Registration

```typescript
import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipeConfig } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useValue: ValidationPipeConfig.create(),
    },
  ],
})
export class AppModule {}
```

---

### Custom Validation Pipe

```typescript
import { ValidationPipeConfig } from 'nestjs-backend-utils';

const customConfig = ValidationPipeConfig.create({
  exceptionFactory: (errors) => {
    // Custom error formatting
    const messages = errors.map((error) => ({
      field: error.property,
      errors: Object.values(error.constraints || {}),
    }));

    return new BadRequestException({
      message: 'Validation failed',
      errors: messages,
    });
  },
});

app.useGlobalPipes(customConfig);
```

**Custom Error Response:**

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "errors": ["email must be an email"]
    },
    {
      "field": "password",
      "errors": ["password must be longer than or equal to 8 characters"]
    }
  ]
}
```

---

## Error Handling Patterns

### Complete Error Handling Setup

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import {
  GlobalExceptionFilter,
  ValidationPipeConfig,
  LoggingInterceptor,
} from 'nestjs-backend-utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // 2. Global validation pipe
  app.useGlobalPipes(new ValidationPipe(ValidationPipeConfig));

  // 3. Global logging interceptor
  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(3000);
}
bootstrap();
```

---

### Error Response Examples

#### 400 Bad Request

```json
{
  "message": "Invalid email format",
  "errors": [],
  "statusCode": 400
}
```

#### 401 Unauthorized

```json
{
  "message": "Invalid credentials",
  "errors": [],
  "statusCode": 401
}
```

#### 403 Forbidden

```json
{
  "message": "Insufficient permissions",
  "errors": [],
  "statusCode": 403
}
```

#### 404 Not Found

```json
{
  "message": "User with ID 999 not found",
  "errors": [],
  "statusCode": 404
}
```

#### 409 Conflict

```json
{
  "message": "Email already in use",
  "errors": [],
  "statusCode": 409
}
```

#### 422 Unprocessable Entity

```json
{
  "message": "email must be an email",
  "errors": [
    "email must be an email",
    "password must be at least 8 characters"
  ],
  "statusCode": 422
}
```

#### 500 Internal Server Error

```json
{
  "message": "An internal server error occurred. ID: 550e8400-e29b-41d4-a716-446655440000",
  "errors": [],
  "statusCode": 500,
  "uuid": "550e8400-e29b-41d4-a716-446655440000"
}
```
