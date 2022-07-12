// const { cloudinary } = require('../configs/cloudinary.config');
const { MAX } = require('../constant');
const { convertPackInfoToQueryStr } = require('../helper/word-pack.helper');
// const VerifyCodeModel = require('../models/account.model/verifyCode.model');
const SentenceModel = require('../models/sentence.model');
const SentenceRequest = require('../models/sentenceRequest');
const WordModel = require('../models/word.model');
const WordRequest = require('../models/wordRequest');

// exports.uploadImage = async (imgSrc, folderName = '', config = {}) => {
//   try {
//     const result = await cloudinary.uploader.upload(imgSrc, {
//       folder: folderName,
//       ...config,
//     });
//     const { secure_url = null } = result;
//     return secure_url;
//   } catch (error) {
//     throw error;
//   }
// };

exports.isExistWord = async (word = '', type = '') => {
  try {
    if (word === '' || type === '') {
      return false;
    }

    return await WordModel.exists({ word, type });
  } catch (error) {
    throw error;
  }
};

exports.isExistWordRequest = async (word = '', type = '') => {
  try {
    if (word === '' || type === '') {
      return false;
    }

    return await WordRequest.exists({ word, type });
  } catch (error) {
    throw error;
  }
};

exports.isExistSentence = async (sentence = '') => {
  if (sentence === '') return false;
  const newRegex = new RegExp(sentence, 'i');
  return await SentenceModel.exists({ sentence: newRegex });
};

exports.isExistSentenceRequest = async (sentence = '') => {
  if (sentence === '') return false;
  const newRegex = new RegExp(sentence, 'i');
  return await SentenceRequest.exists({ sentence: newRegex });
};

exports.getWordPack = async (
  packInfo = {},
  skip = 0,
  limit = 500,
  select = '',
  sortType = null,
  expandQuery = null,
) => {
  try {
    let query = convertPackInfoToQueryStr(packInfo);

    // add expand query
    if (expandQuery && typeof expandQuery === 'object') {
      Object.assign(query, expandQuery);
    }

    const packList = await WordModel.find(query)
      .sort({ word: sortType })
      .skip(skip)
      .limit(limit)
      .select(select);

    return packList;
  } catch (error) {
    throw error;
  }
};

exports.countWordPack = async (packInfo = {}) => {
  try {
    let query = convertPackInfoToQueryStr(packInfo);
    console.log(query)
    return await WordModel.countDocuments(query);
  } catch (error) {
    throw error;
  }
};
