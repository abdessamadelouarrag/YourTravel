import { lazy, Suspense, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MotionConfig } from "motion/react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import SiteLayout from "../layouts/SiteLayout";
import Home from "../pages/Home";
import { LoadingSkeleton } from "../components/ui";
const Explore = lazy(() => import("../pages/Explore")),
  Destination = lazy(() => import("../pages/Destination")),
  Planner = lazy(() => import("../pages/Planner")),
  Favorites = lazy(() => import("../pages/Favorites")),
  About = lazy(() => import("../pages/About")),
  Contact = lazy(() => import("../pages/Contact")),
  NotFound = lazy(() => import("../pages/NotFound"));
export default function App() {
  const [stored, setFavorites, storageError] = useLocalStorage(
    "cyt-favorites",
    [],
  );
  const favorites = Array.isArray(stored) ? stored : [];
  const toggleFavorite = useCallback(
    (id) =>
      setFavorites((old) =>
        (Array.isArray(old) ? old : []).includes(id)
          ? old.filter((x) => x !== id)
          : [...(Array.isArray(old) ? old : []), id],
      ),
    [setFavorites],
  );
  const props = { favorites, toggleFavorite };
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="page-shell">
              <LoadingSkeleton />
            </div>
          }
        >
          <Routes>
            <Route element={<SiteLayout favorites={favorites} />}>
              <Route index element={<Home {...props} />} />
              <Route path="explore" element={<Explore {...props} />} />
              <Route path="destinations" element={<Explore {...props} />} />
              <Route
                path="destination/:id"
                element={<Destination {...props} />}
              />
              <Route path="planner" element={<Planner />} />
              <Route path="favorites" element={<Favorites {...props} />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
        {storageError && (
          <div role="alert" className="toast">
            Your browser couldn’t save favorites. They’ll last for this visit.
          </div>
        )}
      </BrowserRouter>
    </MotionConfig>
  );
}
