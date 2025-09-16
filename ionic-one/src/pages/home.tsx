// src/pages/home.tsx
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonSpinner,
  IonIcon,
  IonModal,
  IonDatetime,
  IonNote,
} from "@ionic/react";
import React, { useState } from "react";
import "./home.css";
import { calendarOutline, carOutline } from "ionicons/icons";
import { useHistory } from "react-router";

const VEHICLE_TYPES = ["ONE_VEHICLE", "TWO_VEHICLES", "FOUR_VEHICLES"] as const;

function toYMD(isoOrYmd: string) {
  if (!isoOrYmd) return "";
  return isoOrYmd.slice(0, 10);
}

const Home: React.FC = () => {
  const history = useHistory();
  const [date, setDate] = useState<string>("");
  const [type, setType] = useState<string>("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const openDatePicker = () => {
    const today = new Date().toISOString().slice(0, 10);
    setTempDate(date || today);
    setShowDatePicker(true);
  };
  const confirmDatePicker = () => {
    setDate(toYMD(tempDate));
    setShowDatePicker(false);
  };
  const cancelDatePicker = () => setShowDatePicker(false);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    setError(null);

    if (!date) return setError("Please select a hire date.");
    if (!type) return setError("Please select a vehicle type.");

    // No need to call the API here—Vehicles page will do it.
    setLoading(true);
    try {
      const qs = new URLSearchParams({ date, type }).toString();
      history.push(`/vehicles?${qs}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="home-content">
        <IonList className="home-list">
          <form className="home-form" onSubmit={handleFormSubmit}>
            <IonItem>
              <IonLabel position="floating" className="home-label">
                Hire Date (YYYY-MM-DD)
              </IonLabel>
              <IonInput
                className="home-input"
                value={date}
                placeholder="Select a date"
                readonly
                onClick={openDatePicker}
              />
              <IonButton
                slot="end"
                fill="clear"
                onClick={openDatePicker}
                aria-label="Open date picker">
                <IonIcon icon={calendarOutline} />
              </IonButton>
            </IonItem>
            {touched && !date && (
              <IonNote color="danger" style={{ marginLeft: 16 }}>
                Please pick a date.
              </IonNote>
            )}

            <IonItem>
              <IonLabel position="floating" className="home-label">
                Vehicle Type
              </IonLabel>
              <IonSelect
                interface="action-sheet"
                placeholder="Select a type"
                value={type}
                onIonChange={(e) => setType((e.detail.value || "") as string)}>
                {VEHICLE_TYPES.map((t) => (
                  <IonSelectOption key={t} value={t}>
                    <IonIcon
                      icon={carOutline}
                      style={{ marginRight: 6, verticalAlign: "-2px" }}
                    />
                    {t}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            {touched && !type && (
              <IonNote color="danger" style={{ marginLeft: 16 }}>
                Please choose a vehicle type.
              </IonNote>
            )}

            <IonButton type="submit" expand="block" className="home-btn">
              Search
            </IonButton>
          </form>
        </IonList>

        {loading && (
          <div
            style={{ display: "flex", justifyContent: "center", padding: 16 }}>
            <IonSpinner name="dots" />
          </div>
        )}

        {error && (
          <p style={{ color: "red", textAlign: "center", padding: 8 }}>
            {error}
          </p>
        )}
      </IonContent>

      <IonModal isOpen={showDatePicker} onDidDismiss={cancelDatePicker}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Select date</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={cancelDatePicker}>Cancel</IonButton>
              <IonButton strong onClick={confirmDatePicker}>
                Confirm
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <IonDatetime
            presentation="date"
            value={tempDate}
            onIonChange={(e) =>
              setTempDate(toYMD((e.detail.value || "") as string))
            }
          />
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default Home;
