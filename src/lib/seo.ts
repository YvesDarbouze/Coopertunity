
import { Metadata } from 'next';

// Prompt 42: SEO Strategy
// Use project title and location in URL and Metadata

interface SEOTags {
    title: string;
    description: string;
    path: string;
    image?: string;
}

export function generateSEOMetadata({ title, description, path, image }: SEOTags): Metadata {
    const baseUrl = 'https://coopertunity.com';
    const fullUrl = `${baseUrl}${path}`;

    return {
        title: `${title} | Coopertunity`,
        description,
        openGraph: {
            title: `${title} | Coopertunity`,
            description,
            url: fullUrl,
            images: image ? [{ url: image }] : [],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: image ? [image] : [],
        },
        alternates: {
            canonical: fullUrl,
        },
    };
}
