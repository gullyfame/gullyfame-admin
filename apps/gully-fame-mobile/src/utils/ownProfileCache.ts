import AsyncStorage from "@react-native-async-storage/async-storage";

// The last loaded own profile, so the profile screen opens with it instead of an
// empty header. Kept in memory for this app session and on the device for the next one.

export const OWN_PROFILE_SNAPSHOT_KEY = "@gullyfame_own_profile";

let snapshot: Record<string, any> | null = null;
let cleared = false;

// Read once when the app starts so the first profile visit is instant too. A snapshot
// that belongs to another account (different stored userId) is ignored.
const ready: Promise<void> = Promise.resolve()
  .then(() => AsyncStorage.multiGet([OWN_PROFILE_SNAPSHOT_KEY, "userId"]))
  .then(([[, saved], [, userId]]) => {
    if (cleared || snapshot || !saved || !userId) return;
    const parsed = JSON.parse(saved);
    if (parsed && (parsed.id === userId || parsed._id === userId)) snapshot = parsed;
  })
  .catch(() => {});

export const getOwnProfileSnapshot = <T extends object>(): T | null => snapshot as T | null;

export const ownProfileSnapshotReady = () => ready;

export function saveOwnProfileSnapshot(profile: object): void {
  snapshot = profile as Record<string, any>;
  AsyncStorage.setItem(OWN_PROFILE_SNAPSHOT_KEY, JSON.stringify(profile)).catch(() => {});
}

/** Called on login and logout so one account never sees another's profile. */
export function clearOwnProfileSnapshot(): void {
  snapshot = null;
  cleared = true;
  AsyncStorage.removeItem(OWN_PROFILE_SNAPSHOT_KEY).catch(() => {});
}
