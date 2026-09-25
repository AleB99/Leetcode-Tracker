const Api = {
  async listEntries() {
    const res = await fetch("/api/entries");
    if (!res.ok) throw new Error("Failed to load entries.");
    return res.json();
  },
  async updateEntry(id, payload) {
    const res = await fetch("/api/entries/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update entry.");
    return data;
  },
  async deleteEntry(id) {
    const res = await fetch("/api/entries/" + id, { method: "DELETE" });
    if (!res.ok && res.status !== 204)
      throw new Error("Failed to delete entry.");
  },
};
