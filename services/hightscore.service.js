const { MAX_TOP, HIGHSCORE_NAME } = require('../constant/highscore');
const UserModel = require('../models/userModel');
const HighscoreModel = require('../models/highscore.model');

exports.updateTop = async (accountId, name, score) => {
  try {
    let tops = await HighscoreModel.findOne({ name });

    let unit = '';
    for (let key in HIGHSCORE_NAME) {
      if (HIGHSCORE_NAME[key].name === name) {
        unit = HIGHSCORE_NAME[key].unit;
        break;
      }
    }

    let newTops = [];
    if (!Boolean(tops)) {
      newTops.push({ accountId, score: Number(score) });
      HighscoreModel.create({
        name,
        unit,
        top: newTops,
      });
    } else {
      const index = tops.top.findIndex(
        (i) => i.accountId.toString() === accountId.toString(),
      );

      if (index === -1) {
        tops.top.push({ accountId, score: Number(score) });
      } else {
        const item = tops.top[index];
        if (Number(item.score) < Number(score)) {
          tops.top[index].score = score;
        }
      }
      newTops = tops.top;

      newTops = newTops
        .sort((a, b) => Number(a.score) - Number(b.score))
        .slice(0, MAX_TOP);

      await HighscoreModel.updateOne({ name }, { top: newTops });
    }
  } catch (error) {
    throw error;
  }
};

exports.getLeaderboardWithName = async (name = '') => {
  try {
    const highscores = await HighscoreModel.findOne({ name });
    if (!Boolean(highscores)) {
      return [];
    }
    console.log("highscores", highscores)
    const { top } = highscores;
    const l = top.length;
    let topList = [];

    for (let i = 0; i < l; ++i) {
      console.log("test", top[i].accountId);
      const data = await UserModel.findOne({
        _id: top[i].accountId,
      }).select('name avatar -_id');
      // console.log(data.avatar);
      if (data) {
        topList.push({
          name: data.name || 'Anonymous',
          avatar: data.avatar,
          score: top[i].score,
        });
      }
    }
    console.log("topList", topList)
    return topList;
  } catch (error) {
    throw error;
  }
};

exports.getLeaderboardWithNameByAdmin = async (name = '') => {
  try {
    const highscores = await HighscoreModel.findOne({ name });
    if (!Boolean(highscores)) {
      return [];
    }
    console.log("highscores", highscores)
    const { top } = highscores;
    const l = top.length;
    let topList = [];

    for (let i = 0; i < l; ++i) {
      const data = await UserModel.find().sort({score: 1}).select('name avatar -_id');
      if (data.length > 0) {
        topList.push({
            name: data[i]?.name || 'Anonymous',
            avatar: data[i]?.avatar,
            score: top[i].score,
          });
      }
    }
    return topList;
  } catch (error) {
    throw error;
  }
};
