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
  const conn = useRef<WebSocket | null>(null);

  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:25555");
    conn.current = websocket;
    let isReady = false;

    websocket.onmessage = (event) => {
      if (!isReady) {
        console.log("handshake");
        const handshake: Handshake = JSON.parse(event.data);
        setUser(handshake.user);
        setCars(handshake.cars);
        isReady = true;
        console.log(handshake);
        return;
      }

      const newCars = JSON.parse(event.data);
      setCars((prevCars) => {
        return prevCars.map((car, index) => newCars[index] ?? car);
      });
    };

    return () => {
      websocket.close();
      conn.current = null;
      isReady = false;
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
  }

  return { user, cars, click };
}
