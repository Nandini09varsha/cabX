import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import AuthLayout from "../../layouts/AuthLayout";
import { useAuth } from "../../context/AuthContext";
import { apiError } from "../../lib/format";

const roles = [
  { id: "rider", label: "Rider" },
  { id: "driver", label: "Driver" },
  { id: "admin", label: "Admin" },
];

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "rider",
  });
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
      await register(form);
      if (form.role === "driver") navigate("/driver");
      else if (form.role === "admin") navigate("/admin");
      else navigate("/rider");
    } catch (err) {
      setError(apiError(err, "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={`Create your ${form.role} account`}
      subtitle="Choose a role, then set a password you can double-check before you continue."
      footer={
        <p className="mt-5 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Log in
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
        <fieldset className="mb-5">
          <legend className="mb-2 text-sm font-medium text-foreground">
            Register as
          </legend>
          <div className="grid grid-cols-3 gap-3">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setForm({ ...form, role: role.id })}
                className={`min-h-11 rounded-xl border px-3 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  form.role === role.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-transparent text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </fieldset>
        <Input
          label="Full name"
          name="name"
          autoComplete="name"
          spellCheck={false}
          value={form.name}
          onChange={handleChange}
          required
        />
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
          label="Phone number"
          type="tel"
          name="phone"
          autoComplete="tel"
          inputMode="tel"
          spellCheck={false}
          value={form.phone}
          onChange={handleChange}
          required
        />
        <Input
          label="Password"
          type="password"
          name="password"
          autoComplete="new-password"
          spellCheck={false}
          showToggle
          value={form.password}
          onChange={handleChange}
          required
        />
        <Button type="submit" loading={loading} className="mt-2">
          Create {form.role} account
        </Button>
      </form>
    </AuthLayout>
  );
}

export default Register;
