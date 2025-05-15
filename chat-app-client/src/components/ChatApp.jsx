import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import { io } from 'socket.io-client';
import { useCallback } from 'react';
import socket from '../utils/socket';

const ChatApp = ({username, room}) => {
    console.log(username, room)
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        socket.connect();
        socket.on('message', (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.off('message');
        };
    }, []);

    const handleSendMessage = useCallback((e) => {
        console.log('hey hey hey')
        e.preventDefault();
        if (!message.trim()) return;

        setIsSending(true);

        socket.emit('sendMessage', message, (ack) => {
            console.log('Message ACK:', ack);
            setIsSending(false);
            setMessage('');
            inputRef.current?.focus();
        });
    },[message]);

    const handleShareLocation = () => {
        if (!navigator.geolocation) {
            return alert('Geolocation not supported by your browser');
        }

        setIsSharing(true);
        navigator.geolocation.getCurrentPosition((location) => {
            const coords = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };

            socket.emit('shareLocation', coords, (ack) => {
                console.log('Location ACK:', ack);
                setIsSharing(false);
            });
        });
    };

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}></div>

            <div style={styles.chatMain}>
                <div style={styles.chatWindow}>
                    {messages.map((msg, index) => (
    <div key={index} style={styles.message}>
        <div>
            <div style={styles.messageMeta}>
                {username} • {moment(msg.createdAt).format('h:mm a')}
                {/* insert a username here */}
            </div>
            {msg.text.startsWith('https://') ? (
                <a href={msg.text} target="_blank" rel="noopener noreferrer">
                    Shared Location
                </a>
            ) : (
                <div >{msg.text}</div>
            )}
        </div>
    </div>
))}
                </div>

                <form onSubmit={handleSendMessage} style={styles.inputForm}>
                    <input
                        type="text"
                        placeholder="Enter message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        ref={inputRef}
                        disabled={isSending}
                        style={styles.textInput}
                    />
                    <button type="submit" disabled={isSending} style={styles.button}>
                        {isSending ? 'Sending...' : 'Send'}
                    </button>
                    <button
                    onClick={handleShareLocation}
                    disabled={isSharing}
                    style={styles.button}
                >
                    {isSharing ? 'Sharing...' : 'Share Location'}
                </button>
                </form>
            </div>
        </div>
    );
};

export default ChatApp;
const styles = {
    container: {
        flex: 1,
        width: '100%',
        display: 'flex',
        height: '100vh',
        fontFamily: 'Arial, sans-serif',
    },
    sidebar: {
        flex: 0.4,
        backgroundColor: 'red',
        width: '200px',
        backgroundColor: '#f2f2f2',
        borderRight: '1px solid #ccc',
    },
    chatMain: {
        flex: 0.6,
        display: 'flex',
        flexDirection: 'column',
        padding: '10px',
    },
    chatWindow: {
        flex: 1,
        border: '1px solid #ccc',
        padding: '10px',
        overflowY: 'auto',
        marginBottom: '10px',
        background: '#fafafa',
    },
    message: {
        marginBottom: '8px',
        padding: '6px 8px',
        background: '#dbd4c5',
        borderRadius: '5px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timestamp: {
        fontSize: '0.8em',
        // color: '#777',
        marginLeft: '10px',
    },
    inputForm: {
        display: 'flex',
        gap: '10px',
    },
    textInput: {
        flexGrow: 1,
        padding: '8px',
    },
    button: {
        padding: '8px ',
    },
    messageMeta: {
    fontSize: '0.85em',
    color: '#555',
    marginBottom: '4px',
    fontWeight: 'bold',
}
};

