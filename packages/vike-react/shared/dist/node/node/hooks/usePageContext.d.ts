export { usePageContext };
export { PageContextProvider };
import React from 'react';
import type { PageContext } from 'vike/types';
declare function PageContextProvider({ pageContext, children }: {
    pageContext: PageContext;
    children: React.ReactNode;
}): React.JSX.Element;
/**
 * Access `pageContext` from any React component.
 *
 * https://vike.dev/usePageContext
 */
declare function usePageContext(): PageContext;
