import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate, Link } from "react-router-dom";

export default function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    console.log("🚀 SIGNUP ATTEMPT:", email);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    // Debug output
    console.log("📦 SIGNUP RESULT:", { data, error });
    
    if (data?.user) {
      console.log("👤 USER CREATED:", data.user.id);
      console.log("📧 EMAIL:", data.user.email);
      console.log("✅ CONFIRMED:", data.user.confirmed_at ? 'Yes' : 'No (confirmation disabled = OK)');
    }

    if (data?.session) {
      console.log("🔑 SESSION CREATED:", "Yes - Auto logged in!");
    } else {
      console.log("🔑 SESSION:", "None - Need to login separately");
    }

    setLoading(false);

    if (error) {
      console.error("❌ SIGNUP ERROR:", error.message);
      setError(error.message);
      return;
    }

    // Check if session was created (means auto-login worked)
    if (data?.session) {
      console.log("✅ Auto-logged in after signup!");
      navigate("/");
    } else {
      // No session = need to login separately (email confirmation might be on)
      console.log("ℹ️ Signup successful, redirecting to login");
      navigate("/login", { 
        state: { message: "Account created! Please log in." } 
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSignup}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password (min 6 characters)"
          className="w-full border p-2 rounded mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border p-2 rounded mb-3"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {error && (
          <p className="text-red-500 text-sm mb-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}