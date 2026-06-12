import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

function ManageCategories() {
    const API_URL = "http://localhost:5234/api/JobCategories";

    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        const response = await fetch(API_URL);
        const data = await response.json();
        setCategories(data);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!name.trim()) {
            alert("Category name is required");
            return;
        }

        const category = {
            name: name,
        };

        if (editingId) {
            const response = await fetch(`${API_URL}/${editingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(category),
            });

            if (response.ok) {
                alert("Category updated");
                setEditingId(null);
                setName("");
                fetchCategories();
            } else {
                alert("Failed to update category");
            }
        } else {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(category),
            });

            if (response.ok) {
                alert("Category added");
                setName("");
                fetchCategories();
            } else {
                alert("Failed to add category");
            }
        }
    }

    function startEdit(category) {
        setEditingId(category.id);
        setName(category.name);
    }

    async function deleteCategory(id) {
        if (!window.confirm("Delete this category?")) return;

        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert("Category deleted");
            fetchCategories();
        } else {
            alert("Failed to delete category");
        }
    }

    return (
        <AdminLayout activePage="categories">
            <div className="admin-dashboard">
                <h1>Manage Categories</h1>
                <p>Add, update, and remove job categories.</p>

                <div className="admin-panel">
                    <form className="admin-inline-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Category name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <button type="submit" className="approve-btn">
                            {editingId ? "Update Category" : "Add Category"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                className="reject-btn"
                                onClick={() => {
                                    setEditingId(null);
                                    setName("");
                                }}
                            >
                                Cancel
                            </button>
                        )}
                    </form>

                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Category Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan="3">No categories found.</td>
                                </tr>
                            ) : (
                                categories.map((category) => (
                                    <tr key={category.id}>
                                        <td>{category.id}</td>
                                        <td>{category.name}</td>
                                        <td>
                                            <div className="admin-actions-row">
                                                <button
                                                    className="approve-btn"
                                                    onClick={() => startEdit(category)}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="reject-btn"
                                                    onClick={() =>
                                                        deleteCategory(category.id)
                                                    }
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

export default ManageCategories;