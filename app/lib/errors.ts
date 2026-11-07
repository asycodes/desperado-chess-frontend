export function getErrorMessage(err: unknown): string {
  if (typeof err === "object" && err !== null && "data" in err) {
    const data = (err as { data?: { message?: string } }).data;
    if (data?.message) return data.message;
  }
  return "Something went wrong. Please try again.";
}