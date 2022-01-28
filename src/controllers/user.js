const { user } = require('../../models')

// -------------------- GET ALL USER --------------------------

exports.getUsers = async (req, res) =>{
    try {
        const data = await user.findAll({
            attributes : {
                exclude : ['password', 'createdAt', 'updatedAt']
            }
        })

        res.status(200).send({
            status : 'success',
            data : {
                users : data
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status : 'failed',
            message : 'server error'
        })
    }
}

// -------------------- GET USER BY ID --------------------------

exports.getUser = async (req, res) => {
    try {
        const { id } = req.params

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

        const data = await user.findOne({
            where : {
                id
            },
            attributes : {
                exclude : ['password', 'createdAt', 'updatedAt']
            }
        })
        
        res.status(200).send({
            status : 'success',
            data : {
                user : data
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status : 'failed',
            message : 'server error'
        })
    }
}

// -------------------- EDIT USER --------------------------

exports.editUser = async (req, res) =>{
     try {
         const { id } = req.params
         const datas = req.body

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

        const updateData = {
            ...datas,
            image : req.file.filename
        }

         const data = await user.update(updateData, {
             where : { id }
         })

         const updateUser = await user.findOne({
             where : {
                 id
             },
             attributes : {
                 exclude : ['password', 'createdAt', 'updatedAt']
             }
         })

         res.status(200).send({
             status : 'success',
             data : {
                 user : updateUser
             }
         })
         
     } catch (error) {
         console.log(error)
         res.status(500).send({
            status : 'failed',
            message : 'server error'
        })
     }
}

// -------------------- DELETE USER --------------------------

exports.deleteUser = async (req, res) =>{
    try {
        const { id } = req.params

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

        await user.destroy({
            where : { id }
        })

        res.status(200).send({
            status : 'success',
            id : id
        })
    } catch (error) {
        console.log(error)
         res.status(500).send({
            status : 'failed',
            message : 'server error'
        }) 
    }
}


