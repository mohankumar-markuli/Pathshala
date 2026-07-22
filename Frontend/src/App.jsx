import React, { useState, useEffect } from "react";
import PersonaSwitcher, { DEMO_PERSONAS } from "./components/PersonaSwitcher";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import DashboardView from "./components/DashboardView";
import SchoolManager from "./components/SchoolManager";
import ClassTimetable from "./components/ClassTimetable";
import StudentDirectory from "./components/StudentDirectory";
import NoticesView from "./components/NoticesView";
import GrievanceBox from "./components/GrievanceBox";

const API_BASE = "/api/v1";

export default function App() {
  const [activePersona, setActivePersona] = useState(DEMO_PERSONAS[2]); // Default: School Admin (Principal)
  const [token, setToken] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // State data
  const [analytics, setAnalytics] = useState(null);
  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [grievances, setGrievances] = useState([]);

  // Authenticate as active persona
  const loginPersona = async (persona) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: persona.email, password: "password123" })
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.data.token);
        setCurrentUser(data.data.user);
        fetchCoreData(data.data.token, persona.role);
      } else {
        useFallbackMockData(persona);
      }
    } catch (err) {
      console.warn("Backend unavailable, loading local prototype mock dataset.");
      useFallbackMockData(persona);
    }
  };

  const useFallbackMockData = (persona) => {
    setCurrentUser({
      firstName: persona.label.split(" ")[0],
      lastName: "Demo",
      role: persona.role,
      email: persona.email
    });

    const mockSchools = [
      { _id: "sch1", name: "Greenwood High International", code: "PSH-BLR-01", board: "CBSE", city: "Bengaluru", approvalStatus: "approved", logoUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200&auto=format&fit=crop&q=80" },
      { _id: "sch2", name: "St. Mary's Public School", code: "PSH-MYS-02", board: "ICSE", city: "Mysuru", approvalStatus: "pending", logoUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=200&auto=format&fit=crop&q=80" }
    ];

    setSchools(mockSchools);

    setAnalytics({
      totalSchools: 2,
      pendingSchools: 1,
      approvedSchools: 1,
      totalUsers: 12,
      totalStudents: 480,
      totalEmployees: 32,
      totalClasses: 14,
      openGrievances: 1,
      ownedSchoolsCount: 2,
      childrenCount: 1
    });

    const mockClass = {
      _id: "c1",
      name: "Grade 5",
      section: "A",
      academicYear: "2025-2026",
      capacity: 35,
      homeroomTeacherId: { firstName: "Ravi", lastName: "Shankar" },
      subjects: [
        { name: "Mathematics", teacherId: { firstName: "Ravi", lastName: "Shankar" } },
        { name: "Science", teacherId: { firstName: "Anita", lastName: "Deshmukh" } }
      ],
      timetable: [
        { day: "Monday", period: 1, startTime: "08:30", endTime: "09:15", subject: "Mathematics" },
        { day: "Monday", period: 2, startTime: "09:15", endTime: "10:00", subject: "Science" },
        { day: "Tuesday", period: 1, startTime: "08:30", endTime: "09:15", subject: "Science" },
        { day: "Tuesday", period: 2, startTime: "09:15", endTime: "10:00", subject: "Mathematics" }
      ]
    };
    setClasses([mockClass]);

    setStudents([
      {
        _id: "s1",
        firstName: "Arjun",
        lastName: "Sharma",
        admissionNo: "ADM-2025-501",
        gender: "Male",
        bloodGroup: "O+",
        status: "active",
        classId: { name: "Grade 5", section: "A" },
        guardians: [{ name: "Suresh Sharma", phone: "+91 9123456789", relation: "father" }]
      }
    ]);

    setNotices([
      {
        _id: "n1",
        title: "Annual Sports Day Registration 2026",
        body: "Registration for the Annual Sports Meet 2026 is now open. All students can participate.",
        targetAudience: "ALL",
        createdAt: new Date().toISOString()
      }
    ]);

    setGrievances([
      {
        _id: "g1",
        title: "Water cooler leak on 2nd floor",
        description: "Drinking water cooler near Grade 5 Section A is leaking.",
        category: "FACILITY_ISSUE",
        priority: "MEDIUM",
        status: "OPEN",
        createdAt: new Date().toISOString()
      }
    ]);
  };

  const fetchCoreData = async (authToken, role) => {
    const headers = { Authorization: `Bearer ${authToken}` };
    try {
      const [resAnalytics, resSchools, resClasses, resStudents, resNotices, resGrievances] = await Promise.all([
        fetch(`${API_BASE}/analytics/dashboard`, { headers }),
        fetch(`${API_BASE}/schools`, { headers }),
        fetch(`${API_BASE}/classes`, { headers }),
        fetch(`${API_BASE}/students`, { headers }),
        fetch(`${API_BASE}/notifications`, { headers }),
        fetch(`${API_BASE}/grievances`, { headers })
      ]);

      const dataAnalytics = await resAnalytics.json();
      const dataSchools = await resSchools.json();
      const dataClasses = await resClasses.json();
      const dataStudents = await resStudents.json();
      const dataNotices = await resNotices.json();
      const dataGrievances = await resGrievances.json();

      if (dataAnalytics.success) setAnalytics(dataAnalytics.data);
      if (dataSchools.success) setSchools(dataSchools.data);
      if (dataClasses.success) setClasses(dataClasses.data);
      if (dataStudents.success) setStudents(dataStudents.data);
      if (dataNotices.success) setNotices(dataNotices.data);
      if (dataGrievances.success) setGrievances(dataGrievances.data);
    } catch (e) {
      console.error("Error fetching core API data", e);
    }
  };

  useEffect(() => {
    loginPersona(activePersona);
  }, [activePersona]);

  const handleSwitchPersona = (persona) => {
    setActivePersona(persona);
    setActiveTab("overview");
  };

  const handleResetSeed = async () => {
    try {
      await fetch(`${API_BASE}/auth/seed`, { method: "POST" });
      alert("Database re-seeded successfully!");
      loginPersona(activePersona);
    } catch (e) {
      alert("Demo seed reset complete!");
    }
  };

  // Actions
  const handleApproveSchool = async (schoolId, status) => {
    try {
      await fetch(`${API_BASE}/schools/${schoolId}/approval`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ approvalStatus: status })
      });
      fetchCoreData(token, activePersona.role);
    } catch (e) {
      setSchools(schools.map(s => s._id === schoolId ? { ...s, approvalStatus: status } : s));
    }
  };

  const handleCreateSchool = async (schoolData) => {
    try {
      await fetch(`${API_BASE}/schools`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(schoolData)
      });
      fetchCoreData(token, activePersona.role);
    } catch (e) {
      setSchools([...schools, { _id: Date.now().toString(), ...schoolData, approvalStatus: "pending", logoUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200&auto=format&fit=crop&q=80" }]);
    }
  };

  const handleEnrollStudent = async (studentData) => {
    const schoolId = schools && schools.length > 0 ? schools[0]._id : "sch1";
    try {
      await fetch(`${API_BASE}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...studentData, schoolId })
      });
      fetchCoreData(token, activePersona.role);
    } catch (e) {
      setStudents([...students, {
        _id: Date.now().toString(),
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        admissionNo: studentData.admissionNo,
        status: "active",
        classId: classes.find(c => c._id === studentData.classId),
        guardians: [{ name: studentData.guardianName, phone: studentData.guardianPhone, relation: studentData.relation }]
      }]);
    }
  };

  const handleUpdateStudentStatus = async (studentId, status) => {
    try {
      await fetch(`${API_BASE}/students/${studentId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      fetchCoreData(token, activePersona.role);
    } catch (e) {
      setStudents(students.map(s => s._id === studentId ? { ...s, status } : s));
    }
  };

  const handleCreateNotice = async (noticeData) => {
    const schoolId = schools && schools.length > 0 ? schools[0]._id : "sch1";
    try {
      await fetch(`${API_BASE}/notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...noticeData, schoolId })
      });
      fetchCoreData(token, activePersona.role);
    } catch (e) {
      setNotices([{ _id: Date.now().toString(), ...noticeData, createdAt: new Date().toISOString() }, ...notices]);
    }
  };

  const handleSubmitGrievance = async (grievanceData) => {
    const schoolId = schools && schools.length > 0 ? schools[0]._id : "sch1";
    try {
      await fetch(`${API_BASE}/grievances`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...grievanceData, schoolId })
      });
      fetchCoreData(token, activePersona.role);
    } catch (e) {
      setGrievances([{ _id: Date.now().toString(), ...grievanceData, status: "OPEN", createdAt: new Date().toISOString() }, ...grievances]);
    }
  };

  const handleUpdateGrievanceStatus = async (grievanceId, status) => {
    try {
      await fetch(`${API_BASE}/grievances/${grievanceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      fetchCoreData(token, activePersona.role);
    } catch (e) {
      setGrievances(grievances.map(g => g._id === grievanceId ? { ...g, status } : g));
    }
  };

  const activeSchool = schools && schools.length > 0 ? schools[0] : null;

  return (
    <div className="app-container">
      <PersonaSwitcher
        activeRole={activePersona.role}
        onSwitchPersona={handleSwitchPersona}
        onResetSeed={handleResetSeed}
      />

      <Navbar currentUser={currentUser} activeSchool={activeSchool} />

      <div className="main-layout">
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} role={activePersona.role} />

        <main className="content-area">
          {activeTab === "overview" && (
            <DashboardView analytics={analytics} role={activePersona.role} onNavigateTab={setActiveTab} />
          )}

          {activeTab === "schools" && (
            <SchoolManager
              schools={schools}
              role={activePersona.role}
              onApproveSchool={handleApproveSchool}
              onCreateSchool={handleCreateSchool}
            />
          )}

          {activeTab === "timetable" && (
            <ClassTimetable
              classes={classes}
              role={activePersona.role}
            />
          )}

          {activeTab === "students" && (
            <StudentDirectory
              students={students}
              classes={classes}
              role={activePersona.role}
              onEnrollStudent={handleEnrollStudent}
              onUpdateStatus={handleUpdateStudentStatus}
            />
          )}

          {activeTab === "notices" && (
            <NoticesView
              notices={notices}
              role={activePersona.role}
              onCreateNotice={handleCreateNotice}
            />
          )}

          {activeTab === "grievances" && (
            <GrievanceBox
              grievances={grievances}
              role={activePersona.role}
              onSubmitGrievance={handleSubmitGrievance}
              onUpdateStatus={handleUpdateGrievanceStatus}
            />
          )}
        </main>
      </div>
    </div>
  );
}
