import { useNavigate } from "react-router";
const backIconSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="45"
    height="45"
    viewBox="0 0 45 45"
    fill="none"
  >
    <path
      d="M34.6875 22.5H11.25M11.25 22.5L22.5 11.25M11.25 22.5L22.5 33.75"
      stroke="#7D7994"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
function BackIcon() {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(-1)} className="absolute left-3 top-3">
      {backIconSVG}
    </button>
  );
}

export default BackIcon;
