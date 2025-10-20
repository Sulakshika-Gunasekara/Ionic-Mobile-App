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
  IonImg,
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
      <IonContent className="ion-padding" scrollY={false}>
        <div className="login-center">
          <form className="login-form" onSubmit={handleSubmit}>
            <IonItem lines="none" className="ion-justify-content-center">
              <IonImg
                className="login-logo"
                src="https://png.pngtree.com/png-clipart/20230817/original/pngtree-taxi-booking-rgb-color-icon-prebooking-design-business-vector-picture-image_11014402.png"
              />
            </IonItem>

            <IonItem lines="none" className="ion-text-center">
              <IonTitle className="login-title">Sign up</IonTitle>
            </IonItem>

            <IonItem lines="full" className="ion-margin-bottom">
              <IonLabel position="stacked" className="label-text">
                Email
              </IonLabel>
              <IonInput
                className="input-field"
                type="email"
                value={email}
                onIonChange={(e: any) => setEmail(e.detail.value!)}
                required
              />
            </IonItem>

            <IonItem lines="full" className="ion-margin-bottom">
              <IonLabel position="stacked" className="label-text">
                Password
              </IonLabel>
              <IonInput
                className="input-field"
                type="password"
                value={password}
                onIonChange={(e: any) => setPassword(e.detail.value!)}
                required
              />
            </IonItem>

            <IonItem lines="full" className="ion-margin-bottom">
              <IonLabel position="stacked" className="label-text">
                Confirm Password
              </IonLabel>
              <IonInput
                className="input-field"
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
                <IonRouterLink routerLink="/">Login</IonRouterLink>
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
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Signup;
