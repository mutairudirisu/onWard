"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type AuthCtx = {
  user: User | null;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = async (next: User | null) => {
      setUser(next);
      setReady(true);
    };
    supabase.auth.getSession().then(({ data }) => void sync(data.session?.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => void sync(session?.user ?? null));
    return () => { listener.subscription.unsubscribe(); };
  }, []);

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw error;
  }
  async function signUp(email: string, password: string) {
    const { error } = await supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: window.location.origin } });
    if (error) throw error;
  }
  async function signOut() { await supabase.auth.signOut(); }

  if (!ready) return null;
  return <AuthContext.Provider value={{ user, ready: true, signIn, signUp, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthCtx {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
