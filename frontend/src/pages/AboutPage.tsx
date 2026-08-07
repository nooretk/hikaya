import React from "react";
import { AboutPanel } from "../components/AboutPanel";

export const AboutPage: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="font-serif font-black text-3xl text-brand-olive">About Hikaya</h1>
      <p className="text-xs text-brand-muted font-serif italic">
        The idea, the team, and where the project is going.
      </p>
    </div>
    <AboutPanel />
  </div>
);
