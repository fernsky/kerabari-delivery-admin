export function getRequiredEnvVar(varName: string): string {
  const value = process.env[varName];
  if (value === undefined) {
    throw new Error(`Environment variable ${varName} is not set.`);
  }
  return value;
}
