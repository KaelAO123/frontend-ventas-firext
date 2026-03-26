'use client';

import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import { User, Mail, IdCard, Phone, Briefcase, Shield } from 'lucide-react';

export default function PerfilPage() {
  const { user } = useAuthStore();

  if (!user) return null;

  const info = [
    { label: 'Nombre completo', value: `${user.nombre} ${user.apellido}`, icon: User },
    { label: 'Nombre de usuario', value: user.username, icon: User },
    { label: 'CI', value: user.ci, icon: IdCard },
    { label: 'Teléfono', value: user.telefono, icon: Phone },
    { label: 'Rol', value: user.rol, icon: Briefcase },
    { label: 'Estado', value: user.estado ? 'Activo' : 'Inactivo', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-text">Mi Perfil</h1>
        <p className="text-text-muted mt-1">Información de tu cuenta</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-border overflow-hidden"
      >
        <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text">
                {user.nombre} {user.apellido}
              </h2>
              <p className="text-text-muted">@{user.username}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {info.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="mt-1">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wide">{item.label}</p>
                  <p className="text-text font-medium mt-1">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}