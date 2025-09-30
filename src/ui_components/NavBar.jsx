import { Switch } from "@/components/ui/switch";
import { FaHamburger } from "react-icons/fa";
import ResponsiveNavBar from "./ResponsiveNavBar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const NavBar = ({
  darkMode,
  handleDarkMode,
  isAuthenticated,
  username,
  setIsAuthenticated,
  setUsername,
}) => {
  const [showNavBar, setShowNavBar] = useState(false);
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsAuthenticated(false);
    setUsername(null);
    //toast.success("Logged out successfully!");
    navigate("/", { replace: true });
  }

  return (
    <>
      <nav className="max-container padding-x py-6 flex justify-between items-center  gap-6 sticky top-0 z-10 bg-[#FFFFFF] dark:bg-[#141624]">
        <Link 
          to={isAuthenticated ? "/app" : "/"} 
          className="text-[#141624] text-2xl dark:text-[#FFFFFF]">
          SDA
        </Link>
        <ul className="flex items-center  justify-end gap-9 text-[#3B3C4A] lg:flex-1 max-md:hidden dark:text-[#FFFFFF]">
          {isAuthenticated ? (
            <>
              <li><NavLink
                  to={`/app/profile/${username}`}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Hola, {username}
                </NavLink></li>
              <li onClick={logout} className="cursor-pointer">
                Salir
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Acceder
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/app/signup"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Registro
                </NavLink>
              </li>
            </>
          )}

          <li className="font-semibold">
            <NavLink
              to="/app/create"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Crear registro
            </NavLink>
          </li>
        </ul>

        <Switch onCheckedChange={handleDarkMode} checked={darkMode} />
        <FaHamburger
          className="text-2xl cursor-pointer hidden max-md:block dark:text-white"
          onClick={() => setShowNavBar((curr) => !curr)}
        />
      </nav>

      {showNavBar && (
        <ResponsiveNavBar
          isAuthenticated={isAuthenticated}
          username={username}
          logout={logout}
        />
      )}
    </>
  );
};

export default NavBar;