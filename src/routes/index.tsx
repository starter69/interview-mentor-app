import { Route, Routes } from "react-router-dom";

import Home from "../pages/Home";
import MyInterview from "../pages/MyInterview";
import Profile from "../pages/Profile";

const AppRoutes = () => (
  <Routes>
    <Route path="/interviews" element={<Home />} />
    <Route path="/my-interviews" element={<MyInterview />} />
    <Route path="/profile" element={<Profile />} />
  </Routes>
);

export default AppRoutes;
