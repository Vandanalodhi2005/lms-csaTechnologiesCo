"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn, formatCurrency, formatDuration } from "@/utils";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Circle,
  FileText,
  Video,
  File,
  AudioLines,
  ClipboardList,
  HelpCircle,
  ExternalLink,
  FileDown,
  ListChecks,
} from "lucide-react";
import Button from "@/components/ui/Button.jsx";
import Badge from "@/components/ui/Badge.jsx";
import ProgressBar from "@/components/ui/ProgressBar.jsx";
import { LESSON_TYPES } from "@/constants";

const lessonIcons = {
  [LESSON_TYPES.VIDEO]: Video,
  [LESSON_TYPES.TEXT]: FileText,
  [LESSON_TYPES.PDF]: File,
  [LESSON_TYPES.AUDIO]: AudioLines,
  [LESSON_TYPES.QUIZ]: HelpCircle,
  [LESSON_TYPES.ASSIGNMENT]: ClipboardList,
  [LESSON_TYPES.EXTERNAL]: ExternalLink,
};

export default function LearningPlayer({
  course,
  curriculum,
  currentLesson,
  prevLesson,
  nextLesson,
  progress,
  completedLessonIds = [],
  totalLessons = 0,
  completedCount = 0,
  onMarkComplete,
  onLessonChange,
  isCompleted = false,
}) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const currentLessonCompleted =
    currentLesson && completedLessonIds.includes(currentLesson._id.toString());
  const overallProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const currentLessonId = currentLesson?._id?.toString();
  const currentModuleId = currentLesson?.moduleId?.toString();

  const currentModule = curriculum?.find(
    (m) => m._id.toString() === currentModuleId
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-8rem)] gap-6">
      <div className="flex-1 min-w-0 space-y-5">
        <div className="rounded-2xl overflow-hidden border border-dark-100 bg-dark-900 shadow-card">
          <div className="relative aspect-video bg-dark-800 flex items-center justify-center overflow-hidden">
            {currentLesson?.thumbnail ? (
              <Image
                src={currentLesson.thumbnail}
                alt={currentLesson.title}
                fill
                className="object-cover opacity-60"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600/40 via-dark-800 to-dark-900" />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => setIsPlaying((v) => !v)}
                className="h-20 w-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-500/40"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="h-10 w-10 text-white ml-1" fill="white" />
                ) : (
                  <Play className="h-10 w-10 text-white ml-1.5" fill="white" />
                )}
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-dark-900 to-transparent space-y-3">
              <div className="flex items-center gap-3 text-white/90">
                <span className="text-xs font-medium">00:00</span>
                <div className="flex-1">
                  <ProgressBar value={28} max={100} size="sm" color="primary" />
                </div>
                <span className="text-xs font-medium">12:35</span>
              </div>
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsPlaying((v) => !v)}
                    className="h-9 w-9 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={() => setIsMuted((v) => !v)}
                    className="h-9 w-9 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="secondary" className="bg-white/10 text-white/80 border-white/10">
                    {currentLesson?.type?.toUpperCase()}
                  </Badge>
                  <button className="h-9 w-9 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors">
                    <Maximize className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                {currentModule && (
                  <Badge variant="secondary" size="sm" rounded="md">
                    {currentModule.title}
                  </Badge>
                )}
                {currentLesson?.duration > 0 && (
                  <span className="text-xs text-dark-500 inline-flex items-center gap-1">
                    {formatDuration(currentLesson.duration)}
                  </span>
                )}
                {currentLessonCompleted && (
                  <Badge variant="success" size="sm" rounded="md" dot>
                    Completed
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 tracking-tight leading-tight">
                {currentLesson?.title || "No lesson selected"}
              </h1>
              <Link
                href={`/courses/${course?.slug || course?._id}`}
                className="text-sm text-dark-500 hover:text-primary-600 inline-flex items-center gap-1 transition-colors"
              >
                {course?.title}
              </Link>
            </div>
            <Button
              variant={currentLessonCompleted ? "outline" : "success"}
              size="lg"
              onClick={() => onMarkComplete?.(currentLesson)}
              disabled={isCompleted}
              leftIcon={
                currentLessonCompleted ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <CheckCircle2 className="h-5 w-5" />
                )
              }
            >
              {currentLessonCompleted ? "Mark as Incomplete" : "Mark as Complete"}
            </Button>
          </div>

          <div className="rounded-2xl bg-white border border-dark-100 shadow-card p-6 space-y-6">
            {currentLesson?.description && (
              <div>
                <h3 className="font-semibold text-dark-900 mb-3">About this lesson</h3>
                <div className="prose-content text-sm">{currentLesson.description}</div>
              </div>
            )}
            {currentLesson?.content && (
              <div>
                <h3 className="font-semibold text-dark-900 mb-3">Lesson Content</h3>
                <div
                  className="prose-content text-sm"
                  dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                />
              </div>
            )}
            {currentLesson?.resources?.length > 0 && (
              <div>
                <h3 className="font-semibold text-dark-900 mb-3 flex items-center gap-2">
                  <FileDown className="h-4 w-4 text-dark-500" />
                  Resources ({currentLesson.resources.length})
                </h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {currentLesson.resources.map((r, idx) => (
                    <a
                      key={idx}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl border border-dark-100 hover:border-primary-200 hover:bg-primary-50/40 transition-colors"
                    >
                      <div className="h-10 w-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
                        <File className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-dark-900 truncate">{r.title}</p>
                        <p className="text-xs text-dark-500">
                          {r.size ? `${Math.round(r.size / 1024)} KB` : "Download"}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              disabled={!prevLesson}
              leftIcon={<ChevronLeft className="h-4 w-4" />}
              className="flex-1 max-w-[200px]"
              onClick={() => prevLesson && onLessonChange?.(prevLesson._id)}
            >
              <span className="truncate text-left">
                <span className="block text-xs text-dark-500 font-normal">Previous</span>
                <span className="line-clamp-1">{prevLesson?.title || "No previous"}</span>
              </span>
            </Button>
            <Button
              disabled={!nextLesson}
              rightIcon={<ChevronRight className="h-4 w-4" />}
              className="flex-1 max-w-[200px]"
              onClick={() => nextLesson && onLessonChange?.(nextLesson._id)}
            >
              <span className="truncate text-right">
                <span className="block text-xs font-normal opacity-80">Next</span>
                <span className="line-clamp-1">{nextLesson?.title || "Course Complete"}</span>
              </span>
            </Button>
          </div>
        </div>
      </div>

      <aside
        className={cn(
          "lg:w-96 xl:w-[420px] shrink-0 flex flex-col lg:sticky lg:top-24 lg:self-start rounded-2xl border border-dark-100 bg-white shadow-card overflow-hidden",
          !sidebarOpen && "hidden lg:flex"
        )}
      >
        <div className="p-5 border-b border-dark-100 space-y-4 bg-gradient-to-b from-primary-50/30 to-white">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-dark-900 flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-primary-600" />
              Course Content
            </h3>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-dark-100 text-dark-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-dark-700">
                {completedCount} / {totalLessons} lessons
              </span>
              <span className="font-semibold text-primary-700">{overallProgress}%</span>
            </div>
            <ProgressBar value={overallProgress} size="md" color="primary" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-16rem)] scrollbar-thin divide-y divide-dark-100">
          {curriculum?.map((module, moduleIdx) => {
            const mid = module._id.toString();
            const lessonInMod = module.lessons || [];
            const completedInMod = lessonInMod.filter((l) =>
              completedLessonIds.includes(l._id.toString())
            ).length;
            const modProgress =
              lessonInMod.length > 0
                ? Math.round((completedInMod / lessonInMod.length) * 100)
                : 0;
            const isCurrentModule = mid === currentModuleId;
            return (
              <div key={mid} className={cn(isCurrentModule && "bg-primary-50/30")}>
                <div className="px-5 py-3.5 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-wider text-dark-500 font-semibold mb-0.5">
                        Section {moduleIdx + 1}
                      </p>
                      <h4 className="font-semibold text-dark-900 leading-snug">
                        {module.title}
                      </h4>
                    </div>
                    <span className="text-xs text-dark-500 shrink-0 mt-0.5">
                      {completedInMod}/{lessonInMod.length}
                    </span>
                  </div>
                  <ProgressBar value={modProgress} size="xs" color="primary" />
                </div>
                <div className="pb-1.5">
                  {lessonInMod.map((lesson) => {
                    const lid = lesson._id.toString();
                    const isCurrent = lid === currentLessonId;
                    const isDone = completedLessonIds.includes(lid);
                    const Icon = lessonIcons[lesson.type] || FileText;
                    return (
                      <button
                        key={lid}
                        onClick={() => onLessonChange?.(lesson._id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors group",
                          isCurrent
                            ? "bg-primary-100/60 border-l-[3px] border-primary-600 pl-[calc(1.25rem-3px)]"
                            : "hover:bg-dark-50 border-l-[3px] border-transparent pl-[calc(1.25rem-3px)]"
                        )}
                      >
                        <div
                          className={cn(
                            "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                            isCurrent
                              ? "bg-primary-600 text-white"
                              : isDone
                              ? "bg-success text-white"
                              : "bg-dark-100 text-dark-500 group-hover:bg-dark-200"
                          )}
                        >
                          {isDone ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Icon className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              "text-sm truncate leading-snug",
                              isCurrent
                                ? "font-semibold text-primary-700"
                                : isDone
                                ? "text-dark-600"
                                : "text-dark-700"
                            )}
                          >
                            {lesson.title}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-dark-500 mt-0.5">
                            <span className="uppercase font-medium tracking-wide">
                              {lesson.type}
                            </span>
                            {lesson.duration > 0 && (
                              <span>• {formatDuration(lesson.duration)}</span>
                            )}
                            {lesson.isFree && (
                              <Badge variant="success" size="sm">
                                Preview
                              </Badge>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
