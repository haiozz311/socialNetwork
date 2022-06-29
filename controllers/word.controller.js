const {
  isExistWord,
  uploadImage,
  getWordPack,
} = require('../services/common.service');
const {
  createNewWord,
  searchWord,
  getWordDetail,
  getFavoriteList,
  updateOldWord
} = require('../services/word.service');
const Users = require('../models/userModel')
const WordModel = require('../models/word.model');

exports.postContributeWord = async (req, res, next) => {
  try {
    const { picture, word, type, ...rest } = req.body;

    // check existence of word
    const isExist = await isExistWord(word, type);
    if (isExist) {
      return res
        .status(409)
        .json({ message: `Từ "${word} (${type})" đã tồn tại trong từ điển` });
    }

    // upload description picture if available
    // let pictureUrl = null;
    // if (picture) {
    //   pictureUrl = await uploadImage(picture, 'dynonary/words');
    // }

    // create the new word
    const isCreateSuccess = await createNewWord({
      word,
      type,
      picture,
      isChecked: false,
      ...rest,
    });

    if (isCreateSuccess) {
      return res.status(200).json({ message: 'Tạo từ mới thành công' });
    }
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  } catch (error) {
    console.error('POST CONTRIBUTE WORD ERROR: ', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

exports.updateWord = async (req, res, next) => {
  try {
    const {
      mean,
      type,
      level,
      specialty,
      note,
      topics,
      picture,
      examples,
      synonyms,
      antonyms,
      word,
      phonetic } = req.body;
    console.log('req.body', req.body);
    const prevWord = await WordModel.findById(req.params.id).select('word');
    if (prevWord.word !== word) {
      const isExist = await isExistWord(word, type);
      if (isExist) {
        return res
          .status(409)
          .json({ message: `Từ "${word} (${type})" đã tồn tại trong từ điển` });
      }
    }
    await WordModel.findOneAndUpdate({ _id: req.params.id }, {
      mean,
      type,
      level,
      specialty,
      note,
      topics,
      picture,
      examples,
      synonyms,
      antonyms,
      word,
      phonetic
    })

    res.json({ msg: "Cập nhật từ vựng thành công" })
  } catch (err) {
    return res.status(500).json({ msg: err.message })
  }
};

exports.requestWord = async (req, res, next) => {
  try {
    const {
      mean,
      type,
      level,
      specialty,
      note,
      topics,
      picture,
      examples,
      synonyms,
      antonyms,
      word,
      phonetic } = req.body;
    const isExist = await isExistWord(word, type);
    if (isExist) {
      return res
        .status(409)
        .json({ message: `Từ "${word} (${type})" đã tồn tại trong từ điển` });
    }
    const newRequestWord = new WordModel({
      mean,
      type,
      level,
      specialty,
      note,
      topics,
      picture,
      examples,
      synonyms,
      antonyms,
      word,
      phonetic
    })
    const users = await Users.findOneAndUpdate({ id: req.user.id })
    await Users.findOneAndUpdate({ _id: req.user.id }, {
      $push: { requestWord: newRequestWord._id }
    }, { new: true })
    console.log('users', users);
    // const data = users.requestWord.push(newRequestWord);
    // await users.save()

    res.json({ msg: "Cập nhật từ vựng thành công" })
  } catch (err) {
    return res.status(500).json({ msg: err.message })
  }
};



exports.getCheckWordExistence = async (req, res) => {
  try {
    const { word, type } = req.query;
    const isExist = await isExistWord(word, type);
    return res.status(200).json({ isExist });
  } catch (error) {
    console.error('GET CHECK WORD EXIST ERROR: ', error);
    return res.status(200).json({ isExist: false });
  }
};

exports.getWordPack = async (req, res) => {
  try {
    const { page, perPage, packInfo, sortType } = req.query;

    const pageInt = parseInt(page),
      perPageInt = parseInt(perPage);
    const skip = (pageInt - 1) * perPageInt;

    const packList = await getWordPack(
      JSON.parse(packInfo),
      skip,
      perPageInt,
      '_id type word mean phonetic picture level topics examples specialty synonyms antonyms note',
      sortType === 'asc' ? '1' : sortType === 'desc' ? '-1' : null,
      null,
    );

    return res.status(200).json({ packList });
  } catch (error) {
    console.error('WORD GET WORD PACK ERROR: ', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

exports.getSearchWord = async (req, res) => {
  try {
    const { word, isCompact = false } = req.query;
    const list = await searchWord(
      word,
      20,
      isCompact == 'true'
        ? '-_id word'
        : '_id type word mean phonetic picture level specialty note topics examples synonyms antonyms',
    );
    return res.status(200).json({ packList: list });
  } catch (error) {
    console.error('GET SEARCH WORD ERROR: ', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

exports.getWordDetails = async (req, res, next) => {
  try {
    const { word } = req.query;
    const wordDetail = await getWordDetail(word);
    if (wordDetail) {
      return res.status(200).json(wordDetail);
    }
  } catch (error) {
    console.error('GET WORD DETAILS ERROR: ', error);
    return res.status(503).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

exports.deleteWord = async (req, res, next) => {
  try {
    await WordModel.findByIdAndDelete(req.params.id)
    res.json({ msg: "Deleted Success!" })
  } catch (err) {
    return res.status(500).json({ msg: err.message })
  }
};

exports.getUserFavoriteList = async (req, res, next) => {
  try {
    const user = await Users.findById(req.user.id).select('-password');
    if (!user || !user.favoriteList) {
      return res.status(400).json({ message: 'failed' });
    }

    const { favoriteList } = user;
    if (!Array.isArray(favoriteList) || favoriteList.length === 0) {
      return res.status(200).json({ list: [] });
    }

    let { page, perPage, sortType } = req.query;
    page = parseInt(page);
    perPage = parseInt(perPage);
    console.log("page", page);
    console.log("perPage", perPage);

    let favoriteSorted = [...favoriteList];
    console.log("favoriteSorted", favoriteSorted)
    if (sortType === 'asc') {
      favoriteSorted.sort((a, b) => (a > b ? 1 : a < b ? -1 : 0));
    } else if (sortType === 'desc') {
      favoriteSorted.sort((a, b) => (a > b ? -1 : a < b ? 1 : 0));
    }
    favoriteSorted = favoriteSorted.slice((page - 1) * perPage, page * perPage);

    const packList = await getFavoriteList(favoriteSorted);

    return res.status(200).json({ packList });
  } catch (error) {
    console.error(' ERROR: ', error);
    return res.status(500).json({ message: 'Lỗi dịch vụ, thử lại sau' });
  }
};

