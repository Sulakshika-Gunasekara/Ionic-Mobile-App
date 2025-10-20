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
  IonToast,
  IonGrid,
  IonRow,
  IonCol,
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
      { label: "Date", value: prettyDate(data.startDate) },

      { label: "Pickup", value: data.fromLocation },

      { label: "Dropoff", value: data.toLocation || "—" },

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
              {/* <IonCardContent>
                <IonList lines="none">
                  {summary!.map((row) => (
                    <IonItem key={row.label}>
                      <IonLabel className="label-fixed">{row.label}</IonLabel>
                      <IonNote slot="end" className="not-wrap">
                        {row.value}
                      </IonNote>
                    </IonItem>
                  ))}
                </IonList>
                <div className="ion-padding-top">
                  <IonButton expand="block" color="primary">
                    Confirm Booking
                  </IonButton>
                </div>
              </IonCardContent> */}
              <IonList lines="none">
                {summary!.map((row) => (
                  <IonItem key={row.label} lines="none">
                    <IonGrid>
                      <IonRow>
                        <IonCol size="4">
                          <IonLabel className="summary-label">
                            {row.label}
                          </IonLabel>
                        </IonCol>
                        <IonCol size="8">
                          <IonNote className="summary-value">
                            {row.value}
                          </IonNote>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonItem>
                ))}
              </IonList>
            </IonCard>
          </>
        )}
        <div className="ion-padding">
          <IonButton expand="block" color="primary">
            Confirm Booking
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default FinalPage;
