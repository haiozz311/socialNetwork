const { ACCOUNT_TYPES, MAX } = require('../constant');
const { hashPassword } = require('../helper');
// const AccountModel = require('../models/account.model/account.model');
const UserModel = require('../models/userModel');
const { uploadImage } = require('./common.service');

exports.isExistAccount = async (email) => {
  try {
    return await AccountModel.exists({ email });
  } catch (error) {
    throw error;
  }
};

exports.findAccount = async (email) => {
  try {
    return await AccountModel.findOne({ email });
  } catch (error) {
    throw error;
  }
};

exports.createAccount = async (
  email,
  password,
  authType = ACCOUNT_TYPES.LOCAL,
) => {
  try {
    const newAccount = await AccountModel.create({
      email,
      password,
      authType,
      createdDate: new Date(),
    });
    if (newAccount && newAccount._id) return newAccount._id;
    return null;
  } catch (error) {
    throw error;
  }
};

exports.createUser = async (accountId, username, name, avt = '') => {
  try {
    const newUser = await UserModel.create({ accountId, name, username, avt });
    if (newUser && newUser._id) return newUser;
    return null;
  } catch (error) {
    throw error;
  }
};

exports.isExistWordInFavorites = async (word, name) => {
  try {
    const regex = new RegExp(word, 'i');
    const isExist = await UserModel.exists({
      name,
      favoriteList: {
        $in: regex,
      },
    });
    console.log({ isExist });
    return isExist;
  } catch (error) {
    throw error;
  }
};

exports.isLimitedFavorites = async (word, name) => {
  try {
    // check limit amount
    const user = await UserModel.findOne({ name }).select('favoriteList');
    const { favoriteList = null } = user;

    if (
      Array.isArray(favoriteList) &&
      favoriteList.length >= MAX.FAVORITES_LEN
    ) {
      return true;
    }

    return false;
  } catch (error) {
    throw error;
  }
};

exports.updateFavoriteList = async (word, name, isAdd = false) => {
  try {
    if (isAdd) {
      return await UserModel.updateOne(
        { name },
        { $push: { favoriteList: word } },
      );
    }

    return await UserModel.updateOne(
      { name },
      { $pull: { favoriteList: { $in: word } } },
    );
  } catch (error) {
    throw error;
  }
};

exports.updateUserCoin = async (newCoin = 0, name = '') => {
  console.log("okay");
  console.log("newCoin", newCoin, name);
  try {
    if (
      newCoin < 0 ||
      newCoin > MAX.USER_COIN ||
      !name ||
      name === ''
    ) {
      return false;
    }

    const updateRes = await UserModel.updateOne(
      { name },
      { coin: newCoin },
    );

    if (updateRes.ok) {
      return true;
    }
  } catch (error) {
    throw error;
  }
};

exports.updatePassword = async (email = '', newPassword = '') => {
  try {
    const hashPw = await hashPassword(newPassword);

    const res = await AccountModel.updateOne({ email }, { password: hashPw });

    if (res.ok) {
      return true;
    }

    return false;
  } catch (error) {
    throw error;
  }
};

exports.updateAvt = async (username = '', avtSrc = '') => {
  try {
    const picture = await uploadImage(avtSrc, 'dynonary/user-avt');
    const isUpdated = await UserModel.updateOne({ username }, { avt: picture });
    if (isUpdated.n && isUpdated.ok) return picture;

    return false;
  } catch (error) {
    throw error;
  }
};

exports.updateProfile = async (
  username = '',
  newName = '',
  newUsername = '',
) => {
  try {
    if (username.toLowerCase() !== newUsername.toLowerCase()) {
      const isExist = await UserModel.exists({ username: newUsername });
      if (isExist) {
        return { status: false, message: 'username ???? ???????c s??? d???ng' };
      }
    }

    const isUpdated = await UserModel.updateOne(
      { username },
      { name: newName, username: newUsername },
    );

    if (isUpdated.n && isUpdated.ok)
      return { status: true, message: 'success' };

    return false;
  } catch (error) {
    throw error;
  }
};

exports.getProfile = async (accountId = '') => {
  try {
    const account = await AccountModel.findById(accountId).select(
      'email createdDate',
    );
    return account;
  } catch (error) {
    throw error;
  }
};
