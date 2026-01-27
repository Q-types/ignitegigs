<script lang="ts">
	import { Badge } from '$lib/components/ui';

	let { data } = $props();

	// Time period selector
	let earningsTimePeriod = $state<'monthly' | 'quarterly' | 'yearly'>('monthly');
	let comparisonPeriod = $state<'month' | 'quarter'>('month');

	// Helper functions
	function formatPrice(pence: number): string {
		return `£${(pence / 100).toLocaleString('en-GB', { minimumFractionDigits: 0 })}`;
	}

	function formatTrend(value: number): string {
		const sign = value >= 0 ? '+' : '';
		return `${sign}${value.toFixed(1)}%`;
	}

	function getTrendColor(value: number): string {
		return value >= 0 ? 'text-success' : 'text-error';
	}

	function getTrendBgColor(value: number): string {
		return value >= 0 ? 'bg-success/10' : 'bg-error/10';
	}

	// Chart calculations
	function getMaxValue(values: number[]): number {
		return Math.max(...values) * 1.1; // Add 10% headroom
	}

	function getBarHeight(value: number, max: number): number {
		return (value / max) * 100;
	}

	// Earnings chart data
	const earningsMax = $derived(getMaxValue(data.monthlyData.map(m => m.earnings)));
	const bookingsMax = $derived(getMaxValue(data.monthlyData.map(m => m.bookings)));
	const viewsMax = $derived(getMaxValue(data.monthlyData.map(m => m.views)));

	// Current earnings based on selected period
	const currentEarnings = $derived(
		earningsTimePeriod === 'monthly'
			? data.coreMetrics.totalEarnings.monthly
			: earningsTimePeriod === 'quarterly'
				? data.coreMetrics.totalEarnings.quarterly
				: data.coreMetrics.totalEarnings.yearly
	);

	// Comparison metrics based on selected period
	const comparisonMetrics = $derived(
		comparisonPeriod === 'month'
			? data.comparisonData.monthOverMonth
			: data.comparisonData.quarterOverQuarter
	);

	// Priority colors for insights
	function getPriorityColor(priority: string): 'warning' | 'info' | 'success' {
		switch (priority) {
			case 'high': return 'warning';
			case 'medium': return 'info';
			default: return 'success';
		}
	}

	function getInsightIcon(icon: string): string {
		const icons: Record<string, string> = {
			video: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
			currency: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
			clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
			calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
		};
		return icons[icon] || icons.clock;
	}

	function getInsightTypeColor(type: string): string {
		switch (type) {
			case 'improvement': return 'border-l-warning';
			case 'opportunity': return 'border-l-primary';
			case 'success': return 'border-l-success';
			default: return 'border-l-gray-300';
		}
	}
</script>

<svelte:head>
	<title>Analytics - IgniteGigs Dashboard</title>
</svelte:head>

<div class="space-y-8">
	<!-- Header -->
	<div>
		<h1 class="font-display text-2xl lg:text-3xl font-bold text-secondary">Analytics</h1>
		<p class="text-gray-600 mt-1">Track your performance and discover growth opportunities</p>
	</div>

	<!-- Core Metrics Grid -->
	<div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
		<!-- Profile Views -->
		<div class="bg-white rounded-card shadow-card p-5">
			<div class="flex items-center justify-between mb-3">
				<div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
					<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
					</svg>
				</div>
				<span class="text-xs font-medium px-2 py-1 rounded-full {getTrendBgColor(data.coreMetrics.profileViews.trend)} {getTrendColor(data.coreMetrics.profileViews.trend)}">
					{formatTrend(data.coreMetrics.profileViews.trend)}
				</span>
			</div>
			<p class="text-2xl font-bold text-secondary">{data.coreMetrics.profileViews.current.toLocaleString()}</p>
			<p class="text-sm text-gray-500">Profile Views</p>
		</div>

		<!-- Inquiry Conversion -->
		<div class="bg-white rounded-card shadow-card p-5">
			<div class="flex items-center justify-between mb-3">
				<div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
					<svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
					</svg>
				</div>
				<span class="text-xs font-medium px-2 py-1 rounded-full {getTrendBgColor(data.coreMetrics.inquiryConversion.trend)} {getTrendColor(data.coreMetrics.inquiryConversion.trend)}">
					{formatTrend(data.coreMetrics.inquiryConversion.trend)}
				</span>
			</div>
			<p class="text-2xl font-bold text-secondary">{data.coreMetrics.inquiryConversion.current}%</p>
			<p class="text-sm text-gray-500">Inquiry Rate</p>
		</div>

		<!-- Booking Conversion -->
		<div class="bg-white rounded-card shadow-card p-5">
			<div class="flex items-center justify-between mb-3">
				<div class="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
					<svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<span class="text-xs font-medium px-2 py-1 rounded-full {getTrendBgColor(data.coreMetrics.bookingConversion.trend)} {getTrendColor(data.coreMetrics.bookingConversion.trend)}">
					{formatTrend(data.coreMetrics.bookingConversion.trend)}
				</span>
			</div>
			<p class="text-2xl font-bold text-secondary">{data.coreMetrics.bookingConversion.current}%</p>
			<p class="text-sm text-gray-500">Booking Rate</p>
		</div>

		<!-- Average Booking Value -->
		<div class="bg-white rounded-card shadow-card p-5">
			<div class="flex items-center justify-between mb-3">
				<div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
					<svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<span class="text-xs font-medium px-2 py-1 rounded-full {getTrendBgColor(data.coreMetrics.averageBookingValue.trend)} {getTrendColor(data.coreMetrics.averageBookingValue.trend)}">
					{formatTrend(data.coreMetrics.averageBookingValue.trend)}
				</span>
			</div>
			<p class="text-2xl font-bold text-secondary">{formatPrice(data.coreMetrics.averageBookingValue.current)}</p>
			<p class="text-sm text-gray-500">Avg. Booking</p>
		</div>

		<!-- Total Earnings -->
		<div class="bg-white rounded-card shadow-card p-5">
			<div class="flex items-center justify-between mb-3">
				<div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
					<svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
					</svg>
				</div>
				<select
					bind:value={earningsTimePeriod}
					class="text-xs border-0 bg-gray-100 rounded-md py-1 pl-2 pr-6 text-gray-600 focus:ring-1 focus:ring-primary"
				>
					<option value="monthly">Month</option>
					<option value="quarterly">Quarter</option>
					<option value="yearly">Year</option>
				</select>
			</div>
			<p class="text-2xl font-bold text-secondary">{formatPrice(currentEarnings)}</p>
			<p class="text-sm text-gray-500">Total Earnings</p>
		</div>

		<!-- Reviews -->
		<div class="bg-white rounded-card shadow-card p-5">
			<div class="flex items-center justify-between mb-3">
				<div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
					<svg class="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
						<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
					</svg>
				</div>
				<span class="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-700">
					+{data.coreMetrics.reviews.recentCount} new
				</span>
			</div>
			<div class="flex items-baseline gap-2">
				<p class="text-2xl font-bold text-secondary">{data.coreMetrics.reviews.averageScore}</p>
				<p class="text-sm text-gray-500">({data.coreMetrics.reviews.totalCount})</p>
			</div>
			<p class="text-sm text-gray-500">Review Score</p>
		</div>
	</div>

	<!-- Charts Section -->
	<div class="grid lg:grid-cols-2 gap-6">
		<!-- Earnings Trend Chart -->
		<div class="bg-white rounded-card shadow-card p-6">
			<h2 class="font-display text-lg font-semibold text-secondary mb-6">Earnings Trend</h2>
			<div class="h-64 relative">
				<!-- Y-axis labels -->
				<div class="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-gray-500">
					<span>{formatPrice(earningsMax)}</span>
					<span>{formatPrice(earningsMax * 0.75)}</span>
					<span>{formatPrice(earningsMax * 0.5)}</span>
					<span>{formatPrice(earningsMax * 0.25)}</span>
					<span>£0</span>
				</div>
				<!-- Chart area -->
				<div class="ml-14 h-full relative">
					<!-- Grid lines -->
					<div class="absolute inset-0 flex flex-col justify-between pointer-events-none" style="bottom: 32px;">
						{#each [0, 1, 2, 3, 4] as _}
							<div class="border-t border-gray-100 w-full"></div>
						{/each}
					</div>
					<!-- Area chart using SVG -->
					<svg class="w-full h-[calc(100%-32px)]" preserveAspectRatio="none" viewBox="0 0 100 100">
						<defs>
							<linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stop-color="#FF6B35" stop-opacity="0.3"/>
								<stop offset="100%" stop-color="#FF6B35" stop-opacity="0.05"/>
							</linearGradient>
						</defs>
						<!-- Area fill -->
						<path
							d={`M 0 100 ${data.monthlyData.map((m, i) => {
								const x = (i / (data.monthlyData.length - 1)) * 100;
								const y = 100 - getBarHeight(m.earnings, earningsMax);
								return `L ${x} ${y}`;
							}).join(' ')} L 100 100 Z`}
							fill="url(#earningsGradient)"
						/>
						<!-- Line -->
						<path
							d={`M ${data.monthlyData.map((m, i) => {
								const x = (i / (data.monthlyData.length - 1)) * 100;
								const y = 100 - getBarHeight(m.earnings, earningsMax);
								return `${i === 0 ? '' : 'L '}${x} ${y}`;
							}).join(' ')}`}
							fill="none"
							stroke="#FF6B35"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<!-- Data points -->
						{#each data.monthlyData as m, i}
							<circle
								cx={(i / (data.monthlyData.length - 1)) * 100}
								cy={100 - getBarHeight(m.earnings, earningsMax)}
								r="1.5"
								fill="#FF6B35"
							/>
						{/each}
					</svg>
					<!-- X-axis labels -->
					<div class="flex justify-between text-xs text-gray-500 mt-2">
						{#each data.monthlyData as m, i}
							{#if i % 2 === 0 || i === data.monthlyData.length - 1}
								<span class="w-8 text-center">{m.month}</span>
							{/if}
						{/each}
					</div>
				</div>
			</div>
		</div>

		<!-- Bookings by Month Chart -->
		<div class="bg-white rounded-card shadow-card p-6">
			<h2 class="font-display text-lg font-semibold text-secondary mb-6">Bookings by Month</h2>
			<div class="h-64 relative">
				<!-- Y-axis labels -->
				<div class="absolute left-0 top-0 bottom-8 w-8 flex flex-col justify-between text-xs text-gray-500">
					<span>{Math.ceil(bookingsMax)}</span>
					<span>{Math.ceil(bookingsMax * 0.75)}</span>
					<span>{Math.ceil(bookingsMax * 0.5)}</span>
					<span>{Math.ceil(bookingsMax * 0.25)}</span>
					<span>0</span>
				</div>
				<!-- Chart area -->
				<div class="ml-10 h-full relative">
					<!-- Grid lines -->
					<div class="absolute inset-0 flex flex-col justify-between pointer-events-none" style="bottom: 32px;">
						{#each [0, 1, 2, 3, 4] as _}
							<div class="border-t border-gray-100 w-full"></div>
						{/each}
					</div>
					<!-- Bar chart -->
					<div class="flex items-end justify-between h-[calc(100%-32px)] gap-1 px-1">
						{#each data.monthlyData as m, i}
							<div class="flex-1 flex flex-col items-center group relative">
								<!-- Tooltip -->
								<div class="absolute bottom-full mb-2 bg-secondary text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
									{m.bookings} bookings
								</div>
								<!-- Bar -->
								<div
									class="w-full rounded-t-sm transition-all duration-300 group-hover:opacity-80"
									style="height: {getBarHeight(m.bookings, bookingsMax)}%; background: linear-gradient(to top, #10B981, #34D399);"
								></div>
							</div>
						{/each}
					</div>
					<!-- X-axis labels -->
					<div class="flex justify-between text-xs text-gray-500 mt-2">
						{#each data.monthlyData as m}
							<span class="flex-1 text-center text-[10px]">{m.month}</span>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<!-- Profile Views Trend -->
		<div class="bg-white rounded-card shadow-card p-6 lg:col-span-2">
			<h2 class="font-display text-lg font-semibold text-secondary mb-6">Profile Views & Inquiries</h2>
			<div class="h-48 relative">
				<!-- Y-axis labels -->
				<div class="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-gray-500">
					<span>{Math.ceil(viewsMax)}</span>
					<span>{Math.ceil(viewsMax * 0.5)}</span>
					<span>0</span>
				</div>
				<!-- Chart area -->
				<div class="ml-14 h-full relative">
					<!-- Grid lines -->
					<div class="absolute inset-0 flex flex-col justify-between pointer-events-none" style="bottom: 32px;">
						{#each [0, 1, 2] as _}
							<div class="border-t border-gray-100 w-full"></div>
						{/each}
					</div>
					<!-- Combined chart using SVG -->
					<svg class="w-full h-[calc(100%-32px)]" preserveAspectRatio="none" viewBox="0 0 100 100">
						<defs>
							<linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stop-color="#3B82F6" stop-opacity="0.2"/>
								<stop offset="100%" stop-color="#3B82F6" stop-opacity="0.02"/>
							</linearGradient>
						</defs>
						<!-- Views area -->
						<path
							d={`M 0 100 ${data.monthlyData.map((m, i) => {
								const x = (i / (data.monthlyData.length - 1)) * 100;
								const y = 100 - getBarHeight(m.views, viewsMax);
								return `L ${x} ${y}`;
							}).join(' ')} L 100 100 Z`}
							fill="url(#viewsGradient)"
						/>
						<!-- Views line -->
						<path
							d={`M ${data.monthlyData.map((m, i) => {
								const x = (i / (data.monthlyData.length - 1)) * 100;
								const y = 100 - getBarHeight(m.views, viewsMax);
								return `${i === 0 ? '' : 'L '}${x} ${y}`;
							}).join(' ')}`}
							fill="none"
							stroke="#3B82F6"
							stroke-width="2"
							stroke-linecap="round"
						/>
						<!-- Inquiries line -->
						<path
							d={`M ${data.monthlyData.map((m, i) => {
								const x = (i / (data.monthlyData.length - 1)) * 100;
								const y = 100 - getBarHeight(m.inquiries, viewsMax);
								return `${i === 0 ? '' : 'L '}${x} ${y}`;
							}).join(' ')}`}
							fill="none"
							stroke="#8B5CF6"
							stroke-width="2"
							stroke-linecap="round"
							stroke-dasharray="4 2"
						/>
					</svg>
					<!-- X-axis labels -->
					<div class="flex justify-between text-xs text-gray-500 mt-2">
						{#each data.monthlyData as m, i}
							{#if i % 2 === 0 || i === data.monthlyData.length - 1}
								<span>{m.month}</span>
							{/if}
						{/each}
					</div>
				</div>
			</div>
			<!-- Legend -->
			<div class="flex items-center justify-center gap-6 mt-4">
				<div class="flex items-center gap-2">
					<div class="w-4 h-0.5 bg-blue-500 rounded"></div>
					<span class="text-sm text-gray-600">Profile Views</span>
				</div>
				<div class="flex items-center gap-2">
					<div class="w-4 h-0.5 bg-purple-500 rounded" style="background: repeating-linear-gradient(90deg, #8B5CF6 0, #8B5CF6 4px, transparent 4px, transparent 6px);"></div>
					<span class="text-sm text-gray-600">Inquiries</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Market Insights Section -->
	<div class="bg-white rounded-card shadow-card p-6">
		<h2 class="font-display text-lg font-semibold text-secondary mb-6">Market Insights</h2>
		<div class="grid md:grid-cols-3 gap-6">
			<!-- Pricing Comparison -->
			<div class="space-y-4">
				<h3 class="font-medium text-gray-900">Your Pricing Position</h3>
				<div class="relative pt-1">
					<div class="flex items-center justify-between text-sm mb-2">
						<span class="text-gray-500">Market Range</span>
						<span class="font-medium text-primary">{data.marketInsights.pricingPercentile}th percentile</span>
					</div>
					<div class="h-3 bg-gray-200 rounded-full overflow-hidden">
						<div
							class="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary transition-all duration-500"
							style="width: {data.marketInsights.pricingPercentile}%"
						></div>
					</div>
					<div class="flex justify-between text-xs text-gray-500 mt-1">
						<span>Lower</span>
						<span>Average</span>
						<span>Higher</span>
					</div>
				</div>
				<div class="bg-gray-50 rounded-lg p-3">
					<div class="flex justify-between text-sm">
						<span class="text-gray-600">Your rate:</span>
						<span class="font-medium text-secondary">{formatPrice(data.marketInsights.yourAverageRate)}</span>
					</div>
					<div class="flex justify-between text-sm mt-1">
						<span class="text-gray-600">Market avg:</span>
						<span class="text-gray-700">{formatPrice(data.marketInsights.averageMarketRate)}</span>
					</div>
				</div>
			</div>

			<!-- Demand Seasonality -->
			<div class="space-y-4">
				<h3 class="font-medium text-gray-900">Demand in Your Area</h3>
				<div class="h-24 flex items-end gap-0.5">
					{#each data.marketInsights.demandTrend as month}
						<div class="flex-1 flex flex-col items-center group">
							<div
								class="w-full rounded-t-sm transition-all"
								style="height: {month.demand}%; background: linear-gradient(to top, {month.demand > 80 ? '#10B981' : month.demand > 50 ? '#F59E0B' : '#9CA3AF'}, {month.demand > 80 ? '#34D399' : month.demand > 50 ? '#FCD34D' : '#D1D5DB'});"
							></div>
						</div>
					{/each}
				</div>
				<div class="flex justify-between text-[10px] text-gray-500">
					{#each data.marketInsights.demandTrend as month}
						<span>{month.month[0]}</span>
					{/each}
				</div>
				<p class="text-xs text-gray-500">Peak season: June-August</p>
			</div>

			<!-- Popular Event Types -->
			<div class="space-y-4">
				<h3 class="font-medium text-gray-900">Your Event Types</h3>
				<div class="space-y-3">
					{#each data.marketInsights.popularEventTypes as eventType}
						<div class="space-y-1">
							<div class="flex justify-between text-sm">
								<span class="text-gray-700">{eventType.type}</span>
								<span class="text-gray-500">{eventType.count} ({eventType.percentage}%)</span>
							</div>
							<div class="h-2 bg-gray-100 rounded-full overflow-hidden">
								<div
									class="h-full rounded-full bg-gradient-to-r from-primary to-primary-hover transition-all duration-500"
									style="width: {eventType.percentage}%"
								></div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- Correlation Analysis Section -->
	<div class="bg-white rounded-card shadow-card p-6">
		<h2 class="font-display text-lg font-semibold text-secondary mb-6">What Drives Your Success</h2>
		<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
			<!-- Reviews Impact -->
			<div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-100">
				<div class="flex items-center gap-2 mb-3">
					<svg class="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
						<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
					</svg>
					<span class="font-medium text-amber-900">Reviews</span>
				</div>
				<p class="text-sm text-amber-800 mb-2">{data.correlationAnalysis.reviewsImpact.insight}</p>
				<div class="flex items-center gap-1">
					<span class="text-xs text-amber-600">Correlation:</span>
					<div class="flex-1 h-1.5 bg-amber-200 rounded-full">
						<div class="h-full bg-amber-500 rounded-full" style="width: {data.correlationAnalysis.reviewsImpact.correlation * 100}%"></div>
					</div>
					<span class="text-xs font-medium text-amber-700">Strong</span>
				</div>
			</div>

			<!-- Profile Completeness -->
			<div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
				<div class="flex items-center gap-2 mb-3">
					<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
					</svg>
					<span class="font-medium text-blue-900">Profile</span>
				</div>
				<p class="text-sm text-blue-800 mb-2">{data.correlationAnalysis.profileCompleteness.insight}</p>
				<div class="flex items-center justify-between">
					<span class="text-xs text-blue-600">Your profile:</span>
					<Badge variant="info">{data.correlationAnalysis.profileCompleteness.yourCompleteness}%</Badge>
				</div>
			</div>

			<!-- Price Point -->
			<div class="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-100">
				<div class="flex items-center gap-2 mb-3">
					<svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<span class="font-medium text-emerald-900">Pricing</span>
				</div>
				<p class="text-sm text-emerald-800 mb-2">{data.correlationAnalysis.priceVsFrequency.insight}</p>
				<div class="text-xs text-emerald-600">
					Optimal: {formatPrice(data.correlationAnalysis.priceVsFrequency.optimalRange.min)} - {formatPrice(data.correlationAnalysis.priceVsFrequency.optimalRange.max)}
				</div>
			</div>

			<!-- Media Impact -->
			<div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
				<div class="flex items-center gap-2 mb-3">
					<svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
					</svg>
					<span class="font-medium text-purple-900">Media</span>
				</div>
				<p class="text-sm text-purple-800 mb-2">{data.correlationAnalysis.mediaImpact.insight}</p>
				<div class="text-xs text-purple-600">
					Last upload: {data.correlationAnalysis.mediaImpact.lastUpload}
				</div>
			</div>
		</div>
	</div>

	<!-- Actionable Insights Panel -->
	<div class="bg-gradient-to-br from-secondary to-secondary-light rounded-card p-6 text-white">
		<div class="flex items-center gap-3 mb-6">
			<div class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
				</svg>
			</div>
			<div>
				<h2 class="font-display text-lg font-semibold">Smart Insights</h2>
				<p class="text-white/70 text-sm">AI-powered recommendations to grow your business</p>
			</div>
		</div>
		<div class="grid md:grid-cols-2 gap-4">
			{#each data.actionableInsights as insight}
				<div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border-l-4 {getInsightTypeColor(insight.type)}">
					<div class="flex items-start gap-3">
						<div class="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={getInsightIcon(insight.icon)} />
							</svg>
						</div>
						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-2 mb-1">
								<h3 class="font-medium text-sm">{insight.title}</h3>
								{#if insight.priority === 'high'}
									<span class="text-[10px] px-1.5 py-0.5 bg-warning/20 text-warning rounded">Priority</span>
								{/if}
							</div>
							<p class="text-white/70 text-xs leading-relaxed">{insight.description}</p>
							{#if insight.action}
								<a
									href={insight.action.href}
									class="inline-flex items-center gap-1 text-xs text-primary-light hover:text-white mt-2 transition-colors"
								>
									{insight.action.label}
									<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
									</svg>
								</a>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Comparison Tools Section -->
	<div class="grid lg:grid-cols-2 gap-6">
		<!-- Period Comparison -->
		<div class="bg-white rounded-card shadow-card p-6">
			<div class="flex items-center justify-between mb-6">
				<h2 class="font-display text-lg font-semibold text-secondary">Compare Your Performance</h2>
				<select
					bind:value={comparisonPeriod}
					class="text-sm border border-gray-200 rounded-lg py-1.5 pl-3 pr-8 text-gray-700 focus:ring-2 focus:ring-primary focus:border-primary"
				>
					<option value="month">Month vs Month</option>
					<option value="quarter">Quarter vs Quarter</option>
				</select>
			</div>

			<div class="space-y-4">
				<!-- Earnings comparison -->
				<div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
							<svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<div>
							<p class="text-sm text-gray-500">Earnings</p>
							<div class="flex items-center gap-3">
								<span class="font-semibold text-secondary">{formatPrice(comparisonMetrics.earnings.current)}</span>
								<span class="text-gray-400">vs</span>
								<span class="text-gray-600">{formatPrice(comparisonMetrics.earnings.previous)}</span>
							</div>
						</div>
					</div>
					<span class="text-sm font-medium px-2.5 py-1 rounded-full {getTrendBgColor(comparisonMetrics.earnings.change)} {getTrendColor(comparisonMetrics.earnings.change)}">
						{formatTrend(comparisonMetrics.earnings.change)}
					</span>
				</div>

				<!-- Bookings comparison -->
				<div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
							<svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
						</div>
						<div>
							<p class="text-sm text-gray-500">Bookings</p>
							<div class="flex items-center gap-3">
								<span class="font-semibold text-secondary">{comparisonMetrics.bookings.current}</span>
								<span class="text-gray-400">vs</span>
								<span class="text-gray-600">{comparisonMetrics.bookings.previous}</span>
							</div>
						</div>
					</div>
					<span class="text-sm font-medium px-2.5 py-1 rounded-full {getTrendBgColor(comparisonMetrics.bookings.change)} {getTrendColor(comparisonMetrics.bookings.change)}">
						{formatTrend(comparisonMetrics.bookings.change)}
					</span>
				</div>

				{#if comparisonPeriod === 'month'}
					<!-- Views comparison (only for month view) -->
					{@const monthViews = data.comparisonData.monthOverMonth.views}
					<div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
						<div class="flex items-center gap-3">
							<div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
								<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
								</svg>
							</div>
							<div>
								<p class="text-sm text-gray-500">Profile Views</p>
								<div class="flex items-center gap-3">
									<span class="font-semibold text-secondary">{monthViews.current}</span>
									<span class="text-gray-400">vs</span>
									<span class="text-gray-600">{monthViews.previous}</span>
								</div>
							</div>
						</div>
						<span class="text-sm font-medium px-2.5 py-1 rounded-full {getTrendBgColor(monthViews.change)} {getTrendColor(monthViews.change)}">
							{formatTrend(monthViews.change)}
						</span>
					</div>
				{/if}
			</div>
		</div>

		<!-- Percentile Rankings -->
		<div class="bg-white rounded-card shadow-card p-6">
			<h2 class="font-display text-lg font-semibold text-secondary mb-2">How You Rank</h2>
			<p class="text-sm text-gray-500 mb-6">Compared to performers in your category (anonymized)</p>

			<div class="space-y-5">
				{#each Object.entries(data.comparisonData.percentileRankings) as [metric, percentile]}
					{@const labels = {
						earnings: 'Earnings',
						bookings: 'Bookings',
						reviews: 'Review Score',
						responseTime: 'Response Time',
						conversionRate: 'Conversion Rate'
					}}
					{@const colors = {
						earnings: { bar: 'bg-primary', text: 'text-primary' },
						bookings: { bar: 'bg-success', text: 'text-success' },
						reviews: { bar: 'bg-amber-500', text: 'text-amber-600' },
						responseTime: { bar: 'bg-blue-500', text: 'text-blue-600' },
						conversionRate: { bar: 'bg-purple-500', text: 'text-purple-600' }
					}}
					<div>
						<div class="flex items-center justify-between mb-1.5">
							<span class="text-sm text-gray-700">{labels[metric as keyof typeof labels]}</span>
							<span class="text-sm font-medium {colors[metric as keyof typeof colors].text}">
								Top {100 - percentile}%
							</span>
						</div>
						<div class="h-2.5 bg-gray-100 rounded-full overflow-hidden">
							<div
								class="h-full rounded-full {colors[metric as keyof typeof colors].bar} transition-all duration-700"
								style="width: {percentile}%"
							></div>
						</div>
					</div>
				{/each}
			</div>

			<div class="mt-6 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
				<div class="flex items-center gap-2">
					<svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
					</svg>
					<span class="text-sm font-medium text-secondary">You're in the top 28% of performers overall!</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Quick Actions -->
	<div class="bg-white rounded-card shadow-card p-6">
		<h2 class="font-display text-lg font-semibold text-secondary mb-4">Improve Your Metrics</h2>
		<div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
			<a href="/dashboard/profile" class="p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors text-center group">
				<div class="w-12 h-12 bg-gray-100 group-hover:bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors">
					<svg class="w-6 h-6 text-gray-500 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
					</svg>
				</div>
				<span class="text-sm font-medium text-gray-900">Complete Profile</span>
				<p class="text-xs text-gray-500 mt-1">+35% conversions</p>
			</a>
			<a href="/dashboard/media" class="p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors text-center group">
				<div class="w-12 h-12 bg-gray-100 group-hover:bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors">
					<svg class="w-6 h-6 text-gray-500 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
					</svg>
				</div>
				<span class="text-sm font-medium text-gray-900">Add Videos</span>
				<p class="text-xs text-gray-500 mt-1">+28% views</p>
			</a>
			<a href="/dashboard/calendar" class="p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors text-center group">
				<div class="w-12 h-12 bg-gray-100 group-hover:bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors">
					<svg class="w-6 h-6 text-gray-500 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
					</svg>
				</div>
				<span class="text-sm font-medium text-gray-900">Update Calendar</span>
				<p class="text-xs text-gray-500 mt-1">Don't miss bookings</p>
			</a>
			<a href="/dashboard/bookings" class="p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors text-center group">
				<div class="w-12 h-12 bg-gray-100 group-hover:bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors">
					<svg class="w-6 h-6 text-gray-500 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<span class="text-sm font-medium text-gray-900">Quick Responses</span>
				<p class="text-xs text-gray-500 mt-1">+30% bookings</p>
			</a>
		</div>
	</div>
</div>

<style>
	/* Custom scrollbar for charts */
	:global(.chart-scroll) {
		scrollbar-width: thin;
		scrollbar-color: #e5e7eb transparent;
	}

	:global(.chart-scroll::-webkit-scrollbar) {
		height: 4px;
	}

	:global(.chart-scroll::-webkit-scrollbar-track) {
		background: transparent;
	}

	:global(.chart-scroll::-webkit-scrollbar-thumb) {
		background-color: #e5e7eb;
		border-radius: 2px;
	}
</style>
