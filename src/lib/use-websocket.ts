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

export function useWebsocket() {
  const [cars, setCars] = useState<Car[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [clicks, setClicks] = useState(0);
  const conn = useRef<WebSocket | null>(null);

  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:25555");
    conn.current = websocket;
    let isReady = false;

    websocket.onmessage = (event) => {
      if (!isReady) {
        const handshake: Handshake = JSON.parse(event.data);
        setUser(handshake.user);
        setCars(handshake.cars);
        isReady = true;
        return;
      }

      const newCars = JSON.parse(event.data);
      setCars((prevCars) =>
        prevCars.map((car, index) => newCars[index] ?? car)
      );
    };

    return () => {
      websocket.close();
      conn.current = null;
    };
  }, [setCars]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCars(calculate);
    }, 1000 / 64);

    return () => clearInterval(interval);
  }, [setCars]);

  function click() {
    conn.current?.send("click");
    setClicks((prev) => prev + 1);
  }

  return { user, cars, click, clicks };
}
