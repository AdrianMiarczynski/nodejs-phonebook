import { Error } from "mongoose";
import User from "../service/schema/user.js";
import bcrypt from "bcrypt";
import gravatar from "gravatar";
import Jimp from "jimp";

export const userList = async () => {
  try {
    return await User.find();
  } catch (err) {
    throw err;
  }
};

export const getUserById = async (id) => {
  try {
    return await User.findById(id);
  } catch (err) {
    throw err;
  }
};
export const addUser = async (body) => {
  const { email, password } = body;
  const users = await User.find();
  const findUser = users.find((user) => user.email === email);
  if (findUser) {
    return `message: Email in use`;
  }
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const userAvatar = gravatar.url(email, { s: "250" });
    const user = { ...body, password: hashedPassword, avatarURL: userAvatar };
    await User.create(user);
    return user;
  } catch (err) {
    throw err;
  }
};
export const loginUser = async (body) => {
  const { email, password } = body;
  const users = await User.find();
  const singleUser = users.find((user) => user.email === email);
  if (!singleUser) {
    return console.log("Cannot find user");
  }
  try {
    if (await bcrypt.compare(password, singleUser.password)) {
      console.log("success");
      return singleUser;
    } else {
      console.log("Not Allowed");
    }
  } catch (err) {
    throw new Error();
  }
};
// export const updateUser = async (userId, subscription) => {
//   const available = User.schema.path("subscription").enumValues;
//   if (!available.includes(subscription)) {
//     throw new Error();
//   }
//   try {
//     return await User.findByIdAndUpdate(
//       { _id: userId },
//       { $set: { subscription: subscription } },
//       { new: true,select:'email subscription' }
//     );
//   } catch (err) {
//     throw new Error();
//   }
// };
export const pathAvatar = async (id, file) => {
  try {
    const localAvatar = `public/avatars/avatar_${id}.jpg`;

    const lenna = await Jimp.read(file.path);
    await lenna.resize(250, 250).quality(60).writeAsync(localAvatar);

    console.log(lenna.resize(250, 250).quality(60).writeAsync(localAvatar));
    const user = await User.findByIdAndUpdate(
      { _id: id },
      { $set: { avatarURL: localAvatar } },
      { new: true }
    );
    return user;
  } catch (err) {
    throw err;
  }
};
