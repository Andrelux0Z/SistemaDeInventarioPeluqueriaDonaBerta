"use client";
import { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

const BACKEND_URL = "http://localhost:5149";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setMessage("Inicio de sesión exitoso. Redirigiendo...");
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("rol", data.rol);
        router.push("/dashboard");
      } else {
        setIsSuccess(false);
        setMessage(data.message ?? "Credenciales incorrectas.");
      }
    } catch {
      setIsSuccess(false);
      setMessage("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.card}>
        <h1 className={styles.title}>Iniciar sesión</h1>

        <form className={styles.form} onSubmit={handleLogin} aria-label="Formulario de inicio de sesión">
          <div className={styles.field}>
            <label className={styles.label} htmlFor="username">
              Usuario:
            </label>
            <input
              className={styles.input}
              id="username"
              type="text"
              name="username"
              placeholder="Ejemplo: usuario"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Contraseña:
            </label>
            <input
              className={styles.input}
              id="password"
              type="password"
              name="password"
              placeholder="********"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {message && (
            <p style={{ color: isSuccess ? "green" : "red", marginTop: "1rem", textAlign: "center" }}>
              {message}
            </p>
          )}

          <div className={styles.actions}>
            <button className={styles.button} type="submit" disabled={loading}>
              {loading ? "Cargando..." : "Confirmar"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
