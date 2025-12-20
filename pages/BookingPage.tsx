import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SERVICES, WHATSAPP_PHONE } from '../constants';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import { ArrowLeft, CalendarDays, Check, Clock, MessageCircle } from 'lucide-react';

type BookingStep = 'select' | 'form' | 'done';

type AttendanceMode = 'presencial' | 'online';

type BookingForm = {
  serviceTitle: string;
  date: string;
  time: string;
  mode: AttendanceMode;
  firstTime: boolean;
  name: string;
  phone: string;
  email: string;
  birthDate: string;
  reason: string;
  hadServiceBefore: boolean;
  importantInfo: string;
  restrictions: string;
  confirm: boolean;
};

const timeSlots = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00'
];

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

const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get('service') ?? '';

  const [step, setStep] = React.useState<BookingStep>('select');
  const [loadingSlots, setLoadingSlots] = React.useState(false);
  const [bookedTimes, setBookedTimes] = React.useState<string[]>([]);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [form, setForm] = React.useState<BookingForm>({
    serviceTitle: preselectedService || SERVICES[0]?.title || '',
    date: '',
    time: '',
    mode: 'presencial',
    firstTime: true,
    name: '',
    phone: '',
    email: '',
    birthDate: '',
    reason: '',
    hadServiceBefore: false,
    importantInfo: '',
    restrictions: '',
    confirm: false
  });

  React.useEffect(() => {
    if (!preselectedService) return;
    setForm((prev) => ({ ...prev, serviceTitle: preselectedService }));
  }, [preselectedService]);

  const fetchBookedTimes = async (date: string) => {
    if (!isSupabaseConfigured || !supabase) {
      setBookedTimes([]);
      return;
    }

    setLoadingSlots(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('appointments')
        .select('time')
        .eq('date', date)
        .neq('status', 'cancelado');

      if (err) throw err;
      setBookedTimes((data ?? []).map((row: { time: string }) => row.time));
    } catch (e) {
      setBookedTimes([]);
      setError('Não foi possível carregar os horários.');
    } finally {
      setLoadingSlots(false);
    }
  };

  const availableSlots = React.useMemo(() => {
    return timeSlots.filter((t) => !bookedTimes.includes(t));
  }, [bookedTimes]);

  const quickDays = React.useMemo(() => {
    const today = new Date();
    return Array.from({ length: 5 }).map((_, i) => toISODate(addDays(today, i)));
  }, []);

  const goToForm = async () => {
    if (!form.serviceTitle || !form.date || !form.time) {
      setError('Escolha serviço, data e horário.');
      return;
    }
    setError(null);
    setStep('form');
  };

  const submit = async () => {
    if (!form.name || !form.phone || !form.serviceTitle || !form.date || !form.time) {
      setError('Preencha nome, WhatsApp, serviço, data e horário.');
      return;
    }
    if (!form.confirm) {
      setError('Confirme que as informações são verdadeiras.');
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setStep('done');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        status: 'novo',
        service_title: form.serviceTitle,
        date: form.date,
        time: form.time,
        mode: form.mode,
        first_time: form.firstTime,
        client_name: form.name,
        client_phone: form.phone,
        client_email: form.email || null,
        client_birthdate: form.birthDate || null,
        reason: form.reason || null,
        had_service_before: form.hadServiceBefore,
        important_info: form.importantInfo || null,
        restrictions: form.restrictions || null
      };

      const { error: err } = await supabase.from('appointments').insert(payload);
      if (err) throw err;

      setStep('done');
    } catch (e) {
      setError('Não foi possível confirmar o agendamento.');
    } finally {
      setSaving(false);
    }
  };

  const waText = encodeURIComponent(
    `Olá! Gostaria de confirmar meu agendamento:\n\n` +
      `Nome: ${form.name}\n` +
      `Serviço: ${form.serviceTitle}\n` +
      `Data: ${form.date}\n` +
      `Horário: ${form.time}`
  );
  const waLink = `https://wa.me/${WHATSAPP_PHONE}?text=${waText}`;

  return (
    <div className="min-h-screen bg-brand-light">
      <div className="max-w-md mx-auto px-6 pt-8 pb-24">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="h-11 w-11 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-brand-dark"
            aria-label="Voltar"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="text-center">
            <div className="text-brand-dark font-medium">Agendar</div>
            <div className="text-xs text-gray-500">Rápido e prático</div>
          </div>
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="h-11 w-11 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-brand-peach"
            aria-label="WhatsApp"
          >
            <MessageCircle size={18} />
          </a>
        </div>

        {!isSupabaseConfigured && (
          <div className="mt-6 bg-brand-peach/10 border border-brand-peach/20 text-brand-dark rounded-2xl px-4 py-3 text-sm">
            Agendamento online temporariamente indisponível. Você ainda pode preencher e confirmar pelo WhatsApp.
          </div>
        )}

        {error && (
          <div className="mt-4 bg-brand-peach/10 border border-brand-peach/20 text-brand-dark rounded-2xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {step === 'select' && (
          <div className="mt-6 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-brand-peach/15 p-5">
              <div className="text-sm text-gray-500 mb-3">Escolha o serviço</div>
              <div className="grid grid-cols-1 gap-3">
                {SERVICES.map((s) => {
                  const active = form.serviceTitle === s.title;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, serviceTitle: s.title }))}
                      className={`w-full rounded-2xl border px-4 py-3 text-left transition-colors ${
                        active
                          ? 'border-brand-peach bg-brand-peach/10'
                          : 'border-gray-100 bg-white hover:bg-brand-peach/5'
                      }`}
                    >
                      <div className="font-medium text-brand-dark">{s.title}</div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2">{s.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-brand-peach/15 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm text-gray-500">Data</div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CalendarDays size={14} />
                  <span>Escolha um dia</span>
                </div>
              </div>

              <div className="mt-3 flex gap-3 overflow-auto pb-2">
                {quickDays.map((iso) => {
                  const { dow, day } = formatShortPt(iso);
                  const active = form.date === iso;
                  return (
                    <button
                      key={iso}
                      type="button"
                      onClick={async () => {
                        setForm((p) => ({ ...p, date: iso, time: '' }));
                        await fetchBookedTimes(iso);
                      }}
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

              <div className="mt-3">
                <input
                  type="date"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-peach/30"
                  value={form.date}
                  onChange={async (e) => {
                    const date = e.target.value;
                    setForm((p) => ({ ...p, date, time: '' }));
                    if (date) await fetchBookedTimes(date);
                  }}
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-brand-peach/15 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm text-gray-500">Horário</div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock size={14} />
                  <span>{loadingSlots ? 'Carregando...' : 'Toque para escolher'}</span>
                </div>
              </div>

              {!form.date ? (
                <div className="mt-4 text-sm text-brand-text">Selecione uma data para ver os horários.</div>
              ) : (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {availableSlots.map((t) => {
                    const active = form.time === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, time: t }))}
                        className={`rounded-2xl border px-2 py-3 text-sm font-semibold transition-colors ${
                          active
                            ? 'border-brand-peach bg-brand-peach text-white'
                            : 'border-gray-100 bg-white text-brand-dark hover:bg-brand-peach/5'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              )}

              {form.date && !loadingSlots && availableSlots.length === 0 && (
                <div className="mt-3 text-sm text-brand-text">Sem horários disponíveis nessa data.</div>
              )}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-brand-peach/15 p-5">
              <div className="text-sm text-gray-500 mb-3">Forma de atendimento</div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, mode: 'presencial' }))}
                  className={`rounded-2xl border px-4 py-3 font-medium transition-colors ${
                    form.mode === 'presencial'
                      ? 'border-brand-peach bg-brand-peach/10 text-brand-dark'
                      : 'border-gray-100 bg-white text-gray-600'
                  }`}
                >
                  Presencial
                </button>
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, mode: 'online' }))}
                  className={`rounded-2xl border px-4 py-3 font-medium transition-colors ${
                    form.mode === 'online'
                      ? 'border-brand-peach bg-brand-peach/10 text-brand-dark'
                      : 'border-gray-100 bg-white text-gray-600'
                  }`}
                >
                  Online
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'form' && (
          <div className="mt-6 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-brand-peach/15 p-5">
              <div className="text-xs text-gray-500">Seu horário</div>
              <div className="mt-1 text-brand-dark font-medium">
                {form.serviceTitle} • {form.date} • {form.time}
              </div>
              <button
                type="button"
                onClick={() => setStep('select')}
                className="mt-3 text-sm text-brand-peach font-semibold hover:underline"
              >
                Alterar
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-brand-peach/15 p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-brand-text mb-2">Nome completo</label>
                  <input
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-peach/30"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm text-brand-text mb-2">WhatsApp</label>
                  <input
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-peach/30"
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="(66) 99999-9999"
                  />
                </div>
              </div>
            </div>

            <details className="bg-white rounded-3xl shadow-sm border border-brand-peach/15 p-5">
              <summary className="cursor-pointer text-sm font-semibold text-brand-dark">Informações adicionais (opcional)</summary>
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-brand-text mb-2">E-mail (opcional)</label>
                    <input
                      type="email"
                      className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-peach/30"
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-brand-text mb-2">Data de nascimento (opcional)</label>
                    <input
                      type="date"
                      className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-peach/30"
                      value={form.birthDate}
                      onChange={(e) => setForm((p) => ({ ...p, birthDate: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-brand-text mb-2">Primeira vez?</label>
                    <select
                      className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-peach/30"
                      value={form.firstTime ? 'sim' : 'nao'}
                      onChange={(e) => setForm((p) => ({ ...p, firstTime: e.target.value === 'sim' }))}
                    >
                      <option value="sim">Sim</option>
                      <option value="nao">Não</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-brand-text mb-2">Já fez esse serviço antes?</label>
                    <select
                      className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-peach/30"
                      value={form.hadServiceBefore ? 'sim' : 'nao'}
                      onChange={(e) => setForm((p) => ({ ...p, hadServiceBefore: e.target.value === 'sim' }))}
                    >
                      <option value="nao">Não</option>
                      <option value="sim">Sim</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-brand-text mb-2">Qual o principal motivo do agendamento?</label>
                  <input
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-peach/30"
                    value={form.reason}
                    onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm text-brand-text mb-2">Existe algo importante que devemos saber antes do atendimento?</label>
                  <textarea
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-peach/30 min-h-28"
                    value={form.importantInfo}
                    onChange={(e) => setForm((p) => ({ ...p, importantInfo: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm text-brand-text mb-2">Possui alguma restrição, condição ou observação?</label>
                  <textarea
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-peach/30 min-h-28"
                    value={form.restrictions}
                    onChange={(e) => setForm((p) => ({ ...p, restrictions: e.target.value }))}
                  />
                </div>
              </div>
            </details>

            <label className="flex items-start gap-3 text-sm text-brand-text bg-white rounded-3xl shadow-sm border border-brand-peach/15 p-5">
              <input
                type="checkbox"
                className="mt-1"
                checked={form.confirm}
                onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.checked }))}
              />
              <span>Confirmo que as informações acima são verdadeiras</span>
            </label>
          </div>
        )}

        {step === 'done' && (
          <div className="mt-6 space-y-4">
            <div className="bg-white rounded-3xl shadow-sm border border-brand-peach/15 p-6">
              <div className="flex items-center gap-2 text-brand-dark">
                <Check size={18} className="text-brand-peach" />
                <div className="font-medium">Agendamento enviado</div>
              </div>
              <div className="text-sm text-brand-text mt-2">Em breve você receberá a confirmação.</div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="bg-brand-light rounded-2xl p-3">
                  <div className="text-xs text-gray-500">Serviço</div>
                  <div className="text-brand-dark font-medium line-clamp-2">{form.serviceTitle}</div>
                </div>
                <div className="bg-brand-light rounded-2xl p-3">
                  <div className="text-xs text-gray-500">Data</div>
                  <div className="text-brand-dark font-medium">{form.date}</div>
                </div>
                <div className="bg-brand-light rounded-2xl p-3">
                  <div className="text-xs text-gray-500">Horário</div>
                  <div className="text-brand-dark font-medium">{form.time}</div>
                </div>
                <div className="bg-brand-light rounded-2xl p-3">
                  <div className="text-xs text-gray-500">Atendimento</div>
                  <div className="text-brand-dark font-medium">{form.mode === 'presencial' ? 'Presencial' : 'Online'}</div>
                </div>
              </div>
            </div>

            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-brand-peach text-white px-6 py-4 rounded-2xl text-sm font-semibold hover:opacity-95 transition-colors text-center block"
            >
              Confirmar no WhatsApp
            </a>

            <Link
              to="/"
              className="w-full bg-white border border-gray-100 text-brand-dark px-6 py-4 rounded-2xl text-sm font-semibold hover:bg-brand-peach/5 transition-colors text-center block"
            >
              Voltar para o site
            </Link>
          </div>
        )}
      </div>

      {step === 'select' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-gray-100">
          <div className="max-w-md mx-auto px-6 py-4 flex gap-3">
            <button
              className="flex-1 bg-brand-peach text-white px-5 py-4 rounded-2xl text-sm font-semibold disabled:opacity-60"
              onClick={goToForm}
              disabled={!form.serviceTitle || !form.date || !form.time}
            >
              Continuar
            </button>
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-4 rounded-2xl border border-gray-100 bg-white text-brand-dark text-sm font-semibold flex items-center justify-center"
              aria-label="Falar no WhatsApp"
            >
              <MessageCircle size={18} />
            </a>
          </div>
        </div>
      )}

      {step === 'form' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-gray-100">
          <div className="max-w-md mx-auto px-6 py-4 flex gap-3">
            <button
              className="px-5 py-4 rounded-2xl border border-gray-100 bg-white text-brand-dark text-sm font-semibold"
              onClick={() => setStep('select')}
              disabled={saving}
            >
              Voltar
            </button>
            <button
              className="flex-1 bg-brand-peach text-white px-5 py-4 rounded-2xl text-sm font-semibold disabled:opacity-60"
              onClick={submit}
              disabled={saving}
            >
              {saving ? 'Confirmando...' : 'Confirmar agendamento'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
