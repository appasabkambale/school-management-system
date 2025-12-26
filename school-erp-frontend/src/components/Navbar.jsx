import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../services/auth";

const Navbar = () => {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 shadow">
      <h2 className="text-lg font-semibold text-slate-800">
        {user.role} Dashboard
      </h2>

      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-600">
          {user.email}
        </span>

        <button
          onClick={handleLogout}
          className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
