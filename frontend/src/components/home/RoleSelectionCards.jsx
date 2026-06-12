import { useNavigate } from "react-router-dom";
import jobseekerImg from "../../assets/jobseeker.jpg";
import employerImg from "../../assets/employer.jpg";
import adminImg from "../../assets/admin.jpg";
import "../../styles/home.css";

function RoleSelectionCards() {
    const navigate = useNavigate();

    const roles = [
        {
            title: "Job Seeker",
            text: "Find jobs, apply easily, and track your applications.",
            image: jobseekerImg,
            path: "/jobseeker/login",
        },
        {
            title: "Employer",
            text: "Post jobs, manage applicants, and hire top talent.",
            image: employerImg,
            path: "/employer/login",
        },
        {
            title: "Admin",
            text: "Review job posts, manage users, and control the system.",
            image: adminImg,
            path: "/admin/login",
        },
    ];

    return (
        <section id="roles" className="roles-section">
            <div className="roles-container">
                <div className="roles-header">
                    <span>Choose your access</span>
                    <h2>Select Your Role</h2>
                    <p>
                        Start from the right place based on how you want to use JobPortal.
                    </p>
                </div>

                <div className="roles-grid">
                    {roles.map((role) => (
                        <div className="role-card" key={role.title}>
                            <img src={role.image} alt={role.title} />

                            <div className="role-card-body">
                                <h3>{role.title}</h3>
                                <p>{role.text}</p>

                                <button onClick={() => navigate(role.path)}>
                                    Get Started
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default RoleSelectionCards;