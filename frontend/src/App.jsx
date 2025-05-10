import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Moon,
  Sun,
  LogIn,
  LogOut,
  Plus,
  User,
  X,
  Filter,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  Save,
  Upload,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { Toaster, toast } from "react-hot-toast";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Mock API
const mock = new MockAdapter(axios, { delayResponse: 800 });
const mockApiUrl = "/api/students";

// Initial mock data with Indian names
const initialStudents = [
  {
    id: 1,
    name: "Aryan Sharma",
    email: "aryan@example.com",
    course: "Computer Science",
    grade: "A",
    attendance: "95%",
    profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
    address: "B-12, Sector 62, Noida",
    phone: "+91 98765 43210",
    joinDate: "15 Aug 2024",
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya@example.com",
    course: "Data Science",
    grade: "A-",
    attendance: "92%",
    profilePic: "https://randomuser.me/api/portraits/women/44.jpg",
    address: "C-45, Malviya Nagar, Delhi",
    phone: "+91 87654 32109",
    joinDate: "22 Jul 2024",
  },
  {
    id: 3,
    name: "Vikram Singh",
    email: "vikram@example.com",
    course: "Web Development",
    grade: "B+",
    attendance: "88%",
    profilePic: "https://randomuser.me/api/portraits/men/55.jpg",
    address: "A-78, Andheri West, Mumbai",
    phone: "+91 76543 21098",
    joinDate: "10 Jun 2024",
  },
  {
    id: 4,
    name: "Neha Gupta",
    email: "neha@example.com",
    course: "UI/UX Design",
    grade: "A",
    attendance: "97%",
    profilePic: "https://randomuser.me/api/portraits/women/63.jpg",
    address: "D-15, JP Nagar, Bangalore",
    phone: "+91 65432 10987",
    joinDate: "05 Jul 2024",
  },
  {
    id: 5,
    name: "Rahul Verma",
    email: "rahul@example.com",
    course: "Mobile Development",
    grade: "B",
    attendance: "85%",
    profilePic: "https://randomuser.me/api/portraits/men/11.jpg",
    address: "F-22, Vaishali, Ghaziabad",
    phone: "+91 54321 09876",
    joinDate: "18 Jun 2024",
  },
  {
    id: 6,
    name: "Ananya Mishra",
    email: "ananya@example.com",
    course: "Computer Science",
    grade: "A-",
    attendance: "91%",
    profilePic: "https://randomuser.me/api/portraits/women/26.jpg",
    address: "G-8, Electronic City, Bangalore",
    phone: "+91 43210 98765",
    joinDate: "30 Jul 2024",
  },
  {
    id: 7,
    name: "Rohit Kumar",
    email: "rohit@example.com",
    course: "Data Science",
    grade: "B+",
    attendance: "89%",
    profilePic: "https://randomuser.me/api/portraits/men/36.jpg",
    address: "H-54, Aundh, Pune",
    phone: "+91 32109 87654",
    joinDate: "12 Aug 2024",
  },
  {
    id: 8,
    name: "Kavya Reddy",
    email: "kavya@example.com",
    course: "Web Development",
    grade: "A",
    attendance: "94%",
    profilePic: "https://randomuser.me/api/portraits/women/86.jpg",
    address: "J-17, Salt Lake, Kolkata",
    phone: "+91 21098 76543",
    joinDate: "25 Jun 2024",
  },
];

// Store initial data in localStorage if not exists
if (!localStorage.getItem("students")) {
  localStorage.setItem("students", JSON.stringify(initialStudents));
}

// Get persisted data from localStorage
const getPersistedStudents = () => {
  const storedStudents = localStorage.getItem("students");
  return storedStudents ? JSON.parse(storedStudents) : initialStudents;
};

// Setup mock endpoints
mock.onGet(mockApiUrl).reply(() => {
  return [200, getPersistedStudents()];
});

mock.onPost(mockApiUrl).reply((config) => {
  const newStudent = JSON.parse(config.data);
  const students = getPersistedStudents();
  const studentWithId = {
    ...newStudent,
    id: Math.floor(Math.random() * 1000) + 10,
  };

  const updatedStudents = [...students, studentWithId];
  localStorage.setItem("students", JSON.stringify(updatedStudents));

  return [200, studentWithId];
});

mock.onPut(mockApiUrl).reply((config) => {
  const updatedStudent = JSON.parse(config.data);
  const students = getPersistedStudents();
  const updatedStudents = students.map((student) =>
    student.id === updatedStudent.id ? updatedStudent : student
  );

  localStorage.setItem("students", JSON.stringify(updatedStudents));
  return [200, updatedStudent];
});

mock.onDelete(new RegExp(`${mockApiUrl}/\\d+`)).reply((config) => {
  const id = parseInt(config.url.split("/").pop());
  const students = getPersistedStudents();
  const updatedStudents = students.filter((student) => student.id !== id);

  localStorage.setItem("students", JSON.stringify(updatedStudents));
  return [200, { id }];
});

// Setup AOS
AOS.init({
  duration: 800,
  once: true,
});

// Main App Component
export default function StudentDashboard() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true";
  });
  const [user, setUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "Computer Science",
    grade: "A",
    attendance: "100%",
    profilePic: "https://randomuser.me/api/portraits/lego/1.jpg",
    address: "",
    phone: "",
    joinDate: new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  });

  // Available courses for filter
  const courses = [
    "All",
    "Computer Science",
    "Data Science",
    "Web Development",
    "UI/UX Design",
    "Mobile Development",
  ];

  // Toggle dark mode and save preference
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Set initial dark mode from localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Authentication listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        toast.success(`Welcome, ${currentUser.displayName}!`, {
          icon: "👋",
          style: {
            borderRadius: "10px",
            background: darkMode ? "#1F2937" : "#fff",
            color: darkMode ? "#fff" : "#1F2937",
          },
        });
      }
    });
    return () => unsubscribe();
  }, [darkMode]);

  // Load students data
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(mockApiUrl);
        setStudents(response.data);
        setFilteredStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
        toast.error("Failed to load students data!");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Filter students when search or course selection changes
  useEffect(() => {
    let result = students;

    // Filter by course
    if (selectedCourse !== "All") {
      result = result.filter((student) => student.course === selectedCourse);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (student) =>
          student.name.toLowerCase().includes(term) ||
          student.email.toLowerCase().includes(term) ||
          student.course.toLowerCase().includes(term)
      );
    }

    setFilteredStudents(result);
  }, [searchTerm, selectedCourse, students]);

  // Handle login
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully", {
        icon: "👋",
        style: {
          borderRadius: "10px",
          background: darkMode ? "#1F2937" : "#fff",
          color: darkMode ? "#fff" : "#1F2937",
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle add student form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to add a student");
      return;
    }

    if (!formData.name || !formData.email || !formData.course) {
      toast.error("Please fill all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(mockApiUrl, formData);

      setStudents([...students, response.data]);
      setFormData({
        name: "",
        email: "",
        course: "Computer Science",
        grade: "A",
        attendance: "100%",
        profilePic: "https://randomuser.me/api/portraits/lego/1.jpg",
        address: "",
        phone: "",
        joinDate: new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      });
      setShowAddForm(false);
      toast.success("Student added successfully!", {
        icon: "🎉",
        style: {
          borderRadius: "10px",
          background: darkMode ? "#1F2937" : "#fff",
          color: darkMode ? "#fff" : "#1F2937",
        },
      });
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error("Failed to add student!");
    } finally {
      setLoading(false);
    }
  };

  // Update student
  const handleUpdateStudent = async () => {
    if (!user) {
      toast.error("Please log in to update student information");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(mockApiUrl, selectedStudent);

      setStudents(
        students.map((student) =>
          student.id === response.data.id ? response.data : student
        )
      );

      setEditMode(false);
      toast.success("Student information updated!", {
        icon: "✅",
        style: {
          borderRadius: "10px",
          background: darkMode ? "#1F2937" : "#fff",
          color: darkMode ? "#fff" : "#1F2937",
        },
      });
    } catch (error) {
      console.error("Error updating student:", error);
      toast.error("Failed to update student information!");
    } finally {
      setLoading(false);
    }
  };

  // Delete student
  // Delete student
const handleDeleteStudent = async (id) => {
  if (!user) {
    toast.error("Please log in to delete a student");
    return;
  }
  
  // Create a promise-based modal
  const showConfirmModal = () => {
    return new Promise((resolve) => {
      const modalContainer = document.createElement('div');
      modalContainer.className = 'fixed inset-0 z-50 flex items-center justify-center';
      
      modalContainer.innerHTML = `
        <div class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" id="modal-backdrop"></div>
        <div class="relative bg-gray-800 text-white rounded-lg shadow-xl w-96 overflow-hidden z-10 border border-gray-700">
          <div class="px-6 pt-5 pb-3">
            <div class="flex items-center gap-3 mb-3">
              <div class="p-2 bg-red-500 bg-opacity-20 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </div>
              <h3 class="text-xl font-medium">Delete Student</h3>
            </div>
            
            <p class="text-gray-300 mb-2">
              Are you sure you want to delete this student?
            </p>
            <p class="text-gray-400 text-sm">
              This action cannot be undone.
            </p>
          </div>
          
          <div class="flex justify-end gap-2 px-6 py-4 bg-gray-900">
            <button id="cancel-delete" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors">
              Cancel
            </button>
            <button id="confirm-delete" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors">
              Delete
            </button>
          </div>
        </div>
      `;
      
      document.body.appendChild(modalContainer);
      
      const closeModal = () => {
        document.body.removeChild(modalContainer);
      };
      
      document.getElementById('modal-backdrop').addEventListener('click', () => {
        closeModal();
        resolve(false);
      });
      
      document.getElementById('cancel-delete').addEventListener('click', () => {
        closeModal();
        resolve(false);
      });
      
      document.getElementById('confirm-delete').addEventListener('click', () => {
        closeModal();
        resolve(true);
      });
    });
  };
  
  // Show the modal and wait for user response
  const confirmed = await showConfirmModal();
  
  if (confirmed) {
    setLoading(true);
    try {
      await axios.delete(`${mockApiUrl}/${id}`);
      
      setStudents(students.filter((student) => student.id !== id));
      setSelectedStudent(null);
      
      toast.success("Student deleted successfully!", {
        icon: "🗑️",
        style: {
          borderRadius: "10px",
          background: darkMode ? "#1F2937" : "#fff",
          color: darkMode ? "#fff" : "#1F2937",
        },
      });
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("Failed to delete student!");
    } finally {
      setLoading(false);
    }
  }
};

  // Handle student detail input changes
  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setSelectedStudent({
      ...selectedStudent,
      [name]: value,
    });
  };

  // Open student details
  const openStudentDetails = (student) => {
    if (user) {
      setSelectedStudent(student);
      setEditMode(false);
    } else {
      toast.error("Please log in to view student details", {
        icon: "🔒",
        style: {
          borderRadius: "10px",
          background: darkMode ? "#1F2937" : "#fff",
          color: darkMode ? "#fff" : "#1F2937",
        },
      });
    }
  };

  // Get grade color
  const getGradeColor = (grade) => {
    if (grade.startsWith("A")) return "bg-emerald-500";
    if (grade.startsWith("B")) return "bg-blue-500";
    if (grade.startsWith("C")) return "bg-amber-500";
    if (grade.startsWith("D")) return "bg-orange-500";
    return "bg-red-500";
  };

  // Get attendance percent as number
  const getAttendancePercent = (attendance) => {
    return parseInt(attendance.replace("%", "")) || 0;
  };

  // Get attendance color
  const getAttendanceColor = (attendance) => {
    const percent = getAttendancePercent(attendance);
    if (percent >= 90) return "bg-gradient-to-r from-emerald-400 to-teal-500";
    if (percent >= 80) return "bg-gradient-to-r from-blue-400 to-cyan-500";
    if (percent >= 70) return "bg-gradient-to-r from-amber-400 to-yellow-500";
    return "bg-gradient-to-r from-red-400 to-rose-500";
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Toast notifications */}
      <Toaster position="top-right" />

      {/* Navbar */}
      <nav className="sticky top-0 z-10 bg-white dark:bg-gray-800 backdrop-blur-lg bg-opacity-70 dark:bg-opacity-70 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 flex justify-between items-center h-16">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-600 shadow-lg flex items-center justify-center text-white font-bold">
              S
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-pink-600 bg-clip-text text-transparent">
              StudentHub
            </h1>
          </motion.div>

          <div className="flex items-center space-x-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors ${
                darkMode
                  ? "bg-gray-700 text-yellow-300"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>

            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2">
                  <img
                    src={user.photoURL || "/api/placeholder/32/32"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full ring-2 ring-indigo-500 object-cover"
                  />
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    {user.displayName}
                  </span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center gap-1 bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white px-3 py-1 rounded-full shadow-md hover:shadow-lg transition-all"
                >
                  <LogOut size={16} />
                  <span className="hidden md:inline">Logout</span>
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleLogin}
                className="flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-pink-600 hover:from-indigo-600 hover:to-pink-700 text-white px-3 py-1 rounded-full shadow-md hover:shadow-lg transition-all"
              >
                <LogIn size={16} />
                <span>Login</span>
              </motion.button>
            )}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        {/* Page title & stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Student Management
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and track student performance and records
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
            <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <User size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Total Students
                </p>
                <p className="text-lg font-bold text-gray-800 dark:text-white">
                  {students.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Filter
                  size={20}
                  className="text-purple-600 dark:text-purple-400"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Active Filters
                </p>
                <p className="text-lg font-bold text-gray-800 dark:text-white">
                  {selectedCourse !== "All" ? 1 : 0}
                  {searchTerm ? "+1" : ""}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls row */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
          {/* Search bar */}
          <motion.div
            className="relative w-full md:w-64 lg:w-80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </motion.div>

          {/* Course filter */}
          <motion.div
            className="relative w-full md:w-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative">
              <button
                onClick={() => setCourseDropdownOpen(!courseDropdownOpen)}
                className="flex items-center justify-between w-full md:w-48 px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white"
              >
                <div className="flex items-center gap-2">
                  <Filter size={16} />
                  <span>{selectedCourse}</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    courseDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {courseDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute mt-2 w-full z-10 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                  {courses.map((course) => (
                    <button
                      key={course}
                      onClick={() => {
                        setSelectedCourse(course);
                        setCourseDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-indigo-50 dark:hover:bg-gray-700 ${
                        selectedCourse === course
                          ? "bg-indigo-50 dark:bg-gray-700"
                          : ""
                      } text-gray-800 dark:text-white`}
                    >
                      {course}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Add student button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              user
                ? setShowAddForm(true)
                : toast.error("Please log in to add a student")
            }
            className="flex items-center gap-2 ml-auto bg-gradient-to-r from-indigo-500 to-pink-600 hover:from-indigo-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Plus size={18} />
            <span>Add Student</span>
          </motion.button>
        </div>

        {/* Students Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
              <div
                className="w-16 h-16 border-r-4 border-l-4  border-pink-500 rounded-full animate-spin absolute top-0 left-0"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "1s",
                }}
              ></div>
            </div>
          </div>
        ) : filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStudents.map((student, index) => (
              <motion.div
                key={student.id}
                data-aos="fade-up"
                data-aos-delay={index * 50}
                whileHover={{ y: -5 }}
                className="group relative rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Card Header with gradient */}
                <div className="h-28 bg-gradient-to-r from-indigo-500 to-pink-600 relative">
                  {/* Optional light overlay for better contrast */}
                  <div className="absolute inset-0 bg-black opacity-10"></div>
                </div>

                {/* Profile Image - Positioned in its own container */}
                <div className="flex justify-center -mt-12 mb-2">
                  <div className="relative">
                    <img
                      src={student.profilePic}
                      alt={student.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/80/80";
                      }}
                    />
                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  </div>
                </div>
                {/* Card Body */}
                <div className="pt-12 px-4 pb-4">
                  <div className="text-center mb-4">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                      {student.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {student.email}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Course
                      </p>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {student.course}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Grade
                      </p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getGradeColor(
                          student.grade
                        )}`}
                      >
                        {student.grade}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>Attendance</span>
                      <span>{student.attendance}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getAttendanceColor(
                          student.attendance
                        )}`}
                        style={{ width: student.attendance }}
                      ></div>
                    </div>
                  </div>

                  <button
                    onClick={() => openStudentDetails(student)}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-50 dark:bg-gray-700 hover:bg-indigo-100 dark:hover:bg-gray-600 text-indigo-600 dark:text-indigo-400 rounded-lg transition-colors"
                  >
                    <Eye size={16} />
                    <span>View Details</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
            <img
              src="/api/placeholder/200/200"
              alt="No results"
              className="mb-4 opacity-70"
            />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              No students found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
              {searchTerm || selectedCourse !== "All"
                ? "Try changing your search or filter criteria"
                : "Add a student to get started"}
            </p>
            {searchTerm || selectedCourse !== "All" ? (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCourse("All");
                }}
                className="px-4 py-2 bg-indigo-100 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 dark:hover:bg-gray-600 transition-colors"
              >
                Clear filters
              </button>
            ) : user ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-pink-600 hover:from-indigo-600 hover:to-pink-700 text-white rounded-lg transition-colors"
              >
                Add Student
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-pink-600 hover:from-indigo-600 hover:to-pink-700 text-white rounded-lg transition-colors"
              >
                Login to Add Student
              </button>
            )}
          </div>
        )}
      </main>

      {/* Add Student Modal */}
      <AnimatePresence>
        {showAddForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-20"
              onClick={() => setShowAddForm(false)}
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-x-4 bottom-4 top-20 md:inset-auto md:top-1/2 md:left-1/2 md:w-full md:max-w-2xl md:transform md:-translate-x-1/2 md:-translate-y-1/2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-30 overflow-hidden"
            >
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Add New Student
                </h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={24} className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(100%-64px)]">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name*
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email*
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Course*
                      </label>
                      <select
                        name="course"
                        value={formData.course}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {courses
                          .filter((c) => c !== "All")
                          .map((course) => (
                            <option key={course} value={course}>
                              {course}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Grade
                      </label>
                      <select
                        name="grade"
                        value={formData.grade}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {[
                          "A+",
                          "A",
                          "A-",
                          "B+",
                          "B",
                          "B-",
                          "C+",
                          "C",
                          "C-",
                          "D",
                          "F",
                        ].map((grade) => (
                          <option key={grade} value={grade}>
                            {grade}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Attendance
                      </label>
                      <input
                        type="text"
                        name="attendance"
                        value={formData.attendance}
                        onChange={handleInputChange}
                        placeholder="e.g. 95%"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-pink-600 hover:from-indigo-600 hover:to-pink-700 text-white rounded-lg transition-colors"
                    >
                      Add Student
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Student Details Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-20"
              onClick={() => setSelectedStudent(null)}
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-x-4 bottom-4 top-20 md:inset-auto md:top-1/2 md:left-1/2 md:w-full md:max-w-2xl md:transform md:-translate-x-1/2 md:-translate-y-1/2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-30 overflow-hidden"
            >
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  {editMode ? "Edit Student" : "Student Details"}
                </h3>

                <div className="flex items-center gap-2">
                  {!editMode && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400"
                    >
                      <Edit size={20} />
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Student details content */}
              <div className="p-6 overflow-y-auto max-h-[calc(100%-64px)]">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <img
                      src={selectedStudent.profilePic}
                      alt={selectedStudent.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg mb-3"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/128/128";
                      }}
                    />

                    {!editMode && (
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-bold text-white ${getGradeColor(
                          selectedStudent.grade
                        )}`}
                      >
                        Grade: {selectedStudent.grade}
                      </div>
                    )}
                  </div>

                  <div className="flex-grow">
                    {editMode ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={selectedStudent.name}
                            onChange={handleDetailChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={selectedStudent.email}
                            onChange={handleDetailChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Course
                          </label>
                          <select
                            name="course"
                            value={selectedStudent.course}
                            onChange={handleDetailChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            {courses
                              .filter((c) => c !== "All")
                              .map((course) => (
                                <option key={course} value={course}>
                                  {course}
                                </option>
                              ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Grade
                          </label>
                          <select
                            name="grade"
                            value={selectedStudent.grade}
                            onChange={handleDetailChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            {[
                              "A+",
                              "A",
                              "A-",
                              "B+",
                              "B",
                              "B-",
                              "C+",
                              "C",
                              "C-",
                              "D",
                              "F",
                            ].map((grade) => (
                              <option key={grade} value={grade}>
                                {grade}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Attendance
                          </label>
                          <input
                            type="text"
                            name="attendance"
                            value={selectedStudent.attendance}
                            onChange={handleDetailChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Phone
                          </label>
                          <input
                            type="text"
                            name="phone"
                            value={selectedStudent.phone}
                            onChange={handleDetailChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Address
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={selectedStudent.address}
                            onChange={handleDetailChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                          <button
                            type="button"
                            onClick={() => setEditMode(false)}
                            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleUpdateStudent}
                            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Save size={16} />
                            <span>Save Changes</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                          {selectedStudent.name}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Email
                            </p>
                            <p className="text-gray-800 dark:text-white">
                              {selectedStudent.email}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Phone
                            </p>
                            <p className="text-gray-800 dark:text-white">
                              {selectedStudent.phone || "Not provided"}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Course
                            </p>
                            <p className="text-gray-800 dark:text-white">
                              {selectedStudent.course}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Join Date
                            </p>
                            <p className="text-gray-800 dark:text-white">
                              {selectedStudent.joinDate}
                            </p>
                          </div>

                          <div className="md:col-span-2">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Address
                            </p>
                            <p className="text-gray-800 dark:text-white">
                              {selectedStudent.address || "Not provided"}
                            </p>
                          </div>

                          <div className="md:col-span-2">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                              Attendance
                            </p>
                            <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${getAttendanceColor(
                                  selectedStudent.attendance
                                )}`}
                                style={{ width: selectedStudent.attendance }}
                              ></div>
                            </div>
                            <p className="text-right text-sm mt-1 text-gray-500 dark:text-gray-400">
                              {selectedStudent.attendance}
                            </p>
                          </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                          <button
                            onClick={() =>
                              handleDeleteStudent(selectedStudent.id)
                            }
                            className="px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-600 dark:text-red-300 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Trash2 size={16} />
                            <span>Delete</span>
                          </button>
                          <button
                            onClick={() => setEditMode(true)}
                            className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800 text-indigo-600 dark:text-indigo-300 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Edit size={16} />
                            <span>Edit</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
