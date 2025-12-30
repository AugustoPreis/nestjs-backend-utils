# Helpers

Complete guide to all helper classes available in this package.

## Table of Contents

- [PasswordHelper](#passwordhelper)
- [StringHelper](#stringhelper)
- [ArrayHelper](#arrayhelper)
- [NumberHelper](#numberhelper)
- [ObjectHelper](#objecthelper)

---

## PasswordHelper

Helper class for password operations using bcrypt.

### Description

Provides both synchronous and asynchronous methods for hashing and comparing passwords using the bcrypt algorithm with configurable salt rounds.

### Import

```typescript
import { PasswordHelper } from '@augustopreis/nestjs-utils';
```

### Methods

#### setSaltRounds

Sets the default number of salt rounds for password hashing.

```typescript
static setSaltRounds(rounds: number): void
```

**Parameters:**

- `rounds`: Number of salt rounds (recommended: 10-14)

**Example:**

```typescript
PasswordHelper.setSaltRounds(12); // More secure, slower
```

---

#### hash (async)

Creates password hash asynchronously (recommended for production).

```typescript
static async hash(password: string, saltRounds?: number): Promise<string>
```

**Parameters:**

- `password`: Plain text password to hash
- `saltRounds`: Optional number of salt rounds (uses default if not provided)

**Returns:** Promise resolving to hashed password

**Example:**

```typescript
const hashedPassword = await PasswordHelper.hash('myPassword123');
await userRepository.save({ ...user, password: hashedPassword });

// With custom salt rounds
const secureHash = await PasswordHelper.hash('myPassword123', 12);
```

---

#### compare (async)

Compares password with hash asynchronously (recommended for production).

```typescript
static async compare(password: string, hashedPassword: string): Promise<boolean>
```

**Parameters:**

- `password`: Plain text password to verify
- `hashedPassword`: Previously hashed password

**Returns:** Promise resolving to true if password matches, false otherwise

**Example:**

```typescript
const isValid = await PasswordHelper.compare(
  loginDto.password,
  user.hashedPassword,
);

if (!isValid) {
  throw new UnauthorizedException('Invalid credentials');
}
```

---

#### hashSync

Creates password hash synchronously (blocking operation).

```typescript
static hashSync(password: string, saltRounds?: number): string
```

**Warning:** Synchronous hashing blocks the event loop. Use async version in production.

**Example:**

```typescript
const hashed = PasswordHelper.hashSync('myPassword123');
```

---

#### compareSync

Compares password with hash synchronously (blocking operation).

```typescript
static compareSync(password: string, hashedPassword: string): boolean
```

**Example:**

```typescript
const isValid = PasswordHelper.compareSync('myPassword123', hashedPassword);
```

---

#### saltSync

Generates salt synchronously.

```typescript
static saltSync(rounds?: number): string
```

**Example:**

```typescript
const salt = PasswordHelper.saltSync(12);
const hash = bcrypt.hashSync(password, salt);
```

---

### Complete Example

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PasswordHelper } from '@augustopreis/nestjs-utils';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {
    // Configure salt rounds for the application
    PasswordHelper.setSaltRounds(12);
  }

  async register(email: string, password: string) {
    // Hash password before storing
    const hashedPassword = await PasswordHelper.hash(password);

    return this.usersService.create({
      email,
      password: hashedPassword,
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare provided password with stored hash
    const isValid = await PasswordHelper.compare(password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
```

---

## StringHelper

Helper class for advanced string manipulation.

### Import

```typescript
import { StringHelper } from '@augustopreis/nestjs-utils';
```

### Methods

#### capitalize

Converts first letter to uppercase.

```typescript
static capitalize(str: string, allWords?: boolean, lowercaseRest?: boolean): string
```

**Parameters:**

- `str`: String to capitalize
- `allWords`: If true, capitalizes all words (default: false)
- `lowercaseRest`: If true, lowercases the rest (default: true)

**Examples:**

```typescript
StringHelper.capitalize('hello world'); // 'Hello world'
StringHelper.capitalize('hello world', true); // 'Hello World'
StringHelper.capitalize('HELLO', false, false); // 'HELLO'
```

---

#### camelCase

Converts string to camelCase.

```typescript
static camelCase(str: string): string
```

**Example:**

```typescript
StringHelper.camelCase('hello-world'); // 'helloWorld'
StringHelper.camelCase('Hello World'); // 'helloWorld'
StringHelper.camelCase('hello_world'); // 'helloWorld'
```

---

#### snakeCase

Converts string to snake_case.

```typescript
static snakeCase(str: string): string
```

**Example:**

```typescript
StringHelper.snakeCase('helloWorld'); // 'hello_world'
StringHelper.snakeCase('Hello World'); // 'hello_world'
StringHelper.snakeCase('hello-world'); // 'hello_world'
```

---

#### kebabCase

Converts string to kebab-case.

```typescript
static kebabCase(str: string): string
```

**Example:**

```typescript
StringHelper.kebabCase('helloWorld'); // 'hello-world'
StringHelper.kebabCase('Hello World'); // 'hello-world'
StringHelper.kebabCase('hello_world'); // 'hello-world'
```

---

#### truncate

Truncates string adding suffix.

```typescript
static truncate(str: string, length: number, suffix?: string): string
```

**Parameters:**

- `str`: String to truncate
- `length`: Maximum length
- `suffix`: Suffix to add (default: '...')

**Example:**

```typescript
StringHelper.truncate('This is a long text', 10); // 'This is...'
StringHelper.truncate('Short', 10); // 'Short'
StringHelper.truncate('Long text', 8, '…'); // 'Long …'
```

---

#### removeAccents

Removes accents from string.

```typescript
static removeAccents(str: string): string
```

**Example:**

```typescript
StringHelper.removeAccents('José'); // 'Jose'
StringHelper.removeAccents('São Paulo'); // 'Sao Paulo'
StringHelper.removeAccents('Ação'); // 'Acao'
```

---

#### randomString

Generates random string.

```typescript
static randomString(length: number, charset?: string): string
```

**Parameters:**

- `length`: Length of string to generate
- `charset`: Character set to use (default: alphanumeric)

**Example:**

```typescript
StringHelper.randomString(10); // 'aB3xK9pL2m'
StringHelper.randomString(6, '0123456789'); // '485792'
StringHelper.randomString(8, 'ABCDEF'); // 'CDAEBFDC'
```

---

#### mask

Masks string leaving only some characters visible.

```typescript
static mask(str: string, maskChar?: string, visibleChars?: number): string
```

**Parameters:**

- `str`: String to mask
- `maskChar`: Character to use for masking (default: '\*')
- `visibleChars`: Number of visible characters at the end (default: 4)

**Example:**

```typescript
StringHelper.mask('12345678900'); // '*******8900'
StringHelper.mask('12345678900', '#', 3); // '########900'
StringHelper.mask('secret@email.com', '*', 10); // '********il.com'
```

---

#### isEmpty

Checks if string is empty (null, undefined or only spaces).

```typescript
static isEmpty(str: string | null | undefined): boolean
```

**Example:**

```typescript
StringHelper.isEmpty(''); // true
StringHelper.isEmpty('   '); // true
StringHelper.isEmpty(null); // true
StringHelper.isEmpty('text'); // false
```

---

#### countOccurrences

Counts occurrences of substring in string.

```typescript
static countOccurrences(str: string, search: string, caseSensitive?: boolean): number
```

**Parameters:**

- `str`: String to search in
- `search`: Substring to count
- `caseSensitive`: Case sensitive search (default: true)

**Example:**

```typescript
StringHelper.countOccurrences('hello world hello', 'hello'); // 2
StringHelper.countOccurrences('Hello World', 'hello', false); // 1
StringHelper.countOccurrences('test test TEST', 'test'); // 2
```

---

### Complete Examples

```typescript
// URL slug generation
const title = 'My Awesome Blog Post!';
const slug = StringHelper.kebabCase(
  StringHelper.removeAccents(title.toLowerCase()),
); // 'my-awesome-blog-post!'

// Username generation
const email = 'John.Doe@example.com';
const username = StringHelper.camelCase(email.split('@')[0]); // 'johnDoe'

// Display name formatting
const rawName = 'JOHN DOE';
const displayName = StringHelper.capitalize(rawName, true); // 'John Doe'

// Sensitive data masking
const cpf = '12345678900';
const maskedCpf = StringHelper.mask(cpf, '*', 3); // '********900'

// Text preview
const content = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
const preview = StringHelper.truncate(content, 30); // 'Lorem ipsum dolor sit amet...'
```

---

## ArrayHelper

Helper class for array manipulation and operations.

### Import

```typescript
import { ArrayHelper } from '@augustopreis/nestjs-utils';
```

### Methods

#### isEmpty

Checks if array is empty.

```typescript
static isEmpty(arr: unknown): boolean
```

**Example:**

```typescript
ArrayHelper.isEmpty([]); // true
ArrayHelper.isEmpty(null); // true
ArrayHelper.isEmpty([1, 2]); // false
```

---

#### isNotEmpty

Checks if it's an array and not empty (type guard).

```typescript
static isNotEmpty<T>(arr: unknown): arr is T[]
```

**Example:**

```typescript
if (ArrayHelper.isNotEmpty(items)) {
  // TypeScript knows items is T[]
  items.forEach((item) => console.log(item));
}
```

---

#### unique

Removes duplicates from array.

```typescript
static unique<T>(arr: T[]): T[]
```

**Example:**

```typescript
ArrayHelper.unique([1, 2, 2, 3, 3, 3]); // [1, 2, 3]
ArrayHelper.unique(['a', 'b', 'a', 'c']); // ['a', 'b', 'c']
```

---

#### groupBy

Groups array by key.

```typescript
static groupBy<T>(arr: T[], key: keyof T): Record<string, T[]>
```

**Example:**

```typescript
const users = [
  { name: 'John', role: 'admin' },
  { name: 'Jane', role: 'user' },
  { name: 'Bob', role: 'admin' },
];

ArrayHelper.groupBy(users, 'role');
// {
//   admin: [{ name: 'John', role: 'admin' }, { name: 'Bob', role: 'admin' }],
//   user: [{ name: 'Jane', role: 'user' }]
// }
```

---

#### chunk

Splits array into chunks.

```typescript
static chunk<T>(arr: T[], size: number): T[][]
```

**Example:**

```typescript
ArrayHelper.chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
ArrayHelper.chunk(['a', 'b', 'c', 'd', 'e', 'f'], 3); // [['a', 'b', 'c'], ['d', 'e', 'f']]
```

---

#### shuffle

Shuffles array randomly.

```typescript
static shuffle<T>(arr: T[]): T[]
```

**Example:**

```typescript
ArrayHelper.shuffle([1, 2, 3, 4, 5]); // [3, 1, 5, 2, 4] (random order)
```

---

#### difference

Returns elements in first array but not in second.

```typescript
static difference<T>(arr1: T[], arr2: T[]): T[]
```

**Example:**

```typescript
ArrayHelper.difference([1, 2, 3, 4], [2, 4, 6]); // [1, 3]
ArrayHelper.difference(['a', 'b', 'c'], ['b', 'd']); // ['a', 'c']
```

---

#### intersection

Returns elements present in both arrays.

```typescript
static intersection<T>(arr1: T[], arr2: T[]): T[]
```

**Example:**

```typescript
ArrayHelper.intersection([1, 2, 3, 4], [2, 4, 6]); // [2, 4]
ArrayHelper.intersection(['a', 'b', 'c'], ['b', 'c', 'd']); // ['b', 'c']
```

---

#### union

Returns union of multiple arrays (unique elements from all).

```typescript
static union<T>(...arrays: T[][]): T[]
```

**Example:**

```typescript
ArrayHelper.union([1, 2], [2, 3], [3, 4]); // [1, 2, 3, 4]
ArrayHelper.union(['a', 'b'], ['b', 'c'], ['c', 'd']); // ['a', 'b', 'c', 'd']
```

---

#### compact

Removes null and undefined from array.

```typescript
static compact<T>(arr: (T | null | undefined)[]): T[]
```

**Example:**

```typescript
ArrayHelper.compact([1, null, 2, undefined, 3]); // [1, 2, 3]
ArrayHelper.compact(['a', null, 'b', undefined, 'c']); // ['a', 'b', 'c']
```

---

### Complete Examples

```typescript
// Pagination helper
const items = [...Array(100)].map((_, i) => i + 1);
const pageSize = 10;
const pages = ArrayHelper.chunk(items, pageSize);
console.log(pages[0]); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Data grouping
const orders = [
  { id: 1, status: 'pending' },
  { id: 2, status: 'completed' },
  { id: 3, status: 'pending' },
];
const grouped = ArrayHelper.groupBy(orders, 'status');
// { pending: [...], completed: [...] }

// Set operations
const userPermissions = ['read', 'write', 'delete'];
const requiredPermissions = ['read', 'write'];
const hasAllPermissions =
  ArrayHelper.intersection(userPermissions, requiredPermissions).length ===
  requiredPermissions.length;

// Clean data
const userIds = [1, null, 2, undefined, 3, null];
const validIds = ArrayHelper.compact(userIds); // [1, 2, 3]
```

---

## NumberHelper

Helper class for number manipulation and formatting.

### Import

```typescript
import { NumberHelper } from '@augustopreis/nestjs-utils';
```

### Methods

#### isNumeric

Checks if value is numeric.

```typescript
static isNumeric(value: unknown): boolean
```

**Example:**

```typescript
NumberHelper.isNumeric(123); // true
NumberHelper.isNumeric('123'); // true
NumberHelper.isNumeric('123.45'); // true
NumberHelper.isNumeric('abc'); // false
```

---

#### toNumber

Converts to number with fallback.

```typescript
static toNumber(value: unknown, fallback?: number): number
```

**Example:**

```typescript
NumberHelper.toNumber('123'); // 123
NumberHelper.toNumber('invalid'); // 0
NumberHelper.toNumber('invalid', -1); // -1
NumberHelper.toNumber(null, 10); // 10
```

---

#### round

Rounds number to specified decimals.

```typescript
static round(num: number, decimals?: number): number
```

**Example:**

```typescript
NumberHelper.round(3.14159); // 3
NumberHelper.round(3.14159, 2); // 3.14
NumberHelper.round(3.14159, 4); // 3.1416
```

---

#### clamp

Limits number to range.

```typescript
static clamp(num: number, min: number, max: number): number
```

**Example:**

```typescript
NumberHelper.clamp(15, 0, 10); // 10
NumberHelper.clamp(-5, 0, 10); // 0
NumberHelper.clamp(5, 0, 10); // 5
```

---

#### random

Generates random number in range.

```typescript
static random(min: number, max: number): number
```

**Example:**

```typescript
NumberHelper.random(1, 100); // Random between 1 and 100
NumberHelper.random(0, 1); // 0 or 1
```

---

#### percentage

Calculates percentage.

```typescript
static percentage(value: number, total: number): number
```

**Example:**

```typescript
NumberHelper.percentage(25, 100); // 25
NumberHelper.percentage(1, 4); // 25
NumberHelper.percentage(3, 10); // 30
```

---

#### formatCurrency

Formats currency.

```typescript
static formatCurrency(value: number, locale?: string, currency?: string): string
```

**Parameters:**

- `value`: Number to format
- `locale`: Locale code (default: 'pt-BR')
- `currency`: Currency code (default: 'BRL')

**Example:**

```typescript
NumberHelper.formatCurrency(1234.56); // 'R$ 1.234,56'
NumberHelper.formatCurrency(1234.56, 'en-US', 'USD'); // '$1,234.56'
NumberHelper.formatCurrency(1234.56, 'en-GB', 'EUR'); // '€1,234.56'
```

---

### Complete Examples

```typescript
// Price calculation
const price = 19.999;
const roundedPrice = NumberHelper.round(price, 2); // 19.00

// Stock validation
const quantity = NumberHelper.clamp(userInput, 1, 100);

// Discount calculation
const originalPrice = 100;
const discountedPrice = 75;
const discount = NumberHelper.percentage(
  originalPrice - discountedPrice,
  originalPrice,
); // 25%

// Random ID generation
const randomId = NumberHelper.random(1000, 9999);

// Currency formatting for invoice
const total = 1234.56;
const formattedTotal = NumberHelper.formatCurrency(total);
```

---

## ObjectHelper

Helper class for object manipulation and operations.

### Import

```typescript
import { ObjectHelper } from '@augustopreis/nestjs-utils';
```

### Methods

#### deepClone

Creates deep clone of object.

```typescript
static deepClone<T>(obj: T): T
```

**Example:**

```typescript
const original = { a: 1, b: { c: 2 } };
const clone = ObjectHelper.deepClone(original);
clone.b.c = 3;
console.log(original.b.c); // 2 (unchanged)
```

---

#### deepMerge

Deep merges multiple objects.

```typescript
static deepMerge<T>(...objects: Partial<T>[]): Partial<T>
```

**Example:**

```typescript
const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { b: { d: 3 }, e: 4 };
const merged = ObjectHelper.deepMerge(obj1, obj2);
// { a: 1, b: { c: 2, d: 3 }, e: 4 }
```

---

#### pick

Selects only specified keys.

```typescript
static pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>
```

**Example:**

```typescript
const user = {
  id: 1,
  name: 'John',
  email: 'john@example.com',
  password: 'secret',
};
const publicUser = ObjectHelper.pick(user, ['id', 'name', 'email']);
// { id: 1, name: 'John', email: 'john@example.com' }
```

---

#### omit

Excludes specified keys.

```typescript
static omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>
```

**Example:**

```typescript
const user = {
  id: 1,
  name: 'John',
  email: 'john@example.com',
  password: 'secret',
};
const safeUser = ObjectHelper.omit(user, ['password']);
// { id: 1, name: 'John', email: 'john@example.com' }
```

---

#### isEmpty

Checks if object is empty.

```typescript
static isEmpty(obj: unknown): boolean
```

**Example:**

```typescript
ObjectHelper.isEmpty({}); // true
ObjectHelper.isEmpty(null); // true
ObjectHelper.isEmpty([]); // true
ObjectHelper.isEmpty({ a: 1 }); // false
```

---

#### isEqual

Deep comparison of objects.

```typescript
static isEqual(obj1: object, obj2: object): boolean
```

**Example:**

```typescript
ObjectHelper.isEqual({ a: 1, b: 2 }, { a: 1, b: 2 }); // true
ObjectHelper.isEqual({ a: 1, b: { c: 3 } }, { a: 1, b: { c: 3 } }); // true
ObjectHelper.isEqual({ a: 1 }, { a: 2 }); // false
```

---

#### flattenObject

Flattens nested object.

```typescript
static flattenObject(obj: object, separator?: string): Record<string, unknown>
```

**Example:**

```typescript
const nested = { a: { b: { c: 1 } }, d: 2 };
ObjectHelper.flattenObject(nested);
// { 'a.b.c': 1, d: 2 }

ObjectHelper.flattenObject(nested, '_');
// { 'a_b_c': 1, d: 2 }
```

---

#### unflattenObject

Unflattens object.

```typescript
static unflattenObject(obj: Record<string, unknown>, separator?: string): object
```

**Example:**

```typescript
const flat = { 'a.b.c': 1, d: 2 };
ObjectHelper.unflattenObject(flat);
// { a: { b: { c: 1 } }, d: 2 }
```

---

#### isObject

Checks if it's a plain object.

```typescript
static isObject(obj: unknown): obj is Record<string, unknown>
```

**Example:**

```typescript
ObjectHelper.isObject({}); // true
ObjectHelper.isObject({ a: 1 }); // true
ObjectHelper.isObject([]); // false
ObjectHelper.isObject(null); // false
```

---

### Complete Examples

```typescript
// API response sanitization
const user = await userRepository.findOne(id);
const response = ObjectHelper.omit(user, ['password', 'salt', 'refreshToken']);

// Configuration merging
const defaultConfig = {
  timeout: 5000,
  retries: 3,
  headers: { 'Content-Type': 'application/json' },
};
const userConfig = {
  timeout: 10000,
  headers: { Authorization: 'Bearer token' },
};
const finalConfig = ObjectHelper.deepMerge(defaultConfig, userConfig);
// { timeout: 10000, retries: 3, headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer token' } }

// Form data handling
const formData = {
  'user.name': 'John',
  'user.email': 'john@example.com',
  'settings.theme': 'dark',
};
const structured = ObjectHelper.unflattenObject(formData);
// { user: { name: 'John', email: 'john@example.com' }, settings: { theme: 'dark' } }

// Cache key generation
const query = { userId: 1, status: 'active', sort: 'createdAt' };
const flatQuery = ObjectHelper.flattenObject(query);
const cacheKey = Object.entries(flatQuery).sort().join(':');
```
