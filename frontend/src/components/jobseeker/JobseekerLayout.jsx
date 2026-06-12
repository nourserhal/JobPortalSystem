import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function JobseekerLayout({ children, activePage }) {
    const navigate = useNavigate();

    const [showDropdown, setShowDropdown] = useState(false);
    const [showNotifications, setShowNotifications] =
        useState(false);

    const [notifications, setNotifications] = useState([]);

    const loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser")
    );

    const NOTIFICATIONS_API =
        "http://localhost:5234/api/Notifications";

    useEffect(() => {
        fetchNotifications();
    }, []);

    async function fetchNotifications() {
        if (!loggedInUser) return;

        try {
            const response = await fetch(
                `${NOTIFICATIONS_API}/email/${loggedInUser.email}`
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
        navigate("/jobseeker/login");
    }

    const unreadCount = notifications.filter(
        (n) => !n.isRead
    ).length;

    return (
        <div className="jobseeker-layout">
            <header className="jobseeker-topbar">
                <div
                    className="jobseeker-logo"
                    onClick={() =>
                        navigate("/jobseeker/dashboard")
                    }
                >
                    💼 <span>JobPortal</span>
                </div>

                <nav className="jobseeker-nav">
                    <button
                        className={
                            activePage === "jobs"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            navigate("/jobseeker/dashboard")
                        }
                    >
                        Find Jobs
                    </button>

                    <button
                        className={
                            activePage === "saved"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            navigate(
                                "/jobseeker/saved-jobs"
                            )
                        }
                    >
                        Saved Jobs
                    </button>

                    <button
                        className={
                            activePage === "applications"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            navigate(
                                "/jobseeker/applications"
                            )
                        }
                    >
                        My Applications
                    </button>
                </nav>

                <div className="jobseeker-topbar-actions">

                    <div className="notification-wrapper">
                        <button
                            className="notification-btn"
                            onClick={() =>
                                setShowNotifications(
                                    !showNotifications
                                )
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
                                    <p>
                                        No notifications yet.
                                    </p>
                                ) : (
                                    notifications
                                        .filter(
                                            (
                                                notification
                                            ) =>
                                                !notification.isRead
                                        )
                                        .map(
                                            (
                                                notification
                                            ) => (
                                                <div
                                                    className="notification-item unread-notification"
                                                    key={
                                                        notification.id
                                                    }
                                                    onClick={() =>
                                                        openNotification(
                                                            notification
                                                        )
                                                    }
                                                >
                                                    <strong>
                                                        {
                                                            notification.type
                                                        }
                                                    </strong>

                                                    <p>
                                                        {
                                                            notification.message
                                                        }
                                                    </p>
                                                </div>
                                            )
                                        )
                                )}
                            </div>
                        )}
                    </div>

                    <div className="jobseeker-profile-wrapper">
                        <div
                            className="jobseeker-profile"
                            onClick={() =>
                                setShowDropdown(
                                    !showDropdown
                                )
                            }
                        >
                            <div className="jobseeker-avatar">
                                {loggedInUser?.fullName
                                    ?.charAt(0)
                                    .toUpperCase() ||
                                    loggedInUser?.email
                                        ?.charAt(0)
                                        .toUpperCase() ||
                                    "U"}
                            </div>

                            <div>
                                <h4>
                                    {loggedInUser?.fullName ||
                                        "Jobseeker"}
                                </h4>

                                <p>Jobseeker</p>
                            </div>

                            <span>⌄</span>
                        </div>

                        {showDropdown && (
                            <div className="jobseeker-dropdown">
                                <button
                                    onClick={() =>
                                        navigate(
                                            "/jobseeker/profile"
                                        )
                                    }
                                >
                                    Profile
                                </button>

                                <button
                                    className="logout"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </header>

            <main className="jobseeker-main">
                {children}
            </main>
        </div>
    );
}

export default JobseekerLayout;