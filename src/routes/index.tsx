import { Route, Routes } from "react-router-dom";

import Home from "pages/Home";
import MyInterview from "pages/MyInterview";
import Profile from "pages/Profile";
import Login from "pages/Login";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/interviews" element={<Home />} />
      <Route path="/my-interviews" element={<MyInterview />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
