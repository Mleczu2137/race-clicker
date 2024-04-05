import { useEffect, useMemo, useRef, useState } from "react";
import {
  MessageOut,
  Car,
  Handshake,
  MessageIn,
  calculate,
  TICK_RATE,
} from "../../server/shared";

export type { Car };

type ConnectionStatus = "connecting" | "open" | "closed";

type Update = {
  tick: number;
  cars: Car[];
};

export function useWebsocket(username: string) {
  const [cars, setCars] = useState<Car[]>([]);
  const [user, setUser] = useState<string | null>(null);
  const [clicks, setClicks] = useState(0);

  const conn = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const tick = useRef(2);
  const updates = useRef<Update[]>([]);

  const userCar = useMemo(() => {
    const index = cars.findIndex((c) => c.username == user);
    if (index === -1) {
      return null;
    }
    return cars[index];
  }, [cars, user]);

  useEffect(() => {
    const websocket = new WebSocket(
      `ws://localhost:25555?username=${username}`
    );
    conn.current = websocket;

    function handshakeHandler(event: MessageEvent) {
      const handshake: Handshake = JSON.parse(event.data);
      setUser(handshake.user);
      setCars(handshake.cars);
      tick.current = handshake.tick;
      websocket.onmessage = messageHandler;
    }

    function messageHandler(event: MessageEvent) {
      const message: MessageOut = JSON.parse(event.data);

      if (message.type === "update") {
        message.tick += 16;
        console.log("update 16", message);
        updates.current.push(message);

        // if (message.tick > tick.current) {
        //   updates.current.push(message);
        // } else {
        //   setCars((prevCars) =>
        //     prevCars.map((car) => {
        //       const index = message.cars.findIndex(
        //         (c) => c.username === car.username
        //       );
        //       if (index !== -1) {
        //         return message.cars[index];
        //       }
        //       return car;
        //     })
        //   );
        // }
      } else if (message.type === "sync") {
        if (message.tick !== tick.current) {
          console.log(
            "dropped",
            "server",
            message.tick,
            "client",
            tick.current
          );
          tick.current = message.tick;
        }
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
      setUser(null);
      setClicks(0);
      setStatus("closed");
      tick.current = 2;
    };

    return () => {
      websocket.close();
      conn.current = null;
    };
  }, [username]);

  useEffect(() => {
    if (status !== "open") return;

    const interval = setInterval(() => {
      setCars((prev) => {
        const update = updates.current[0];

        //let data = prev;
        if (update && update.tick <= tick.current) {
          updates.current.shift();
          // data = prev.map((car) => {
          //   const index = update.cars.findIndex(
          //     (c) => c.username === car.username
          //   );
          //   if (index !== -1) {
          //     return update.cars[index];
          //   }
          //   return car;
          // });
          console.log("działą", update.cars);
          return update.cars.map((car) => {
            console.log("działasz?");
            return calculate(car);
          });
        }

        return prev.map((car) => calculate(car));
      });

      tick.current++;
    }, 1000 / TICK_RATE);

    return () => clearInterval(interval);
  }, [status]);

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

  return { status, user, userCar, cars, click, clicks, upgrade };
}
