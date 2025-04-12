import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [registernum, setRegisternum] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleVerifyUser = async () => {
    if (!registernum || !password) {
      setMessage("❌ Please enter Register Number and Password.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/auth/verify-user", { registernum, password });
      setOtpSent(true);
      setMessage(response.data.message || "✅ OTP sent to your email!");
    } catch (error) {
      setMessage(error.response?.data?.message || "❌ Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!otp) {
      setMessage("❌ Please enter OTP.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/auth/login", { registernum, password, otp });
      setMessage(response.data.message || "✅ Login successful!");
      console.log("User Data:", response.data.user);
      localStorage.setItem("token", response.data.token); // Store JWT token
      localStorage.setItem("registernum", response.data.user.registernum)
      window.location.href = "/student-profile"; // Redirect to student profile
    } catch (error) {
      setMessage(error.response?.data?.message || "❌ Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

        {message && <p className="text-center text-red-500">{message}</p>}

        <input
          type="text"
          placeholder="Register Number"
          className="w-full p-2 border rounded mt-2"
          value={registernum}
          onChange={(e) => setRegisternum(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mt-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {otpSent && (
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full p-2 border rounded mt-2"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        )}

        {!otpSent ? (
          <button
            onClick={handleVerifyUser}
            className="w-full bg-blue-500 text-white p-2 rounded mt-4"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="w-full bg-green-500 text-white p-2 rounded mt-4"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Login;
