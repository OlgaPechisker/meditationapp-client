import { WhatsappService } from './whatsapp.service';

describe('WhatsappService lecture links', () => {
  const service = new WhatsappService();

  it('builds a scheduled lecture link with title and date, URL-encoded', () => {
    const link = service.buildScheduledLectureLink('להקשיב פנימה', '19/08/2026');
    expect(link.startsWith('https://wa.me/972501234567?text=')).toBeTrue();
    const decoded = decodeURIComponent(link.split('text=')[1]);
    expect(decoded).toContain('להקשיב פנימה');
    expect(decoded).toContain('19/08/2026');
  });

  it('omits the date phrase when no date is provided', () => {
    const link = service.buildScheduledLectureLink('כותרת', '');
    const decoded = decodeURIComponent(link.split('text=')[1]);
    expect(decoded).toContain('כותרת');
    expect(decoded).not.toContain('בתאריך');
  });

  it('builds an on-demand link with title and minimum participants', () => {
    const link = service.buildOnDemandLectureLink('שקט בעבודה', 10);
    const decoded = decodeURIComponent(link.split('text=')[1]);
    expect(decoded).toContain('שקט בעבודה');
    expect(decoded).toContain('10');
    expect(decoded).toContain('התאריכים הפנויים');
  });

  it('omits the minimum phrase when no minimum is provided', () => {
    const link = service.buildOnDemandLectureLink('כותרת', null);
    const decoded = decodeURIComponent(link.split('text=')[1]);
    expect(decoded).toContain('כותרת');
    expect(decoded).not.toContain('מינימום');
  });

  it('URL-encodes spaces and Hebrew so the raw link has no literal spaces', () => {
    const link = service.buildOnDemandLectureLink('שתי מילים', 5);
    expect(link).not.toContain(' ');
  });
});
