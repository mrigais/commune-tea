import React, { useCallback, useState } from 'react';
import JoinForm from './components/JoinChat';
import ChatApp from './components/ChatApp';

const App = () => {
    const [userInfo, setUserInfo] = useState(null);

    const handleJoin = useCallback(({ username, room }) => {
        console.log('hello there')
        setUserInfo({ username, room });
    },[userInfo]);

    return userInfo ? (
        <ChatApp username={userInfo.username} room={userInfo.room} />
    ) : (
        <JoinForm onJoin={handleJoin} />
    );
};

export default App;
