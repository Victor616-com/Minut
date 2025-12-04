import { index, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/layout.jsx", [
    index("routes/home.jsx"),
    route("auth", "routes/authentication.jsx"),
    route("new-project", "routes/createProject.jsx"),
    route("project/:projectId", "routes/projectView.jsx"),
  ]),
];
