import React, { useState, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { NewsArticle } from '@/types';

interface NewsFormProps {
  initialData?: NewsArticle;
  onSubmit: (data: Omit<NewsArticle, 'id' | 'createdAt' | 'updatedAt'>) => void;
  isEditing?: boolean;
}

const NewsForm: React.FC<NewsFormProps> = ({ initialData, onSubmit, isEditing = false }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [image, setImage] = useState(initialData?.image || '');
  const [previewImage, setPreviewImage] = useState(initialData?.image || '');
  const [titleError, setTitleError] = useState('');
  const [contentError, setContentError] = useState('');
  const [imageError, setImageError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    let isValid = true;
    
    if (!title.trim()) {
      setTitleError('Title is required');
      isValid = false;
    } else {
      setTitleError('');
    }
    
    if (!content.trim()) {
      setContentError('Content is required');
      isValid = false;
    } else {
      setContentError('');
    }
    
    if (!image.trim()) {
      setImageError('Image URL is required');
      isValid = false;
    } else {
      setImageError('');
    }
    
    if (isValid) {
      onSubmit({
        title,
        content,
        image,
        published: initialData?.published || false
      });
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImage(url);
    setPreviewImage(url);
  };
  
  const editorConfig = {
    readonly: false,
    height: 400,
    buttonsXS: [
      'bold', 'italic', '|',
      'ul', 'ol', '|',
      'font', 'fontsize', 'paragraph', '|',
      'image', 'link', '|',
      'align', 'undo', 'redo', '|',
      'hr', 'eraser', 'fullsize'
    ],
    buttons: [
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'ul', 'ol', '|',
      'font', 'fontsize', 'paragraph', '|',
      'image', 'link', 'table', '|',
      'align', 'undo', 'redo', '|',
      'hr', 'eraser', 'fullsize', 'source'
    ],
    uploader: {
      insertImageAsBase64URI: true
    },
    removeButtons: ['file']
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter article title"
          className={titleError ? 'border-red-500' : ''}
        />
        {titleError && <p className="text-sm text-red-500">{titleError}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          type="text"
          value={image}
          onChange={handleImageChange}
          placeholder="Enter image URL"
          className={imageError ? 'border-red-500' : ''}
        />
        {imageError && <p className="text-sm text-red-500">{imageError}</p>}
        
        {previewImage && (
          <Card className="mt-2 overflow-hidden">
            <CardContent className="p-2">
              <img 
                src={previewImage} 
                alt="Preview" 
                className="w-full h-56 object-cover rounded-md"
                onError={() => setPreviewImage('')} 
              />
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <JoditEditor
          value={content}
          config={editorConfig}
          onBlur={(newContent) => setContent(newContent)}
          onChange={(newContent) => {}}
        />
        {contentError && <p className="text-sm text-red-500">{contentError}</p>}
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          {isEditing ? 'Update Article' : 'Create Article'}
        </Button>
      </div>
    </form>
  );
};

export default NewsForm;