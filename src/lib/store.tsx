import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { MOCK_HISTORY, MOCK_TEMPLATES } from "./mockData";
import type { SmsLog, SmsTemplate } from "./types";

interface StoreCtx {
  templates: SmsTemplate[];
  addTemplate: (t: Omit<SmsTemplate, "id" | "createdAt">) => void;
  removeTemplate: (id: string) => void;
  history: SmsLog[];
  addHistory: (h: Omit<SmsLog, "id">) => void;
}

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [templates, setTemplates] = useState<SmsTemplate[]>(MOCK_TEMPLATES);
  const [history, setHistory] = useState<SmsLog[]>(MOCK_HISTORY);

  const addTemplate = useCallback((t: Omit<SmsTemplate, "id" | "createdAt">) => {
    setTemplates((prev) => [
      { ...t, id: `t-${Date.now()}`, createdAt: new Date().toISOString() },
      ...prev,
    ]);
  }, []);

  const removeTemplate = useCallback((id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addHistory = useCallback((h: Omit<SmsLog, "id">) => {
    setHistory((prev) => [{ ...h, id: `s-${Date.now()}` }, ...prev]);
  }, []);

  const value = useMemo(
    () => ({ templates, addTemplate, removeTemplate, history, addHistory }),
    [templates, history, addTemplate, removeTemplate, addHistory],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used inside StoreProvider");
  return v;
}
