# Database

Complete guide to base entities and database utilities.

## Table of Contents

- [BaseEntity](#baseentity)
- [Usage Examples](#usage-examples)
- [TypeORM Integration](#typeorm-integration)
- [Status Management](#status-management)

---

## BaseEntity

Abstract base entity class with common fields including status management and soft delete.

### Description

Provides standard audit fields (`id`, `status`, `createdAt`, `updatedAt`, `deletedAt`) that all entities can inherit. Includes automatic timestamp management, status tracking, and soft delete support.

### Import

```typescript
import { BaseEntity, EStatus } from '@augustopreis/nestjs-utils';
```

### Properties

| Property    | Type           | Description           | Auto-Generated        |
| ----------- | -------------- | --------------------- | --------------------- |
| `id`        | `number`       | Primary key           | Yes (auto-increment)  |
| `status`    | `EStatus`      | Record status         | Yes (default: ACTIVE) |
| `createdAt` | `Date`         | Creation timestamp    | Yes                   |
| `updatedAt` | `Date`         | Last update timestamp | Yes                   |
| `deletedAt` | `Date \| null` | Soft delete timestamp | No (on soft delete)   |

### EStatus Enum

```typescript
enum EStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}
```

### Methods

#### isActive()

Checks if the record is active (status is ACTIVE and not soft-deleted).

```typescript
isActive(): boolean
```

**Returns:** `true` if record is active and not deleted

**Example:**

```typescript
const user = await userRepository.findOne({ where: { id: 1 } });
if (user.isActive()) {
  console.log('User is active');
}
```

---

#### isDeleted()

Checks if the record is deleted (status is DELETED or has deletedAt).

```typescript
isDeleted(): boolean
```

**Returns:** `true` if record is marked as deleted

**Example:**

```typescript
if (user.isDeleted()) {
  throw new BadRequestException('User is deleted');
}
```

---

#### isInactive()

Checks if the record is inactive.

```typescript
isInactive(): boolean
```

**Returns:** `true` if status is INACTIVE

---

#### activate()

Sets the status to ACTIVE.

```typescript
activate(): void
```

**Example:**

```typescript
user.activate();
await userRepository.save(user);
```

---

#### deactivate()

Sets the status to INACTIVE.

```typescript
deactivate(): void
```

**Example:**

```typescript
user.deactivate();
await userRepository.save(user);
```

---

#### softDelete()

Marks the record as deleted (sets status to DELETED and deletedAt to current date).

```typescript
softDelete(): void
```

**Example:**

```typescript
user.softDelete();
await userRepository.save(user);
```

---

#### restore()

Restores a soft-deleted record.

```typescript
restore(status?: EStatus): void
```

**Parameters:**

- `status`: Status to restore to (default: EStatus.ACTIVE)

**Example:**

```typescript
user.restore();
await userRepository.save(user);

// Restore as inactive
user.restore(EStatus.INACTIVE);
await userRepository.save(user);
```

---

## Usage Examples

### Basic Entity

```typescript
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@augustopreis/nestjs-utils';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
```

**Database Schema:**

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  status VARCHAR DEFAULT 'ACTIVE',
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP NULL
);
```

---

### Status Transitions

```typescript
@Injectable()
export class UsersService {
  async activateUser(id: number): Promise<User> {
    const user = await this.findOne(id);
    user.activate();

    return this.userRepository.save(user);
  }

  async deactivateUser(id: number): Promise<User> {
    const user = await this.findOne(id);

    if (user.isDeleted()) {
      throw new BadRequestException('Cannot deactivate a deleted user');
    }

    user.deactivate();

    return this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.findOne(id);
    user.softDelete();

    await this.userRepository.save(user);
  }

  async restoreUser(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.isDeleted()) {
      throw new BadRequestException('User is not deleted');
    }

    user.restore();

    return this.userRepository.save(user);
  }
}
```
