# DTOs (Data Transfer Objects)

Complete guide to all DTO classes available in this package.

## Table of Contents

- [FindManyFiltersDTO](#findmanyfiltersdto)
- [PaginatedResponseDTO](#paginatedresponsedto)
- [MessageResponseDTO](#messageresponsedto)

---

## FindManyFiltersDTO

Base DTO for pagination and filtering in find operations.

### Description

Standard DTO for list/search endpoints with pagination, ordering, and common filters. Designed to work seamlessly with TypeORM and other ORMs.

### Import

```typescript
import { FindManyFiltersDTO } from '@augustopreis/nestjs-utils';
```

### Properties

| Property | Type     | Description              | Default       | Required |
| -------- | -------- | ------------------------ | ------------- | -------- |
| `page`   | `number` | Current page (1-indexed) | `1`           | No       |
| `take`   | `number` | Records per page         | `10`          | No       |
| `sort`   | `string` | Field to sort by         | -             | No       |
| `order`  | `EOrder` | Sort direction           | `EOrder.DESC` | No       |

### Methods

#### getOffset()

Calculates the offset for database queries.

```typescript
getOffset(): number
```

**Returns:** The calculated offset (skip value) based on page and take.

**Example:**

```typescript
const filters = new FindManyFiltersDTO();
filters.page = 2;
filters.take = 10;
const offset = filters.getOffset(); // Returns 10
```

### Enums

#### EOrder

```typescript
enum EOrder {
  ASC = 'ASC',
  DESC = 'DESC',
  asc = 'asc',
  desc = 'desc',
}
```

### Example Usage

#### Basic Controller

```typescript
import { Controller, Get, Query } from '@nestjs/common';
import { FindManyFiltersDTO } from '@augustopreis/nestjs-utils';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll(@Query() filters: FindManyFiltersDTO) {
    return this.usersService.findAll(filters);
  }
}
```

**API Request:**

```
GET /users?page=2&take=20&sort=name&order=ASC
```

---

#### Service with TypeORM

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { FindManyFiltersDTO } from '@augustopreis/nestjs-utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(filters: FindManyFiltersDTO) {
    const { page, take, order, sort } = filters;

    const query = this.userRepository.createQueryBuilder('user');

    // Apply ordering if sort field is provided
    if (sort) {
      query.orderBy(`user.${sort}`, order);
    } else {
      query.orderBy('user.createdAt', order);
    }

    // Apply pagination
    query.skip(filters.getOffset());
    query.take(take);

    // Get results and count
    const [data, total] = await query.getManyAndCount();

    return new PaginatedResponseDTO(data, total, page, take);
  }
}
```

---

#### Extending for Custom Filters

```typescript
import { FindManyFiltersDTO } from '@augustopreis/nestjs-utils';
import { IsOptional, IsEnum } from 'class-validator';

enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MODERATOR = 'MODERATOR',
}

export class FindUsersDTO extends FindManyFiltersDTO {
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAfter?: Date;
}

// Usage in controller
@Get()
async findAll(@Query() filters: FindUsersDTO) {
  return this.usersService.findAll(filters);
}
```

**API Request:**

```
GET /users?page=1&take=10&sort=createdAt&order=DESC&role=ADMIN&emailVerified=true&createdAfter=2024-02-30
```

---

## PaginatedResponseDTO

Standard paginated response structure.

### Description

Generic DTO for paginated API responses with data and metadata. Works with `@ApiPaginatedResponse` decorator.

### Import

```typescript
import { PaginatedResponseDTO } from '@augustopreis/nestjs-utils';
```

### Generic Type

```typescript
PaginatedResponseDTO<T>;
```

### Structure

```typescript
{
  data: T[];
  total: number;
  page?: number;
  pages?: number;
}
```

### Properties

| Property | Type     | Description             | Required |
| -------- | -------- | ----------------------- | -------- |
| `data`   | `T[]`    | Array of items          | Yes      |
| `total`  | `number` | Total number of records | Yes      |
| `page`   | `number` | Current page number     | No       |
| `pages`  | `number` | Total number of pages   | No       |

### Constructor

```typescript
constructor(data: T[], total: number, page?: number, pageSize?: number)
```

**Parameters:**

- `data`: Array of items
- `total`: Total number of records
- `page`: Current page (optional)
- `pageSize`: Items per page (optional, used to calculate total pages)

**Note:** The `pages` property is automatically calculated when both `page` and `pageSize` are provided.

### Example Usage

#### Service Response

```typescript
import { Injectable } from '@nestjs/common';
import { PaginatedResponseDTO } from '@augustopreis/nestjs-utils';

@Injectable()
export class ProductsService {
  async findAll(
    filters: FindManyFiltersDTO,
  ): Promise<PaginatedResponseDTO<Product>> {
    const { page, take } = filters;

    const [data, total] = await this.productRepository.findAndCount({
      skip: filters.getOffset(),
      take: take,
    });

    return new PaginatedResponseDTO(data, total, page, take);
  }
}
```

---

#### With Type Safety

```typescript
import { Controller, Get, Query } from '@nestjs/common';
import { PaginatedResponseDTO } from '@augustopreis/nestjs-utils';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  @Get()
  async findAll(
    @Query() filters: FindManyFiltersDTO,
  ): Promise<PaginatedResponseDTO<Product>> {
    return this.productsService.findAll(filters);
  }
}
```

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Product 1",
      "price": 29.99
    },
    {
      "id": 2,
      "name": "Product 2",
      "price": 39.99
    }
  ],
  "total": 45,
  "page": 1,
  "pages": 5
}
```

---

#### With Additional Metadata

```typescript
interface ExtendedPaginatedResponse<T> extends PaginatedResponseDTO<T> {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

function createExtendedResponse<T>(
  data: T[],
  total: number,
  page: number,
  take: number,
): ExtendedPaginatedResponse<T> {
  const pages = Math.ceil(total / take);

  return {
    data,
    total,
    page,
    pages,
    hasNextPage: page < pages,
    hasPreviousPage: page > 1,
  };
}
```

---

## MessageResponseDTO

Simple message response DTO.

### Description

Standard response structure for operations that only need to return a message (success operations, confirmations, etc).

### Import

```typescript
import { MessageResponseDTO } from '@augustopreis/nestjs-utils';
```

### Structure

```typescript
{
  message: string;
}
```

### Example Usage

#### Delete Operation

```typescript
import { Controller, Delete, Param } from '@nestjs/common';
import { MessageResponseDTO } from '@augustopreis/nestjs-utils';

@Controller('users')
export class UsersController {
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<MessageResponseDTO> {
    await this.usersService.remove(id);

    return {
      message: 'User successfully deleted',
    };
  }
}
```

**Response:**

```json
{
  "message": "User successfully deleted"
}
```

---

#### With Swagger Documentation

```typescript
import { ApiResponse } from '@nestjs/swagger';
import { MessageResponseDTO } from '@augustopreis/nestjs-utils';

@Delete(':id')
@ApiResponse({
  status: 200,
  description: 'User successfully deleted',
  type: MessageResponseDTO,
})
@ApiResponse({
  status: 404,
  description: 'User not found',
})
async remove(@Param('id') id: number): Promise<MessageResponseDTO> {
  await this.usersService.remove(id);

  return {
    message: 'User successfully deleted',
  };
}
```
