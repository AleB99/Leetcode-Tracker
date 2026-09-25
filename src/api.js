const Api = {
  async listEntries() {
    const res = await fetch("/api/entries");
    if (!res.ok) throw new Error("Failed to load entries.");
    return res.json();
  },
};
