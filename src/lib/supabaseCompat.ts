import { createClient, type SupabaseClient, type User as SupabaseUser } from "@supabase/supabase-js";

const env = ((import.meta as ImportMeta & { env?: Record<string, string> }).env || {});
const supabaseUrl = env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || "";
const documentsTable = env.VITE_SUPABASE_DOCUMENTS_TABLE || "riksa_documents";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

function requireSupabase() {
  if (!supabase) {
    throw new Error("Supabase belum dikonfigurasi. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.");
  }
  return supabase;
}

export interface User {
  uid: string;
  id: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  tenantId: string | null;
  providerData: { providerId: string; email?: string | null }[];
}

export const auth: { currentUser: User | null } = {
  currentUser: null,
};

function toCompatUser(user: SupabaseUser | null): User | null {
  if (!user) return null;
  const metadata = user.user_metadata || {};
  return {
    uid: user.id,
    id: user.id,
    email: user.email ?? null,
    displayName: metadata.full_name || metadata.name || user.email?.split("@")[0] || null,
    emailVerified: Boolean(user.email_confirmed_at),
    isAnonymous: user.is_anonymous || false,
    tenantId: null,
    providerData: (user.identities || []).map((identity) => ({
      providerId: identity.provider,
      email: user.email ?? null,
    })),
  };
}

export function onAuthStateChanged(_auth: typeof auth, callback: (user: User | null) => void) {
  if (!supabase) {
    setTimeout(() => callback(null), 0);
    return () => {};
  }

  let active = true;
  supabase.auth.getSession().then(({ data }) => {
    if (!active) return;
    auth.currentUser = toCompatUser(data.session?.user ?? null);
    callback(auth.currentUser);
  });

  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    auth.currentUser = toCompatUser(session?.user ?? null);
    callback(auth.currentUser);
  });

  return () => {
    active = false;
    data.subscription.unsubscribe();
  };
}

export class GoogleAuthProvider {}

export async function signInWithPopup(_auth: typeof auth, _provider: GoogleAuthProvider) {
  const client = requireSupabase();
  const { error } = await client.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.href },
  });
  if (error) throw error;

  const { data } = await client.auth.getSession();
  auth.currentUser = toCompatUser(data.session?.user ?? null);
  return { user: auth.currentUser };
}

export async function signOut(_auth: typeof auth) {
  const client = requireSupabase();
  const { error } = await client.auth.signOut();
  if (error) throw error;
  auth.currentUser = null;
}

type Constraint =
  | { type: "where"; field: string; op: string; value: unknown }
  | { type: "orderBy"; field: string; direction: "asc" | "desc" };

interface CollectionRef {
  collectionName: string;
  constraints: Constraint[];
}

interface DocumentRef {
  collectionName: string;
  id: string;
}

interface StoredDocument {
  id: string;
  data: Record<string, any>;
}

class CompatDocumentSnapshot {
  constructor(public id: string, private value: Record<string, unknown> | null) {}

  exists() {
    return this.value !== null;
  }

  data(): any {
    return this.value || {};
  }
}

class CompatQuerySnapshot {
  docs: CompatDocumentSnapshot[];

  constructor(docs: CompatDocumentSnapshot[]) {
    this.docs = docs;
  }

  forEach(callback: (doc: CompatDocumentSnapshot) => void) {
    this.docs.forEach(callback);
  }
}

export const db = { provider: "supabase", table: documentsTable };

export function doc(_db: typeof db, collectionName: string, id: string): DocumentRef {
  return { collectionName, id };
}

export function collection(_db: typeof db, collectionName: string): CollectionRef {
  return { collectionName, constraints: [] };
}

export function where(field: string, op: string, value: unknown): Constraint {
  return { type: "where", field, op, value };
}

export function orderBy(field: string, direction: "asc" | "desc" = "asc"): Constraint {
  return { type: "orderBy", field, direction };
}

export function query(target: CollectionRef, ...constraints: Constraint[]): CollectionRef {
  return {
    collectionName: target.collectionName,
    constraints: [...target.constraints, ...constraints],
  };
}

export async function getDoc(ref: DocumentRef) {
  const client = requireSupabase();
  const { data, error } = await client
    .from(documentsTable)
    .select("id,data")
    .eq("collection", ref.collectionName)
    .eq("id", ref.id)
    .maybeSingle<StoredDocument>();

  if (error) throw error;
  return new CompatDocumentSnapshot(ref.id, data?.data ?? null);
}

export const getDocFromServer = getDoc;

export async function getDocs(ref: CollectionRef) {
  const client = requireSupabase();
  const { data, error } = await client
    .from(documentsTable)
    .select("id,data")
    .eq("collection", ref.collectionName);

  if (error) throw error;

  let rows = ((data || []) as StoredDocument[]).map((row) => ({
    id: row.id,
    data: row.data || {},
  }));

  for (const constraint of ref.constraints) {
    if (constraint.type === "where") {
      rows = rows.filter((row) => {
        if (constraint.op !== "==") return true;
        return row.data?.[constraint.field] === constraint.value;
      });
    }
  }

  const sorters = ref.constraints.filter((constraint) => constraint.type === "orderBy");
  for (const sorter of sorters) {
    rows.sort((a, b) => {
      const left = a.data?.[sorter.field] as string | number | boolean | null | undefined;
      const right = b.data?.[sorter.field] as string | number | boolean | null | undefined;
      if (left === right) return 0;
      if (left == null) return sorter.direction === "desc" ? 1 : -1;
      if (right == null) return sorter.direction === "desc" ? -1 : 1;
      return (left > right ? 1 : -1) * (sorter.direction === "desc" ? -1 : 1);
    });
  }

  return new CompatQuerySnapshot(rows.map((row) => new CompatDocumentSnapshot(row.id, row.data)));
}

export async function setDoc(ref: DocumentRef, value: object, options?: { merge?: boolean }) {
  const client = requireSupabase();
  let nextData: object = value;

  if (options?.merge) {
    const existing = await getDoc(ref);
    nextData = { ...existing.data(), ...value };
  }

  const { error } = await client.from(documentsTable).upsert({
    collection: ref.collectionName,
    id: ref.id,
    data: nextData,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
}

export async function updateDoc(ref: DocumentRef, value: object) {
  const existing = await getDoc(ref);
  if (!existing.exists()) {
    throw new Error(`Dokumen ${ref.collectionName}/${ref.id} tidak ditemukan.`);
  }
  await setDoc(ref, value, { merge: true });
}

export async function addDoc(ref: CollectionRef, value: object) {
  const id = crypto.randomUUID ? crypto.randomUUID() : `doc_${Date.now()}`;
  await setDoc(doc(db, ref.collectionName, id), value);
  return doc(db, ref.collectionName, id);
}

export async function deleteDoc(ref: DocumentRef) {
  const client = requireSupabase();
  const { error } = await client
    .from(documentsTable)
    .delete()
    .eq("collection", ref.collectionName)
    .eq("id", ref.id);

  if (error) throw error;
}

export function onSnapshot(
  ref: DocumentRef,
  _options: unknown,
  onNext: (snapshot: CompatDocumentSnapshot & { metadata: { fromCache: boolean; hasPendingWrites: boolean } }) => void,
  onError?: (error: unknown) => void,
) {
  if (!supabase) {
    onError?.(new Error("Supabase belum dikonfigurasi."));
    return () => {};
  }

  const emit = () => {
    getDoc(ref)
      .then((snapshot) => {
        onNext(Object.assign(snapshot, { metadata: { fromCache: false, hasPendingWrites: false } }));
      })
      .catch((error) => onError?.(error));
  };

  emit();

  const channel = supabase
    .channel(`riksa-doc-${ref.collectionName}-${ref.id}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: documentsTable,
        filter: `collection=eq.${ref.collectionName}`,
      },
      (payload) => {
        const changed = (payload.new || payload.old) as { id?: string };
        if (changed?.id === ref.id) emit();
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
