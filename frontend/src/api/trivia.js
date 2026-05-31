import axios from "axios";

export const getDailyTrivia = async () => {
    const res = await axios.get("http://localhost:8000/api/trivia/daily");
    return res.data;
};