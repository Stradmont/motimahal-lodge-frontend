import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CtaSection from '@/components/CtaSection';
import { PublicBlogService } from '@/lib/services/blog.service';
import { BLOG_CATEGORY_LABELS } from '@/lib/types/blog';
import { Calendar, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { SITE_URL } from '@/lib/config/env.config';
import BlogShareButtons from '@/components/marketing/blog/BlogShareButtons';

export const revalidate = 60; // Revalidate every 60 seconds

interface BlogDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blogRes = await PublicBlogService.getBySlug(slug).catch(() => null);
  const post = blogRes?.data;

  if (!post) {
    return {
      title: 'Article Not Found | Motimahal Lodge',
      description: 'The requested blog story could not be found.',
    };
  }

  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;
  const ogImage = post.image?.url
    ? (post.image.url.startsWith('http') ? post.image.url : `${SITE_URL}${post.image.url}`)
    : `${SITE_URL}/heroes/blog-hero.jpg`;

  const metaTitle = post.seoTitle || `${post.title} | Motimahal Lodge`;
  const metaDescription =
    post.seoDescription ||
    post.excerpt ||
    (post.content ? post.content.replace(/<[^>]*>/g, '').substring(0, 160) : 'Blog article from Motimahal Lodge');

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: post.seoKeywords ? post.seoKeywords.split(',').map((k) => k.trim()) : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName: 'Motimahal Lodge & Restaurant',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [ogImage],
    },
  };
}

export default async function BlogDetailsPage({ params }: BlogDetailsPageProps) {
  const { slug } = await params;
  const blogRes = await PublicBlogService.getBySlug(slug).catch(() => null);
  const post = blogRes?.data;

  if (!post) {
    notFound();
  }

  // Fetch recent related published blogs
  const allBlogsRes = await PublicBlogService.getAll({ limit: 4 }).catch(() => null);
  const relatedPosts = (allBlogsRes?.data || []).filter((b) => b.slug !== post.slug).slice(0, 3);

  const pageUrl = `${SITE_URL}/blog/${post.slug}`;
  const postImage = post.image?.url
    ? (post.image.url.startsWith('http') ? post.image.url : `${SITE_URL}${post.image.url}`)
    : `${SITE_URL}/heroes/blog-hero.jpg`;

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

  const metaDescription =
    post.seoDescription ||
    post.excerpt ||
    (post.content ? post.content.replace(/<[^>]*>/g, '').substring(0, 160) : 'Blog article from Motimahal Lodge');

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.seoTitle || post.title,
    description: metaDescription,
    image: [postImage],
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt || post.publishedAt || post.createdAt,
    author: {
      '@type': 'Person',
      name: post.authorName || 'Motimahal Team',
    },
    publisher: {
      '@type': 'Hotel',
      name: 'Motimahal Lodge & Restaurant',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/motimahal-logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    articleSection: BLOG_CATEGORY_LABELS[post.category] || post.category,
    keywords: post.seoKeywords || undefined,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${SITE_URL}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: pageUrl,
      },
    ],
  };

  // Split content string into paragraphs if not formatted as HTML
  const paragraphs = post.content.includes('<p>')
    ? [post.content]
    : post.content.split('\n\n').filter((p) => p.trim() !== '');

  return (
    <div className="min-h-screen flex flex-col text-brand-charcoal bg-texture">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar />

      <main className="flex-1">
        {/* 1. ARTICLE HERO HEADER */}
        <section className="relative w-full h-[50vh] min-h-[380px] flex items-center justify-center overflow-hidden bg-stone-900">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${postImage}')`,
            }}
          />
          <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-xs" />

          <div className="relative z-20 mx-auto max-w-4xl px-4 sm:px-6 text-center text-white space-y-3 sm:space-y-4">
            <div className="inline-block bg-brand-green text-white text-xs font-semibold px-3.5 py-1 rounded shadow-md uppercase tracking-wider">
              {BLOG_CATEGORY_LABELS[post.category] || post.category}
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-white drop-shadow-md leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center justify-center gap-4 text-xs sm:text-sm text-stone-200 font-medium flex-wrap pt-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-brand-gold" />
                {formattedDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4 text-brand-gold" />
                {post.authorName || 'Motimahal Team'}
              </span>
            </div>
          </div>
        </section>

        {/* 2. MAIN ARTICLE CONTENT CONTAINER */}
        <section className="py-12 sm:py-20 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative">
          {/* Desktop Floating Side Dock */}
          <BlogShareButtons url={pageUrl} title={post.title} variant="floating-side" />

          {/* Mobile Floating Bottom Pill */}
          <BlogShareButtons url={pageUrl} title={post.title} variant="mobile-bottom" />

          <div className="pb-8 flex items-center justify-between flex-wrap gap-4 border-b border-brand-border mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-stone-600 hover:text-brand-green transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to all stories</span>
            </Link>

            {/* Top Inline Share Bar */}
            <BlogShareButtons url={pageUrl} title={post.title} variant="top-bar" />
          </div>

          <article className="space-y-8">
            {post.excerpt && (
              <div className="p-5 sm:p-8 bg-white/80 rounded-xl border-l-4 border-brand-green border-y border-r border-brand-border text-stone-800 font-medium italic text-base sm:text-xl leading-relaxed shadow-2xs">
                &ldquo;{post.excerpt}&rdquo;
              </div>
            )}

            <div
              className="prose prose-lg dark:prose-invert max-w-none text-stone-800 text-base sm:text-lg leading-relaxed font-normal space-y-6 [&_img]:rounded-xl [&_img]:shadow-md [&_img]:my-6 [&_img]:w-full [&_img]:object-cover"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* End of Article Grand Share Card */}
            <BlogShareButtons url={pageUrl} title={post.title} variant="card" />
          </article>
        </section>

        {/* 3. RELATED BLOG POSTS */}
        {relatedPosts.length > 0 && (
          <section className="py-12 sm:py-24 border-t border-brand-border bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
              <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
                <h2 className="font-heading text-2xl sm:text-4xl font-bold text-brand-charcoal">
                  Related Stories &amp; Travel Guides
                </h2>
                <p className="text-stone-600 text-sm sm:text-lg leading-relaxed font-normal">
                  More tips and insights from Motimahal Lodge for your Chitwan visit.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {relatedPosts.map((relPost) => {
                  const relImage = relPost.image?.url || '/heroes/blog-hero.jpg';
                  return (
                    <article
                      key={relPost.id}
                      className="bg-white rounded-2xl border border-brand-border overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group"
                    >
                      <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={relImage}
                          alt={relPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-brand-green text-white text-xs font-semibold px-2.5 py-0.5 rounded shadow-sm">
                          {BLOG_CATEGORY_LABELS[relPost.category] || relPost.category}
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <h3 className="font-heading text-xl font-bold text-brand-charcoal group-hover:text-brand-green transition-colors leading-snug">
                            <Link href={`/blog/${relPost.slug}`}>
                              {relPost.title}
                            </Link>
                          </h3>
                        </div>

                        <Link
                          href={`/blog/${relPost.slug}`}
                          className="text-xs font-semibold text-brand-green hover:underline inline-flex items-center gap-1"
                        >
                          <span>Read article</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* 4. FINAL CTA SECTION */}
        <CtaSection
          title="Planning a stay at Motimahal Lodge?"
          description="Book your room directly for guaranteed rates, safari booking assistance, and authentic local food."
          buttonText="Check room availability & contact us"
          buttonHref="/contact"
          bgTexture={true}
        />
      </main>

      <Footer />
    </div>
  );
}
