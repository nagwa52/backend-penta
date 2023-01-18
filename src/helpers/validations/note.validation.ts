const Joi = require('joi')

export const noteValidation = Joi.object().keys({
	description: Joi.string().min(5).required(),
})
