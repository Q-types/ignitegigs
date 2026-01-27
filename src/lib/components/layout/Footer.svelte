<script lang="ts">
	const currentYear = new Date().getFullYear();
</script>

<footer class="bg-secondary text-white">
	<div class="container-wide py-12">
		<div class="grid grid-cols-1 md:grid-cols-4 gap-8">
			<!-- Brand -->
			<div class="md:col-span-1">
				<a href="/" class="flex items-center gap-2 mb-4">
					<img src="/logo.png" alt="IgniteGigs" class="h-10 w-auto brightness-0 invert" />
				</a>
				<p class="text-gray-400 text-sm">
					The performer-owned platform. Book direct. Keep more.
				</p>
			</div>

			<!-- For Performers -->
			<div>
				<h4 class="font-semibold mb-4">For Performers</h4>
				<ul class="space-y-2 text-sm text-gray-400">
					<li>
						<a href="/auth/signup?type=performer" class="hover:text-white transition-colors">
							Join as Performer
						</a>
					</li>
					<li>
						<a href="/how-it-works" class="hover:text-white transition-colors">
							How It Works
						</a>
					</li>
					<li>
						<a href="/pricing" class="hover:text-white transition-colors">
							Pricing
						</a>
					</li>
					<li>
						<a href="/success-stories" class="hover:text-white transition-colors">
							Success Stories
						</a>
					</li>
				</ul>
			</div>

			<!-- For Clients -->
			<div>
				<h4 class="font-semibold mb-4">For Clients</h4>
				<ul class="space-y-2 text-sm text-gray-400">
					<li>
						<a href="/performers" class="hover:text-white transition-colors">
							Find Performers
						</a>
					</li>
					<li>
						<a href="/how-to-book" class="hover:text-white transition-colors">
							How to Book
						</a>
					</li>
					<li>
						<a href="/trust-safety" class="hover:text-white transition-colors">
							Trust & Safety
						</a>
					</li>
					<li>
						<a href="/faq" class="hover:text-white transition-colors">
							FAQ
						</a>
					</li>
				</ul>
			</div>

			<!-- Company -->
			<div>
				<h4 class="font-semibold mb-4">Company</h4>
				<ul class="space-y-2 text-sm text-gray-400">
					<li>
						<a href="/about" class="hover:text-white transition-colors">
							About Us
						</a>
					</li>
					<li>
						<a href="/blog" class="hover:text-white transition-colors">
							Blog
						</a>
					</li>
					<li>
						<a href="/contact" class="hover:text-white transition-colors">
							Contact
						</a>
					</li>
					<li>
						<a href="/careers" class="hover:text-white transition-colors">
							Careers
						</a>
					</li>
				</ul>
			</div>
		</div>

		<!-- Bottom -->
		<div class="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
			<p class="text-sm text-gray-400">
				© {currentYear} IgniteGigs. All rights reserved.
			</p>

			<!-- Social Links -->
			<div class="flex items-center gap-4">
				<a href="https://twitter.com/ignitegigs" target="_blank" rel="noopener" class="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
					<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
						<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
					</svg>
				</a>
				<a href="https://instagram.com/ignitegigs" target="_blank" rel="noopener" class="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
					<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
						<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
					</svg>
				</a>
				<a href="https://tiktok.com/@ignitegigs" target="_blank" rel="noopener" class="text-gray-400 hover:text-white transition-colors" aria-label="TikTok">
					<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
						<path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
					</svg>
				</a>
			</div>

			<!-- Legal -->
			<div class="flex items-center gap-4 text-sm text-gray-400">
				<a href="/privacy" class="hover:text-white transition-colors">Privacy</a>
				<a href="/terms" class="hover:text-white transition-colors">Terms</a>
				<a href="/cookies" class="hover:text-white transition-colors">Cookies</a>
			</div>
		</div>
	</div>
</footer>
