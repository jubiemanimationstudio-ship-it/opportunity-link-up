export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  type: string;
  message: string;
  country?: string;
  read: boolean;
  archived: boolean;
  createdAt: string;
}

interface ContactStore {
  list: ContactMessage[];
  initialized: boolean;
}

declare global {
  var __contactStore: ContactStore | undefined;
}

const SEED: Omit<ContactMessage, "id" | "read" | "archived" | "createdAt">[] = [
  {
    name: "Aisha Bello",
    email: "aisha.bello@gmail.com",
    type: "Submit an opportunity",
    message: "Hi, I want to flag the African Leadership University scholarship \u2014 deadline moved to Dec 15.",
    country: "Nigeria"
  },
  {
    name: "Kemi Adeyemi",
    email: "kemi@yahoo.com",
    type: "Partnership / press",
    message: "Hello, I write for a Pan-African education newsletter. Can we do a feature on Link-Up?",
    country: "Kenya"
  },
  {
    name: "Tunde Okeke",
    email: "tunde.okeke@outlook.com",
    type: "Correct a post",
    message: "The Chevening link is broken \u2014 404. Please update.",
    country: "UK"
  },
  {
    name: "Lerato Mokoena",
    email: "lerato.m@gmail.com",
    type: "General question",
    message: "Do you accept sponsored posts from universities?",
    country: "South Africa"
  },
  {
    name: "Wanjiku Mwangi",
    email: "w.mwangi@yahoo.com",
    type: "Submit an opportunity",
    message: "There's a new Mastercard Foundation scholars cohort. Link attached.",
    country: "Kenya"
  },
  {
    name: "Kwame Mensah",
    email: "kwame.mensah@yahoo.com",
    type: "Report an issue",
    message: "Filter \u201cremote only\u201d doesn't work on mobile for me.",
    country: "Ghana"
  }
];

function getStore(): ContactStore {
  if (!globalThis.__contactStore) {
    const now = Date.now();
    globalThis.__contactStore = {
      list: SEED.map((s, i) => ({
        ...s,
        id: `seed-${i + 1}`,
        read: i >= 2,
        archived: false,
        createdAt: new Date(now - (i + 1) * 4 * 60 * 60 * 1000).toISOString()
      })),
      initialized: true
    };
  }
  return globalThis.__contactStore;
}

export function getAllContactMessages(): ContactMessage[] {
  return getStore().list;
}

export function getUnreadCount(): number {
  return getStore().list.filter((m) => !m.read && !m.archived).length;
}

export function addContactMessage(
  input: Omit<ContactMessage, "id" | "read" | "archived" | "createdAt">
): ContactMessage {
  const entry: ContactMessage = {
    ...input,
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    read: false,
    archived: false,
    createdAt: new Date().toISOString()
  };
  getStore().list.unshift(entry);
  return entry;
}

export function markRead(id: string, read = true): boolean {
  const m = getStore().list.find((x) => x.id === id);
  if (!m) return false;
  m.read = read;
  return true;
}

export function markArchived(id: string, archived = true): boolean {
  const m = getStore().list.find((x) => x.id === id);
  if (!m) return false;
  m.archived = archived;
  return true;
}
