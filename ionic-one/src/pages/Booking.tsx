// src/pages/booking.tsx
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonDatetime,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonSpinner,
  IonText,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import {
  calendarOutline,
  cashOutline,
  peopleOutline,
  pinOutline,
  carOutline,
} from "ionicons/icons";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { getVehicle } from "./api"; // <-- your existing helper

interface Vehicle {
  id: string | number;
  type: string;
  location: string;
  seats: number; // max seats
  pricePerDay?: number; // LKR per day (optional but recommended)
}

const currency = "LKR"; // change if needed

const Booking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [startDate, setStartDate] = useState<string>(""); // ISO string
  const [endDate, setEndDate] = useState<string>(""); // ISO string
  const [seatsRequested, setSeatsRequested] = useState<number | undefined>(
    undefined
  );
  const [showToast, setShowToast] = useState<{
    open: boolean;
    msg: string;
    color?: string;
  }>({
    open: false,
    msg: "",
    color: undefined,
  });

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getVehicle<Vehicle>(id);
        setVehicle(res);
      } catch (e) {
        console.error(e);
        setError("Failed to load vehicle");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  // Compute number of days (at least 1 day if both dates present and same day)
  const totalDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);

    // normalize to local midnight to avoid partial-day differences
    const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    const ms = e.getTime() - s.getTime();
    if (ms < 0) return 0;
    const days = Math.ceil(ms / (1000 * 60 * 60 * 24)) || 1;
    return Math.max(days, 1);
  }, [startDate, endDate]);

  const pricePerDay = vehicle?.pricePerDay ?? 0;
  const totalPrice = useMemo(() => {
    if (!vehicle || totalDays <= 0) return 0;
    return pricePerDay * totalDays;
  }, [vehicle, pricePerDay, totalDays]);

  const maxSeats = vehicle?.seats ?? 0;
  const seatsError =
    seatsRequested !== undefined &&
    (seatsRequested <= 0 || seatsRequested > maxSeats)
      ? `Seats must be between 1 and ${maxSeats}`
      : "";

  const dateError =
    startDate && endDate && totalDays === 0
      ? "End date must be the same or after start date"
      : "";

  const canSubmit =
    !!vehicle &&
    !!startDate &&
    !!endDate &&
    totalDays > 0 &&
    !!seatsRequested &&
    !seatsError;

  const onSubmit = async () => {
    if (!canSubmit) {
      setShowToast({
        open: true,
        msg: "Please fix the form errors",
        color: "danger",
      });
      return;
    }

    // Here you would POST to your backend to create a booking
    // Example payload:
    // {
    //   vehicleId: vehicle.id,
    //   startDate,
    //   endDate,
    //   seats: seatsRequested,
    //   pricePerDay,
    //   totalDays,
    //   totalPrice
    // }
    console.log("Booking payload:", {
      vehicleId: vehicle?.id,
      startDate,
      endDate,
      seats: seatsRequested,
      pricePerDay,
      totalDays,
      totalPrice,
    });

    setShowToast({
      open: true,
      msg: "Booking created successfully!",
      color: "success",
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/vehicles" />
          </IonButtons>
          <IonTitle>Booking</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {loading && (
          <div
            style={{ display: "flex", justifyContent: "center", padding: 20 }}>
            <IonSpinner />
          </div>
        )}

        {error && (
          <IonItem color="danger">
            <IonLabel>{error}</IonLabel>
          </IonItem>
        )}

        {!loading && !error && vehicle && (
          <>
            {/* Vehicle Details */}
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>
                  <IonIcon icon={carOutline} style={{ marginRight: 8 }} />
                  {vehicle.type}
                </IonCardTitle>
                <IonCardSubtitle>
                  <IonIcon icon={pinOutline} style={{ marginRight: 6 }} />
                  {vehicle.location}
                </IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList lines="none">
                  <IonItem>
                    <IonIcon slot="start" icon={peopleOutline} />
                    <IonLabel>Max Seats</IonLabel>
                    <IonNote slot="end">{vehicle.seats}</IonNote>
                  </IonItem>
                  <IonItem>
                    <IonIcon slot="start" icon={cashOutline} />
                    <IonLabel>Price / Day</IonLabel>
                    <IonNote slot="end">
                      {currency} {pricePerDay.toLocaleString()}
                    </IonNote>
                  </IonItem>
                </IonList>
              </IonCardContent>
            </IonCard>

            {/* Booking Form */}
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Select Dates & Seats</IonCardTitle>
                <IonCardSubtitle>
                  <IonIcon icon={calendarOutline} style={{ marginRight: 6 }} />
                  Choose rental period
                </IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList>
                  <IonItem>
                    <IonLabel position="stacked">Start Date</IonLabel>
                    <IonDatetime
                      value={startDate}
                      onIonChange={(e) =>
                        setStartDate(e.detail.value as string)
                      }
                      presentation="date"
                      min={new Date().toISOString()}
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">End Date</IonLabel>
                    <IonDatetime
                      value={endDate}
                      onIonChange={(e) => setEndDate(e.detail.value as string)}
                      presentation="date"
                      min={startDate || new Date().toISOString()}
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Seats</IonLabel>
                    <IonInput
                      type="number"
                      placeholder={`1 - ${maxSeats}`}
                      value={seatsRequested ?? ""}
                      onIonChange={(e) => {
                        const val = e.detail.value
                          ? parseInt(e.detail.value, 10)
                          : undefined;
                        setSeatsRequested(
                          isNaN(val as number) ? undefined : val
                        );
                      }}
                      min={1}
                      max={maxSeats}
                    />
                  </IonItem>
                  {seatsError && (
                    <IonText
                      color="danger"
                      style={{
                        paddingLeft: 16,
                        display: "block",
                        marginTop: 6,
                      }}>
                      {seatsError}
                    </IonText>
                  )}
                  {dateError && (
                    <IonText
                      color="danger"
                      style={{
                        paddingLeft: 16,
                        display: "block",
                        marginTop: 6,
                      }}>
                      {dateError}
                    </IonText>
                  )}
                </IonList>

                {/* Summary */}
                <div className="ion-padding-top">
                  <IonItem lines="none">
                    <IonLabel>Total Days</IonLabel>
                    <IonNote slot="end">{totalDays}</IonNote>
                  </IonItem>
                  <IonItem lines="none">
                    <IonLabel>Total Price</IonLabel>
                    <IonNote slot="end">
                      {currency} {totalPrice.toLocaleString()}
                    </IonNote>
                  </IonItem>
                </div>

                <div className="ion-padding-top">
                  <IonButton
                    expand="block"
                    onClick={onSubmit}
                    disabled={!canSubmit}>
                    Confirm Booking
                  </IonButton>
                </div>
              </IonCardContent>
            </IonCard>
          </>
        )}

        <IonToast
          isOpen={showToast.open}
          message={showToast.msg}
          color={showToast.color}
          duration={1600}
          onDidDismiss={() => setShowToast({ open: false, msg: "" })}
        />
      </IonContent>
    </IonPage>
  );
};

export default Booking;
