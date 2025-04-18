// ProtectedRoute.js
import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import LoginModal from "./components/LoginModal";

function ProtectedRoute({ children }) {
  const { showLogin , loginData } = useContext(AppContext);
  const location = useLocation();

  if (loginData==null) {
    return (
      <div>
        <LoginModal/>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;