import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { Egreso, EgresoFilters } from "@/types";
import { format } from "date-fns";

export function useEgresos() {
  const [egresos, setEgresos] = useState<Egreso[]>([]);
  const [filteredEgresos, setFilteredEgresos] = useState<Egreso[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<EgresoFilters>({
    search: "",
    tipo: "",
    fecha_desde: "",
    fecha_hasta: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchEgresos = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/egresos");
      setEgresos(response.data);
      setFilteredEgresos(response.data);
    } catch (error: any) {
      console.error("Error fetching egresos:", error);
      toast.error("Error al cargar los egresos");
    } finally {
      setIsLoading(false);
    }
  };

  const createEgreso = async (data: any) => {
    try {
      const response = await api.post("/egresos", data);
      toast.success(response.data.message || "Egreso creado exitosamente");
      await fetchEgresos();
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error al crear el egreso";
      toast.error(errorMessage);
      throw error;
    }
  };

  const updateEgreso = async (id: number, data: any) => {
    try {
      const response = await api.put(`/egresos/${id}`, data);
      toast.success(response.data.message || "Egreso actualizado exitosamente");
      await fetchEgresos();
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error al actualizar el egreso";
      toast.error(errorMessage);
      throw error;
    }
  };

  const deleteEgreso = async (id: number) => {
    try {
      const response = await api.delete(`/egresos/${id}`);
      toast.success(response.data.message || "Egreso eliminado exitosamente");
      await fetchEgresos();
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error al eliminar el egreso";
      toast.error(errorMessage);
      throw error;
    }
  };

  useEffect(() => {
    let filtered = [...egresos];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (egreso) =>
          egreso.id_egreso.toString().includes(searchLower) ||
          egreso.usuario?.nombre?.toLowerCase().includes(searchLower) ||
          egreso.usuario?.apellido?.toLowerCase().includes(searchLower) ||
          egreso.descripcion?.toLowerCase().includes(searchLower) ||
          egreso.tipo?.toLowerCase().includes(searchLower),
      );
    }

    if (filters.tipo) {
      filtered = filtered.filter((egreso) => egreso.tipo === filters.tipo);
    }

    if (filters.fecha_desde) {
      const desde = new Date(filters.fecha_desde);
      filtered = filtered.filter((egreso) => {
        if (!egreso.created_at) return false;
        return new Date(egreso.created_at) >= desde;
      });
    }

    if (filters.fecha_hasta) {
      const hasta = new Date(filters.fecha_hasta);
      hasta.setHours(23, 59, 59);
      filtered = filtered.filter((egreso) => {
        if (!egreso.created_at) return false;
        return new Date(egreso.created_at) <= hasta;
      });
    }

    setFilteredEgresos(filtered);
    setCurrentPage(1);
  }, [egresos, filters]);

  const totalPages = Math.ceil(filteredEgresos.length / itemsPerPage);
  const paginatedEgresos = filteredEgresos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const tiposUnicos = [...new Set(egresos.map((e) => e.tipo).filter(Boolean))];

  useEffect(() => {
    fetchEgresos();
  }, []);

  return {
    egresos: paginatedEgresos,
    allEgresos: filteredEgresos,
    isLoading,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    tiposUnicos,
    createEgreso,
    updateEgreso,
    deleteEgreso,
    refetch: fetchEgresos,
  };
}
