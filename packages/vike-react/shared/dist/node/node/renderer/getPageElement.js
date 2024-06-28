export { getPageElement };
import React from 'react';
import { PageContextProvider } from '../hooks/usePageContext.js';
function getPageElement(pageContext) {
    const { Page } = pageContext;
    let page = Page ? React.createElement(Page, null) : null;
    [
        // Inner wrapping
        ...(pageContext.config.Layout || []),
        // Outer wrapping
        ...(pageContext.config.Wrapper || [])
    ].forEach((Wrapper) => {
        page = React.createElement(Wrapper, null, page);
    });
    page = React.createElement(PageContextProvider, { pageContext: pageContext }, page);
    if (pageContext.config.reactStrictMode !== false) {
        page = React.createElement(React.StrictMode, null, page);
    }
    return page;
}
