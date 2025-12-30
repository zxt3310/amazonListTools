import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const echoConfig = {
  broadcaster: "pusher",
  key: "90d548917a736f8c6e77",
  // wsHost: 'ws.pusher.com',
  // wsPort: 6001,
  forceTLS: true,
  // disableStats: true,
  // enabledTransports: ['ws', 'wss'],
  cluster: "mt1"
};

export default new Echo(echoConfig);
