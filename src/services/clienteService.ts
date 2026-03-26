import api from '@/lib/axios';
import { Cliente } from '@/types';

export interface CreateClienteData {
  nombre: string;
  apellido: string;
  telefono: string;
  razon_social?: string | null;
  nit?: string | null;
  ci?: string | null;
}

export interface UpdateClienteData extends Partial<CreateClienteData> {
  estado?: boolean;
}

export const clienteService = {
  getAll: async (): Promise<Cliente[]> => {
    const response = await api.get('/clientes');
    return response.data;
  },

  getById: async (id: number): Promise<Cliente> => {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },

  create: async (data: CreateClienteData): Promise<Cliente> => {
    const response = await api.post('/clientes', data);
    return response.data.cliente;
  },

  update: async (id: number, data: UpdateClienteData): Promise<Cliente> => {
    const response = await api.put(`/clientes/${id}`, data);
    return response.data.cliente;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/clientes/${id}`);
  },
};