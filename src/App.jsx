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

  return;
}

export default App;
