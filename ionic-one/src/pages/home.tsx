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
} from "@ionic/react";
import { useParams, useHistory } from "react-router";
import React, { useState } from "react";
import "./home.css";

const Home: React.FC = () => {
  const [location, setLocation] = useState<string>("");
  const [type, setType] = useState<string>("");

  const history = useHistory();

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Create query parameters from form data
    const searchParams = new URLSearchParams();
    if (location) searchParams.append("location", location);
    if (type) searchParams.append("vehicleType", type);

    // Navigate to vehicles page with parameters
    history.push(`/vehicles?${searchParams.toString()}`);
  };

  const { name } = useParams<{ name: string }>();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Home</IonTitle>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="home-content">
        <IonList className="home-list">
          <form className="home-form" onSubmit={handleFormSubmit}>
            <IonItem>
              <IonLabel position="floating" className="home-label">
                Location
              </IonLabel>
              <IonInput
                className="home-input"
                value={location}
                placeholder="Enter location"
                onIonChange={(event) =>
                  setLocation(event.detail.value as string)
                }
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating" className="home-label">
                Vehicle Type
              </IonLabel>
              <IonInput
                className="home-input"
                value={type}
                placeholder="Enter Type"
                onIonChange={(event) => setType(event.detail.value as string)}
              />
            </IonItem>

            <IonButton type="submit" expand="block" className="home-btn">
              Search
            </IonButton>
          </form>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
