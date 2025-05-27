import { rCreateNews, rGetNewsById, rGetNewsList, rUpdateNews } from '@/api/news';
import { useToast } from '@/hooks/use-toast';
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
        const fetch = async () => {
            try {
                const articles = await rGetNewsList()
                if (!articles || articles.length == 0) {
                    throw new Error('Articles not found')
                }
                setArticles(articles)
            } catch (e) {
                console.error(e)

            }


        }
        fetch()

    }, [])


    const getArticleById = async (id: string) => {
        try {
            const article = await rGetNewsById(id)
            if (!article) {
                throw new Error('Article not found')
            }
            return article
        } catch (e) {
            console.error(e)

        }

    };

    const addArticle = async (articleData: Omit<NewsArticle, 'id' | 'createdAt' | 'updatedAt'>) => {
        const mapkeys = (k: string) => {
            if (k == 'content') {
                return 'text'
            }
            if (k == 'image') {
                return 'media'
            }
            return k
        }
        try {
            const formData = new FormData()

            Object.keys(articleData).forEach((k) => {
                formData.append(mapkeys(k), articleData[k as keyof typeof articleData])
            })
            await rCreateNews(formData)
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
                formData.append(k == 'content' ? 'text' : k, articleData[k as keyof typeof articleData])
            })
            console.log(id, "CONTEXT")
            await rUpdateNews(id, formData)
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
