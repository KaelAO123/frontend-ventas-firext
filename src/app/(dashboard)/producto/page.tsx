'use client';

import { useState } from 'react';
import { Plus, Eye, Edit, Trash2, Package } from 'lucide-react';
import { useProductos } from '@/hooks/useProductos';
import { Producto } from '@/types';
import { Button } from '@/components/ui/Button';
import {Modal} from '@/components/ui/Modal';
import ProductoForm from '@/components/forms/ProductoForm';
import ProductoDetail from '@/components/ProductoDetail';
import { DataTable } from '@/components/tables/DataTable';

export default function ProductosPage() {
  const {
    productos,
    isLoading,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    createProducto,
    updateProducto,
    deleteProducto,
  } = useProductos();

  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = () => {
    setSelectedProducto(null);
    setModalOpen(true);
  };

  const handleEdit = (producto: Producto) => {
    setSelectedProducto(producto);
    setModalOpen(true);
  };

  const handleView = (producto: Producto) => {
    setSelectedProducto(producto);
    setDetailOpen(true);
  };

  const handleDelete = async (producto: Producto) => {
    if (confirm(`¿Estás seguro de eliminar el producto "${producto.nombre}"?`)) {
      await deleteProducto(producto.id_item_producto);
    }
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (selectedProducto) {
        await updateProducto(selectedProducto.id_item_producto, data);
      } else {
        await createProducto(data);
      }
      setModalOpen(false);
      setSelectedProducto(null);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Definir columnas para DataTable
  const columns = [
    {
      header: 'ID',
      accessor: (producto: Producto) => (
        <span className="font-mono text-xs">{producto.id_item_producto}</span>
      ),
      className: 'w-20',
    },
    {
      header: 'Nombre',
      accessor: (producto: Producto) => (
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-primary" />
          <span className="font-medium">{producto.nombre}</span>
        </div>
      ),
    },
    {
      header: 'Capacidad',
      accessor: (producto: Producto) => (
        <span>
          {producto.item?.capacidad 
            ? `${producto.item.capacidad} ${producto.item.unidad || ''}` 
            : '-'}
        </span>
      ),
    },
    {
      header: 'Unidad',
      accessor: (producto: Producto) => producto.item?.unidad || '-',
    },
    {
      header: 'Descripción',
      accessor: (producto: Producto) => (
        <span className="text-text-muted">
          {producto.item?.descripcion?.substring(0, 50) || '-'}
          {producto.item?.descripcion && producto.item.descripcion.length > 50 ? '...' : ''}
        </span>
      ),
    },
    {
      header: 'Precio',
      accessor: (producto: Producto) => (
        <span className="font-medium text-success">
          {producto.item?.precio ? `Bs. ${producto.item.precio.toFixed(2)}` : '-'}
        </span>
      ),
      className: 'w-28',
    },
    {
      header: 'Acciones',
      accessor: (producto: Producto) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleView(producto)}
            className="p-1.5 text-text-muted hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
            title="Ver detalle"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(producto)}
            className="p-1.5 text-text-muted hover:text-secondary transition-colors rounded-lg hover:bg-secondary/10"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(producto)}
            className="p-1.5 text-text-muted hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
      className: 'w-32 text-right',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Productos</h1>
          <p className="text-text-muted mt-1">Gestiona el catálogo de productos</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Producto
        </Button>
      </div>

      {/* DataTable */}
      <DataTable
        data={productos}
        columns={columns}
        keyExtractor={(item) => item.id_item_producto}
        loading={isLoading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        emptyMessage="No hay productos registrados"
      />

      {/* Modal para crear/editar */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedProducto ? 'Editar Producto' : 'Nuevo Producto'}
      >
        <ProductoForm
          producto={selectedProducto || undefined}
          onSubmit={onSubmit}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Modal para detalle */}
      <ProductoDetail
        producto={selectedProducto}
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  );
}