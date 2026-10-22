import { useCallback, useEffect, useState } from "react";

const tabs = new Set([
  "home",
  "explore",
  "timetable",
  "classes",
  "class-notices",
  "students",
  "approvals",
  "users",
  "notices",
  "events",
  "calendar",
  "exams",
  "career",
  "faculty",
  "departments",
  "campus",
  "bookmarks",
  "search",
  "profile",
  "faculty-dash",
  "dept-admin",
  "college-admin",
  "auth",
  "login",
  "register",
  "forgot-password",
]);

function readTab() {
  const tab = window.location.hash.replace(/^#\/?/, "");
  return tabs.has(tab) ? tab : "home";
}

export function useCampusNavigation() {
  const [currentTab, updateTab] = useState(readTab);
  useEffect(() => {
    const restore = () => {
      updateTab(readTab());
      window.scrollTo(0, 0);
    };
    window.addEventListener("popstate", restore);
    window.addEventListener("hashchange", restore);
    return () => {
      window.removeEventListener("popstate", restore);
      window.removeEventListener("hashchange", restore);
    };
  }, []);
  const setCurrentTab = useCallback((tab: string) => {
    const next = tabs.has(tab) ? tab : "home";
    if (next !== readTab()) window.history.pushState(null, "", `#/${next}`);
    updateTab(next);
    window.scrollTo(0, 0);
    document.querySelector(".co-phone-frame main")?.scrollTo(0, 0);
  }, []);
  return { currentTab, setCurrentTab };
}
