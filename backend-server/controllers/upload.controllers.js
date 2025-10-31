const uploadService = require('../services/upload.services');

exports.uploadPuzzleImage = (req, res) => {
    uploadService.uploadPuzzleImage(req, res, function (err) {
        if (err) {
            console.error("Upload error:", err);
            return res.status(500).json({ 
                message: err instanceof Error ? `Lỗi khi upload file: ${err.message}` : 'Đã xảy ra lỗi không mong muốn' 
            });
        }

        try {
            const result = uploadService.handleUploadResult(req, res);
            res.status(200).json(result);
        } catch (error) {
            res.status(error.status || 500).json({ message: error.message || 'Server error' });
        }
    });
};
