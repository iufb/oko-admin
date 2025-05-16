import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { NewsArticle } from '@/types';
import { Edit, Eye } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'wouter';

interface NewsCardProps {
    article: NewsArticle;
    onDelete: (id: string) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, onDelete, }) => {
    const [, navigate] = useLocation();

    const handleEdit = () => {
        navigate(`/news/edit/${article.id}`);
    };

    const handleView = () => {
        navigate(`/news/${article.id}`);
    };
    console.log(import.meta.env.VITE_BACKENDURL + '/' + article.image)

    return (
        <Card className="overflow-hidden transition-all hover:shadow-md">
            <div className="h-48 overflow-hidden">
                <img
                    src={import.meta.env.VITE_BACKENDURL + '/' + article.image}
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
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4">
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
                    <Link href={`/news/edit/${article.id}`}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600"
                        >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                        </Button>
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
};

export default NewsCard;
