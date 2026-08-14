import React, { useEffect, useState } from "react";
import { useLocations } from "../hooks/useLocations";
import { MemoryConstellation } from "../components/MemoryConstellation";
import { DataSourceBanner } from "../components/DataSourceBanner";
import { LoadingRegion, SkeletonLine } from "../components/Skeleton";
import { PageTransition } from "../components/motion";
import { getContributions } from "../services/api";
import { ApiContribution } from "../types";

/**
 * The archive as a web instead of a list.
 *
 * A list of three locations tells you almost nothing; the same three drawn with
 * their shared categories and attached memories shows where the archive is
 * dense and where it is thin - which is the more useful thing to know, and the
 * more honest picture of how much is still missing.
 */
export const ConstellationPage: React.FC = () => {
  const { locations, loading, source, reason } = useLocations();
  const [memories, setMemories] = useState<ApiContribution[]>([]);
  const [memoriesLoading, setMemoriesLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getContributions()
      .then((result) => {
        if (active) setMemories(result.data);
      })
      .finally(() => {
        if (active) setMemoriesLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const busy = loading || memoriesLoading;

  return (
    <PageTransition>
      <div className="space-y-6">
        <DataSourceBanner source={source} reason={reason} />

        <div>
          <h1 className="font-serif font-black text-3xl text-brand-olive">
            Memory constellation
          </h1>
          <p className="text-sm text-brand-text max-w-2xl mt-2 leading-relaxed">
            Every location in the archive, the themes they have in common, and the
            memories people have attached to them. The gaps are as informative as the
            lines: a site with nothing orbiting it is one nobody has written about yet.
          </p>
        </div>

        {busy ? (
          <>
            <SkeletonLine className="h-[520px] w-full rounded-3xl" />
            <LoadingRegion label="Drawing the constellation" />
          </>
        ) : (
          <MemoryConstellation locations={locations} memories={memories} />
        )}
      </div>
    </PageTransition>
  );
};
