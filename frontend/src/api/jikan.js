import axios from "axios";

const BASE = "https://api.jikan.moe/v4";

//  search anime
export const searchAnime = async (query) => {
    const res = await axios.get(`${BASE}/anime?q=${query}&limit=20`);
    return res.data.data;
};

//  anime by id (detail page)
export const getAnimeById = async (id) => {
    const res = await axios.get(`${BASE}/anime/${id}`);
    return res.data.data;
};

//  top rated
export const getTopAnime = async () => {
    const res = await axios.get(`${BASE}/top/anime?limit=10`);
    return res.data.data;
};

//  trending/seasonal
export const getTrending = async () => {
    const res = await axios.get(`${BASE}/seasons/now`);
    return res.data.data;
};

//  by genre
export const getByGenre = async (genreId, page = 1) => {
    const res = await axios.get(`${BASE}/anime?genres=${genreId}&page=${page}&limit=20`);
    return res.data.data;
};

// upcoming anime
export const getUpcomingAnime = async (page = 1) => {
    const res = await axios.get(`${BASE}/seasons/upcoming?page=${page}`);
    return res.data.data;
};


