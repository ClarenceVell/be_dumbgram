const { user, follow } = require('../../models')

// -------------------- FOLLOW --------------------------

exports.addFollow = async (req, res) =>{
    try {
        const { body } = req

        const data = await follow.create({
            ...body
        })

        res.status(200).send({
            status : 'Success',
            data : data
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status : 'failed',
            message : 'server error'
        })
    }
}

// -------------------- UNFOLLOW --------------------------

exports.unfollow = async (req, res) => {
    try {
        const { id } = req.params
        const {idUser} = req

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

        const data = await follow.destroy({
            where : {
                followings : id,
                followers : idUser
            }
        })

        res.status(200).send({
            status : 'success',
            message : `User id ${idUser} unfollow ${id}`
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status : 'failed',
            message : 'server error'
        })
    }
}

// -------------------- GET FOLLOWING --------------------------

exports.getFollowing = async (req, res) =>{
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
            where : { id },
            attributes : [],
            include : [
                {
                    model : follow,
                    as : "following",
                    attributes : ['id'],
                    include : [
                        {
                            model : user,
                            as : 'following',
                            attributes : ['id', 'fullName', 'username', 'image']
                        }
                    ]
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

// -------------------- GET FOLLOWER --------------------------

exports.getFollower = async (req, res) => {
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
            where : { id },
            attributes : [],
            include : [
                {
                    model : follow,
                    as : 'follower',
                    attributes : ['id'],
                    include : [
                        {
                            model : user,
                            as : 'follower',
                            attributes : ['id', 'fullName', 'username', 'image']
                        }
                    ]
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
