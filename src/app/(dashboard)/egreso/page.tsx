'use client';

import { useState } from 'react';
import { Plus, Eye, Edit, Trash2, TrendingDown, Search, Filter } from 'lucide-react';
import { useEgresos } from '@/hooks/useEgresos';
import { Egreso } from '@/types';
import { Button } from '@/components/ui/Button';
import {Modal} from '@/components/ui/Modal';
import EgresoForm from '@/components/forms/EgresoForm';
import EgresoDetail from '@/components/EgresoDetail';
import { DataTable } from '@/components/tables/DataTable';

export default function EgresosPage() {
  const {
    egresos,
    isLoading,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    totalPages,
    tiposUnicos,
    createEgreso,
    updateEgreso,
    deleteEgreso,
  } = useEgresos();

  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedEgreso, setSelectedEgreso] = useState<Egreso | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleCreate = () => {
    setSelectedEgreso(null);
    setModalOpen(true);
  };

  const handleEdit = (egreso: Egreso) => {
    setSelectedEgreso(egreso);
    setModalOpen(true);
  };

  const handleView = (egreso: Egreso) => {
    setSelectedEgreso(egreso);
    setDetailOpen(true);
  };

  const handleDelete = async (egreso: Egreso) => {
    if (confirm(`¿Estás seguro de eliminar el egreso de ${egreso.tipo} por Bs. ${egreso.monto.toFixed(2)}?`)) {
      await deleteEgreso(egreso.id_egreso);
    }
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (selectedEgreso) {
        await updateEgreso(selectedEgreso.id_egreso, data);
      } else {
        await createEgreso(data);
      }
      setModalOpen(false);
      setSelectedEgreso(null);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      search: '',
      tipo: '',
      fecha_desde: '',
      fecha_hasta: '',
    });
  };

  // Definir columnas para DataTable
  const columns = [
    {
      header: 'ID',
      accessor: (egreso: Egreso) => (
        <span className="font-mono text-xs">{egreso.id_egreso}</span>
      ),
      className: 'w-20',
    },
    {
      header: 'Empleado',
      accessor: (egreso: Egreso) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">
            {egreso.usuario ? `${egreso.usuario.nombre} ${egreso.usuario.apellido}` : '-'}
          </span>
        </div>
      ),
    },
    {
      header: 'Tipo',
      accessor: (egreso: Egreso) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
          {egreso.tipo}
        </span>
      ),
    },
    {
      header: 'Descripción',
      accessor: (egreso: Egreso) => (
        <span className="text-text-muted">
          {egreso.descripcion?.substring(0, 50) || '-'}
          {egreso.descripcion && egreso.descripcion.length > 50 ? '...' : ''}
        </span>
      ),
    },
    {
      header: 'Fecha/Hora',
      accessor: (egreso: Egreso) => {
        if (!egreso.created_at) return '-';
        return new Date(egreso.created_at).toLocaleString('es-ES', {
          dateStyle: 'short',
          timeStyle: 'short',
        });
      },
      className: 'w-36',
    },
    {
      header: 'Precio Total',
      accessor: (egreso: Egreso) => (
        <span className="font-medium text-red-600">
          Bs. {egreso.monto.toFixed(2)}
        </span>
      ),
      className: 'w-28',
    },
    {
      header: 'Acciones',
      accessor: (egreso: Egreso) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleView(egreso)}
            className="p-1.5 text-text-muted hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
            title="Ver detalle"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(egreso)}
            className="p-1.5 text-text-muted hover:text-secondary transition-colors rounded-lg hover:bg-secondary/10"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(egreso)}
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
          <h1 className="text-2xl font-bold text-text flex items-center gap-2">
            <TrendingDown className="w-6 h-6 text-red-500" />
            Egresos
          </h1>
          <p className="text-text-muted mt-1">Gestiona los egresos y gastos de la empresa</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Egreso
        </Button>
      </div>

      {/* Barra de filtros */}
      <div className="bg-white rounded-xl border border-border p-4 space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
          </button>
          {(filters.search || filters.tipo || filters.fecha_desde || filters.fecha_hasta) && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary hover:text-primary-600 transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Buscador general */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Buscar por ID, empleado, tipo..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-9 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-card text-text"
            />
          </div>

          {/* Selector por tipo */}
          <select
            value={filters.tipo}
            onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-card text-text"
          >
            <option value="">Todos los tipos</option>
            {tiposUnicos.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>

          {/* Fecha desde */}
          <input
            type="date"
            value={filters.fecha_desde}
            onChange={(e) => setFilters({ ...filters, fecha_desde: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-card text-text"
            placeholder="Fecha desde"
          />

          {/* Fecha hasta */}
          <input
            type="date"
            value={filters.fecha_hasta}
            onChange={(e) => setFilters({ ...filters, fecha_hasta: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-card text-text"
            placeholder="Fecha hasta"
          />
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
            <div className="text-sm text-text-muted">
              <p className="font-medium mb-2">Tipos de egreso disponibles:</p>
              <div className="flex flex-wrap gap-2">
                {tiposUnicos.map((tipo) => (
                  <button
                    key={tipo}
                    onClick={() => setFilters({ ...filters, tipo })}
                    className="px-2 py-1 text-xs rounded-full bg-gray-100 text-text-muted hover:bg-primary hover:text-white transition-colors"
                  >
                    {tipo}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-sm text-text-muted">
              <p className="font-medium mb-2">Información:</p>
              <p>Total de egresos: {egresos.length}</p>
              <p>Total filtrados: {egresos.length}</p>
            </div>
          </div>
        )}
      </div>

      {/* DataTable */}
      <DataTable
        data={egresos}
        columns={columns}
        keyExtractor={(item) => item.id_egreso}
        loading={isLoading}
        searchTerm={filters.search}
        onSearchChange={(term) => setFilters({ ...filters, search: term })}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        emptyMessage="No hay egresos registrados"
      />

      {/* Modal para crear/editar */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedEgreso ? 'Editar Egreso' : 'Nuevo Egreso'}
      >
        <EgresoForm
          egreso={selectedEgreso || undefined}
          onSubmit={onSubmit}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Modal para detalle */}
      <EgresoDetail
        egreso={selectedEgreso}
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  );
}