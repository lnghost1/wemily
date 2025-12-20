import React from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import {
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  Clock,
  Plus,
  X
} from 'lucide-react';

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

const toISODate = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.toISOString().slice(0, 10);
};

const addDays = (d: Date, days: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
};

const formatShortPt = (isoDate: string) => {
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  return {
    dow: date
      .toLocaleDateString('pt-BR', { weekday: 'short' })
      .replace('.', '')
      .toUpperCase(),
    day: String(date.getDate()).padStart(2, '0')
  };
};

const getHour = (time: string) => {
  const [h] = time.split(':').map(Number);
  return Number.isFinite(h) ? (h as number) : 0;
};

const AdminDashboardPage: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [rows, setRows] = React.useState<AppointmentRow[]>([]);
  const [updating, setUpdating] = React.useState(false);
  const [selected, setSelected] = React.useState<AppointmentRow | null>(null);
  const [selectedDate, setSelectedDate] = React.useState(() => toISODate(new Date()));

  const quickDays = React.useMemo(() => {
    const today = new Date();
    return Array.from({ length: 5 }).map((_, i) => toISODate(addDays(today, i)));
  }, []);

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

  const todayISO = React.useMemo(() => toISODate(new Date()), []);

  const todayCount = React.useMemo(() => {
    return rows.filter((r) => r.date === todayISO && r.status !== 'cancelado').length;
  }, [rows, todayISO]);

  const pendingCount = React.useMemo(() => {
    return rows.filter((r) => r.status === 'novo' && r.date >= todayISO).length;
  }, [rows, todayISO]);

  const dayRows = React.useMemo(() => {
    return rows
      .filter((r) => r.date === selectedDate)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [rows, selectedDate]);

  const morning = React.useMemo(() => dayRows.filter((r) => getHour(r.time) < 12), [dayRows]);
  const afternoon = React.useMemo(() => dayRows.filter((r) => getHour(r.time) >= 12), [dayRows]);

  const statusBadgeClass = (s: AppointmentRow['status']) => {
    switch (s) {
      case 'confirmado':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'novo':
        return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'atendido':
        return 'bg-slate-50 text-slate-700 border-slate-100';
      case 'cancelado':
      default:
        return 'bg-rose-50 text-rose-700 border-rose-100';
    }
  };

  const updateRowStatus = async (row: AppointmentRow, status: AppointmentRow['status']) => {
    setSelected(row);
    await updateSelected({ status });
  };

  return (
    <div className="min-h-screen bg-brand-light">
      <div className="max-w-md mx-auto px-6 pt-10 pb-24">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-white border border-brand-peach/25 shadow-sm flex items-center justify-center">
              <div className="h-9 w-9 rounded-full bg-brand-peach/15" />
            </div>
            <div>
              <div className="text-brand-dark font-medium">Olá, Wemily</div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="h-10 w-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500"
              aria-label="Notificações"
            >
              <Bell size={18} />
            </button>
          </div>
        </div>

        {!isSupabaseConfigured && (
          <div className="mt-6 bg-brand-peach/10 border border-brand-peach/20 text-brand-dark rounded-2xl px-4 py-3 text-sm">
            Painel indisponível: configure o Supabase (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY).
          </div>
        )}

        {error && (
          <div className="mt-4 bg-brand-peach/10 border border-brand-peach/20 text-brand-dark rounded-2xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <CalendarDays size={14} />
              <span>HOJE</span>
            </div>
            <div className="mt-3 text-3xl font-semibold text-brand-dark">{todayCount}</div>
            <div className="mt-1 text-sm text-emerald-700">Agendados</div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <Clock size={14} />
              <span>PENDENTES</span>
            </div>
            <div className="mt-3 text-3xl font-semibold text-brand-dark">{pendingCount}</div>
            <div className="mt-1 text-sm text-orange-700">A confirmar</div>
          </div>
        </div>

        <div className="mt-8 flex items-end justify-between gap-4">
          <div className="font-serif text-2xl text-brand-dark">Agenda</div>
          <button
            type="button"
            className="text-sm text-brand-peach font-semibold flex items-center gap-2"
            onClick={load}
            disabled={loading}
          >
            Ver calendário <ChevronRight size={16} />
          </button>
        </div>

        <div className="mt-4 flex gap-3 overflow-auto pb-2">
          {quickDays.map((iso) => {
            const { dow, day } = formatShortPt(iso);
            const active = iso === selectedDate;
            return (
              <button
                key={iso}
                type="button"
                onClick={() => setSelectedDate(iso)}
                className={`shrink-0 w-16 rounded-2xl border px-2 py-3 text-center transition-colors ${
                  active
                    ? 'border-brand-peach bg-brand-peach text-white'
                    : 'border-gray-100 bg-white text-brand-dark'
                }`}
              >
                <div className={`text-[11px] ${active ? 'text-white/80' : 'text-gray-500'}`}>{dow}</div>
                <div className="text-lg font-semibold leading-none mt-1">{day}</div>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="mt-8 text-brand-text">Carregando...</div>
        ) : (
          <div className="mt-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                <span className="h-2 w-2 rounded-full bg-orange-400" />
                <span>MANHÃ</span>
              </div>
              <div className="mt-3 space-y-3">
                {morning.map((r) => (
                  <div key={r.id} className="relative bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-peach" />
                    <button
                      type="button"
                      className="w-full text-left p-4"
                      onClick={() => setSelected(r)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                            <span className="text-sm font-semibold">{r.client_name.slice(0, 1).toUpperCase()}</span>
                          </div>
                          <div>
                            <div className="font-medium text-brand-dark leading-snug">{r.client_name}</div>
                            <div className="text-xs text-gray-500 mt-1">{r.service_title}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-brand-peach font-semibold">{r.time}</div>
                          <div className="text-xs text-gray-500">60 min</div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className={`text-xs px-2 py-1 rounded-full border ${statusBadgeClass(r.status)}`}>
                          {statusLabel[r.status]}
                        </span>
                        {r.status === 'novo' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateRowStatus(r, 'confirmado');
                            }}
                            disabled={updating}
                            className="text-xs font-semibold text-brand-peach hover:underline"
                          >
                            Confirmar
                          </button>
                        )}
                      </div>
                    </button>
                  </div>
                ))}
                {morning.length === 0 && <div className="text-sm text-brand-text">Sem horários.</div>}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                <span className="h-2 w-2 rounded-full bg-brand-peach" />
                <span>TARDE</span>
              </div>
              <div className="mt-3 space-y-3">
                {afternoon.map((r) => (
                  <div key={r.id} className="relative bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-peach" />
                    <button
                      type="button"
                      className="w-full text-left p-4"
                      onClick={() => setSelected(r)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                            <span className="text-sm font-semibold">{r.client_name.slice(0, 1).toUpperCase()}</span>
                          </div>
                          <div>
                            <div className="font-medium text-brand-dark leading-snug">{r.client_name}</div>
                            <div className="text-xs text-gray-500 mt-1">{r.service_title}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-brand-peach font-semibold">{r.time}</div>
                          <div className="text-xs text-gray-500">60 min</div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className={`text-xs px-2 py-1 rounded-full border ${statusBadgeClass(r.status)}`}>
                          {statusLabel[r.status]}
                        </span>
                        {r.status === 'novo' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateRowStatus(r, 'confirmado');
                            }}
                            disabled={updating}
                            className="text-xs font-semibold text-brand-peach hover:underline"
                          >
                            Confirmar
                          </button>
                        )}
                      </div>
                    </button>
                  </div>
                ))}
                {afternoon.length === 0 && <div className="text-sm text-brand-text">Sem horários.</div>}
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        className="fixed bottom-20 right-6 h-14 w-14 rounded-full bg-brand-peach text-white shadow-lg shadow-brand-peach/25 flex items-center justify-center"
        aria-label="Novo"
      >
        <Plus size={22} />
      </button>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100">
        <div className="max-w-md mx-auto px-6 py-3 flex justify-between text-xs text-gray-500">
          <div className="text-brand-peach font-semibold">Agenda</div>
          <div>Clientes</div>
          <div>Finanças</div>
          <button
            type="button"
            className="text-gray-500"
            onClick={() => supabase?.auth.signOut()}
            disabled={!supabase}
          >
            Sair
          </button>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/30 flex items-end justify-center">
          <div className="w-full max-w-md bg-white rounded-t-3xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-brand-dark font-semibold">{selected.client_name}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {selected.date} • {selected.time} • {selected.service_title}
                </div>
              </div>
              <button
                type="button"
                className="h-10 w-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center"
                onClick={() => setSelected(null)}
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="bg-brand-light rounded-2xl p-3">
                <div className="text-xs text-gray-500">WhatsApp</div>
                <div className="text-brand-dark font-medium">{selected.client_phone}</div>
              </div>
              <div className="bg-brand-light rounded-2xl p-3">
                <div className="text-xs text-gray-500">Atendimento</div>
                <div className="text-brand-dark font-medium">{selected.mode === 'presencial' ? 'Presencial' : 'Online'}</div>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                className="flex-1 bg-brand-peach text-white px-5 py-4 rounded-2xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
                onClick={() => updateSelected({ status: 'confirmado' })}
                disabled={updating}
              >
                <Check size={18} />
                Confirmar
              </button>
              <button
                className="flex-1 bg-white border border-gray-100 text-brand-dark px-5 py-4 rounded-2xl text-sm font-semibold disabled:opacity-60"
                onClick={() => updateSelected({ status: 'atendido' })}
                disabled={updating}
              >
                Finalizar
              </button>
              <button
                className="h-[52px] w-[52px] rounded-2xl bg-white border border-gray-100 text-rose-600 flex items-center justify-center disabled:opacity-60"
                onClick={() => updateSelected({ status: 'cancelado' })}
                disabled={updating}
                aria-label="Cancelar"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
