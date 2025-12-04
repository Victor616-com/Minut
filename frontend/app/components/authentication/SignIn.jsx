import React, { useState } from "react";
import InputField from "../UI_elements/InputField";
import Button from "../UI_elements/Button";
import { UserAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";

function SignIn({ toggleAuthState }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState();
  const [loading, setLoading] = useState("");

  const { signInUser } = UserAuth();
  const navigate = useNavigate();
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInUser(email, password);
      if (result.success) {
        navigate("/");
      } else {
        setError(result.error.message);
      }
    } catch (err) {
      setError("An error occured during sign-in.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <p className="text-m absolute top-[90px] left-[30px]">/Sign In</p>
      <form
        onSubmit={handleSignIn}
        className="flex flex-col items-center gap-[70px]"
      >
        <div className="flex flex-col gap-5">
          {error && (
            <p className="text-m text-red-400 wrap-break-word max-w-[285px]">
              {error}
            </p>
          )}
          <InputField
            placeholder="Enter your email"
            value={email}
            type="email"
            onChange={setEmail}
          />
          <InputField
            placeholder="Enter your password"
            value={password}
            type="password"
            onChange={setPassword}
          />
        </div>
        <div className="flex flex-col items-center gap-5">
          <Button
            gradient="gradient6"
            type="submit"
            loading={loading}
            loadingText="Signing In..."
          >
            Sign In
          </Button>
          <p className="text-s text-textlight">
            Don't have an account?{" "}
            <span className="gradientText7 " onClick={toggleAuthState}>
              Sign Up
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}

export default SignIn;
