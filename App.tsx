import { FC } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./src/store/store";
import {
  createBrowserRouter,
  RouterProvider,
  RouteObject,
} from "react-router-dom";

type Props = {
  routes: RouteObject[]; // Accept routes as a prop
};

const App: FC<Props> = ({ routes }) => {
  const router = createBrowserRouter(routes); // Create router using the provided routes

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  );
};

export default App;
