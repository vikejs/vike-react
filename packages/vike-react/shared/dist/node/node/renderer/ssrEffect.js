export { ssrEffect };
function ssrEffect({ configDefinedAt, configValue }) {
    if (typeof configValue !== 'boolean')
        throw new Error(`${configDefinedAt} should be a boolean`);
    return {
        meta: {
            Page: {
                env: {
                    // Always load `Page` on the client-side.
                    client: true,
                    // When the SSR flag is false, we want to render the page only on the client-side.
                    // We achieve this by loading `Page` only on the client-side: when onRenderHtml()
                    // gets a `Page` value that is undefined it skip server-side rendering.
                    server: configValue !== false
                }
            }
        }
    };
}
