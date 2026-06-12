import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function EmployerLayout({ children, activePage }) {
    const navigate = useNavigate();

    const [showProfile, setShowProfile] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    const NOTIFICATIONS_API = "http://localhost:5234/api/Notifications";

    useEffect(() => {
        fetchNotifications();
    }, []);

    async function fetchNotifications() {
        if (!loggedInUser) return;

        try {
            const response = await fetch(
                `${NOTIFICATIONS_API}/user/${loggedInUser.id}`
            );

            const data = await response.json();
            setNotifications(data);
        } catch (error) {
            console.log(error);
        }
    }

    async function openNotification(notification) {
        try {
            await fetch(`${NOTIFICATIONS_API}/${notification.id}/read`, {
                method: "PUT",
            });

            fetchNotifications();

            if (notification.targetUrl) {
                navigate(notification.targetUrl);
            }
        } catch (error) {
            console.log(error);
        }
    }

    function handleLogout() {
        localStorage.removeItem("loggedInUser");
        navigate("/employer/login");
    }

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <div className="employer-dashboard">
            <aside className="dashboard-sidebar">
                <div className="dashboard-logo">
                    <div className="logo-icon">💼</div>
                    <h2>JobPortal</h2>
                </div>

                <nav className="sidebar-menu">
                    <button
                        className={
                            activePage === "dashboard"
                                ? "sidebar-item active"
                                : "sidebar-item"
                        }
                        onClick={() => navigate("/employer/dashboard")}
                    >
                        Dashboard
                    </button>

                    <button
                        className={
                            activePage === "postJob"
                                ? "sidebar-item active"
                                : "sidebar-item"
                        }
                        onClick={() => navigate("/employer/post-job")}
                    >
                        Post Job
                    </button>

                    <button
                        className={
                            activePage === "manageJobs"
                                ? "sidebar-item active"
                                : "sidebar-item"
                        }
                        onClick={() => navigate("/employer/manage-jobs")}
                    >
                        Manage Jobs
                    </button>

                    <button
                        className={
                            activePage === "reviewApplications"
                                ? "sidebar-item active"
                                : "sidebar-item"
                        }
                        onClick={() =>
                            navigate("/employer/review-applications")
                        }
                    >
                        Review Applications
                    </button>

                    <button
                        className={
                            activePage === "companyProfile"
                                ? "sidebar-item active"
                                : "sidebar-item"
                        }
                        onClick={() =>
                            navigate("/employer/company-profile")
                        }
                    >
                        Company Profile
                    </button>
                </nav>

                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </aside>

            <main className="dashboard-main">
                <div className="dashboard-topbar">
                    <div>
                        <h2>Welcome back!</h2>
                        <p>Here's what's happening with your jobs today.</p>
                    </div>

                    <div className="topbar-actions">
                        <div className="notification-wrapper">
                            <button
                                className="notification-btn"
                                onClick={() =>
                                    setShowNotifications(!showNotifications)
                                }
                            >
                                🔔

                                {unreadCount > 0 && (
                                    <span className="notification-badge">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {showNotifications && (
                                <div className="notification-dropdown">
                                    <h4>Notifications</h4>

                                    {unreadCount === 0 ? (
                                        <p>No notifications yet.</p>
                                    ) : (
                                        notifications
                                            .filter(
                                                (notification) =>
                                                    !notification.isRead
                                            )
                                            .map((notification) => (
                                                <div
                                                    className="notification-item unread-notification"
                                                    key={notification.id}
                                                    onClick={() =>
                                                        openNotification(
                                                            notification
                                                        )
                                                    }
                                                >
                                                    <strong>
                                                        {notification.type}
                                                    </strong>

                                                    <p>
                                                        {notification.message}
                                                    </p>
                                                </div>
                                            ))
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="profile-wrapper">
                            <div
                                className="employer-profile"
                                onClick={() =>
                                    setShowProfile(!showProfile)
                                }
                            >
                                <div className="profile-avatar">
                                    {loggedInUser?.email
                                        ?.charAt(0)
                                        .toUpperCase() || "E"}
                                </div>

                                <div>
                                    <h4>
                                        {loggedInUser?.email || "Employer"}
                                    </h4>
                                    <p>Employer</p>
                                </div>

                                <span className="profile-arrow">⌄</span>
                            </div>

                            {showProfile && (
                                <div className="profile-dropdown">
                                    <div className="profile-dropdown-header">
                                        <div className="profile-avatar">
                                            {loggedInUser?.email
                                                ?.charAt(0)
                                                .toUpperCase() || "E"}
                                        </div>

                                        <div>
                                            <h4>
                                                {loggedInUser?.email ||
                                                    "Employer"}
                                            </h4>
                                            <p>
                                                {loggedInUser?.role ||
                                                    "employer"}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() =>
                                            navigate("/employer/profile")
                                        }
                                    >
                                        View Profile
                                    </button>

                                    <button
                                        onClick={handleLogout}
                                        className="signout-btn"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {children}
            </main>
        </div>
    );
}

export default EmployerLayout;