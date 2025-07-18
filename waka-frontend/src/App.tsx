import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import AuthRoute from "./components/auth/AuthRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route index element={<Home />} />
          <Route
            path="login"
            element={
              <AuthRoute isPublic={true}>
                <Login />
              </AuthRoute>
            }
          />
          <Route
            path="signup"
            element={
              <AuthRoute isPublic={true}>
                <SignUp />
              </AuthRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
