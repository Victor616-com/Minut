// authentication.jsx
import React, { useState } from "react";
import SignUp from "../components/authentication/SignUp";
import SignIn from "../components/authentication/SignIn";

function authentication() {
  const [authState, setAuthState] = useState("signIn");

  const toggleAuthState = () => {
    setAuthState((prev) => (prev === "signIn" ? "signUp" : "signIn"));
  };

  return (
    <div className="flex items-center justify-center h-dvh w-full relative">
      {authState === "signIn" ? (
        <SignIn toggleAuthState={toggleAuthState} />
      ) : (
        <SignUp toggleAuthState={toggleAuthState} />
      )}
    </div>
  );
}

export default authentication;
