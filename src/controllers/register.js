// import model
const { user } = require("../../models");

// import joi validation
const Joi = require("joi");

// import bcrypt
const bcrypt = require("bcrypt");

// import jwt
const jwt = require('jsonwebtoken')

exports.register = async (req, res) =>{
    try {
        const { email, password } = req.body
        const data = req.body

        // validation schema here
        const schema = Joi.object({
            email: Joi.string().email().min(6).required(),
            username: Joi.string().min(5).required(),
            password: Joi.string().min(6).required(),
            fullName: Joi.string().min(5).required()
        });

        // do validation and get error object from schema.validate
        const { error } = schema.validate(req.body);

        // if error exist send validation error message
        if (error)
        return res.status(400).send({
            error: {
            message: error.details[0].message,
            },
        });

        // Check if the email is already registered or not
        const emailExist = await user.findOne({
            where : { email }
        })

        // if email already registered
        if(emailExist){
            return res.status(500).send({
                status : 'failed',
                message : 'email already registered'
            })
        }

        // we generate salt (random value) with 10 rounds
        const salt = await bcrypt.genSalt(10);

        // we hash password from request with salt
        const hashedPassword = await bcrypt.hash(password, salt);

        // add user to database
        const newUser = await user.create({
            ...data,
            password : hashedPassword
        })
        // console.log(newUser)

        // TOKEN 
        const secretKey = process.env.SECRET_KEY

        const token = jwt.sign({
            id: newUser.id
        }, secretKey)

        res.status(200).send({
            status : 'Success',
            data : {
                user : {
                    username : newUser.username,
                    email : newUser.email,
                    fullname : newUser.fullName,
                    token
                }
            },

        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status : "failed",
            message : 'Server Error'
        })
    }
}