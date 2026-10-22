import {
  ArrowUpRight,
  BellRing,
  Bookmark,
  Briefcase,
  Building2,
  Calendar,
  CalendarDays,
  Clock,
  GraduationCap,
  MapPin,
  Search,
  Users,
} from "lucide-react";
import { useApp } from "../../context/AppState";
const destinations = [
  {
    tab: "notices",
    title: "Noticeboard",
    description: "The latest circulars and department updates.",
    icon: BellRing,
    group: "Academic life",
  },
  {
    tab: "timetable",
    title: "Your timetable",
    description: "Classes, subjects and rooms at a glance.",
    icon: Clock,
    group: "Academic life",
  },
  {
    tab: "exams",
    title: "Examinations",
    description: "Datesheets, assessment dates and instructions.",
    icon: GraduationCap,
    group: "Academic life",
  },
  {
    tab: "calendar",
    title: "Academic calendar",
    description: "Important dates for the whole semester.",
    icon: Calendar,
    group: "Academic life",
  },
  {
    tab: "events",
    title: "Events & workshops",
    description: "Learn something new. Meet your people.",
    icon: CalendarDays,
    group: "Beyond the classroom",
  },
  {
    tab: "career",
    title: "Careers & internships",
    description: "Find opportunities for your next chapter.",
    icon: Briefcase,
    group: "Beyond the classroom",
  },
  {
    tab: "faculty",
    title: "Faculty directory",
    description: "Get to know the people who teach you.",
    icon: Users,
    group: "Your campus",
  },
  {
    tab: "departments",
    title: "Departments",
    description: "Discover the five centers of IPS.",
    icon: Building2,
    group: "Your campus",
  },
  {
    tab: "campus",
    title: "Campus guide",
    description: "Libraries, labs and places to find your way.",
    icon: MapPin,
    group: "Your campus",
  },
  {
    tab: "bookmarks",
    title: "Saved items",
    description: "Everything you want to come back to.",
    icon: Bookmark,
    group: "Your campus",
  },
];
export const ExploreView = () => {
  const { setCurrentTab } = useApp();
  return (
    <div className="co-explore animate-fade-in">
      <div className="co-page-heading">
        <div>
          <span className="co-eyebrow">FIND YOUR NEXT THING</span>
          <h1>
            Your campus, opened up<span className="co-coral">.</span>
          </h1>
          <p>A little curiosity goes a long way.</p>
        </div>
      </div>
      <button
        className="co-explore-search"
        onClick={() => setCurrentTab("search")}
      >
        <Search size={21} />
        <span>Search notices, people, events and more</span>
        <ArrowUpRight size={20} />
      </button>
      {["Academic life", "Beyond the classroom", "Your campus"].map((group) => (
        <section key={group}>
          <div className="co-section-heading">
            <h2>{group}</h2>
          </div>
          <div className="co-explore-grid">
            {destinations
              .filter((d) => d.group === group)
              .map(({ tab, title, description, icon: Icon }) => (
                <button
                  className="co-destination"
                  key={tab}
                  onClick={() => setCurrentTab(tab)}
                >
                  <span className="co-destination-icon">
                    <Icon size={24} />
                  </span>
                  <ArrowUpRight className="co-destination-arrow" size={18} />
                  <h3>{title}</h3>
                  <p>{description}</p>
                </button>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
};
