/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { HomePage } from "./pages/HomePage";
import { MapPage } from "./pages/MapPage";
import { LocationDetailsPage } from "./pages/LocationDetailsPage";
import { ContributePage } from "./pages/ContributePage";
import { ConstellationPage } from "./pages/ConstellationPage";
import { AboutPage } from "./pages/AboutPage";
import ExplorerPage from "./pages/ExplorerPage";

/**
 * Routes for the Sprint 2 MVP flow:
 *
 *   /                   home
 *   /map                interactive map of the archived locations
 *   /constellation      the archive drawn as a web of shared themes
 *   /locations/:id      details, reviewed stories, AI narrative, memories
 *   /contribute         user contribution form
 *   /about              project background
 *   /explorer           the Sprint 1 explorer, kept intact
 *
 * Location ids are the same slugs used by the API and the content files
 * ('jerusalem', 'bethlehem', 'sebastia'), so a URL is shareable and readable.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="map" element={<MapPage />} />
          <Route path="locations/:locationId" element={<LocationDetailsPage />} />
          <Route path="constellation" element={<ConstellationPage />} />
          <Route path="contribute" element={<ContributePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="explorer" element={<ExplorerPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
