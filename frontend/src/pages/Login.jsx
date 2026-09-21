import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setUser } from '@/redux/userSlice'

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        formData
      );

      if (response.data.success) {
        toast.success(response.data.message || "Login successful ✅");

        if (response.data.token) {
          localStorage.setItem('accessToken', response.data.token);
        }

        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        setFormData({
          email: "",
          password: ""
        });

        dispatch(setUser(response.data.user))
        navigate('/');
      }

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "bg-[#050b14] border border-white/10 text-white placeholder:text-gray-500 rounded-xl h-11 outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/50 focus-visible:border-cyan-400/40 transition-all"

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-[#050b14] text-white px-4 overflow-hidden">

      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-cyan-400/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-[350px] h-[350px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

      <Card className="relative z-10 w-full max-w-sm bg-[#071426] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.40)] overflow-hidden">

        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-cyan-400/5 blur-3xl pointer-events-none" />

        <CardHeader className="relative text-center">

          <CardTitle className="text-2xl font-black text-white tracking-tight">
            Welcome <span className="text-cyan-400">Back</span>
          </CardTitle>

          <CardDescription className="text-gray-400 text-sm">
            Enter your credentials to login to your account
          </CardDescription>

        </CardHeader>

        <CardContent className="relative">

          <form onSubmit={handleSubmit}>

            <div className="flex flex-col gap-4">

              <div className="grid gap-2">
                <Label className="text-cyan-400 text-xs uppercase tracking-wider font-semibold">
                  Email address
                </Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label className="text-cyan-400 text-xs uppercase tracking-wider font-semibold">
                    Password
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={`${inputClass} pr-10`}
                  />

                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-cyan-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-2 rounded-xl bg-cyan-400 text-black font-bold hover:bg-cyan-300 hover:scale-[1.01] transition-all shadow-[0_0_25px_rgba(34,211,238,0.15)] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading
                  ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Logging in...</span>
                  : "Login"
                }
              </Button>

              <p className="text-sm text-center text-gray-400 mt-1">
                Don't have an account?{" "}
                <Link to="/register" className="text-cyan-400 hover:text-cyan-300 hover:underline font-semibold transition-colors">
                  Sign up
                </Link>
              </p>

            </div>

          </form>

        </CardContent>

      </Card>

    </div>
  )
}

export default Login