import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Lazy load the page components
const Home = React.lazy(() => import("./Pages/Home/Home.jsx"));
const Login = React.lazy(() => import("./Auth/Login.jsx"));
const Classification = React.lazy(() =>
  import("./Pages/Classification/Classification.jsx")
);
const NotFound = React.lazy(() => import("./Pages/NotFound.jsx"));

// A simple loading spinner component to show during lazy loading
const LoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#000",
      color: "white",
    }}
  >
    Loading...
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/classification" element={<Classification />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
