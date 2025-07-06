// ChatButton.jsx
import React from 'react';
import './ChatbotStyles.css'; // Assuming styles are shared or you have a specific button style here

const ChatButton = ({ label, onClick, disabled = false }) => {
    return (
        <button
            className="chat-action-button"
            onClick={() => onClick(label)} // Pass the button's label back to the handler
            disabled={disabled}
        >
            {label}
        </button>
    );
};

export default ChatButton;