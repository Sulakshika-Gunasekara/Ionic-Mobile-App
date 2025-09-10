import React from "react";
import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route, useLocation } from "react-router-dom";

import Menu from "./components/Menu";
import Page from "./pages/Page";
import Settings from "./pages/settings";
import Contact from "./pages/contact";
import Favourites from "./pages/favourites";
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Vehicles from "./pages/vehicles";
import Booking from "./pages/Booking";

import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "@ionic/react/css/palettes/dark.system.css";
import "./theme/variables.css";

setupIonicReact();

const AppShell: React.FC = () => {
  const location = useLocation();

  // Add both login and signup to auth routes, plus root path
  const isAuthRoute =
    ["/", "/login", "/signup"].includes(location.pathname) ||
    location.pathname.startsWith("/booking");

  if (isAuthRoute) {
    // Auth pages: NO side menu
    return (
      <IonRouterOutlet id="main">
        <Route path="/" exact>
          <Redirect to="/login" />
        </Route>
        <Route path="/login" exact component={Login} />
        <Route path="/signup" exact component={Signup} />
        <Route path="/booking/:id" exact component={Booking} />
      </IonRouterOutlet>
    );
  }

  // App pages: WITH side menu
  return (
    <IonSplitPane contentId="main">
      <Menu />
      <IonRouterOutlet id="main">
        <Route path="/home" exact component={Home} />
        <Route path="/folder/:name" exact component={Page} />
        <Route path="/settings" exact component={Settings} />
        <Route path="/contact" exact component={Contact} />
        <Route path="/favourites" exact component={Favourites} />
        <Route path="/vehicles" exact component={Vehicles} />
      </IonRouterOutlet>
    </IonSplitPane>
  );
};

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <AppShell />
    </IonReactRouter>
  </IonApp>
);

export default App;
