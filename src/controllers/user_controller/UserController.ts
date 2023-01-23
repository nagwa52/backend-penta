import { RequestHandler } from 'express'
import { User } from '../../entities/User.entity'
import { Request, Response } from 'express'
import { AppDataSource } from '../../config/database/data-source'
import { formatValidationErrors } from '../../helpers/functions/formatValidationErrors'
import { sendErrorResponse } from '../../helpers/responses/sendErrorResponse'
import { StatusCodes } from '../../helpers/constants/statusCodes'
import { sendSuccessResponse } from '../../helpers/responses/sendSuccessResponse'
import { existsSync, unlinkSync } from 'fs'
import { UPLOAD_DIRECTORY } from '../../helpers/constants/directories'
import { sendNotFoundResponse } from '../../helpers/responses/404.response'
import { IUserInterface } from '../../helpers/interfaces/IUser.interface'
import { userValidation } from '../../helpers/validations/user.validation'
const createUser = async (req: Request, res: Response) => {
	try {
		const validation: IUserInterface = await userValidation.validateAsync(
			req.body,
			{
				abortEarly: false,
			}
		)

		const user = await AppDataSource.manager.create<User>(User, validation)
		await user.save()

		sendSuccessResponse<User>(res, user)
	} catch (error: any) {
		sendErrorResponse(
			formatValidationErrors(error),
			res,
			StatusCodes.NOT_ACCEPTABLE
		)
	}
}
const uploadProfilePicture = async (req: Request, res: Response) => {
	try{
	const id: number | undefined = +req.params.id
	const user: User | null = await AppDataSource.manager.findOneByOrFail<User>(User, {
		id,
	})
	if (user && req.file?.filename) {
		// Remove `uploads/` from path string
		const oldCoverPicture = user.profile_picture
		if (oldCoverPicture && oldCoverPicture !== '') {
			await unlinkSync(`${UPLOAD_DIRECTORY}${oldCoverPicture}`)
		}
		const path = `${req.file.destination}${req.file.filename}`.replace(
			UPLOAD_DIRECTORY,
			''
		)
		user.profile_picture = path
		await user.save()
		res.json({
			success: true,
			path,
		})
	} else {
		res.json(sendNotFoundResponse)
	}
}
catch (e: any) {
	sendErrorResponse(
		formatValidationErrors(e),
		res,
		StatusCodes.BAD_REQUEST
	)
}

}
const viewUserProfile: RequestHandler = async (req, res) => {
	try {
		const id = 2
		const user = await AppDataSource.getRepository(User).findOneByOrFail({
			id,
		})
		sendSuccessResponse<User>(res, user)
	} catch (e: any) {
		sendErrorResponse(formatValidationErrors(e), res, StatusCodes.BAD_REQUEST)
	}
}

// const editUserProfile = async (req: Request, res: Response) => {
// 	try {
// 		const id=2 ;
// 		const validation: User = await userEditValidation.validateAsync(req.body, {
// 			abortEarly: false,
// 		})
// 		const updateResult = await AppDataSource.manager.update<User>(
// 			User,
// 			{
// 				id,
// 			},
// 			validation
// 		)
// 		if (updateResult.affected === 1) {
// 			sendSuccessResponse(res)
// 		} else {
// 			sendErrorResponse(['Failed to update'], res, StatusCodes.NO_CHANGE)
// 		}
// 	} catch (error: any) {
// 		sendErrorResponse(
// 			formatValidationErrors(error),
// 			res,
// 			StatusCodes.NOT_ACCEPTABLE
// 		)
// 	}
// }



// const getUserId = async (req: Request, res: Response) => {
// 	try {
// 		const id=2 ;
// 		const user = await AppDataSource.getRepository(User).findOneByOrFail({
// 			id
// 		})
// 		sendSuccessResponse<User>(res, user);
// 	}
// 	catch (error: any) {
// 		sendNotFoundResponse(res)
// 	}
// }
export {
	uploadProfilePicture,
	viewUserProfile,
	createUser,
}
