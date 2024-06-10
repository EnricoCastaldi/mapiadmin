import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "./PlanStudentMeals.css";
import StudentTable from "./StudentTable";
import MealTable from "./MealTable";
import Filters from "./Filters";
import StatusSummary from "./StatusSummary";
import Explanation from "./Explanation";

const PlanStudentMeals = () => {
  const [students, setStudents] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null); // Track selected cell
  const [mealCounts, setMealCounts] = useState({});
  const [mealSummaries, setMealSummaries] = useState({});
  const [companyStatus, setCompanyStatus] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [notActiveUsers, setNotActiveUsers] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false); // Toggle state for explanation section
  const [currentTime, setCurrentTime] = useState(new Date());
  const [surnameFilter, setSurnameFilter] = useState("");
  const [kodQRFilter, setKodQRFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [scrollToDate, setScrollToDate] = useState(new Date().toISOString().split("T")[0]); // Initialize with current date
  const [displayMode, setDisplayMode] = useState('week'); // New state to track display mode

  const scrollableTableRef = useRef(null);
  const currentYear = new Date().getFullYear();
  const today = new Date().toISOString().split("T")[0];

  const daysInYear = Array.from({ length: 366 }, (_, i) => {
    const date = new Date(currentYear, 0, i + 1);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
  });

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(currentYear, i, 1);
    return {
      name: date.toLocaleDateString("pl-PL", { month: "long" }),
      days: new Date(currentYear, i + 1, 0).getDate(),
    };
  });

  const getDaysInCurrentWeek = () => {
    const currentDate = new Date();
    const startOfWeek = currentDate.getDate() - currentDate.getDay() + 1; // Start from Monday
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(currentDate.setDate(startOfWeek + i));
      return date.toISOString().split("T")[0];
    });
  };

  const getDaysInCurrentMonth = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(year, month, i + 1);
      return date.toISOString().split("T")[0];
    });
  };

  const handleDisplayWeek = () => {
    setDisplayMode('week');
  };

  const handleDisplayMonth = () => {
    setDisplayMode('month');
  };

  const handleDisplayYear = () => {
    setDisplayMode('year');
  };

  const getDaysToDisplay = () => {
    switch (displayMode) {
      case 'week':
        return getDaysInCurrentWeek();
      case 'month':
        return getDaysInCurrentMonth();
      case 'year':
        return daysInYear;
      default:
        return getDaysInCurrentWeek();
    }
  };

  const daysToDisplay = getDaysToDisplay();

  useEffect(() => {
    const sessionData = JSON.parse(localStorage.getItem("sessionData"));
    if (!sessionData || !sessionData.token) {
      console.error("Brak tokenu uwierzytelniającego. Proszę się zalogować.");
      return;
    }

    axios
      .get("https://mapi-api.onrender.com/students", {
        headers: {
          Authorization: `Bearer ${sessionData.token}`,
        },
      })
      .then((response) => {
        let studentsData = response.data;
        console.log("Fetched students data:", studentsData); // Debugging statement
        if (sessionData.permission !== "superuser" && sessionData.kompania !== "Wszystkie") {
          studentsData = studentsData.filter(
            (student) => student.kompania === sessionData.kompania
          );
        }
        console.log("Filtered students data:", studentsData); // Debugging statement
        setStudents(studentsData);
        setCompanyStatus(studentsData.length); // Set company status to the number of students
        calculateUserStatuses(studentsData);
      })
      .catch((error) => {
        console.error("There was an error fetching the students!", error);
      });
  }, []);

  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        const sessionData = JSON.parse(localStorage.getItem('sessionData'));
        const token = sessionData ? sessionData.token : null;
        const kompania = sessionData ? sessionData.kompania : null;

        if (!token) {
          throw new Error('Nie znaleziono tokena');
        }

        const response = await axios.get('https://mapi-api.onrender.com/mealPlans', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { kompania },
        });

        console.log('Pobrane plany posiłków:', response.data); // Log the fetched data

        const mealPlansData = {};
        response.data.forEach(plan => {
          if (!mealPlansData[plan.studentID]) {
            mealPlansData[plan.studentID] = {};
          }
          mealPlansData[plan.studentID][plan.date] = plan.mealType;
        });

        console.log('Processed meal plans:', mealPlansData); // Log the processed data

        setMealPlans(mealPlansData);
        calculateMealCounts(mealPlansData);
      } catch (err) {
        console.error('Error fetching meal plans:', err);
      }
    };

    fetchMealPlans();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    handleScrollToDate(); // Scroll to the current date on component mount
  }, [scrollToDate]);

  const calculateMealCounts = (mealPlans) => {
    const counts = {};
    daysInYear.forEach((date) => {
      counts[date] = { S: 0, O: 0, K: 0, A: 0, B: 0 };
      Object.values(mealPlans).forEach((studentPlans) => {
        const mealType = studentPlans[date];
        if (mealType && counts[date][mealType] !== undefined) {
          counts[date][mealType] += 1;
        }
      });
    });
    console.log("Calculated meal counts:", counts); // Log the meal counts
    setMealCounts(counts);
    calculateMealSummaries(counts);
  };

  const calculateMealSummaries = (counts) => {
    const summaries = {};
    daysInYear.forEach((date) => {
      summaries[date] = {
        śniadanie:
          (counts[date]?.S || 0) +
          (counts[date]?.A || 0) +
          (counts[date]?.B || 0),
        obiad:
          (counts[date]?.S || 0) +
          (counts[date]?.O || 0) +
          (counts[date]?.B || 0),
        kolacja:
          (counts[date]?.S || 0) +
          (counts[date]?.O || 0) +
          (counts[date]?.K || 0),
      };
    });
    console.log("Calculated meal summaries:", summaries); // Log the meal summaries
    setMealSummaries(summaries);
  };

  const calculateUserStatuses = (students) => {
    const active = students.filter(
      (student) => student.status === "ACTIVE"
    ).length;
    const notActive = students.filter(
      (student) => student.status !== "ACTIVE"
    ).length;
    setActiveUsers(active);
    setNotActiveUsers(notActive);
  };

  const handleCellClick = (studentId, date) => {
    setSelectedCell({ studentId, date });
  };

  const handleMealSelect = (studentId, date, mealType) => {
    const sessionData = JSON.parse(localStorage.getItem("sessionData"));
    if (!sessionData || !sessionData.token) {
      console.error("Brak tokenu uwierzytelniającego. Proszę się zalogować.");
      return;
    }

    console.log("Posting meal plan:", {
      studentID: studentId,
      date: date,
      mealType: mealType,
    });

    axios
      .post(
        "https://mapi-api.onrender.com/mealPlans",
        {
          studentID: studentId,
          date: date,
          mealType: mealType,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionData.token}`,
          },
        }
      )
      .then((response) => {
        console.log(`Meal plan posted for studentId ${studentId}:`, response.data); // Log the response
        setMealPlans((prevState) => {
          const updatedMealPlans = {
            ...prevState,
            [studentId]: {
              ...prevState[studentId],
              [date]: mealType,
            },
          };
          calculateMealCounts(updatedMealPlans);
          return updatedMealPlans;
        });
        setSelectedCell(null); // Deselect cell after selection
      })
      .catch((error) => {
        console.error("There was an error saving the meal plan!", error);
      });
  };

  const getMealForDay = (studentId, date) => {
    const plans = mealPlans[studentId];
    return plans ? plans[date] : "";
  };

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pl-PL", { weekday: "short" });
  };

  const isWeekend = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
  };

  const isLastDayOfMonth = (dateString) => {
    const date = new Date(dateString);
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    return nextDay.getDate() === 1;
  };

  const isToday = (dateString) => {
    return dateString === today;
  };

  const filteredStudents = students.filter(
    (student) =>
      (!surnameFilter || student.surname.includes(surnameFilter)) &&
      (!kodQRFilter || student.QRCode.includes(kodQRFilter)) &&
      (!statusFilter || student.status === statusFilter)
  );

  const handleScrollLeft = () => {
    if (scrollableTableRef.current) {
      scrollableTableRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (scrollableTableRef.current) {
      scrollableTableRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const handleScrollToDate = () => {
    const dayIndex = daysInYear.indexOf(scrollToDate);
    if (dayIndex !== -1) {
      const calendarTable = scrollableTableRef.current;
      const dayColumn = calendarTable.querySelectorAll("th")[dayIndex];
      const offset = 200; // Adjust this value as needed to fine-tune the scroll position
      if (dayColumn) {
        const scrollLeft = dayColumn.offsetLeft - offset;
        calendarTable.scrollTo({ left: scrollLeft, behavior: "smooth" });
      }
    }
  };

  const todayMealCounts = mealCounts[today] || {};
  const todayMealSummaries = mealSummaries[today] || {};
  const notFed = {
    śniadanie: companyStatus - (todayMealSummaries.śniadanie || 0),
    obiad: companyStatus - (todayMealSummaries.obiad || 0),
    kolacja: companyStatus - (todayMealSummaries.kolacja || 0),
  };

  return (
    <div className="App">
      <h1>Kalendarz posiłków studenckich</h1>
      
      <div className="time-display">
        <h2>
          {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
        </h2>
      </div>
      <button
        className="toggle-explanation"
        onClick={() => setShowExplanation(!showExplanation)}
      >
        {showExplanation ? <FaChevronUp /> : <FaChevronDown />} OBJAŚNIENIE
      </button>
      {showExplanation && <Explanation />}

      <StatusSummary
        companyStatus={companyStatus}
        activeUsers={activeUsers}
        notActiveUsers={notActiveUsers}
        todayMealCounts={todayMealCounts}
        todayMealSummaries={todayMealSummaries}
        notFed={notFed}
      />

      <Filters
        surnameFilter={surnameFilter}
        setSurnameFilter={setSurnameFilter}
        kodQRFilter={kodQRFilter}
        setKodQRFilter={setKodQRFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        scrollToDate={scrollToDate}
        setScrollToDate={setScrollToDate}
        handleScrollLeft={handleScrollLeft}
        handleScrollRight={handleScrollRight}
        handleScrollToDate={handleScrollToDate}
        handleDisplayWeek={handleDisplayWeek}
        handleDisplayMonth={handleDisplayMonth}
        handleDisplayYear={handleDisplayYear}
      />

      <div className="table-container">
        <StudentTable
          students={filteredStudents}
          setStudents={setStudents}
        />
        <MealTable
          students={filteredStudents}
          daysInYear={daysToDisplay}
          months={months}
          getMealForDay={getMealForDay}
          handleCellClick={handleCellClick}
          handleMealSelect={handleMealSelect}
          selectedCell={selectedCell}
          scrollableTableRef={scrollableTableRef}
          mealCounts={mealCounts}
          mealSummaries={mealSummaries}
          companyStatus={companyStatus}
          isToday={isToday}
          isWeekend={isWeekend}
          isLastDayOfMonth={isLastDayOfMonth}
          getDayName={getDayName}
          setSelectedCell={setSelectedCell}
        />
      </div>
    </div>
  );
};

export default PlanStudentMeals;
