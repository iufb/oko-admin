import Layout from '@/components/Layout';
import NewsCard from '@/components/NewsCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NewsContext } from '@/context/NewsContext';
import { PlusCircle, Search } from 'lucide-react';
import React, { useContext, useState } from 'react';
import { useLocation } from 'wouter';

const Dashboard: React.FC = () => {
    const { articles, deleteArticle, togglePublishStatus } = useContext(NewsContext);
    const [, navigate] = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' ||
            (filter === 'published' && article.published) ||
            (filter === 'draft' && !article.published);

        return matchesSearch && matchesFilter;
    });

    const handleAddArticle = () => {
        navigate('/news/create');
    };

    const handleDeleteArticle = (id: string) => {
        if (window.confirm('Are you sure you want to delete this article?')) {
            deleteArticle(id);
        }
    };

    // Stats
    const totalArticles = articles.length;
    const publishedArticles = articles.filter(a => a.published).length;
    const draftArticles = totalArticles - publishedArticles;

    return (
        <Layout title="Dashboard">
            <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                        <p className="text-sm font-medium text-slate-500">Total Articles</p>
                        <p className="text-3xl font-bold text-slate-800">{totalArticles}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                        <p className="text-sm font-medium text-slate-500">Published</p>
                        <p className="text-3xl font-bold text-green-600">{publishedArticles}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                        <p className="text-sm font-medium text-slate-500">Drafts</p>
                        <p className="text-3xl font-bold text-slate-600">{draftArticles}</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                        <Input
                            className="pl-10"
                            placeholder="Search articles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex space-x-2">
                            <Button
                                variant={filter === 'all' ? 'primary' : 'outline'}
                                onClick={() => setFilter('all')}
                                size="sm"
                            >
                                All
                            </Button>
                            <Button
                                variant={filter === 'published' ? 'primary' : 'outline'}
                                onClick={() => setFilter('published')}
                                size="sm"
                            >
                                Published
                            </Button>
                            <Button
                                variant={filter === 'draft' ? 'primary' : 'outline'}
                                onClick={() => setFilter('draft')}
                                size="sm"
                            >
                                Drafts
                            </Button>
                        </div>
                        <Button onClick={handleAddArticle} className="flex items-center">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            New Article
                        </Button>
                    </div>
                </div>

                {/* News Cards */}
                {filteredArticles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredArticles.map(article => (
                            <NewsCard
                                key={article.id}
                                article={article}
                                onDelete={handleDeleteArticle}
                                onTogglePublish={togglePublishStatus}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-slate-500 text-lg">
                            {searchTerm ? 'No articles match your search' : 'No articles yet'}
                        </p>
                        {!searchTerm && (
                            <Button
                                variant="primary"
                                className="mt-4"
                                onClick={handleAddArticle}
                            >
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add your first article
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Dashboard;
