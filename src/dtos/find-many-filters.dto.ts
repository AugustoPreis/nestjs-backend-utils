import { Property, PropertyType } from '@decorators';
import { EOrder } from '@enums';

/**
 * DTO base para filtros de listagem paginada
 *
 * Fornece campos padrão para paginação e ordenação,
 * utilizados em endpoints de listagem.
 */
export class FindManyFiltersDTO {
  /**
   * Limite de registros por página
   */
  @Property({
    type: PropertyType.NUMBER,
    name: 'Registros por página',
    description: 'Número de registros por página',
    required: false,
    defaultValue: 10,
    validation: {
      min: 1,
      integerOnly: true,
    },
  })
  public take: number = 10;

  /**
   * Número da página
   */
  @Property({
    type: PropertyType.NUMBER,
    name: 'Número da página',
    description: 'Número da página',
    required: false,
    defaultValue: 1,
    validation: {
      min: 1,
      integerOnly: true,
    },
  })
  public page: number = 1;

  /**
   * Campo de ordenação
   */
  @Property({
    type: PropertyType.STRING,
    name: 'Campo para ordenação',
    description: 'Campo para ordenação',
    required: false,
    example: 'createdAt',
  })
  public sort?: string;

  /**
   * Direção da ordenação
   */
  @Property({
    type: PropertyType.ENUM,
    name: 'Direção da ordenação',
    description: 'Direção da ordenação',
    required: false,
    defaultValue: EOrder.DESC,
    enumValues: EOrder,
  })
  public order: EOrder = EOrder.DESC;

  /**
   * Calcula o offset para a query
   */
  public getOffset(): number {
    const page = Math.max(1, this.page || 1);
    const take = Math.max(1, this.take || 10);

    return (page - 1) * take;
  }
}
