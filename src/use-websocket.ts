type Car = {
  speed: number;
  acceleration: number;
  position: number;
  lap: number;
};

export function useWebsocket() {}

function initWebsocket() {
  const websocket = new WebSocket("ws://localhost:25555");

  websocket.onmessage = (event) => {
    const cars = JSON.parse(event.data);

    
  };
}
