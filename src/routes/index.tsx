import { Route, Routes } from "react-router-dom";
import Home from "pages/Home";
import Profile from "pages/Profile";
import Login from "pages/Login";
import Management from "pages/Management";
import InterviewDetail from "pages/InterviewDetail";
import MyInterview from "pages/MyInterview";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="interviews/:id/detail" element={<InterviewDetail />} />
      <Route path="/interviews" element={<Home />} />
      <Route path="/my-interviews" element={<MyInterview />} />
      <Route path="/management" element={<Management />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
