// Shows a short confirmation after a Server Action redirects with ?status=...
// For example, /?status=created shows "Post created."
function getMessage(status: string | undefined): string | null {
  if (status === "created") return "Post created.";
  if (status === "updated") return "Post updated.";
  if (status === "deleted") return "Post deleted.";
  return null;
}

export function StatusNotice({ status }: { status?: string }) {
  const message = getMessage(status);
  if (!message) return null;

  return (
    <div
      role="status"
      className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-100"
    >
      {message}
    </div>
  );
}
