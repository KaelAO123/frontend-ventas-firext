'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Producto } from '@/types';

const productoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').max(255, 'Máximo 255 caracteres'),
  marca: z.string().max(255, 'Máximo 255 caracteres').optional(),
  articulo: z.string().max(255, 'Máximo 255 caracteres').optional(),
  capacidad: z.number().optional().nullable(),
  unidad: z.string().max(50, 'Máximo 50 caracteres').optional(),
  precio: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  descripcion: z.string().optional(),
});

type ProductoFormData = z.infer<typeof productoSchema>;

interface ProductoFormProps {
  producto?: Producto;
  onSubmit: (data: ProductoFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function ProductoForm({ producto, onSubmit, isLoading = false }: ProductoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductoFormData>({
    resolver: zodResolver(productoSchema),
    defaultValues: {
      nombre: producto?.nombre || '',
      marca: producto?.item?.marca || '',
      articulo: producto?.item?.articulo || '',
      capacidad: producto?.item?.capacidad || null,
      unidad: producto?.item?.unidad || '',
      precio: producto?.item?.precio || 0,
      descripcion: producto?.item?.descripcion || '',
    },
  });

  const onSubmitForm = async (data: ProductoFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Input
            label="Nombre del Producto *"
            placeholder="Ej: Extintor ABC"
            error={errors.nombre?.message}
            {...register('nombre')}
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
          placeholder="Ej: Extintor"
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
            placeholder="Descripción detallada del producto"
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
          {producto ? 'Actualizar' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
}