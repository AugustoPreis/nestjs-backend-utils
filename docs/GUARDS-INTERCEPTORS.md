# Guards & Interceptors

Complete guide to authentication guards and interceptors available in this package.

## Table of Contents

- [Guards](#guards)
  - [JwtAuthGuard](#jwtauthguard)
- [Interceptors](#interceptors)
  - [LoggingInterceptor](#logginginterceptor)
  - [TimeoutInterceptor](#timeoutinterceptor)
  - [TransformResponseInterceptor](#transformresponseinterceptor)

---

# Guards

## JwtAuthGuard

JWT authentication guard for protecting routes.

### Description

Guard that validates JWT tokens and protects routes from unauthorized access. Extends `@nestjs/passport` AuthGuard.

### Import

```typescript
import { JwtAuthGuard } from 'nestjs-utils';
```

### Setup

#### 1. Install Dependencies

```bash
npm install @nestjs/passport @nestjs/jwt passport passport-jwt
npm install -D @types/passport-jwt
```

#### 2. Configure JWT Module

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  providers: [JwtStrategy],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
```

#### 3. Create JWT Strategy

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
```

### Basic Usage

#### Protect Single Route

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'nestjs-utils';

@Controller('users')
export class UsersController {
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@LoggedUser() user: User) {
    return user;
  }
}
```

#### Protect Entire Controller

```typescript
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  // All routes are protected

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Post()
  create(@Body() createDto: CreateProductDTO) {
    return this.productsService.create(createDto);
  }
}
```

---

### Advanced Usage

#### With Endpoint Decorator

```typescript
import { Endpoint, JwtAuthGuard } from 'nestjs-utils';

@Controller('orders')
export class OrdersController {
  @Endpoint({
    method: 'get',
    path: '',
    summary: 'List user orders',
    guards: [JwtAuthGuard],
  })
  async findAll(@LoggedUser() user: User) {
    return this.ordersService.findByUser(user.id);
  }
}
```

#### Public Routes Exception

```typescript
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// Global guard with public route exception
@Injectable()
export class JwtAuthGuardWithPublic extends JwtAuthGuard {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}

// Usage
@Controller('auth')
export class AuthController {
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDTO) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  getProfile(@LoggedUser() user: User) {
    return user;
  }
}
```

#### Role-Based Access Control

```typescript
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}

// Usage
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  @Get('users')
  @Roles('admin')
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Delete('users/:id')
  @Roles('admin', 'superadmin')
  deleteUser(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
```

---

### API Request Example

```bash
# Without token (401 Unauthorized)
curl -X GET http://localhost:3000/users/profile

# With token (200 OK)
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

# Interceptors

## LoggingInterceptor

Interceptor for logging HTTP requests and responses.

### Description

Logs request details (method, URL, body) and response details (status code, duration) for monitoring and debugging.

### Import

```typescript
import { LoggingInterceptor } from 'nestjs-utils';
```

### Basic Usage

#### Global Interceptor

```typescript
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from 'nestjs-utils';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
```

#### Controller-Level

```typescript
import { Controller, UseInterceptors } from '@nestjs/common';
import { LoggingInterceptor } from 'nestjs-utils';

@Controller('users')
@UseInterceptors(LoggingInterceptor)
export class UsersController {
  // All routes will be logged
}
```

#### Route-Level

```typescript
@Get(':id')
@UseInterceptors(LoggingInterceptor)
findOne(@Param('id') id: number) {
  return this.usersService.findOne(id);
}
```

---

### Console Output Example

```
[2024-01-15 10:30:45] GET /users?page=1&limit=10
[2024-01-15 10:30:45] Response: 200 | Duration: 45ms

[2024-01-15 10:31:12] POST /users
Body: { "name": "John Doe", "email": "john@example.com" }
[2024-01-15 10:31:12] Response: 201 | Duration: 123ms

[2024-01-15 10:32:08] DELETE /users/5
[2024-01-15 10:32:08] Response: 200 | Duration: 67ms
```

---

### Custom Logger Integration

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CustomLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CustomLoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;
    const userAgent = request.get('user-agent') || '';

    const now = Date.now();

    this.logger.log({
      message: 'Incoming request',
      method,
      url,
      userAgent,
      body,
    });

    return next.handle().pipe(
      tap({
        next: (data) => {
          const response = context.switchToHttp().getResponse();
          const duration = Date.now() - now;

          this.logger.log({
            message: 'Request completed',
            method,
            url,
            statusCode: response.statusCode,
            duration: `${duration}ms`,
          });
        },
        error: (error) => {
          const duration = Date.now() - now;

          this.logger.error({
            message: 'Request failed',
            method,
            url,
            duration: `${duration}ms`,
            error: error.message,
          });
        },
      }),
    );
  }
}
```

---

## TimeoutInterceptor

Interceptor that cancels requests exceeding timeout.

### Description

Automatically cancels requests that take longer than the specified timeout duration, preventing hung requests.

### Import

```typescript
import { TimeoutInterceptor } from 'nestjs-utils';
```

### Basic Usage

#### Global with Default Timeout (30s)

```typescript
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TimeoutInterceptor } from 'nestjs-utils';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
  ],
})
export class AppModule {}
```

#### Custom Timeout

```typescript
import { Injectable } from '@nestjs/common';
import { TimeoutInterceptor } from 'nestjs-utils';

@Injectable()
export class CustomTimeoutInterceptor extends TimeoutInterceptor {
  constructor() {
    super(5000); // 5 seconds
  }
}

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CustomTimeoutInterceptor,
    },
  ],
})
export class AppModule {}
```

#### Route-Specific Timeout

```typescript
import { Controller, Get, UseInterceptors } from '@nestjs/common';

@Injectable()
class ShortTimeoutInterceptor extends TimeoutInterceptor {
  constructor() {
    super(1000); // 1 second
  }
}

@Controller('health')
export class HealthController {
  @Get()
  @UseInterceptors(ShortTimeoutInterceptor)
  check() {
    return { status: 'ok' };
  }
}
```

---

### Different Timeouts per Route

```typescript
@Controller('api')
export class ApiController {
  @Get('quick')
  @UseInterceptors(new TimeoutInterceptor(2000)) // 2s
  quickEndpoint() {
    return this.service.quickOperation();
  }

  @Get('slow')
  @UseInterceptors(new TimeoutInterceptor(60000)) // 60s
  slowEndpoint() {
    return this.service.slowOperation();
  }
}
```

---

### Error Handling

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  RequestTimeoutException,
} from '@nestjs/common';

@Catch(RequestTimeoutException)
export class TimeoutExceptionFilter implements ExceptionFilter {
  catch(exception: RequestTimeoutException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    response.status(408).json({
      statusCode: 408,
      message: 'Request Timeout',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

// Register in main.ts
app.useGlobalFilters(new TimeoutExceptionFilter());
```

---

## TransformResponseInterceptor

Interceptor that transforms API responses to standard format.

### Description

Wraps all successful responses in a consistent structure with data, metadata, and timestamp. Useful for standardizing API responses.

### Import

```typescript
import { TransformResponseInterceptor } from 'nestjs-utils';
```

### Basic Usage

#### Global Interceptor

```typescript
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformResponseInterceptor } from 'nestjs-utils';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
  ],
})
export class AppModule {}
```

---

### Response Transformation

#### Before (Raw Response)

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

#### After (Transformed)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "timestamp": "2024-01-15T10:30:45.123Z",
  "path": "/users/1"
}
```

---

### Controller-Level

```typescript
import { Controller, UseInterceptors } from '@nestjs/common';
import { TransformResponseInterceptor } from 'nestjs-utils';

@Controller('users')
@UseInterceptors(TransformResponseInterceptor)
export class UsersController {
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }
}
```

---

### Custom Transform Interceptor

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

@Injectable()
export class CustomTransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": { "id": 1, "name": "John" },
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

---

### Skip Transform for Specific Routes

```typescript
import { SetMetadata } from '@nestjs/common';

export const SKIP_TRANSFORM_KEY = 'skipTransform';
export const SkipTransform = () => SetMetadata(SKIP_TRANSFORM_KEY, true);

@Injectable()
export class ConditionalTransformInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const skipTransform = this.reflector.getAllAndOverride<boolean>(
      SKIP_TRANSFORM_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (skipTransform) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
        path: request.url,
      })),
    );
  }
}

// Usage
@Get('raw')
@SkipTransform()
getRawData() {
  return { message: 'This will not be transformed' };
}
```

---

## Combining Multiple Interceptors

### Sequential Order

```typescript
@Controller('products')
@UseInterceptors(
  LoggingInterceptor,
  TimeoutInterceptor,
  TransformResponseInterceptor,
)
export class ProductsController {
  // Execution order:
  // 1. LoggingInterceptor (logs request)
  // 2. TimeoutInterceptor (applies timeout)
  // 3. TransformResponseInterceptor (transforms response)
  // 4. LoggingInterceptor (logs response)
}
```

### Global Setup

```typescript
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
  ],
})
export class AppModule {}
```

---

## Complete Example: Protected API with Logging

```typescript
import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import {
  JwtAuthGuard,
  LoggingInterceptor,
  TimeoutInterceptor,
  TransformResponseInterceptor,
  ValidationPipeConfig,
} from 'nestjs-utils';

@Module({
  providers: [
    // Global guard
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Global interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
    // Global validation pipe
    {
      provide: APP_PIPE,
      useValue: ValidationPipeConfig.create(),
    },
  ],
})
export class AppModule {}
```

**Controller:**

```typescript
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { LoggedUser, Public } from 'nestjs-utils';

@Controller('api')
export class ApiController {
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDTO) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  getProfile(@LoggedUser() user: User) {
    return user;
  }

  @Get('data')
  getData(@LoggedUser() user: User) {
    return this.dataService.findByUser(user.id);
  }
}
```

**Console Output:**

```
[2024-01-15 10:30:45] POST /api/login
Body: { "email": "john@example.com", "password": "..." }
[2024-01-15 10:30:45] Response: 200 | Duration: 145ms

[2024-01-15 10:31:15] GET /api/profile
[2024-01-15 10:31:15] Response: 200 | Duration: 23ms

[2024-01-15 10:31:20] GET /api/data
[2024-01-15 10:31:20] Response: 200 | Duration: 87ms
```
