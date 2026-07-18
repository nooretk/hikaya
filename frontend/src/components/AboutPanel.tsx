import React from "react";
import { Award, ShieldCheck, HelpCircle, FileText, Download } from "lucide-react";

export const AboutPanel: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Narrative Intro Card */}
      <div className="relative bg-brand-olive text-brand-bg p-8 rounded-3xl overflow-hidden shadow-2xl border border-brand-olive">
        <div className="absolute inset-0 tatreez-grid pointer-events-none opacity-5" />
        <div className="relative z-10 space-y-4">
          <div className="inline-block bg-brand-amber/20 text-brand-amber text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-brand-amber/30">
            Startup Idea — Hikaya
          </div>
          <h3 className="font-serif font-black text-3xl text-brand-amber">
            Preserving Palestinian Collective Memory
          </h3>
          <p className="text-stone-300 text-sm leading-relaxed italic">
            Hikaya is an AI-powered interactive storytelling experience and digital archive designed to preserve, document, and revive Palestinian history, oral traditions, and cultural heritage. By combining generative AI, text-to-speech guides, and high-fidelity mapping, we turn static historical nodes into human-centered memories that connect generations.
          </p>
        </div>
      </div>

      {/* Grid of Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-brand-border p-6 rounded-2xl space-y-3 shadow-md">
          <div className="w-8 h-8 rounded-full bg-brand-olive text-brand-bg flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="font-serif font-black text-base text-brand-olive">
            Anti-Hallucination Framework
          </h4>
          <p className="text-xs text-brand-text leading-relaxed">
            To ensure zero factual fabrication, our platform implements a strict validation framework. Gemini is fed curated baseline drafts and locked onto **Google Maps Grounding** to retrieve only verified locations, review snippets, and historical reference landmarks.
          </p>
        </div>

        <div className="bg-white border border-brand-border p-6 rounded-2xl space-y-3 shadow-md">
          <div className="w-8 h-8 rounded-full bg-brand-amber text-white flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <h4 className="font-serif font-black text-base text-brand-olive">
            Traditional Embroidery Motif
          </h4>
          <p className="text-xs text-brand-text leading-relaxed">
            The visual theme is inspired directly by the deep forest olive groves of the Palestine countryside, warm sandstone textures of Jerusalem lime structures, and the vibrant crimson of traditional **Tatreez cross-stitch embroidery** detailing.
          </p>
        </div>
      </div>

      {/* Team Profile */}
      <div className="border-t border-brand-border pt-6 space-y-4">
        <h4 className="font-serif font-black text-xl text-brand-olive">
          The Beta Founding Team
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-white border border-brand-border p-4 rounded-xl space-y-2 shadow-sm">
            <span className="font-serif font-bold text-brand-olive block">Birzeit University</span>
            <ul className="space-y-1 text-brand-text font-sans leading-normal list-disc list-inside">
              <li>Aws Hammad (PM)</li>
              <li>Doaa Hatu (Backend)</li>
              <li>Noureddin Etkaidek (Database)</li>
            </ul>
          </div>

          <div className="bg-white border border-brand-border p-4 rounded-xl space-y-2 shadow-sm">
            <span className="font-serif font-bold text-brand-olive block">Palestine Polytechnic</span>
            <ul className="space-y-1 text-brand-text font-sans leading-normal list-disc list-inside">
              <li>Amra Sawalha (Frontend)</li>
              <li>Joud Abu Omar (AI Module)</li>
              <li>Arwa Al-Hajahja (AI Module)</li>
            </ul>
          </div>

          <div className="bg-white border border-brand-border p-4 rounded-xl space-y-2 shadow-sm">
            <span className="font-serif font-bold text-brand-olive block">Palestine AL-Ahliya</span>
            <ul className="space-y-1 text-brand-text font-sans leading-normal list-disc list-inside">
              <li>Tamara Hamdan (Content)</li>
              <li>Hussein Jaradat (Content)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Complete Sprint Deliverables Download Button */}
      <div className="border-t border-brand-border pt-6 text-center space-y-3">
        <h4 className="font-serif font-black text-lg text-brand-olive uppercase tracking-widest">
          Download Complete Project Package
        </h4>
        <p className="text-xs text-brand-muted max-w-md mx-auto leading-relaxed">
          The user is requested to push sprint outputs. Clicking the button below compiles all components, routes, styles, and the backend Express proxy into a single standalone ZIP folder instantly.
        </p>
        <a
          href="/api/download-zip"
          download="hikaya-frontend-sprint1.zip"
          className="inline-flex items-center gap-2 bg-brand-amber hover:bg-[#b45309] text-stone-100 font-serif font-black tracking-widest uppercase px-6 py-3.5 rounded-full shadow-lg transition-all"
        >
          <Download className="w-4 h-4" />
          Download Frontend & Server Code Bundle (.ZIP)
        </a>
      </div>
    </div>
  );
};
