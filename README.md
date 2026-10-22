# CampusOne — One Platform, Entire Campus

## Design overhaul

A unified navy, coral and warm-paper design now covers navigation, student home,
notice and event cards, login, Explore and shared typography across staff screens.
Mobile navigation includes Home, Explore, Calendar, Saved and Profile. Tab URLs
support browser history, heavy views load on demand, and the campus guide answers
from stored records. Registration rejects expired events; weekly timetables no
longer substitute Monday classes on Sundays.

Run: `npm ci` then `npm run dev -- --host 127.0.0.1`.
Check: `npm test`, `npm run build` and `npm run lint`.
Android (requires Android SDK): `npm run build`, `npx cap sync android`,
then from `android` run `.\gradlew.bat assembleDebug`.
APK: `android/app/build/outputs/apk/debug/app-debug.apk`.

## Current implementation status

This is a React/Vite application packaged for Android with Capacitor. Its UI runs
inside a native WebView; it is not React Native. All application data and demo
profiles currently live in localStorage on the device. Email selects an existing
demo profile without verifying identity. Role controls are client-side only.
There is no shared backend, real password recovery, or server authorization yet.
The campus guide searches the stored dataset using keywords; it does not invent
exam or event information and is not connected to an AI service. Sample attachments and entry-pass QR graphics
must not be treated as verified institutional documents or credentials.

The initial maintenance pass fixes persistent logout, scopes demo resets to this
app's storage keys, corrects the notice date input, and improves bottom navigation
positioning, touch targets, keyboard focus, and reduced-motion support. Login and
recovery screens now describe their demo behavior explicitly.

Validation commands: `npm test`, `npm run build`, and `npm run lint`.
The build produces web assets in `dist`; it does not generate a new APK.

> **Institute of Professional Studies, University of Allahabad**  
> *"One Campus. One Platform. All Information."*

A complete, modern, mobile-first centralized campus platform built for a college minor project. Solves fragmented communications by consolidating notices, seminars, academic dates, exam timetables, faculty directories, and placement drives into one authoritative platform.

---

## 🏛️ The 5 Centers of IPS UOA
1. **CCET** — Center of Computer Education & Training (BCA, MCA)
2. **CFT** — Center of Food Technology (B.Sc FT, M.Sc FT, DFSQA)
3. **CMS** — Center of Media Studies (BA Media Studies, MJMC)
4. **CFDT** — Center of Fashion Design & Technology (B.Voc FD, M.Voc FM)
5. **CTF** — Center of Theatre & Film (B.Voc Theatre, Film Direction)

---

## 👥 4-Tier Role Hierarchy & Permissions

| Role | Target Persona | Permissions & Scope |
|---|---|---|
| **STUDENT** | Aarav Sharma (BCA • CCET)<br>Priya Patel (Food Tech • CFT) | **Read-Mostly + Personalized Feed**:<br>• College-wide announcements + own Department notices only<br>• 1-Click Event & Seminar registration with Digital Entry Pass & QR stub<br>• Exam schedule, admit slip, placement opportunities, syllabus downloads |
| **FACULTY** | Dr. Pradeep Kumar (Asst. Professor • CCET) | **Creator Privilege**:<br>• Draft Notice & Event proposals with `PENDING_APPROVAL` status<br>• Approval lifecycle tracker with review feedback<br>• Attendee roster for faculty-organized sessions |
| **DEPARTMENT ADMIN / HOD** | Prof. R. S. Yadav (HOD • CCET) | **Department-Isolated Management**:<br>• Manage only own department (cannot modify other centers)<br>• Review & approve/reject faculty submissions<br>• Publish official department notices & events directly<br>• Export attendee rosters (CSV) |
| **COLLEGE ADMIN** | Dr. Neha Srivastava (IPS Directorate) | **College-Wide Institutional Administration**:<br>• Complete oversight across all 5 centers<br>• User permissions & role assignment<br>• Direct publication of urgent institutional circulars<br>• Central Academic Calendar management |

---

## 🚀 Key Features

- **Department-Aware Content Delivery**: Students see College-wide circulars + their department's updates. Unrelated department notices never clutter their feed.
- **Approval Workflow Gateway**: Faculty proposals start as `PENDING_APPROVAL`. HOD endorses them before they appear on student screens.
- **Interactive Event Registration**: Generates digital event entry passes with ticket code, QR stub, and celebratory confetti.
- **Academic Calendar**: Centralized calendar with Month, Week, and List views plus day inspector.
- **Exam Date Sheets**: Timetable for sessional and final examinations with room allotments and instructions.
- **Placement & Career Hub**: Job and internship listings (TCS, Infosys, Nestle, Dainik Jagran, FabIndia, AWS Academy) with 1-click apply and status tracker.
- **Universal Campus Search**: Command search across notices, events, faculty, departments, exams, and career opportunities.
- **Campus Facilities Guide**: Interactive directory for Central Library, computing labs, pilot plant, broadcasting studios, and cafeteria.
- **Evaluator Demo Switcher**: Floating fast-role switcher to allow project evaluators/professors to test all 4 roles instantly.
- **Device Frame Toggle**: Ability to toggle between simulated smartphone frame and full responsive desktop width!

---

## 💻 Tech Stack
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Lucide React Icons
- **Animation & Effects**: Canvas Confetti + Shimmer Skeletons
- **Persistence**: Reactive localStorage storage service layer

---

## 🏃‍♂️ How to Run Locally

```bash
# 1. Enter project folder
cd ips-uoa-campus

# 2. Install dependencies (already completed)
npm install

# 3. Start development server
npm run dev

# 4. Or build and preview production release
npm run build
npm run preview
```
Visit `http://localhost:4173` or `http://localhost:5173` in your browser.
