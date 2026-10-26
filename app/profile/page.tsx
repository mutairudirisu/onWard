"use client";

import { useEffect, useState } from "react";
import { BackButton } from "@/components/BackButton";
import { supabase } from "@/lib/supabase";
import { useTasks } from "@/lib/task-context";

export default function ProfilePage() {
  const { tasks, user, theme, setTheme } = useTasks();
  const [notificationStatus, setNotificationStatus] = useState<NotificationPermission | "unsupported">("default");
  const [notificationMessage, setNotificationMessage] = useState("");

  const displayName = String(
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "onWard member"
  );
  const activeTasks = tasks.filter((t) => !t.archived);
  const completed = activeTasks.filter((t) => t.completed).length;
  const progress = activeTasks.length ? Math.round((completed / activeTasks.length) * 100) : 0;

  useEffect(() => {
    setNotificationStatus(typeof Notification === "undefined" ? "unsupported" : Notification.permission);
  }, []);

  async function enableNotifications() {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setNotificationStatus("unsupported");
      setNotificationMessage("Notifications are not supported by this browser.");
      return;
    }
    const registration = await navigator.serviceWorker.register("/sw.js");
    const permission = await Notification.requestPermission();
    setNotificationStatus(permission);
    if (permission !== "granted") {
      setNotificationMessage("Notification permission was not granted.");
      return;
    }
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (vapidKey && "PushManager" in window) {
      const base64 = vapidKey.replace(/-/g, "+").replace(/_/g, "/");
      const bytes = Uint8Array.from(
        atob(base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=")),
        (character) => character.charCodeAt(0)
      );
      await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: bytes });
    }
    setNotificationMessage("Notifications are enabled on this device.");
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
  }

  const personal = [
    ["●", "Profile info", "Name and account details"],
    ["⌖", "Location info", "Add your timezone"],
    ["◎", "Social links", "Connect your profiles"],
    ["✦", "Password", "Keep your account secure"],
    ["■", "Portfolio", "Share your best work"],
  ] as const;

  return (
    <main className="profile-page profile-clean">
      <section className="profile-shell">
        <div className="mb-4">
          <BackButton href="/" label="Back to home" />
        </div>
        <header className="profile-identity">
          <div className="profile-avatar">{displayName.slice(0, 1).toUpperCase()}</div>
          <div>
            <h1>{displayName}</h1>
            <p>{user?.email || "Your onWard account"}</p>
          </div>
        </header>

        <section className="profile-progress">
          <div>
            <span>Overall progress</span>
            <b>{progress}%</b>
          </div>
          <i>
            <em style={{ width: `${progress}%` }} />
          </i>
          <div className="profile-metrics">
            <span>
              <b>{activeTasks.length}</b>Plans
            </span>
            <span>
              <b>{completed}</b>Completed
            </span>
            <span>
              <b>{activeTasks.length ? ((completed / activeTasks.length) * 5).toFixed(1) : "0.0"}</b>Daily rhythm
            </span>
          </div>
        </section>

        <ProfileGroup title="Personal">
          {personal.map(([icon, title, note]) => (
            <div className="profile-row" key={title}>
              <i aria-hidden="true">{icon}</i>
              <span>
                <b>{title}</b>
                <small>{note}</small>
              </span>
              <strong>›</strong>
            </div>
          ))}
        </ProfileGroup>

        <ProfileGroup title="Actions">
          <button
            type="button"
            className="profile-row profile-action"
            onClick={() => void enableNotifications()}
          >
            <i aria-hidden="true">🔔</i>
            <span>
              <b>Notifications</b>
              <small>{notificationStatus === "granted" ? "Enabled" : "Manage reminders"}</small>
            </span>
            <strong>›</strong>
          </button>
          <button
            type="button"
            className="profile-row profile-action"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <i aria-hidden="true">⚙</i>
            <span>
              <b>Settings</b>
              <small>Use {theme === "light" ? "dark" : "light"} mode</small>
            </span>
            <strong>›</strong>
          </button>
          <a className="profile-row profile-action" href="mailto:support@onward.app">
            <i aria-hidden="true">?</i>
            <span>
              <b>Help and support</b>
              <small>We are here to help</small>
            </span>
            <strong>›</strong>
          </a>
        </ProfileGroup>

        {notificationMessage && (
          <p className="profile-message" role="status">
            {notificationMessage}
          </p>
        )}

        <section className="profile-directory">
          <b>Member directory</b>
          <p>Discover people moving forward with thoughtful, steady progress.</p>
          <button type="button">
            Explore members <span>›</span>
          </button>
        </section>

        {user && (
          <button type="button" className="profile-signout" onClick={() => void signOut()}>
            Sign out
          </button>
        )}
      </section>
    </main>
  );
}

function ProfileGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="profile-group">
      <p>{title}</p>
      <div>{children}</div>
    </section>
  );
}
