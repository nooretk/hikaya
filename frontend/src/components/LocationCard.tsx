import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { ApiLocation } from "../types";
import { CoverImage } from "./CoverImage";

/** Location summary card used on the home and map pages. */
export const LocationCard: React.FC<{ location: ApiLocation }> = ({ location }) => (
  <Link
    to={`/locations/${location.id}`}
    className="group bg-white rounded-3xl border border-brand-border overflow-hidden shadow-sm hover:shadow-xl transition-shadow flex flex-col"
  >
    <div className="relative h-44 bg-brand-olive">
      <CoverImage
        src={location.coverImageUrl}
        alt={location.name}
        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-olive/90 via-brand-olive/10 to-transparent" />
      <div className="absolute bottom-4 left-5 right-5">
        <h3 className="font-serif font-black text-2xl text-stone-100 leading-tight">
          {location.name}
        </h3>
        {location.arabicName && (
          <span className="font-serif text-sm text-stone-300" dir="rtl">
            {location.arabicName}
          </span>
        )}
      </div>
    </div>

    <div className="p-5 space-y-3 flex-1 flex flex-col">
      {location.city && (
        <p className="text-[10px] font-mono uppercase tracking-widest text-brand-muted flex items-center gap-1.5">
          <MapPin className="w-3 h-3 text-brand-amber" />
          {location.city}, {location.country}
        </p>
      )}

      <p className="text-xs text-brand-text leading-relaxed line-clamp-4 flex-1">
        {location.description}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {location.categories.map((category) => (
          <span
            key={category}
            className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-bg border border-brand-border-light text-brand-muted"
          >
            {category}
          </span>
        ))}
      </div>

      <span className="text-xs font-serif font-bold uppercase tracking-widest text-brand-olive flex items-center gap-1.5 group-hover:text-brand-amber transition-colors">
        Open location
        <ArrowRight className="w-3.5 h-3.5" />
      </span>
    </div>
  </Link>
);
