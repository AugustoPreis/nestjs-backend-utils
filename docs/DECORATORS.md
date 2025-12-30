# Decorators

Complete guide to all decorators available in this package.

## Table of Contents

- [@Property](#property)
- [@LoggedUser](#loggeduser)
- [@ApiPaginatedResponse](#apipaginatedresponse)
- [@Endpoint](#endpoint)

---

## @Property

Unified decorator for property validation, transformation and Swagger documentation.

### Description

The `@Property` decorator combines class-validator, class-transformer and Swagger decorators into a single, easy-to-use decorator. It automatically applies validation rules, transformations, and generates API documentation based on the provided options.

### Import

```typescript
import { Property, PropertyType } from 'nestjs-utils';
```

### Signature

```typescript
function Property(options: PropertyOptions): PropertyDecorator;
```

### Parameters

| Parameter | Type              | Required | Description                            |
| --------- | ----------------- | -------- | -------------------------------------- |
| options   | `PropertyOptions` | Yes      | Configuration options for the property |

#### PropertyOptions

```typescript
interface PropertyOptions {
  type: PropertyType; // Property type (STRING, NUMBER, EMAIL, etc.)
  name?: string; // Display name for error messages
  description?: string; // Description for Swagger documentation
  example?: any; // Example value for Swagger
  required?: boolean; // Whether the property is required (default: true)
  defaultValue?: any; // Default value
  transform?: TransformOptions; // Transformation options (trim, toLowerCase, etc.)
  validation?: ValidationOptions; // Validation rules (min, max, pattern, etc.)
  swagger?: ApiPropertyOptions; // Additional Swagger options
  enumValues?: object; // Enum values for ENUM type
}
```

### Supported Property Types

```typescript
enum PropertyType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DATE = 'date',
  EMAIL = 'email',
  UUID = 'uuid',
  URL = 'url',
  OBJECT = 'object',
  JSON = 'json',
  ENUM = 'enum',
  ARRAY = 'array',
}
```

### Examples

#### Basic String Property

```typescript
export class CreateUserDTO {
  @Property({
    type: PropertyType.STRING,
    name: 'Name',
    required: true,
    description: 'User full name',
    example: 'John Doe',
  })
  name: string;
}
```

#### String with Validation and Transformation

```typescript
export class CreateUserDTO {
  @Property({
    type: PropertyType.STRING,
    name: 'Username',
    required: true,
    transform: {
      trim: true,
      toLowerCase: true,
    },
    validation: {
      minLength: 3,
      maxLength: 20,
      pattern: /^[a-z0-9_]+$/,
    },
    description: 'Unique username',
    example: 'johndoe',
  })
  username: string;
}
```

#### Email Property

```typescript
export class CreateUserDTO {
  @Property({
    type: PropertyType.EMAIL,
    name: 'Email',
    required: true,
    transform: {
      trim: true,
      toLowerCase: true,
    },
    description: 'User email address',
    example: 'john@example.com',
  })
  email: string;
}
```

#### Number Property with Validation

```typescript
export class CreateProductDTO {
  @Property({
    type: PropertyType.NUMBER,
    name: 'Price',
    required: true,
    validation: {
      min: 0,
      max: 999999.99,
    },
    description: 'Product price',
    example: 99.99,
  })
  price: number;

  @Property({
    type: PropertyType.NUMBER,
    name: 'Quantity',
    required: true,
    validation: {
      min: 0,
      integerOnly: true,
    },
    description: 'Available quantity',
    example: 100,
  })
  quantity: number;
}
```

#### Enum Property

```typescript
import { EStatus } from 'nestjs-utils';

export class UpdateUserDTO {
  @Property({
    type: PropertyType.ENUM,
    name: 'Status',
    required: false,
    enumValues: EStatus,
    description: 'User status',
    example: EStatus.ACTIVE,
  })
  status?: EStatus;
}
```

#### Array Property

```typescript
export class CreateOrderDTO {
  @Property({
    type: PropertyType.ARRAY,
    name: 'Items',
    required: true,
    validation: {
      minElements: 1,
      maxElements: 50,
    },
    description: 'Order items',
    example: ['item1', 'item2'],
  })
  items: string[];
}
```

#### Optional Property

```typescript
export class UpdateUserDTO {
  @Property({
    type: PropertyType.STRING,
    name: 'Bio',
    required: false,
    validation: {
      maxLength: 500,
    },
    description: 'User biography',
    example: 'Software developer',
  })
  bio?: string;
}
```

---

## @LoggedUser

Decorator to inject authenticated user data into controller parameters.

### Description

Extracts the authenticated user object from the request (typically set by a JWT strategy or authentication middleware) and injects it into the controller method parameter.

### Import

```typescript
import { LoggedUser } from 'nestjs-utils';
```

### Signature

```typescript
function LoggedUser(data?: string | LoggedUserOptions): ParameterDecorator;
```

### Parameters

| Parameter | Type                          | Required | Description                                           |
| --------- | ----------------------------- | -------- | ----------------------------------------------------- |
| data      | `string \| LoggedUserOptions` | No       | Property name to extract from user, or options object |

#### LoggedUserOptions

```typescript
interface LoggedUserOptions {
  property?: string; // Specific property to extract from user object
  required?: boolean; // Whether user must be authenticated (default: true)
}
```

### Examples

#### Inject Entire User Object

```typescript
@Controller('profile')
export class ProfileController {
  @Get()
  getProfile(@LoggedUser() user: User) {
    return user;
  }
}
```

#### Extract Specific Property

```typescript
@Controller('profile')
export class ProfileController {
  @Get('id')
  getUserId(@LoggedUser('id') id: number) {
    return { id };
  }

  @Get('email')
  getUserEmail(@LoggedUser('email') email: string) {
    return { email };
  }
}
```

#### Optional User (Non-authenticated Routes)

```typescript
@Controller('content')
export class ContentController {
  @Get()
  getContent(@LoggedUser({ required: false }) user?: User) {
    if (user) {
      return this.getPersonalizedContent(user);
    }

    return this.getPublicContent();
  }
}
```

#### With Property and Optional

```typescript
@Controller('notifications')
export class NotificationsController {
  @Get()
  getNotifications(
    @LoggedUser({ property: 'id', required: false }) userId?: number,
  ) {
    if (userId) {
      return this.notificationsService.findByUserId(userId);
    }

    return [];
  }
}
```

---

## @ApiPaginatedResponse

Decorator to document paginated responses in Swagger/OpenAPI.

### Description

Automatically generates OpenAPI documentation for endpoints that return paginated data. Creates a standardized schema that includes data array, total count, current page, and total pages.

### Import

```typescript
import { ApiPaginatedResponse } from 'nestjs-utils';
```

### Signature

```typescript
function ApiPaginatedResponse(
  options: ApiPaginatedResponseOptions,
): MethodDecorator;
```

### Parameters

| Parameter | Type                          | Required | Description                                        |
| --------- | ----------------------------- | -------- | -------------------------------------------------- |
| options   | `ApiPaginatedResponseOptions` | Yes      | Configuration for paginated response documentation |

#### ApiPaginatedResponseOptions

```typescript
interface ApiPaginatedResponseOptions {
  type: Type<unknown>; // The DTO class for individual items
  description?: string; // Response description (default: 'Paginated list')
  status?: number; // HTTP status code (default: 200)
}
```

### Examples

#### Basic Paginated Response

```typescript
import { ApiPaginatedResponse, PaginatedResponseDTO } from 'nestjs-utils';

@Controller('users')
export class UsersController {
  @Get()
  @ApiPaginatedResponse({ type: UserDTO })
  async findAll(
    @Query() filters: FindManyFiltersDTO,
  ): Promise<PaginatedResponseDTO<UserDTO>> {
    const [users, total] = await this.usersService.findAndCount(filters);

    return new PaginatedResponseDTO(users, total, filters.page, filters.take);
  }
}
```

#### With Custom Status

```typescript
@Controller('products')
export class ProductsController {
  @Get()
  @ApiPaginatedResponse({
    type: ProductDTO,
    description: 'Returns paginated list of products',
    status: HttpStatus.OK,
  })
  async findAll(
    @Query() filters: FindManyFiltersDTO,
  ): Promise<PaginatedResponseDTO<ProductDTO>> {
    return this.productsService.findAllPaginated(filters);
  }
}
```

---

## @Endpoint

Unified decorator to define REST endpoints with comprehensive configuration.

### Description

Combines multiple NestJS decorators into a single, powerful endpoint definition. Supports HTTP methods, guards, interceptors, pipes, serialization, headers, authentication, and automatic Swagger/OpenAPI documentation generation.

### Import

```typescript
import { Endpoint } from 'nestjs-utils';
import { RequestMethod } from '@nestjs/common';
```

### Signature

```typescript
function Endpoint(options: IEndpointOptions): MethodDecorator;
```

### Parameters

| Parameter | Type               | Required | Description                          |
| --------- | ------------------ | -------- | ------------------------------------ |
| options   | `IEndpointOptions` | Yes      | Comprehensive endpoint configuration |

#### IEndpointOptions

```typescript
interface IEndpointOptions {
  method: RequestMethod; // HTTP method (GET, POST, PUT, DELETE, etc.)
  path: string; // Route path
  status?: HttpStatus; // Response status code (default: 200)
  guards?: Array<Type<CanActivate>>; // Guards to apply
  interceptors?: Array<Type<NestInterceptor>>; // Interceptors
  pipes?: Array<Type<PipeTransform>>; // Pipes
  serialize?: boolean | Type<ClassSerializerInterceptor>; // Enable serialization
  headers?: Record<string, string>; // Custom headers
  auth?: 'bearer' | 'basic' | 'api-key' | boolean; // Authentication type
  tags?: string[]; // Swagger tags
  summary?: string; // Endpoint summary (Swagger)
  description?: string; // Endpoint description (Swagger)
  bodyType?: Type<any>; // Request body DTO (Swagger)
  responses?: ApiResponseOptions[]; // Response schemas (Swagger)
  queryParams?: ApiQueryOptions[]; // Query parameters (Swagger)
  pathParams?: ApiParamOptions[]; // Path parameters (Swagger)
}
```

### Examples

#### Basic GET Endpoint

```typescript
import { Endpoint } from 'nestjs-utils';
import { RequestMethod } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Endpoint({
    method: RequestMethod.GET,
    path: '/',
    summary: 'Get all users',
    description: 'Returns a list of all users',
    tags: ['Users'],
  })
  async findAll() {
    return this.usersService.findAll();
  }
}
```

#### POST Endpoint with Authentication and Validation

```typescript
import { Endpoint, JwtAuthGuard } from 'nestjs-utils';
import { RequestMethod, HttpStatus } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Endpoint({
    method: RequestMethod.POST,
    path: '/',
    status: HttpStatus.CREATED,
    guards: [JwtAuthGuard],
    auth: 'bearer',
    summary: 'Create a new user',
    description: 'Creates a new user account',
    bodyType: CreateUserDTO,
    responses: [
      { status: 201, description: 'User created successfully', type: UserDTO },
      { status: 400, description: 'Invalid data provided' },
      { status: 401, description: 'Unauthorized' },
    ],
    tags: ['Users'],
  })
  async create(@Body() dto: CreateUserDTO): Promise<UserDTO> {
    return this.usersService.create(dto);
  }
}
```

#### PUT Endpoint with Path Parameters

```typescript
@Controller('users')
export class UsersController {
  @Endpoint({
    method: RequestMethod.PUT,
    path: '/:id',
    guards: [JwtAuthGuard],
    auth: 'bearer',
    summary: 'Update user',
    description: 'Updates an existing user',
    bodyType: UpdateUserDTO,
    pathParams: [{ name: 'id', description: 'User ID', type: String }],
    responses: [
      { status: 200, description: 'User updated successfully', type: UserDTO },
      { status: 404, description: 'User not found' },
    ],
    tags: ['Users'],
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDTO,
  ): Promise<UserDTO> {
    return this.usersService.update(id, dto);
  }
}
```

#### GET Endpoint with Query Parameters

```typescript
@Controller('products')
export class ProductsController {
  @Endpoint({
    method: RequestMethod.GET,
    path: '/search',
    summary: 'Search products',
    description: 'Search products by various criteria',
    queryParams: [
      { name: 'q', description: 'Search query', required: false, type: String },
      {
        name: 'category',
        description: 'Product category',
        required: false,
        type: String,
      },
      {
        name: 'minPrice',
        description: 'Minimum price',
        required: false,
        type: Number,
      },
      {
        name: 'maxPrice',
        description: 'Maximum price',
        required: false,
        type: Number,
      },
    ],
    responses: [
      { status: 200, description: 'Products found', type: [ProductDTO] },
    ],
    tags: ['Products'],
  })
  async search(@Query() query: SearchProductsDTO): Promise<ProductDTO[]> {
    return this.productsService.search(query);
  }
}
```

#### DELETE Endpoint

```typescript
@Controller('users')
export class UsersController {
  @Endpoint({
    method: RequestMethod.DELETE,
    path: '/:id',
    status: HttpStatus.NO_CONTENT,
    guards: [JwtAuthGuard, AdminGuard],
    auth: 'bearer',
    summary: 'Delete user',
    description: 'Permanently deletes a user',
    pathParams: [{ name: 'id', description: 'User ID', type: String }],
    responses: [
      { status: 204, description: 'User deleted successfully' },
      { status: 404, description: 'User not found' },
      { status: 403, description: 'Forbidden' },
    ],
    tags: ['Users'],
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.usersService.remove(id);
  }
}
```

#### With Custom Headers and Interceptors

```typescript
import { LoggingInterceptor, TimeoutInterceptor } from 'nestjs-utils';

@Controller('reports')
export class ReportsController {
  @Endpoint({
    method: RequestMethod.GET,
    path: '/export',
    guards: [JwtAuthGuard],
    interceptors: [LoggingInterceptor, new TimeoutInterceptor(60000)],
    headers: {
      'Content-Type': 'application/pdf',
      'Cache-Control': 'no-cache',
    },
    summary: 'Export report',
    description: 'Exports a report in PDF format',
    tags: ['Reports'],
  })
  async export(): Promise<Buffer> {
    return this.reportsService.generatePDF();
  }
}
```
