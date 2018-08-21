import * as React from "react";
import { renderToString } from 'react-dom/server';

import { createServerRenderer, RenderResult } from 'aspnet-prerendering';

import { AppComponent } from './app';

function decode(str: string ) {
	return str.replace(/&#(\d+);/g, (match, dec) =>
	{
		return String.fromCharCode(dec);
	});
}
export default createServerRenderer(params =>
{
	return new Promise<RenderResult>((resolve, reject) => {

		const basename = params.baseUrl.substring(0, params.baseUrl.length - 1); // Remove trailing slash

		const routerContext: any = {};
		const app = (
			<AppComponent>
			</AppComponent>);

		const renderedHtml = decode(renderToString(app));

		// If there's a redirection, just send this information back to the host application
		if (routerContext.url)
		{
			resolve({ redirectUrl: routerContext.url });
			return;
		}

		resolve({
			html: renderedHtml,
			globals: { initialState: {} }
		});
	});
});