"use client";

import { useEffect, useRef, useState } from "react";

interface Msg {
  role: "user" | "bot";
  text: string;
}

const QUICK = ["Quiero cecina", "Quiero café", "Almuerzo hasta $4"];

export function ChatWidget() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "bot", text: "¡Bienvenido a Loja! ¿Se te antoja café, comida tradicional o un almuerzo? También puedes indicar un presupuesto: “almuerzo hasta $4”." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [msgs]);

  useEffect(() => {
    const open = () => dialogRef.current?.showModal();
    window.addEventListener("open-chat", open);
    return () => window.removeEventListener("open-chat", open);
  }, []);

  async function send(text: string) {
    const t = text.trim();
    if (!t || busy) return;
    const history = msgs.slice(1).slice(-6).map((m) => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text }));
    setMsgs((m) => [...m, { role: "user", text: t }]);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: t, history }),
      });
      const data: { reply?: string } = await res.json();
      setMsgs((m) => [...m, { role: "bot", text: data.reply ?? "No pude responder ahora. Intenta de nuevo." }]);
    } catch {
      setMsgs((m) => [...m, { role: "bot", text: "No pude conectarme. Intenta de nuevo en un momento." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        onClick={() => dialogRef.current?.showModal()}
        aria-label="Abrir asesor gastronómico"
        aria-haspopup="dialog"
        className="group fixed bottom-4 right-4 z-30 h-[55px] w-[55px] rounded-full border-4 border-cream bg-green font-serif text-2xl italic text-white shadow-lg transition hover:-translate-y-1 md:bottom-6 md:right-6 md:h-[62px] md:w-[62px]"
      >
        g
        <span className="absolute -right-1 -top-1.5 rounded-md border-2 border-cream bg-gold px-1 py-0.5 font-sans text-[8px] font-bold text-ink">IA</span>
        <span className="pointer-events-none absolute bottom-2 right-[75px] hidden w-[220px] translate-x-2 rounded-xl border border-line bg-paper p-3 font-sans text-[11px] not-italic text-ink opacity-0 shadow transition group-hover:translate-x-0 group-hover:opacity-100 md:block">
          ¿Qué se te antoja hoy? Cuéntame y te recomiendo.
        </span>
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="chat-title"
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="m-auto w-[min(440px,calc(100%-28px))] max-h-[85svh] rounded-2xl border border-line bg-paper p-0 text-ink shadow-2xl backdrop:bg-ink/50 backdrop:backdrop-blur-sm"
      >
        <div className="flex items-center justify-between border-b border-line p-5">
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-green font-serif text-[22px] italic text-white">g</span>
            <div id="chat-title">
              Asesor gastronómico
              <small className="block text-[9px] font-normal text-green">GuIAloja · Recomendador demo</small>
            </div>
          </div>
          <button onClick={() => dialogRef.current?.close()} aria-label="Cerrar asesor" className="h-[30px] w-[30px] rounded-full bg-[#eee7d9] text-xl leading-none">×</button>
        </div>
        <p className="bg-[#f3efdf] px-5 py-3 text-[10px] text-[#746344]">
          Asesor en fase de pruebas: confirma siempre horarios y menús con el restaurante.
        </p>
        <div ref={logRef} role="log" aria-live="polite" aria-label="Conversación" className="flex max-h-[300px] flex-col gap-3 overflow-auto p-5">
          {msgs.map((m, i) => (
            <div key={i} className={`whitespace-pre-line rounded-xl px-3.5 py-3 text-xs leading-relaxed ${m.role === "user" ? "max-w-[90%] self-end bg-clay text-white" : "bg-[#eaf0e4]"}`}>
              {m.text}
            </div>
          ))}
          {busy && <div className="rounded-xl bg-[#eaf0e4] px-3.5 py-3 text-xs text-muted">Pensando…</div>}
        </div>
        <div className="flex flex-wrap gap-2 px-5 pb-4">
          {QUICK.map((p) => (
            <button key={p} onClick={() => send(p)} className="rounded-full border border-[#e9dfce] px-3 py-1.5 text-[10px] text-[#6d604d] hover:bg-clay hover:text-white">{p}</button>
          ))}
        </div>
        <form
          className="flex gap-2 border-t border-line p-4"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <label htmlFor="chat-input" className="sr-only">Cuéntame qué quieres comer</label>
          <input id="chat-input" value={input} onChange={(e) => setInput(e.target.value)} maxLength={400} required autoComplete="off" placeholder="¿Qué se te antoja?" className="w-full min-w-0 rounded-lg border border-line p-2.5 text-xs" />
          <button disabled={busy} aria-label="Enviar mensaje" className="rounded-lg bg-clay px-3.5 text-white disabled:opacity-60">→</button>
        </form>
      </dialog>
    </>
  );
}
