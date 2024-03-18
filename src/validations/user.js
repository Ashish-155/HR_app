const Joi = require('joi');

const contactNoPattern = /^(\+|\d)[0-9]{7,16}$/;
const createUserValidation = {
    payload: Joi.object({
        name: Joi.string().required().label('name'),
        email: Joi.string().required().label('email'),
        gender: Joi.string().required().label('gender'),
        contact_no: Joi.string().regex(contactNoPattern).message('Please give any valid contact number').required().label('contact_no'),
        location: Joi.string().required().label('location'),
        password: Joi.string().required().label('password'),
        date_of_birth: Joi.date().required().label('Date of Birth'),
    })
};

const loginUserValidation = {
    payload: Joi.object({
        email: Joi.string().required().label('email'),
        password: Joi.string().required().label('password'),
    })
};
module.exports = {
    createUserValidation,
    loginUserValidation
}