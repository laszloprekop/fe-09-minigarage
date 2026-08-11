import { useState } from "react";

function App() {
  // Reacts minne: en vanlig räknare
  const [count, setCount] = useState(0);

  // Lista som vi manipulerar immutabelt
  const [numbers, setNumbers] = useState([1, 2, 3]);

  // Öka räknaren direkt
  const increaseDirect = () => {
    setCount(count + 1);
  };

  // Öka räknaren via spread (immutabilitet)
  const increaseViaSpread = () => {
    const newNumbers = [...numbers, numbers.length + 1]; // lägger till nytt tal
    setNumbers(newNumbers);
  };

  // Öka räknaren via rest/filter (ta bort första talet)
  const increaseViaRest = () => {
    const filtered = numbers.filter((n) => n !== numbers[0]); // tar bort första
    setNumbers(filtered);
  };

  return (
    <div style={{ fontSize: "20px" }}>
      <h2>Reacts minne (useState)</h2>
      <div>Räknare: {count}</div>
      <button onClick={increaseDirect}>Öka direkt</button>

      <hr />

      <h2>Lista före/efter (immutabilitet)</h2>

      <div>Nuvarande lista: {JSON.stringify(numbers)}</div>

      <button onClick={increaseViaSpread}>
        Lägg till nytt värde via spread (...)
      </button>

      <button onClick={increaseViaRest}>
        Ta bort första värdet via rest/filter
      </button>

      <h2>Listan renderad med .map()</h2>
      <div>
        {numbers.map((n, i) => (
          <div key={i}>{n}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
