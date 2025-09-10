import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  IonLabel,
  IonRouterLink,
  IonItem,
  IonToast,
} from "@ionic/react";
import { useState } from "react";
import "./login.css";
import { RouteComponentProps } from "react-router";
import { loginUser, storage } from "./api";
import "./login.css";
interface LoginProps extends RouteComponentProps {
  history: any;
}
const Login: React.FC<LoginProps> = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    if (!email || !password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      console.log("Attempting login with:", { email, password: "***" });

      // Use the dedicated login helper
      const res = await loginUser(email, password);

      console.log("Login success:", res);

      // Save token in storage (json-server-auth returns 'accessToken')
      if (res?.accessToken) {
        await storage.setItem("token", res.accessToken);
      }

      // Save user info if available
      if (res?.user) {
        await storage.setItem("user", JSON.stringify(res.user));
      }

      // Redirect to home
      history.push("/home");
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding login-center">
        <form className="login-form" onSubmit={handleSubmit}>
          <IonItem>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput
              type="email"
              value={email}
              onIonChange={(e: any) => setEmail(e.detail.value!)}
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Password</IonLabel>
            <IonInput
              type="password"
              value={password}
              onIonChange={(e: any) => setPassword(e.detail.value!)}
              required
            />
          </IonItem>

          <IonButton
            type="submit"
            expand="block"
            disabled={loading}
            className="login-btn">
            {loading ? "Logging in..." : "Login"}
          </IonButton>

          <div className="login-signup-link">
            <IonLabel>
              Don't have an account?{" "}
              <IonRouterLink routerLink="/signup">Sign up</IonRouterLink>
            </IonLabel>
          </div>
        </form>

        {/* Show error message */}
        <IonToast
          isOpen={!!error}
          message={error}
          duration={3000}
          onDidDismiss={() => setError("")}
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
