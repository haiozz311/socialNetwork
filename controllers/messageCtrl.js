const Conversations = require('../models/conversationModel')
const Messages = require('../models/messageModel')
const Users = require('../models/userModel')

class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    paginating(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const messageCtrl = {
    createMessage: async (req, res) => {
        // try {
            
        //     const { sender, recipient, text, media } = req.body.msg

        //     if(!recipient || (!text.trim() && media.length === 0 && !call)) return;

        //     const newConversation = await Conversations.findOneAndUpdate({
        //         // $or: [
        //         //     {recipients: [sender, recipient]},
        //         //     {recipients: [recipient, sender]}
        //         // ]
        //         $or: [
        //             {recipients: [sender, recipient]},
        //             {recipients: [recipient, sender]}
        //         ]
        //     }, {
        //         recipients: [sender, recipient],
        //         text, media, call
        //     }, { new: true, upsert: true })

        //     const newMessage = new Messages({
        //         conversation: newConversation._id,
        //         sender,
        //         call,
        //         recipient, text, media
        //     })

        //     await newMessage.save()

        //     res.json({msg: 'Create Success!'})

        // } catch (err) {
        //     return res.status(500).json({msg: err.message})
        // }

        try {
            const { sender, recipient, text, media, call } = req.body.msg

            if(!recipient || (!text.trim() && media.length === 0 && !call)) return;

            const newConversation = await Conversations.findOneAndUpdate({
                $or: [
                    {recipients: [sender, recipient]},
                    {recipients: [recipient, sender]}
                ]
            }, {
                recipients: [sender, recipient],
                text, media, call
            }, { new: true, upsert: true })

            const newMessage = new Messages({
                conversation: newConversation._id,
                sender, call,
                recipient, text, media
            })

            await newMessage.save()

            res.json({msg: 'Create Success!'})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getConversations: async (req, res) => {
        try {
            const features = new APIfeatures(Conversations.find({
                recipients: req.user.id
            }), req.query).paginating()

            console.log('user',features)

            console.log('features',features)
            const conversations = await features.query.sort('-updatedAt')
            .populate('recipients', 'avatar name', Users)
            console.log('conversations', conversations)
            res.json({
                conversations,
                result: conversations.length
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getMessages: async (req, res) => {
        try {
            const features = new APIfeatures(Messages.find({
                $or: [
                    {sender: req.user.id, recipient: req.params.id},
                    {sender: req.params.id, recipient: req.user.id}
                ]
            }), req.query).paginating()

            const messages = await features.query.sort('-createdAt')

            res.json({
                messages,
                result: messages.length
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteMessages: async (req, res) => {
        try {
            await Messages.findOneAndDelete({_id: req.params.id, sender: req.user.id})
            res.json({msg: 'Delete Success!'})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteConversation: async (req, res) => {
        try {
            const newConver = await Conversations.findOneAndDelete({
                $or: [
                    {recipients: [req.user.id, req.params.id]},
                    {recipients: [req.params.id, req.user.id]}
                ]
            })
            console.log('delete converstation');
            await Messages.deleteMany({conversation: newConver._id})
            
            res.json({msg: 'Delete Success!'})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}


module.exports = messageCtrl