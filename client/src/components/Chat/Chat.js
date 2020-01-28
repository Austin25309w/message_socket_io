import React, { useEffect, useState } from 'react';
import './Chat.css';
import queryString from 'query-string';
import io from 'socket.io-client';

let socket;


const Chat = ({location}) => {
    const [name, setName] = useState('');
    const[room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const ENDPOINT = 'localhost:3001';

    useEffect(() => {
        const {name, room} = queryString.parse(location.search);

        socket = io(ENDPOINT);

        setName(room);
        setName(name);

        socket.emit('join', {name, room}, (error) => {
            if(error){
                alert(error);
            }
        });
    }, [ENDPOINT, location.search])



    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        })
    }, [messages]);
    // function for sending messages
    const sendMessage = (event) => {
        event.preventDefault();
    }
    if(message) {
        socket.emit('sendMessage', message, () => sendMessage(''))
    }

    console.log(message, messages);


    return(
        <div className="joinOuterContainer">
            <div className="container">
                <input 
                    value = {message} 
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyPress={event => event.key === "Enter" ? sendMessage(event) : null}
                />
            </div>
        </div>
    )
}

export default Chat;