import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity() // Marks this class as a database entity
export class User {
  @PrimaryGeneratedColumn() // Auto-incremented primary key
  id: number;

  @Column({
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({
    length: 50,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
    default: null,
  })
  gender: 'male' | 'female' | null;
  @Column({
    type: 'boolean',
    default: false,
    nullable: false,
  })
  isMarried: boolean;
}
