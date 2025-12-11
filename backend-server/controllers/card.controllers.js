const cardService = require("../services/card.services");
const express = require("express");
const router = express.Router();

exports.fetchPage = async (req, res) => {

    console.log(`[ROUTE] Yêu cầu GET /api/card/fetch-page đã nhận.`);
    const maxPageSize = 250;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    console.log(`[ROUTE] Tham số: page=${page}, pageSize=${pageSize}`);
    if(page < 1 || pageSize < 1 || pageSize > maxPageSize){
        console.warn(`[ROUTE] Tham số không hợp lệ. Trả về 400.`);
        return res.status(400).json({
            success: false,
            message: `Tham số page và pageSize không hợp lệ. page phải >= 1, pageSize phải trong khoảng 1-${maxPageSize}.`
        });
    }
    try{
        const result = await CardService.fetchPageAndSave(page, pageSize);
        console.log(`[ROUTE] Xử lý thành công. Tổng thẻ: ${result.count}`);
        return res.json({
            success: true,
            data: {
                page: page,
                pageSize: pageSize,
                totalCardsSaved: result.count,
                firstCardExample: result.firstCardName
            },
            message: `Lấy và lưu thẻ thành công ${result.count} thẻ tu Page ${page}!`
        });
        
    }catch(error){
        console.error("LỖI GỌI API & SAVE DB:", error); 
        
        return res.status(500).json({
            success: false,
            message: error.message || 'Lỗi server khi lấy và lưu thẻ.'
        });
    }
};

exports.fetchAllCards = async (req, res) => {
    console.log(`[ROUTE] Yêu cầu đồng bộ toàn bộ thẻ GET /api/card/fetch-all đã nhận.`);
    try{
        const result = await CardService.fetchAllCards();
        return res.json(result);
    }catch(error){
        console.error("LỖI GỌI API & SAVE DB:", error); 
        
        return res.status(500).json({
            success: false,
            message: error.message || 'Lỗi server khi lấy và lưu thẻ.'
        });
    }
};


