function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="p-8 rounded-2xl bg-slate-800 shadow-xl text-center">
        <h1 className="text-4xl font-bold text-purple-400 mb-4">
          Tailwind is Working 🚀
        </h1>

        <p className="text-slate-300">
          If this text is styled, your setup is correct.
        </p>

        <button className="mt-6 px-6 py-3 rounded-xl bg-purple-500 text-white font-semibold hover:bg-purple-600 transition">
          Test Button
        </button>
      </div>
    </div>
  );
}

export default App;
