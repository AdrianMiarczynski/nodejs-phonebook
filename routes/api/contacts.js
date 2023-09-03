import express from "express";

import {
  addContact,
  getContactById,
  listContacts,
  removeContact,
  updateContact,
  updateStatusContact,
} from "../../models/contacts.js";

export const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    return res.json({
      status: "success",
      code: 200,
      data: { contacts },
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const contact = await getContactById(id);
    return res.json({
      status: "success",
      code: 200,
      data: { contact },
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
router.patch("/:id", async (req, res, next) => {
  const { id } = req.params;
  const body = req.body;
  const favorite = req.body.favorite;

  if (!("favorite" in body)) {
    return res.status(400).json({ message: "missing field favorite" });
  }
  try {
    const contact = await updateStatusContact(id, favorite);
    return res.status(200).json({
      status: "success",
      code: 200,
      data: { contact },
    });
  } catch (err) {
    req.status(404).json(err, "Not found");
  }
});
