import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { SERVICES, WHATSAPP_PHONE } from '../constants';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

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
    <section className="py-16 md:py-20 bg-brand-light">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="bg-white rounded-3xl shadow-sm border border-brand-peach/15 p-6 md:p-10">
          <h1 className="font-serif text-3xl md:text-4xl text-brand-dark mb-2">Agendar atendimento</h1>
          <p className="text-brand-text mb-8">Escolha o melhor horário e preencha a ficha. Leva menos de 1 minuto.</p>

          {!isSupabaseConfigured && (
            <div className="mb-6 bg-brand-peach/10 border border-brand-peach/20 text-brand-dark rounded-2xl px-4 py-3">
              Agendamento online temporariamente indisponível. Você ainda pode preencher e confirmar pelo WhatsApp.
            </div>
          )}

          {error && (
            <div className="mb-6 bg-brand-peach/10 border border-brand-peach/20 text-brand-dark rounded-2xl px-4 py-3">
              {error}
            </div>
          )}

          {step === 'select' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-brand-text mb-2">Serviço</label>
                  <select
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-peach/30"
                    value={form.serviceTitle}
                    onChange={(e) => setForm((p) => ({ ...p, serviceTitle: e.target.value }))}
                  >
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-brand-text mb-2">Forma de atendimento</label>
                  <select
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-peach/30"
                    value={form.mode}
                    onChange={(e) => setForm((p) => ({ ...p, mode: e.target.value as AttendanceMode }))}
                  >
                    <option value="presencial">Presencial</option>
                    <option value="online">Online</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-brand-text mb-2">Data</label>
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

                <div>
                  <label className="block text-sm text-brand-text mb-2">Horário</label>
                  <select
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-peach/30"
                    value={form.time}
                    onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
                    disabled={!form.date || loadingSlots}
                  >
                    <option value="">Selecione</option>
                    {availableSlots.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {form.date && !loadingSlots && availableSlots.length === 0 && (
                    <p className="text-xs text-gray-500 mt-2">Sem horários disponíveis nessa data.</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  className="w-full bg-brand-dark text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-black transition-colors"
                  onClick={goToForm}
                >
                  Continuar
                </button>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full border border-brand-peach/30 text-brand-dark px-6 py-3 rounded-full text-sm font-medium text-center hover:bg-brand-peach/10 transition-colors"
                >
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          )}

          {step === 'form' && (
            <div className="space-y-6">
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

              <label className="flex items-start gap-3 text-sm text-brand-text">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={form.confirm}
                  onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.checked }))}
                />
                <span>Confirmo que as informações acima são verdadeiras</span>
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  className="w-full border border-gray-200 text-brand-dark px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
                  onClick={() => setStep('select')}
                  disabled={saving}
                >
                  Voltar
                </button>
                <button
                  className="w-full bg-brand-dark text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-black transition-colors disabled:opacity-60"
                  onClick={submit}
                  disabled={saving}
                >
                  {saving ? 'Confirmando...' : 'Confirmar agendamento'}
                </button>
              </div>
            </div>
          )}

          {step === 'done' && (
            <div className="space-y-6">
              <div className="bg-brand-peach/10 border border-brand-peach/20 rounded-2xl px-4 py-3 text-brand-dark">
                Agendamento enviado! Em breve você receberá a confirmação.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-brand-text">
                <div><span className="text-gray-500">Serviço</span><div className="text-brand-dark font-medium">{form.serviceTitle}</div></div>
                <div><span className="text-gray-500">Data</span><div className="text-brand-dark font-medium">{form.date}</div></div>
                <div><span className="text-gray-500">Horário</span><div className="text-brand-dark font-medium">{form.time}</div></div>
                <div><span className="text-gray-500">Atendimento</span><div className="text-brand-dark font-medium">{form.mode === 'presencial' ? 'Presencial' : 'Online'}</div></div>
              </div>

              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-brand-peach text-white px-6 py-3 rounded-full text-sm font-medium hover:opacity-95 transition-colors text-center block"
              >
                Confirmar no WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BookingPage;
