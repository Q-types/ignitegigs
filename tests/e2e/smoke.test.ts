import { test, expect } from '@playwright/test';

test.describe('Smoke tests', () => {
	test('homepage loads and has the correct title', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle(/IgniteGigs/);
	});

	test('homepage contains hero content', async ({ page }) => {
		await page.goto('/');
		// Verify the main heading is visible
		await expect(page.locator('h1')).toBeVisible();
	});

	test('navigation links exist', async ({ page }) => {
		await page.goto('/');

		// Check that the key navigation links are present in the page
		const findPerformers = page.locator('a[href="/performers"]').first();
		await expect(findPerformers).toBeAttached();

		const howItWorks = page.locator('a[href="/how-it-works"]').first();
		await expect(howItWorks).toBeAttached();

		const blog = page.locator('a[href="/blog"]').first();
		await expect(blog).toBeAttached();
	});

	test('performers page loads', async ({ page }) => {
		await page.goto('/performers');
		await expect(page).toHaveTitle(/IgniteGigs/);
		// The page should have loaded without a server error
		await expect(page.locator('main')).toBeVisible();
	});

	test('contact page loads and form is visible', async ({ page }) => {
		await page.goto('/contact');
		await expect(page).toHaveTitle(/IgniteGigs/);
		// The contact form should be present on the page
		const form = page.locator('form');
		await expect(form).toBeVisible();
	});

	test('login page loads', async ({ page }) => {
		await page.goto('/auth/login');
		await expect(page).toHaveTitle(/IgniteGigs/);
		// Should show some form of login interface
		await expect(page.locator('main')).toBeVisible();
	});

	test('404 page shows for invalid routes', async ({ page }) => {
		const response = await page.goto('/this-route-does-not-exist-12345');
		// SvelteKit returns a 404 status for unknown routes
		expect(response?.status()).toBe(404);
	});
});
