import { Property } from '../decorators/property/property.decorator';
import { PropertyType } from '../decorators/property/enums/property-type.enum';
import { EOrder } from '../enums/order.enum';

/**
 * Base DTO for paginated listing filters
 *
 * Provides standard fields for pagination and sorting,
 * used in listing endpoints.
 */
export class FindManyFiltersDTO {
  /**
   * Records per page limit
   */
  @Property({
    type: PropertyType.NUMBER,
    name: 'Records per page',
    description: 'Number of records per page',
    required: false,
    defaultValue: 10,
    validation: {
      min: 1,
      integerOnly: true,
    },
  })
  public take: number = 10;

  /**
   * Page number
   */
  @Property({
    type: PropertyType.NUMBER,
    name: 'Page number',
    description: 'Page number',
    required: false,
    defaultValue: 1,
    validation: {
      min: 1,
      integerOnly: true,
    },
  })
  public page: number = 1;

  /**
   * Sort field
   */
  @Property({
    type: PropertyType.STRING,
    name: 'Sort field',
    description: 'Field for sorting',
    required: false,
    example: 'createdAt',
  })
  public sort?: string;

  /**
   * Sort direction
   */
  @Property({
    type: PropertyType.ENUM,
    name: 'Sort direction',
    description: 'Sort direction',
    required: false,
    defaultValue: EOrder.DESC,
    enumValues: EOrder,
  })
  public order: EOrder = EOrder.DESC;

  /**
   * Calculates the offset for the query
   */
  public getOffset(): number {
    const page = Math.max(1, this.page || 1);
    const take = Math.max(1, this.take || 10);

    return (page - 1) * take;
  }
}
