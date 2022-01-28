// import model
const { user } = require('../../models')

// import joi validation
const joi = require('joi')

// import bcrypt
const bcrypt = require('bcrypt')

// import jwt
const jwt = require('jsonwebtoken')

// login
exports.login = async (req, res) => {
    try {

        const { email, password } = req.body
        const data = req.body

        // validation schema here
        const schema = joi.object({
            email: joi.string().email().min(6).required(),
            password: joi.string().min(6).required()
        })

        // do validation and get error object from schema.validate
        const { error } = schema.validate(data)

        // if error exist send validation error message
        if (error) {
            return res.send({
                status: 'validation failed',
                message: error.details[0].message
            })
        }

        // Check if the email is already registered or not
        const emailExist = await user.findOne({
            where: {
                email
            }
        })
        // console.log(emailExist)

        // If the email is not registered
        if (!emailExist) {
            return res.send({
                status: 'failed',
                message: "Email and Password don't match"
            })
        }

        // Password Check
        const isValidPassword = await bcrypt.compare(password, emailExist.password)

        // if invalid password
        if (!isValidPassword) {
            return res.send({
                status: 'failed',
                message: "Email and Password don't match"
            })
        }

        // create token
        const secretKey = process.env.SECRET_KEY

        // token
        const token = jwt.sign({
            id: emailExist.id
        }, secretKey)


        res.send({
            status: 'success',
            data: {
                user: {
                    fullName: emailExist.fullName,
                    username: emailExist.username,
                    email: emailExist.email,
                    token
                }
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 'failed',
            message: 'server error'
        })
    }
}