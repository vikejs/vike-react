export { ClientOnly };
import React, { useEffect } from 'react';
import type { ReactNode } from 'react';
declare function ClientOnly<T>({ load, children, fallback, deps }: {
    load: () => Promise<{
        default: React.ComponentType<T>;
    } | React.ComponentType<T>>;
    children: (Component: React.ComponentType<T>) => ReactNode;
    fallback: ReactNode;
    deps?: Parameters<typeof useEffect>[1];
}): string | number | boolean | Iterable<React.ReactNode> | React.JSX.Element | null | undefined;
