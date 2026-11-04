
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import TodoList from "./pages/TodoList";

import PropTypes from "prop-types";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <p>Vérification de la session...</p>;
  }

  return isAuthenticated
    ? children
    : <Navigate to="/login" replace />;
}


function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <p>Vérification de la session...</p>;
  }

  return isAuthenticated
    ? <Navigate to="/" replace />
    : children;
}


function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <TodoList />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

PublicRoute.PropTypes = {
  children: PropTypes.element.isRequired
}

ProtectedRoute.PropTypes = {
  children: PropTypes.element.isRequired
}