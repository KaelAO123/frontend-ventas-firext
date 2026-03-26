import { useState, useEffect, useMemo } from 'react';
import { clienteService } from '@/services/clienteService';
import { Cliente } from '@/types';
import toast from 'react-hot-toast';

export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const data = await clienteService.getAll();
      setClientes(data);
    } catch (error) {
      toast.error('Error al cargar clientes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const filteredClientes = useMemo(() => {
    if (!searchTerm.trim()) return clientes;
    const term = searchTerm.toLowerCase();
    return clientes.filter(cliente => 
      cliente.nombre.toLowerCase().includes(term) ||
      cliente.apellido.toLowerCase().includes(term) ||
      cliente.telefono.includes(term) ||
      (cliente.nit && cliente.nit.includes(term)) ||
      (cliente.ci && cliente.ci.includes(term))
    );
  }, [clientes, searchTerm]);

  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage);
  const paginatedClientes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredClientes.slice(start, start + itemsPerPage);
  }, [filteredClientes, currentPage, itemsPerPage]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  const createCliente = async (data: any) => {
    try {
      const newCliente = await clienteService.create(data);
      setClientes(prev => [...prev, newCliente]);
      toast.success('Cliente creado exitosamente');
      return newCliente;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al crear cliente';
      toast.error(message);
      throw error;
    }
  };

  const updateCliente = async (id: number, data: any) => {
    try {
      const updated = await clienteService.update(id, data);
      setClientes(prev => prev.map(c => c.id_cliente === id ? updated : c));
      toast.success('Cliente actualizado exitosamente');
      return updated;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al actualizar cliente';
      toast.error(message);
      throw error;
    }
  };

  const deleteCliente = async (id: number) => {
    try {
      await clienteService.delete(id);
      setClientes(prev => prev.filter(c => c.id_cliente !== id));
      toast.success('Cliente eliminado exitosamente');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al eliminar cliente';
      toast.error(message);
      throw error;
    }
  };

  return {
    clientes: paginatedClientes,
    allClientes: clientes,
    loading,
    searchTerm,
    setSearchTerm,
    currentPage,
    totalPages,
    goToPage,
    createCliente,
    updateCliente,
    deleteCliente,
    refresh: fetchClientes,
  };
};