export async function wait(millis: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), millis);
  });
}
