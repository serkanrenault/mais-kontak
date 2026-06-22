export type Brand = "Renault" | "Dacia" | "Alpine";

export type SmsStatusCode = 0 | 1 | 2; // Turatel: 0=Failed, 1=Delivered, 2=Pending

export interface User {
  id: string;
  name: string;
  email: string;
  role: "agent" | "admin";
}

export interface SmsTemplate {
  id: string;
  brand: Brand;
  title: string;
  body: string;
  createdAt: string;
}

export interface SmsLog {
  id: string;
  date: string;
  agentName: string;
  phone: string;
  originator: Brand;
  message: string;
  status: SmsStatusCode;
  scheduledAt?: string;
}

export interface SystemLog {
  id: string;
  date: string;
  actor: string;
  action: string;
  detail: string;
  level: "info" | "warn" | "error";
}
