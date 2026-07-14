export type LectureType = 'SCHEDULED' | 'ON_DEMAND';

export interface Lecture {
  id: number;
  slug: string;
  locale: string;
  type: LectureType;
  title: string;
  subtitle: string | null;
  summary: string | null;
  description: string;
  audience: string | null;
  durationLabel: string | null;
  highlights: string[];
  date: string | null;
  location: string | null;
  price: number | null;
  minimumParticipants: number | null;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
}

export function isScheduled(lecture: Pick<Lecture, 'type'>): boolean {
  return lecture.type === 'SCHEDULED';
}

export function isOnDemand(lecture: Pick<Lecture, 'type'>): boolean {
  return lecture.type === 'ON_DEMAND';
}

/**
 * Splits a flat lecture list into the two timeline groups: upcoming scheduled
 * lectures ordered chronologically, then on-demand lectures ordered by
 * sortOrder and title.
 */
export function groupLectures(
  lectures: Lecture[],
  now: Date = new Date(),
): {
  scheduled: Lecture[];
  onDemand: Lecture[];
} {
  const nowTime = now.getTime();
  const getLectureTime = (lecture: Lecture) => new Date(lecture.date ?? '').getTime();
  const scheduled = lectures
    .filter((lecture) => {
      if (!isScheduled(lecture) || !lecture.date) return false;
      const dateTime = getLectureTime(lecture);
      return !Number.isNaN(dateTime) && dateTime >= nowTime;
    })
    .sort((a, b) => getLectureTime(a) - getLectureTime(b));

  const onDemand = lectures
    .filter(isOnDemand)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title, 'he'));

  return { scheduled, onDemand };
}
