import type { PageServerLoad } from './$types';

interface PerformerProfile {
	id: string;
	stage_name?: string;
	[key: string]: unknown;
}

export const load: PageServerLoad = async ({ parent }) => {
	const parentData = await parent();
	const performerProfile = parentData.performerProfile as PerformerProfile | null;

	// Mock data - in production, this would come from analytics tables/aggregations
	// All monetary values in pence for consistency with the rest of the app

	const currentDate = new Date();
	const currentMonth = currentDate.getMonth();
	const currentYear = currentDate.getFullYear();

	// Generate mock monthly data for the past 12 months
	const monthlyData = Array.from({ length: 12 }, (_, i) => {
		const date = new Date(currentYear, currentMonth - 11 + i, 1);
		const monthName = date.toLocaleDateString('en-GB', { month: 'short' });
		const baseEarnings = 150000 + Math.floor(Math.random() * 100000); // £1500-2500
		const baseBookings = 3 + Math.floor(Math.random() * 5);
		const baseViews = 200 + Math.floor(Math.random() * 300);

		// Add seasonal variation (summer months busier)
		const seasonalMultiplier = [1.2, 1.3, 1.1, 1.0, 1.4, 1.6, 1.8, 1.7, 1.3, 1.0, 0.9, 1.5][date.getMonth()];

		return {
			month: monthName,
			year: date.getFullYear(),
			earnings: Math.floor(baseEarnings * seasonalMultiplier),
			bookings: Math.floor(baseBookings * seasonalMultiplier),
			views: Math.floor(baseViews * seasonalMultiplier),
			inquiries: Math.floor((baseViews * seasonalMultiplier) * 0.15), // 15% inquiry rate
		};
	});

	// Calculate current month vs previous month
	const thisMonth = monthlyData[11];
	const lastMonth = monthlyData[10];
	const thisQuarter = monthlyData.slice(9, 12);
	const lastQuarter = monthlyData.slice(6, 9);

	// Core metrics
	const coreMetrics = {
		profileViews: {
			current: thisMonth.views,
			previous: lastMonth.views,
			trend: ((thisMonth.views - lastMonth.views) / lastMonth.views) * 100
		},
		inquiryConversion: {
			current: 15.2, // percentage
			previous: 12.8,
			trend: 18.75 // % improvement
		},
		bookingConversion: {
			current: 42.5, // percentage of inquiries that become bookings
			previous: 38.2,
			trend: 11.26
		},
		averageBookingValue: {
			current: 45000, // £450
			previous: 42000,
			trend: 7.14
		},
		totalEarnings: {
			monthly: thisMonth.earnings,
			quarterly: thisQuarter.reduce((sum, m) => sum + m.earnings, 0),
			yearly: monthlyData.reduce((sum, m) => sum + m.earnings, 0),
			previousMonthly: lastMonth.earnings,
			previousQuarterly: lastQuarter.reduce((sum, m) => sum + m.earnings, 0)
		},
		reviews: {
			averageScore: 4.8,
			totalCount: 47,
			recentCount: 8, // last 30 days
			trend: 0.2 // score improvement
		}
	};

	// Market insights
	const marketInsights = {
		pricingPercentile: 65, // You're in the 65th percentile (charge more than 65% of similar performers)
		averageMarketRate: 40000, // £400
		yourAverageRate: 45000, // £450
		demandTrend: [
			{ month: 'Jan', demand: 60 },
			{ month: 'Feb', demand: 55 },
			{ month: 'Mar', demand: 70 },
			{ month: 'Apr', demand: 75 },
			{ month: 'May', demand: 90 },
			{ month: 'Jun', demand: 100 },
			{ month: 'Jul', demand: 95 },
			{ month: 'Aug', demand: 85 },
			{ month: 'Sep', demand: 70 },
			{ month: 'Oct', demand: 65 },
			{ month: 'Nov', demand: 60 },
			{ month: 'Dec', demand: 85 }
		],
		popularEventTypes: [
			{ type: 'Wedding', percentage: 35, count: 12 },
			{ type: 'Corporate', percentage: 25, count: 8 },
			{ type: 'Birthday', percentage: 20, count: 7 },
			{ type: 'Festival', percentage: 12, count: 4 },
			{ type: 'Other', percentage: 8, count: 3 }
		]
	};

	// Correlation analysis
	const correlationAnalysis = {
		reviewsImpact: {
			description: 'Impact of reviews on booking rate',
			correlation: 0.78, // strong positive
			insight: 'Each 0.5 star increase correlates with 23% more bookings'
		},
		profileCompleteness: {
			description: 'Profile completeness vs conversion',
			yourCompleteness: 85,
			conversionDifference: 35, // % higher conversion than incomplete profiles
			insight: 'Complete profiles convert 35% better'
		},
		priceVsFrequency: {
			description: 'Your price point vs booking frequency',
			optimalRange: { min: 35000, max: 55000 }, // £350-550
			yourAverage: 45000,
			insight: 'Your pricing is in the optimal range for your market'
		},
		mediaImpact: {
			description: 'New media uploads vs profile views',
			viewsIncreasePerUpload: 28, // percentage
			lastUpload: '2 weeks ago',
			insight: 'Profiles with videos added in last 30 days get 45% more views'
		}
	};

	// Actionable insights (AI-generated tips)
	const actionableInsights = [
		{
			id: 1,
			type: 'improvement',
			priority: 'high',
			icon: 'video',
			title: 'Update your profile video',
			description: 'Your conversion rate could improve by up to 15% with a fresh video. Profiles updated in the last 30 days convert 28% better.',
			action: { label: 'Upload Video', href: '/dashboard/media' }
		},
		{
			id: 2,
			type: 'opportunity',
			priority: 'medium',
			icon: 'currency',
			title: 'Consider adjusting your rates',
			description: 'Performers in your area charge 10% more on average. Based on your reviews (4.8 stars), you could increase rates without impacting bookings.',
			action: { label: 'Edit Pricing', href: '/dashboard/profile' }
		},
		{
			id: 3,
			type: 'success',
			priority: 'low',
			icon: 'clock',
			title: 'Great response time!',
			description: 'Your bookings increase 30% when you respond within 2 hours. Your average response time is 1.5 hours - keep it up!',
			action: null
		},
		{
			id: 4,
			type: 'improvement',
			priority: 'medium',
			icon: 'calendar',
			title: 'Peak season approaching',
			description: 'Wedding season (May-July) sees 60% more inquiries. Make sure your calendar is updated for maximum bookings.',
			action: { label: 'Update Availability', href: '/dashboard/calendar' }
		}
	];

	// Comparison data
	const comparisonData = {
		monthOverMonth: {
			earnings: {
				current: thisMonth.earnings,
				previous: lastMonth.earnings,
				change: ((thisMonth.earnings - lastMonth.earnings) / lastMonth.earnings) * 100
			},
			bookings: {
				current: thisMonth.bookings,
				previous: lastMonth.bookings,
				change: ((thisMonth.bookings - lastMonth.bookings) / lastMonth.bookings) * 100
			},
			views: {
				current: thisMonth.views,
				previous: lastMonth.views,
				change: ((thisMonth.views - lastMonth.views) / lastMonth.views) * 100
			}
		},
		quarterOverQuarter: {
			earnings: {
				current: thisQuarter.reduce((sum, m) => sum + m.earnings, 0),
				previous: lastQuarter.reduce((sum, m) => sum + m.earnings, 0),
				change: 0 // will calculate
			},
			bookings: {
				current: thisQuarter.reduce((sum, m) => sum + m.bookings, 0),
				previous: lastQuarter.reduce((sum, m) => sum + m.bookings, 0),
				change: 0
			}
		},
		percentileRankings: {
			earnings: 72, // Top 28%
			bookings: 68, // Top 32%
			reviews: 85, // Top 15%
			responseTime: 78, // Top 22%
			conversionRate: 65 // Top 35%
		}
	};

	// Calculate quarter changes
	comparisonData.quarterOverQuarter.earnings.change =
		((comparisonData.quarterOverQuarter.earnings.current - comparisonData.quarterOverQuarter.earnings.previous) /
		comparisonData.quarterOverQuarter.earnings.previous) * 100;
	comparisonData.quarterOverQuarter.bookings.change =
		((comparisonData.quarterOverQuarter.bookings.current - comparisonData.quarterOverQuarter.bookings.previous) /
		comparisonData.quarterOverQuarter.bookings.previous) * 100;

	return {
		performerName: performerProfile?.stage_name || 'Performer',
		monthlyData,
		coreMetrics,
		marketInsights,
		correlationAnalysis,
		actionableInsights,
		comparisonData
	};
};
