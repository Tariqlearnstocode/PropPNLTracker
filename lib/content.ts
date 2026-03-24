import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content');

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
}

export interface GuideMeta {
  slug: string;
  title: string;
  description: string;
  order: number;
  icon: string;
  readTime: string;
}

function getMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));
}

export function getAllBlogPosts(): BlogPostMeta[] {
  const dir = path.join(contentDir, 'blog');
  const files = getMdxFiles(dir);

  return files
    .map((filename) => {
      const raw = fs.readFileSync(path.join(dir, filename), 'utf-8');
      const { data } = matter(raw);
      return {
        slug: filename.replace(/\.mdx$/, ''),
        title: data.title,
        description: data.description,
        date: data.date,
        readTime: data.readTime,
        tags: data.tags ?? [],
      } as BlogPostMeta;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPostBySlug(
  slug: string
): { meta: BlogPostMeta; content: string } | null {
  const filePath = path.join(contentDir, 'blog', `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    meta: {
      slug,
      title: data.title,
      description: data.description,
      date: data.date,
      readTime: data.readTime,
      tags: data.tags ?? [],
    },
    content,
  };
}

export function getAllBlogSlugs(): string[] {
  const dir = path.join(contentDir, 'blog');
  return getMdxFiles(dir).map((f) => f.replace(/\.mdx$/, ''));
}

export function getAllGuides(): GuideMeta[] {
  const dir = path.join(contentDir, 'guides');
  const files = getMdxFiles(dir);

  return files
    .map((filename) => {
      const raw = fs.readFileSync(path.join(dir, filename), 'utf-8');
      const { data } = matter(raw);
      return {
        slug: filename.replace(/\.mdx$/, ''),
        title: data.title,
        description: data.description,
        order: data.order,
        icon: data.icon,
        readTime: data.readTime,
      } as GuideMeta;
    })
    .sort((a, b) => a.order - b.order);
}

export function getGuideBySlug(
  slug: string
): { meta: GuideMeta; content: string } | null {
  const filePath = path.join(contentDir, 'guides', `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    meta: {
      slug,
      title: data.title,
      description: data.description,
      order: data.order,
      icon: data.icon,
      readTime: data.readTime,
    },
    content,
  };
}

export function getAllGuideSlugs(): string[] {
  const dir = path.join(contentDir, 'guides');
  return getMdxFiles(dir).map((f) => f.replace(/\.mdx$/, ''));
}
