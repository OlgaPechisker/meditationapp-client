import { Lecture, groupLectures, isOnDemand, isScheduled } from './lecture.model';

function makeLecture(overrides: Partial<Lecture> = {}): Lecture {
  return {
    id: 1,
    slug: 'slug',
    locale: 'he',
    type: 'SCHEDULED',
    title: 'Title',
    subtitle: null,
    summary: null,
    description: '<p>desc</p>',
    audience: null,
    durationLabel: null,
    highlights: [],
    date: '2099-01-01T10:00:00.000Z',
    location: 'Somewhere',
    price: null,
    minimumParticipants: null,
    imageUrl: null,
    isActive: true,
    sortOrder: 0,
    ...overrides,
  };
}

describe('lecture model', () => {
  it('identifies scheduled and on-demand lectures', () => {
    expect(isScheduled(makeLecture({ type: 'SCHEDULED' }))).toBeTrue();
    expect(isScheduled(makeLecture({ type: 'ON_DEMAND' }))).toBeFalse();
    expect(isOnDemand(makeLecture({ type: 'ON_DEMAND' }))).toBeTrue();
    expect(isOnDemand(makeLecture({ type: 'SCHEDULED' }))).toBeFalse();
  });

  it('sorts scheduled lectures chronologically', () => {
    const later = makeLecture({ id: 1, type: 'SCHEDULED', date: '2099-06-01T10:00:00.000Z' });
    const sooner = makeLecture({ id: 2, type: 'SCHEDULED', date: '2099-01-01T10:00:00.000Z' });
    const { scheduled } = groupLectures([later, sooner]);
    expect(scheduled.map((l) => l.id)).toEqual([2, 1]);
  });

  it('sorts on-demand lectures by sortOrder then title', () => {
    const a = makeLecture({ id: 1, type: 'ON_DEMAND', date: null, sortOrder: 2, title: 'B' });
    const b = makeLecture({ id: 2, type: 'ON_DEMAND', date: null, sortOrder: 1, title: 'Z' });
    const c = makeLecture({ id: 3, type: 'ON_DEMAND', date: null, sortOrder: 1, title: 'A' });
    const { onDemand } = groupLectures([a, b, c]);
    expect(onDemand.map((l) => l.id)).toEqual([3, 2, 1]);
  });

  it('separates the two groups from a mixed list', () => {
    const scheduled = makeLecture({ id: 1, type: 'SCHEDULED' });
    const onDemand = makeLecture({ id: 2, type: 'ON_DEMAND', date: null });
    const groups = groupLectures([onDemand, scheduled]);
    expect(groups.scheduled.map((l) => l.id)).toEqual([1]);
    expect(groups.onDemand.map((l) => l.id)).toEqual([2]);
  });

  it('excludes scheduled lectures before the supplied current time', () => {
    const now = new Date('2030-01-01T10:00:00.000Z');
    const past = makeLecture({ id: 1, date: '2030-01-01T09:59:59.999Z' });
    const current = makeLecture({ id: 2, date: '2030-01-01T10:00:00.000Z' });
    const future = makeLecture({ id: 3, date: '2030-01-01T10:00:00.001Z' });

    const { scheduled } = groupLectures([future, past, current], now);

    expect(scheduled.map((l) => l.id)).toEqual([2, 3]);
  });

  it('excludes scheduled lectures with null or invalid dates', () => {
    const now = new Date('2030-01-01T10:00:00.000Z');
    const missing = makeLecture({ id: 1, date: null });
    const invalid = makeLecture({ id: 2, date: 'not-a-date' });
    const valid = makeLecture({ id: 3, date: '2030-02-01T10:00:00.000Z' });

    const { scheduled } = groupLectures([missing, invalid, valid], now);

    expect(scheduled.map((l) => l.id)).toEqual([3]);
  });

  it('retains all on-demand lectures regardless of their date values', () => {
    const now = new Date('2030-01-01T10:00:00.000Z');
    const past = makeLecture({ id: 1, type: 'ON_DEMAND', date: '2020-01-01T10:00:00.000Z' });
    const missing = makeLecture({ id: 2, type: 'ON_DEMAND', date: null });
    const invalid = makeLecture({ id: 3, type: 'ON_DEMAND', date: 'not-a-date' });

    const { onDemand } = groupLectures([past, missing, invalid], now);

    expect(onDemand.map((l) => l.id)).toEqual([1, 2, 3]);
  });
});
