import Echo from "laravel-echo";
import Pusher from "pusher-js";

(window as any).Pusher = Pusher;

export const echo = new Echo({
  broadcaster: "pusher",
  key: import.meta.env.VITE_PUSHER_KEY,
  cluster: import.meta.env.VITE_PUSHER_CLUSTER,
  forceTLS: true,

  // Jika pakai private channel + Sanctum cookie-based:
  // authEndpoint: import.meta.env.VITE_API_BASE_URL + "/broadcasting/auth",
  // withCredentials: true,

  // Jika mau kirim Bearer untuk auth private channel:
  authorizer: (channel) => ({
    authorize: (socketId, callback) => {
      fetch(import.meta.env.VITE_API_BASE_URL + "/broadcasting/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          socket_id: socketId,
          channel_name: channel.name,
        }),
      })
        .then((r) => r.json())
        .then((data) => callback(false, data))
        .catch((err) => callback(true, err));
    },
  }),
});
