import { ssrEffect } from './renderer/ssrEffect.js';
import './types/index.js';
declare const _default: {
    name: string;
    require: {
        vike: string;
    };
    onRenderHtml: "import:vike-react/renderer/onRenderHtml:onRenderHtml";
    onRenderClient: "import:vike-react/renderer/onRenderClient:onRenderClient";
    passToClient: string[];
    clientRouting: true;
    hydrationCanBeAborted: true;
    meta: {
        Head: {
            env: {
                server: true;
            };
        };
        Layout: {
            env: {
                server: true;
                client: true;
            };
            cumulative: true;
        };
        title: {
            env: {
                server: true;
                client: true;
            };
        };
        favicon: {
            env: {
                server: true;
                client: true;
            };
        };
        lang: {
            env: {
                server: true;
                client: true;
            };
        };
        ssr: {
            env: {
                config: true;
            };
            effect: typeof ssrEffect;
        };
        stream: {
            env: {
                server: true;
            };
        };
        streamIsRequired: {
            env: {
                server: true;
            };
        };
        onBeforeRenderClient: {
            env: {
                client: true;
            };
        };
        onAfterRenderClient: {
            env: {
                client: true;
            };
        };
        Wrapper: {
            cumulative: true;
            env: {
                client: true;
                server: true;
            };
        };
        name: {
            env: {
                config: true;
            };
        };
        require: {
            env: {
                config: true;
            };
        };
        reactStrictMode: {
            env: {
                client: true;
                server: true;
            };
        };
    };
};
export default _default;
