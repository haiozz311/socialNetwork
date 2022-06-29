const mongoose = require('mongoose')
const { ACCOUNT_TYPES, DEFAULT, MAX } = require('../constant');

const accountTypeEnum = (function () {
    let list = [];
    for (let k in ACCOUNT_TYPES) {
        list.push(ACCOUNT_TYPES[k]);
    }
    return list;
})();

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name!"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please enter your email!"],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please enter your password!"]
    },
    role: {
        type: Number,
        default: 0 // 0 = user, 1 = admin
    },
    authType: {
        type: String,
        enum: accountTypeEnum,
        default: ACCOUNT_TYPES.LOCAL,
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png"
    },
    coin: {
        type: Number,
        required: true,
        default: DEFAULT.USER_COIN,
        min: 0,
        max: MAX.USER_COIN,
    },
    favoriteList: [String],
    mobile: { type: String, default: '' },
    address: { type: String, default: '' },
    gender: {type: String, default: 'male'},
    story: { type: String, default: '', maxlength: 200 },
    followers: [{type: mongoose.Types.ObjectId, ref: 'Users'}],
    following: [{type: mongoose.Types.ObjectId, ref: 'Users'}],
    saved: [{type: mongoose.Types.ObjectId, ref: 'Users'}],
    saved: [{ type: mongoose.Types.ObjectId, ref: 'Users' }],
    requestWord: [String],
}, {
    timestamps: true
})

module.exports = mongoose.model("Users", userSchema)