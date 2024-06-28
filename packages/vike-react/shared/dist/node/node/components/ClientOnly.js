export { ClientOnly };
import React, { lazy, useEffect, useState, startTransition } from 'react';
function ClientOnly({ load, children, fallback, deps = [] }) {
    const [Component, setComponent] = useState(null);
    useEffect(() => {
        const loadComponent = () => {
            const Component = lazy(() => load()
                .then((LoadedComponent) => {
                return {
                    default: () => children('default' in LoadedComponent ? LoadedComponent.default : LoadedComponent)
                };
            })
                .catch((error) => {
                console.error('Component loading failed:', error);
                return { default: () => React.createElement("p", null, "Error loading component.") };
            }));
            setComponent(Component);
        };
        startTransition(() => {
            loadComponent();
        });
    }, deps);
    return Component ? React.createElement(Component, null) : fallback;
}
