export const configsCumulative = ['Head', 'bodyAttributes', 'htmlAttributes', 'rootAttributes'] as const
export type ConfigsCumulative = (typeof configsCumulative)[number]
