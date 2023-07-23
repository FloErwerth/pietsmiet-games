import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { io, Socket } from "socket.io-client";
import { IncommingMessages, OutgoingMessages } from "../../backend";
import { App } from "@/App.tsx";
import { TooltipProvider } from "@/components/ui/tooltip.tsx";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

export const socket: Socket<OutgoingMessages, IncommingMessages> = io(
  `http://localhost:5121`,
  { autoConnect: true, forceNew: false },
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <TooltipProvider>
          <App />
        </TooltipProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
