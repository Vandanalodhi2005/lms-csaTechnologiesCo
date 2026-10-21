"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  ShoppingCart,
  Trash2,
  Star,
  Clock,
  BookOpen,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Share2,
} from "lucide-react";
import { cn } from "@/utils";
import Avatar from "@/components/ui/Avatar.jsx";
import { toast } from "sonner";

const INITIAL_WISHLIST = [
  {
    id: "wish-cloud-devops",
    title: "AWS Cloud Practitioner & Kubernetes Microservices DevOps",
    category: "Cloud & DevOps",
    instructor: {
      name: "Marcus Aurelius Vance",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    },
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 1420,
    duration: "45 Hours",
    lessonsCount: 52,
    price: "$89.99",
    originalPrice: "$149.99",
    discount: "40% OFF",
    level: "Intermediate",
  },
  {
    id: "wish-cybersec",
    title: "Ethical Hacking & Penetration Testing BootCamp 2026",
    category: "Cybersecurity",
    instructor: {
      name: "Samantha Wright",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    },
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80",
    rating: 4.95,
    reviewsCount: 2310,
    duration: "38 Hours",
    lessonsCount: 44,
    price: "$79.99",
    originalPrice: "$129.99",
    discount: "38% OFF",
    level: "All Levels",
  },
  {
    id: "wish-ai-llm",
    title: "AI Engineer: Building LLM Apps with LangChain & OpenAI",
    category: "Artificial Intelligence",
    instructor: {
      name: "Dr. Aris Thorne",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    },
    thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80",
    rating: 4.88,
    reviewsCount: 890,
    duration: "30 Hours",
    lessonsCount: 36,
    price: "$94.99",
    originalPrice: "$159.99",
    discount: "41% OFF",
    level: "Advanced",
  },
  {
    id: "wish-system-design",
    title: "System Design for High Scale Distributed Systems",
    category: "Software Architecture",
    instructor: {
      name: "Alexey Volkov",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80",
    },
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
    rating: 4.92,
    reviewsCount: 3120,
    duration: "26 Hours",
    lessonsCount: 32,
    price: "$69.99",
    originalPrice: "$99.99",
    discount: "30% OFF",
    level: "Advanced",
  },
];

function LegacyStudentWishlistPage() {
  const [wishlist, setWishlist] = React.useState(INITIAL_WISHLIST);

  const handleRemove = (id, title) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
    toast.info(`Removed "${title}" from your wishlist`);
  };

  const handleEnroll = (title) => {
    toast.success(`Redirecting to checkout for: ${title}`);
  };

  const handleShare = (title) => {
    toast.success(`Copied course share link for "${title}"!`);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-2">
            <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
            <span>Saved Courses</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Saved Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Keep track of courses you intend to enroll in next and take advantage of seasonal student discounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Wishlist Items Grid */}
      {wishlist.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Your wishlist is empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don&apos;t have any saved courses yet. Explore our course library and bookmark your favorite learning paths!
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            <span>Explore Courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/80 hover:border-blue-200 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col sm:flex-row group"
            >
              {/* Thumbnail */}
              <div className="sm:w-56 aspect-video sm:aspect-auto relative bg-slate-100 overflow-hidden shrink-0">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-slate-900 backdrop-blur shadow-2xs">
                  {item.category}
                </span>
                <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-600 text-white shadow-sm">
                  {item.discount}
                </span>
              </div>

              {/* Info & Actions */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Avatar
                        src={item.instructor.avatar}
                        name={item.instructor.name}
                        size="xs"
                      />
                      <span className="font-medium text-slate-700">{item.instructor.name}</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{item.rating}</span>
                      <span className="text-slate-400 text-[10px]">({item.reviewsCount})</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {item.duration}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" /> {item.lessonsCount} lessons
                    </span>
                  </div>
                </div>

                {/* Price & Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-slate-900">{item.price}</span>
                    <span className="text-xs text-slate-400 line-through">
                      {item.originalPrice}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRemove(item.id, item.title)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleShare(item.title)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title="Share course"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleEnroll(item.title)}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm shadow-blue-500/20 shrink-0"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Enroll Now</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatPrice(amount) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount || 0);
}

export default function StudentWishlistPage() {
  const [wishlist, setWishlist] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [pendingId, setPendingId] = React.useState("");
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");

  const loadWishlist = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/users?action=wishlist&page=1&limit=50", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Could not load your wishlist.");
      setWishlist(result.data.wishlist || []);
    } catch (loadError) {
      setError(loadError.message || "Could not load your wishlist.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { loadWishlist(); }, [loadWishlist]);

  const removeFromWishlist = async (item) => {
    const courseId = item.courseId?._id;
    if (!courseId || pendingId) return;
    setPendingId(String(item._id));
    setError("");
    try {
      const response = await fetch("/api/users?action=toggleWishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const result = await response.json();
      if (!response.ok || !result.success || result.data?.wishlisted) throw new Error(result.message || "Could not remove this course.");
      setWishlist((current) => current.filter((entry) => String(entry._id) !== String(item._id)));
      setMessage("Course removed from your wishlist.");
    } catch (removeError) {
      setError(removeError.message || "Could not update your wishlist.");
    } finally {
      setPendingId("");
    }
  };

  const shareCourse = async (course) => {
    const url = `${window.location.origin}/courses/${course.slug}`;
    try {
      if (navigator.share) await navigator.share({ title: course.title, url });
      else await navigator.clipboard.writeText(url);
      setMessage(navigator.share ? "Course link shared." : "Course link copied.");
    } catch (shareError) {
      if (shareError.name !== "AbortError") setError("Could not share this course from your browser.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">Saved courses</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">My Wishlist</h1><p className="mt-2 text-sm text-slate-600">Courses you have saved for later.</p></div><Link href="/courses" className="inline-flex min-h-11 items-center gap-2 self-start rounded-xl bg-[#0F2F5F] px-4 text-sm font-semibold text-white hover:bg-[#143A72]">Browse courses <ArrowRight className="h-4 w-4" /></Link></header>
      {error ? <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between" role="alert"><span>{error}</span><button type="button" onClick={loadWishlist} className="min-h-10 rounded-lg border border-red-300 px-3 font-semibold hover:bg-red-100">Retry</button></div> : null}
      {message ? <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</p> : null}
      {loading ? <div className="flex min-h-48 items-center justify-center text-sm text-slate-600" role="status"><span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />Loading wishlist</div> : wishlist.length ? <div className="grid gap-4">{wishlist.map((item) => {
        const course = item.courseId;
        const price = course.discountPrice ?? course.price;
        return <article key={item._id} className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:flex-row">
          <Link href={`/courses/${course.slug}`} className="relative block aspect-video bg-slate-100 sm:aspect-auto sm:w-56 sm:shrink-0" aria-label={`View ${course.title}`}>
            {course.thumbnail ? <Image src={course.thumbnail} alt="" fill sizes="(max-width: 640px) 100vw, 224px" className="object-cover" /> : <span className="flex h-full min-h-32 items-center justify-center text-slate-400"><BookOpen className="h-8 w-8" aria-hidden="true" /></span>}
          </Link>
          <div className="flex min-w-0 flex-1 flex-col justify-between gap-5 p-4 sm:p-5">
            <div><p className="text-xs font-semibold uppercase tracking-wide text-blue-700">{course.categoryId?.name || course.level || "Course"}</p><Link href={`/courses/${course.slug}`} className="mt-1 block text-lg font-bold text-slate-900 hover:text-blue-700">{course.title}</Link><p className="mt-2 text-sm text-slate-600">{course.instructorId?.name || "Instructor"}</p><p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{course.shortDescription}</p></div>
            <div className="flex flex-col gap-3 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between"><p className="font-bold text-slate-900">{formatPrice(price)}</p><div className="flex flex-wrap gap-2"><button type="button" disabled={pendingId === String(item._id)} onClick={() => removeFromWishlist(item)} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"><Trash2 className="h-4 w-4" aria-hidden="true" />{pendingId === String(item._id) ? "Removing…" : "Remove"}</button><button type="button" onClick={() => shareCourse(course)} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Share2 className="h-4 w-4" aria-hidden="true" />Share</button><Link href={`/courses/${course.slug}`} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#0F2F5F] px-3 text-sm font-semibold text-white hover:bg-[#143A72]">View course <ExternalLink className="h-4 w-4" aria-hidden="true" /></Link></div></div>
          </div>
        </article>;
      })}</div> : <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center"><Heart className="mx-auto h-9 w-9 text-rose-500" aria-hidden="true" /><h2 className="mt-3 text-lg font-semibold text-slate-900">Your wishlist is empty</h2><p className="mt-1 text-sm text-slate-600">Save courses from the catalog and they will appear here.</p><Link href="/courses" className="mt-4 inline-flex min-h-10 items-center rounded-lg bg-[#0F2F5F] px-4 text-sm font-semibold text-white">Explore courses</Link></section>}
    </div>
  );
}
