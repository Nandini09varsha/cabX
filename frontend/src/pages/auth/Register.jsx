import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
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
      navigate("/rider");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F7F5] px-4 dark:bg-[#0B0B0B]">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 dark:border-[#2A2A2A] dark:bg-[#171717]">
        <h1 className="mb-6 text-2xl font-black text-[#0B0B0B] dark:text-white">
          Create your rider account
        </h1>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Full name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Phone number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <Button type="submit" loading={loading} className="mt-2">
            Create account
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-[#0B0B0B] dark:text-[#F5C518]">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
