import { Request, Response, RequestHandler } from 'express'
import { Note } from '../../entities/Note.entity'
import { User } from '../../entities/User.entity'
import { AppDataSource } from '../../config/database/data-source'
import { sendNotFoundResponse } from '../../helpers/responses/404.response'
import { noteValidation } from '../../helpers/validations/note.validation'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
// import { getUserIdFromToken } from '../../helpers/functions/getUserIdFromToken'
import { sendSuccessResponse } from '../../helpers/responses/sendSuccessResponse'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { StatusCodes } from '../../helpers/constants/statusCodes'
import { INoteInterface } from '../../helpers/interfaces/INote.interface'
import { NoteType } from '../../entities/NoteType.entity'

const listCompanies = async (req: Request, res: Response) => {
	try {
		const notes: Note[] = await AppDataSource.manager.find<Note>(Note, {
			relations: ['user'],
		})
		sendSuccessResponse<Note[]>(res, notes)
	} catch (e: any) {
		sendErrorResponse(formatValidationErrors(e), res, StatusCodes.BAD_REQUEST)
	}
}
const showNote = async (req: Request, res: Response) => {
	const id: number | undefined = +req.params.id
	try {
		const note = await AppDataSource.getRepository(Note).findOneOrFail({
			where: {
				id: parseInt(req.params.id),
			},
			relations: ['user', 'programs', 'programs.cycles', 'reviews'],
		})

		sendSuccessResponse<Note>(res, note)
	} catch (e: any) {
		sendErrorResponse(formatValidationErrors(e), res, StatusCodes.BAD_REQUEST)
	}
}

const createNote = async (req: Request, res: Response) => {
	try {
		
		const validation: INoteInterface = await noteValidation.validateAsync(
			req.body,
			{
				abortEarly: false,
			}
		)

		const note = await AppDataSource.manager.create<Note>(Note, validation)
		const noteType = await AppDataSource.getRepository(NoteType).findOneByOrFail({
			id: validation.noteTypeId,
		})
		if(noteType)
		{
			note.note_type = noteType
			await AppDataSource.manager.save(note)
			sendSuccessResponse<Note>(res, note)
	
		}
		else
		{
			const error:any=['note type not exist ']
			sendErrorResponse(
				formatValidationErrors(error),
				res,
				StatusCodes.NOT_ACCEPTABLE
			)
		}
		sendSuccessResponse<Note>(res, note)
	} catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}
const editNoteProfile = async (req: Request, res: Response) => {
	try {
		const id = 2
		const validation: Note = await noteValidation.validateAsync(req.body, {
			abortEarly: false,
		})
		const updateResult = await AppDataSource.manager.update<Note>(
			Note,
			{
				id,
			},
			validation
		)
		if (updateResult.affected === 1) {
			sendSuccessResponse(res)
		} else {
			sendErrorResponse(['Failed to update'], res, StatusCodes.NO_CHANGE)
		}
	} catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}

export { listCompanies, editNoteProfile, showNote, createNote }
