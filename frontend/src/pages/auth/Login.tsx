import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import AuthLayout from "../../layouts/AuthLayout";
import { useAuth } from "../../context/AuthContext";
import { apiError } from "../../lib/format";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const loggedInUser = await login(form);
      if (loggedInUser.role === "driver") navigate("/driver");
      else if (loggedInUser.role === "admin") navigate("/admin");
      else navigate("/rider");
    } catch (err) {
      setError(apiError(err, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Log in to CabX"
      subtitle="Welcome back. Your rides, escrow, and wallet stay where you left them."
      footer={
        <p className="mt-5 text-center text-sm text-muted-foreground">
          New to CabX?{" "}
          <Link
            to="/register"
            className="font-semibold text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Create an account
          </Link>
        </p>
      }
    >
      {error && (
        <p className="mb-4 rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          spellCheck={false}
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          spellCheck={false}
          value={form.password}
          onChange={handleChange}
          required
        />
        <Button type="submit" loading={loading} className="mt-2">
          Log in
        </Button>
      </form>
    </AuthLayout>
  );
}

export default Login;
