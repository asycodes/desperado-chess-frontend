import { Client } from "@stomp/stompjs";

const WS_URL =
  import.meta.env.VITE_WS_URL ?? import.meta.env.VITE_API_URL.replace(/^http/, "ws") + "/ws";

/** Subscribes to a STOMP topic and returns a function that disconnects. */
export function subscribeToTopic(topic: string, onMessage: (body: unknown) => void): () => void {
    const client = new Client({
    brokerURL: WS_URL,
    reconnectDelay: 3000,
    });
    client.onConnect = () => {
    client.subscribe(topic, (message) => onMessage(JSON.parse(message.body)));
    };
    client.activate();
    return () => {
    void client.deactivate();
    };
}