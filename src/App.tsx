import "./App.css";
import { useState } from "react";
import Login from "./Login";
import Game from "./Game";

function App() {
  const [username, setUsername] = useState("");

  return (
    <main>
      {username === "" ? (
        <Login onLogin={(u) => setUsername(u)} />
      ) : (
        <Game username={username} />
      )}
    </main>
  );
}

export default App;
