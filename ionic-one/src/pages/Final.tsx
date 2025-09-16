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
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useMemo } from "react";
import { useLocation, useParams } from "react-router";

type LatLng = { lat: number; lng: number };

interface FinalPayload {
  vehicleId: string | number;
  vehicleType: string;
  ratePerKm: number;
  startDate: string;
  endDate: string;
  totalDays: number;
  fromLocation: string;
  fromCoords: LatLng | null;
  toLocation: string;
  toCoords: LatLng | null;
  distanceKm: number | null;
  tripCost: number;
}

function useDecodedPayload(): FinalPayload | null {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const encoded = params.get("data");
  if (!encoded) return null;
  try {
    const json = decodeURIComponent(atob(encoded));
    return JSON.parse(json) as FinalPayload;
  } catch (e) {
    console.error("Failed to decode payload", e);
    return null;
  }
}

const FinalPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const data = useDecodedPayload();

  const prettyDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const summary = useMemo(() => {
    if (!data) return null;
    return [
      { label: "Vehicle ID", value: String(data.vehicleId) },
      { label: "Vehicle Type", value: data.vehicleType },
      //   { label: "Start Date", value: prettyDate(data.startDate) },
      //   { label: "End Date", value: prettyDate(data.endDate) },
      //   { label: "Total Days", value: String(data.totalDays) },
      { label: "From", value: data.fromLocation },
      {
        label: "From Coords",
        value: data.fromCoords
          ? `${data.fromCoords.lat.toFixed(5)}, ${data.fromCoords.lng.toFixed(
              5
            )}`
          : "—",
      },
      { label: "To", value: data.toLocation || "—" },
      {
        label: "To Coords",
        value: data.toCoords
          ? `${data.toCoords.lat.toFixed(5)}, ${data.toCoords.lng.toFixed(5)}`
          : "—",
      },
      {
        label: "Distance",
        value: data.distanceKm != null ? `${data.distanceKm} km` : "—",
      },
      {
        label: "Rate / km",
        value: `LKR ${Number(data.ratePerKm).toLocaleString()}`,
      },
      {
        label: "Estimated Cost",
        value:
          data.distanceKm != null
            ? `LKR ${Number(data.tripCost).toLocaleString()}`
            : "—",
      },
    ];
  }, [data]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={`/booking/${id}`} />
          </IonButtons>
          <IonTitle>Booking Summary</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {!data ? (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Missing Data</IonCardTitle>
              <IonCardSubtitle />
            </IonCardHeader>
            <IonCardContent>
              We could not find booking details. Please go back and try again.
            </IonCardContent>
          </IonCard>
        ) : (
          <>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Review & Confirm</IonCardTitle>
                <IonCardSubtitle>Vehicle #{data.vehicleId}</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList lines="none">
                  {summary!.map((row) => (
                    <IonItem key={row.label}>
                      <IonLabel>{row.label}</IonLabel>
                      <IonNote slot="end">{row.value}</IonNote>
                    </IonItem>
                  ))}
                </IonList>
                <div className="ion-padding-top">
                  <IonButton expand="block" color="primary">
                    Confirm Booking
                  </IonButton>
                </div>
              </IonCardContent>
            </IonCard>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default FinalPage;
