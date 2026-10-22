export interface ClassScheduleItem {
  id: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  room: string;
  building: string;
  startTime: string; // "09:30" (24h format for math)
  endTime: string; // "10:30"
  timeDisplay: string; // "09:30 AM - 10:30 AM"
  type: "Lecture" | "Practical Lab" | "Tutorial" | "Seminar" | "Workshop";
}

export interface DaySchedule {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  classes: ClassScheduleItem[];
}

export const DEPARTMENT_TIMETABLES: Record<string, DaySchedule[]> = {
  CCET: [
    {
      day: "Monday",
      classes: [
        {
          id: "ccet-mon-1",
          day: "Monday",
          subjectCode: "BCA-501",
          subjectName: "Web Engineering & Cloud Architecture",
          facultyName: "Dr. Rahul Verma",
          room: "Lab 3 (Ground Floor)",
          building: "CCET Computer Complex",
          startTime: "09:30",
          endTime: "10:30",
          timeDisplay: "09:30 AM - 10:30 AM",
          type: "Lecture",
        },
        {
          id: "ccet-mon-2",
          day: "Monday",
          subjectCode: "BCA-502",
          subjectName: "Database Management Systems & SQL",
          facultyName: "Dr. Pradeep Kumar",
          room: "Room B-204 (2nd Floor)",
          building: "IPS Science Complex",
          startTime: "10:30",
          endTime: "11:30",
          timeDisplay: "10:30 AM - 11:30 AM",
          type: "Lecture",
        },
        {
          id: "ccet-mon-3",
          day: "Monday",
          subjectCode: "BCA-503",
          subjectName: "Computer Networks & Cyber Security",
          facultyName: "Er. Nitin Shukla",
          room: "Room B-202",
          building: "IPS Science Complex",
          startTime: "11:30",
          endTime: "12:30",
          timeDisplay: "11:30 AM - 12:30 PM",
          type: "Lecture",
        },
        {
          id: "ccet-mon-4",
          day: "Monday",
          subjectCode: "BCA-504",
          subjectName: "Python & AI Foundations Lab",
          facultyName: "Er. Ankit Singh",
          room: "AI & Data Science Lab 2",
          building: "CCET Innovation Wing",
          startTime: "13:30",
          endTime: "15:30",
          timeDisplay: "01:30 PM - 03:30 PM",
          type: "Practical Lab",
        },
        {
          id: "ccet-mon-5",
          day: "Monday",
          subjectCode: "BCA-505",
          subjectName: "Software Engineering Project Mentorship",
          facultyName: "Prof. R. S. Yadav",
          room: "Conference Hall A",
          building: "IPS Science Complex",
          startTime: "15:30",
          endTime: "16:30",
          timeDisplay: "03:30 PM - 04:30 PM",
          type: "Tutorial",
        },
      ],
    },
    {
      day: "Tuesday",
      classes: [
        {
          id: "ccet-tue-1",
          day: "Tuesday",
          subjectCode: "BCA-502",
          subjectName: "Database Management Systems & SQL",
          facultyName: "Dr. Pradeep Kumar",
          room: "Room B-204",
          building: "IPS Science Complex",
          startTime: "09:30",
          endTime: "10:30",
          timeDisplay: "09:30 AM - 10:30 AM",
          type: "Lecture",
        },
        {
          id: "ccet-tue-2",
          day: "Tuesday",
          subjectCode: "BCA-501",
          subjectName: "Web Engineering & React Lab",
          facultyName: "Dr. Rahul Verma",
          room: "Software Lab 1",
          building: "CCET Computer Complex",
          startTime: "10:30",
          endTime: "12:30",
          timeDisplay: "10:30 AM - 12:30 PM",
          type: "Practical Lab",
        },
        {
          id: "ccet-tue-3",
          day: "Tuesday",
          subjectCode: "BCA-506",
          subjectName: "Optimization Techniques & Discrete Math",
          facultyName: "Dr. Shweta Rai",
          room: "Hall 102",
          building: "IPS Academic Wing",
          startTime: "13:30",
          endTime: "14:30",
          timeDisplay: "01:30 PM - 02:30 PM",
          type: "Lecture",
        },
        {
          id: "ccet-tue-4",
          day: "Tuesday",
          subjectCode: "BCA-503",
          subjectName: "Network Security Practical",
          facultyName: "Er. Nitin Shukla",
          room: "Networking Lab",
          building: "CCET Innovation Wing",
          startTime: "14:30",
          endTime: "16:30",
          timeDisplay: "02:30 PM - 04:30 PM",
          type: "Practical Lab",
        },
      ],
    },
    {
      day: "Wednesday",
      classes: [
        {
          id: "ccet-wed-1",
          day: "Wednesday",
          subjectCode: "BCA-503",
          subjectName: "Computer Networks & Protocols",
          facultyName: "Er. Nitin Shukla",
          room: "Room B-202",
          building: "IPS Science Complex",
          startTime: "09:30",
          endTime: "10:30",
          timeDisplay: "09:30 AM - 10:30 AM",
          type: "Lecture",
        },
        {
          id: "ccet-wed-2",
          day: "Wednesday",
          subjectCode: "BCA-506",
          subjectName: "Discrete Mathematics & Graph Theory",
          facultyName: "Dr. Shweta Rai",
          room: "Room B-204",
          building: "IPS Science Complex",
          startTime: "10:30",
          endTime: "11:30",
          timeDisplay: "10:30 AM - 11:30 AM",
          type: "Lecture",
        },
        {
          id: "ccet-wed-3",
          day: "Wednesday",
          subjectCode: "BCA-504",
          subjectName: "Machine Learning Algorithms",
          facultyName: "Er. Ankit Singh",
          room: "Smart Classroom 4",
          building: "CCET Computer Complex",
          startTime: "11:30",
          endTime: "12:30",
          timeDisplay: "11:30 AM - 12:30 PM",
          type: "Lecture",
        },
        {
          id: "ccet-wed-4",
          day: "Wednesday",
          subjectCode: "BCA-507",
          subjectName: "Technical Seminar & Industry Colloquium",
          facultyName: "Prof. R. S. Yadav",
          room: "Senate Hall Auditorium",
          building: "University Senate Quadrangle",
          startTime: "14:00",
          endTime: "16:00",
          timeDisplay: "02:00 PM - 04:00 PM",
          type: "Seminar",
        },
      ],
    },
    {
      day: "Thursday",
      classes: [
        {
          id: "ccet-thu-1",
          day: "Thursday",
          subjectCode: "BCA-501",
          subjectName: "Cloud Infrastructure & DevOps",
          facultyName: "Dr. Rahul Verma",
          room: "Lab 3",
          building: "CCET Computer Complex",
          startTime: "09:30",
          endTime: "10:30",
          timeDisplay: "09:30 AM - 10:30 AM",
          type: "Lecture",
        },
        {
          id: "ccet-thu-2",
          day: "Thursday",
          subjectCode: "BCA-502",
          subjectName: "Advanced Database Lab & NoSQL",
          facultyName: "Dr. Pradeep Kumar",
          room: "Software Lab 2",
          building: "CCET Innovation Wing",
          startTime: "10:30",
          endTime: "12:30",
          timeDisplay: "10:30 AM - 12:30 PM",
          type: "Practical Lab",
        },
        {
          id: "ccet-thu-3",
          day: "Thursday",
          subjectCode: "BCA-505",
          subjectName: "Full-Stack Project Sprint",
          facultyName: "Er. Ankit Singh",
          room: "Open Source Lab",
          building: "CCET Innovation Wing",
          startTime: "13:30",
          endTime: "15:30",
          timeDisplay: "01:30 PM - 03:30 PM",
          type: "Practical Lab",
        },
      ],
    },
    {
      day: "Friday",
      classes: [
        {
          id: "ccet-fri-1",
          day: "Friday",
          subjectCode: "BCA-504",
          subjectName: "Deep Learning & Neural Networks",
          facultyName: "Er. Ankit Singh",
          room: "Smart Classroom 4",
          building: "CCET Computer Complex",
          startTime: "09:30",
          endTime: "10:30",
          timeDisplay: "09:30 AM - 10:30 AM",
          type: "Lecture",
        },
        {
          id: "ccet-fri-2",
          day: "Friday",
          subjectCode: "BCA-506",
          subjectName: "Probability & Statistical Computing",
          facultyName: "Dr. Shweta Rai",
          room: "Room B-204",
          building: "IPS Science Complex",
          startTime: "10:30",
          endTime: "11:30",
          timeDisplay: "10:30 AM - 11:30 AM",
          type: "Lecture",
        },
        {
          id: "ccet-fri-3",
          day: "Friday",
          subjectCode: "BCA-508",
          subjectName: "Cyber Ethics & Intellectual Property",
          facultyName: "Guest Faculty",
          room: "Room B-202",
          building: "IPS Science Complex",
          startTime: "11:30",
          endTime: "12:30",
          timeDisplay: "11:30 AM - 12:30 PM",
          type: "Lecture",
        },
        {
          id: "ccet-fri-4",
          day: "Friday",
          subjectCode: "BCA-509",
          subjectName: "Competitive Programming & DSA Club",
          facultyName: "Peer Mentor Group",
          room: "Coding Lab 1",
          building: "CCET Computer Complex",
          startTime: "14:00",
          endTime: "16:00",
          timeDisplay: "02:00 PM - 04:00 PM",
          type: "Practical Lab",
        },
      ],
    },
    {
      day: "Saturday",
      classes: [
        {
          id: "ccet-sat-1",
          day: "Saturday",
          subjectCode: "BCA-SEM",
          subjectName: "Industry Readiness & Mock Interview Drill",
          facultyName: "Training & Placement Cell",
          room: "Placement Auditorium",
          building: "IPS Directorate",
          startTime: "10:00",
          endTime: "12:30",
          timeDisplay: "10:00 AM - 12:30 PM",
          type: "Workshop",
        },
      ],
    },
  ],
  CFT: [
    {
      day: "Monday",
      classes: [
        {
          id: "cft-mon-1",
          day: "Monday",
          subjectCode: "FT-301",
          subjectName: "Food Microbiology & Sanitation",
          facultyName: "Prof. Farida Ahmad",
          room: "CFT Lecture Hall 1",
          building: "CFT Muir College Block",
          startTime: "09:30",
          endTime: "10:30",
          timeDisplay: "09:30 AM - 10:30 AM",
          type: "Lecture",
        },
        {
          id: "cft-mon-2",
          day: "Monday",
          subjectCode: "FT-302",
          subjectName: "Dairy Technology & Milk Processing",
          facultyName: "Dr. S. K. Chauhan",
          room: "Dairy Pilot Plant",
          building: "CFT Technology Wing",
          startTime: "10:30",
          endTime: "12:30",
          timeDisplay: "10:30 AM - 12:30 PM",
          type: "Practical Lab",
        },
        {
          id: "cft-mon-3",
          day: "Monday",
          subjectCode: "FT-303",
          subjectName: "Food Chemistry & Nutritional Analysis",
          facultyName: "Dr. Meenakshi Dixit",
          room: "Analytical Chemistry Lab",
          building: "CFT Muir College Block",
          startTime: "13:30",
          endTime: "15:30",
          timeDisplay: "01:30 PM - 03:30 PM",
          type: "Practical Lab",
        },
      ],
    },
    {
      day: "Tuesday",
      classes: [
        {
          id: "cft-tue-1",
          day: "Tuesday",
          subjectCode: "FT-304",
          subjectName: "Food Engineering Principles & Heat Transfer",
          facultyName: "Er. R. P. Singh",
          room: "CFT Hall 2",
          building: "CFT Muir College Block",
          startTime: "10:00",
          endTime: "11:30",
          timeDisplay: "10:00 AM - 11:30 AM",
          type: "Lecture",
        },
      ],
    },
  ],
  CMS: [
    {
      day: "Monday",
      classes: [
        {
          id: "cms-mon-1",
          day: "Monday",
          subjectCode: "CMS-201",
          subjectName: "Broadcast Journalism & Live Studio Anchoring",
          facultyName: "Dr. Dhananjay Chopra",
          room: "Studio Floor A",
          building: "CMP Media Block",
          startTime: "09:30",
          endTime: "11:30",
          timeDisplay: "09:30 AM - 11:30 AM",
          type: "Practical Lab",
        },
        {
          id: "cms-mon-2",
          day: "Monday",
          subjectCode: "CMS-202",
          subjectName: "Digital Video Editing & Premiere Pro",
          facultyName: "Er. Alok Dwivedi",
          room: "Post-Production Suite 3",
          building: "CMP Media Block",
          startTime: "12:00",
          endTime: "14:00",
          timeDisplay: "12:00 PM - 02:00 PM",
          type: "Practical Lab",
        },
      ],
    },
  ],
  CFDT: [
    {
      day: "Monday",
      classes: [
        {
          id: "cfdt-mon-1",
          day: "Monday",
          subjectCode: "FDT-201",
          subjectName: "CAD Apparel Pattern Making & Draping",
          facultyName: "Dr. Roli Srivastava",
          room: "CAD Fashion Studio 1",
          building: "Darbhanga Heritage Wing",
          startTime: "10:00",
          endTime: "12:30",
          timeDisplay: "10:00 AM - 12:30 PM",
          type: "Practical Lab",
        },
      ],
    },
  ],
  CTF: [
    {
      day: "Monday",
      classes: [
        {
          id: "ctf-mon-1",
          day: "Monday",
          subjectCode: "CTF-101",
          subjectName: "Voice Modulation & Physical Theatre",
          facultyName: "Prof. S. K. Bhatt",
          room: "Natya Griha Amphitheatre",
          building: "CTF Arts Complex",
          startTime: "09:30",
          endTime: "12:00",
          timeDisplay: "09:30 AM - 12:00 PM",
          type: "Practical Lab",
        },
      ],
    },
  ],
};

// Weekly schedules are samples; never substitute another department's classes.
export function calculateCurrentAndNextClass(
  departmentCode = "CCET",
  simulatedDate?: Date,
) {
  const now = simulatedDate || new Date();
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ] as const;
  const currentDayName = dayNames[now.getDay()];
  const weekSchedule = DEPARTMENT_TIMETABLES[departmentCode] || [];
  const minutes = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };
  const classesFor = (day: string) =>
    [...(weekSchedule.find((s) => s.day === day)?.classes || [])].sort(
      (a, b) => minutes(a.startTime) - minutes(b.startTime),
    );
  const todayClasses = classesFor(currentDayName);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentClass =
    todayClasses.find(
      (c) =>
        minutes(c.startTime) <= currentMinutes &&
        minutes(c.endTime) > currentMinutes,
    ) || null;
  let nextClass =
    todayClasses.find((c) => minutes(c.startTime) > currentMinutes) || null;
  let nextClassDayOffset = 0;
  if (!nextClass) {
    for (let offset = 1; offset <= 7; offset++) {
      const first = classesFor(dayNames[(now.getDay() + offset) % 7])[0];
      if (first) {
        nextClass = first;
        nextClassDayOffset = offset;
        break;
      }
    }
  }
  const remainingMinutes = currentClass
    ? minutes(currentClass.endTime) - currentMinutes
    : nextClass
      ? nextClassDayOffset * 1440 +
        minutes(nextClass.startTime) -
        currentMinutes
      : 0;
  const progressPercent = currentClass
    ? Math.round(
        ((currentMinutes - minutes(currentClass.startTime)) /
          (minutes(currentClass.endTime) - minutes(currentClass.startTime))) *
          100,
      )
    : 0;
  const targetDay =
    currentDayName === "Sunday" ? nextClass?.day || "Monday" : currentDayName;
  return {
    targetDay,
    currentDayName,
    currentClass,
    nextClass,
    nextClassDayOffset,
    remainingMinutes,
    progressPercent,
    isRecessOrOver: !currentClass && nextClassDayOffset > 0,
    todayClasses,
    weekSchedule,
  };
}
