import { expect, test } from '@playwright/test';

test('renders semantic rich content on a public blog post', async ({ page, request }) => {
  const apiUrl = process.env.API_URL ?? 'http://localhost:3000';
  const login = await request.post(`${apiUrl}/api/auth/login`, {
    data: { password: process.env.ADMIN_PASSWORD ?? 'admin123' },
  });
  expect(login.ok()).toBeTruthy();
  const { token } = await login.json() as { token: string };
  const slug = `rich-content-${Date.now()}`;
  const create = await request.post(`${apiUrl}/api/blog`, {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      slug,
      locale: 'he',
      title: 'תוכן מעוצב',
      excerpt: 'תקציר',
      content: '<h2 class="ql-align-left ql-direction-ltr">A heading</h2><p><strong>מודגש</strong> ו-<em>נטוי</em></p><ul><li>פריט</li></ul><a href="https://example.com" target="_blank" rel="noopener noreferrer">קישור</a>',
      publishedAt: new Date(Date.now() - 60_000).toISOString(),
    },
  });
  expect(create.status()).toBe(201);
  const post = await create.json() as { id: number };

  try {
    await page.goto(`/blog/${slug}`);
    const content = page.getByTestId('post-content');
    await expect(content.locator('h2')).toHaveText('A heading');
    await expect(content.locator('h2')).toHaveClass(/ql-align-left/);
    await expect(content.locator('h2')).toHaveClass(/ql-direction-ltr/);
    await expect(content.locator('strong')).toHaveText('מודגש');
    await expect(content.locator('ul > li')).toHaveText('פריט');
    await expect(content.locator('a')).toHaveAttribute('rel', 'noopener noreferrer');
  } finally {
    await request.delete(`${apiUrl}/api/blog/${post.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
});

test('offers the restricted toolbar and generates semantic heading markup', async ({ page, request }) => {
  const login = await request.post('http://localhost:3000/api/auth/login', {
    data: { password: process.env.ADMIN_PASSWORD ?? 'admin123' },
  });
  expect(login.ok()).toBeTruthy();
  const { token } = await login.json() as { token: string };
  await page.addInitScript((value) => localStorage.setItem('einat_token', value), token);
  await page.goto('/admin/blog');
  await page.getByTestId('add-post-btn').click();
  const toolbar = page.locator('quill-editor .ql-toolbar');
  await expect(toolbar.locator('button')).toHaveCount(14);
  await toolbar.locator('button.ql-header[value="2"]').click();
  await page.locator('quill-editor .ql-editor').fill('כותרת');
  expect(await page.locator('quill-editor .ql-editor').innerHTML()).toBe('<h2>כותרת</h2>');
});
