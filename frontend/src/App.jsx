import React, { useState, useEffect} from "react";
import Chat from "./components/Chat";
import "./App.css";
import Register from "./components/Register";
import socket from "./config/socket";
function App() {
  const [username, setUsername] = useState("");
  const [activeSessions, setActiveSessions] = useState(0);

  useEffect(() => {
    // Escuchar eventos de sesiones activas
    socket.on('activeSessions', (count) => {
      setActiveSessions(count);
    });

    return () => {
      socket.off('activeSessions'); // Eliminar el listener cuando el componente se desmonta
    };
  }, []);

  const handleRegistration = (username) => {
    setUsername(username);
  };

  // https://github.com/DeveloperMDCM

  return (
    <div className="App ">
      {username ? (
        <Chat username={username} UsersOnline={activeSessions}  />
      ) : (
        <Register onRegistration={handleRegistration} online={activeSessions}   />
      )}
    </div>
  );
}

export default App;
