import React, { useContext, useEffect, useState } from 'react';
import { useRoute, Link } from 'wouter';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewsContext } from '@/context/NewsContext';
import { NewsArticle } from '@/types';
import { formatDate } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const NewsView: React.FC = () => {
  const [match, params] = useRoute<{ id: string }>('/news/:id');
  const { getArticleById } = useContext(NewsContext);
  const [article, setArticle] = useState<NewsArticle | undefined>(undefined);
  const [notFound, setNotFound] = useState(false);
  
  useEffect(() => {
    if (params?.id) {
      const foundArticle = getArticleById(params.id);
      if (foundArticle) {
        // Only show published articles to public or allow preview in admin
        if (foundArticle.published) {
          setArticle(foundArticle);
        } else {
          const isAdmin = localStorage.getItem('user') !== null;
          if (isAdmin) {
            setArticle(foundArticle);
            toast({
              title: "Preview Mode",
              description: "This article is not published. Only admins can see it.",
              variant: "default",
            });
          } else {
            setNotFound(true);
          }
        }
      } else {
        setNotFound(true);
      }
    }
  }, [params?.id, getArticleById]);
  
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
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero image */}
      <div 
        className="w-full h-80 md:h-96 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${article.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
            <div className="flex flex-wrap items-center text-sm opacity-90">
              <span className="flex items-center mr-4">
                <Calendar className="mr-1 h-4 w-4" />
                {formatDate(article.createdAt)}
              </span>
              <span className="flex items-center">
                <User className="mr-1 h-4 w-4" />
                Admin
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div 
          className="prose prose-slate prose-lg max-w-none editor-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        ></div>
        
        <div className="mt-12 border-t border-slate-200 pt-6">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Articles
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsView;