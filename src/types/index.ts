
export interface Cliente {
  id_cliente: number;
  nombre: string;
  apellido: string;
  razon_social: string | null;
  telefono: string;
  nit: string | null;
  ci: string | null;
  estado: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  created_at?: string;
  updated_at?: string;
}

export interface Servicio {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  created_at?: string;
  updated_at?: string;
}

export interface NotaRecepcion {
  id: number;
  cliente_id: number;
  fecha: string;
  total: number;
  items?: Item[];
  cliente?: Cliente;
  created_at?: string;
  updated_at?: string;
}

export interface NotaEntrega {
  id: number;
  cliente_id: number;
  fecha: string;
  total: number;
  items?: Item[];
  cliente?: Cliente;
  created_at?: string;
  updated_at?: string;
}

export interface Item {
  id: number;
  nota_recepcion_id?: number;
  nota_entrega_id?: number;
  producto_id?: number;
  servicio_id?: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  producto?: Producto;
  servicio?: Servicio;
}

export interface Ingreso {
  id: number;
  nota_recepcion_id: number;
  monto: number;
  fecha: string;
  descripcion?: string;
  created_at?: string;
  updated_at?: string;
}






export interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  ci: string;
  telefono: string;
  rol: string;
  username: string;
  estado: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LoginResponse {
  message: string;
  usuario: Usuario;
  token: string;
}

export interface LoginError {
  message: string;
  errors?: {
    username?: string[];
    password?: string[];
    login?: string[];
  };
}

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  status?: number;
}


export interface Item {
  id_item: number;
  id_recepcion?: number;
  id_entrega?: number;
  marca?: string;
  articulo?: string;
  capacidad?: number;
  unidad?: string;
  serie?: string;
  precio: number;
  descripcion?: string;
  estado: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Producto {
  id_item_producto: number;
  nombre: string;
  created_at?: string;
  updated_at?: string;
  item?: Item;
}

export interface ProductoResponse {
  message?: string;
  data?: Producto;
  errors?: Record<string, string[]>;
}

export interface Servicio {
  id_item_servicio: number;
  tipo_gas: string;
  created_at?: string;
  updated_at?: string;
  item?: Item;
}

export interface ServicioResponse {
  message?: string;
  data?: Servicio;
  errors?: Record<string, string[]>;
}

export interface Egreso {
  id_egreso: number;
  id_usuario: number;
  tipo: string;
  monto: number;
  descripcion: string;
  estado: boolean;
  created_at?: string;
  updated_at?: string;
  usuario?: Usuario;
}

export interface EgresoFormData {
  id_usuario: number;
  tipo: string;
  monto: number;
  descripcion: string;
}

export interface EgresoFilters {
  search?: string;
  tipo?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
}


export type { Usuario as User };