import {BrowserRouter, Routes, Route} from "react-router-dom"
import HomePage from "./components/HomePage"
import Navbar from "./components/Navbar"
import LoginForm from "./components/AuthForm"
import axios from "axios"
import './App.css';
import StudentForm from "./components/StudentForm"
import StudentProfile from "./components/StudentProfile"
import StudentDashboard from "./components/StudentDashboard"
// import About from "./components/About"
import RegisterStudent from "./components/RegisterStudent"
import LoginStudent from "./components/Login"
import TeacherRegister from "./components/Teacherregister"
import TeacherLogin from "./components/TeacherLogin"
import TeacherDashboard from "./components/TeacherDashboard"
axios.defaults.baseURL = "http://localhost:5000"
function App() {

  return (
    <>
     <BrowserRouter>
     {/* <Dashboard/> */}
     <Navbar />
     

     <Routes>
       <Route exact path="/student-profile" element={<StudentDashboard />} />
       {/* <Route exact path="/about" element={<About/>} /> */}
       <Route exact path="/register" element={<RegisterStudent />} />
       <Route exact path="/login" element={<LoginStudent />} />
       <Route exact path="/" element={<HomePage />} />
       <Route exact path="/studnet-dashboard" element={<StudentForm />} />
       <Route exact path="/teacher-register" element={<TeacherRegister />} />
       <Route exact path="/teacher-login" element={<TeacherLogin />} />
       <Route exact path="/teacher-dashboard" element={<TeacherDashboard />} />
     </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
