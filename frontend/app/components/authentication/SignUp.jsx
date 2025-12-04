import React, { useState } from "react";
import { useNavigate } from "react-router";
import { UserAuth } from "../../context/AuthContext";
import InputField from "../UI_elements/InputField";
import Button from "../UI_elements/Button";

function SignUp({ toggleAuthState }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState();
  const [loading, setLoading] = useState("");

  const { signUpNewUser } = UserAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    //Check password match before calling Supabase
    if (password !== confirmPassword) {
      setError("Passwords do not match. Try again.");
      setLoading(false);
      setPassword("");
      setConfirmPassword("");
      return;
    }

    try {
      const result = await signUpNewUser(email, password);
      if (result.success) {
        navigate("/"); // Redirect to home on successful sign-up
        console.log("Sign-up successful:", result.data); // Remove before deployment
      } else {
        setError(result.error.message);
      }
    } catch (err) {
      setError("An error occurred during sign up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="text-m absolute top-[90px] left-[30px]">/Sign Up</p>
      <form
        onSubmit={handleSignup}
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
          <InputField
            placeholder="Confirm your password"
            value={confirmPassword}
            type="password"
            onChange={setConfirmPassword}
          />
        </div>
        <div className="flex flex-col items-center gap-5">
          <Button
            gradient="gradient7"
            type="submit"
            loading={loading}
            loadingText="Signing Up..."
          >
            Sign Up
          </Button>
          <p className="text-s text-textlight">
            Already have an account?{" "}
            <span className="gradientText6 " onClick={toggleAuthState}>
              Sign In
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
