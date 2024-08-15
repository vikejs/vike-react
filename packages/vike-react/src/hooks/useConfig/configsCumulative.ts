export const configsCumulative = ['Head', 'bodyAttributes', 'htmlAttributes'] as const
export type ConfigsCumulative = (typeof configsCumulative)[number]
