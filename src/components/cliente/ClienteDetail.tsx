'use client';

import React from 'react';
import { Cliente } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ClienteDetailProps {
  cliente: Cliente;
}

export const ClienteDetail: React.FC<ClienteDetailProps> = ({ cliente }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-text-muted">Nombre completo</label>
          <p className="font-medium">{cliente.nombre} {cliente.apellido}</p>
        </div>
        <div>
          <label className="text-xs text-text-muted">Teléfono</label>
          <p className="font-medium">{cliente.telefono}</p>
        </div>
        <div>
          <label className="text-xs text-text-muted">Razón Social</label>
          <p className="font-medium">{cliente.razon_social || '—'}</p>
        </div>
        <div>
          <label className="text-xs text-text-muted">NIT / CI</label>
          <p className="font-medium">{cliente.nit || cliente.ci || '—'}</p>
        </div>
        <div>
          <label className="text-xs text-text-muted">Fecha de registro</label>
          <p className="font-medium">
            {cliente.created_at ? format(new Date(cliente.created_at), "dd 'de' MMMM 'de' yyyy", { locale: es }) : '—'}
          </p>
        </div>
        <div>
          <label className="text-xs text-text-muted">Estado</label>
          <p className="font-medium">
            <span className={`inline-flex px-2 py-1 rounded-full text-xs ${cliente.estado ? 'bg-success/10 text-success' : 'bg-red-100 text-red-600'}`}>
              {cliente.estado ? 'Activo' : 'Inactivo'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};