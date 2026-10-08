export function getApiErrorMessage(error: Record<string, string[]>, fallback: string): string {
  const firstFieldError = error ? Object.values(error).flat()[0] : undefined;

  return firstFieldError ?? fallback;
}