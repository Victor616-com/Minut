import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

// Styles imported here will be bundled into the app automatically
import "./app.css";

// Add links to external stylesheets, fonts, etc. here
// https://reactrouter.com/start/framework/route-module#links
export const links = () => [];

export function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Chatbot</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function HydrateFallback() {
  return <div>Loading...</div>;
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main
      style={{
        paddingTop: 64,
        padding: 16,
        maxWidth: 1024,
        margin: "0 auto",
      }}
    >
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre style={{ width: "100%", padding: 16, overflowX: "auto" }}>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
