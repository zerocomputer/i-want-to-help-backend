const multer = require('multer');
const path = require('path');

function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|doc|docx|txt|pdf|xlsx/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
        return cb(null,true);
    } else {
        cb('Ошибка: файл с текущем расширением запрещён!');
    }
}

const storage = multer.diskStorage(
    {
        destination: function (req, file, cb) {
            cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    }
)

module.exports = multer(
    {
        storage: storage,
        fileFilter: (req, file, cb) => {
            checkFileType(file, cb);
        }
    }
);