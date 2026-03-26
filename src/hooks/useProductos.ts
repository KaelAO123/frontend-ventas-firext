import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import { Producto } from '@/types';

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchProductos = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/productos');
      setProductos(response.data);
    } catch (error: any) {
      console.error('Error fetching productos:', error);
      toast.error('Error al cargar los productos');
    } finally {
      setIsLoading(false);
    }
  };

  const createProducto = async (data: any) => {
    try {
      const response = await api.post('/productos', data);
      toast.success(response.data.message || 'Producto creado exitosamente');
      await fetchProductos();
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al crear el producto';
      toast.error(errorMessage);
      throw error;
    }
  };

  const updateProducto = async (id: number, data: any) => {
    try {
      const response = await api.put(`/productos/${id}`, data);
      toast.success(response.data.message || 'Producto actualizado exitosamente');
      await fetchProductos();
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar el producto';
      toast.error(errorMessage);
      throw error;
    }
  };

  const deleteProducto = async (id: number) => {
    try {
      const response = await api.delete(`/productos/${id}`);
      toast.success(response.data.message || 'Producto eliminado exitosamente');
      await fetchProductos();
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al eliminar el producto';
      toast.error(errorMessage);
      throw error;
    }
  };

  const filteredProductos = productos.filter((producto) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      producto.id_item_producto.toString().includes(searchLower) ||
      producto.nombre.toLowerCase().includes(searchLower) ||
      (producto.item?.capacidad?.toString() || '').includes(searchLower) ||
      (producto.item?.unidad?.toLowerCase() || '').includes(searchLower) ||
      (producto.item?.descripcion?.toLowerCase() || '').includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredProductos.length / itemsPerPage);
  const paginatedProductos = filteredProductos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchProductos();
  }, []);

  return {
    productos: paginatedProductos,
    allProductos: productos,
    isLoading,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    createProducto,
    updateProducto,
    deleteProducto,
    refetch: fetchProductos,
  };
}