import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateQuiz from "./pages/CreateQuiz";
import EditQuiz from "./pages/EditQuiz";
import AttemptHistory from "./pages/AttemptHistory";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-quiz" element={<CreateQuiz />} />
      <Route path="/edit-quiz/:id" element={<EditQuiz />} />
<Route path="/history" element={<AttemptHistory />} />

    </Routes>
  );
}

export default App;
