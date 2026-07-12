// One value per Quartz process: stable within a build and different on every deployment.
export const buildAssetVersion = Date.now().toString(36)
