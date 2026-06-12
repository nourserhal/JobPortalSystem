import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";

function ManageUsers() {
    const navigate = useNavigate();
    const API_URL = "http://localhost:5234/api/User";

    const [users, setUsers] = useState([]);
    const [roleFilter, setRoleFilter] = useState("All");
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.log(error);
            alert("Error fetching users");
        }
    }

    async function deleteUser(id) {
        if (!window.confirm("Delete this user?")) return;

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("User deleted");
                fetchUsers();
            } else {
                const error = await response.text();
                alert(error);
            }
        } catch (error) {
            console.log(error);
            alert("Server error");
        }
    }

    const filteredUsers = users.filter((user) => {
        const matchesRole =
            roleFilter === "All" || user.role === roleFilter;

        const matchesSearch =
            user.email?.toLowerCase().includes(search.toLowerCase()) ||
            user.fullName?.toLowerCase().includes(search.toLowerCase()) ||
            user.companyName?.toLowerCase().includes(search.toLowerCase()) ||
            user.hrName?.toLowerCase().includes(search.toLowerCase());

        return matchesRole && matchesSearch;
    });

    return (
        <AdminLayout activePage="users">
            <div className="admin-dashboard">
                <h1>Manage Users</h1>
                <p>View, block, unblock, and manage platform users.</p>

                <div className="admin-panel">
                    <div className="admin-filters">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="All">All Roles</option>
                            <option value="employer">Employer</option>
                            <option value="jobseeker">Jobseeker</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <p className="showing-text">
                        Showing {filteredUsers.length} of {users.length} users
                    </p>

                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5">No users found.</td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <button
                                                className="table-link-btn"
                                                onClick={() =>
                                                    navigate(`/admin/users/${user.id}`)
                                                }
                                            >
                                                {user.role === "employer"
                                                    ? user.companyName || "Employer"
                                                    : user.fullName || "User"}
                                            </button>
                                        </td>

                                        <td>{user.email}</td>

                                        <td>
                                            <span className="admin-role-badge">
                                                {user.role}
                                            </span>
                                        </td>

                                        <td>
                                            {user.isBlocked ? (
                                                <span className="status-badge rejected">
                                                    Blocked
                                                </span>
                                            ) : (
                                                <span className="status-badge active">
                                                    Active
                                                </span>
                                            )}

                                            {user.isBlocked && user.blockReason && (
                                                <p className="rejection-reason">
                                                    Reason: {user.blockReason}
                                                </p>
                                            )}
                                        </td>

                                        <td>
                                            <div className="admin-actions-row">
                                                <button
                                                    className="approve-btn"
                                                    onClick={() =>
                                                        navigate(`/admin/users/${user.id}`)
                                                    }
                                                >
                                                    View Profile
                                                </button>

                                                <button
                                                    className="reject-btn"
                                                    onClick={() => deleteUser(user.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}

export default ManageUsers;