import { rGetNewsById } from '@/api/news';
import { Button } from '@/components/ui/button';
import { NewsArticle } from '@/types';
import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useRoute } from 'wouter';

const NewsView: React.FC = () => {
    const [match, params] = useRoute<{ id: string }>('/news/:id');
    const [article, setArticle] = useState<NewsArticle | undefined>(undefined);
    const [notFound, setNotFound] = useState(false);

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
                setNotFound(true)
            }

        }
        fetch()

    }, [params?.id]);

    if (notFound) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
                <div className="max-w-md text-center">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Article Not Found</h1>
                    <p className="text-slate-600 mb-8">
                        The article you are looking for does not exist or has been removed.
                    </p>
                    <Link href="/">
                        <Button variant="primary">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-200 rounded w-64 mb-4"></div>
                    <div className="h-6 bg-slate-200 rounded w-40"></div>
                </div>
            </div>
        );
    }

    console.log(article.text)
    return (
        <div className="min-h-screen bg-white">
            {/* Hero image */}

            {/* Content */}
            <div className="max-w-4xl mx-auto px-0 py-0">
                <div
                    className="prose prose-slate prose-lg max-w-none editor-content"
                    dangerouslySetInnerHTML={{ __html: article.text }}
                ></div>

            </div>
        </div>
    );
};

export default NewsView;
