import { INoteInterface } from './INote.interface'
export interface IMediaFileInterface {
	id?: number
	name?: string
	description: string
	price: string
	is_Recurring?: boolean
	transportationId?: string
	noteId?: string

}
