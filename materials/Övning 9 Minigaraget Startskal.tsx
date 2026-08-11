import { useState } from 'react';

interface ICar {
  id: number;
  regNumber: string;
  brand: string;
}

export default function App() {
  // 1. State för listan av bilar (förfylld med lite testdata)
  const [cars, setCars] = useState<ICar[]>([
    { id: 1, regNumber: "ABC123", brand: "Volvo" },
    { id: 2, regNumber: "XYZ789", brand: "Saab" }
  ]);

  // 2. State för formulärets inmatningsfält
  const [regNumber, setRegNumber] = useState("");
  const [brand, setBrand] = useState("");
  
  // 3. State för enkel felhantering
  const [error, setError] = useState("");

  // TODO: Implementera funktionen för att lägga till bil
  const handleAddCar = () => {
    // Tips: Validera att fälten inte är tomma (!regNumber.trim() || !brand.trim())
    // Skapa ett nytt bilobjekt med id: Date.now()
    // Uppdatera state med spread-operatorn: setCars(prev => [...prev, newCar])
    // Nollställ fälten efteråt
  };

  // TODO: Implementera funktionen för att ta bort en bil baserat på id
  const handleDeleteCar = (id: number) => {
    // Tips: Använd .filter() för att behålla alla bilar vars id inte matchar det som ska tas bort
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 font-sans">
      <div className="max-w-xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-emerald-400 mb-2">Minigaraget (Startskal)</h1>
          <p className="text-slate-400">
            Antal bilar i garaget: <span className="font-semibold text-white">{cars.length}</span>
          </p>
        </header>

        {/* Formulär för att parkera fordon */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4 text-emerald-300">Parkera nytt fordon</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Regnummer</label>
              <input
                type="text"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                placeholder="t.ex. ABC123"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white uppercase focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Märke</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="t.ex. Volvo"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="button"
              onClick={handleAddCar}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg transition-colors cursor-pointer shadow-md"
            >
              Parkera bil
            </button>
          </div>
        </div>

        {/* Lista över parkerade fordon */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-emerald-300">Parkerade fordon</h2>
          
          {cars.length === 0 ? (
            <p className="text-slate-500 text-center py-8 bg-slate-800/50 rounded-xl border border-slate-800">
              Garaget är helt tomt.
            </p>
          ) : (
            <div className="space-y-3">
              {cars.map((car) => (
                <div
                  key={car.id}
                  className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex justify-between items-center shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-emerald-500/20 text-emerald-300 text-xs font-mono px-2.5 py-1 rounded border border-emerald-500/30 uppercase font-semibold">
                      {car.regNumber}
                    </span>
                    <h3 className="text-lg font-bold text-white">{car.brand}</h3>
                  </div>

                  <button
                    onClick={() => handleDeleteCar(car.id)}
                    className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-4 py-2 rounded-lg text-sm font-medium border border-red-500/30 transition-all cursor-pointer"
                  >
                    Ta bort
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}