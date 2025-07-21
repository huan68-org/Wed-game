import React from 'react';

// Đây là component CaroPage "giả" để thực hiện thí nghiệm.
const CaroPage = ({ onBack }) => {

    const handleTestBackClick = () => {
        if (typeof onBack === 'function') {
            alert('Thí nghiệm thành công! Prop "onBack" đã được truyền vào đúng.');
            onBack(); // Thực thi hàm quay lại
        } else {
            alert('LỖI: Prop "onBack" KHÔNG phải là một hàm.');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#111827',
            color: 'white',
            padding: '50px',
            fontSize: '24px',
            textAlign: 'center',
            fontFamily: 'sans-serif'
        }}>
            <h1 style={{color: '#60A5FA', fontSize: '48px'}}>Thí Nghiệm Cô Lập</h1>
            <p style={{ marginTop: '20px', color: '#9CA3AF', lineHeight: '1.6' }}>
                Nếu bạn thấy trang này và không có lỗi trong Console,
                <br />
                điều đó chứng minh logic trong `MainApp.js` của bạn là **HOÀN HẢO**.
            </p>
            <p style={{ marginTop: '20px', color: '#9CA3AF', lineHeight: '1.6' }}>
                Vấn đề 100% nằm trong code cũ của `CaroPage.jsx` hoặc các file nó import (như `useCaroGameSocket.jsx`).
            </p>
            <button 
                onClick={handleTestBackClick} 
                style={{ 
                    padding: '15px 30px', 
                    marginTop: '40px', 
                    background: 'linear-gradient(to right, #4F46E5, #EC4899)', 
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '18px',
                    cursor: 'pointer'
                }}
            >
                Bấm để Test nút "Quay lại"
            </button>
        </div>
    );
};

export default CaroPage;