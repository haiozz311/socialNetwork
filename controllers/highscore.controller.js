const {
  updateTop,
  getLeaderboardWithName,
} = require('../services/hightscore.service');
const Users = require('../models/userModel')

exports.putUpdateHighScore = async (req, res, next) => {
  try {
    const { name, score } = req.body;
    const user = await Users.findById(req.user.id).select('-password');
    console.log("user", user)
    const { _id } = user;
    console.log("_id", _id)
    if (!_id) {
      return res.status(500).json({ message: 'Lỗi dịch vụ, thử lại sau' });
    }

    await updateTop(_id, name, score);
  } catch (error) {
    console.error('PUT UPDATE HIGHT SCORE ERROR: ', error);
    return res.status(500).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

exports.getLeaderboard = async (req, res, next) => {
  try {
    const { name } = req.query;
    console.log("name", name)
    if (!Boolean(name)) {
      return res.status(400).json({ message: 'failed' });
    }

    const list = await getLeaderboardWithName(name);
    return res.status(200).json({ list });
  } catch (error) {
    console.error('GET LEADERBOARD ERROR: ', error);
    return res.status(500).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};
