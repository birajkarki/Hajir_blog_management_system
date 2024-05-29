import multer from "multer";
import path from "path";
import AppError from "../utils/AppError.js";

let limit = {
  fileSize: 1024 * 1024 * 3, //2Mb
};

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let staticFolder = "./public";

    cb(null, staticFolder);
  },

  filename: (req, file, cb) => {
    let fileName = Date.now() + file.originalname;
    cb(null, fileName);
  },
});

let fileFilter = (req, file, cb) => {
  let validExtensions = [
    ".jpeg",
    ".jpg",
    ".JPG",
    ".JPEG",
    ".png",
    ".svg",
    ".doc",
    ".pdf",
    ".mp4",
    ".PNG",
  ];

  let originalName = file.originalname;
  let originalExtension = path.extname(originalName); //note path module is inbuilt module(package) of node js (ie no need to install path package)
  let isValidExtension = validExtensions.includes(originalExtension);

  if (isValidExtension) {
    cb(null, true);
  } else {
    cb(new AppError("File is not supported", 401), false);
  }
};

const upload = multer({
  storage, //we define the location in server where the file is store and control the fileName
  fileFilter, //we filter (generally) according to extension
  limit, //we filter file according to its size
});

export default upload;

// vvvvvvvvvvvvvvvimp
//upload midddleware  does following thing
// 1) upload single image if upload.single is used  or upload multiple image if upload.multiple is used
//2) add body(to get req.body in file data you must use multer) and file(or files) to request ie you can get req.body and req.file
//3 note req.file for upload.singe and req.files for upload.array
//VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVIIIIIIMP
//you must use upload middler to get form data.

//in simpleword to use form data
//  add expressApp.use(urlencoded({ extended: true }));  at index.js file
//and use upload  middleware ( to get form data)

//to use this middleware
