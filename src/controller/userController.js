const {userModel} = require('../model/userModel');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10

const createUser = async (req,res) => {
    try{
        let data = req.body
        data.password = await bcrypt.hash(data.password, saltRounds)
        let savedUser = await userModel.create(data)
        res.status(201).send({data: savedUser})
    }
    catch(err){
        res.status(500).send({msg: err.message})
    }
}

const getUser = async (req,res) => {
    try{
        let userId = req.headers['valid-user']
        let getUserData = await userModel.findOne({_id: userId},{_id:0, createdAt:0, updatedAt:0, __v:0})
        if(!getUserData)
            return res.status(404).send({msg: "User not found."}) 
        res.status(200).send({data: getUserData})
    }
    catch(err){
        res.status(500).send({msg: err.message})
    }
}

const followUser = async (req,res) => {
    try{
        let userToFollowId = req.params.id
        let myId = req.headers['valid-user']

        if(userToFollowId === myId) 
            return res.status(400).send({msg: "You can't follow/unfollow your own profile."}) 

        let checkIfFollowedAlready = await userModel.findOne({followers: myId})
        if(checkIfFollowedAlready) 
            return res.status(200).send({msg: "You're already a follower."})

        let followedUser = await userModel.findOneAndUpdate({_id: userToFollowId},{
            $addToSet: {followers: myId}
            },{new: true})

        let followingUser = await userModel.findOneAndUpdate({_id: myId}, {
            $addToSet: {followings: userToFollowId}
            },{new: true})
        res.status(200).send({followedUser, followingUser})
    }
    catch(err){
        res.status(500).send({msg: err.message})
    }
}

const unfollowUser = async (req,res) => {
    try{
        let userToUnfollowId = req.params.id
        let myId = req.headers['valid-user']

        if(userToUnfollowId === myId) 
            return res.status(400).send({msg: "You can't follow/unfollow your own profile."}) 

        let checkIfUnfollowedAlready = await userModel.findOne({followers: myId})
        if(!checkIfUnfollowedAlready) 
            return res.status(200).send({msg: "You've already unfollwed."})

        let unfollowedUser = await userModel.findOneAndUpdate({_id: userToUnfollowId},{
            $pull: {followers: myId}
            },{new: true})

        let unfollowingUser = await userModel.findOneAndUpdate({_id: myId}, {
            $pull: {followings: userToUnfollowId}
            },{new: true})
        res.status(200).send({unfollowedUser, unfollowingUser})
    }
    catch(err){
        res.status(500).send({msg: err.message})
    }
}

module.exports = {createUser, getUser, followUser, unfollowUser}