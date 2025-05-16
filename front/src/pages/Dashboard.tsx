import Layout from '@/components/Layout';
import NewsCard from '@/components/NewsCard';
import { Button } from '@/components/ui/button';
import { NewsContext } from '@/context/NewsContext';
import { PlusCircle } from 'lucide-react';
import React, { useContext } from 'react';
import { useLocation } from 'wouter';

const Dashboard: React.FC = () => {
    const { articles, deleteArticle } = useContext(NewsContext);
    const [, navigate] = useLocation();


    const handleAddArticle = () => {
        navigate('/news/create');
    };

    const handleDeleteArticle = (id: string) => {
        if (window.confirm('Are you sure you want to delete this article?')) {
            deleteArticle(id);
        }
    };


    return (
        <Layout title="Dashboard">
            <div className="space-y-6">

                {/* News Cards */}
                {articles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map(article => (
                            <NewsCard
                                key={article.id}
                                article={article}
                                onDelete={handleDeleteArticle}
                            />
                        ))}
                    </div>
                ) : (<Button
                    variant="primary"
                    className="mt-4"
                    onClick={handleAddArticle}
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add your first article
                </Button>

                )}
            </div>
        </Layout>
    );
};

export default Dashboard;
