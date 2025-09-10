import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonImg,
} from "@ionic/react";

import { useParams } from "react-router";

const Favourites: React.FC = () => {
  const { name } = useParams<{ name: string }>();

  // Dummy favourites data (replace with API or state later)
  const favourites = [
    {
      id: 1,
      name: "Favourite Place 1",
      location: "Colombo",
      photo: "https://via.placeholder.com/300",
    },
    {
      id: 2,
      name: "Favourite Place 2",
      location: "Kandy",
      photo: "https://via.placeholder.com/300",
    },
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Favourites {name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList>
          {favourites.map((favourite) => (
            <IonCard key={favourite.id}>
              <IonImg src={favourite.photo} alt={favourite.name} />
              <IonCardHeader>
                <IonCardTitle>{favourite.name}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>Location: {favourite.location}</IonCardContent>
            </IonCard>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Favourites;
