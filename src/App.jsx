function App() {
  const { useState, useEffect, useCallback } = React;
  const route = useHashRoute("");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const loadEntries = useCallback(async () => {
    try {
      const data = await Api.listEntries();
      setEntries(data);
      setLoadError("");
    } catch (err) {
      setLoadError("Could not reach the server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  // Add a newly created entry to the current in-memory list
  function handleAdded(entry) {
    setEntries((prev) => [...prev, entry]);
  }

  // Update an entry locally first for a responsive UI, then sync the change with the server
  async function handleUpdate(id, payload) {
    if (!("reviewed" in payload)) {
      setEntries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...payload } : e)),
      );
    }
    try {
      const updated = await Api.updateEntry(id, payload);
      setEntries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...updated } : e)),
      );
    } catch (err) {
      loadEntries();
    }
  }

  // Remove the entry from local state immediately, then delete it on the server
  async function handleDelete(id) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    try {
      await Api.deleteEntry(id);
    } catch (err) {
      loadEntries();
    }
  }

  const dueCount = React.useMemo(() => {
    const now = Date.now();
    return entries.filter((e) => new Date(e.nextReviewDate).getTime() <= now)
      .length;
  }, [entries]);

  let page;
  if (loading) {
    page = (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading tracker...</p>
      </div>
    );
  } else if (loadError) {
    page = (
      <div className="error-card">
        <div className="error-icon">⚠️</div>
        <div>
          <h3>Connection Error</h3>
          <p>{loadError}</p>
        </div>
        <button className="btn-primary" onClick={loadEntries}>
          Retry
        </button>
      </div>
    );
  } else if (route === "problems") {
    page = (
      <ProblemsPage
        entries={entries}
        onAdded={handleAdded}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onReload={loadEntries}
      />
    );
  } else if (route === "tags") {
    page = <TagsPage entries={entries} onUpdate={handleUpdate} />;
  } else if (route === "settings") {
    page = <SettingsPage />;
  } else {
    page = (
      <DashboardPage
        entries={entries}
        onUpdate={handleUpdate}
        onAdded={handleAdded}
      />
    );
  }

  return;
}

export default App;
