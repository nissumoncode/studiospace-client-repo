"use client";

import { useState } from "react";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Aperture,
  User,
  Mail,
  LockKeyhole,
  ImageIcon,
  Eye,
  EyeOff,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleGoogleRegister() {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}/`,
    });

    if (error) {
      toast.error(error.message || "Google registration failed");
    }
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const image = formData.get("photoURL") as string;
    const password = formData.get("password") as string;

    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password)
    ) {
      toast.error(
        "Password must be at least 8 characters long and contain at least one uppercase and one lowercase letter.",
      );
      return;
    }
    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
      image,
    });

    if (error) {
      toast.error(error.message || "Registration failed");
      return;
    }
    toast.success("Account created successfully!");
    router.push("/login");
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="items-center text-center">
          <div className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Aperture size={30} />
          </div>

          <CardTitle className="text-2xl font-bold">
            Create Your Account
          </CardTitle>

          <CardDescription>
            Join StudioSpace and start creating.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="name"
                  name="name"
                  placeholder="Your full name"
                  className="h-11 pl-10"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="h-11 pl-10"
                  required
                />
              </div>
            </div>

            {/* Photo URL */}
            <div className="space-y-2">
              <label htmlFor="photoURL" className="text-sm font-medium">
                Profile Photo URL
              </label>

              <div className="relative">
                <ImageIcon
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="photoURL"
                  name="photoURL"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  className="h-11 pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="h-11 pl-10 pr-10"
                  required
                  minLength={8}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              <p className="text-xs leading-5 text-muted-foreground">
                Password must contain at least 8 characters, one uppercase and
                one lowercase letter.
              </p>
            </div>

            <Button type="submit" className="h-11 w-full">
              Create Account
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">
              OR CONTINUE WITH
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Google */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleRegister}
            className="h-11 w-full gap-3"
          >
            <FcGoogle size={20} />
            Continue with Google
          </Button>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
