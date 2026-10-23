import {
  ArrowUpRight,
  Briefcase,
  ChevronRight,
  Flame,
  GraduationCap,
  Sparkles,
  Trophy,
} from "lucide-react";
import React from "react";
import { useApp } from "../../context/AppState";

export const CampusDiscover: React.FC = () => {
  const { setCurrentTab } = useApp();

  const discoverCards = [
    {
      id: "disc-trending",
      tag: "🔥 TRENDING NOW",
      tagColor: "bg-rose-500 text-white",
      accentBorder: "hover:border-rose-300",
      title: "Prayag Hacks 2026: 36-Hour National Student Hackathon",
      subtitle: "Build AI & Civic Solutions for smart urban governance.",
      meta: "Oct 14-16 • Senate Quadrangle",
      stats: "₹1.5 Lakh Prize Pool",
      targetTab: "events",
      icon: Flame,
      iconBg: "bg-rose-50 text-rose-600",
      actionText: "Explore Hackathon",
    },
    {
      id: "disc-career",
      tag: "💼 CAREER OPPORTUNITY",
      tagColor: "bg-emerald-600 text-white",
      accentBorder: "hover:border-emerald-300",
      title: "TCS Digital & Tata Elxsi Campus Placement Drive",
      subtitle:
        "Software Engineer & Associate Consultant roles open for BCA & MCA.",
      meta: "Package: ₹7.5 - ₹9.0 LPA",
      stats: "Applications Close Oct 05",
      targetTab: "career",
      icon: Briefcase,
      iconBg: "bg-emerald-50 text-emerald-700",
      actionText: "View Details & Apply",
    },
    {
      id: "disc-learning",
      tag: "🎓 HANDS-ON LEARNING",
      tagColor: "bg-indigo-600 text-white",
      accentBorder: "hover:border-indigo-300",
      title: "Advanced Generative AI & LLM Fine-Tuning Bootcamp",
      subtitle:
        "3-Day practical lab series hosted by Google Developer Student Club.",
      meta: "Computer Complex Lab 3",
      stats: "Free Official Certificate",
      targetTab: "events",
      icon: GraduationCap,
      iconBg: "bg-indigo-50 text-indigo-700",
      actionText: "Reserve Student Pass",
    },
    {
      id: "disc-competition",
      tag: "🏆 STUDENT CONTEST",
      tagColor: "bg-amber-500 text-slate-950",
      accentBorder: "hover:border-amber-300",
      title: "Inter-Department Annual Tech Quiz & Coding League",
      subtitle:
        "Compete across algorithmic challenges, web design, and UI UX sprints.",
      meta: "Organized by CCET & CFT",
      stats: "Trophy & Merit Badges",
      targetTab: "events",
      icon: Trophy,
      iconBg: "bg-amber-50 text-amber-800",
      actionText: "Join Leaderboard",
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm text-left space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center shadow-xs font-semibold">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                Campus Discover
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                Curated
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Hand-picked opportunities, hackathons, and high-impact campus
              initiatives
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentTab("events")}
          className="text-xs font-bold text-blue-900 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>All Highlights</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid of 4 Curated Discover Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {discoverCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => setCurrentTab(card.targetTab)}
              className={`p-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50/60 to-white hover:bg-white ${card.accentBorder} hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group active:scale-[0.99]`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${card.tagColor}`}
                  >
                    {card.tag}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg ${card.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-900 transition-colors">
                  {card.title}
                </h4>

                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {card.subtitle}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-700 block">
                    {card.meta}
                  </span>
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">
                    {card.stats}
                  </span>
                </div>

                <span className="text-xs font-bold text-blue-900 group-hover:text-blue-700 flex items-center gap-0.5">
                  <span>{card.actionText}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
