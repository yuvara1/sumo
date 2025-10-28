import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequireAuth from "./components/RequireAuth.jsx";
import { LoaderThree } from "./Components/ui/loader.jsx";

// Lazy load the page components
const Home = React.lazy(() => import("./Pages/Home/Home.jsx"));
const Login = React.lazy(() => import("./Auth/Login.jsx"));
const Classification = React.lazy(() =>
  import("./Pages/Classification/Classification.jsx")
);
const NotFound = React.lazy(() => import("./Pages/NotFound.jsx"));

// A simple loading spinner component to show during lazy loading
const LoadingSpinner = () => (
  <div className="flex h-screen w-full items-center justify-center bg-neutral-900">
    <LoaderThree />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route element={<RequireAuth />}>
            <Route path="/" element={<Home />} />
            <Route path="/classification" element={<Classification />} />
          </Route>

          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
