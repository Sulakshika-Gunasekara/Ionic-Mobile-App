import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from "@ionic/react";

import { useLocation } from "react-router-dom";
import {
  archiveOutline,
  archiveSharp,
  bookmarkOutline,
  heartOutline,
  heartSharp,
  mailOutline,
  mailSharp,
  paperPlaneOutline,
  paperPlaneSharp,
  phoneLandscape,
  trashOutline,
  trashSharp,
  warningOutline,
  warningSharp,
  homeOutline,
  homeSharp,
  settingsOutline,
  settingsSharp,
} from "ionicons/icons";
import "./Menu.css";

import "../pages/Page";
import Contact from "../pages/contact";
import Favourites from "../pages/favourites";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: "Home",
    url: "../home",
    iosIcon: homeOutline,
    mdIcon: homeSharp,
  },
  {
    title: "Favourites",
    url: "/favourites",
    iosIcon: heartOutline,
    mdIcon: heartSharp,
  },
  {
    title: "Contact Us",
    url: "/contact",
    iosIcon: paperPlaneOutline,
    mdIcon: paperPlaneSharp,
  },

  {
    title: "Settings",
    url: "/settings",
    iosIcon: settingsOutline,
    mdIcon: settingsSharp,
  },
];

const Menu: React.FC = () => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent className="menu-content ion-padding">
        <IonList id="inbox-list">
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  className={
                    location.pathname === appPage.url ? "selected" : ""
                  }
                  routerLink={appPage.url}
                  routerDirection="none"
                  lines="none"
                  detail={false}>
                  <IonIcon
                    aria-hidden="true"
                    slot="start"
                    ios={appPage.iosIcon}
                    md={appPage.mdIcon}
                  />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
