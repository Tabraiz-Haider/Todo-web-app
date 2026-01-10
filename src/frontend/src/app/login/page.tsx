"use client"

import Link from "next/link";
import { motion } from "framer-motion";
import { AuthForm } from "@/components/auth-form";
import { Sparkles, Lock } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30 mb-4"
          >
            <Lock className="h-8 w-8" />
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">
            Sign in to continue managing your tasks
          </p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-xl p-8">
          <AuthForm mode="login" />
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-muted-foreground">
            New to Todo-App?{" "}
            <Link
              href="/register"
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors"
            >
              Create an account
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
