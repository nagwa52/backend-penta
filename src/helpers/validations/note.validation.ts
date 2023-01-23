import Joi from 'joi'

export const noteValidation = Joi.object().keys({
	title: Joi.string().min(5).required(),
	message_body: Joi.string().min(5).required(),
})
