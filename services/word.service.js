const WordModel = require('../models/word.model');

exports.createNewWord = async (wordInfo) => {
  try {
    const newWord = await WordModel.create({ ...wordInfo });

    if (newWord) {
      return true;
    }
    return false;
  } catch (error) {
    throw error;
  }
};

exports.updateOldWord = async (wordInfo) => {
  console.log('updateOldWord', ...wordInfo);
  try {
    const newWord = await WordModel.findOneAndUpdate({ _id: wordInfo._id }, {
      ...wordInfo
    });
    if (newWord) {
      return true;
    }
    return false;
  } catch (error) {
    throw error;
  }
};

exports.searchWord = async (word = '', limit = 20, select = '') => {
  try {
    const regex = new RegExp(`^${word}.*`, 'gi');
    const list = await WordModel.find({ word: regex })
      .limit(limit)
      .select(select);
    return list;
  } catch (error) {
    throw error;
  }
};

exports.getWordDetail = async (word = '') => {
  try {
    const res = await WordModel.findOne({ word });

    return res;
  } catch (error) {
    throw error;
  }
};

exports.getFavoriteList = async (rawFavorites = []) => {
  console.log("rawFavorites", rawFavorites)
  try {
    if (!Array.isArray(rawFavorites) || rawFavorites.length === 0) {
      return [];
    }
    console.log("rawFavorites", rawFavorites)
    let list = [];
    for (let word of rawFavorites) {
      const regex = new RegExp(`^${word}.*`, 'gi');
      const wordDetails = await WordModel.findOne({ word: regex }).select(
        '-_id type word mean phonetic picture',
      );
      if (wordDetails) {
        list.push(wordDetails);
      }
    }

    return list;
  } catch (error) {
    throw error;
  }
};
