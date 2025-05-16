import React from 'react';
import { Route, Switch } from 'wouter';
import { NewsProvider } from './context/NewsContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/toaster';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NewsCreate from './pages/NewsCreate';
import NewsEdit from './pages/NewsEdit';
import NewsView from './pages/NewsView';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <NewsProvider>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/dashboard">
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          </Route>
          <Route path="/news/create">
            <ProtectedRoute>
              <NewsCreate />
            </ProtectedRoute>
          </Route>
          <Route path="/news/edit/:id">
            <ProtectedRoute>
              <NewsEdit />
            </ProtectedRoute>
          </Route>
          <Route path="/news/:id" component={NewsView} />
          <Route path="/" component={Home} />
        </Switch>
        <Toaster />
      </NewsProvider>
    </AuthProvider>
  );
}

export default App;