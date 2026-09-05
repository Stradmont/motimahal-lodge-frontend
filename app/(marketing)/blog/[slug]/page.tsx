import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CtaSection from '@/components/CtaSection';
import { getBlogPostBySlug, getRelatedBlogPosts, BLOG_DATA } from '@/lib/data';
import { Calendar, User, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { SITE_URL } from '@/lib/config/env.config';

interface BlogDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found | Motimahal Lodge',
      description: 'The requested blog story could not be found.',
    };
  }

  const canonicalUrl = `${SITE_URL}/blog/${post.slug || post.id}`;
  const ogImage = post.image.startsWith('http') ? post.image : `${SITE_URL}${post.image}`;

  return {
    title: `${post.title} | Motimahal Lodge`,
    description: post.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${post.title} | Motimahal Lodge`,
      description: post.excerpt,
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
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
  };
}

export async function generateStaticParams() {
  return BLOG_DATA.map((post) => ({
    slug: post.slug || post.id,
  }));
}

export default async function BlogDetailsPage({ params }: BlogDetailsPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedBlogPosts(post.slug || post.id, 3);
  const pageUrl = `${SITE_URL}/blog/${post.slug || post.id}`;
  const postImage = post.image.startsWith('http') ? post.image : `${SITE_URL}${post.image}`;

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: [postImage],
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Hotel',
      name: 'Motimahal Lodge & Restaurant',
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
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
        <section className="relative w-full h-[55vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-stone-900">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${post.image}')`,
            }}
          />
          <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-xs" />

          <div className="relative z-20 mx-auto max-w-4xl px-6 text-center text-white space-y-4">
            <div className="inline-block bg-brand-green text-white text-xs font-semibold px-3.5 py-1 rounded shadow-md uppercase tracking-wider">
              {post.category}
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-white drop-shadow-md leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center justify-center gap-4 text-xs sm:text-sm text-stone-200 font-medium flex-wrap pt-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-brand-gold" />
                {post.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4 text-brand-gold" />
                {post.author}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-brand-gold" />
                {post.readTime}
              </span>
            </div>
          </div>
        </section>

        {/* 2. MAIN ARTICLE CONTENT CONTAINER */}
        <section className="py-12 sm:py-20 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="pb-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-stone-600 hover:text-brand-green transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to all stories</span>
            </Link>
          </div>

          <article className="space-y-8">
            <div className="p-6 sm:p-8 bg-white/80 rounded-xl border-l-4 border-brand-green border-y border-r border-brand-border text-stone-800 font-medium italic text-lg sm:text-xl leading-relaxed shadow-2xs">
              &ldquo;{post.excerpt}&rdquo;
            </div>

            <div className="space-y-6 text-stone-800 text-base sm:text-lg lg:text-xl leading-relaxed font-normal">
              {post.content.map((paragraph, pIdx) => (
                <p key={pIdx}>{paragraph}</p>
              ))}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="pt-8 border-t border-brand-border space-y-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-stone-500 block">
                  Topics
                </span>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="bg-white text-stone-700 text-xs sm:text-sm px-3.5 py-1.5 rounded-full border border-brand-border font-medium shadow-2xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        </section>

        {/* 3. RELATED BLOG POSTS */}
        {relatedPosts.length > 0 && (
          <section className="py-16 sm:py-24 border-t border-brand-border bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brand-charcoal">
                  Related Stories &amp; Travel Guides
                </h2>
                <p className="text-stone-600 text-base sm:text-lg leading-relaxed font-normal">
                  More tips and insights from Motimahal Lodge for your Chitwan visit.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((relPost) => (
                  <article
                    key={relPost.id}
                    className="bg-white rounded-2xl border border-brand-border overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group"
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={relPost.image}
                        alt={relPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-brand-green text-white text-xs font-semibold px-2.5 py-0.5 rounded shadow-sm">
                        {relPost.category}
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="text-xs text-stone-500 font-medium">
                          {relPost.date}
                        </div>
                        <h3 className="font-heading text-xl font-bold text-brand-charcoal group-hover:text-brand-green transition-colors leading-snug line-clamp-2">
                          <Link href={`/blog/${relPost.slug || relPost.id}`}>
                            {relPost.title}
                          </Link>
                        </h3>
                        <p className="text-stone-600 text-xs sm:text-sm line-clamp-2">
                          {relPost.excerpt}
                        </p>
                      </div>

                      <div className="pt-2">
                        <Link
                          href={`/blog/${relPost.slug || relPost.id}`}
                          className="text-xs font-bold text-brand-green hover:underline inline-flex items-center gap-1.5"
                        >
                          <span>Read Story</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 4. FINAL BOOKING CTA SECTION */}
        <CtaSection
          title="Visiting Chitwan soon?"
          description="Book directly with Motimahal Lodge for clean AC rooms, solar hot showers, and authentic tandoori dining."
          buttonText="Check room availability & enquiry"
          buttonHref="/enquiry"
          bgTexture={true}
        />
      </main>

      <Footer />
    </div>
  );
}
