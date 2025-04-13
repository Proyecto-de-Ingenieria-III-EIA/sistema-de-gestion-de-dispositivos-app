/**
 * Feature flags to control the availability of features in the application
 */

export const FeatureFlags = {
  /**
   * When enabled, the application will use the atomic design component structure.
   * If disabled, the application will fall back to the original component structure.
   * This allows for a gradual transition to the new component organization.
   */
  ATOMIC_DESIGN: true,

  /**
   * Feature flag status for each atomic design phase
   * These can be toggled to gradually introduce atomic design components
   */
  ATOMIC_DESIGN_PHASES: {
    ATOMS: true,
    MOLECULES: false,
    ORGANISMS: false,
    TEMPLATES: false,
  }
};

/**
 * Helper function to check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof FeatureFlags): boolean {
  return FeatureFlags[feature] === true;
}

/**
 * Helper function to check if an atomic design phase is enabled
 */
export function isAtomicPhaseEnabled(phase: keyof typeof FeatureFlags.ATOMIC_DESIGN_PHASES): boolean {
  if (!isFeatureEnabled('ATOMIC_DESIGN')) {
    return false;
  }
  return FeatureFlags.ATOMIC_DESIGN_PHASES[phase] === true;
} 