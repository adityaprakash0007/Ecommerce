import multer from 'multer';

const storage = multer.memoryStorage();


// for single upload
export const singleUpload = multer({storage}).single('file')

//for multiple upload upto 5 images...
export const multipleUpload = multer({storage}).array('files',10)