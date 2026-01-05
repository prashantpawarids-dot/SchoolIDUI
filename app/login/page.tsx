"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { GraduationCap, Eye, EyeOff, CheckCircle, Unlock } from "lucide-react";
import Image from "next/image";
import LogoImage from "@/asset/logo2.jpeg";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
const BASE_URL = "/api/proxy";
// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
       `${BASE_URL}/Auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok) throw new Error("Invalid username or password");

      const data = await response.json();

      // Save full user info in localStorage
      localStorage.setItem(
        "authUser",
        JSON.stringify({
          userId: data.userId,
          schoolId: data.schoolId,
          roleId: data.roleId,
          username: data.username,
        })
      );
localStorage.setItem("userId", data.userId.toString());
localStorage.setItem("schoolId", data.schoolId.toString());
localStorage.setItem("roleId", data.roleId.toString());
      // Redirect based on role
      switch (data.roleId) {
        case 1:
          router.push("/admin/dashboard");
          break;
        case 2:
          router.push("/parent/dashboard");
          break;
        case 3:
          router.push("/partner/dashboard");
          break;
        case 4:
          router.push("/school/dashboard");
          break;
        default:
          router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Branding */}
        {/* <div className="hidden lg:flex flex-col justify-center items-center space-y-8">
          <Image
            src={LogoImage}
            alt="Logo"
            width={180}
            height={180}
            className="object-contain rounded-xl border-0 border-gray-300"
          />
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-primary">
              IDS ID SMART TECH
            </h1>
            <p className="text-xl text-muted-foreground">
              ID Card Management System
            </p>
          </div>
        </div> */}

        {/* Branding - visible on all screen sizes */}
<div className="flex flex-col justify-center items-center space-y-8">
  <Image
    src={LogoImage}
    alt="Logo"
    width={180}
    height={180}
    className="object-contain rounded-xl border-0 border-gray-300"
  />
  <div className="text-center space-y-4">
    <h1 className="text-4xl font-bold text-primary">
      IDS ID SMART TECH
    </h1>
    <p className="text-xl text-muted-foreground">
      ID Card Management System
    </p>
  </div>
</div>


        {/* Login Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md shadow-2xl border-0 bg-card/80 backdrop-blur">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>
                Sign in to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-5">
                {showSuccess && (
                  <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Registration successful! Please sign in.
                  </div>
                )}
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>

                <div className="text-center pt-2">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link
                      href="/register"
                      className="text-primary hover:underline font-semibold">
                      Register here
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
