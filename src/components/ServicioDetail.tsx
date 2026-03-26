'use client';

import { motion } from 'framer-motion';
import { X, Flame, Tag, Box, Scale, DollarSign, FileText, Hash, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Servicio } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ServicioDetailProps {
  servicio: Servicio | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ServicioDetail({ servicio, isOpen, onClose }: ServicioDetailProps) {
  if (!servicio) return null;

  if (!isOpen) return null;

  const formatDate = (date: string) => {
    if (!date) return 'No registrada';
    return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: es });
  };

  const infoCards = [
    {
      label: 'Tipo de Gas',
      value: servicio.tipo_gas,
      icon: Flame,
      color: 'bg-primary/10 text-primary',
      span: 'col-span-2',
    },
    {
      label: 'ID Servicio',
      value: `#${servicio.id_item_servicio}`,
      icon: Hash,
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'Marca',
      value: servicio.item?.marca || 'No registrada',
      icon: Tag,
      color: 'bg-secondary/10 text-secondary',
    },
    {
      label: 'Artículo',
      value: servicio.item?.articulo || 'No registrado',
      icon: Box,
      color: 'bg-accent/10 text-accent',
    },
    {
      label: 'Capacidad',
      value: servicio.item?.capacidad 
        ? `${servicio.item.capacidad} ${servicio.item.unidad || ''}` 
        : 'No registrada',
      icon: Scale,
      color: 'bg-success/10 text-success',
    },
    {
      label: 'Unidad',
      value: servicio.item?.unidad || 'No registrada',
      icon: Scale,
      color: 'bg-success/10 text-success',
    },
    {
      label: 'Precio',
      value: servicio.item?.precio 
        ? `Bs. ${servicio.item.precio.toFixed(2)}` 
        : 'No registrado',
      icon: DollarSign,
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'Estado',
      value: servicio.item?.estado ? 'Activo' : 'Inactivo',
      icon: servicio.item?.estado ? CheckCircle : XCircle,
      color: servicio.item?.estado ? 'bg-success/10 text-success' : 'bg-red-100 text-red-600',
      badge: true,
    },
    {
      label: 'Descripción',
      value: servicio.item?.descripcion || 'Sin descripción',
      icon: FileText,
      color: 'bg-text-muted/10 text-text-muted',
      span: 'col-span-2',
      multiline: true,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold text-text">
              Detalle del Servicio
            </h2>
            <p className="text-sm text-text-muted mt-1">
              #{servicio.id_item_servicio} - {servicio.tipo_gas}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Información en grid de columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {infoCards.map((card, index) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`${card.span || ''} p-4 bg-gray-50 rounded-xl border border-border hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${card.color}`}>
                    <card.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-text-muted uppercase tracking-wider">
                      {card.label}
                    </p>
                    {card.badge ? (
                      <div className="mt-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            card.value === 'Activo'
                              ? 'bg-success/10 text-success'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {card.value === 'Activo' ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          {card.value}
                        </span>
                      </div>
                    ) : card.multiline ? (
                      <p className="mt-2 text-text whitespace-pre-wrap break-words">
                        {card.value}
                      </p>
                    ) : (
                      <p className="mt-2 text-text font-semibold text-lg">
                        {card.value}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Información adicional de fechas */}
          {(servicio.created_at || servicio.updated_at) && (
            <div className="mt-6 pt-4 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {servicio.created_at && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-border">
                    <Calendar className="w-5 h-5 text-text-muted" />
                    <div>
                      <p className="text-xs text-text-muted">Fecha de creación</p>
                      <p className="text-sm font-medium text-text mt-1">
                        {formatDate(servicio.created_at)}
                      </p>
                    </div>
                  </div>
                )}
                {servicio.updated_at && servicio.updated_at !== servicio.created_at && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-border">
                    <Calendar className="w-5 h-5 text-text-muted" />
                    <div>
                      <p className="text-xs text-text-muted">Última actualización</p>
                      <p className="text-sm font-medium text-text mt-1">
                        {formatDate(servicio.updated_at)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-border bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    </div>
  );
}