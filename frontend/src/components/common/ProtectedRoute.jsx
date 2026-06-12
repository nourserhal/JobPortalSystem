import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!user) {
        return <Navigate to="/roles" />;
    }

    if (user.role !== allowedRole) {
        return <Navigate to="/roles" />;
    }

    return children;
}

export default ProtectedRoute;