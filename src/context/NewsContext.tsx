import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { NewsArticle, NewsContextType } from '../types';
import { useToast } from '@/hooks/use-toast';

const defaultNewsContext: NewsContextType = {
  articles: [],
  getArticleById: () => undefined,
  addArticle: () => {},
  updateArticle: () => {},
  deleteArticle: () => {},
  togglePublishStatus: () => {}
};

export const NewsContext = createContext<NewsContextType>(defaultNewsContext);

export const NewsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load articles from localStorage on mount
    const storedArticles = localStorage.getItem('newsArticles');
    if (storedArticles) {
      setArticles(JSON.parse(storedArticles));
    }
  }, []);

  useEffect(() => {
    // Save articles to localStorage whenever they change
    localStorage.setItem('newsArticles', JSON.stringify(articles));
  }, [articles]);

  const getArticleById = (id: string) => {
    return articles.find(article => article.id === id);
  };

  const addArticle = (articleData: Omit<NewsArticle, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newArticle: NewsArticle = {
      id: `article_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      ...articleData
    };
    setArticles(prevArticles => [newArticle, ...prevArticles]);
    
    toast({
      title: "Article created",
      description: "Your article has been successfully created",
      variant: "default",
    });
  };

  const updateArticle = (id: string, updatedData: Partial<NewsArticle>) => {
    setArticles(prevArticles =>
      prevArticles.map(article =>
        article.id === id
          ? { ...article, ...updatedData, updatedAt: new Date().toISOString() }
          : article
      )
    );
    
    toast({
      title: "Article updated",
      description: "Your article has been successfully updated",
      variant: "default",
    });
  };

  const deleteArticle = (id: string) => {
    setArticles(prevArticles => prevArticles.filter(article => article.id !== id));
    
    toast({
      title: "Article deleted",
      description: "Your article has been permanently deleted",
      variant: "destructive",
    });
  };

  const togglePublishStatus = (id: string) => {
    setArticles(prevArticles =>
      prevArticles.map(article => {
        if (article.id === id) {
          const newStatus = !article.published;
          
          toast({
            title: newStatus ? "Article published" : "Article unpublished",
            description: newStatus 
              ? "Your article is now visible to the public" 
              : "Your article has been set to draft mode",
            variant: "default",
          });
          
          return { 
            ...article, 
            published: newStatus, 
            updatedAt: new Date().toISOString() 
          };
        }
        return article;
      })
    );
  };

  return (
    <NewsContext.Provider value={{ 
      articles, 
      getArticleById, 
      addArticle, 
      updateArticle, 
      deleteArticle,
      togglePublishStatus
    }}>
      {children}
    </NewsContext.Provider>
  );
};