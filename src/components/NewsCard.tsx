import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, stripHtmlTags, truncateText } from '@/lib/utils';
import { NewsArticle } from '@/types';
import { Edit, Eye, Globe, Trash, XCircle } from 'lucide-react';
import React from 'react';
import { useLocation } from 'wouter';

interface NewsCardProps {
    article: NewsArticle;
    onDelete: (id: string) => void;
    onTogglePublish: (id: string) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, onDelete, onTogglePublish }) => {
    const [, navigate] = useLocation();

    const handleEdit = () => {
        navigate(`/news/edit/${article.id}`);
    };

    const handleView = () => {
        navigate(`/news/${article.id}`);
    };

    return (
        <Card className="overflow-hidden transition-all hover:shadow-md">
            <div className="h-48 overflow-hidden">
                <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover transform transition-transform hover:scale-105"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/6953890/pexels-photo-6953890.jpeg';
                    }}
                />
            </div>
            <CardHeader className="p-4 pb-0">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl line-clamp-2">{article.title}</CardTitle>
                        <CardDescription className="mt-1">
                            {formatDate(article.createdAt)}
                        </CardDescription>
                    </div>
                    <div className="flex items-center">
                        {article.published ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <Globe className="mr-1 h-3 w-3" />
                                Published
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                <XCircle className="mr-1 h-3 w-3" />
                                Draft
                            </span>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <p className="text-slate-600 line-clamp-3">
                    {truncateText(stripHtmlTags(article.content), 150)}
                </p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-slate-600"
                        onClick={handleView}
                    >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600"
                        onClick={handleEdit}
                    >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                    </Button>
                </div>
                <div className="flex space-x-2">
                    <Button
                        variant={article.published ? "ghost" : "secondary"}
                        size="sm"
                        className={article.published ? "text-slate-600" : "text-indigo-600"}
                        onClick={() => onTogglePublish(article.id)}
                    >
                        {article.published ? (
                            <>
                                <XCircle className="h-4 w-4 mr-1" />
                                Unpublish
                            </>
                        ) : (
                            <>
                                <Globe className="h-4 w-4 mr-1" />
                                Publish
                            </>
                        )}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => onDelete(article.id)}
                    >
                        <Trash className="h-4 w-4 mr-1" />
                        Delete
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};

export default NewsCard;
