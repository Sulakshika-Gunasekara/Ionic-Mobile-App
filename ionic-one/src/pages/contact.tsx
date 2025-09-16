import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonButton,
  IonTextarea,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonInput,
  IonButtons,
  IonMenuButton,
  IonRouterLink,
} from "@ionic/react";
import {
  mailOutline,
  callOutline,
  logoFacebook,
  logoInstagram,
  logoTwitter,
  locationOutline,
  sendOutline,
} from "ionicons/icons";
import "./contact.css";

import { useParams } from "react-router";

const Contact: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Contact Us</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding contact-page">
        <IonContent className="ion-padding contact-page">
          <div className="inner">
            {/* Contact Details */}
            <IonList className="contact-list">
              <IonItem
                className="contact-item"
                href="mailto:hi@ionicframework.com">
                <IonIcon
                  className="contact-icon"
                  icon={mailOutline}
                  slot="start"
                />
                <IonLabel>hi@ionic-one.com</IonLabel>
              </IonItem>
              <IonItem className="contact-item" href="tel:1-541-754-3010">
                <IonIcon
                  className="contact-icon"
                  icon={callOutline}
                  slot="start"
                />
                <IonLabel>071-1234567</IonLabel>
              </IonItem>
            </IonList>
            {/* Office Location */}
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>
                  <IonIcon icon={locationOutline} /> Office Location
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p>1234 Innovation Street, Suite 500</p>
                <p>San Francisco, CA 94107</p>
                <IonButton
                  expand="block"
                  className="map-button"
                  href="https://www.google.com/maps?q=1234+Innovation+Street+San+Francisco"
                  target="_blank">
                  Open in Maps
                </IonButton>
              </IonCardContent>
            </IonCard>

            <IonCard>
              <IonCardHeader>
                <IonCardTitle>
                  <IonIcon icon={sendOutline} slot="start" /> Feedback
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonInput
                  label="Your Name"
                  labelPlacement="floating"
                  fill="outline"
                />
                <IonInput
                  type="email"
                  label="Your Email"
                  labelPlacement="floating"
                  fill="outline"
                  className="ion-margin-top"
                />
                <IonTextarea
                  label="Your Feedback"
                  labelPlacement="floating"
                  fill="outline"
                  autoGrow
                  className="ion-margin-top"
                />
                <IonButton
                  expand="block"
                  color="success"
                  className="ion-margin-top">
                  Submit
                </IonButton>
              </IonCardContent>
            </IonCard>

            {/* Social Buttons */}
            <div className="ion-margin-vertical">
              <IonButton
                expand="block"
                color="primary"
                href="https://www.facebook.com/ionicframework">
                <IonIcon icon={logoFacebook} slot="start" />
                Facebook
              </IonButton>
              <IonButton
                expand="block"
                color="tertiary"
                href="https://www.instagram.com/ionicframework">
                <IonIcon icon={logoInstagram} slot="start" />
                Instagram
              </IonButton>
              <IonButton
                expand="block"
                color="medium"
                href="https://twitter.com/ionicframework">
                <IonIcon icon={logoTwitter} slot="start" />
                Twitter
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default Contact;
