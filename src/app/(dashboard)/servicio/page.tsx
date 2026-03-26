"use client";

import { useState } from "react";
import { Plus, Eye, Edit, Trash2, Flame } from "lucide-react";
import { useServicios } from "@/hooks/useServicios";
import { Servicio } from "@/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import ServicioForm from "@/components/forms/ServicioForm";
import ServicioDetail from "@/components/ServicioDetail";
import { DataTable } from "@/components/tables/DataTable";

export default function ServiciosPage() {
  const {
    servicios,
    isLoading,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    createServicio,
    updateServicio,
    deleteServicio,
  } = useServicios();

  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedServicio, setSelectedServicio] = useState<Servicio | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = () => {
    setSelectedServicio(null);
    setModalOpen(true);
  };

  const handleEdit = (servicio: Servicio) => {
    setSelectedServicio(servicio);
    setModalOpen(true);
  };

  const handleView = (servicio: Servicio) => {
    setSelectedServicio(servicio);
    setDetailOpen(true);
  };

  const handleDelete = async (servicio: Servicio) => {
    if (
      confirm(`¿Estás seguro de eliminar el servicio "${servicio.tipo_gas}"?`)
    ) {
      await deleteServicio(servicio.id_item_servicio);
    }
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (selectedServicio) {
        await updateServicio(selectedServicio.id_item_servicio, data);
      } else {
        await createServicio(data);
      }
      setModalOpen(false);
      setSelectedServicio(null);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Definir columnas para DataTable
  const columns = [
    {
      header: "ID",
      accessor: (servicio: Servicio) => (
        <span className="font-mono text-xs">{servicio.id_item_servicio}</span>
      ),
      className: "w-20",
    },
    {
      header: "Capacidad",
      accessor: (servicio: Servicio) => (
        <span>
          {servicio.item?.capacidad
            ? `${servicio.item.capacidad} ${servicio.item.unidad || ""}`
            : "-"}
        </span>
      ),
    },
    {
      header: "Unidad",
      accessor: (producto: Servicio) => producto.item?.unidad || "-",
    },
    {
      header: "Tipo de Gas",
      accessor: (servicio: Servicio) => (
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-primary" />
          <span className="font-medium">{servicio.tipo_gas}</span>
        </div>
      ),
    },
    {
      header: 'Descripción',
      accessor: (producto: Servicio) => (
        <span className="text-text-muted">
          {producto.item?.descripcion?.substring(0, 50) || '-'}
          {producto.item?.descripcion && producto.item.descripcion.length > 50 ? '...' : ''}
        </span>
      ),
    },
    {
      header: "Acciones",
      accessor: (servicio: Servicio) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleView(servicio)}
            className="p-1.5 text-text-muted hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
            title="Ver detalle"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(servicio)}
            className="p-1.5 text-text-muted hover:text-secondary transition-colors rounded-lg hover:bg-secondary/10"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(servicio)}
            className="p-1.5 text-text-muted hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
      className: "w-32 text-right",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Servicios</h1>
          <p className="text-text-muted mt-1">
            Gestiona el catálogo de servicios (recargas, mantenimientos)
          </p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Servicio
        </Button>
      </div>

      {/* DataTable */}
      <DataTable
        data={servicios}
        columns={columns}
        keyExtractor={(item) => item.id_item_servicio}
        loading={isLoading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        emptyMessage="No hay servicios registrados"
      />

      {/* Modal para crear/editar */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedServicio ? "Editar Servicio" : "Nuevo Servicio"}
      >
        <ServicioForm
          servicio={selectedServicio || undefined}
          onSubmit={onSubmit}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Modal para detalle */}
      <ServicioDetail
        servicio={selectedServicio}
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  );
}
