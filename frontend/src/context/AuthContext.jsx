
import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import api, { getCsrfToken } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Enregistrer l'access token dans Axios
  const setAccessToken = (token) => {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setIsAuthenticated(true);
  };

  // Connexion
  const login = async (username, password) => {
    await getCsrfToken();

    const response = await api.post("/api/auth/login/", {
      username,
      password,
    });

    setAccessToken(response.data.access);
  };

  // Déconnexion
  const logout = async () => {
    try {
      await getCsrfToken();
      await api.post("/api/auth/logout/");
    } finally {
      delete api.defaults.headers.common.Authorization;
      setIsAuthenticated(false);
    }
  };

  // Restauration de session au démarrage
  useEffect(() => {
    const restoreSession = async () => {
      try {
        await getCsrfToken();

        const response = await api.post(
          "/api/auth/refresh/",
          {}
        );

        setAccessToken(response.data.access);

      } catch (err) {
        console.error(err);
        delete api.defaults.headers.common.Authorization;
        setIsAuthenticated(false);

      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Gestion d'une expiration de session
  useEffect(() => {
    const handleLogout = () => {
      delete api.defaults.headers.common.Authorization;
      setIsAuthenticated(false);
    };

    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte
export function useAuth() {
  return useContext(AuthContext);
}
