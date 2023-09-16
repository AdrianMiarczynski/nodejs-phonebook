import multer from "multer";

const storage = multer.diskStorage({
  destination: "tmp",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage: storage,
});
