const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendMail = require('./sendMail')
const { ACCOUNT_TYPES } = require('../constant');
const { google } = require('googleapis')
const { OAuth2 } = google.auth
const fetch = require('node-fetch')
const {
    updateFavoriteList,
    isExistWordInFavorites,
    isLimitedFavorites,
    updateUserCoin
} = require('../services/account.service');

const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID)


const { CLIENT_URL } = process.env

const userCtrl = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body

            if (!name || !email || !password)
                return res.status(400).json({ msg: "Please fill in all fields." })

            if (!validateEmail(email))
                return res.status(400).json({ msg: "Invalid emails." })

            const user = await Users.findOne({ email })
            if (user) return res.status(400).json({ msg: "This email already exists." })

            if (password.length < 6)
                return res.status(400).json({ msg: "Password must be at least 6 characters." })

            const passwordHash = await bcrypt.hash(password, 12)

            const newUser = {
                name, email, password: passwordHash
            }

            const activation_token = createActivationToken(newUser);
            const url = `${CLIENT_URL}/user/activate/${activation_token}`;
            sendMail(email, url, "Verify your email address");


            res.json({ msg: "Register Success! Please activate your email to start." })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    activateEmail: async (req, res) => {
        try {
            const { activation_token } = req.body;
            const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)

            const { name, email, password } = user

            const check = await Users.findOne({ email })
            if (check) return res.status(400).json({ msg: "This email already exists." })

            const newUser = new Users({
                name, email, password
            })

            await newUser.save()

            res.json({ msg: "Account has been activated!" })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body
            const user = await Users.findOne({ email })
            if (!user) return res.status(400).json({ msg: "This email does not exist." })

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({ msg: "Password is incorrect." })
            console.log("login", user)
            const refresh_token = createRefreshToken({ id: user._id });
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })
            res.json({ msg: "Login success!" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getAccessToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            console.log("refresh token", rf_token);
            console.log("req.cookies", req.cookies)
            if (!rf_token) return res.status(400).json({ msg: "Please login now!" })

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ msg: "Please login now!" })

                const access_token = createAccessToken({ id: user.id })
                res.json({ access_token })
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body
            const user = await Users.findOne({ email })
            if (!user) return res.status(400).json({ msg: "This email does not exist." })

            const access_token = createAccessToken({ id: user._id });
            console.log({ access_token })
            const url = `${CLIENT_URL}/user/reset/${access_token}`

            sendMail(email, url, "Reset your password")
            res.json({ msg: "Re-send the password, please check your email." })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    resetPassword: async (req, res) => {
        try {
            const { password } = req.body
            console.log(password)
            const passwordHash = await bcrypt.hash(password, 12)

            await Users.findOneAndUpdate({ _id: req.user.id }, {
                password: passwordHash
            })

            res.json({ msg: "Password successfully changed!" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getUserInfor: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('-password')
                .populate("followers following", "-password")
            res.json(user)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getUsersAllInfor: async (req, res) => {
        try {
            const users = await Users.find().select('-password')

            res.json(users)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/user/refresh_token' })
            return res.json({ msg: "Logged out." })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateUser: async (req, res) => {
        try {
            const { name } = req.body
            await Users.findOneAndUpdate({ _id: req.user.id }, {
                name
            })

            res.json({ msg: "Update Success!" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateUsersRole: async (req, res) => {
        try {
            const { role } = req.body

            await Users.findOneAndUpdate({ _id: req.params.id }, {
                role
            })

            res.json({ msg: "Update Success!" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deleteUser: async (req, res) => {
        try {
            await Users.findByIdAndDelete(req.params.id)

            res.json({ msg: "Deleted Success!" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    googleLogin: async (req, res) => {
        try {
            const { tokenId } = req.body
            console.log(tokenId)
            console.log("client", client)
            const verify = await client.verifyIdToken({ idToken: tokenId, audience: process.env.MAILING_SERVICE_CLIENT_ID })
            console.log({ verify })

            const { email_verified, email, name, picture } = verify.payload

            const password = email + process.env.GOOGLE_SECRET

            console.log(password)

            const passwordHash = await bcrypt.hash(password, 12)

            if (!email_verified) return res.status(400).json({ msg: "Email verification failed." })

            const user = await Users.findOne({ email })

            if (user) {
                const isMatch = await bcrypt.compare(password, user.password)
                if (!isMatch) return res.status(400).json({ msg: "Email này đã được sử dụng !" })

                const refresh_token = createRefreshToken({ id: user._id })
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                })

                res.json({ msg: "Login success!" })
            } else {
                const newUser = new Users({
                    name, email, password: passwordHash, avatar: picture, authType: ACCOUNT_TYPES.GOOGLE
                })

                await newUser.save()

                const refresh_token = createRefreshToken({ id: newUser._id })
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                })

                res.json({ msg: "Login success!" })
            }


        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    facebookLogin: async (req, res) => {
        try {
            const { accessToken, userID } = req.body

            const URL = `https://graph.facebook.com/v2.9/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`

            const data = await fetch(URL).then(res => res.json()).then(res => { return res })

            const { email, name, picture } = data

            const password = email + process.env.FACEBOOK_SECRET

            const passwordHash = await bcrypt.hash(password, 12)

            const user = await Users.findOne({ email })

            if (user) {
                const isMatch = await bcrypt.compare(password, user.password)
                if (!isMatch) return res.status(400).json({ msg: "Password is incorrect." })

                const refresh_token = createRefreshToken({ id: user._id })
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                })

                res.json({ msg: "Login success!" })
            } else {
                const newUser = new Users({
                    name, email, password: passwordHash, avatar: picture.data.url, authType: ACCOUNT_TYPES.FACEBOOK
                })

                await newUser.save()

                const refresh_token = createRefreshToken({ id: newUser._id })
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                })

                res.json({ msg: "Login success!" })
            }


        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    putToggleFavorite: async (req, res) => {
        try {
            const { word, name, isAdd = false } = req.body;

            const isExist = await isExistWordInFavorites(word, name);

            if (isAdd) {
                const isLimited = await isLimitedFavorites(word, name);

                if (isLimited) {
                    return res.status(409).json({
                        message:
                            'Số từ đã vượt quá số lượng tối đa của danh sách yêu thích. Hãy nâng cấp nó.',
                    });
                }

                if (isExist) {
                    return res
                        .status(406)
                        .json({ message: `Từ ${word} đã tồn tại trong danh sách` });
                }
            } else {
                if (!isExist) {
                    return res
                        .status(406)
                        .json({ message: `Từ ${word} không tồn tại trong danh sách` });
                }
            }

            const updateStatus = await updateFavoriteList(word, name, isAdd);

            if (updateStatus && updateStatus.ok && updateStatus.nModified) {
                return res.status(200).json({ message: 'success' });
            } else {
                return res.status(409).json({ message: 'failed' });
            }

            console.log(updateStatus);
        } catch (error) {
            console.error('PUT TOGGLE FAVORITE ERROR: ', error);
            return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
        }
    },

    putUpdateUserCoin: async (req, res) => {
        // const user = await Users.findById(req.user.id).select('-password');
        // console.log({ user })
        // return res.status(200).json({ message: 'success' });
        try {
            let { newCoin } = req.body;
            console.log("newCoin", newCoin)
            const user = await Users.findById(req.user.id).select('-password');
            console.log({ user });
            console.log("name", user.name)
            // if (!user.name) {
            //     return res.status(406).json({ message: 'Not Accept' });
            // }
            if (newCoin < 0) {
                newCoin = 0;
            }
            const update = await updateUserCoin(newCoin, user.name);

            if (update) {
                return res.status(200).json({ message: 'success' });
            }

            // return res.status(406).json({ message: 'Not Accept' });
        } catch (error) {
            console.error('PUT UPDATE USER COIN ERROR: ', error);
            return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
        }
    },
    searchUser: async (req, res) => {
        try {
            const users = await Users.find({ name: { $regex: req.query.name } })
                .limit(10).select("name avatar")

            res.json({ users })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.params.id).select('-password')
                .populate("followers following", "-password")
            if (!user) return res.status(400).json({ msg: "User does not exist." })

            res.json({ user })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    follow: async (req, res) => {
        try {
            console.log("req.params.id", req.params.id);
            console.log("req.user._id", req.user._id);
            const user = await Users.findById(req.user.id).select('-password');
            console.log({ user });
            // const user = await Users.find({ _id: req.params.id, followers: req.user._id });
            // console.log({ user });
            if (user.length > 0) return res.status(500).json({ msg: "You followed this user." })

            const newUser = await Users.findOneAndUpdate({ _id: req.params.id }, {
                $push: { followers: req.user.id }
            }, { new: true }).populate("followers following", "-password")

            await Users.findOneAndUpdate({ _id: req.user.id }, {
                $push: { following: req.params.id }
            }, { new: true })

            res.json({ newUser })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    unfollow: async (req, res) => {
        try {
            const newUser = await Users.findOneAndUpdate({ _id: req.params.id }, {
                $pull: { followers: req.user.id }
            }, { new: true }).populate("followers following", "-password")

            await Users.findOneAndUpdate({ _id: req.user.id }, {
                $pull: { following: req.params.id }
                // pull=> remove element on array 
            }, { new: true })

            res.json({ newUser })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    suggestionsUser: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('-password');
            const newArr = [...user.following, user._id]
            console.log({ newArr })
            const num = req.query.num || 10
            const users = await Users.aggregate([
                { $match: { _id: { $nin: newArr } } },
                { $sample: { size: Number(num) } },
                { $lookup: { from: 'users', localField: 'followers', foreignField: '_id', as: 'followers' } },
                { $lookup: { from: 'users', localField: 'following', foreignField: '_id', as: 'following' } },
            ]).project("-password");

            return res.json({
                users,
                result: users.length
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
}





function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, { expiresIn: '5m' })
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

module.exports = userCtrl