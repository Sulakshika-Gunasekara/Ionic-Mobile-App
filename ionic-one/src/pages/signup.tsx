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
import { signupUser, storage } from "./api";

interface SignupProps extends RouteComponentProps {
  history: any;
}

const Signup: React.FC<SignupProps> = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      console.log("Attempting signup with:", { email, password: "***" });

      // Use the dedicated signup helper
      const res = await signupUser(email, password);

      console.log("Signup success:", res);

      // Save token in storage (json-server-auth returns 'accessToken')
      if (res?.accessToken) {
        await storage.setItem("token", res.accessToken);
      }

      // Save user info if available
      if (res?.user) {
        await storage.setItem("user", JSON.stringify(res.user));
      }

      // Redirect to home after successful signup
      history.push("/home");
    } catch (err: any) {
      console.error("Signup failed:", err);
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      {/* <IonHeader>
        <IonToolbar>
          <IonTitle>Sign Up</IonTitle>
        </IonToolbar>
      </IonHeader> */}
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

          <IonItem>
            <IonLabel position="floating">Confirm Password</IonLabel>
            <IonInput
              type="password"
              value={confirmPassword}
              onIonChange={(e: any) => setConfirmPassword(e.detail.value!)}
              required
            />
          </IonItem>

          <IonButton
            type="submit"
            expand="block"
            disabled={loading}
            className="login-btn">
            {loading ? "Creating Account..." : "Sign Up"}
          </IonButton>

          <div className="login-signup-link">
            <IonLabel>
              Already have an account?{" "}
              <IonRouterLink routerLink="/login">Login</IonRouterLink>
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

export default Signup;
