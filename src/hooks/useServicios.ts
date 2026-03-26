import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import { Servicio } from '@/types';

export function useServicios() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchServicios = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/servicios');
      setServicios(response.data);
    } catch (error: any) {
      console.error('Error fetching servicios:', error);
      toast.error('Error al cargar los servicios');
    } finally {
      setIsLoading(false);
    }
  };

  const createServicio = async (data: any) => {
    try {
      const response = await api.post('/servicios', data);
      toast.success(response.data.message || 'Servicio creado exitosamente');
      await fetchServicios();
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al crear el servicio';
      toast.error(errorMessage);
      throw error;
    }
  };

  const updateServicio = async (id: number, data: any) => {
    try {
      const response = await api.put(`/servicios/${id}`, data);
      toast.success(response.data.message || 'Servicio actualizado exitosamente');
      await fetchServicios();
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar el servicio';
      toast.error(errorMessage);
      throw error;
    }
  };

  const deleteServicio = async (id: number) => {
    try {
      const response = await api.delete(`/servicios/${id}`);
      toast.success(response.data.message || 'Servicio eliminado exitosamente');
      await fetchServicios();
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al eliminar el servicio';
      toast.error(errorMessage);
      throw error;
    }
  };

  const filteredServicios = servicios.filter((servicio) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      servicio.id_item_servicio.toString().includes(searchLower) ||
      servicio.tipo_gas.toLowerCase().includes(searchLower) ||
      (servicio.item?.marca?.toLowerCase() || '').includes(searchLower) ||
      (servicio.item?.articulo?.toLowerCase() || '').includes(searchLower) ||
      (servicio.item?.capacidad?.toString() || '').includes(searchLower) ||
      (servicio.item?.descripcion?.toLowerCase() || '').includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredServicios.length / itemsPerPage);
  const paginatedServicios = filteredServicios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchServicios();
  }, []);

  return {
    servicios: paginatedServicios,
    allServicios: servicios,
    isLoading,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    createServicio,
    updateServicio,
    deleteServicio,
    refetch: fetchServicios,
  };
}