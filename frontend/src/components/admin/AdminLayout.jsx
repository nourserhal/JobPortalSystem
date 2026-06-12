import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLayout({ children, activePage }) {
    const navigate = useNavigate();

    const [showDropdown, setShowDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const NOTIFICATIONS_API ="http://localhost:5234/api/Notifications";

    useEffect(() => {
        fetchNotifications();
    }, []);

    async function fetchNotifications() {
        try {
            const response = await fetch(
                `${NOTIFICATIONS_API}/role/admin`
            );

            const data = await response.json();

            setNotifications(data);
        } catch (error) {
            console.log(error);
        }
    }
    async function openNotification(notification) {
        try {
            await fetch(
                `${NOTIFICATIONS_API}/${notification.id}/read`,
                {
                    method: "PUT",
                }
            );

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
        navigate("/admin/login");
    }

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <div className="admin-logo-icon">A</div>

                    <div>
                        <h2>Admin Panel</h2>
                        <p>System Management</p>
                    </div>
                </div>

                <div className="admin-sidebar-menu">
                    <button
                        className={
                            activePage === "dashboard"
                                ? "admin-sidebar-item active"
                                : "admin-sidebar-item"
                        }
                        onClick={() => navigate("/admin/dashboard")}
                    >
                        Dashboard
                    </button>

                    <button
                        className={
                            activePage === "manageJobs"
                                ? "admin-sidebar-item active"
                                : "admin-sidebar-item"
                        }
                        onClick={() => navigate("/admin/manage-jobs")}
                    >
                        Manage Jobs
                    </button>

                    <button
                        className={
                            activePage === "users"
                                ? "admin-sidebar-item active"
                                : "admin-sidebar-item"
                        }
                        onClick={() => navigate("/admin/users")}
                    >
                        Manage Users
                    </button>

                    <button
                        className={
                            activePage === "applications"
                                ? "admin-sidebar-item active"
                                : "admin-sidebar-item"
                        }
                        onClick={() => navigate("/admin/applications")}
                    >
                        Applications
                    </button>

                    <button
                        className={
                            activePage === "categories"
                                ? "admin-sidebar-item active"
                                : "admin-sidebar-item"
                        }
                        onClick={() => navigate("/admin/categories")}
                    >
                        Manage Categories
                    </button>

                    <button
                        className={
                            activePage === "jobTypes"
                                ? "admin-sidebar-item active"
                                : "admin-sidebar-item"
                        }
                        onClick={() => navigate("/admin/job-types")}
                    >
                        Manage Job Types
                    </button>
                </div>

                <button
                    className="admin-logout-btn"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </aside>

            <main className="admin-main">
                <div className="admin-topbar">
                    <div>
                        <h2>Welcome Admin</h2>
                        <p>Manage the entire platform</p>
                    </div>

                    <div className="admin-topbar-actions">
                        <div className="notification-wrapper">
                            <button
                                className="notification-btn"
                                onClick={() =>
                                    setShowNotifications(!showNotifications)
                                }
                            >
                                🔔

                                {notifications.filter((n) => !n.isRead).length > 0 && (
                                    <span className="notification-badge">
                                        {notifications.filter((n) => !n.isRead).length}
                                    </span>
                                )}
                            </button>

                            {showNotifications && (
                                <div className="notification-dropdown">
                                    <h4>Notifications</h4>

                                    {notifications.length === 0 ? (
                                        <p>No notifications yet.</p>
                                    ) : (
                                        notifications
                                            .filter((notification) => !notification.isRead)
                                            .map((notification) => (
                                            <div
                                                className={notification.isRead
                                                    ? "notification-item"
                                                    : "notification-item unread-notification"}
                                                key={notification.id}
                                                onClick={() =>
                                                    openNotification(notification)
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

                        <div className="admin-profile-wrapper">
                            <div
                                className="admin-profile"
                                onClick={() =>
                                    setShowDropdown(!showDropdown)
                                }
                            >
                                <div className="admin-avatar">
                                    {loggedInUser?.email
                                        ?.charAt(0)
                                        .toUpperCase() || "A"}
                                </div>

                                <div>
                                    <h4>Administrator</h4>
                                    <p>{loggedInUser?.email}</p>
                                </div>

                                <span className="admin-profile-arrow">
                                    ⌄
                                </span>
                            </div>

                            {showDropdown && (
                                <div className="admin-profile-dropdown">
                                    <button onClick={handleLogout}>
                                        Logout
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

export default AdminLayout;