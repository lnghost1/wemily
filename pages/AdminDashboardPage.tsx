import React from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

type AppointmentRow = {
  id: string;
  created_at: string;
  status: 'novo' | 'confirmado' | 'atendido' | 'cancelado';
  service_title: string;
  date: string;
  time: string;
  client_name: string;
  client_phone: string;
  client_email: string | null;
  client_birthdate: string | null;
  mode: 'presencial' | 'online';
  first_time: boolean;
  reason: string | null;
  had_service_before: boolean;
  important_info: string | null;
  restrictions: string | null;
  admin_notes: string | null;
};

const statusOptions: AppointmentRow['status'][] = ['novo', 'confirmado', 'atendido', 'cancelado'];

const statusLabel: Record<AppointmentRow['status'], string> = {
  novo: 'Novo',
  confirmado: 'Confirmado',
  atendido: 'Atendido',
  cancelado: 'Cancelado'
};

const AdminDashboardPage: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [rows, setRows] = React.useState<AppointmentRow[]>([]);
  const [selected, setSelected] = React.useState<AppointmentRow | null>(null);
  const [updating, setUpdating] = React.useState(false);

  const load = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setRows([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (err) throw err;
      setRows((data ?? []) as AppointmentRow[]);
    } catch (e) {
      setError('Não foi possível carregar os agendamentos.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    load();
  }, []);

  const updateSelected = async (patch: Partial<AppointmentRow>) => {
    if (!selected) return;
    if (!isSupabaseConfigured || !supabase) return;

    setUpdating(true);
    setError(null);
    try {
      const { error: err } = await supabase
        .from('appointments')
        .update(patch)
        .eq('id', selected.id);
      if (err) throw err;

      const next = { ...selected, ...patch } as AppointmentRow;
      setSelected(next);
      setRows((prev) => prev.map((r) => (r.id === next.id ? next : r)));
    } catch (e) {
      setError('Não foi possível atualizar o agendamento.');
    } finally {
      setUpdating(false);
    }
  };

  const panel = (
    <div className="bg-white rounded-3xl shadow-sm border border-brand-peach/15 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="text-sm text-brand-text">{rows.length} agendamento(s)</div>
        <button
          className="text-sm text-brand-peach font-semibold hover:underline"
          onClick={load}
          disabled={loading}
        >
          Atualizar
        </button>
      </div>

      {loading ? (
        <div className="p-6 text-brand-text">Carregando...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-1 border-r border-gray-100">
            <div className="max-h-[70vh] overflow-auto">
              {rows.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className={`w-full text-left px-6 py-4 border-b border-gray-100 hover:bg-brand-peach/5 transition-colors ${
                    selected?.id === r.id ? 'bg-brand-peach/10' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium text-brand-dark">{r.client_name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {r.date} • {r.time} • {r.service_title}
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-50 text-brand-dark border border-gray-100">
                      {statusLabel[r.status]}
                    </span>
                  </div>
                </button>
              ))}

              {rows.length === 0 && (
                <div className="p-6 text-brand-text">Nenhum agendamento.</div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 p-6">
            {!selected ? (
              <div className="text-brand-text">Selecione um agendamento para ver a ficha.</div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-2xl text-brand-dark">{selected.client_name}</h2>
                    <div className="text-sm text-brand-text">
                      {selected.date} • {selected.time} • {selected.service_title}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <select
                      className="border border-gray-200 rounded-2xl px-3 py-2 text-sm"
                      value={selected.status}
                      onChange={(e) => updateSelected({ status: e.target.value as AppointmentRow['status'] })}
                      disabled={updating}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {statusLabel[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-brand-light rounded-2xl p-4">
                    <div className="text-gray-500">WhatsApp</div>
                    <div className="text-brand-dark font-medium">{selected.client_phone}</div>
                  </div>
                  <div className="bg-brand-light rounded-2xl p-4">
                    <div className="text-gray-500">Email</div>
                    <div className="text-brand-dark font-medium">{selected.client_email || '—'}</div>
                  </div>
                  <div className="bg-brand-light rounded-2xl p-4">
                    <div className="text-gray-500">Atendimento</div>
                    <div className="text-brand-dark font-medium">{selected.mode === 'presencial' ? 'Presencial' : 'Online'}</div>
                  </div>
                  <div className="bg-brand-light rounded-2xl p-4">
                    <div className="text-gray-500">Primeira vez</div>
                    <div className="text-brand-dark font-medium">{selected.first_time ? 'Sim' : 'Não'}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Motivo</div>
                    <div className="text-brand-dark">{selected.reason || '—'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Importante antes do atendimento</div>
                    <div className="text-brand-dark whitespace-pre-wrap">{selected.important_info || '—'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Restrições / observações</div>
                    <div className="text-brand-dark whitespace-pre-wrap">{selected.restrictions || '—'}</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-2">Observações internas (Wemily)</div>
                  <textarea
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 min-h-28 focus:outline-none focus:ring-2 focus:ring-brand-peach/30"
                    value={selected.admin_notes || ''}
                    onChange={(e) => setSelected((prev) => (prev ? { ...prev, admin_notes: e.target.value } : prev))}
                    placeholder="Anotações internas..."
                  />
                  <div className="mt-3 flex justify-end">
                    <button
                      className="bg-brand-dark text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-black transition-colors disabled:opacity-60"
                      onClick={() => updateSelected({ admin_notes: selected.admin_notes })}
                      disabled={updating}
                    >
                      {updating ? 'Salvando...' : 'Salvar observações'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-light px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl text-brand-dark">Admin</h1>
            <p className="text-brand-text">Agendamentos e fichas.</p>
          </div>

          <button
            className="bg-brand-dark text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-black transition-colors"
            onClick={() => supabase?.auth.signOut()}
            disabled={!supabase}
          >
            Sair
          </button>
        </div>

        {!isSupabaseConfigured && (
          <div className="mb-6 bg-brand-peach/10 border border-brand-peach/20 text-brand-dark rounded-2xl px-4 py-3">
            Painel indisponível: configure o Supabase (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY).
          </div>
        )}

        {error && (
          <div className="mb-6 bg-brand-peach/10 border border-brand-peach/20 text-brand-dark rounded-2xl px-4 py-3">
            {error}
          </div>
        )}

        {panel}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
