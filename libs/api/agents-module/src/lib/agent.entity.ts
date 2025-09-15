import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'agents' })
export class Agent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 64 })
  symbol!: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  faction?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string | null;

  // removed accountTokenHash (M2M token is global, no per-token scoping needed)

  @Column({ type: 'text', nullable: true })
  tokenEncoded?: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}



