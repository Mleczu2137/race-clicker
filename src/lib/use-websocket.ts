import { useEffect, useRef, useState } from "react";
import { calculate } from "./util";

type Car = {
  speed: number;
  acceleration: number;
  position: number;
  lap: number;
};

type User = {
  id: number;
};

type Handshake = {
  user: User;
  cars: Car[];
};

type ConnectionStatus = "connecting" | "open" | "closed";

export function useWebsocket() {
  const [cars, setCars] = useState<Car[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [clicks, setClicks] = useState(0);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const conn = useRef<WebSocket | null>(null);

  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:25555");
    conn.current = websocket;

    function handshakeHandler(event: MessageEvent) {
      const handshake: Handshake = JSON.parse(event.data);
      setUser(handshake.user);
      setCars(handshake.cars);
      websocket.onmessage = messageHandler;
    }

    function messageHandler(event: MessageEvent) {
      const newCars = JSON.parse(event.data);
      setCars((prevCars) =>
        prevCars.map((car, index) => newCars[index] ?? car)
      );
    }

    websocket.onmessage = handshakeHandler;
    websocket.onopen = () => setStatus("open");
    websocket.onclose = () => setStatus("closed");

    return () => {
      websocket.close();
      conn.current = null;
    };
  }, [setUser, setCars]);

  useEffect(() => {
    if (status !== "open") return;

    const interval = setInterval(() => {
      setCars(calculate);
    }, 1000 / 64);

    return () => clearInterval(interval);
  }, [setCars, status]);

  function click() {
    conn.current?.send("click");
    setClicks((prev) => prev + 1);
  }

  return { status, user, cars, click, clicks };
}
