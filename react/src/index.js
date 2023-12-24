import React from "react";
import ReactDOM from "react-dom";


import App from "./App";
import { createRoot } from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.css";
import "remixicon/fonts/remixicon.css";
import { ContextProvider } from "./components/Context/ContextProvider";
import { RouterProvider } from "react-router-dom";
import Routers from "./routes/Routers";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <ContextProvider>
      <BrowserRouter>
          <App />
      </BrowserRouter>
    </ContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <ContextProvider>
//       <RouterProvider router={Routers} />
//     </ContextProvider>
//   </React.StrictMode>
// );
