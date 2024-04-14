import { useState } from "react";

export default function Login(props: { onLogin: (username: string) => void }) {
  const [username, setUsername] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    props.onLogin(username);
  }

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Weak leg clicker</h1>
        <div>
          <label>Twoja nazwa </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <button type="submit">Dołącz do gry</button>
      </form>
    </div>
  );
}
