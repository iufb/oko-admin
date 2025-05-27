export interface NewsArticle {
    id: string;
    title: string;
    text: string;
    image: string | File;
}

export interface User {
    username: string;
    password?: string;
}

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
}

export interface NewsContextType {
    articles: NewsArticle[];
    getArticleById: (id: string) => NewsArticle | undefined;
    addArticle: (article: Omit<NewsArticle, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateArticle: (id: string, article: Partial<NewsArticle>) => void;
    deleteArticle: (id: string) => void;
}
