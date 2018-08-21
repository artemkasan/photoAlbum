import "babel-polyfill";
import "isomorphic-fetch";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { hot } from 'react-hot-loader';

import { AppComponent } from './app';

const HotApp = hot(module)(AppComponent);

ReactDOM.render(<HotApp />, document.getElementById('root'));