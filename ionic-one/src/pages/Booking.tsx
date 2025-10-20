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
  IonModal,
  IonNote,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToast,
  IonToolbar,
  IonSelect,
  IonSelectOption,
  useIonRouter,
} from "@ionic/react";
import {
  calendarOutline,
  cashOutline,
  peopleOutline,
  carOutline,
  locateOutline,
  navigateOutline,
  pinOutline,
} from "ionicons/icons";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { getVehicle } from "./api";
import { Geolocation } from "@capacitor/geolocation";
import { Capacitor } from "@capacitor/core";

interface Vehicle {
  vehicles: number;
  image: any;
  brand: any;
  id: string | number;
  type: string;
  location: string; // depot or default location
  seats: number;
  pricePerDay?: number; // used as Rate per Kilometer here
}

type LatLng = { lat: number; lng: number };

const currency = "LKR";

/** Service area city center coordinates (origin dropdown options) */
const LOCATIONS: Record<string, LatLng> = {
  Colombo_Horbour: { lat: 6.9538, lng: 79.8493 },
  Hambanthota_Harbour: { lat: 6.1248, lng: 81.1272 },
};

/** Haversine km */
function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Reverse-geocode using OSM Nominatim (no key). Falls back to "lat,lng". */
async function reverseGeocode(coords: LatLng): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`;
    const res = await fetch(url, {
      headers: {
        "Accept-Language": "en",
        // Be gentle to public endpoint
        "User-Agent":
          "IonicDemoApp/1.0 (contact: example@example.com) reverse-geocode",
      },
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    return (
      data?.display_name || `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`
    );
  } catch {
    return `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`;
  }
}

const Booking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const ionRouter = useIonRouter();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // const [startDate, setStartDate] = useState<string>("");
  // const [endDate, setEndDate] = useState<string>("");

  // From (origin): dropdown -> coords
  const [fromLocation, setFromLocation] = useState<string>("");
  const [fromCoords, setFromCoords] = useState<LatLng | null>(null);

  // To (destination): typed address or "Use my location"
  const [toLocation, setToLocation] = useState<string>("");
  const [toCoords, setToCoords] = useState<LatLng | null>(null);
  const [resolvingToAddress, setResolvingToAddress] = useState<boolean>(false);

  const [showToast, setShowToast] = useState<{
    open: boolean;
    msg: string;
    color?: string;
  }>({ open: false, msg: "", color: undefined });

  // date modal
  // const [showStartPicker, setShowStartPicker] = useState(false);
  // const [tempStartDate, setTempStartDate] = useState<string | undefined>(
  //   undefined
  // );

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

  // const formatDate = (iso?: string) =>
  //   iso ? new Date(iso).toLocaleDateString() : "Select date";

  // const totalDays = useMemo(() => {
  //   if (!startDate || !endDate) return 0;
  //   const start = new Date(startDate);
  //   const end = new Date(endDate);
  //   const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  //   const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  //   const ms = e.getTime() - s.getTime();
  //   if (ms < 0) return 0;
  //   const days = Math.ceil(ms / (1000 * 60 * 60 * 24)) || 1;
  //   return Math.max(days, 1);
  // }, [startDate, endDate]);

  // Using pricePerDay as "Rate per kilometer" (to match your UI text)
  const pricePerKm = vehicle?.pricePerDay ?? 0;

  // Distance between fromCoords and toCoords (if we have both)
  const distanceKm = useMemo(() => {
    if (!fromCoords || !toCoords) return null;
    const d = haversineKm(fromCoords, toCoords);
    return Number.isFinite(d) ? Number(d.toFixed(2)) : null;
  }, [fromCoords, toCoords]);

  // If you want a total-by-distance:
  const tripCost = useMemo(() => {
    if (!vehicle || distanceKm == null) return 0;
    return +(pricePerKm * distanceKm).toFixed(2);
  }, [vehicle, pricePerKm, distanceKm]);

  // Minimal validity: have vehicle, dates, from dropdown chosen, and a destination string
  const canSubmit = !!vehicle && !!fromLocation && !!toLocation;

  // const openStartPicker = () => {
  //   setTempStartDate(startDate || new Date().toISOString());
  //   setShowStartPicker(true);
  // };
  // const cancelStartPicker = () => setShowStartPicker(false);
  // const confirmStartPicker = () => {
  //   const picked = tempStartDate || new Date().toISOString();
  //   setStartDate(picked);
  //   if (!endDate) setEndDate(picked);
  //   setShowStartPicker(false);
  // };

  // When fromLocation changes, map to coords
  useEffect(() => {
    if (fromLocation && LOCATIONS[fromLocation]) {
      setFromCoords(LOCATIONS[fromLocation]);
    } else {
      setFromCoords(null);
    }
  }, [fromLocation]);

  /** Use my current GPS position for Destination ("To") and place its address into the textbox */
  const useMyLocationForDestination = async () => {
    try {
      // Request permission on native
      if (Capacitor.isNativePlatform()) {
        try {
          await Geolocation.requestPermissions();
        } catch {
          /* ignore */
        }
      }

      // Try Capacitor first
      try {
        const pos = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setToCoords(coords);
        setResolvingToAddress(true);
        const addr = await reverseGeocode(coords);
        setToLocation(addr);
        setResolvingToAddress(false);
        setShowToast({
          open: true,
          msg: "Destination set to your location",
          color: "success",
        });
        return;
      } catch (capErr: any) {
        if (!/Not implemented on web/i.test(String(capErr))) throw capErr;
      }

      // Fallback: browser geolocation
      if ("geolocation" in navigator) {
        setResolvingToAddress(true);
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const coords = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            };
            setToCoords(coords);
            const addr = await reverseGeocode(coords);
            setToLocation(addr);
            setResolvingToAddress(false);
            setShowToast({
              open: true,
              msg: "Destination set to your location",
              color: "success",
            });
          },
          (err) => {
            console.error(err);
            setResolvingToAddress(false);
            setShowToast({
              open: true,
              msg: "Browser location error",
              color: "danger",
            });
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
        return;
      }

      setShowToast({
        open: true,
        msg: "Geolocation not available.",
        color: "danger",
      });
    } catch (e) {
      console.error(e);
      setShowToast({
        open: true,
        msg:
          location.protocol !== "https:" && location.hostname !== "localhost"
            ? "Enable HTTPS or run on localhost for location."
            : "Unable to get your location.",
        color: "danger",
      });
    }
  };

  const onSubmit = async () => {
    if (!canSubmit) {
      setShowToast({
        open: true,
        msg: "Please complete all required fields",
        color: "danger",
      });
      return;
    }

    // Build the payload to send to final page
    const payload = {
      vehicleId: vehicle?.id,
      vehicleName: vehicle?.brand,
      vehicleImage: vehicle?.image,
      vehicleType: vehicle?.type,
      ratePerKm: pricePerKm,

      fromLocation, // label (city)
      fromCoords, // lat/lng
      toLocation, // text address
      toCoords, // lat/lng or null if typed
      distanceKm, // may be null if we don’t have destination coords
      tripCost, // based on ratePerKm * distanceKm when available
    };

    // Encode payload into the URL (no useNavigate: we use Ionic router)
    const encoded = btoa(encodeURIComponent(JSON.stringify(payload)));
    const url = `/final/${vehicle?.id}?data=${encoded}`;

    setShowToast({
      open: true,
      msg: "Booking details ready",
      color: "success",
    });

    // Ionic-native routing (allowed; not React Router's useNavigate)
    ionRouter.push(url, "forward");
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
                <IonCardSubtitle>{vehicle.brand}</IonCardSubtitle>
                <IonLabel>
                  {" "}
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
                </IonLabel>
                <IonCardSubtitle>{vehicle.location}</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList lines="none">
                  {/* <IonItem>
                    <IonIcon slot="start" icon={peopleOutline} />
                    <IonLabel>Max Vehicles</IonLabel>
                    <IonLabel>{vehicle.vehicles}</IonLabel>
                    <IonNote slot="end">{vehicle.seats}</IonNote>
                  </IonItem> */}
                  <IonItem>
                    <IonIcon slot="start" icon={cashOutline} />
                    <IonLabel>Rate per kilometer</IonLabel>
                    <IonNote slot="end">
                      {currency}{" "}
                      {Number(vehicle.pricePerDay ?? 0).toLocaleString()}
                    </IonNote>
                  </IonItem>
                </IonList>
              </IonCardContent>
            </IonCard>

            {/* Booking Form */}
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Trip Details</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList>
                  {/* Dates */}
                  {/* <IonItem button detail onClick={openStartPicker}>
                    <IonLabel>Start Date</IonLabel>
                    <IonNote slot="end" style={{ marginRight: 8 }}>
                      {formatDate(startDate)}
                    </IonNote>
                    <IonIcon slot="end" icon={calendarOutline} />
                  </IonItem> */}

                  {/* From (origin) */}
                  <IonItem>
                    <IonLabel position="stacked">
                      From (start location)
                    </IonLabel>
                    <IonSelect
                      interface="action-sheet"
                      placeholder="Select a location"
                      value={fromLocation}
                      onIonChange={(e) => setFromLocation(e.detail.value)}>
                      {Object.keys(LOCATIONS).map((name) => (
                        <IonSelectOption key={name} value={name}>
                          {name}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>

                  {/* To (destination) */}
                  <IonItem>
                    <IonLabel position="stacked">To (destination)</IonLabel>
                    <IonInput
                      placeholder="Enter destination address"
                      value={toLocation}
                      onIonInput={(e) => {
                        const val = (e.target as unknown as HTMLInputElement)
                          .value;
                        setToLocation(val);
                        // If user edits manually, clear coords (distance requires coords)
                        if (val && val.length > 0) setToCoords(null);
                      }}
                    />
                  </IonItem>

                  <IonItem lines="none">
                    <IonLabel>Or</IonLabel>
                    <IonButton
                      slot="end"
                      onClick={useMyLocationForDestination}
                      fill="outline"
                      disabled={resolvingToAddress}>
                      <IonIcon icon={locateOutline} slot="start" />
                      {resolvingToAddress
                        ? "Finding address..."
                        : "Use my location"}
                    </IonButton>
                  </IonItem>

                  {/* Distance (only when we have both sets of coords) */}
                  <IonItem lines="none">
                    <IonIcon slot="start" icon={navigateOutline} />
                    <IonLabel>Distance</IonLabel>
                    <IonNote slot="end">
                      {distanceKm != null ? `${distanceKm} km` : "—"}
                    </IonNote>
                  </IonItem>

                  {/* Computed trip cost (optional) */}
                  <IonItem lines="none">
                    <IonIcon slot="start" icon={pinOutline} />
                    <IonLabel>Estimated Cost</IonLabel>
                    <IonNote slot="end">
                      {distanceKm != null
                        ? `${currency} ${tripCost.toLocaleString()}`
                        : "—"}
                    </IonNote>
                  </IonItem>
                </IonList>

                <div className="ion-padding-top">
                  <IonButton expand="block" onClick={onSubmit}>
                    Submit
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
          duration={2000}
          onDidDismiss={() => setShowToast({ open: false, msg: "" })}
        />

        {/* Start date modal */}
        {/* <IonModal isOpen={showStartPicker} onDidDismiss={cancelStartPicker}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Select date</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={cancelStartPicker}>Cancel</IonButton>
                <IonButton strong onClick={confirmStartPicker}>
                  Set
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonDatetime
              value={tempStartDate || startDate}
              onIonChange={(e) => setTempStartDate(e.detail.value as string)}
              presentation="date"
              min={new Date().toISOString()}
              preferWheel={true}
            />
          </IonContent>
        </IonModal> */}
      </IonContent>
    </IonPage>
  );
};

export default Booking;
