export async function handleTriggerEvent(
  event: { text: string; user: string },
  currFn: (args: unknown) => unknown,
  nextFn: (args: unknown) => unknown
) {
  // Update to the next trigger or action in the chain
  try {
    const newPageProperties = await currFn(event);
    await nextFn(newPageProperties);
    console.log("Notion database updated with new message");
  } catch (error) {
    console.error("Error updating Notion database:", error);
  }
}
