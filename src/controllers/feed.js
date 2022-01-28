const { user, feed, follow, like, comment } = require('../../models')

// -------------------- ADD FEED --------------------------

exports.postFeed = async (req, res) => {
    try {
        const data = req.body
        const { idUser } = req

        const newPost = {
            ...data,
            fileName : req.file.filename,
            idUser : idUser
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
            res.status(500).send({
                status : 'failed',
                message : 'feed not found'
            })
        }

        await feed.destroy({
            where : {
                idUser : idUser,
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

        const data = await user.findOne({
            where : { id },
            attributes : ['id'],
            include : [
                {
                    model : follow,
                    as : 'following',
                    attributes : ['id'],
                    include : [
                        {
                            model : user,
                            as : 'following',
                            attributes : ['id'],
                            include : [
                                {
                                    model : feed,
                                    as : 'feed',
                                    attributes : {
                                        exclude : [ 'createdAt', 'updatedAt']
                                    },
                                    include : [
                                        {
                                            model : user,
                                            as : 'user'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
            ]
        })

        res.status(200).send({
            status : 'success',
            data
        })

    } catch (error) {
        res.status(500).send({
            status : 'failed',
            message : 'server error'
        })
    }
}
