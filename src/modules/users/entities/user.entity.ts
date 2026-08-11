import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

export type UserRole = 'admin' | 'secretaria' | 'tesoureiro' | 'visualizador'

@Entity()
export class User {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column({ type: 'varchar' })
  role: UserRole

  @Column({ default: true })
  status: boolean

  @CreateDateColumn()
  created_at: Date

  constructor(
    props: {
      name: string
      email: string
      password: string
      role: UserRole
      status: boolean
    },
    id?: string,
  ) {
    Object.assign(this, props)
    this.id = id ?? uuidv4()
  }
}
