import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Authentication(props) {
  const { handleCloseModal } = props;
  const [registered, setRegistered] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState(null);

  const { signup, login, resetPassword } = useAuth();

  async function handleAuthenticate() {
    if (
      !email ||
      !email.includes("@") ||
      !password ||
      password.length < 8 ||
      isAuthenticating
    ) {
      return;
    }

    try {
      setIsAuthenticating(true);
      setError(null);
      if (!registered) {
        // register a user
        await signup(email, password);
      } else {
        // login a user
        await login(email, password);
      }
      handleCloseModal();
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    } finally {
      setIsAuthenticating(false);
    }
  }

  return (
    <>
      <h2 className="sign-up-text">{registered ? "Login" : "Sign Up"}</h2>
      <p>
        {registered
          ? "Sign in to your account!"
          : "Start your caffeine detox journey now!"}
      </p>
      {error && <p>❌ {error}</p>}
      <input
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        placeholder="Enter your email"
      />
      <input
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        type="password"
        placeholder="Enter password"
      />
      <button onClick={handleAuthenticate}>
        <p>{isAuthenticating ? "Authenticating..." : "Submit"}</p>
      </button>
      <hr />
      <div className="register-content">
        <p>
          {registered ? "Don't have an account?" : "Already have an account?"}
        </p>
        <button
          onClick={() => {
            setRegistered(!registered);
          }}
        >
          <p>{registered ? "Sign Up!" : "Login"}</p>
        </button>
        {registered && (
          <button
            onClick={() => {
              setError(
                "✅Password reset email sent! Please check spam folder if cannot find in inbox."
              );
              resetPassword();
            }}
          >
            Forgot password?
          </button>
        )}
      </div>
    </>
  );
}

export default Authentication;
