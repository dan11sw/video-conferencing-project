import { FC, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import Header from "src/components/Header/Header";
import Footer from "src/components/Footer/Footer";
import useRoutes from "src/routes/routes";
import { ToastContainer } from "react-toastify";
import store from "src/store/store";

// Стили
import 'react-toastify/dist/ReactToastify.css';

const App: FC<any> = () => {
  // @ts-ignore
  const routes = useRoutes();

  return (
    <>
      <BrowserRouter>
        <Header />
        {routes}
        <Footer />
        <ToastContainer
            position="bottom-left"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
      </BrowserRouter>
    </>
  );
};

export default App;
