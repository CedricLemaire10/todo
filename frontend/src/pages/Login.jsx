
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoginError(null);
    setIsLoading(true);

    try {
      await login(username, password);

    } catch (err) {
      setLoginError(
        err.response?.data?.detail ||
        "Impossible de se connecter."
      );

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <h1>Connexion</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Identifiant</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            data-cy="login-input"
          />
        </div>

        <div>
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            data-cy="password-input"
          />
        </div>

        {loginError && (
          <p className="text-error">{loginError}</p>
        )}

        <button 
          type="submit" 
          disabled={isLoading}
          data-cy="connect-button"
        >
          {isLoading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </main>
  );
}

export default Login;
