import { useEffect, useRef, useState } from "react";
import {
  MessageOut,
  Car,
  Handshake,
  MessageIn,
  calculate,
} from "../../server/shared";

export type { Car };

type ConnectionStatus = "connecting" | "open" | "closed";

export function useWebsocket(username: string) {
  const [cars, setCars] = useState<Car[]>([]);

  const [user, setUser] = useState<string | null>(null);
  const [clicks, setClicks] = useState(0);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const conn = useRef<WebSocket | null>(null);

  useEffect(() => {
    const websocket = new WebSocket(
      `ws://localhost:25555?username=${username}`
    );
    conn.current = websocket;

    function handshakeHandler(event: MessageEvent) {
      const handshake: Handshake = JSON.parse(event.data);
      setUser(handshake.user);
      setCars(handshake.cars);
      websocket.onmessage = messageHandler;
    }

    function messageHandler(event: MessageEvent) {
      const message: MessageOut = JSON.parse(event.data);

      if (message.type === "update") {
        setCars((prevCars) =>
          prevCars.map((car) => {
            const index = message.cars.findIndex(
              (c) => c.username === car.username
            );
            if (index !== -1) {
              return message.cars[index];
            }
            return car;
          })
        );
      } else if (message.type === "remove") {
        setCars((prevCars) =>
          prevCars.filter((car) => car.username !== message.username)
        );
      }
    }

    websocket.onmessage = handshakeHandler;
    websocket.onopen = () => setStatus("open");
    websocket.onclose = () => {
      setCars([]);
      setStatus("closed");
    };

    return () => {
      websocket.close();
      conn.current = null;
    };
  }, [setUser, setCars, username]);

  useEffect(() => {
    if (status !== "open") return;

    const interval = setInterval(() => {
      setCars((prev) => prev.map(calculate));
    }, 1000 / 64);

    return () => clearInterval(interval);
  }, [setCars, status]);

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
