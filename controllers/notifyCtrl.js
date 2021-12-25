const Notifies = require('../models/notifyModel')
const Users = require('../models/userModel');


const notifyCtrl = {
    createNotify: async (req, res) => {
        try {
            
            const { id, recipients, url, text, content, image } = req.body.msg;
            
            if(recipients.includes(req.user.id.toString())) return;

            const notify = new Notifies({
                id, recipients, url, text, content, image, user: req.user.id
            })
            console.log("notify",notify);
            await notify.save() 
            return res.json({notify})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    removeNotify: async (req, res) => {
        try {
            const notify = await Notifies.findOneAndDelete({
                id: req.params.id, url: req.query.url
            })
            
            return res.json({notify})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getNotifies: async (req, res) => {
        try {
            const notifies = await Notifies.find({recipients: req.user.id})
                .sort('-createdAt').populate('user', 'avatar name', Users)
            // add Users => fix => Schema hasn't been registered for model            
            return res.json({notifies})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    isReadNotify: async (req, res) => {
        try {
            const notifies = await Notifies.findOneAndUpdate({_id: req.params.id}, {
                isRead: true
            })

            return res.json({notifies})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteAllNotifies: async (req, res) => {
        try {
            const notifies = await Notifies.deleteMany({recipients: req.user._id})
            
            return res.json({notifies})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}


module.exports = notifyCtrl