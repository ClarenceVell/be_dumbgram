const { user, messages } = require('../../models')

const { Op, QueryTypes } = require('sequelize')

// -------------------- ADD MESSAGE --------------------------

exports.addMessage = async (req, res) => {
    try {
        const { id } = req.params
        const { idUser } = req
        const { message } = req.body

        const userExist = await user.findOne({
            where : {
                id
            }
        })

        if(!userExist){
            res.status(404).send({
                message : `User not found!`
            })
        }

        const data = await messages.create({
            sender : idUser,
            receiver : id,
            message : message
        })
        // console.log(data)

        const chat = await messages.findOne({
            where : {
                id : data.id,
            },
                attributes : ['id', 'message'],
                include : [
                    {
                        model : user,
                        as : 'Receiver',
                        attributes : ['id', 'fullName', 'username', 'image']
                    }
                ]
            
        })
        console.log(data.id)
        res.status(200).send({
            status : 'success',
            data : chat
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status : 'failed',
            message : 'server error'
        })
    }
}

// -------------------- GET MESSAGE WITH OTHER --------------------------

exports.getMessage = async (req, res) =>{
    try {
        const { id } = req.params
        const { idUser } = req

        const userExist = await user.findOne({
            where : {
                id
            }
        })

        if(!userExist){
            res.status(404).send({
                message : `User not found!`
            })
        }

        const data = await messages.findAll({
            where : {
                // switch params with operator or
                [Op.or] : [
                    {
                        sender : id,
                        receiver : idUser
                    },
                    {
                        sender : idUser,
                        receiver : id
                    }
                ]
            },
            attributes : ['id', 'message'],
            include : [
                {
                    model : user,
                    as : 'Sender',
                    attributes : ['id', 'fullName', 'username', 'image']
                }
            ]
        })

        res.status(200).send({
            status : 'success',
            data
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status : 'failed',
            message : 'server error'
        })
    }
}
