// src/pages/vehicles.tsx
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSpinner,
  IonItem,
  IonLabel,
  IonList,
  IonButton,
  IonButtons,
  IonBackButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { carOutline, pinOutline } from "ionicons/icons";
import "./vehicles.css";

interface Vehicle {
  id: string;
  type: string;
  location: string;
  vehicles?: number; // Changed from seats to vehicles to match your API
  image?: string;
  brand?: string;
  model?: string;
  pricePerDay?: number;
  isFavorite?: boolean;
}

async function fetchAvailableVehicles(
  date: string,
  type: string
): Promise<Vehicle[]> {
  const qs = new URLSearchParams({ date, type }).toString();
  const url = `http://localhost:4000/available-vehicles?${qs}`;

  console.log("Making API call to:", url);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`API ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  console.log("API Response:", data);

  return Array.isArray(data) ? data : data.vehicles ?? [];
}

const Vehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const location = useLocation();

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError("");

        const searchParams = new URLSearchParams(location.search);
        const date = searchParams.get("date") || "";
        const type = searchParams.get("type") || "";

        console.log("URL search params:", location.search);
        console.log("Extracted date:", date);
        console.log("Extracted type:", type);

        if (!date || !type) {
          setVehicles([]);
          setError(
            "Missing date or type in the URL. Please go back and search again."
          );
          return;
        }

        const list = await fetchAvailableVehicles(date, type);
        console.log("Received vehicles:", list);
        setVehicles(list);

        if (list.length === 0) {
          console.log("No vehicles found for the given criteria");
        }
      } catch (err: any) {
        console.error("API Error:", err);
        setError(err?.message ?? "Failed to fetch vehicles");
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [location.search]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Available Vehicles</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="vehicles-content">
        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 40,
              flexDirection: "column",
            }}>
            <IonSpinner name="dots" />
            <p style={{ marginTop: 16, color: "var(--ion-color-medium)" }}>
              Searching for vehicles...
            </p>
          </div>
        )}

        {error && !loading && (
          <div style={{ padding: 16 }} className="error-container">
            <IonItem color="danger" lines="none">
              <IonLabel className="ion-text-wrap">
                <h2>Error</h2>
                <p>{error}</p>
              </IonLabel>
            </IonItem>
            <IonButton
              expand="block"
              fill="outline"
              routerLink="/"
              className="back-button">
              Back to Search
            </IonButton>
          </div>
        )}

        {!loading && !error && vehicles.length === 0 && (
          <div className="empty-state">
            <IonIcon
              icon={carOutline}
              size="large"
              color="medium"
              style={{ marginBottom: 16 }}
            />
            <h2>No Vehicles Found</h2>
            <p style={{ color: "var(--ion-color-medium)", marginBottom: 20 }}>
              No vehicles are available for your selected date and type. Try
              searching with different criteria.
            </p>
            <IonButton expand="block" fill="outline" routerLink="/">
              Try Different Search
            </IonButton>
          </div>
        )}

        {!loading && !error && vehicles.length > 0 && (
          <>
            {/* <div className="results-count">
              <p
                style={{
                  color: "var(--ion-color-medium)",
                  margin: 0,
                  fontSize: "14px",
                }}>
                Found {vehicles.length} vehicle
                {vehicles.length !== 1 ? "s" : ""} available
              </p>
            </div> */}

            <IonList className="vehicle-list">
              {vehicles.map((vehicle) => (
                <IonCard key={vehicle.id} className="vehicle-card">
                  {vehicle.image && (
                    <div
                      className="vehicle-image-container"
                      style={{ position: "relative" }}>
                      <img
                        className="vehicle-image"
                        src={vehicle.image}
                        alt={`${vehicle.brand || ""} ${
                          vehicle.model || vehicle.type
                        }`.trim()}
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                          display: "block",
                        }}
                        onError={(e) => {
                          // Hide image if it fails to load
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      {vehicle.pricePerDay && (
                        <div
                          className="price-badge"
                          style={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            background: "var(--ion-color-primary)",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}>
                          {formatPrice(vehicle.pricePerDay)}/day
                        </div>
                      )}
                    </div>
                  )}

                  <IonCardHeader className="vehicle-card-header">
                    <IonCardTitle className="vehicle-title">
                      <IonIcon
                        icon={carOutline}
                        style={{ marginRight: 8, verticalAlign: "-2px" }}
                      />
                      {vehicle.brand
                        ? `${vehicle.brand} ${vehicle.model ?? ""}`.trim()
                        : vehicle.type.charAt(0).toUpperCase() +
                          vehicle.type.slice(1)}
                    </IonCardTitle>
                  </IonCardHeader>

                  <IonCardContent className="vehicle-card-content">
                    <div className="vehicle-details">
                      <p className="vehicle-detail">
                        <IonIcon
                          icon={carOutline}
                          style={{ marginRight: 6, minWidth: "16px" }}
                        />
                        <span>
                          Type:{" "}
                          <strong>
                            {vehicle.type.charAt(0).toUpperCase() +
                              vehicle.type.slice(1)}
                          </strong>
                        </span>
                      </p>

                      {vehicle.vehicles && (
                        <p className="vehicle-detail">
                          <span className="vehicle-icon">🚐</span>
                          <span>
                            Available: <strong>{vehicle.vehicles}</strong>
                          </span>
                        </p>
                      )}

                      {vehicle.pricePerDay && (
                        <p className="vehicle-detail">
                          <span className="vehicle-icon">💰</span>
                          <span>
                            Price:{" "}
                            <strong>
                              {formatPrice(vehicle.pricePerDay)}/day
                            </strong>
                          </span>
                        </p>
                      )}
                    </div>

                    <IonButton
                      expand="block"
                      color="primary"
                      routerLink={`/booking/${vehicle.id}`}>
                      Book This Vehicle
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              ))}
            </IonList>

            <div className="search-again-container">
              <IonButton expand="block" fill="outline" routerLink="/home">
                Search Again
              </IonButton>
            </div>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Vehicles;
