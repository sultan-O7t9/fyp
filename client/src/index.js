import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import store from "./store/";
import "./index.css";
import { StyledEngineProvider } from "@mui/material";
// import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
ReactDOM.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <ReduxProvider store={store}>
        <BrowserRouter>
          {/* <LocalizationProvider dateAdapter={AdapterMoment}></LocalizationProvider> */}
          <App />
        </BrowserRouter>
      </ReduxProvider>
    </StyledEngineProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
