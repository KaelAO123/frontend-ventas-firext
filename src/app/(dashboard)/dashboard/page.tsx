'use client';

import { useAuthStore } from '@/store/authStore';
import { Package, Users, TrendingUp, TrendingDown, Shield, User, Briefcase, IdCard } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { user } = useAuthStore();

  const stats = [
    { label: 'Productos', value: '0', icon: Package, color: 'bg-primary', change: '+0%' },
    { label: 'Clientes', value: '0', icon: Users, color: 'bg-success', change: '+0%' },
    { label: 'Ingresos', value: 'Bs 0', icon: TrendingUp, color: 'bg-secondary', change: '+0%' },
    { label: 'Egresos', value: 'Bs 0', icon: TrendingDown, color: 'bg-accent', change: '+0%' },
  ];

  return (
    <div className="space-y-8">
      {/* Header con información del usuario */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl border border-border p-6"
      >
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text">
              ¡Hola, <span className="text-primary">{user?.nombre} {user?.apellido}</span>!
            </h1>
            <p className="text-text-muted mt-2">
              Bienvenido al panel de control. Aquí encontrarás un resumen de tu negocio.
            </p>
          </div>
          <div className="bg-primary/10 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-lg">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-text-muted">Rol</p>
                <p className="font-semibold text-text capitalize">{user?.rol}</p>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div>
                <p className="text-xs text-text-muted">Usuario</p>
                <p className="font-semibold text-text">@{user?.username}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-text mt-2">{stat.value}</p>
                {stat.change && (
                  <p className="text-xs text-success mt-2">{stat.change} desde el mes pasado</p>
                )}
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Información adicional del usuario */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <IdCard className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-text">Información Personal</h3>
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="text-text-muted">CI:</span> {user?.ci}</p>
            <p><span className="text-text-muted">Teléfono:</span> {user?.telefono}</p>
            <p><span className="text-text-muted">Estado:</span> 
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${user?.estado ? 'bg-success/10 text-success' : 'bg-red-100 text-red-600'}`}>
                {user?.estado ? 'Activo' : 'Inactivo'}
              </span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-text">Accesos Rápidos</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-3 text-left rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all">
              <p className="font-medium text-text">Registrar Venta</p>
              <p className="text-xs text-text-muted">Nueva nota de entrega</p>
            </button>
            <button className="p-3 text-left rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all">
              <p className="font-medium text-text">Nuevo Cliente</p>
              <p className="text-xs text-text-muted">Agregar cliente al sistema</p>
            </button>
            <button className="p-3 text-left rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all">
              <p className="font-medium text-text">Nuevo Producto</p>
              <p className="text-xs text-text-muted">Agregar producto al inventario</p>
            </button>
            <button className="p-3 text-left rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all">
              <p className="font-medium text-text">Ver Reportes</p>
              <p className="text-xs text-text-muted">Estadísticas y gráficos</p>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}