import { FaLock, FaUser } from "react-icons/fa";
import { useState, useEffect } from "react";
import Button from "../../Components/Button";
import Captcha from "../Captcha/Captcha";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import apiService from "../../../apiService";
import axios from "axios";
import { setLocale } from "yup";
import { useLoader } from "../../Context/LoaderContext";

const Login = () => {
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [error, setError] = useState(null);
  const [captchaKey, setCaptchaKey] = useState(0);
  // const { setLoading } = useLoader();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [realPassword, setRealPassword] = useState("");
  const [displayPassword, setDisplayPassword] = useState("");
  const [formData, setFormData] = useState({
    in_UserId: "",
    in_password: "",
  });
  const { loginAdmin, login } = useAuth();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "in_password") {
      setRealPassword(value);
      setDisplayPassword(value);
    }
  };

  const handleBlur = () => {
    if (realPassword.length > 0) {
      setDisplayPassword("•".repeat(10));
    }
  };

  const handleFocus = () => {
    setDisplayPassword(realPassword);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (!formData.in_UserId || !formData.in_password) {
      setError("Username and password are required.");
      return;
    }

    if (!isCaptchaValid) {
      setError("Invalid Captcha. Please try again.");
      return;
    }

    try {
      const res = await apiService.post(`login`, formData);
      console.log("Form Data:", formData);
      console.log("API Response:", res);

      // ❌ First check if login failed
      if (
        !res.data ||
        (res.data?.result?.out_ErrorCode !== 0 && !res.data.token)
      ) {
        setError(res.data?.message || "Invalid username or password.");
        setCaptchaKey((prev) => prev + 1); // 🔄 refresh captcha
        setIsCaptchaValid(false);
        return; // stop execution here
      }

      // ✅ Only destructure when login succeeded
      const { token, user, userConfig } = res.data;
      console.log("Login Successful! Proceeding...");

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userConfig", JSON.stringify(userConfig));
      login(user, token, userConfig);

      if (user.otpValidate === "Y") {
        console.log("OTP Validated. Redirecting to Dashboard...");
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/dashboard";
        // navigate();
      }
    } catch (err) {
      console.error("Login API Error:", err);

      // Correctly read backend error message
      const backendMessage = err?.response?.data?.message;
      const fallbackMessage = err?.message?.includes("salt")
        ? "Invalid username or password."
        : backendMessage || err.message || "An error occurred";

      setError(fallbackMessage);
      setCaptchaKey((prev) => prev + 1); // 🔄 refresh captcha
      setIsCaptchaValid(false);
    } finally {
      setLoading(false);
    }
  };

  // const loginUser = async (userid, password) => {
  //   const res = await axios.post(
  //     `${API_BASE_URL}/login`,
  //     {
  //       in_UserId: userid,
  //       in_password: password,
  //     },
  //     {
  //       withCredentials: true,
  //     },
  //   );

  //   if (!res?.data || typeof res.data !== "object") {
  //     throw new Error("Invalid response");
  //   }

  //   if (res.data?.user?.errorCode === 9999) {
  //     return res.data;
  //   }

  //   throw new Error(
  //     res.data?.user?.errorMsg || "Invalid username or password.",
  //   );
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError(null);

  //   if (!formData.in_UserId || !formData.in_password) {
  //     setError("Username and password are required.");
  //     return;
  //   }

  //   if (!isCaptchaValid) {
  //     setError("Invalid Captcha. Please try again.");
  //     return;
  //   }

  //   try {
  //     const data = await loginUser(formData.in_UserId, formData.in_password);

  //     const { token, user } = data;

  //     localStorage.setItem("token", token);
  //     localStorage.setItem("user", JSON.stringify(user));
  //     loginAdmin(data.user, data.token);

  //     if (user.otpValidate === "Y") {
  //       navigate("/otp-verification", {
  //         state: {
  //           userId: user.userId,
  //           mobile: user.mobileNo,
  //           ulbId: user.out_OrgId,
  //           maskedMobile: user.mobileNo?.replace(
  //             /^(\d{2})\d{6}(\d{2})$/,
  //             "$1******$2",
  //           ),
  //         },
  //       });
  //     } else {
  //       navigate("/dashboard");
  //     }
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };

  // const handleSilentSubmit = async (userid, password) => {
  //   try {
  //     setLoading(true);
  //     const data = await loginUser(userid, password);
  //     const { token } = data;
  //     const loggedInUser = data.user;

  //     localStorage.setItem("token", token);
  //     localStorage.setItem("user", JSON.stringify(loggedInUser));
  //     loginAdmin(loggedInUser, data.token);

  //     sessionStorage.setItem("performaceAssessSystemSession", "true");
  //     localStorage.setItem("performaceAssessSystemSession", "true");

  //     window.history.replaceState({}, document.title, window.location.pathname);
  //     navigate("/dashboard");
  //   } catch (err) {
  //     setError(err.message || "Silent login failed.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const validateTokenAndLogin = async () => {
  //   try {
  //     const response = await axios.post(
  //       `${API_BASE_URL}/validate-token`,
  //       {},
  //       { withCredentials: true },
  //     );
  //     const outBinds = response.data?.outBinds;
  //     console.log("🔥 validate response", outBinds);

  //     if (outBinds?.out_ErrorCode === 9999) {
  //       console.log("✅ Valid token, logging in silently...");
  //       await handleSilentSubmit(outBinds.out_userid, outBinds.out_encpassword);
  //       return true;
  //     } else {
  //       console.log("❌ Invalid token, redirect needed");
  //       return false;
  //     }
  //   } catch (err) {
  //     console.error("❌ API call failed:", err);
  //     return false;
  //   }
  // };

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     validateTokenAndLogin();
  //   }
  // }, []);

  useEffect(() => {
    const checkSession = async () => {
      const ok = await validateTokenAndLogin();
      if (!ok) {
        window.location.href = "https://nagarkaryavalinewuat.com/";
      }
    };
    checkSession();
  }, []);

  return (
    <>
      {loading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-blue-500 border-r-sky-500" />
          </div>
        </div>
      ) : (
        <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-blue-50/60 via-white to-sky-50/60 flex items-center justify-center p-4">
          {/* Ambient brand blobs */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />

          <div className="relative w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-[0_20px_50px_-20px_rgba(15,23,42,0.25)] ring-1 ring-slate-200/80 overflow-hidden">
              {/* Brand accent strip */}
              <div className="h-[3px] w-full bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-400" />

              {/* Header */}
              <div className="px-8 pt-8 pb-6 text-center border-b border-slate-100">
                <div className="mx-auto mb-4 w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center shadow-[0_8px_20px_-6px_rgba(59,130,246,0.6)]">
                  {/* Gauge icon (inline SVG so no extra import is needed) */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 text-white"
                  >
                    <path d="M12 14 4 6" />
                    <path d="M4.34 16a8 8 0 1 1 15.32 0" />
                    <circle cx="12" cy="14" r="1" />
                  </svg>
                </div>

                <h1 className="text-[19px] sm:text-xl font-semibold text-slate-800 tracking-tight">
                  Performance Assessment System
                </h1>
                <p className="mt-1.5 text-[10.5px] font-semibold uppercase tracking-[0.18em] bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                  Secure Sign In
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                {/* Username */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="username"
                    className="block text-[12px] font-semibold text-slate-600 tracking-wide"
                  >
                    User Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <FaUser className="text-slate-400 group-focus-within:text-blue-500 transition-colors duration-150" />
                    </div>
                    <input
                      type="text"
                      id="in_UserId"
                      name="in_UserId"
                      placeholder="User Name"
                      autoComplete="username"
                      className="block w-full pl-10 pr-3 py-2.5 text-[13.5px] text-slate-800
                        bg-white border border-slate-200 rounded-xl
                        placeholder:text-slate-400
                        shadow-[inset_0_1px_2px_rgba(15,23,42,0.03)]
                        focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/15
                        transition-colors duration-150"
                      value={formData.in_UserId}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="password"
                    className="block text-[12px] font-semibold text-slate-600 tracking-wide"
                  >
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <FaLock className="text-slate-400 group-focus-within:text-blue-500 transition-colors duration-150" />
                    </div>
                    <input
                      type="password"
                      id="in_password"
                      name="in_password"
                      placeholder="Enter Password"
                      autoComplete="current-password"
                      className="block w-full pl-10 pr-3 py-2.5 text-[13.5px] text-slate-800
                        bg-white border border-slate-200 rounded-xl
                        placeholder:text-slate-400
                        shadow-[inset_0_1px_2px_rgba(15,23,42,0.03)]
                        focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/15
                        transition-colors duration-150"
                      required
                      value={displayPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onFocus={handleFocus}
                    />
                  </div>
                </div>

                {/* Simplified Captcha Component */}
                <Captcha
                  key={captchaKey}
                  onValidate={(isValid) => setIsCaptchaValid(isValid)}
                />

                {/* Error message */}
                {error && (
                  <div className="error-message text-danger flex items-start gap-2 rounded-xl bg-rose-50 ring-1 ring-rose-200 px-3.5 py-2.5 text-[12.5px] font-medium text-rose-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 flex-shrink-0 mt-[1px]"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl
                    text-[13.5px] font-semibold text-white tracking-wide
                    bg-gradient-to-r from-blue-500 to-sky-500
                    shadow-[0_8px_20px_-8px_rgba(59,130,246,0.6)]
                    hover:from-blue-600 hover:to-sky-600
                    hover:shadow-[0_10px_24px_-8px_rgba(59,130,246,0.7)]
                    active:scale-[0.99]
                    focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/30
                    transition-all duration-150"
                >
                  Login
                </Button>
              </form>

              {/* Footer */}
              <div className="px-8 py-3 border-t border-slate-100 bg-gradient-to-r from-blue-50/60 via-white to-sky-50/60">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.18)]" />
                  <p className="text-[10px] font-medium text-slate-500">
                    © {new Date().getFullYear()} · PAS v1.0.0
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
