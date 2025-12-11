import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import RadioGroup from "../UI_elements/RadioGroup";
import Separator from "../UI_elements/Separator";
import ToggleButton from "../UI_elements/ToggleButton";
import { useAnimations } from "../../context/AnimationContext";

export default function AccessMenu() {
  const [open, setOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("💻");
  const { animationsEnabled, setAnimationsEnabled } = useAnimations();

  const themeOptions = [
    { label: "System", value: "💻" },
    { label: "Light", value: "☀️" },
    { label: "Dark", value: "🌑" },
    { label: "High contrast", value: "🙃" },
  ];

  const themeContainerRef = useRef(null);

  const menuRef = useRef(null);
  const tlRef = useRef(null);
  const iconRef = useRef(null);

  const openMenu = () => setOpen(true);
  const closeMenu = () => setOpen(false);

  const openButtonRef = useRef(null);

  // Build GSAP animation timeline once
  useEffect(() => {
    tlRef.current = gsap.timeline({ paused: true });

    // Fade + scale out SVG icon
    tlRef.current.to(iconRef.current, {
      opacity: 0,
      scale: 0.5,
      duration: 0.4,
      ease: "power2.inOut",
    });
    tlRef.current.fromTo(
      menuRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.35 },
      "-=0.25",
    );
  }, []);

  // Play/reverse based on `open`
  useEffect(() => {
    if (open) {
      tlRef.current.play();
    } else {
      tlRef.current.reverse();
    }
  }, [open]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme-picker", selectedTheme);
  }, [selectedTheme]);

  // Accesability
  useEffect(() => {
    if (open && menuRef.current) {
      // Move focus to FIRST focusable element inside the dialog
      const firstFocusable = menuRef.current.querySelector(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
      );
      firstFocusable?.focus();
    }
    if (!open && openButtonRef.current) {
      openButtonRef.current.focus();
    }
  }, [open]);

  return (
    <>
      {/* Floating Accessibility Button */}
      <button
        aria-label="Open accessibility menu"
        onClick={openMenu}
        ref={openButtonRef}
        aria-expanded={open}
        className="fixed bottom-3 w-11 h-11 right-3 z-50 rounded-full flex items-center justify-center "
      >
        {/* Your Icon */}
        <svg
          ref={iconRef}
          xmlns="http://www.w3.org/2000/svg"
          width="44"
          height="44"
          viewBox="0 0 44 44"
          fill="var(--color-inputcolor)"
        >
          <path
            d="M22.0002 1.83334C18.0116 1.83334 14.1126 3.01609 10.7962 5.23204C7.47978 7.44798 4.89497 10.5976 3.3686 14.2826C1.84223 17.9675 1.44287 22.0224 2.221 25.9343C2.99914 29.8463 4.91983 33.4396 7.74019 36.26C10.5605 39.0803 14.1539 41.001 18.0659 41.7792C21.9778 42.5573 26.0326 42.1579 29.7176 40.6316C33.4026 39.1052 36.5522 36.5204 38.7681 33.204C40.9841 29.8876 42.1668 25.9886 42.1668 22C42.179 19.3483 41.6656 16.7204 40.6565 14.2682C39.6473 11.816 38.1623 9.58803 36.2872 7.71296C34.4122 5.83789 32.1842 4.35289 29.732 3.34372C27.2797 2.33455 24.6519 1.8212 22.0002 1.83334ZM22.0002 9.16667C22.5441 9.16667 23.0758 9.32796 23.528 9.63013C23.9802 9.93231 24.3327 10.3618 24.5408 10.8643C24.749 11.3668 24.8034 11.9197 24.6973 12.4532C24.5912 12.9866 24.3293 13.4766 23.9447 13.8612C23.5601 14.2458 23.0701 14.5077 22.5367 14.6138C22.0032 14.7199 21.4503 14.6655 20.9478 14.4573C20.4453 14.2492 20.0158 13.8967 19.7136 13.4445C19.4115 12.9923 19.2502 12.4606 19.2502 11.9167C19.2374 11.5521 19.2997 11.1888 19.4334 10.8493C19.5671 10.5099 19.7692 10.2016 20.0271 9.94364C20.2851 9.68568 20.5934 9.48358 20.9328 9.34991C21.2723 9.21624 21.6356 9.15387 22.0002 9.16667ZM32.0835 19.25H25.6668V23.65L27.5002 32.6333C27.5829 33.118 27.477 33.6159 27.2043 34.025C26.9316 34.4341 26.5127 34.7233 26.0335 34.8333H25.6668C25.2423 34.8253 24.8323 34.6771 24.5007 34.4119C24.1691 34.1466 23.9345 33.7791 23.8335 33.3667L22.1835 24.75H21.8168L20.1668 33.3667C20.0658 33.7791 19.8312 34.1466 19.4997 34.4119C19.1681 34.6771 18.7581 34.8253 18.3335 34.8333H17.9668C17.4877 34.7233 17.0688 34.4341 16.796 34.025C16.5233 33.6159 16.4175 33.118 16.5002 32.6333L18.3335 23.65V19.25H11.9168C11.4306 19.25 10.9643 19.0568 10.6205 18.713C10.2767 18.3692 10.0835 17.9029 10.0835 17.4167C10.0835 16.9304 10.2767 16.4641 10.6205 16.1203C10.9643 15.7765 11.4306 15.5833 11.9168 15.5833H32.0835C32.5697 15.5833 33.0361 15.7765 33.3799 16.1203C33.7237 16.4641 33.9168 16.9304 33.9168 17.4167C33.9168 17.9029 33.7237 18.3692 33.3799 18.713C33.0361 19.0568 32.5697 19.25 32.0835 19.25Z"
            fill="var(--color-inputcolor)"
          />
        </svg>
      </button>

      {/* Menu */}
      {open && (
        <div
          ref={menuRef}
          aria-hidden={!open}
          inert={!open ? "" : undefined}
          role="dialog"
          aria-modal="true"
          aria-label="Accessibility Menu"
          className={`fixed inset-0 bg-(--bg-color) px-5 text-white z-40 flex flex-col gap-14 items-center justify-center text-3xl
          ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}
        `}
        >
          <div className="w-full max-w-xl flex flex-col gap-14 items-center justify-center">
            <h2 className="sr-only">Accessibility Settings</h2>
            <button
              onClick={closeMenu}
              aria-label="Close menu"
              className="absolute top-6 right-6 text-2xl text-inputcolor"
            >
              ✕
            </button>

            <div
              className="flex flex-col gap-5 text-m w-full "
              ref={themeContainerRef}
              id="theme"
            >
              <Separator>Theme</Separator>
              <RadioGroup
                options={themeOptions}
                selected={selectedTheme}
                onChange={setSelectedTheme}
                className="w-full max-w-xs"
              />
            </div>

            <div className="flex flex-col gap-5 text-m w-full ">
              <Separator>Animations</Separator>
              <div className="flex flex-row w-full gap-3">
                <ToggleButton
                  enabled={animationsEnabled}
                  onChange={setAnimationsEnabled}
                />
                <p className="text-m text-inputcolor">Animations</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
