import React, { useState, useEffect } from 'react';
import { CalendarPlus, Edit, Trash2, CheckCircle } from 'lucide-react';
import { Button } from './Button';
import { Modal } from './Modal';
import { Input } from './Input';
import { DB } from '../services/db';
import { Event } from '../types';
import { useAuth } from '../context/AuthContext';

export const Agenda = ({ clientId, googleCalendarId }: { clientId: string, googleCalendarId?: string }) => {
    const { user } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);

    // Fallback if clientId is missing (shouldn't happen with correct routing)
    if (!clientId) return <div className="p-8 text-center text-slate-400">Carregando agenda...</div>;

    // Auto-inject Google Calendar for 'ferramentas' if not provided
    const effectiveGoogleCalendarId = googleCalendarId || (clientId === 'ferramentas' ? 'ecossistemalive@gmail.com' : undefined);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState<Event>({ id: '', title: '', date: '', time: '', type: 'meeting', description: '', joined: false });

    useEffect(() => {
        loadEvents();
    }, [clientId]);

    const loadEvents = async () => {
        let evts = await DB.getEvents(clientId);

        if (effectiveGoogleCalendarId) {
            try {
                const fetched = await fetchGoogleEvents(effectiveGoogleCalendarId);
                // Merge strategies:
                // 1. Simple concat (might duplicate if syncing isn't handled)
                // 2. Filter duplicates based on details
                // For now, simple concat with a distinct 'google' type or source
                evts = [...evts, ...fetched];
            } catch (error) {
                console.error("Failed to fetch Google Calendar events:", error);
            }
        }

        // Sort by date/time
        evts.sort((a, b) => new Date(`${a.date}T${a.time || '00:00'}`).getTime() - new Date(`${b.date}T${b.time || '00:00'}`).getTime());

        setEvents(evts);
    };

    const fetchGoogleEvents = async (calendarId: string): Promise<Event[]> => {
        const apiKey = localStorage.getItem('firebase_key') || ''; // Reusing Gemini/Firebase key if compatible or needs a specific one
        // Note: Google Calendar API needs a specific scope/key usually. 
        // Using a public calendar fetch endpoint if possible, or standard API.
        // Endpoint: https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events?key={apiKey}

        if (!apiKey) return [];

        try {
            const now = new Date().toISOString();
            const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}&timeMin=${now}&singleEvents=true&orderBy=startTime`);

            if (!response.ok) {
                console.warn("Google Calendar API Error:", response.statusText);
                return [];
            }

            const data = await response.json();
            return (data.items || []).map((item: any) => ({
                id: item.id,
                title: item.summary,
                date: item.start.date || item.start.dateTime?.split('T')[0],
                time: item.start.dateTime?.split('T')[1]?.substring(0, 5) || '',
                type: 'meeting', // Default type
                description: item.description || 'Evento do Google Agenda',
                joined: false,
                link: item.htmlLink // Link to Google Calendar event
            }));
        } catch (e) {
            console.error("Fetch error:", e);
            return [];
        }
    };

    const handleSave = async () => {
        try {
            const newEvent = { ...currentEvent, id: currentEvent.id || Date.now().toString() };
            await DB.saveEvent(clientId, newEvent);
            loadEvents();
            setIsModalOpen(false);
        } catch (e) {
            console.error(e);
            alert("Erro ao salvar evento. Verifique sua conexão ou permissões.");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Excluir evento?')) {
            try {
                await DB.deleteEvent(clientId, id);
                loadEvents();
            } catch (e) {
                console.error(e);
                alert("Erro ao excluir evento.");
            }
        }
    };

    const toggleJoin = async (event: Event) => {
        try {
            await DB.saveEvent(clientId, { ...event, joined: !event.joined });
            loadEvents();
        } catch (e) {
            console.error(e);
            alert("Erro ao atualizar inscrição.");
        }
    };

    return (
        <div className="fade-in max-w-4xl mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold font-serif">Agenda & Eventos</h2>
                {user?.role === 'admin' && (
                    /* @ts-ignore */
                    <Button onClick={() => { setCurrentEvent({ id: '', title: '', date: '', time: '', type: 'meeting', description: '', joined: false }); setIsModalOpen(true); }}>
                        <CalendarPlus size={18} /> Novo Evento
                    </Button>
                )}
            </div>

            {/* Google Calendar Iframe Embed (Fallback for Private Calendars) */}
            {effectiveGoogleCalendarId && (
                <div className="mb-8 w-full h-[600px] bg-white/5 rounded-xl border border-slate-700 overflow-hidden">
                    <iframe
                        src={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(effectiveGoogleCalendarId)}&ctz=America%2FSao_Paulo&bgcolor=%230a253a&mode=AGENDA`}
                        style={{ border: 0 }}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        title="Google Calendar"
                    ></iframe>
                </div>
            )}

            <div className="grid gap-4">
                {events.map(event => (
                    <div key={event.id} className="card-v4 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="w-16 h-16 rounded-xl bg-[#00e800]/10 flex flex-col items-center justify-center text-[#00e800] border border-[#00e800]/20">
                                <span className="text-sm font-bold uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                <span className="text-2xl font-bold">{new Date(event.date).getDate() + 1}</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    {event.title}
                                    {event.time && <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">{event.time}</span>}
                                    {event.type && <span className="text-xs border border-slate-600 px-2 py-1 rounded text-slate-400 capitalize">{event.type}</span>}
                                </h3>
                                <p className="text-slate-400 text-sm">{event.description}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {user?.role === 'admin' && (
                                <>
                                    {/* @ts-ignore */}
                                    <Button variant="ghost" onClick={() => { setCurrentEvent(event); setIsModalOpen(true); }}><Edit size={16} /></Button>
                                    {/* @ts-ignore */}
                                    <Button variant="danger" onClick={() => handleDelete(event.id)}><Trash2 size={16} /></Button>
                                </>
                            )}
                            {/* @ts-ignore */}
                            <Button variant={event.joined ? "primary" : "secondary"} onClick={() => {
                                if (event.link) {
                                    let url = event.link.trim();
                                    if (!/^https?:\/\//i.test(url)) {
                                        url = 'https://' + url;
                                    }
                                    window.open(url, '_blank', 'noopener,noreferrer');
                                } else {
                                    toggleJoin(event);
                                }
                            }}>
                                {event.joined ? <><CheckCircle size={18} /> Inscrito</> : (event.link ? "Acessar Link" : "Inscrever-se")}
                            </Button>
                        </div>
                    </div>
                ))}
                {events.length === 0 && <p className="text-slate-500 text-center py-10">Nenhum evento agendado.</p>}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentEvent.id ? "Editar Evento" : "Novo Evento"}>
                <Input label="Título" value={currentEvent.title} onChange={(e: any) => setCurrentEvent({ ...currentEvent, title: e.target.value })} />
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Data" type="date" value={currentEvent.date} onChange={(e: any) => setCurrentEvent({ ...currentEvent, date: e.target.value })} />
                    <Input label="Horário" type="time" value={currentEvent.time || ''} onChange={(e: any) => setCurrentEvent({ ...currentEvent, time: e.target.value })} />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-400 mb-1">Tipo de Evento</label>
                    <select
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-[#00e800] focus:outline-none"
                        value={currentEvent.type || 'meeting'}
                        onChange={(e) => setCurrentEvent({ ...currentEvent, type: e.target.value as any })}
                    >
                        <option value="meeting">Reunião</option>
                        <option value="workshop">Workshop</option>
                        <option value="deadline">Prazo / Entrega</option>
                        <option value="other">Outro</option>
                    </select>
                </div>
                <Input label="Descrição" textarea value={currentEvent.description} onChange={(e: any) => setCurrentEvent({ ...currentEvent, description: e.target.value })} />
                <Input label="Link de Inscrição (Opcional)" placeholder="https://..." value={currentEvent.link || ''} onChange={(e: any) => setCurrentEvent({ ...currentEvent, link: e.target.value })} />
                {/* @ts-ignore */}
                <Button className="w-full mt-4" onClick={handleSave}>Salvar</Button>
            </Modal>
        </div>
    );
};
