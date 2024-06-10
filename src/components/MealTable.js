const MealTable = ({
  students,
  daysInYear,
  months,
  getMealForDay,
  handleCellClick,
  handleMealSelect,
  selectedCell,
  scrollableTableRef,
  mealCounts,
  mealSummaries,
  companyStatus,
  isToday,
  isWeekend,
  isLastDayOfMonth,
  getDayName,
  setSelectedCell,
}) => (
  <div className="scrollable-table" ref={scrollableTableRef}>
    <table>
      <thead>
        <tr>
          <th className="fixed-first-column">Suma</th>
          {months.map((month) => (
            <th
              key={month.name}
              colSpan={month.days}
              style={{ backgroundColor: "lightblue" }}
            >
              {month.name}
            </th>
          ))}
        </tr>
        <tr>
          <th className="fixed-first-column"></th>
          {daysInYear.map((day) => (
            <th
              key={day.toString()} // Ensure the key is unique
              style={{
                backgroundColor: isToday(day)
                  ? "lightblue"
                  : isWeekend(day)
                  ? "lightgreen"
                  : "inherit",
                borderRight: isLastDayOfMonth(day)
                  ? "2px solid blue"
                  : "inherit",
              }}
            >
              {new Date(day).getDate()}/{new Date(day).getMonth() + 1}
              <br />
              {getDayName(day)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student._id}>
            <td className="fixed-first-column">
              {/* Empty cell for student rows */}
            </td>
            {daysInYear.map((day) => (
              <td
                key={`${student._id}-${day}`}
                onClick={() => handleCellClick(student._id, day)}
                className="calendar-cell"
                style={{
                  backgroundColor: isToday(day)
                    ? "lightblue"
                    : isWeekend(day)
                    ? "lightgreen"
                    : "inherit",
                  borderRight: isLastDayOfMonth(day)
                    ? "2px solid blue"
                    : "inherit",
                }}
              >
                {selectedCell &&
                selectedCell.studentId === student._id &&
                selectedCell.date === day ? (
                  <select
                    value={getMealForDay(student._id, day)}
                    onChange={(e) =>
                      handleMealSelect(student._id, day, e.target.value)
                    }
                    onBlur={() => setSelectedCell(null)} // Close select on blur
                  >
                    <option value="">pusta komórka - dieta szkolna</option>
                    <option value="S">S</option>
                    <option value="O">O</option>
                    <option value="K">K</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="U">U</option>
                    <option value="US">US</option>
                    <option value="UO">UO</option>
                    <option value="UK">UK</option>
                    <option value="UA">UA</option>
                    <option value="UB">UB</option>
                    <option value="P">P</option>
                    <option value="R">R</option>
                  </select>
                ) : (
                  getMealForDay(student._id, day)
                )}
              </td>
            ))}
          </tr>
        ))}
        <tr>
          <td className="fixed-first-column summation-cell">Suma posiłków</td>
          {daysInYear.map((day) => (
            <td
              key={`sum-${day}`}
              className="meal-counts"
              style={{
                backgroundColor: isToday(day)
                  ? "lightblue"
                  : isWeekend(day)
                  ? "lightgreen"
                  : "inherit",
                borderRight: isLastDayOfMonth(day)
                  ? "2px solid blue"
                  : "inherit",
              }}
            >
              {mealCounts[day] && (
                <div>
                  {Object.entries(mealCounts[day]).map(
                    ([mealType, count]) =>
                      count > 0 && (
                        <div key={mealType}>
                          {mealType}: {count}
                        </div>
                      )
                  )}
                </div>
              )}
            </td>
          ))}
        </tr>
        <tr>
          <td className="fixed-first-column summation-cell">Nieobecni</td>
          {daysInYear.map((day) => (
            <td
              key={`absent-${day}`}
              className="meal-summaries"
              style={{
                backgroundColor: isToday(day)
                  ? "lightblue"
                  : isWeekend(day)
                  ? "lightgreen"
                  : "inherit",
                borderRight: isLastDayOfMonth(day)
                  ? "2px solid blue"
                  : "inherit",
              }}
            >
              {mealSummaries[day] && (
                <div>
                  <div>S: {mealSummaries[day].śniadanie}</div>
                  <div>O: {mealSummaries[day].obiad}</div>
                  <div>K: {mealSummaries[day].kolacja}</div>
                </div>
              )}
            </td>
          ))}
        </tr>
        <tr>
          <td className="fixed-first-column summation-cell">Żywieni</td>
          {daysInYear.map((day) => (
            <td
              key={`fed-${day}`}
              className="meal-summaries"
              style={{
                backgroundColor: isToday(day)
                  ? "lightblue"
                  : isWeekend(day)
                  ? "lightgreen"
                  : "inherit",
                borderRight: isLastDayOfMonth(day)
                  ? "2px solid blue"
                  : "inherit",
              }}
            >
              {mealSummaries[day] && (
                <div>
                  <div>
                    S: {companyStatus - mealSummaries[day].śniadanie}
                  </div>
                  <div>O: {companyStatus - mealSummaries[day].obiad}</div>
                  <div>
                    K: {companyStatus - mealSummaries[day].kolacja}
                  </div>
                </div>
              )}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  </div>
);

export default MealTable;
