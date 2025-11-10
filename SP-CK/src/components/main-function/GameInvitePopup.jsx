import React from 'react';

const GameInvitePopup = ({ invite, onAccept, onDecline }) => {
    if (!invite) return null;

    const { from, gameType } = invite;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 border border-purple-500 rounded-lg p-8 text-center shadow-2xl animate-fade-in">
                <h2 className="text-2xl font-bold text-white mb-2">Lời mời chơi game!</h2>
                <p className="text-gray-300 mb-6">
                    <span className="font-semibold text-purple-400">{from}</span> mời bạn chơi 
                    <span className="font-semibold text-green-400"> {gameType.charAt(0).toUpperCase() + gameType.slice(1)}</span>.
                </p>
                <div className="flex justify-center gap-4">
                    <button 
                        onClick={onAccept}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                    >
                        Chấp nhận
                    </button>
                    <button 
                        onClick={onDecline}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                    >
                        Từ chối
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameInvitePopup;