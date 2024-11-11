// src/App.js
import ExpenseTracker from "./components/expenseTracker";
import { Toaster } from "@/components/ui/toaster";

const App = () => {
  return (
    <div className="App">
      <Toaster />
      <ExpenseTracker />
    </div>
  );
};

export default App;
