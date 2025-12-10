import { createContext, useContext, useState } from "react";

const AnimationContext = createContext();

export function AnimationProvider({ children }) {
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  return (
    <AnimationContext.Provider
      value={{ animationsEnabled, setAnimationsEnabled }}
    >
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimations() {
  return useContext(AnimationContext);
}
