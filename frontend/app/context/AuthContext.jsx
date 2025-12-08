import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../supabaseClient";
const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);

  // Sign up
  const signUpNewUser = async (email, password, name = null) => {
    if (!email || !password) {
      return {
        success: false,
        error: { message: "Email and password are required" },
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return { success: false, error };

    // Insert name into profiles table only if provided
    const user = data.user;
    if (user && name) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({ id: user.id, name });

      if (profileError) return { success: false, error: profileError };
    }

    return { success: true, data };
  };

  // Sign in
  const signInUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        console.log("Error signing in:", error);
        return { success: false, error };
      }
      console.log("Sign-in successful:", data); // Remove before deployment
      return { success: true, data }; // Remove before deployment
    } catch (error) {
      console.log("Error signing in:", error);
    }
  };

  // Sign Out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }
  };
  // Listen for session changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      },
    );

    return () => subscription?.unsubscribe();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        session,
        setSession,
        user: session?.user ?? null,
        signUpNewUser,
        signInUser,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
