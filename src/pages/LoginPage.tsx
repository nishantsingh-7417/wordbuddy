import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check for success message from signup redirect
  useEffect(() => {
    const state = location.state as { message?: string } | null;
    if (state?.message) {
      setSuccessMessage(state.message);
    }
  }, [location.state]);

  // Check if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("📦 LOGIN PAGE - Current Session:", session ? "✅ Active" : "❌ None");
      
      if (session) {
        console.log("🔄 Already logged in, redirecting to home...");
        navigate("/");
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    console.log("🚀 LOGIN ATTEMPT:", email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Debug output
    console.log("📦 LOGIN RESULT:", { data, error });
    
    if (data?.user) {
      console.log("👤 USER:", data.user.email);
      console.log("🆔 USER ID:", data.user.id);
    }
    
    if (data?.session) {
      console.log("🔑 SESSION:", "✅ Created");
      console.log("🎟️ ACCESS TOKEN:", data.session.access_token.substring(0, 20) + "...");
    }

    // Also check current session after login attempt
    const { data: sessionData } = await supabase.auth.getSession();
    console.log("📦 SESSION AFTER LOGIN:", sessionData.session ? "✅ Active" : "❌ None");

    setLoading(false);

    if (error) {
      console.error("❌ LOGIN ERROR:", error.message);
      console.error("❌ ERROR CODE:", error.status);
      
      // Provide user-friendly error messages
      if (error.message.includes("Invalid login credentials")) {
        setError("Invalid email or password. Please check your credentials and try again.");
      } else if (error.message.includes("Email not confirmed")) {
        setError("Please confirm your email before logging in. Check your inbox.");
      } else {
        setError(error.message);
      }
      return;
    }

    if (data?.session) {
      console.log("✅ Login successful! Redirecting...");
      navigate("/");
    } else {
      console.error("❌ No session created despite no error");
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm p-6 rounded-xl border bg-white space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

        {successMessage && (
          <p className="text-green-600 text-sm bg-green-50 p-2 rounded">{successMessage}</p>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-green-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}