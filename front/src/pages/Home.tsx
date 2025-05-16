import React, { useContext, useState } from 'react';
import { Link } from 'wouter';
import { Newspaper, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { NewsContext } from '@/context/NewsContext';
import { formatDate, stripHtmlTags, truncateText } from '@/lib/utils';

const Home: React.FC = () => {
  const { articles } = useContext(NewsContext);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter only published articles and match search term
  const publishedArticles = articles.filter(article => 
    article.published && 
    (searchTerm === '' || article.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Newspaper className="h-8 w-8 text-indigo-600" />
              <h1 className="ml-2 text-xl font-bold text-slate-900">News Portal</h1>
            </div>
            <div>
              <Link href="/login">
                <Button variant="ghost">Admin</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero */}
      <div className="bg-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest News and Updates</h2>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto mb-8">
            Stay informed with our latest articles, news, and insights.
          </p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <Input
              className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* Articles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {publishedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedArticles.map(article => (
              <Card key={article.id} className="overflow-hidden transition-all hover:shadow-md animate-scale-in">
                <Link href={`/news/${article.id}`}>
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
                </Link>
                <CardContent className="p-6">
                  <Link href={`/news/${article.id}`}>
                    <h3 className="text-xl font-semibold line-clamp-2 hover:text-indigo-600 transition-colors">
                      {article.title}
                    </h3>
                  </Link>
                  <p className="text-slate-500 text-sm mt-2">
                    {formatDate(article.createdAt)}
                  </p>
                  <p className="mt-3 text-slate-700 line-clamp-3">
                    {truncateText(stripHtmlTags(article.content), 120)}
                  </p>
                </CardContent>
                <CardFooter className="px-6 pb-6 pt-0">
                  <Link href={`/news/${article.id}`}>
                    <Button variant="outline" size="sm">Read More</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">
              {searchTerm ? 'No articles match your search' : 'No published articles yet'}
            </p>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Newspaper className="h-8 w-8 text-indigo-400" />
              <h2 className="ml-2 text-xl font-bold">News Portal</h2>
            </div>
            <div className="text-slate-400 text-sm">
              &copy; {new Date().getFullYear()} News Portal. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;