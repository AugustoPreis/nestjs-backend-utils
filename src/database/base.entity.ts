import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
} from 'typeorm';

import { EStatus } from '../enums/status.enum';

/**
 * Base entity with common fields
 *
 * Provides standard fields for all entities, including
 * ID, status, timestamps and soft delete.
 */
@Entity()
export abstract class BaseEntity {
  /**
   * Auto-incremental ID
   */
  @PrimaryGeneratedColumn()
  public id!: number;

  /**
   * Record status
   */
  @Column({
    type: 'enum',
    enum: EStatus,
    default: EStatus.ACTIVE,
  })
  public status!: EStatus;

  /**
   * Creation date
   */
  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date;

  /**
   * Last update date
   */
  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date;

  /**
   * Soft delete date
   */
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  public deletedAt?: Date | null;

  /**
   * Checks if the record is active
   */
  public isActive(): boolean {
    return this.status === EStatus.ACTIVE && !this.deletedAt;
  }

  /**
   * Checks if the record is deleted
   */
  public isDeleted(): boolean {
    return this.status === EStatus.DELETED || !!this.deletedAt;
  }

  /**
   * Checks if the record is inactive
   */
  public isInactive(): boolean {
    return this.status === EStatus.INACTIVE;
  }

  /**
   * Activates the record
   */
  public activate(): void {
    this.status = EStatus.ACTIVE;
  }

  /**
   * Deactivates the record
   */
  public deactivate(): void {
    this.status = EStatus.INACTIVE;
  }

  public restore(status: EStatus = EStatus.ACTIVE): void {
    this.status = status;
    this.deletedAt = null;
  }

  /**
   * Marks the record as deleted (soft delete)
   */
  public softDelete(): void {
    this.status = EStatus.DELETED;
    this.deletedAt = new Date();
  }
}
