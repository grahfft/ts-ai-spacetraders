import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

function ensureApiBase(url?: string | null): string {
  const raw = url || process.env.NEXT_PUBLIC_SERVICE_URL || process.env.SERVICE_URL || '';
  if (!raw) return '/api';
  let base = raw.replace(/\/$/, '');
  if (!/\/api(\/|$)/.test(base)) base = `${base}/api`;
  return base;
}

export const backendBase = ensureApiBase();

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),
  tagTypes: ['Agent', 'Summary', 'Contracts', 'Ships'],
  endpoints: (builder) => ({
    getAgents: builder.query<any[], void>({
      query: () => `agents`,
      providesTags: (result) => [{ type: 'Agent', id: 'LIST' }],
    }),
    getAgent: builder.query<any, string>({
      query: (id) => `agents/${id}`,
      providesTags: (_res, _err, id) => [{ type: 'Agent', id }],
    }),
    getAgentSummary: builder.query<any, string>({
      query: (id) => `agents/${id}/summary`,
      providesTags: (_res, _err, id) => [{ type: 'Summary', id }],
    }),
    getAgentShips: builder.query<any, string>({
      query: (id) => `agents/${id}/ships`,
      providesTags: (_res, _err, id) => [{ type: 'Ships', id }],
    }),
    acceptContract: builder.mutation<any, { id: string; contractId: string }>({
      query: ({ id, contractId }) => ({
        url: `agents/${id}/contracts/${contractId}/accept`,
        method: 'POST',
        body: {},
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: 'Contracts', id }, { type: 'Summary', id }],
    }),
    orbitShip: builder.mutation<any, { id: string; shipSymbol: string }>({
      query: ({ id, shipSymbol }) => ({
        url: `agents/${id}/ships`,
        method: 'POST',
        body: { action: 'orbit', shipSymbol },
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: 'Ships', id }, { type: 'Summary', id }],
    }),
    dockShip: builder.mutation<any, { id: string; shipSymbol: string }>({
      query: ({ id, shipSymbol }) => ({
        url: `agents/${id}/ships`,
        method: 'POST',
        body: { action: 'dock', shipSymbol },
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: 'Ships', id }, { type: 'Summary', id }],
    }),
    refuelShip: builder.mutation<any, { id: string; shipSymbol: string }>({
      query: ({ id, shipSymbol }) => ({
        url: `agents/${id}/ships`,
        method: 'POST',
        body: { action: 'refuel', shipSymbol },
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: 'Ships', id }, { type: 'Summary', id }],
    }),
  }),
});

export const {
  useGetAgentsQuery,
  useGetAgentQuery,
  useGetAgentSummaryQuery,
  useGetAgentShipsQuery,
  useAcceptContractMutation,
  useOrbitShipMutation,
  useDockShipMutation,
  useRefuelShipMutation,
} = api;

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefault) => getDefault().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);


