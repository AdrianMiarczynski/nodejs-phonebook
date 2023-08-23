import express from "express";

import { getContactById, listContacts } from "../../models/contacts.js";

export const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const contact = await listContacts();
    return res.json({
      status: "succes",
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
    console.log(req.params);
    console.log(id);
    return res.json({
      status: "succes",
      code: 200,
      data: { contacts },
    });
  } catch (err) {
    res.status(404).json({ message: "Not found" });
  }
});

router.post("/", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.delete("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.put("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});
