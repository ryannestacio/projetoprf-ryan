import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";

const LEGACY_COLLECTION = "app_data";
const LEGACY_DOC_ID = "main";
const DOC_ID = "main";

const RESOURCE_MAP = {
  "prf-weekly-data": "weekly_data",
  "prf-study-sessions": "study_sessions",
  "prf-weekly-goal": "weekly_goal",
  "prf-daily-notes": "daily_notes",
  "prf-sw-accumulated": "stopwatch_accumulated",
  "prf-sw-startedAt": "stopwatch_started_at",
  "prf-daily-planned-override": "daily_planned_overrides",
  "prf-weekly-planned-override": "weekly_planned_override",
  "prf-subject-reviews": "subject_reviews",
  "prf-subject-notes": "subject_notes",
} as const;

type CloudKey = keyof typeof RESOURCE_MAP;

function isCloudKey(key: string): key is CloudKey {
  return key in RESOURCE_MAP;
}

async function loadLegacyValue<T>(key: string): Promise<T | null> {
  try {
    const snapshot = await getDoc(doc(db, LEGACY_COLLECTION, LEGACY_DOC_ID));
    if (!snapshot.exists()) return null;

    const data = snapshot.data();
    if (!(key in data)) return null;

    return data[key] as T;
  } catch {
    return null;
  }
}

async function migrateLegacyValue<T>(key: CloudKey, value: T): Promise<void> {
  try {
    await setDoc(
      doc(db, RESOURCE_MAP[key], DOC_ID),
      {
        value,
        migratedFrom: `${LEGACY_COLLECTION}/${LEGACY_DOC_ID}`,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch {
    // Keep local fallback behavior if migration cannot be completed.
  }
}

export async function loadCloudValue<T>(key: string): Promise<T | null> {
  if (!isCloudKey(key)) return null;

  try {
    const snapshot = await getDoc(doc(db, RESOURCE_MAP[key], DOC_ID));
    if (snapshot.exists()) {
      const data = snapshot.data();
      if ("value" in data) {
        return data.value as T;
      }
    }
  } catch {
    // Continue to legacy fallback below.
  }

  const legacyValue = await loadLegacyValue<T>(key);
  if (legacyValue !== null) {
    await migrateLegacyValue(key, legacyValue);
  }

  return legacyValue;
}

export async function saveCloudValue<T>(key: string, value: T): Promise<void> {
  if (!isCloudKey(key)) return;

  try {
    await setDoc(
      doc(db, RESOURCE_MAP[key], DOC_ID),
      {
        value,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch {
    // noop fallback: localStorage still keeps data available
  }
}
