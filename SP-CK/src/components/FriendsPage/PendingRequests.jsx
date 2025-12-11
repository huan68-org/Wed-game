import React from 'react';
import { useFriends } from '../../context/FriendsContext';

const PendingRequests = () => {
    const { requests, respondToFriendRequest, isLoading } = useFriends();

    const received = requests.filter(r => r.status === 'pending' || r.status === 'pending_received');
    const sent = requests.filter(r => r.status === 'sent' || r.status === 'pending_sent');

    if (isLoading) {
        return <div className="loading-container">
             <i className='bx bx-loader-alt bx-spin'></i> Đang tải dữ liệu...
        </div>;
    }

    return (
        <div className="requests-container">
            <style jsx>{`
                .requests-container { width: 100%; }
                .loading-container { 
                    color: #a78bfa; 
                    display: flex; 
                    align-items: center; 
                    gap: 10px; 
                    font-size: 1.1rem;
                }
                .section-title {
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: rgba(255, 255, 255, 0.9);
                    margin: 30px 0 15px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                .section-title:first-child { margin-top: 0; }
                .section-title i { color: #ec4899; }
                .badge {
                    background: rgba(236, 72, 153, 0.2);
                    color: #ec4899;
                    padding: 2px 10px;
                    border-radius: 12px;
                    font-size: 0.8rem;
                }
                
                .req-list { display: flex; flex-direction: column; gap: 12px; }
                .req-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 16px;
                    transition: all 0.3s ease;
                }
                .req-item:hover {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: rgba(167, 139, 250, 0.3);
                    transform: translateX(5px);
                }
                
                .user-wrapper { display: flex; align-items: center; gap: 12px; }
                .avatar {
                    width: 40px; height: 40px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #3b82f6, #06b6d4);
                    display: flex; align-items: center; justify-content: center;
                    font-weight: bold; color: white;
                }
                .username { font-weight: 600; color: white; font-size: 1.1rem; }
                
                .actions { display: flex; gap: 10px; }
                .btn {
                    padding: 8px 16px;
                    border-radius: 8px;
                    border: none;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s ease;
                    display: flex; align-items: center; gap: 6px;
                }
                .btn-accept {
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                    box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
                }
                .btn-accept:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(16, 185, 129, 0.4); }
                
                .btn-decline {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                    border: 1px solid rgba(239, 68, 68, 0.3);
                }
                .btn-decline:hover { background: rgba(239, 68, 68, 0.2); }
                
                .status-waiting {
                    color: rgba(255, 255, 255, 0.4);
                    font-style: italic;
                    font-size: 0.9rem;
                    display: flex; align-items: center; gap: 6px;
                }
                .empty-text { color: rgba(255, 255, 255, 0.3); font-style: italic; margin-top: 10px; }
            `}</style>
            
            <div>
                <h4 className="section-title">
                    <i className='bx bx-envelope-open'></i>
                    Lời mời kết bạn <span className="badge">{received.length}</span>
                </h4>
                <div className="req-list">
                    {received.length === 0 
                        ? <p className="empty-text">Chưa có lời mời nào.</p> 
                        : received.map(req => (
                            <div key={req.id || req.username} className="req-item">
                                <div className="user-wrapper">
                                    <div className="avatar">{req.username.charAt(0).toUpperCase()}</div>
                                    <span className="username">{req.username}</span>
                                </div>
                                <div className="actions">
                                    <button onClick={() => respondToFriendRequest(req.username, 'accept')} className="btn btn-accept">
                                        <i className='bx bx-check'></i> Chấp nhận
                                    </button>
                                    <button onClick={() => respondToFriendRequest(req.username, 'decline')} className="btn btn-decline">
                                        <i className='bx bx-x'></i> Từ chối
                                    </button>
                                </div>
                            </div>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '40px' }}>
                <h4 className="section-title">
                    <i className='bx bx-send'></i>
                    Đã gửi lời mời <span className="badge" style={{background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6'}}>{sent.length}</span>
                </h4>
                <div className="req-list">
                    {sent.length === 0 
                        ? <p className="empty-text">Bạn chưa gửi lời mời nào.</p> 
                        : sent.map(req => (
                             <div key={req.id || req.username} className="req-item">
                                <div className="user-wrapper">
                                    <div className="avatar" style={{background: 'linear-gradient(135deg, #a78bfa, #ec4899)'}}>
                                        {req.username.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="username">{req.username}</span>
                                </div>
                                <span className="status-waiting">
                                    <i className='bx bx-loader-circle bx-spin'></i> Đang chờ
                                </span>
                            </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PendingRequests;