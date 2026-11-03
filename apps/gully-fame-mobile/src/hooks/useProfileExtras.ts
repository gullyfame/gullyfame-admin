import { useEffect, useRef, useState } from "react";
import { FollowCounts, ProfileInsights, getFollowCounts, getProfileInsights } from "@/api/services/profileExtrasService";

/** Follow counts and insights (own profile only) for a profile. */
export function useProfileExtras(userId: string, isOwn: boolean) {
  const [followCounts, setFollowCounts] = useState<FollowCounts | null>(null);
  const [insights, setInsights] = useState<ProfileInsights | null>(null);
  const activeRef = useRef(true);

  useEffect(() => {
    activeRef.current = true;
    return () => {
      activeRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!userId) return;
    Promise.all([
      getFollowCounts(userId).catch(() => null),
      isOwn ? getProfileInsights().catch(() => null) : Promise.resolve(null),
    ]).then(([counts, stats]) => {
      if (!activeRef.current) return;
      setFollowCounts(counts);
      setInsights(stats);
    });
  }, [userId, isOwn]);

  return { followCounts, insights };
}
