import Layout from '@/components/Layout';
import NewsForm from '@/components/NewsForm';
import { NewsContext } from '@/context/NewsContext';
import { NewsArticle } from '@/types';
import React, { useContext } from 'react';
import { useLocation } from 'wouter';

const NewsCreate: React.FC = () => {
    const { addArticle } = useContext(NewsContext);
    const [, navigate] = useLocation();

    const handleSubmit = (data: Omit<NewsArticle, 'id' | 'createdAt' | 'updatedAt'>) => {
        addArticle(data);
        navigate('/dashboard');
    };

    return (
        <Layout title="Create New Article">
            <div className="max-w-4xl mx-auto">
                <NewsForm onSubmit={handleSubmit} />
            </div>
        </Layout>
    );
};

export default NewsCreate;
