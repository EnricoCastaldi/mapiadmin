import React from "react";


const StatusSummary = ({ companyStatus, activeUsers, notActiveUsers, todayMealCounts, todayMealSummaries, notFed }) => (
  <div>
    <div className="status-container">
      <div>
        <h3 style={{ color: "blue" }}>Stan Kompanii: {companyStatus}</h3>
      </div>
      <div>
        <h3 style={{ color: "green" }}>Aktywni Studenci: {activeUsers}</h3>
      </div>
      <div>
        <h3 style={{ color: "orange" }}>Nieaktywni Studenci: {notActiveUsers}</h3>
      </div>
    </div>
    <div className="status-summary">
      <h3>Podsumowanie Dnia</h3>
      <div className="summary-sections">
        <div className="summary-section">
          <h4>Suma posiłków:</h4>
          <div>Dieta szkolna - zwrot kartek z całego dnia: <span>{todayMealCounts.S}</span></div>
          <div>Dieta szkolna - zwrot kartek z obiadu i kolacji: <span>{todayMealCounts.O}</span></div>
          <div>Dieta szkolna - zwrot kartek z kolacji: <span>{todayMealCounts.K}</span></div>
          <div>Zwrot kartek tylko ze śniadania: <span>{todayMealCounts.A}</span></div>
          <div>Zwrot kartek ze śniadania i obiadu: <span>{todayMealCounts.B}</span></div>
        </div>
        <div className="summary-section">
          <h4>Nieobecni:</h4>
          <div>Śniadanie: <span>{todayMealSummaries.śniadanie}</span></div>
          <div>Obiad: <span>{todayMealSummaries.obiad}</span></div>
          <div>Kolacja: <span>{todayMealSummaries.kolacja}</span></div>
        </div>
        <div className="summary-section">
          <h4>Żywieni:</h4>
          <div>Śniadanie: <span>{notFed.śniadanie}</span></div>
          <div>Obiad: <span>{notFed.obiad}</span></div>
          <div>Kolacja: <span>{notFed.kolacja}</span></div>
        </div>
      </div>
    </div>
  </div>
);

export default StatusSummary;
