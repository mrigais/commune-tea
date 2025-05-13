import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

// Connect to your Node server (make sure port matches your server)
const socket = io('http://localhost:3000');

const ChatApp = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const inputRef = useRef(null);

    // Listen to incoming messages
    useEffect(() => {
        socket.on('message', (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.off('message');
        };
    }, []);

    // Handle message form submit
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        setIsSending(true);

        socket.emit('sendMessage', message, (ack) => {
            console.log('Message ACK:', ack);
            setIsSending(false);
            setMessage('');
            inputRef.current?.focus();
        });
    };

    // Handle location share
    const handleShareLocation = () => {
        if (!navigator.geolocation) {
            return alert('Geolocation not supported by your browser');
        }

        setIsSharing(true);
        navigator.geolocation.getCurrentPosition((pos) => {
            const coords = {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude
            };

            socket.emit('shareLocation', coords, (ack) => {
                console.log('Location ACK:', ack);
                setIsSharing(false);
            });
        });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Chat App</h2>

            <div
                style={{
                    border: '1px solid #ccc',
                    padding: '10px',
                    height: '300px',
                    overflowY: 'scroll',
                    marginBottom: '10px'
                }}
            >
                {messages.map((msg, index) =>
                    msg.startsWith('https://') ? (
                        <div key={index}>
                            <a href={msg} target="_blank" rel="noopener noreferrer">
                                Shared Location
                            </a>
                        </div>
                    ) : (
                        <div key={index}>{msg}</div>
                    )
                )}
            </div>

            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="Enter message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    ref={inputRef}
                    disabled={isSending}
                    style={{ flexGrow: 1, padding: '8px' }}
                />
                <button type="submit" disabled={isSending}>
                    {isSending ? 'Sending...' : 'Send'}
                </button>
            </form>

            <button
                onClick={handleShareLocation}
                disabled={isSharing}
                style={{ marginTop: '10px' }}
            >
                {isSharing ? 'Sharing...' : 'Share Location'}
            </button>
        </div>
    );
};

export default ChatApp;
