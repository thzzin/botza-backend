import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn  } from 'typeorm';
import { Admin } from 'src/admin/admin.entity';

@Entity()
export class Whatsapp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  accessToken: string;

  @Column({ type: 'varchar', length: 15 })
  numero: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  idNumero: string;

  @Column({ type: 'text', nullable: true })
  profilePicture: string;

  @Column({ type: 'text', nullable: true })
  about: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'text', nullable: true })
  imageUrl: string;

   // Relacionamento Many-to-One com Admin
  @ManyToOne(() => Admin, admin => admin.whatsapps) // Relacionando com Admin
  @JoinColumn({ name: 'adminId' }) // Nome do campo de chave estrangeira
  admin: Admin; // A relação com Admin
}
