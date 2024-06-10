import React from "react";

const StudentTable = ({ students, setStudents }) => (
  <div className="fixed-table">
    <table>
      <thead>
        <tr>
          <th
            onClick={() =>
              setStudents(
                [...students].sort((a, b) => a.name.localeCompare(b.name))
              )
            }
          >
            Imię
          </th>
          <th
            onClick={() =>
              setStudents(
                [...students].sort((a, b) => a.surname.localeCompare(b.surname))
              )
            }
          >
            Nazwisko
          </th>
          <th>Typ karty</th>
          <th>Karta ID</th>
          <th>Kod QR</th>
          <th>Osoba aktywna</th>
        </tr>
        <tr>
          <td colSpan="6" className="empty-row"></td>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student._id}>
            <td>{student.name}</td>
            <td>{student.surname}</td>
            <td>{student.cardType}</td>
            <td>{student.cardID}</td>
            <td>{student.QRCode}</td>
            <td>{student.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default StudentTable;
