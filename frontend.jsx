const { useState } = React;

function SpellCheckerApp() {
  const [word, setWord] = useState("");
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [meaning, setMeaning] = useState("");
  const [example, setExample] = useState("");

  const checkWord = async () => {
    if (!word.trim()) {
      setMessage("⚠️ Please enter a word");
      return;
    }

    setLoading(true);
    setMessage("");
    setSuggestions([]);
    setMeaning("");
    setExample("");

    try {
      const res = await axios.post("http://localhost:5000/api/check-word", { word });
      const data = res.data;

      if (data.correct) {
        setMessage(`✅ "${word}" is correct!`);
        await fetchMeaning(word);
      } else {
        setMessage(`❌ "${word}" is not correct. Suggestions:`);
        setSuggestions(data.suggestions);
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const fetchMeaning = async (selectedWord) => {
    try {
      const res = await axios.post("http://localhost:5000/api/meaning", { word: selectedWord });
      const data = res.data;
      setMeaning(data.meaning);
      setExample(data.example);
    } catch (err) {
      console.error(err);
      setMeaning("❌ Meaning not found.");
      setExample("");
    }
  };

  const handleSuggestionClick = async (suggestedWord) => {
    setWord(suggestedWord);
    setMessage(`✅ Selected "${suggestedWord}"`);
    setSuggestions([]);
    await fetchMeaning(suggestedWord);
  };

  return (
    <div style={{ fontFamily: "sans-serif", textAlign: "center", marginTop: "50px" }}>
      <h1>📝 Word Checker</h1>
      <input
        type="text"
        placeholder="Enter a word..."
        value={word}
        onChange={(e) => setWord(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && checkWord()}
        style={{
          padding: "10px",
          fontSize: "16px",
          width: "250px",
          borderRadius: "8px",
          border: "1px solid gray",
        }}
      />
      <button
        onClick={checkWord}
        disabled={loading}
        style={{
          marginLeft: "10px",
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        {loading ? "Checking..." : "Check Word"}
      </button>

      <div style={{ marginTop: "30px" }}>
        <p>{message}</p>

        {suggestions.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {suggestions.map((s, i) => (
              <li key={i}>
                <button
                  onClick={() => handleSuggestionClick(s)}
                  style={{
                    margin: "5px",
                    padding: "6px 12px",
                    backgroundColor: "#2196F3",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}

        {meaning && (
          <div style={{ marginTop: "20px", textAlign: "left", display: "inline-block" }}>
            <h3>📖 Meaning:</h3>
            <p>{meaning}</p>
            <h4>💬 Example:</h4>
            <p>{example}</p>
          </div>
        )}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<SpellCheckerApp />);
