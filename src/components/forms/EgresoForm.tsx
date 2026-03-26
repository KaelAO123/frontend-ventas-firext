'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Egreso, Usuario } from '@/types';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';

const egresoSchema = z.object({
  id_usuario: z.number().min(1, 'El empleado es requerido'),
  tipo: z.string().min(1, 'El tipo de egreso es requerido'),
  monto: z.number().min(0, 'El monto debe ser mayor o igual a 0'),
  descripcion: z.string().min(1, 'La descripción es requerida'),
});

type EgresoFormData = z.infer<typeof egresoSchema>;

interface EgresoFormProps {
  egreso?: Egreso;
  onSubmit: (data: EgresoFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function EgresoForm({ egreso, onSubmit, isLoading = false }: EgresoFormProps) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<EgresoFormData>({
    resolver: zodResolver(egresoSchema),
    defaultValues: {
      id_usuario: egreso?.id_usuario || 0,
      tipo: egreso?.tipo || '',
      monto: egreso?.monto || 0,
      descripcion: egreso?.descripcion || '',
    },
  });

  // Cargar usuarios para el selector
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await api.get('/usuarios');
        setUsuarios(response.data);
      } catch (error) {
        console.error('Error fetching usuarios:', error);
      } finally {
        setLoadingUsuarios(false);
      }
    };
    fetchUsuarios();
  }, []);

  const tiposEgreso = [
    'Sueldos',
    'Alquiler',
    'Servicios Básicos',
    'Mantenimiento',
    'Materiales',
    'Transporte',
    'Publicidad',
    'Impuestos',
    'Otros',
  ];

  const onSubmitForm = async (data: EgresoFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">
            Empleado *
          </label>
          <select
            {...register('id_usuario', { valueAsNumber: true })}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            disabled={loadingUsuarios}
          >
            <option value="">Seleccionar empleado</option>
            {usuarios.map((usuario) => (
              <option key={usuario.id_usuario} value={usuario.id_usuario}>
                {usuario.nombre} {usuario.apellido} - @{usuario.username}
              </option>
            ))}
          </select>
          {errors.id_usuario && (
            <p className="mt-1 text-sm text-red-500">{errors.id_usuario.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">
            Tipo de Egreso *
          </label>
          <select
            {...register('tipo')}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">Seleccionar tipo</option>
            {tiposEgreso.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
          {errors.tipo && (
            <p className="mt-1 text-sm text-red-500">{errors.tipo.message}</p>
          )}
        </div>

        <Input
          label="Monto *"
          type="number"
          step="0.01"
          placeholder="Ej: 1500.00"
          error={errors.monto?.message}
          {...register('monto', { valueAsNumber: true })}
        />

        <div className="md:col-span-2">
          <Input
            label="Descripción *"
            placeholder="Descripción detallada del egreso"
            error={errors.descripcion?.message}
            {...register('descripcion')}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="submit"
          isLoading={isLoading}
          className="min-w-[100px]"
        >
          {egreso ? 'Actualizar' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
}