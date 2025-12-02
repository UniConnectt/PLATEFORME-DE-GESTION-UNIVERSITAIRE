// App.js (no changes needed, but confirmed: /login route renders Login directly)
import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import Home from "./pages/Home"; // Corrected path: ./pages/Home
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} /> {/* Start on Home */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="/" />} /> {/* Catch-all to Home */}
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;