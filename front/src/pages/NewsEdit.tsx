import { rGetNewsById } from '@/api/news';
import Layout from '@/components/Layout';
import NewsForm from '@/components/NewsForm';
import { NewsContext } from '@/context/NewsContext';
import { NewsArticle } from '@/types';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useRoute } from 'wouter';

const NewsEdit: React.FC = () => {
    const [match, params] = useRoute<{ id: string }>('/news/edit/:id');
    const { getArticleById, updateArticle } = useContext(NewsContext);
    const [, navigate] = useLocation();
    const [article, setArticle] = useState<NewsArticle | undefined>(undefined);

    useEffect(() => {
        const fetch = async () => {
            try {
                if (!params) throw new Error("Id not found")
                const article = await rGetNewsById(params.id)
                if (!article) {
                    throw new Error('Article not found')
                }
                setArticle(article)
            } catch (e) {
                console.error(e)
                navigate('/dashboard')
            }

        }
        fetch()

    }, [params?.id]);

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
