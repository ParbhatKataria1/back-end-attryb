const multer = require('multer');
const path = require('path');

const upload = multer({
    storage:multer.diskStorage({}),
    fileFilter:(req, file, cb)=>{
        let ext = path.extname(file.originalname);
        if(ext!='.jpg' && ext!='.png' && ext!='.jpeg'){
            cb(new Error('Error occured'), false);
            return ;
        }
        cb(null, true)
    }
})

module.exports = {upload}