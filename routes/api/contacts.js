import express from "express";
import Joi from "joi";

import {
  addContact,
  getContactById,
  listContacts,
  removeContact,
  updateContact,
} from "../../models/contacts.js";

export const router = express.Router();

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

router.get("/", async (req, res, next) => {
  try {
    const contact = await listContacts();
    return res.json({
      status: "success",
      code: 200,
      data: { contact },
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const contacts = await getContactById(id);
    return res.json({
      status: "success",
      code: 200,
      data: { contacts },
    });
  } catch (err) {
    res.status(404).json({ message: "Not found" });
  }
});

router.post("/", async (req, res, next) => {
  const data = req.body;
  try {
    const { error } = schema.validate(data);
    if (error) {
      return res.status(400).json(error.message);
    }
    const contact = await addContact(data);
    res.json({
      status: "success",
      code: 201,
      data: { contact },
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const isRemoved = await removeContact(id);
    if (!isRemoved) {
      res.json({
        status: "not found",
        code: 404,
        message: `contact with Id ${id} is not exist`,
      });
    }
    res.json({
      status: "success",
      code: 200,
      message: `Contact witch Id ${id} has been removed`,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const body = req.body;
  try {
    const { error } = schema.validate(body);
    if (error) {
      return res.status(400).json(error.message, "missing fields");
    }
    const contactUpdate = await updateContact(id, body);
    res.json({
      status: "success",
      code: 200,
      data: { contactUpdate },
    });
  } catch (err) {
    req.status(404).json(err, "Not found");
  }
});
