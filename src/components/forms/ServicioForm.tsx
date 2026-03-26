'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Servicio } from '@/types';

const servicioSchema = z.object({
  tipo_gas: z.string().min(1, 'El tipo de gas es requerido').max(255, 'Máximo 255 caracteres'),
  marca: z.string().max(255, 'Máximo 255 caracteres').optional(),
  articulo: z.string().max(255, 'Máximo 255 caracteres').optional(),
  capacidad: z.number().optional().nullable(),
  unidad: z.string().max(50, 'Máximo 50 caracteres').optional(),
  precio: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  descripcion: z.string().optional(),
});

type ServicioFormData = z.infer<typeof servicioSchema>;

interface ServicioFormProps {
  servicio?: Servicio;
  onSubmit: (data: ServicioFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function ServicioForm({ servicio, onSubmit, isLoading = false }: ServicioFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServicioFormData>({
    resolver: zodResolver(servicioSchema),
    defaultValues: {
      tipo_gas: servicio?.tipo_gas || '',
      marca: servicio?.item?.marca || '',
      articulo: servicio?.item?.articulo || '',
      capacidad: servicio?.item?.capacidad || null,
      unidad: servicio?.item?.unidad || '',
      precio: servicio?.item?.precio || 0,
      descripcion: servicio?.item?.descripcion || '',
    },
  });

  const onSubmitForm = async (data: ServicioFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Input
            label="Tipo de Gas *"
            placeholder="Ej: Gas Licuado, Gas Natural, GLP"
            error={errors.tipo_gas?.message}
            {...register('tipo_gas')}
          />
        </div>

        <Input
          label="Marca"
          placeholder="Ej: Kidde, Ansul"
          error={errors.marca?.message}
          {...register('marca')}
        />

        <Input
          label="Artículo"
          placeholder="Ej: Extintor, Cilindro"
          error={errors.articulo?.message}
          {...register('articulo')}
        />

        <Input
          label="Capacidad"
          type="number"
          step="0.01"
          placeholder="Ej: 2.5, 5, 10"
          error={errors.capacidad?.message}
          {...register('capacidad', { valueAsNumber: true })}
        />

        <Input
          label="Unidad"
          placeholder="Ej: kg, lb, L"
          error={errors.unidad?.message}
          {...register('unidad')}
        />

        <Input
          label="Precio *"
          type="number"
          step="0.01"
          placeholder="Ej: 150.00"
          error={errors.precio?.message}
          {...register('precio', { valueAsNumber: true })}
        />

        <div className="md:col-span-2">
          <Input
            label="Descripción"
            placeholder="Descripción detallada del servicio"
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
          {servicio ? 'Actualizar' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
}