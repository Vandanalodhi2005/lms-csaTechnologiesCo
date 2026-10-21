"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, Clock, Tag, ArrowRight, TrendingUp, BookOpen, Lightbulb, Code, Briefcase, Palette } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All Posts", icon: BookOpen },
  { id: "tutorials", label: "Tutorials", icon: Code },
  { id: "career", label: "Career Tips", icon: Briefcase },
  { id: "learning", label: "Learning Strategies", icon: Lightbulb },
  { id: "design", label: "Design", icon: Palette },
  { id: "trending", label: "Trending", icon: TrendingUp },
];

const POSTS = [
  {
    slug: "10-best-programming-languages-2025",
    category: "tutorials",
    tag: "Programming",
    title: "10 Best Programming Languages to Learn in 2025",
    excerpt: "The tech landscape is evolving rapidly. Here are the top programming languages that will give you the best career opportunities in 2025 and beyond.",
    readTime: "8 min read",
    date: "Oct 15, 2025",
    author: { name: "Arjun Patel", avatar: "AP" },
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80",
    featured: true,
  },
  {
    slug: "how-to-learn-coding-from-scratch",
    category: "tutorials",
    tag: "Beginners",
    title: "How to Learn Coding From Scratch in 2025",
    excerpt: "Starting your coding journey can feel overwhelming. This step-by-step guide breaks it down into manageable chunks for absolute beginners.",
    readTime: "6 min read",
    date: "Oct 12, 2025",
    author: { name: "Sneha Rao", avatar: "SR" },
    thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&q=80",
    featured: false,
  },
  {
    slug: "remote-tech-career-guide",
    category: "career",
    tag: "Career",
    title: "The Ultimate Guide to Landing a Remote Tech Job",
    excerpt: "Remote work is here to stay. Learn how to tailor your resume, ace remote interviews, and stand out in a competitive global job market.",
    readTime: "10 min read",
    date: "Oct 10, 2025",
    author: { name: "Marcus Johnson", avatar: "MJ" },
    thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80",
    featured: false,
  },
  {
    slug: "ui-ux-design-trends-2025",
    category: "design",
    tag: "UX Design",
    title: "UI/UX Design Trends That Are Dominating 2025",
    excerpt: "From glassmorphism to AI-generated interfaces, here are the design trends you need to know about to stay ahead of the curve.",
    readTime: "7 min read",
    date: "Oct 8, 2025",
    author: { name: "Aisha Malik", avatar: "AM" },
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
    featured: false,
  },
  {
    slug: "spaced-repetition-learning-technique",
    category: "learning",
    tag: "Study Tips",
    title: "Why Spaced Repetition is the Most Powerful Learning Technique",
    excerpt: "Science-backed learning strategies can help you retain information 3x longer. Discover how spaced repetition can transform your learning efficiency.",
    readTime: "5 min read",
    date: "Oct 5, 2025",
    author: { name: "Dr. Ravi Gupta", avatar: "RG" },
    thumbnail: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80",
    featured: false,
  },
  {
    slug: "ai-and-future-of-work",
    category: "trending",
    tag: "AI & Tech",
    title: "How AI is Reshaping Every Career — And What You Can Do About It",
    excerpt: "Artificial intelligence is transforming industries at an unprecedented pace. Here's how to future-proof your career and leverage AI as a tool, not fear it.",
    readTime: "9 min read",
    date: "Oct 3, 2025",
    author: { name: "Elena Zhang", avatar: "EZ" },
    thumbnail: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80",
    featured: false,
  },
  {
    slug: "freelancing-with-online-courses",
    category: "career",
    tag: "Freelancing",
    title: "How Online Courses Can Help You Land Your First Freelance Client",
    excerpt: "Freelancing is booming. But how do you get that first client? This guide shows you how structured online learning accelerates your freelance journey.",
    readTime: "6 min read",
    date: "Sep 30, 2025",
    author: { name: "Arjun Patel", avatar: "AP" },
    thumbnail: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=80",
    featured: false,
  },
  {
    slug: "react-vs-vue-vs-angular-2025",
    category: "tutorials",
    tag: "Web Dev",
    title: "React vs Vue vs Angular: Which Should You Learn in 2025?",
    excerpt: "The JavaScript framework wars continue. We break down the pros and cons of each framework to help you make the right choice for your career goals.",
    readTime: "11 min read",
    date: "Sep 28, 2025",
    author: { name: "Marcus Johnson", avatar: "MJ" },
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&q=80",
    featured: false,
  },
];

const TAG_COLORS = {
  Programming: "bg-blue-100 text-blue-700",
  Beginners: "bg-green-100 text-green-700",
  Career: "bg-orange-100 text-orange-700",
  "UX Design": "bg-violet-100 text-violet-700",
  "Study Tips": "bg-teal-100 text-teal-700",
  "AI & Tech": "bg-rose-100 text-rose-700",
  Freelancing: "bg-amber-100 text-amber-700",
  "Web Dev": "bg-indigo-100 text-indigo-700",
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = POSTS.filter((post) => {
    const matchCat = activeCategory === "all" || post.category === activeCategory;
    const matchSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = POSTS.find((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured || activeCategory !== "all" || searchQuery);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1600&q=60')] bg-cover" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            EduLearn Blog & Resources
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-5">
            Learn. Grow.{" "}
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Succeed.
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
            Tutorials, career tips, and learning strategies from industry experts to help you level up your skills.
          </p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="mx-auto max-w-6xl">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat.id
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Featured Post */}
          {featured && activeCategory === "all" && !searchQuery && (
            <div className="mb-10">
              <Link href={`/blog/${featured.slug}`} className="block group">
                <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-shadow grid md:grid-cols-2">
                  <div className="relative h-60 md:h-auto overflow-hidden">
                    <img
                      src={featured.thumbnail}
                      alt={featured.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Featured
                    </div>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 w-fit ${TAG_COLORS[featured.tag] || "bg-slate-100 text-slate-600"}`}>
                      {featured.tag}
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">{featured.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{featured.author.avatar}</span>
                        </div>
                        <div>
                          <p className="text-slate-800 text-sm font-medium">{featured.author.name}</p>
                          <p className="text-slate-400 text-xs">{featured.date}</p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-slate-400 text-xs">
                        <Clock className="w-4 h-4" /> {featured.readTime}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Article grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(activeCategory === "all" && !searchQuery ? rest : filtered).map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                  <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 w-fit ${TAG_COLORS[post.tag] || "bg-slate-100 text-slate-600"}`}>
                        {post.tag}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base mb-2 group-hover:text-blue-600 transition-colors flex-1">
                        {post.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{post.author.avatar}</span>
                          </div>
                          <span className="text-slate-600 text-xs font-medium">{post.author.name}</span>
                        </div>
                        <span className="flex items-center gap-1 text-slate-400 text-xs">
                          <Clock className="w-3.5 h-3.5" /> {post.readTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg font-medium">No articles found</p>
              <button
                onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                className="mt-4 text-blue-600 text-sm font-medium hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Newsletter */}
          <div className="mt-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-center shadow-xl">
            <h3 className="text-2xl font-bold text-white mb-2">Stay in the Loop</h3>
            <p className="text-blue-200 mb-6 text-sm">Get the latest tutorials and career tips delivered to your inbox every week.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email..."
                className="flex-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
              />
              <button className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition text-sm flex-shrink-0">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
