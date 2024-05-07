export const RESOURCES_MORPHEUS = {
  cpu: 10 ^ 2,
  gpu: 1,
  memory: 10 ^ 8,
  storage: 10 ^ 11,
} as const;

export const DEPLOYMENT = {
  MORPHEUS: RESOURCES_MORPHEUS,
} as const;

export type Deployment = keyof typeof DEPLOYMENT;
