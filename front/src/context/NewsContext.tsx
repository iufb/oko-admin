import { useToast } from '@/hooks/use-toast';
import { fetchFormData } from '@/lib/utils';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { NewsArticle, NewsContextType } from '../types';

const defaultNewsContext: NewsContextType = {
    articles: [],
    getArticleById: () => undefined,
    addArticle: () => { },
    updateArticle: () => { },
    deleteArticle: () => { },
};

export const NewsContext = createContext<NewsContextType>(defaultNewsContext);

export const NewsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const { toast } = useToast();


    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const data: NewsArticle[] = await fetchFormData("/news", { method: "GET" })
                setArticles(data)

            } catch (e) {
                console.error("Error fetch")
                toast({
                    title: "Articles can't be fetched",
                    description: "...",
                    variant: "destructive",
                });


            }

        }

        fetchArticles()
    }, []);
    console.log(articles)


    const getArticleById = (id: string) => {
        console.log(articles, id)
        return articles.find(article => article.id == id);
    };

    const addArticle = async (articleData: Omit<NewsArticle, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            const formData = new FormData()

            Object.keys(articleData).forEach((k) => {
                formData.append(k, k == 'content' ? JSON.stringify({ html: articleData.content }) : articleData[k as keyof typeof articleData])
            })
            await fetchFormData('/news', { method: "POST" }, formData,)
            toast({
                title: "Article created",
                description: "Your article has been successfully created",
                variant: "default",
            });

        } catch (e) {
            console.error(e)
            toast({
                title: "Error",
                description: "News not created",
                variant: "destructive",
            });

        }
    };

    const updateArticle = async (id: string, articleData: Omit<NewsArticle, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            const formData = new FormData()

            Object.keys(articleData).forEach((k) => {
                formData.append(k, k == 'content' ? JSON.stringify({ html: articleData.content }) : articleData[k as keyof typeof articleData])
            })
            await fetchFormData(`/news/${id}`, { method: "PUT" }, formData)
            toast({
                title: "Article updated",
                description: "Your article has been successfully updated",
                variant: "default",
            });

        } catch (e) {
            console.error(e)
            toast({
                title: "Error",
                description: "News not updated",
                variant: "destructive",
            });

        }
    };

    const deleteArticle = (id: string) => {
        setArticles(prevArticles => prevArticles.filter(article => article.id !== id));

        toast({
            title: "Article deleted",
            description: "Your article has been permanently deleted",
            variant: "destructive",
        });
    };


    return (
        <NewsContext.Provider value={{
            articles,
            getArticleById,
            addArticle,
            updateArticle,
            deleteArticle,
        }}>
            {children}
        </NewsContext.Provider>
    );
};
