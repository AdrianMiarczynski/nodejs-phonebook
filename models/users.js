import { Error } from "mongoose";
import User from "../service/schema/user.js";
import bcrypt from "bcrypt";
import gravatar from "gravatar";
import Jimp from "jimp";
import { nanoid } from "nanoid";
import "dotenv/config";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
export const verificationMgs = (email, verificationToken) => {
  return {
    to: email, // Change to your recipient
    from: "adrian331144@gmail.com", // Change to your verified sender
    subject: "Verify your email",
    text: "Verify your email in link bellow",
    html: `<strong><a href="http://localhost:3000/api/users/verify/${verificationToken}">Verify email</a></strong>`,
  };
};
export const verificationEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error({ message: `User not found` });
    }
    const { verificationToken, verify } = user;
    if (verify) {
      throw new Error({ message: `Verification has already been passed` });
    }
    await sgMail.send(verificationMgs(email, verificationToken));
  } catch (err) {
    throw err;
  }
};

export const verificationUser = async (verificationToken) => {
  try {
    // const user = await User.find();
    // const findUser = user.find(user => user.verificationToken === verificationToken)
    const user = await User.findOne({ verificationToken });
    if (!user) {
      throw new Error();
    }
    (user.verify = true), (user.verificationToken = null);
    return user;
  } catch (err) {
    console.log(err);
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
    const verificationToken = nanoid();
    const user = {
      ...body,
      password: hashedPassword,
      avatarURL: userAvatar,
      verificationToken,
    };
    await User.create(user);
    await sgMail.send(verificationMgs(email, verificationToken));
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
