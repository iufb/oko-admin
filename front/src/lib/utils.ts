import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

export function stripHtmlTags(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
}

export interface FetchError extends Error {
    status?: number;
    data?: unknown;
}

export async function fetchFormData<T = any>(
    params: string,
    options: RequestInit = {},
    formData?: FormData,
): Promise<T> {
    const url = new URL(params, import.meta.env.VITE_BACKENDURL)
    try {
        const res = await fetch(url, {
            method: 'POST',
            body: formData,
            ...options,
        });

        const data = await res.json();

        if (!res.ok) {
            const error: FetchError = new Error(data?.message || res.statusText);
            error.status = res.status;
            error.data = data;
            throw error;
        }

        return data.posts as T;
    } catch (err: any) {
        console.error('Form fetch error:', err);
        throw err;
    }
}
