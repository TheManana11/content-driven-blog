type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const MESSAGES: Record<string, string> = {
  created:
    "Post created — simulated: JSONPlaceholder doesn't save new posts, so it won't appear in the list.",
  updated:
    "Post updated — simulated: JSONPlaceholder doesn't save changes, so the original content is still shown.",
  deleted:
    "Post deleted — simulated: JSONPlaceholder doesn't delete data, so the post still appears.",
};

export async function StatusNotice({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { status } = await searchParams;
  const key = Array.isArray(status) ? status[0] : status;
  const message = key && Object.hasOwn(MESSAGES, key) ? MESSAGES[key] : null;
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
