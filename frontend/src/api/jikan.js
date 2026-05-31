import axios from "axios";

const BASE = "https://api.jikan.moe/v4";
const CACHE_PREFIX = "jikan_cache_";
const SHORT_CACHE_MS = 5 * 60 * 1000;    // 5 minutes for search queries
const DEFAULT_CACHE_MS = 30 * 60 * 1000; // 30 minutes for listings/schedules
const LONG_CACHE_MS = 60 * 60 * 1000;    // 1 hour for static details

// Delay helper
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Network Fetcher with Backoff Retries for 429 rate limit handling
const fetchWithRetry = async (url, retries = 3, initialDelayMs = 1200) => {
	for (let i = 0; i < retries; i++) {
		try {
			const res = await axios.get(url);
			return res.data.data;
		} catch (err) {
			const isRateLimit = err.response?.status === 429;
			// If it's a rate limit error, sleep and retry
			if (isRateLimit && i < retries - 1) {
				const backoffTime = initialDelayMs * (i + 1);
				console.warn(
					`[Jikan API] Rate limited (429). Retrying in ${backoffTime}ms... (Attempt ${i + 1}/${retries})`
				);
				await delay(backoffTime);
				continue;
			}
			throw err;
		}
	}
};

// Cache Retrieving System with expired fallbacks
const getCache = (key) => {
	try {
		const raw = localStorage.getItem(CACHE_PREFIX + key);
		if (!raw) return null;

		const { data, timestamp, ttl } = JSON.parse(raw);
		const isExpired = Date.now() - timestamp > ttl;

		return {
			data,
			isExpired,
			rawTimestamp: timestamp,
		};
	} catch (e) {
		console.error("[Cache] Failed to parse cache key:", key, e);
		return null;
	}
};

// Cache Saving System
const setCache = (key, data, ttl) => {
	try {
		const payload = {
			data,
			timestamp: Date.now(),
			ttl,
		};
		localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(payload));
	} catch (e) {
		console.warn("[Cache] Quota exceeded or error setting cache key:", key, e);
	}
};

// Request wrapper integrating caching, retries, and offline expired fallbacks
const requestResilient = async (cacheKey, url, cacheTTL = DEFAULT_CACHE_MS) => {
	const cache = getCache(cacheKey);

	// If cached data is present and fresh, return instantly
	if (cache && !cache.isExpired) {
		return cache.data;
	}

	try {
		// Attempt fresh fetch from Jikan
		const data = await fetchWithRetry(url);
		if (data) {
			setCache(cacheKey, data, cacheTTL);
			return data;
		}
	} catch (err) {
		console.error(`[Jikan API] Fetch failed for URL: ${url}. Error:`, err.message);
		
		// If fetch fails but we have cached data (even if expired), use it as fallback
		if (cache) {
			console.warn(`[Jikan API] Fetch failed. Falling back to expired cache for key: ${cacheKey}`);
			return cache.data;
		}
	}
	
	return [];
};

// --- API WRAPPERS ---

// 1. Search Anime (Cache for 5 mins to support fast paging and back actions)
export const searchAnime = async (query) => {
	const cleanQuery = encodeURIComponent(query.trim().toLowerCase());
	const cacheKey = `search_${cleanQuery}`;
	const url = `${BASE}/anime?q=${cleanQuery}&limit=20`;
	return requestResilient(cacheKey, url, SHORT_CACHE_MS);
};

// 2. Anime by ID (Cache for 1 hour - highly static details page)
export const getAnimeById = async (id) => {
	const cacheKey = `anime_detail_${id}`;
	const url = `${BASE}/anime/${id}`;
	
	// Details pages shouldn't return empty arrays on failure, so we handle it gracefully
	const cache = getCache(cacheKey);
	if (cache && !cache.isExpired) return cache.data;

	try {
		const data = await fetchWithRetry(url);
		if (data) {
			setCache(cacheKey, data, LONG_CACHE_MS);
			return data;
		}
	} catch (err) {
		console.error(`[Jikan API] Detail fetch failed for ID: ${id}`, err);
		if (cache) return cache.data;
		throw err;
	}
};

// 3. Top Rated Anime Directory (Cache for 30 minutes)
export const getTopAnime = async (page = 1, limit = 24) => {
	const cacheKey = `top_page_${page}_limit_${limit}`;
	const url = `${BASE}/top/anime?page=${page}&limit=${limit}`;
	return requestResilient(cacheKey, url, DEFAULT_CACHE_MS);
};

// 4. Trending / Seasonal Anime (Cache for 30 minutes)
export const getTrending = async () => {
	const cacheKey = "trending_now";
	const url = `${BASE}/seasons/now`;
	return requestResilient(cacheKey, url, DEFAULT_CACHE_MS);
};

// 5. Anime by Genre (Cache for 30 minutes)
export const getByGenre = async (genreId, page = 1, year = "", minScore = "") => {
	const cacheKey = `genre_${genreId}_page_${page}_year_${year}_score_${minScore}`;
	let url = `${BASE}/anime?genres=${genreId}&page=${page}&limit=20`;
	if (year) {
		url += `&start_date=${year}-01-01&end_date=${year}-12-31`;
	}
	if (minScore) {
		url += `&min_score=${minScore}`;
	}
	return requestResilient(cacheKey, url, DEFAULT_CACHE_MS);
};

// 6. Upcoming Anime (Cache for 30 minutes)
export const getUpcomingAnime = async (page = 1) => {
	const cacheKey = `upcoming_page_${page}`;
	const url = `${BASE}/seasons/upcoming?page=${page}`;
	return requestResilient(cacheKey, url, DEFAULT_CACHE_MS);
};

// 7. Anime Reviews (Cache for 15 minutes)
export const getAnimeReviews = async (id) => {
	const cacheKey = `reviews_anime_${id}`;
	const url = `${BASE}/anime/${id}/reviews`;
	return requestResilient(cacheKey, url, SHORT_CACHE_MS * 3);
};
