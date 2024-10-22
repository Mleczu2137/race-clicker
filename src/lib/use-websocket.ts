import { useCallback, useEffect, useRef, useState } from "react";
import {
  MessageOut,
  Handshake,
  MessageIn,
  User,
  CarClient,
} from "../../server/shared";

type ConnectionStatus = "connecting" | "open" | "closed";

const address = process.env.IP_ADDRESS

export function useWebsocket(username: string) {
  const [user, setUser] = useState<User>({} as any);
  const [cars, setCars] = useState<CarClient[]>([]);
  const [clicks, setClicks] = useState(0);

  const conn = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");

  useEffect(() => {
    const websocket = new WebSocket(
      `${address}?username=${username}`
    );
    conn.current = websocket;

    function handshakeHandler(event: MessageEvent) {
      const handshake: Handshake = JSON.parse(event.data);
      websocket.onmessage = messageHandler;
      setUser(handshake.user);
      setCars(handshake.cars);
      setStatus("open");
    }

    function messageHandler(event: MessageEvent) {
      const message: MessageOut = JSON.parse(event.data);

      if (message.type === "update") {
        setCars(message.cars);
      } else if (message.type === "user") {
        setUser((prev) => ({ ...prev, ...message }));
      }
    }

    websocket.onmessage = handshakeHandler;
    websocket.onclose = () => {
      setCars([]);
      setClicks(0);
      setStatus("closed");
    };

    return () => {
      websocket.close();
      conn.current = null;
    };
  }, [username]);

  const click = useCallback(() => {
    conn.current?.send(JSON.stringify({ type: "click" }));
    setClicks((prev) => prev + 1);
  }, []);

  const upgrade = useCallback(
    (upgrade: "aerodynamics" | "velocity" | "mass" | "tempo") => {
      const message: MessageIn = {
        type: "upgrade",
        name: upgrade,
      };
      conn.current?.send(JSON.stringify(message));
    },
    []
  );

  return { status, user, cars, click, clicks, upgrade };
}
