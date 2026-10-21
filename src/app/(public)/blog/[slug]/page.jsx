import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Tag, ArrowLeft, Share2, Bookmark, ThumbsUp, MessageSquare, ArrowRight, BookOpen } from "lucide-react";

const POSTS = {
  "10-best-programming-languages-2025": {
    title: "10 Best Programming Languages to Learn in 2025",
    tag: "Programming",
    readTime: "8 min read",
    date: "Oct 15, 2025",
    author: { name: "Arjun Patel", avatar: "AP", role: "Senior Developer & Instructor" },
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80",
    content: [
      {
        type: "intro",
        text: "The programming landscape never stops evolving. New frameworks emerge, old languages get modernized, and some technologies rise to dominate industries. In 2025, choosing the right programming language can make or break your career trajectory. This guide cuts through the noise to give you the languages that actually matter.",
      },
      {
        type: "heading",
        text: "1. Python — The Versatile Giant",
      },
      {
        type: "paragraph",
        text: "Python continues to reign supreme in 2025, particularly in AI/ML, data science, and automation. Its clean syntax makes it beginner-friendly, yet it scales to enterprise-level applications. If you're not learning Python, you're leaving career opportunities on the table.",
      },
      {
        type: "heading",
        text: "2. JavaScript / TypeScript",
      },
      {
        type: "paragraph",
        text: "JavaScript remains the backbone of web development, and TypeScript has made it the language of choice for large-scale applications. With frameworks like React, Next.js, and Node.js, JavaScript developers are among the most in-demand professionals worldwide.",
      },
      {
        type: "heading",
        text: "3. Rust — The Performance King",
      },
      {
        type: "paragraph",
        text: "Rust has exploded in popularity thanks to its memory safety guarantees and performance comparable to C/C++. Major companies including Microsoft, Google, and Meta are investing heavily in Rust for systems programming.",
      },
      {
        type: "heading",
        text: "4. Go (Golang)",
      },
      {
        type: "paragraph",
        text: "Go's simplicity and concurrency support make it ideal for backend services, cloud applications, and DevOps tools. Companies like Kubernetes, Docker, and Terraform are built with Go.",
      },
      {
        type: "tip",
        text: "💡 Pro Tip: Don't try to learn multiple languages at once. Master one language to an advanced level before adding another to your stack. Depth beats breadth early in your career.",
      },
      {
        type: "heading",
        text: "5. Kotlin",
      },
      {
        type: "paragraph",
        text: "Google's preferred language for Android development, Kotlin is modern, concise, and fully interoperable with Java. If mobile development interests you, Kotlin is your best bet.",
      },
      {
        type: "heading",
        text: "Bottom Line",
      },
      {
        type: "paragraph",
        text: "The best language to learn is the one aligned with your career goals. Python for AI/ML, JavaScript for web, Kotlin for mobile, Go for backend, Rust for systems. Start with Python or JavaScript if you're unsure — both have enormous ecosystems and job markets.",
      },
    ],
    relatedCourses: [
      { title: "Python Bootcamp: Zero to Hero", slug: "python-bootcamp", instructor: "Arjun Patel" },
      { title: "The Complete JavaScript Course", slug: "javascript-complete", instructor: "Marcus Johnson" },
    ],
  },
};

const DEFAULT_POST = {
  title: "How to Learn Coding From Scratch in 2025",
  tag: "Beginners",
  readTime: "6 min read",
  date: "Oct 12, 2025",
  author: { name: "Sneha Rao", avatar: "SR", role: "Learning Specialist" },
  thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=1200&q=80",
  content: [
    { type: "intro", text: "Learning to code from scratch can feel like standing at the base of a mountain. But with the right roadmap, you can make steady progress every single day. This guide is designed for absolute beginners." },
    { type: "heading", text: "Step 1: Choose Your First Language" },
    { type: "paragraph", text: "For beginners, we recommend Python or JavaScript. Both are beginner-friendly, widely used, and have enormous communities and resources." },
    { type: "heading", text: "Step 2: Learn the Fundamentals" },
    { type: "paragraph", text: "Focus on variables, loops, functions, and data structures. Don't rush to frameworks. A solid understanding of core concepts will make everything else easier." },
    { type: "tip", text: "💡 Code every day, even if it's just for 30 minutes. Consistency beats intensity when learning to program." },
    { type: "heading", text: "Step 3: Build Projects" },
    { type: "paragraph", text: "The fastest way to learn is to build real projects. Start small — a to-do app, a weather widget, or a quiz game. Project-based learning cements concepts like nothing else." },
  ],
  relatedCourses: [
    { title: "Python Bootcamp: Zero to Hero", slug: "python-bootcamp", instructor: "Arjun Patel" },
  ],
};

export async function generateMetadata({ params }) {
  const post = POSTS[params.slug] || DEFAULT_POST;
  return {
    title: `${post.title} | EduLearn Blog`,
    description: post.content.find((c) => c.type === "intro")?.text?.slice(0, 160),
  };
}

export default function BlogPostPage({ params }) {
  const post = POSTS[params.slug] || DEFAULT_POST;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <div className="relative h-80 md:h-96 overflow-hidden">
        <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="mx-auto max-w-3xl">
            <span className="inline-block bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
              {post.tag}
            </span>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-10">
        {/* Back link */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 text-sm font-medium mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Main content */}
          <article className="lg:col-span-3">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{post.author.avatar}</span>
                </div>
                <div>
                  <p className="text-slate-800 font-semibold text-sm">{post.author.name}</p>
                  <p className="text-slate-400 text-xs">{post.author.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-400 text-sm ml-auto">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {post.readTime}
                </span>
                <span>{post.date}</span>
              </div>
            </div>

            {/* Article body */}
            <div className="prose prose-slate max-w-none space-y-5">
              {post.content.map((block, i) => {
                if (block.type === "intro") {
                  return (
                    <p key={i} className="text-lg text-slate-700 leading-relaxed font-medium border-l-4 border-blue-500 pl-5 py-1">
                      {block.text}
                    </p>
                  );
                }
                if (block.type === "heading") {
                  return (
                    <h2 key={i} className="text-xl font-bold text-slate-900 mt-8 mb-3">
                      {block.text}
                    </h2>
                  );
                }
                if (block.type === "paragraph") {
                  return (
                    <p key={i} className="text-slate-600 leading-relaxed">
                      {block.text}
                    </p>
                  );
                }
                if (block.type === "tip") {
                  return (
                    <div key={i} className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-blue-800 text-sm font-medium">
                      {block.text}
                    </div>
                  );
                }
                return null;
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-10 pt-8 border-t border-slate-200">
              <button className="flex items-center gap-2 text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors">
                <ThumbsUp className="w-5 h-5" /> Helpful
              </button>
              <button className="flex items-center gap-2 text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors">
                <Bookmark className="w-5 h-5" /> Save
              </button>
              <button className="flex items-center gap-2 text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors ml-auto">
                <Share2 className="w-5 h-5" /> Share
              </button>
            </div>

            {/* Author card */}
            <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-100">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">{post.author.avatar}</span>
                </div>
                <div>
                  <p className="font-bold text-slate-900 mb-1">{post.author.name}</p>
                  <p className="text-slate-500 text-sm mb-3">{post.author.role}</p>
                  <Link href="/instructors" className="inline-flex items-center gap-1 text-blue-600 text-sm font-semibold hover:underline">
                    View Profile <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Related Courses */}
            {post.relatedCourses && (
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-500" /> Related Courses
                </h3>
                <div className="space-y-3">
                  {post.relatedCourses.map((c, i) => (
                    <Link key={i} href={`/courses/${c.slug}`} className="block group">
                      <div className="bg-[#F8FAFC] rounded-xl p-3 border border-slate-200 hover:border-blue-300 transition-colors">
                        <p className="text-slate-800 text-xs font-semibold group-hover:text-blue-600 transition-colors mb-1">
                          {c.title}
                        </p>
                        <p className="text-slate-400 text-xs">by {c.instructor}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-5 text-center">
              <BookOpen className="w-8 h-8 text-white/70 mx-auto mb-3" />
              <p className="text-white font-bold text-sm mb-2">Start Learning Today</p>
              <p className="text-blue-200 text-xs mb-4">Join 50,000+ students on EduLearn</p>
              <Link href="/auth/register" className="block w-full bg-white text-blue-700 font-semibold text-sm py-2.5 rounded-xl hover:bg-blue-50 transition">
                Sign Up Free
              </Link>
            </div>
          </aside>
        </div>

        {/* More articles */}
        <div className="mt-16">
          <h2 className="text-xl font-bold text-slate-900 mb-6">More from the Blog</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { slug: "how-to-learn-coding-from-scratch", title: "How to Learn Coding From Scratch in 2025", tag: "Beginners", readTime: "6 min" },
              { slug: "remote-tech-career-guide", title: "The Ultimate Guide to Landing a Remote Tech Job", tag: "Career", readTime: "10 min" },
              { slug: "spaced-repetition-learning-technique", title: "Why Spaced Repetition is the Most Powerful Learning Technique", tag: "Study Tips", readTime: "5 min" },
            ].map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group block bg-white rounded-2xl p-5 border border-slate-200 hover:shadow-md transition-shadow">
                <span className="text-xs font-semibold text-blue-600 mb-2 block">{p.tag}</span>
                <p className="text-slate-800 font-semibold text-sm group-hover:text-blue-600 transition-colors mb-3">{p.title}</p>
                <span className="flex items-center gap-1 text-slate-400 text-xs">
                  <Clock className="w-3.5 h-3.5" /> {p.readTime} read
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
