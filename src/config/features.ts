export const FEATURES = {
  ENABLE_SCHEDULED_SMS: true,
  ENABLE_DYNAMIC_TEMPLATES: true,
  ENABLE_ANALYTICS_DASHBOARD: true,
} as const;

export type FeatureKey = keyof typeof FEATURES;
