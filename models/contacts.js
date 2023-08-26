import { nanoid } from "nanoid";
import fs from "node:fs/promises";
import path from "node:path";

export const contactsPath = path.resolve("./models", "contacts.json");

export const listContacts = async () => {
  try {
    const response = await fs.readFile(contactsPath);
    const parseResponse = JSON.parse(response);
    return parseResponse;
  } catch (error) {
    console.log(error);
  }
};
export const getContactById = async (contactId) => {
  try {
    const contactsList = await listContacts();
    const response = contactsList.find((contact) => contact.id === contactId);
    return response || null;
  } catch (error) {
    console.log(error);
  }
};

export const removeContact = async (contactId) => {
  try {
    const contactsList = await listContacts();
    const response = contactsList.findIndex(
      (contact) => contact.id === contactId
    );
    if (response !== -1) {
      contactsList.splice(response, 1)[0];
      await fs.writeFile(contactsPath, JSON.stringify(contactsList, null, 2));
      return response;
    }
  } catch (error) {
    console.log(error);
  }
};

export const addContact = async (body) => {
  try {
    const contactsList = await listContacts();
    const { name, email, phone } = body;
    const newContact = { id: nanoid(), name, email, phone };
    contactsList.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contactsList, null, 1));
  } catch (error) {
    console.log(error);
  }
};

export const updateContact = async (contactId, body) => {
  try {
    const contactsList = await listContacts();
    const contactIndex = contactsList.findIndex(
      (contact) => contact.id === contactId
    );
    if (contactIndex === -1) {
      console.log(`contact Id=${contactId} not found`);
      return false;
    }
    const contact = contactsList[contactIndex];
    const updateContact = { ...contact, ...body };
    contactsList[contactIndex] = updateContact;
    await fs.writeFile(contactsPath, JSON.stringify(contactsList, null, 2));
    return updateContact;
  } catch (error) {
    console.log(error);
  }
};
