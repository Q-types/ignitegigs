interface GeocodingResult {
	lat: number;
	lng: number;
	displayName: string;
}

/**
 * Geocode an address using the free OpenStreetMap Nominatim API.
 * No API key required. Rate limit: 1 request/second (fine for profile saves).
 * See: https://nominatim.org/release-docs/latest/api/Search/
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
	if (!address || !address.trim()) {
		return null;
	}

	try {
		const encodedAddress = encodeURIComponent(address.trim());
		const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1&countrycodes=gb`;

		const response = await fetch(url, {
			headers: {
				'User-Agent': 'IgniteGigs/1.0',
				'Accept': 'application/json'
			}
		});

		if (!response.ok) {
			console.warn(`Geocoding request failed with status ${response.status} for address: "${address}"`);
			return null;
		}

		const results = await response.json();

		if (!Array.isArray(results) || results.length === 0) {
			console.warn(`Geocoding returned no results for address: "${address}"`);
			return null;
		}

		const first = results[0];
		const lat = parseFloat(first.lat);
		const lng = parseFloat(first.lon);

		if (isNaN(lat) || isNaN(lng)) {
			console.warn(`Geocoding returned invalid coordinates for address: "${address}"`);
			return null;
		}

		return {
			lat,
			lng,
			displayName: first.display_name ?? address
		};
	} catch (error) {
		console.error('Geocoding error:', error instanceof Error ? error.message : error);
		return null;
	}
}
