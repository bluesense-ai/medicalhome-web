import ReactDOM from "react-dom/client";
import Modal from "react-modal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

Modal.setAppElement("#root");
// import App from "./App";
// import { BrowserRouter as Router } from "react-router-dom";

import App from "./App";
import AppRoutes from "./src/router";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <>
    <App routes={AppRoutes} /> {/* Pass routes to App */}
    <ToastContainer />
  </>
  // </React.StrictMode>
);
