import { useEffect, useRef, useState } from "react";
import {
  MessageOut,
  Car,
  Handshake,
  MessageIn,
  User,
  CarClient,
} from "../../server/shared";

export type { Car };

type ConnectionStatus = "connecting" | "open" | "closed";

export function useWebsocket(username: string) {
  const [user, setUser] = useState<User>({} as any);
  const [cars, setCars] = useState<CarClient[]>([]);
  const [clicks, setClicks] = useState(0);

  const conn = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");

  useEffect(() => {
    const websocket = new WebSocket(
      `ws://localhost:25555?username=${username}`
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
      } else if (message.type === "remove") {
        setCars((prevCars) =>
          prevCars.filter((car) => car.username !== message.username)
        );
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

  function click() {
    conn.current?.send(JSON.stringify({ type: "click" }));
    setClicks((prev) => prev + 1);
  }

  function upgrade(upgrade: "aerodynamics" | "velocity" | "mass" | "tempo") {
    const message: MessageIn = {
      type: "upgrade",
      name: upgrade,
    };
    conn.current?.send(JSON.stringify(message));
  }

  return { status, user, cars, click, clicks, upgrade };
}
