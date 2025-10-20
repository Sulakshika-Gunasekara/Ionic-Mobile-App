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
  IonText,
} from "@ionic/react";
import React, { useState } from "react";
import "./home.css";
import { calendarOutline, carOutline, searchOutline } from "ionicons/icons";
import { useHistory } from "react-router";

const VEHICLE_TYPES = ["ONE_VEHICLE", "TWO_VEHICLES", "FOUR_VEHICLES"] as const;

// Helper function to format display text for vehicle types
const formatVehicleType = (type: string) => {
  switch (type) {
    case "ONE_VEHICLE":
      return "Single Vehicle";
    case "TWO_VEHICLES":
      return "Two Vehicles";
    case "FOUR_VEHICLES":
      return "Four Vehicles";
    default:
      return type;
  }
};

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
          <IonTitle>Vehicle Hire</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="home-content" fullscreen>
        <IonList className="home-list">
          {/* <IonText color="primary">
            <h2 style={{ textAlign: "center", margin: "0 0 24px 0" }}>
              Choose Your Vehicle
            </h2>
          </IonText> */}

          <form className="home-form" onSubmit={handleFormSubmit}>
            <div>
              <IonLabel className="home-label">Hire Date</IonLabel>
              <IonItem
                className="home-form-item"
                lines="none"
                button
                onClick={openDatePicker}
                detail={false}>
                <IonIcon icon={calendarOutline} className="home-icon" />
                <IonInput
                  className="home-input"
                  value={date}
                  readonly
                  placeholder="Select a date"
                />
              </IonItem>
              {touched && !date && (
                <IonNote color="danger" className="home-error">
                  Please select a hire date
                </IonNote>
              )}
            </div>

            <div>
              <IonLabel className="home-label">Vehicle Type</IonLabel>
              <IonItem className="home-form-item" lines="none">
                <IonIcon icon={carOutline} className="home-icon" />
                <IonSelect
                  interface="action-sheet"
                  placeholder="Select vehicle type"
                  value={type}
                  onIonChange={(e) =>
                    setType((e.detail.value || "") as string)
                  }>
                  {VEHICLE_TYPES.map((t) => (
                    <IonSelectOption key={t} value={t}>
                      {formatVehicleType(t)}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              {touched && !type && (
                <IonNote color="danger" className="home-error">
                  Please select a vehicle type
                </IonNote>
              )}
            </div>

            <IonButton
              type="submit"
              expand="block"
              className="home-btn"
              disabled={loading}>
              {loading ? (
                <IonSpinner name="crescent" />
              ) : (
                <>
                  <IonIcon icon={searchOutline} slot="start" />
                  Search Vehicles
                </>
              )}
            </IonButton>
          </form>
        </IonList>

        {error && (
          <IonText color="danger" style={{ textAlign: "center", padding: 16 }}>
            <p>{error}</p>
          </IonText>
        )}
      </IonContent>

      <IonModal isOpen={showDatePicker} onDidDismiss={cancelDatePicker}>
        <IonHeader>
          <IonToolbar>
            <IonTitle className="date-title">Select Hire Date</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className="datetime-content">
          <IonDatetime
            className="datetime-picker"
            presentation="date"
            value={tempDate}
            onIonChange={(e) =>
              setTempDate(toYMD((e.detail.value || "") as string))
            }
            min={new Date().toISOString()}
          />
        </IonContent>
        {/* <IonButtons slot="end" className="modal-buttons">
          <IonButton onClick={cancelDatePicker}>Cancel</IonButton>
          <IonButton strong onClick={confirmDatePicker}>
            Confirm
          </IonButton>
        </IonButtons> */}
        <div className="datetime-footer">
          <IonButton fill="clear" color="medium" onClick={cancelDatePicker}>
            Cancel
          </IonButton>
          <IonButton onClick={confirmDatePicker}>Confirm</IonButton>
        </div>
      </IonModal>
    </IonPage>
  );
};

export default Home;
