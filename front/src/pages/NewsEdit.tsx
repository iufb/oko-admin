import Layout from '@/components/Layout';
import NewsForm from '@/components/NewsForm';
import { NewsContext } from '@/context/NewsContext';
import { toast } from '@/hooks/use-toast';
import { NewsArticle } from '@/types';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useRoute } from 'wouter';

const NewsEdit: React.FC = () => {
    const [match, params] = useRoute<{ id: string }>('/news/edit/:id');
    const { getArticleById, updateArticle } = useContext(NewsContext);
    const [, navigate] = useLocation();
    const [article, setArticle] = useState<NewsArticle | undefined>(undefined);

    useEffect(() => {
        if (params?.id) {
            const foundArticle = getArticleById(params.id);
            if (foundArticle) {
                setArticle({ ...foundArticle, content: foundArticle.content.html });
            }
            else {
                toast({
                    title: "Article not found",
                    description: "The article you are trying to edit does not exist",
                    variant: "destructive",
                });

                console.log(foundArticle)
                navigate('/dashboard');
            }
        }
    }, [params?.id, getArticleById, navigate]);

    const handleSubmit = (data: Omit<NewsArticle, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (article) {
            updateArticle(article.id, data);
            navigate('/dashboard');
        }
    };

    if (!article) {
        return null;
    }

    return (
        <Layout title={`Edit: ${article.title}`}>
            <div className="max-w-4xl mx-auto">
                <NewsForm
                    initialData={article}
                    onSubmit={handleSubmit}
                    isEditing={true}
                />
            </div>
        </Layout>
    );
};

export default NewsEdit;
