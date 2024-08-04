import multer from "multer";
import { nanoid } from "nanoid";
import { AppError } from "../utils/appError.js";
import path from "path";
import fs from "fs";
//*================================================================
export const validExtension = {
  image: ["image/png", "image/jpg", "image/jpeg"],
  video: ["video/mp4", "video/mkv", "video/avi", "video/mov"],
  pdf: ["application/pdf"],
};
//?==================
export const multerLocal = (
  customValidation = ["image/png"],
  customPath = "generals"
) => {
  const allPath = path.resolve(`uploads/${customPath}`); //resolve the path to the uploads directory
  if (!fs.existsSync(allPath)) {
    fs.mkdirSync(allPath, { recursive: true }); // create folder if it doesn't exist
  }
  //?==================
  // ! 1->destination
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, allPath);
    },
    //?==================
    // ! 2->filename
    filename: function (req, file, cb) {
      cb(null, nanoid(4) + file.originalname);
    },
  });
  //?==================
  //! fileFilter
  const fileFilter = (req, file, cb) => {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError("file not supported"), false);
    }
  };
  //?==================
  const upload = multer({ fileFilter, storage });
  return upload;
};

//!================================================================
export const multerHost = (customValidation = ["image/png"]) => {
  //?==================
  //👇👇 leave this in here => to return(destination,filename,path) to cloudinary
  //👇👇 if not =>data will be stored in MemoryStorage as Buffer
  const storage = multer.diskStorage({});
  //?==================
  const fileFilter = (req, file, cb) => {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError("file not supported"), false);
    }
  };
  //?==================
  const upload = multer({ fileFilter, storage });
  return upload;
};

//*================================================================
// ? single =>Accept a single file with the name field name. The single file will be stored in (req.file)
// ? array(fieldname [, maxCount] ) =>Accept an array of files, all with the name fieldname. The array of files will be stored in (req.files)
// ? fields =>Accept a mix of files, specified by fields. The array of files will be stored in (req.files)
// ? none =>Accept only text fields. The text will be stored in (req.body)
// ? any =>Accept any file. The file will be stored in (req.file)
//*================================================================
