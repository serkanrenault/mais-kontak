import type { SmsLog, SmsTemplate, SystemLog, User } from "./types";

export const MOCK_USER: User = {
  id: "u-001",
  name: "Mehmet Yılmaz",
  email: "mehmet.yilmaz@renaultmais.com.tr",
  role: "admin",
};

export const MOCK_TEMPLATES: SmsTemplate[] = [
  {
    id: "t-001",
    brand: "Renault",
    title: "Servis Randevu Hatırlatma",
    body: "Sayın [##Ad##], [##Tarih##] tarihli Renault servis randevunuzu hatırlatırız. İyi günler.",
    createdAt: "2025-04-12T10:00:00Z",
  },
  {
    id: "t-002",
    brand: "Dacia",
    title: "Kampanya Bilgilendirme",
    body: "Dacia ailesi olarak size özel kampanyamızdan yararlanmak için bayinizi ziyaret edin.",
    createdAt: "2025-05-02T09:30:00Z",
  },
  {
    id: "t-003",
    brand: "Alpine",
    title: "Test Sürüşü Daveti",
    body: "Sayın [##Ad##], yeni Alpine A290 test sürüşü için sizi bekliyoruz.",
    createdAt: "2025-05-20T14:15:00Z",
  },
  {
    id: "t-004",
    brand: "Renault",
    title: "Şifre Doğrulama",
    body: "Doğrulama kodunuz: [##Kod##]. Bu kodu kimseyle paylaşmayınız.",
    createdAt: "2025-06-01T08:00:00Z",
  },
];

const AGENTS = ["Mehmet Yılmaz", "Ayşe Demir", "Can Öztürk", "Elif Şahin", "Burak Kaya"];
const PHONES = ["+905321112233", "+905443334455", "+905556667788", "+905309998877", "+905324445566"];
const BRANDS = ["Renault", "Dacia", "Alpine"] as const;
const SAMPLES = [
  "Servis randevunuz onaylanmıştır.",
  "Kampanya detayları için bayinizi arayın.",
  "Aracınız teslimata hazırdır.",
  "Test sürüşü randevunuz iptal edildi.",
  "Doğrulama kodunuz: 482910",
];

export const MOCK_HISTORY: SmsLog[] = Array.from({ length: 42 }, (_, i) => {
  const d = new Date();
  d.setHours(d.getHours() - i * 3);
  const status = (i % 7 === 0 ? 0 : i % 5 === 0 ? 2 : 1) as 0 | 1 | 2;
  return {
    id: `s-${1000 + i}`,
    date: d.toISOString(),
    agentName: AGENTS[i % AGENTS.length],
    phone: PHONES[i % PHONES.length],
    originator: BRANDS[i % BRANDS.length],
    message: SAMPLES[i % SAMPLES.length],
    status,
  };
});

export const MOCK_SYSTEM_LOGS: SystemLog[] = [
  { id: "l-1", date: new Date().toISOString(), actor: "system", action: "Service Start", detail: "Mais Kontak gateway initialized", level: "info" },
  { id: "l-2", date: new Date(Date.now() - 3600e3).toISOString(), actor: "mehmet.yilmaz", action: "Login", detail: "Successful login from 10.0.12.4", level: "info" },
  { id: "l-3", date: new Date(Date.now() - 7200e3).toISOString(), actor: "ayse.demir", action: "Template Created", detail: "Template 't-004' added", level: "info" },
  { id: "l-4", date: new Date(Date.now() - 10800e3).toISOString(), actor: "turatel", action: "API Timeout", detail: "Retry succeeded after 1 attempt", level: "warn" },
  { id: "l-5", date: new Date(Date.now() - 86400e3).toISOString(), actor: "system", action: "Quota Warning", detail: "Daily SMS quota %80 used", level: "warn" },
  { id: "l-6", date: new Date(Date.now() - 172800e3).toISOString(), actor: "turatel", action: "Auth Failed", detail: "Invalid UserCode during scheduled job", level: "error" },
];

export const MOCK_DAILY_USAGE = [
  { day: "Pzt", count: 142 },
  { day: "Sal", count: 198 },
  { day: "Çar", count: 167 },
  { day: "Per", count: 224 },
  { day: "Cum", count: 289 },
  { day: "Cmt", count: 86 },
  { day: "Paz", count: 54 },
];
