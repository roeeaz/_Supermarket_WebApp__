import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";



const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
        <Provider store={store}>
            <PayPalScriptProvider options={{ clientId: "AbOuxFx6uBlitWycSiMI54diRWXNb2Q_ZSLKv75OUbo2VfXtGW_vJC1Y5TjjHBDi_P6UcxsaPMc-99A0", currency: "ILS" }}>
                <App />
            </PayPalScriptProvider>
        </Provider>
    </React.StrictMode>,
);

reportWebVitals();
