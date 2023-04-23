export async function fetch<T>(
  ...args: Parameters<typeof window.fetch>
): Promise<T> {
  const res = await window.fetch(...args);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return res.json() as Promise<T>;
}
