import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonNote,
  IonInput,
  IonToggle,
  IonSelect,
  IonSelectOption,
  IonRange,
  IonButtons,
  IonIcon,
  IonFooter,
  IonText,
  IonAlert,
  IonMenuButton,
  IonRouterLink,
} from "@ionic/react";
import {
  moon,
  personCircle,
  notifications,
  shieldCheckmark,
  globe,
  informationCircle,
  refresh,
} from "ionicons/icons";
import { Preferences } from "@capacitor/preferences";

type Settings = {
  name: string;
  email: string;
  language: "en" | "si" | "ta";
  theme: "system" | "light" | "dark";
  notificationsEnabled: boolean;
  marketingEmails: boolean;
  pushLevel: number; // 0–100
  analytics: boolean;
};

const DEFAULTS: Settings = {
  name: "",
  email: "",
  language: "en",
  theme: "system",
  notificationsEnabled: true,
  marketingEmails: false,
  pushLevel: 70,
  analytics: true,
};

const STORAGE_KEY = "app.settings.v1";

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load settings on mount
  useEffect(() => {
    (async () => {
      const res = await Preferences.get({ key: STORAGE_KEY });
      if (res.value) {
        const parsed = JSON.parse(res.value) as Settings;
        setSettings({ ...DEFAULTS, ...parsed });
        applyTheme(parsed.theme);
      } else {
        applyTheme(DEFAULTS.theme);
      }
    })();
  }, []);

  // Persist + side effects
  const save = async (next: Partial<Settings>) => {
    setSaving(true);
    const merged = { ...settings, ...next };
    setSettings(merged);
    await Preferences.set({ key: STORAGE_KEY, value: JSON.stringify(merged) });
    if ("theme" in next) applyTheme(merged.theme);
    setSaving(false);
  };

  // Apply theme instantly
  const applyTheme = (theme: Settings["theme"]) => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const dark = theme === "dark" || (theme === "system" && prefersDark);
    document.body.classList.toggle("dark", dark);
  };

  const resetAll = async () => {
    await Preferences.remove({ key: STORAGE_KEY });
    setSettings(DEFAULTS);
    applyTheme(DEFAULTS.theme);
  };

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {/* Profile */}
        <IonList inset>
          <IonListHeader>
            <IonLabel>
              <IonIcon icon={personCircle} className="mr-2" />
              Profile
            </IonLabel>
          </IonListHeader>

          <IonItem>
            <IonLabel position="stacked">Name</IonLabel>
            <IonInput
              placeholder="Your name"
              value={settings.name}
              onIonChange={(e) => save({ name: e.detail.value || "" })}
              clearInput
              autocomplete="name"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Email</IonLabel>
            <IonInput
              type="email"
              placeholder="you@example.com"
              value={settings.email}
              onIonChange={(e) => save({ email: e.detail.value || "" })}
              clearInput
              autocomplete="email"
            />
          </IonItem>

          {/* <IonItem>
            <IonIcon slot="start" icon={globe} />
            <IonLabel>Language</IonLabel>
            <IonSelect
              interface="popover"
              value={settings.language}
              onIonChange={(e) => save({ language: e.detail.value })}>
              <IonSelectOption value="en">English</IonSelectOption>
              <IonSelectOption value="si">සිංහල (Sinhala)</IonSelectOption>
              <IonSelectOption value="ta">தமிழ் (Tamil)</IonSelectOption>
            </IonSelect>
          </IonItem> */}
        </IonList>

        {/* Appearance */}
        <IonList inset>
          {/* <IonListHeader>
            <IonLabel>
              <IonIcon icon={moon} className="mr-2" />
              Appearance
            </IonLabel>
          </IonListHeader> */}

          {/* <IonItem>
            <IonLabel>Theme</IonLabel>
            <IonSelect
              interface="popover"
              value={settings.theme}
              onIonChange={(e) => save({ theme: e.detail.value })}>
              <IonSelectOption value="system">System</IonSelectOption>
              <IonSelectOption value="light">Light</IonSelectOption>
              <IonSelectOption value="dark">Dark</IonSelectOption>
            </IonSelect>
            <IonNote slot="end">applies instantly</IonNote>
          </IonItem> */}
        </IonList>

        {/* Notifications */}
        {/* <IonList inset>
          <IonListHeader>
            <IonLabel>
              <IonIcon icon={notifications} className="mr-2" />
              Notifications
            </IonLabel>
          </IonListHeader>

          <IonItem>
            <IonLabel>Enable Notifications</IonLabel>
            <IonToggle
              checked={settings.notificationsEnabled}
              onIonChange={(e) =>
                save({ notificationsEnabled: e.detail.checked })
              }
            />
          </IonItem>

          <IonItem disabled={!settings.notificationsEnabled}>
            <IonLabel>Push Intensity</IonLabel>
            <IonRange
              min={0}
              max={100}
              step={10}
              snaps
              value={settings.pushLevel}
              onIonChange={(e) => save({ pushLevel: Number(e.detail.value) })}>
              <IonNote slot="start">Low</IonNote>
              <IonNote slot="end">High</IonNote>
            </IonRange>
          </IonItem>

          <IonItem disabled={!settings.notificationsEnabled}>
            <IonLabel>Allow Marketing Emails</IonLabel>
            <IonToggle
              checked={settings.marketingEmails}
              onIonChange={(e) => save({ marketingEmails: e.detail.checked })}
            />
          </IonItem>
        </IonList> */}

        {/* Privacy */}
        {/* <IonList inset>
          <IonListHeader>
            <IonLabel>
              <IonIcon icon={shieldCheckmark} className="mr-2" />
              Privacy
            </IonLabel>
          </IonListHeader>

          <IonItem>
            <IonLabel>Share Usage Analytics</IonLabel>
            <IonToggle
              checked={settings.analytics}
              onIonChange={(e) => save({ analytics: e.detail.checked })}
            />
          </IonItem>
          <IonItem lines="none">
            <IonNote>
              We collect anonymized usage data to improve the app. You can turn
              this off anytime.
            </IonNote>
          </IonItem>
        </IonList> */}

        {/* About */}
        {/* <IonList inset>
          <IonListHeader>
            <IonLabel>
              <IonIcon icon={informationCircle} className="mr-2" />
              About
            </IonLabel>
          </IonListHeader>
          <IonItem detail={false}>
            <IonLabel>
              <h3>App Version</h3>
              <p>1.0.0</p>
            </IonLabel>
          </IonItem>
          <IonItem
            button
            onClick={() =>
              window.open("https://example.com/privacy", "_blank")
            }>
            <IonLabel>Privacy Policy</IonLabel>
          </IonItem>
          <IonItem
            button
            onClick={() => window.open("https://example.com/terms", "_blank")}>
            <IonLabel>Terms of Service</IonLabel>
          </IonItem>
        </IonList> */}

        {/* Danger / Reset */}
        <IonList inset>
          <IonItem
            color="danger"
            button
            onClick={() => setShowResetConfirm(true)}>
            <IonIcon icon={refresh} slot="start" />
            <IonLabel>Reset to Defaults</IonLabel>
          </IonItem>
        </IonList>

        <IonAlert
          isOpen={showResetConfirm}
          header="Reset settings?"
          message="This will restore all settings to their default values."
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              handler: () => setShowResetConfirm(false),
            },
            {
              text: "Reset",
              role: "destructive",
              handler: async () => {
                await resetAll();
                setShowResetConfirm(false);
              },
            },
          ]}
          onDidDismiss={() => setShowResetConfirm(false)}
        />
      </IonContent>

      <IonFooter collapse="fade">
        <IonToolbar>
          <IonText className="ion-padding-start">
            {saving ? "Saving…" : "All changes saved"}
          </IonText>
          {/* <IonButton
            slot="end"
            fill="clear"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Back to Top
          </IonButton> */}
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Settings;
