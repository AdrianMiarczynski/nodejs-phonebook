import express from "express";

import {
  addContact,
  getContactById,
  listContacts,
  removeContact,
  updateContact,
} from "../../models/contacts.js";

export const router = express.Router();

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
    const contact = await addContact(data);
    res.json({
      status: "success",
      code: 200,
      data: { contact },
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
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
  console.log(id);
  const body = req.body;
  try {
    const contactUpdate = await updateContact(id, body);
    res.json({
      status: "success",
      code: 200,
      data: { contactUpdate },
    });
  } catch (err) {
    req.status(500).json(err);
  }
});
