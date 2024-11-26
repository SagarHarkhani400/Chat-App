import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ChatPage from './components/ChatPage';
import socketIO from 'socket.io-client';
import Login from './auth/Login';
import Register from './auth/Register'
import 'bootstrap/dist/css/bootstrap.min.css';

const socket = socketIO.connect('http://192.168.1.246:4000');

// Store user details in localStorage for persistence
const user = JSON.parse(sessionStorage.getItem('user')); // Replace 'user' with the actual localStorage key
if (user) {
    socket.emit('user-logged-in', user); // Notify the server the user has logged in
}

// Handle reconnects
socket.on('connect', () => {
    if (user) {
        socket.emit('user-logged-in', user); // Re-login user on reconnect
    }
});

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Login socket={socket} />}></Route>
          <Route path="/register" element={<Register socket={socket} />}></Route>
          {/* <Route path="/home" element={<Home socket={socket} />}></Route> */}
          <Route path="/chat" element={<ChatPage socket={socket} />}></Route>
          <Route path="/chat/:id" element={<ChatPage socket={socket} />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;