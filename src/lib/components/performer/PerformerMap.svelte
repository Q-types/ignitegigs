<script lang="ts">
	import { onMount } from 'svelte';
	import type { PerformerProfile, PerformerMedia } from '$types/database';

	type PerformerMapItem = PerformerProfile & {
		primary_media?: PerformerMedia | null;
		user?: { full_name: string; avatar_url: string | null } | null;
	};

	interface Props {
		performers: PerformerMapItem[];
	}

	let { performers }: Props = $props();

	let mapContainer: HTMLDivElement | undefined = $state(undefined);
	let map: any = $state(null);
	let markersLayer: any = $state(null);
	let leaflet: any = $state(null);
	let mapReady = $state(false);

	// Filter performers to only those with valid lat/lng
	let mappablePerformers = $derived(
		performers.filter(
			(p) => p.location_lat != null && p.location_lng != null
		)
	);

	// Format price from pence to pounds
	function formatPrice(pence: number | null): string {
		if (!pence) return 'POA';
		return `\u00A3${(pence / 100).toFixed(0)}`;
	}

	// Get primary category label
	function getCategoryLabel(categories: string[]): string {
		if (!categories || categories.length === 0) return 'Performer';
		if (categories.includes('fire') && categories.includes('led')) return 'Fire & LED';
		if (categories.includes('fire')) return 'Fire';
		if (categories.includes('led')) return 'LED';
		if (categories.includes('circus')) return 'Circus';
		if (categories.includes('aerial')) return 'Aerial';
		if (categories.includes('dance')) return 'Dance';
		if (categories.includes('juggling')) return 'Juggling';
		if (categories.includes('acrobatics')) return 'Acrobatics';
		if (categories.includes('magic')) return 'Magic';
		if (categories.includes('comedy')) return 'Comedy';
		if (categories.includes('walkabout')) return 'Walkabout';
		if (categories.includes('caricature')) return 'Caricature';
		if (categories.includes('stilt')) return 'Stilt Walking';
		return 'Performer';
	}

	// Get category badge color
	function getCategoryColor(categories: string[]): string {
		if (!categories || categories.length === 0) return '#6B7280';
		if (categories.includes('fire')) return '#F97316';
		if (categories.includes('led')) return '#A855F7';
		if (categories.includes('circus')) return '#EF4444';
		if (categories.includes('aerial')) return '#3B82F6';
		if (categories.includes('dance')) return '#EC4899';
		return '#FF6B35';
	}

	// Create a custom marker icon using SVG
	function createMarkerIcon(L: any, categories: string[]): any {
		const color = getCategoryColor(categories);
		const svgHtml = `
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 44" width="32" height="44">
				<path d="M16 0C7.2 0 0 7.2 0 16c0 12 16 28 16 28s16-16 16-28C32 7.2 24.8 0 16 0z" fill="${color}" stroke="#fff" stroke-width="2"/>
				<circle cx="16" cy="15" r="7" fill="#fff"/>
				<path d="M16 10c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z" fill="${color}"/>
			</svg>
		`;
		return L.divIcon({
			html: svgHtml,
			className: 'performer-marker-icon',
			iconSize: [32, 44],
			iconAnchor: [16, 44],
			popupAnchor: [0, -40]
		});
	}

	// Build popup HTML for a performer
	function buildPopupContent(performer: PerformerMapItem): string {
		const name = performer.stage_name || performer.user?.full_name || 'Performer';
		const category = getCategoryLabel(performer.performer_category || []);
		const price = formatPrice(performer.min_rate_pence);
		const rating = performer.avg_rating > 0
			? `<div class="flex items-center gap-1 mt-1">
				<svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" style="color: #EAB308; width: 14px; height: 14px;">
					<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
				</svg>
				<span style="font-weight: 600; font-size: 13px;">${performer.avg_rating.toFixed(1)}</span>
				<span style="color: #6B7280; font-size: 12px;">(${performer.total_reviews})</span>
			</div>`
			: '<div style="color: #9CA3AF; font-size: 12px; margin-top: 4px;">New performer</div>';

		const thumbnailUrl = performer.primary_media?.thumbnail_url || performer.primary_media?.url;
		const imageHtml = thumbnailUrl
			? `<div style="width: 100%; height: 100px; overflow: hidden; border-radius: 8px 8px 0 0; margin: -12px -12px 8px -12px; width: calc(100% + 24px);">
				<img src="${thumbnailUrl}" alt="${name}" style="width: 100%; height: 100%; object-fit: cover;" />
			</div>`
			: '';

		return `
			<div style="min-width: 200px; font-family: 'Inter', system-ui, sans-serif;">
				${imageHtml}
				<div style="font-weight: 700; font-size: 15px; font-family: 'Sora', sans-serif; color: #111827;">
					${name}
				</div>
				<div style="display: inline-block; padding: 2px 8px; border-radius: 12px; background: ${getCategoryColor(performer.performer_category || [])}20; color: ${getCategoryColor(performer.performer_category || [])}; font-size: 11px; font-weight: 600; margin-top: 4px;">
					${category}
				</div>
				${rating}
				<div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; padding-top: 8px; border-top: 1px solid #F3F4F6;">
					<span style="color: #6B7280; font-size: 12px;">From</span>
					<span style="font-weight: 700; font-size: 15px; color: #FF6B35; font-family: 'Sora', sans-serif;">${price}</span>
				</div>
				<a href="/performers/${performer.id}"
					style="display: block; text-align: center; background: #FF6B35; color: white; padding: 6px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; text-decoration: none; margin-top: 8px; transition: background 0.2s;"
					onmouseover="this.style.background='#E55A2B'"
					onmouseout="this.style.background='#FF6B35'"
				>
					View Profile
				</a>
			</div>
		`;
	}

	// Update markers when performers change
	$effect(() => {
		if (!mapReady || !leaflet || !map || !markersLayer) return;

		// Clear existing markers
		markersLayer.clearLayers();

		// Add new markers
		for (const performer of mappablePerformers) {
			const icon = createMarkerIcon(leaflet, performer.performer_category || []);
			const marker = leaflet.marker(
				[performer.location_lat, performer.location_lng],
				{ icon }
			);
			marker.bindPopup(buildPopupContent(performer), {
				maxWidth: 260,
				className: 'performer-popup'
			});
			markersLayer.addLayer(marker);
		}

		// Fit bounds if we have markers
		if (mappablePerformers.length > 0) {
			const bounds = markersLayer.getBounds();
			if (bounds.isValid()) {
				map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
			}
		}
	});

	onMount(async () => {
		const L = await import('leaflet');
		await import('leaflet/dist/leaflet.css');
		leaflet = L.default || L;

		if (!mapContainer) return;

		// Initialize the map centered on UK
		map = leaflet.map(mapContainer, {
			center: [54.5, -2],
			zoom: 6,
			scrollWheelZoom: true,
			zoomControl: true
		});

		// Add OpenStreetMap tiles
		leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			maxZoom: 19
		}).addTo(map);

		// Create a layer group for markers
		markersLayer = leaflet.layerGroup().addTo(map);

		mapReady = true;

		return () => {
			if (map) {
				map.remove();
				map = null;
			}
		};
	});
</script>

<div class="performer-map-wrapper relative w-full rounded-xl overflow-hidden shadow-lg border border-gray-200">
	{#if mappablePerformers.length === 0 && performers.length > 0}
		<!-- Performers exist but none have location data -->
		<div class="absolute inset-0 z-10 flex items-center justify-center bg-gray-50/90 pointer-events-none">
			<div class="text-center px-4">
				<svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
						d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
						d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
				</svg>
				<p class="text-gray-600 font-medium">No location data available</p>
				<p class="text-gray-400 text-sm mt-1">Performers in this search don't have map coordinates set.</p>
			</div>
		</div>
	{/if}

	{#if performers.length === 0}
		<div class="flex items-center justify-center bg-gray-50 h-[400px] lg:h-[500px]">
			<div class="text-center px-4">
				<svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
				<p class="text-gray-600 font-medium">No performers found</p>
				<p class="text-gray-400 text-sm mt-1">Try adjusting your filters to see results on the map.</p>
			</div>
		</div>
	{:else}
		<div
			bind:this={mapContainer}
			class="w-full h-[400px] lg:h-[500px]"
		></div>
	{/if}

	<!-- Map performer count badge -->
	{#if mappablePerformers.length > 0}
		<div class="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-md border border-gray-200">
			<span class="text-sm font-semibold text-secondary">
				{mappablePerformers.length}
			</span>
			<span class="text-sm text-gray-500">
				{mappablePerformers.length === 1 ? 'performer' : 'performers'} on map
			</span>
		</div>
	{/if}
</div>

<style>
	:global(.performer-marker-icon) {
		background: none !important;
		border: none !important;
	}

	:global(.performer-popup .leaflet-popup-content-wrapper) {
		border-radius: 12px;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
		padding: 0;
	}

	:global(.performer-popup .leaflet-popup-content) {
		margin: 12px;
	}

	:global(.performer-popup .leaflet-popup-tip) {
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	:global(.leaflet-control-zoom a) {
		color: #1E1E2E !important;
		border-color: #E5E7EB !important;
	}

	:global(.leaflet-control-zoom a:hover) {
		background-color: #F9FAFB !important;
	}
</style>
