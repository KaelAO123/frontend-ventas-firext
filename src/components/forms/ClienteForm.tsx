'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Cliente } from '@/types';

const clienteSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  apellido: z.string().min(1, 'El apellido es requerido'),
  telefono: z.string().min(1, 'El teléfono es requerido'),
  razon_social: z.string().nullable().optional(),
  nit: z.string().nullable().optional(),
  ci: z.string().nullable().optional(),
});

type ClienteFormData = z.infer<typeof clienteSchema>;

interface ClienteFormProps {
  initialData?: Cliente;
  onSubmit: (data: ClienteFormData) => Promise<void>;
  isLoading?: boolean;
}

export const ClienteForm: React.FC<ClienteFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: initialData
      ? {
          nombre: initialData.nombre,
          apellido: initialData.apellido,
          telefono: initialData.telefono,
          razon_social: initialData.razon_social,
          nit: initialData.nit,
          ci: initialData.ci,
        }
      : {
          nombre: '',
          apellido: '',
          telefono: '',
          razon_social: '',
          nit: '',
          ci: '',
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Nombre"
          placeholder="Nombre"
          error={errors.nombre?.message}
          {...register('nombre')}
        />
        <Input
          label="Apellido"
          placeholder="Apellido"
          error={errors.apellido?.message}
          {...register('apellido')}
        />
      </div>
      <Input
        label="Teléfono"
        placeholder="Teléfono"
        error={errors.telefono?.message}
        {...register('telefono')}
      />
      <Input
        label="Razón Social"
        placeholder="Razón Social (opcional)"
        error={errors.razon_social?.message}
        {...register('razon_social')}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="NIT"
          placeholder="NIT (opcional)"
          error={errors.nit?.message}
          {...register('nit')}
        />
        <Input
          label="CI"
          placeholder="CI (opcional)"
          error={errors.ci?.message}
          {...register('ci')}
        />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
};