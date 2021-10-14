const Comments = require('../models/commentModel')
const Posts = require('../models/postModel')
const Users = require('../models/userModel')


const commentCtrl = {
    createComment: async (req, res) => {
        try {
            const { postId, content, tag, reply,
                postUserId
            } = req.body
            const user = await Users.findById(req.user.id).select('-password');
            console.log({ user })
            const post = await Posts.findById(postId)
            if (!post) return res.status(400).json({ msg: "This post does not exist." })

            // if (reply) {
            //     const cm = await Comments.findById(reply)
            //     if (!cm) return res.status(400).json({ msg: "This comment does not exist." })
            // }

            const newComment = new Comments({
                user: user._id, content, tag,
                reply,
                postUserId,
                postId
            })
            console.log("newComment", newComment)
            await Posts.findOneAndUpdate({ _id: postId }, {
                $push: { comments: newComment._id }
            }, { new: true })

            await newComment.save()

            res.json({ newComment })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateComment: async (req, res) => {
        try {
            const { content } = req.body

            await Comments.findOneAndUpdate({
                _id: req.params.id, user: req.user.id
            }, { content })

            res.json({ msg: 'Update Success!' })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    likeComment: async (req, res) => {
        try {
            const comment = await Comments.find({ _id: req.params.id, likes: req.user._id })
            if (comment.length > 0) return res.status(400).json({ msg: "You liked this post." })

            const data = await Comments.findOneAndUpdate({ _id: req.params.id }, {
                $push: { likes: req.user.id }
            }, { new: true })

            console.log("data", data);

            res.json({ msg: 'Liked Comment!' })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    unLikeComment: async (req, res) => {
        try {

            await Comments.findOneAndUpdate({ _id: req.params.id }, {
                $pull: { likes: req.user.id }
            }, { new: true })

            res.json({ msg: 'UnLiked Comment!' })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deleteComment: async (req, res) => {
        try {
            const comment = await Comments.findOneAndDelete({
                _id: req.params.id,
                $or: [
                    { user: req.user.id },
                    { postUserId: req.user.id }
                ]
                //$or thỏa 1 trong 2 điều kiện của user or postUserId sẽ thưcj thi
            })
            console.log("id", req.user.id)
            console.log("comment", comment)

            await Posts.findOneAndUpdate({ _id: comment.postId }, {
                $pull: { comments: req.params.id }
            })

            res.json({ msg: 'Deleted Comment!' })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
}


module.exports = commentCtrl