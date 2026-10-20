import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { consulta, pedir } from '../pedir';
import type { Cliente, ClienteDetalle, ClienteInput, Encargo, EncargoInput, EstadoEncargo } from '../tipos/clientes';

export const clientesApi = {
  lista: (buscar: string, soloDeudores: boolean) => pedir<Cliente[]>(`/clientes${consulta({ buscar, soloDeudores: soloDeudores || null })}`),
  detalle: (id: number) => pedir<ClienteDetalle>(`/clientes/${id}`),
  crear: (datos: ClienteInput) => pedir<Cliente>('/clientes', 'POST', datos),
  editar: ({ id, ...datos }: ClienteInput & { id: number }) => pedir<Cliente>(`/clientes/${id}`, 'PUT', datos),
  borrar: (id: number) => pedir<void>(`/clientes/${id}`, 'DELETE'),
};

export const encargosApi = {
  lista: (todos: boolean) => pedir<Encargo[]>(`/encargos${consulta({ todos: todos || null })}`),
  detalle: (id: number) => pedir<Encargo>(`/encargos/${id}`),
  crear: (datos: EncargoInput) => pedir<Encargo>('/encargos', 'POST', datos),
  editar: ({ id, ...datos }: EncargoInput & { id: number }) => pedir<Encargo>(`/encargos/${id}`, 'PUT', datos),
  cambiarEstado: ({ id, estado }: { id: number; estado: EstadoEncargo }) => pedir<Encargo>(`/encargos/${id}/estado`, 'POST', { estado }),
  borrar: (id: number) => pedir<void>(`/encargos/${id}`, 'DELETE'),
  aSurtir: (id: number) => pedir<{ agregados: number }>(`/encargos/${id}/surtir`, 'POST'),
};

export const useClientes = (buscar: string, soloDeudores = false) =>
  useQuery({ queryKey: ['clientes', buscar, soloDeudores], queryFn: () => clientesApi.lista(buscar, soloDeudores), placeholderData: keepPreviousData });

export const useCliente = (id: number) =>
  useQuery({ queryKey: ['cliente', id], queryFn: () => clientesApi.detalle(id), enabled: id > 0 });

export const useEncargos = (todos: boolean) =>
  useQuery({ queryKey: ['encargos', todos], queryFn: () => encargosApi.lista(todos), placeholderData: keepPreviousData });

export const useEncargo = (id: number) =>
  useQuery({ queryKey: ['encargo', id], queryFn: () => encargosApi.detalle(id), enabled: id > 0 });
