import StatusContainer from "./components/StatusContainer";

function App() {
  return (
    <div className="dark min-h-screen bg-slate-950 text-white p-5">
      <div className="mb-5">
        <h1 className="text-3xl font-bold">StatusGO 🚦</h1>
      </div>
      <StatusContainer />
    </div>
  );
}

export default App;