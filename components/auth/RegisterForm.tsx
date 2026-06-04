"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/apiClient";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

function getPasswordStrength(pw: string) {
  return {
    minLength: pw.length >= 8,
    hasUpper: /[A-Z]/.test(pw),
    hasLower: /[a-z]/.test(pw),
    hasNumber: /\d/.test(pw),
  };
}

const PASSWORD_RULES = [
  { key: "minLength" as const, label: "Ít nhất 8 ký tự" },
  { key: "hasUpper" as const, label: "Chứa chữ hoa (A-Z)" },
  { key: "hasLower" as const, label: "Chứa chữ thường (a-z)" },
  { key: "hasNumber" as const, label: "Chứa chữ số (0-9)" },
];

type Role = "user" | "owner";

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, isAuthenticated } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>(
    (searchParams.get("role") as Role) === "owner" ? "owner" : "user",
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = getPasswordStrength(password);
  const isPasswordValid = Object.values(strength).every(Boolean);

  useEffect(() => {
    if (isAuthenticated) router.replace("/");
  }, [isAuthenticated, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) { setError("Vui lòng nhập họ tên."); return; }
    if (!email.trim()) { setError("Vui lòng nhập email."); return; }
    if (!isPasswordValid) { setError("Mật khẩu chưa đạt yêu cầu."); return; }
    if (password !== confirmPassword) { setError("Mật khẩu xác nhận không khớp."); return; }

    setLoading(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password, role });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 400 && err.message.toLowerCase().includes("email")) {
          setError("Email này đã được sử dụng. Vui lòng dùng email khác.");
        } else if (err.status === 429) {
          setError("Đăng ký quá nhiều lần. Vui lòng thử lại sau.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Không thể kết nối đến máy chủ. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Đăng ký thành công!</h2>
          <p className="text-gray-500 text-sm">Đang chuyển bạn đến trang đăng nhập...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">AI</span>
            </div>
            <span className="text-xl font-bold text-gray-800">
              AI<span className="text-orange-500">Guesthouse</span>
            </span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-gray-800">Tạo tài khoản</h1>
          <p className="mt-1 text-sm text-gray-500">Miễn phí, nhanh chóng</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          {/* Role toggle */}
          <div className="flex rounded-xl border border-gray-200 overflow-hidden mb-6">
            {(["user", "owner"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                  role === r ? "bg-orange-500 text-white" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {r === "user" ? "Người thuê" : "Chủ nhà / Đăng tin"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Input
              label="Họ và tên"
              type="text"
              placeholder="Nguyễn Văn A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
              disabled={loading}
            />

            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              disabled={loading}
            />

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Tạo mật khẩu mạnh"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={loading}
                  className="w-full px-3.5 py-2.5 pr-10 text-sm border border-gray-300 rounded-xl outline-none transition-shadow focus:border-orange-400 focus:ring-1 focus:ring-orange-300 placeholder:text-gray-400 disabled:bg-gray-50 disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {password.length > 0 && (
                <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
                  {PASSWORD_RULES.map(({ key, label }) => (
                    <li
                      key={key}
                      className={`flex items-center gap-1 text-xs ${
                        strength[key] ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      {strength[key] ? (
                        <Check size={11} className="flex-shrink-0" />
                      ) : (
                        <X size={11} className="flex-shrink-0" />
                      )}
                      {label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={loading}
                  className={`w-full px-3.5 py-2.5 pr-10 text-sm border rounded-xl outline-none transition-shadow placeholder:text-gray-400 disabled:bg-gray-50 disabled:opacity-60 ${
                    confirmPassword.length > 0 && confirmPassword !== password
                      ? "border-red-400 focus:ring-1 focus:ring-red-300"
                      : "border-gray-300 focus:border-orange-400 focus:ring-1 focus:ring-orange-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirmPassword.length > 0 && confirmPassword !== password && (
                <p className="text-xs text-red-500">Mật khẩu không khớp</p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full mt-1" size="lg">
              Tạo tài khoản
            </Button>

            <p className="text-center text-xs text-gray-400">
              Bằng cách đăng ký, bạn đồng ý với{" "}
              <Link href="/terms" className="text-orange-500 hover:underline">
                Điều khoản sử dụng
              </Link>{" "}
              của chúng tôi.
            </p>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Đã có tài khoản?{" "}
          <Link href="/login" className="text-orange-500 font-semibold hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
