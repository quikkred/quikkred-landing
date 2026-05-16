import { io, Socket } from "socket.io-client";
import { API_BASE_URL } from "@/lib/config";
import getToken from "@/lib/getToken";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (socket) return socket;

  socket = io(API_BASE_URL, {
    // socket.io reads this on every (re)connect, so the freshest token is used.
    auth: (cb) => {
      getToken()
        .then((token) => cb({ token }))
        .catch(() => cb({ token: null }));
    },
    transports: ["websocket", "polling"],
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  if (process.env.NODE_ENV !== "production") {
    socket.on("connect", () => console.log("[socket] connected:", socket!.id));
    socket.on("connect_error", (e) => console.warn("[socket] error:", e.message));
    socket.on("disconnect", (r) => console.log("[socket] disconnected:", r));
  }

  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}

// Call after token refresh so the new JWT rides the next handshake.
export function reconnectSocket() {
  disconnectSocket();
  return getSocket();
}
