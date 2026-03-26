"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, LogIn, Shield, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toaster } from "react-hot-toast";

const loginSchema = z.object({
  username: z
    .string()
    .min(1, "El nombre de usuario es requerido")
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(50, "El nombre de usuario no puede tener más de 50 caracteres")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "El nombre de usuario solo puede contener letras, números y guión bajo",
    ),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, token, user } = useAuthStore();
  const [showAnimation, setShowAnimation] = useState(false);
  const [serverError, setServerError] = useState("");
  useEffect(() => {
    if (token && user) {
      router.push("/dashboard");
    }
    setTimeout(() => setShowAnimation(true), 100);
  }, [token, user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setServerError("");
      await login(data.username, data.password);
      router.push("/dashboard");
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;

        if (errors.username) {
          setError("username", { message: errors.username[0] });
        }
        if (errors.password) {
          setError("password", { message: errors.password[0] });
        }
        if (errors.login) {
          setServerError(errors.login[0]);
        }
      } else if (error.response?.data?.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError("Error de conexión. Verifica tu conexión a internet.");
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #fed7aa 100%)",
      }}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#ffffff",
            color: "#0f172a",
            border: "1px solid #e2e8f0",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
        }}
      />

      <AnimatePresence>
        {showAnimation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            {/* Logo/Branding */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-center mb-8"
            >
              <div
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 mx-auto"
                style={{ backgroundColor: "#f9731620" }}
              >
                <Shield className="w-10 h-10" style={{ color: "#f97316" }} />
              </div>
              <h1
                className="text-3xl font-bold"
                style={{
                  background: "linear-gradient(135deg, #f97316, #facc15)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Firext Gestion Ventas
              </h1>
              <p className="mt-2" style={{ color: "#64748b" }}>
                Inicia sesión en tu cuenta
              </p>
            </motion.div>

            {/* Form Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
              style={{ border: "1px solid #e2e8f0" }}
            >
              <div className="p-8">
                {/* Error general del servidor */}
                {serverError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 rounded-lg flex items-center gap-2"
                    style={{
                      backgroundColor: "#fee2e2",
                      border: "1px solid #fecaca",
                    }}
                  >
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-700">{serverError}</p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <Input
                    label="Nombre de usuario"
                    type="text"
                    placeholder="ejemplo_usuario"
                    icon={<User className="w-4 h-4" />}
                    error={errors.username?.message}
                    {...register("username")}
                    autoComplete="username"
                    autoFocus
                  />

                  <Input
                    label="Contraseña"
                    type="password"
                    placeholder="••••••••"
                    icon={<Lock className="w-4 h-4" />}
                    error={errors.password?.message}
                    {...register("password")}
                    autoComplete="current-password"
                  />

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      isLoading={isLoading}
                      fullWidth
                      size="lg"
                      className="mt-2"
                    >
                      {!isLoading && <LogIn className="w-4 h-4 mr-2" />}
                      Iniciar Sesión
                    </Button>
                  </motion.div>
                </form>

                {/* Información de ayuda */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 pt-6"
                  style={{ borderTop: "1px solid #e2e8f0" }}
                >
                  <div className="bg-primary/5 rounded-lg p-3">
                    <p
                      className="text-xs text-center font-medium"
                      style={{ color: "#f97316" }}
                    >
                      📝 Credenciales de prueba:
                    </p>
                    <div
                      className="mt-2 space-y-1 text-xs text-center"
                      style={{ color: "#64748b" }}
                    >
                      <p>
                        <span className="font-medium">Usuario:</span> admin
                      </p>
                      <p>
                        <span className="font-medium">Contraseña:</span>{" "}
                        password
                      </p>
                      <p className="text-[10px] mt-2 text-text-muted">
                        * Usa las credenciales que tengas registradas en tu base
                        de datos
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Footer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center text-xs mt-6"
              style={{ color: "#64748b" }}
            >
              © {new Date().getFullYear()} Firext Gestión Ventas. Todos los
              derechos reservados.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
