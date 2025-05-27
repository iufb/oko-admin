import { customFetch } from "@/api";
import { NewsArticle } from "@/types";

interface News {
    id: number;
    title: string;
    image: string;
    text: string;
}
export const rCreateNews = (data: FormData) => {
    return customFetch({ path: "news/upload/", method: "POST", data, withAuth: true })
}
export const rUpdateNews = (id: string, data: FormData) => {
    return customFetch({ path: "news/update/", method: "PUT", data, withAuth: true, query: { id } })
}
export const rGetNewsList = (): Promise<NewsArticle[] | undefined> => {
    return customFetch({ path: 'news/list/', method: "GET", withAuth: true, query: { limit: 100 } })
}
export const rGetNewsById = (id: string): Promise<NewsArticle | undefined> => {
    return customFetch({ path: `news/detail/`, method: "GET", query: { id }, withAuth: true })
}
