import {
	BaseEntity,
	Column,
	Entity,
	PrimaryGeneratedColumn,
	ManyToMany,
	ManyToOne,
	JoinTable,
	OneToMany,
	CreateDateColumn,
	UpdateDateColumn,
	DeleteDateColumn,
	OneToOne,
	JoinColumn,
} from 'typeorm'
// import { Group } from './Group.entity'
import { IsBoolean, IsEmail, IsEnum, IsString, Length } from 'class-validator'
import { Note } from './Note.entity'

@Entity('users')
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id?: number

	@Column()
	@Length(3)
	@IsString()
	name: string

	@Column({ default: '' })
	@IsString()
	profile_picture?: string


    @ManyToMany(() => Note, (note) => note.users)
	@JoinTable(
			{
			name: 'user_notes',
		}
		)
    notes: Note[]

	@CreateDateColumn()
	created_at?: Date

	@UpdateDateColumn()
	updated_at?: Date

	@DeleteDateColumn()
	deleted_at?: Date
}
