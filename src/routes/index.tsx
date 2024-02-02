import { Route, Routes } from "react-router-dom";
import Home from "pages/Home";
import MyInterview from "pages/MyInterview";
import Profile from "pages/Profile";
import Login from "pages/Login";
import User from "pages/User";
import TeamsManagement from "pages/TeamsManagement";
import InterviewDetail from "pages/InterviewDetail";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="interviews/:id/detail" element={<InterviewDetail />} />
      <Route path="/interviews" element={<Home />} />
      <Route path="/my-interviews" element={<MyInterview />} />
      <Route path="/teams-management" element={<TeamsManagement />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/users-management" element={<User />} />
    </Routes>
  );
};

export default AppRoutes;
