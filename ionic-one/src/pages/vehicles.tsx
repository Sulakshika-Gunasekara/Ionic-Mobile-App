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
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getVehicles } from "./api"; // Adjust import path as needed
import { fileTrayStackedSharp } from "ionicons/icons";
import "./vehicles.css";
interface Vehicle {
  id: string;
  type: string;
  location: string;
  seats: number;
  image?: string; // URL to vehicle image
  brand?: string; // Vehicle brand
  // Add other vehicle properties as needed
}

const Vehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [favourites, setFavourites] = useState<string[]>([]); // store favourite vehicle ids

  const location = useLocation();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        setError("");

        const searchParams = new URLSearchParams(location.search);
        const params: Record<string, string | number> = {};

        const locationParam = searchParams.get("location");
        // accept both ?type=... and ?vehicleType=...
        const typeParam =
          searchParams.get("type") ?? searchParams.get("vehicleType");

        if (locationParam) params.location = locationParam;
        if (typeParam) params.type = typeParam; // <-- map vehicleType -> type

        console.log("Raw search:", location.search);
        console.log("Fetching vehicles with params:", params);

        const response = await getVehicles<Vehicle[]>(params);
        setVehicles(response);
      } catch (err) {
        setError("Failed to fetch vehicles");
        console.error("Error fetching vehicles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [location.search]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Vehicles</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === "development" && (
          <IonItem>
            <IonLabel>
              <p>Debug: {location.search}</p>
            </IonLabel>
          </IonItem>
        )}

        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "20px",
            }}>
            <IonSpinner />
          </div>
        )}

        {error && (
          <IonItem color="danger">
            <IonLabel>{error}</IonLabel>
          </IonItem>
        )}

        {!loading && !error && vehicles.length === 0 && (
          <IonItem>
            <IonLabel>No vehicles found matching your criteria</IonLabel>
          </IonItem>
        )}

        {!loading && vehicles.length > 0 && (
          <IonList>
            {vehicles.map((vehicle) => {
              const isFavourite = favourites.includes(vehicle.id);
              return (
                <IonItem key={vehicle.id} className="vehicle-card" lines="none">
                  <IonLabel>
                    {/* Vehicle Image */}
                    {vehicle.image && (
                      <img
                        src={vehicle.image}
                        alt={vehicle.brand ? vehicle.brand : vehicle.type}
                        style={{
                          width: "100%",
                          maxWidth: "200px",
                          borderRadius: "8px",
                          marginBottom: "8px",
                        }}
                      />
                    )}
                    {/* Vehicle Brand */}
                    {vehicle.brand && (
                      <h3 style={{ margin: 0 }}>{vehicle.brand}</h3>
                    )}
                    <h2>{vehicle.type}</h2>
                    <p>Location: {vehicle.location}</p>
                  </IonLabel>

                  <IonButton
                    style={{ margin: "auto", paddingRight: "20px" }}
                    color="primary"
                    routerLink={`/booking/${vehicle.id}`}>
                    See More
                  </IonButton>
                </IonItem>
              );
            })}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Vehicles;
