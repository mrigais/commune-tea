import React, { useState } from 'react';
import socket from '../utils/socket';

const JoinChat = ({ onJoin }) => {
    const [username, setUsername] = useState('');
    const [room, setRoom] = useState('');

    const handleSubmit = (e) => {
        console.log(username, room, 'khelo')
        e.preventDefault();
        if (!username || !room) return alert('Both fields are required');
        socket.emit('joinChat', {username, room})
        onJoin({ username, room });
    };

    return (
        <div>
           
            <form style={styles.formContainer} onSubmit={handleSubmit}>
                 <h1>Join a Room!</h1>
            <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
            />
            <input
                type="text"
                placeholder="Enter room name"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                style={styles.input}
            />
            <button type="submit" style={styles.button}>
                Join
            </button>
        </form>

        </div>
        
    );
};

export default JoinChat;

const styles = {
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f9f9f9',
    },
    input: {
        padding: '10px',
        marginBottom: '10px',
        width: '250px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#007bff',
        color: '#fff',
    },
};