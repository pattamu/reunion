const {postModel} = require('../model/postModel');
const {commentModel} = require('../model/commetModel')

const createPost = async (req,res) => {
    try{
        let data = req.body
        data.userId = req.headers['valid-user']
        let savePost = await postModel.create(data)
        res.status(201).send({data: {
            _id: savePost._id,
            title: savePost.title,
            description: savePost.description,
            createdAt: savePost.createdAt
        }})
    }
    catch(err){
        res.status(500).send({msg: err.message})
    }
}

const deletePost = async (req,res) => {
    try{
        let postId = req.params.id
        let userId = req.headers['valid-user']
        let userOfPost = await postModel.findById(postId)

        if(userId !== userOfPost.userId.toString())
            return res.status(403).send({msg: "You can't delete this post."})

        let deleted = await postModel.findOneAndUpdate({_id: postId, isdeleted: false},{isdeleted: true},{new: true})
        if(!deleted)
            return res.status(404).send({msg: "Post not found."})

        res.status(200).end()
    }
    catch(err){
        res.status(500).send({msg: err.message})
    }
}

const likePost = async (req,res) => {
    try{
        let postId = req.params.id
        let userId = req.headers['valid-user']
        let userChoice = await postModel.findOne({$or:[{likedUsers: userId},{dislikedUsers: userId}]})
        if(!userChoice.likedUsers.find(x => x = userId)){
            let findPost = await postModel.findOneAndUpdate({_id: postId, isdeleted: false},
                {$inc: {likes: 1}, $addToSet: {likedUsers: userId}},
                {new: true})
            if(!findPost)
                return res.status(404).send({msg: "Post not found."})
        }
        if(userChoice.dislikedUsers.find(x => x = userId)){
            let findPost = await postModel.findOneAndUpdate({_id: postId, isdeleted: false},
                {$inc: {unlikes: -1}, $pull: {dislikedUsers: userId}},
                {new: true})
        }
        res.status(200).end()
    }
    catch(err){
        res.status(500).send({msg: err.message})
    }
}

const unlikePost = async (req,res) => {
    try{
        let postId = req.params.id
        let userId = req.headers['valid-user']
        let userChoice = await postModel.findOne({$or:[{likedUsers: userId},{dislikedUsers: userId}]})
        if(!userChoice.dislikedUsers.find(x => x = userId)){
            let findPost = await postModel.findOneAndUpdate({_id: postId, isdeleted: false},
                {$inc: {unlikes: 1}, $addToSet: {dislikedUsers: userId}},
                {new: true})
            if(!findPost)
                return res.status(404).send({msg: "Post not found."})
        }
        if(userChoice.likedUsers.find(x => x = userId)){
            let findPost = await postModel.findOneAndUpdate({_id: postId, isdeleted: false},
                {$inc: {likes: -1}, $pull: {likedUsers: userId}},
                {new: true})
        }
        res.status(200).end()
    }
    catch(err){
        res.status(500).send({msg: err.message})
    }
}

const commentPost = async (req,res) => {
    try{
        let data = req.body
        data.userId = req.headers['valid-user']
        data.postId = req.params.id

        let findPost = await postModel.findOne({_id: req.params.id, isdeleted: false})
        if(!findPost)
            return res.status(404).send({msg: "post not found."})

        let createComment = await commentModel.create(data)
        res.status(201).send({commentId: createComment._id})
    }
    catch(err){
        res.status(500).send({msg: err.message})
    }
}

const getPost = async (req,res) => {
    try{
        let postId = req.params.id
        let findPost = await postModel.findById(postId)
        if(findPost.isdeleted)
            return res.status(404).send({msg: "Post not found."})
        
        let findComments = await commentModel.find({postId})
        
        res.status(200).send({
            likes: findPost.likes,
            comments: findComments
        })
    }
    catch(err){
        res.status(500).send({msg: err.message})
    }
}

const getPosts = async (req,res) => {
    try{
        let userId = req.headers['valid-user']
        let findPosts = await postModel.find({userId, isdeleted: false}).sort({ createdAt: 1 })
        
        res.status(200).send({data: findPosts})
    }
    catch(err){
        res.status(500).send({msg: err.message})
    }
}


module.exports = {createPost, deletePost, likePost, unlikePost, commentPost, getPost, getPosts}