export function problemFor(e: unknown) {
  if (e instanceof Error && e.message === "timeout")
    return "The server took too long. Try again...";
  if (e instanceof TypeError)
    return "No connection. Check your internet connection and try again...";
  if (e instanceof Error && e.message === "404")
    return "That list is not there anymore...";
  return "Something went wrong. Try again...";
}

export type Status = "loading" | "empty" | "error" | "content";
