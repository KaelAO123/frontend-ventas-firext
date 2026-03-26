'use client';

import { useState } from 'react';
import { useClientes } from '@/hooks/useClientes';
import { DataTable } from '@/components/tables/DataTable';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ClienteForm } from '@/components/forms/ClienteForm';
import { Eye, Edit, Trash2, Plus } from 'lucide-react';
import { Cliente } from '@/types';
import toast from 'react-hot-toast';
import {ClienteDetail} from '@/components/cliente/ClienteDetail';

export default function ClientesPage() {
  const {
    clientes,
    loading,
    searchTerm,
    setSearchTerm,
    currentPage,
    totalPages,
    goToPage,
    createCliente,
    updateCliente,
    deleteCliente,
    refresh,
  } = useClientes();

  const [modal, setModal] = useState<{
    type: 'create' | 'edit' | 'detail' | 'delete';
    cliente?: Cliente;
    open: boolean;
  }>({ type: 'create', open: false });

  const [formLoading, setFormLoading] = useState(false);

  const handleCreate = async (data: any) => {
    setFormLoading(true);
    try {
      await createCliente(data);
      setModal({ type: 'create', open: false });
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!modal.cliente) return;
    setFormLoading(true);
    try {
      await updateCliente(modal.cliente.id_cliente, data);
      setModal({ type: 'edit', open: false });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!modal.cliente) return;
    try {
      await deleteCliente(modal.cliente.id_cliente);
      setModal({ type: 'delete', open: false });
    } catch (error) {
      // error ya manejado en hook
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id_cliente' as keyof Cliente, className: 'w-16' },
    { header: 'Nombre', accessor: (c: Cliente) => `${c.nombre} ${c.apellido}` },
    { header: 'Razón Social', accessor: (c: Cliente) => c.razon_social || '—' },
    { header: 'Teléfono', accessor: 'telefono' as keyof Cliente },
    { header: 'NIT/CI', accessor: (c: Cliente) => c.nit || c.ci || '—' },
    { header: 'Fecha Registro', accessor: (c: Cliente) => c.created_at ? new Date(c.created_at).toLocaleDateString() : '—' },
    {
      header: 'Acciones',
      accessor: (cliente: Cliente) => (
        <div className="flex gap-2">
          <button
            onClick={() => setModal({ type: 'detail', cliente, open: true })}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            title="Ver detalle"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setModal({ type: 'edit', cliente, open: true })}
            className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setModal({ type: 'delete', cliente, open: true })}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
      className: 'w-24 text-center',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text">Clientes</h1>
        <Button
          onClick={() => setModal({ type: 'create', open: true })}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo Cliente
        </Button>
      </div>

      <DataTable
        data={clientes}
        columns={columns}
        keyExtractor={(c) => c.id_cliente}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        emptyMessage="No hay clientes registrados"
      />

      {/* Modal Crear */}
      <Modal
        isOpen={modal.type === 'create' && modal.open}
        onClose={() => setModal({ type: 'create', open: false })}
        title="Nuevo Cliente"
      >
        <ClienteForm onSubmit={handleCreate} isLoading={formLoading} />
      </Modal>

      {/* Modal Editar */}
      <Modal
        isOpen={modal.type === 'edit' && modal.open}
        onClose={() => setModal({ type: 'edit', open: false })}
        title="Editar Cliente"
      >
        {modal.cliente && (
          <ClienteForm
            initialData={modal.cliente}
            onSubmit={handleUpdate}
            isLoading={formLoading}
          />
        )}
      </Modal>

      {/* Modal Detalle */}
      <Modal
        isOpen={modal.type === 'detail' && modal.open}
        onClose={() => setModal({ type: 'detail', open: false })}
        title="Detalle del Cliente"
        size="lg"
      >
        {modal.cliente && <ClienteDetail cliente={modal.cliente} />}
      </Modal>

      {/* Modal Eliminar */}
      <Modal
        isOpen={modal.type === 'delete' && modal.open}
        onClose={() => setModal({ type: 'delete', open: false })}
        title="Eliminar Cliente"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-text">
            ¿Estás seguro de eliminar al cliente <strong>{modal.cliente?.nombre} {modal.cliente?.apellido}</strong>?
            Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setModal({ type: 'delete', open: false })}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}