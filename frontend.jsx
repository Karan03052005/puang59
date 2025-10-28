const { useState } = React;

function SpellCheckerApp() {
  const [word, setWord] = useState("");
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const checkWord = async () => {
    if (!word.trim()) {
      setMessage("⚠️ Please enter a word");
      return;
    }

    setLoading(true);
    setMessage("");
    setSuggestions([]);

    try {
      const res = await axios.post("http://localhost:5000/api/check-word", { word });
      const data = res.data;

      if (data.correct) {
        setMessage(`✅ "${word}" is correct! Proceeding to generate meaning and examples...`);
        // You can trigger your "generate meaning" API here later
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

  const handleSuggestionClick = (suggestedWord) => {
    setWord(suggestedWord);
    setMessage(`✅ Selected "${suggestedWord}". Now generating meaning and examples...`);
    setSuggestions([]);
    // You can trigger meaning/example generation here too
  };

  return (
    <div style={{ fontFamily: "sans-serif", textAlign: "center", marginTop: "50px" }}>
      <h1>📝 Word Checker</h1>
      <input
        type="text"
        placeholder="Enter a word..."
        value={word}
        onChange={(e) => setWord(e.target.value)}
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
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<SpellCheckerApp />);
