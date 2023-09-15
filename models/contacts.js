import Contact from "../service/schema/contact.js";

export const listContacts = async (userId) => {
  try {
    return await Contact.find({ owner: userId });
  } catch (error) {
    throw error;
  }
};
export const getContactById = async (userId, contactId) => {
  try {
    return await Contact.findOne({ _id: contactId, owner: userId });
  } catch (error) {
    console.log(error);
  }
};

export const removeContact = async (contactId, userId) => {
  try {
    return await Contact.findByIdAndRemove({ _id: contactId, owner: userId });
  } catch (error) {
    console.log(error);
  }
};

export const addContact = async (body, userId) => {
  try {
    const data = {
      ...body,
      owner: userId,
    };
    return await Contact.create(data);
  } catch (error) {
    console.log(error);
  }
};

export const updateContact = async (contactId, body, userId) => {
  try {
    return await Contact.findByIdAndUpdate(
      { _id: contactId, owner: userId },
      body,
      {
        new: true,
      }
    );
  } catch (error) {
    console.log(error);
  }
};
export const updateStatusContact = async (contactId, favorite, userId) => {
  try {
    return await Contact.findByIdAndUpdate(
      { _id: contactId, owner: userId },
      { $set: { favorite } },
      { new: true }
    );
  } catch (error) {
    console.log(error);
  }
};
