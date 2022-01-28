
const { user, feed, follow, like, comment } = require('../../models')

const joi = require('joi')

// -------------------- ADD FEED --------------------------

exports.postFeed = async (req, res) => {
    try {
        const data = req.body
        const { idUser } = req

        const newPost = {
            ...data,
            fileName : req.file.filename,
            userFeed : idUser
        }

        await feed.create(newPost)

        res.status(200).send({
            status : 'success',
            data : newPost
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status : 'failed',
            message : 'server error'
        })
    }
}

// -------------------- DELETE FEED --------------------------

exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params
        const { idUser } = req

        const feedExist = await feed.findOne({
            where : {id},
        })
        
        if(!feedExist){
            return res.status(404).send({
                status : 'failed',
                message : 'feed not found'
            })
        }

        await feed.destroy({
            where : {
                userFeed : idUser,
                id
            }
        })

        res.status(200).send({
            status : 'success',
            message : `feed id ${id} successfully removed`
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status : 'failed',
            message : 'server error'
        })
    }
}


// -------------------- GET FEED BY FOLLOW --------------------------

exports.followingFeeds = async (req, res) => {
    try {
        const { id } = req.params

        const userData = await user.findOne({
            attributes: [],
            order: [["createdAt", "DESC"]],
            where: {
                id
            },
            include: {
                model: follow,
                as: 'following',
                order: [["createdAt", "DESC"]],
                attributes:["id", "createdAt"],
                include: {

                    model: user,
                    as: 'following',
                    order: [["createdAt", "DESC"]],
                    attributes: ["id", "createdAt"] ,
                    include: {

                        model: feed,
                        as: 'feed',
                        order: [["createdAt", "DESC"]],
                        attributes: {
                            exclude: ['updatedAt']
                        }, 
                        include: {

                            model: user,
                            as: 'user',
                            attributes: {
                                exclude: ['updatedAt', 'bio', 'password', 'email']
                            }
                        }
                    },
                },
            },
        })

        res.status(200).send({
            status: 'success',
            data: {
                userData
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}

// -------------------- GET ALL FEED --------------------------

exports.getFeeds = async (req, res) => {
    try {
        let data = await feed.findAll({
            attributes: {
                exclude: ['updatedAt', "createdAt"]
            },
            include : {
                model : user,
                as : 'user',
                attributes: {
                    exclude: ['updatedAt', 'bio', 'password', 'email', "createdAt"]
                }
            }
        })

        const path = process.env.PATH_UPLOAD
        const parseJSON = JSON.parse(JSON.stringify(data))

        data = parseJSON.map(item => {
            return {
                ...item,
                fileName: path + item.fileName
            }
        })

        res.status(200).send({
            status : 'success',
            data
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}

// -------------------- LIKE --------------------------

exports.likeFeed = async (req, res) => {
    try {
        const { idUser } = req

        const { id } = req.body

        const schema = joi.object({
            id: joi.number().required()
        }).validate(req.body)

        if (schema.error) {
            return res.send({
                status: 'validation failed',
                message: schema.error.details[0].message
            })
        }

        const feedExist = await feed.findOne({
            where : { id },
        })

        if(!feedExist){
            return res.status(404).send({
                status : 'failed',
                message : 'feed not found'
            })
        }

        // Check whether the feed is already liked or not
        const check = await like.findOne({
            where : {
                idUser : idUser,
                idFeed : id
            }
        })

        // if the feed already liked
        if(check){
            await like.destroy({
                where : { 
                    idUser : idUser,
                    idFeed : id
                }
            })
            
            const data = await feed.findOne({
                where : { id }
            })

            const likes = data.like -= 1

            await feed.update({like : likes}, {
                where : {
                    id
                }
            })

            res.send({
                status : 'success',
                message : `User ${idUser} unlike feed id ${id}`
            })

            // if the feed is not liked
        } else {

            await like.create({
                idFeed: id,
                idUser: idUser
            })

            const datas = await feed.findOne({
                where: {
                    id
                }
            })

            const likes = datas.like += 1
            await feed.update({ like: likes }, {
                where: {
                    id
                }
            })
            res.send({
                status : 'success',
                message : `User ${idUser} like feed id ${id}`
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}

// -------------------- ADD COMMENT --------------------------

exports.addComment = async (req, res) => {
    try {
        const { idUser } = req

        const { id } = req.body

        const add = req.body.comment

        const feedExist = await feed.findOne({
            where : { id },
        })

        if(!feedExist){
            return res.status(404).send({
                status : 'failed',
                message : 'feed not found'
            })
        }

        const data = await comment.create({
            idUser : idUser,
            idFeed : id,
            comment : add 
        })

        res.status(200).send({
            status : 'success'
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}

// -------------------- GET COMMENTS --------------------------

exports.feedComments = async (req, res) => {
    try {
        const { id } = req.params

        const feedExist = await feed.findOne({
            where : { id },
        })

        if(!feedExist){
            return res.status(404).send({
                status : 'failed',
                message : 'feed not found'
            })
        }

        const data = await comment.findAll({
            where : {
                idFeed : id
            },
            attributes : ['id', 'comment'],
            include : {
                model : user,
                as : 'user',
                attributes : ['id', 'fullname','username', 'image']
            }
        })
        
        res.status(200).send({
            status : 'success',
            data
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}


// -------------------- DELETE COMMENT --------------------------

exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.params
        const { idUser } = req

        await comment.destroy({
            where : {
                id,
                idUser : idUser
            }
        })

        res.status(200).send({
            status : 'success'
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 'failed',
            message: 'Server Error'
        })
    }
}
