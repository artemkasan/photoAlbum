import "babel-polyfill";
import "isomorphic-fetch";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { hot } from 'react-hot-loader';

import { AppComponent } from './app';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {  
        try {
            const registration = await navigator.serviceWorker.register('/dist/serviceWorker.js');
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }
        catch (err) {
            console.log('ServiceWorker registration failed: ', err);
        }
    });
}

const HotApp = hot(module)(AppComponent);

ReactDOM.hydrate(<HotApp />, document.getElementById('root'));