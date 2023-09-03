import Contact from "../service/schema/contact.js";

export const listContacts = async () => {
  try {
    return await Contact.find();
  } catch (error) {
    throw error;
  }
};
export const getContactById = async (contactId) => {
  try {
    return await Contact.findOne({ _id: contactId });
  } catch (error) {
    console.log(error);
  }
};

export const removeContact = async (contactId) => {
  try {
    return await Contact.findByIdAndRemove({ _id: contactId });
  } catch (error) {
    console.log(error);
  }
};

export const addContact = async (body) => {
  try {
    return await Contact.create(body);
  } catch (error) {
    console.log(error);
  }
};

export const updateContact = async (contactId, body) => {
  try {
    return await Contact.findByIdAndUpdate({ _id: contactId }, body, {
      new: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const updateStatusContact = async (contactId, favorite) => {
  try {
    return await Contact.findByIdAndUpdate(
      { _id: contactId },
      { $set: { favorite } },
      { new: true }
    );
  } catch (error) {
    console.log(error);
  }
};
