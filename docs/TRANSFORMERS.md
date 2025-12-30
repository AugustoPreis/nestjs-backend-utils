# Transformers

Complete guide to all transformer decorators available in this package.

## Table of Contents

- [String Transformers](#string-transformers)
  - [Trim](#trim)
  - [ToLowerCase](#tolowercase)
  - [ToUpperCase](#touppercase)
- [Type Conversion Transformers](#type-conversion-transformers)
  - [StringToNumber](#stringtonumber)
  - [StringToDate](#stringtodate)
  - [StringToBoolean](#stringtoboolean)
  - [StringToJson](#stringtojson)

---

## String Transformers

### Trim

Removes whitespace from the beginning and end of a string.

#### Import

```typescript
import { Trim } from 'nestjs-backend-utils';
```

#### Signature

```typescript
function Trim(): PropertyDecorator;
```

#### Examples

```typescript
export class CreateUserDTO {
  @Trim()
  name: string;
  // Input: "  John Doe  "
  // Output: "John Doe"

  @Trim()
  email: string;
  // Input: " user@example.com "
  // Output: "user@example.com"
}
```

---

### ToLowerCase

Converts strings to lowercase.

#### Import

```typescript
import { ToLowerCase } from 'nestjs-backend-utils';
```

#### Signature

```typescript
function ToLowerCase(): PropertyDecorator;
```

#### Examples

```typescript
export class CreateUserDTO {
  @ToLowerCase()
  email: string;
  // Input: "USER@EXAMPLE.COM"
  // Output: "user@example.com"

  @ToLowerCase()
  username: string;
  // Input: "JohnDoe"
  // Output: "johndoe"
}
```

#### Common Use Cases

```typescript
// Email normalization
export class LoginDTO {
  @Trim()
  @ToLowerCase()
  email: string;
}

// Username normalization
export class RegisterDTO {
  @Trim()
  @ToLowerCase()
  username: string;
}
```

---

### ToUpperCase

Converts strings to uppercase.

#### Import

```typescript
import { ToUpperCase } from 'nestjs-backend-utils';
```

#### Signature

```typescript
function ToUpperCase(): PropertyDecorator;
```

#### Examples

```typescript
export class CreateProductDTO {
  @ToUpperCase()
  code: string;
  // Input: "abc123"
  // Output: "ABC123"

  @ToUpperCase()
  category: string;
  // Input: "electronics"
  // Output: "ELECTRONICS"
}
```

#### Common Use Cases

```typescript
// Product code normalization
export class CreateProductDTO {
  @Trim()
  @ToUpperCase()
  sku: string;
}

// Status normalization
export class UpdateOrderDTO {
  @ToUpperCase()
  status: string;
}
```

---

## Type Conversion Transformers

### StringToNumber

Converts string values to numbers.

#### Import

```typescript
import { StringToNumber } from 'nestjs-backend-utils';
```

#### Signature

```typescript
function StringToNumber(options?: StringToNumberOptions): PropertyDecorator;
```

#### Parameters

```typescript
interface StringToNumberOptions {
  radix?: number; // Base for parsing (e.g., 16 for hex)
  fallback?: number; // Value to return if parsing fails
}
```

#### Examples

##### Basic Usage

```typescript
export class CreateProductDTO {
  @StringToNumber()
  price: number;
  // Input: "19.99"
  // Output: 19.99

  @StringToNumber()
  quantity: number;
  // Input: "100"
  // Output: 100
}
```

##### With Fallback

```typescript
export class UpdateProductDTO {
  @StringToNumber({ fallback: 0 })
  stock: number;
  // Input: "invalid"
  // Output: 0

  @StringToNumber({ fallback: 1 })
  quantity: number;
  // Input: "not a number"
  // Output: 1
}
```

##### With Radix (Hexadecimal)

```typescript
export class ColorDTO {
  @StringToNumber({ radix: 16 })
  hexValue: number;
  // Input: "FF"
  // Output: 255

  @StringToNumber({ radix: 16 })
  colorCode: number;
  // Input: "A0"
  // Output: 160
}
```

#### Common Use Cases

```typescript
// Query parameters from URL
export class SearchDTO {
  @StringToNumber({ fallback: 1 })
  page: number;

  @StringToNumber({ fallback: 10 })
  limit: number;

  @StringToNumber({ fallback: 0 })
  minPrice: number;

  @StringToNumber({ fallback: 999999 })
  maxPrice: number;
}
```

---

### StringToDate

Converts string values to Date objects.

#### Import

```typescript
import { StringToDate } from 'nestjs-backend-utils';
```

#### Signature

```typescript
function StringToDate(options?: StringToDateOptions): PropertyDecorator;
```

#### Parameters

```typescript
interface StringToDateOptions {
  format?: string; // Date format (uses date-fns format string)
  // Use 'ISO' or omit for ISO 8601 dates
}
```

#### Examples

##### ISO Format (Default)

```typescript
export class CreateEventDTO {
  @StringToDate()
  startDate: Date;
  // Input: "2024-01-15T10:00:00Z"
  // Output: Date object

  @StringToDate()
  endDate: Date;
  // Input: "2024-01-15T18:00:00Z"
  // Output: Date object
}
```

##### Custom Format

```typescript
export class CreateAppointmentDTO {
  @StringToDate({ format: 'dd/MM/yyyy' })
  date: Date;
  // Input: "15/01/2024"
  // Output: Date object for January 15, 2024

  @StringToDate({ format: 'yyyy-MM-dd HH:mm' })
  scheduledAt: Date;
  // Input: "2024-01-15 14:30"
  // Output: Date object for January 15, 2024 at 14:30
}
```

#### Common Formats

```typescript
// Brazilian format
@StringToDate({ format: 'dd/MM/yyyy' })
birthDate: Date;

// US format
@StringToDate({ format: 'MM/dd/yyyy' })
startDate: Date;

// ISO date only
@StringToDate({ format: 'yyyy-MM-dd' })
date: Date;

// Date with time
@StringToDate({ format: 'dd/MM/yyyy HH:mm:ss' })
timestamp: Date;

// Time only
@StringToDate({ format: 'HH:mm' })
time: Date;
```

#### Common Use Cases

```typescript
// Event scheduling
export class CreateEventDTO {
  @StringToDate({ format: 'yyyy-MM-dd' })
  eventDate: Date;

  @StringToDate({ format: 'HH:mm' })
  startTime: Date;

  @StringToDate({ format: 'HH:mm' })
  endTime: Date;
}

// User registration
export class RegisterDTO {
  @StringToDate({ format: 'dd/MM/yyyy' })
  birthDate: Date;
}

// Report filters
export class ReportFiltersDTO {
  @StringToDate()
  startDate: Date;

  @StringToDate()
  endDate: Date;
}
```

---

### StringToBoolean

Converts string values to boolean.

#### Import

```typescript
import { StringToBoolean } from 'nestjs-backend-utils';
```

#### Signature

```typescript
function StringToBoolean(options?: StringToBooleanOptions): PropertyDecorator;
```

#### Parameters

```typescript
interface StringToBooleanOptions {
  trueValues?: string[]; // Values considered as true
  falseValues?: string[]; // Values considered as false
  caseInsensitive?: boolean; // Case insensitive matching (default: true)
}
```

#### Default Values

- **trueValues**: `['true', '1', 'yes', 'on']`
- **falseValues**: `['false', '0', 'no', 'off']`
- **caseInsensitive**: `true`

#### Examples

##### Basic Usage

```typescript
export class UpdateSettingsDTO {
  @StringToBoolean()
  enabled: boolean;
  // Input: "true" or "1" or "yes" or "on"
  // Output: true
  // Input: "false" or "0" or "no" or "off"
  // Output: false

  @StringToBoolean()
  notifications: boolean;
  // Input: "TRUE" (case insensitive)
  // Output: true
}
```

##### Case Sensitive

```typescript
export class StrictFlagsDTO {
  @StringToBoolean({ caseInsensitive: false })
  strictFlag: boolean;
  // Input: "true"
  // Output: true
  // Input: "TRUE"
  // Output: original value (no match)
}
```

##### Custom True/False Values

```typescript
export class ConfirmationDTO {
  @StringToBoolean({
    trueValues: ['yes', 'y', 'sim', 's', '1'],
    falseValues: ['no', 'n', 'não', 'nao', '0'],
  })
  confirmed: boolean;
  // Input: "sim" or "s"
  // Output: true
  // Input: "não" or "nao"
  // Output: false
}
```

#### Common Use Cases

```typescript
// Query parameters
export class SearchDTO {
  @StringToBoolean()
  includeInactive: boolean;

  @StringToBoolean()
  sortDescending: boolean;
}

// Feature flags
export class FeatureFlagsDTO {
  @StringToBoolean()
  enableBetaFeatures: boolean;

  @StringToBoolean()
  darkMode: boolean;
}

// Form data
export class UserPreferencesDTO {
  @StringToBoolean()
  emailNotifications: boolean;

  @StringToBoolean()
  smsNotifications: boolean;

  @StringToBoolean()
  termsAccepted: boolean;
}
```

---

### StringToJson

Converts JSON string values to objects.

#### Import

```typescript
import { StringToJson } from 'nestjs-backend-utils';
```

#### Signature

```typescript
function StringToJson(options?: StringToJsonOptions): PropertyDecorator;
```

#### Parameters

```typescript
interface StringToJsonOptions {
  fallback?: any; // Value to return if parsing fails
  reviver?: (key: string, value: any) => any; // Custom reviver function
}
```

#### Examples

##### Basic Usage

```typescript
export class CreateOrderDTO {
  @StringToJson()
  metadata: object;
  // Input: '{"key":"value","count":10}'
  // Output: { key: 'value', count: 10 }

  @StringToJson()
  config: Record<string, any>;
  // Input: '{"theme":"dark","lang":"en"}'
  // Output: { theme: 'dark', lang: 'en' }
}
```

##### With Fallback

```typescript
export class UpdateSettingsDTO {
  @StringToJson({ fallback: {} })
  preferences: object;
  // Input: "invalid json"
  // Output: {}

  @StringToJson({ fallback: [] })
  tags: any[];
  // Input: "not valid"
  // Output: []
}
```

##### With Custom Reviver

```typescript
export class EventDTO {
  @StringToJson({
    reviver: (key, value) => {
      // Convert date strings to Date objects
      if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
        return new Date(value);
      }
      return value;
    },
  })
  eventData: object;
  // Input: '{"date":"2024-01-15","name":"Event"}'
  // Output: { date: Date object, name: 'Event' }
}
```

#### Common Use Cases

```typescript
// API Integration
export class WebhookDTO {
  @StringToJson({ fallback: {} })
  payload: Record<string, any>;
}

// Dynamic Configuration
export class ConfigurationDTO {
  @StringToJson({ fallback: {} })
  settings: object;

  @StringToJson({ fallback: [] })
  features: string[];
}

// Custom Fields
export class ProductDTO {
  @StringToJson({ fallback: {} })
  specifications: Record<string, any>;

  @StringToJson({ fallback: {} })
  customFields: object;
}

// Form Data
export class CreateFormDTO {
  @StringToJson({ fallback: {} })
  formData: Record<string, any>;
}
```

---

## Combining Transformers

You can combine multiple transformers on the same property:

```typescript
export class CreateUserDTO {
  // Trim whitespace, then convert to lowercase
  @Trim()
  @ToLowerCase()
  email: string;

  // Trim whitespace, then convert to uppercase
  @Trim()
  @ToUpperCase()
  productCode: string;
}
```

## Using with @Property Decorator

Transformers can also be used through the `@Property` decorator:

```typescript
import { Property, PropertyType } from 'nestjs-backend-utils';

export class CreateUserDTO {
  @Property({
    type: PropertyType.STRING,
    name: 'Email',
    transform: {
      trim: true,
      toLowerCase: true,
    },
  })
  email: string;

  @Property({
    type: PropertyType.STRING,
    name: 'Username',
    transform: {
      trim: true,
      toLowerCase: true,
    },
  })
  username: string;
}
```
