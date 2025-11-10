const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

exports.uploadPuzzleImage = upload.single('puzzleImage');

exports.handleUploadResult = (req, res) => {
    if (!req.file) {
        throw { status: 400, message: 'Không có file nào được tải lên.' };
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    return { message: 'Tải ảnh lên thành công!', imageUrl: imageUrl };
};
