import type React from 'react';
import type { JSX } from 'react';
import type ReactDOM from 'react-dom/client';
declare global {
    namespace Vike {
        interface PageContext {
            /** The root React component of the page */
            Page?: () => React.ReactNode;
            /** The user agent string of the user's browser */
            userAgent?: string;
            /** The root React element of the page */
            page?: JSX.Element;
            /** The React root DOM container */
            root?: ReactDOM.Root;
        }
    }
}
