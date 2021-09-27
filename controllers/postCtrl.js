const Posts = require('../models/postModel')
const Comments = require('../models/commentModel')
const Users = require('../models/userModel')


class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    paginating() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 3
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}
// class pagination
const postCtrl = {
    createPost: async (req, res) => {
        try {
            const { content, images } = req.body;
            console.log(content, images);
            const user = await Users.findById(req.user.id).select('-password');
            console.log({ user })
            // if (images.length === 0)
            //     return res.status(400).json({ msg: "Bạn chưa thêm hình ảnh!" })
            console.log("req.user._id", user._id)
            const newPost = new Posts({
                content, images, user: user._id
            })
            console.log("newPost", newPost);
            await newPost.save()

            res.json({
                msg: 'Created Post!',
                newPost: {
                    ...newPost._doc,
                    user: user
                }
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getPosts: async (req, res) => {
        try {
            // const features = new APIfeatures(Posts.find({
            //     user: [...req.user.following, req.user._id]
            // }), req.query).paginating()

            // const posts = await features.query.sort('-createdAt')
            //     .populate("user likes", "avatar username fullname followers")
            //     .populate({
            //         path: "comments",
            //         populate: {
            //             path: "user likes",
            //             select: "-password"
            //         }
            //     })

            // res.json({
            //     msg: 'Success!',
            //     result: posts.length,
            //     posts
            // })

            // const posts = await Posts.find({ user: [...req.user.following, req.user._id] })
            // const features =  new APIfeatures(Posts.find({
            //     user: [...req.user.following, req.user._id]
            // }), req.query).paginating()
            const userAuth = await Users.findById(req.user.id).select('-password');
            const posts = await Posts.find({ user: [...userAuth.following, userAuth._id] }).sort('-createdAt')
                .populate("user likes", "avatar name followers")
            //     .populate({
            //         path: "comments",
            //         populate: {
            //             path: "user likes",
            //             select: "-password"
            //         }
            //     })
            // const features = new APIfeatures(Posts.find({
            //     user: [...req.user.following, req.user._id]
            // }), req.query).paginating()

            // const posts = await features.query.sort('-createdAt')
            //     .populate("user likes", "avatar username fullname followers")
            //     .populate({
            //         path: "comments",
            //         populate: {
            //             path: "user likes",
            //             select: "-password"
            //         }
            //     })

            res.json({
                msg: 'Success!',
                result: posts.length,
                posts
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updatePost: async (req, res) => {
        try {
            const { content, images } = req.body

            const post = await Posts.findOneAndUpdate({ _id: req.params.id }, {
                content, images
            }).populate("user likes", "avatar name")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    }
                })

            res.json({
                msg: "Updated Post!",
                newPost: {
                    ...post._doc,
                    content, images
                }
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    likePost: async (req, res) => {
        try {
            console.log("req param", req.params.id)
            const user = await Users.findById(req.user.id).select('-password');
            console.log({ user })
            const post = await Posts.find({ _id: req.params.id, likes: user._id })
            console.log("post", post)
            if (post.length > 0) return res.status(400).json({ msg: "You liked this post." })

            const like = await Posts.findOneAndUpdate({ _id: req.params.id }, {
                $push: { likes: user._id }
            }, { new: true })
            console.log("like", like)
            if (!like) return res.status(400).json({ msg: 'This post does not exist.' })

            res.json({ msg: 'Liked Post!' })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    unLikePost: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('-password');
            console.log({ user })
            const like = await Posts.findOneAndUpdate({ _id: req.params.id }, {
                $pull: { likes: user._id }
            }, { new: true })

            if (!like) return res.status(400).json({ msg: 'This post does not exist.' })

            res.json({ msg: 'UnLiked Post!' })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getUserPosts: async (req, res) => {
        try {
            const features = new APIfeatures(Posts.find({ user: req.params.id }), req.query).paginating()
            const posts = await features.query.sort("-createdAt");
            res.json({
                posts,
                result: posts.length
            })
        } catch (error) {
            return res.status(500).json({ msg: err.message })
        }
        // try {
        //     const features = new APIfeatures(Posts.find({ user: req.params.id }), req.query)
        //         .paginating()
        //     const posts = await features.query.sort("-createdAt")

        //     res.json({
        //         posts,
        //         result: posts.length
        //     })

        // } catch (err) {
        //     return res.status(500).json({ msg: err.message })
        // }
    },
    getPost: async (req, res) => {
        try {
            const post = await Posts.findById(req.params.id)
                .populate("user likes", "avatar username fullname followers")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    }
                })

            if (!post) return res.status(400).json({ msg: 'This post does not exist.' })

            res.json({
                post
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getPostsDicover: async (req, res) => {
        try {
            // const features = new APIfeatures(Posts.find({
            //     user: [...req.user.following, req.user._id]
            // }), req.query).paginating()

            // const posts = await features.query.sort('-createdAt')
            //     .populate("user likes", "avatar username fullname followers")
            //     .populate({
            //         path: "comments",
            //         populate: {
            //             path: "user likes",
            //             select: "-password"
            //         }
            //     })

            const newArr = [...req.user.following, req.user._id]
            console.log("newArr", newArr)

            const num = req.query.num || 3;

            const posts = await Posts.aggregate([
                { $match: { _id: { $nin: newArr } } },
                { $sample: { size: Number(num) } },
            ])

            console.log("posts", posts)

            // return res.json({
            //     users,
            //     result: users.length
            // })

            res.json({
                msg: 'Success!',
                result: posts.length,
                posts
            })
        } catch (error) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deletePost: async (req, res) => {
        try {
            const post = await Posts.findOneAndDelete({ _id: req.params.id, user: req.user._id })
            await Comments.deleteMany({ _id: { $in: post.comments } })

            res.json({
                msg: 'Deleted Post!',
                newPost: {
                    ...post,
                    user: req.user
                }
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    savePost: async (req, res) => {
        try {
            const user = await Users.find({ _id: req.user._id, saved: req.params.id })
            if (user.length > 0) return res.status(400).json({ msg: "You saved this post." })

            const save = await Users.findOneAndUpdate({ _id: req.user._id }, {
                $push: { saved: req.params.id }
            }, { new: true })

            if (!save) return res.status(400).json({ msg: 'This user does not exist.' })

            res.json({ msg: 'Saved Post!' })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    unSavePost: async (req, res) => {
        try {
            const save = await Users.findOneAndUpdate({ _id: req.user._id }, {
                $pull: { saved: req.params.id }
            }, { new: true })

            if (!save) return res.status(400).json({ msg: 'This user does not exist.' })

            res.json({ msg: 'unSaved Post!' })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getSavePosts: async (req, res) => {
        try {
            const features = new APIfeatures(Posts.find({
                _id: { $in: req.user.saved }
            }), req.query).paginating()

            const savePosts = await features.query.sort("-createdAt")

            res.json({
                savePosts,
                result: savePosts.length
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
}

module.exports = postCtrl