export { ssrEffect };
import type { ConfigEffect } from 'vike/types';
declare function ssrEffect({ configDefinedAt, configValue }: Parameters<ConfigEffect>[0]): ReturnType<ConfigEffect>;
