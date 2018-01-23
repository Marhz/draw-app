import io from 'socket.io-client';

const socket = io('http://192.168.0.34:8000');

export default socket;
