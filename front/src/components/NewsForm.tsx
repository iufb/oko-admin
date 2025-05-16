import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NewsArticle } from '@/types';
import JoditEditor from 'jodit-react';
import React, { useState } from 'react';

interface NewsFormProps {
    initialData?: NewsArticle;
    onSubmit: (data: Omit<NewsArticle, 'id' | 'createdAt' | 'updatedAt'>) => void;
    isEditing?: boolean;
}

const NewsForm: React.FC<NewsFormProps> = ({ initialData, onSubmit, isEditing = false }) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [image, setImage] = useState<null | File | string>(initialData?.image || null);
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

        if (!image) {
            setImageError('Image  is required');
            isValid = false;
        } else {
            setImageError('');
        }

        if (isValid) {
            onSubmit({
                title,
                content,
                image,
            });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filelist = e.target?.files
            if (filelist.length > 0) {
                const file = filelist[0]
                setImage(file)
            }
        }
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
                    type="file"
                    onChange={handleImageChange}
                    placeholder="Enter image "
                    className={imageError ? 'border-red-500' : ''}
                />
                {imageError && <p className="text-sm text-red-500">{imageError}</p>}


            </div>

            <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <JoditEditor
                    value={content}
                    config={editorConfig}
                    onBlur={(newContent) => setContent(newContent)}
                    onChange={(newContent) => { }}
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
