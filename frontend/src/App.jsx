import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ForgotPassword from "./pages/auth/ForgotPassword";

import RoleSelectionCards from "./components/home/RoleSelectionCards";
import Home from "./pages/home/Home";

import ProtectedRoute from "./components/common/ProtectedRoute";

import EmployerDashboard from "./pages/employer/EmployerDashboard";
import PostJob from "./pages/employer/PostJob";
import CompanyProfile from "./pages/employer/CompanyProfile";
import ManageJobs from "./pages/employer/ManageJobs";
import JobApplicants from "./pages/employer/JobApplicants";
import EmployerProfile from "./pages/employer/EmployerProfile";
import ReviewApplications from "./pages/employer/ReviewApplications";
import EmployerJobDetails from "./pages/employer/EmployerJobDetails";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageJobsAdmin from "./pages/admin/ManageJobs";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageApplications from "./pages/admin/ManageApplications";
import AdminJobDetails from "./pages/admin/AdminJobDetails";
import AdminUserDetails from "./pages/admin/AdminUserDetails";
import ManageCategories from "./pages/admin/ManageCategories";
import ManageJobTypes from "./pages/admin/ManageJobTypes";

import JobseekerDashboard from "./pages/jobseeker/JobseekerDashboard";
import JobDetails from "./pages/jobseeker/JobDetails";
import MyApplications from "./pages/jobseeker/MyApplications";
import SavedJobs from "./pages/jobseeker/SavedJobs";
import JobseekerProfile from "./pages/jobseeker/JobseekerProfile";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/roles" element={<RoleSelectionCards />} />

                <Route path="/jobseeker/login" element={<Login role="jobseeker" />} />
                <Route path="/employer/login" element={<Login role="employer" />} />
                <Route path="/admin/login" element={<Login role="admin" />} />

                <Route path="/jobseeker/register" element={<Register role="jobseeker" />} />
                <Route path="/employer/register" element={<Register role="employer" />} />

                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                
                {/* Protected routes for employer */}
                <Route path="/employer/dashboard" element={
                    <ProtectedRoute allowedRole="employer">
                    <EmployerDashboard />
                    </ProtectedRoute>}/>
                <Route path="/employer/post-job"element={
                    <ProtectedRoute allowedRole="employer">
                    <PostJob />
                    </ProtectedRoute>}/>
                <Route path="/employer/company-profile" element={
                    <ProtectedRoute allowedRole="employer">
                    <CompanyProfile />
                    </ProtectedRoute>}/>
                <Route path="/employer/manage-jobs" element={
                    <ProtectedRoute allowedRole="employer">
                    <ManageJobs />
                    </ProtectedRoute>
                } />
                <Route path="/employer/jobs/:jobId/applicants" element={
                    <ProtectedRoute allowedRole="employer">
                    <JobApplicants />
                    </ProtectedRoute>
                }/>
                <Route path="/employer/profile" element={
                    <ProtectedRoute allowedRole="employer">
                    <EmployerProfile />
                    </ProtectedRoute>
                }/>
                <Route path="/employer/review-applications" element={
                    <ProtectedRoute allowedRole="employer">
                    <ReviewApplications />
                    </ProtectedRoute>
                }/>
                <Route path="/employer/job/:id" element={
                    <ProtectedRoute allowedRole="employer">
                    <EmployerJobDetails />
                    </ProtectedRoute>
                }/>

                {/* Protected routes for admin */}
                <Route path="/admin/dashboard" element={
                    <ProtectedRoute allowedRole="admin">
                    <AdminDashboard />
                    </ProtectedRoute>
                }/>
                <Route path="/admin/manage-jobs" element={
                    <ProtectedRoute allowedRole="admin">
                    <ManageJobsAdmin/>
                    </ProtectedRoute>
                }/>
                <Route path="/admin/users" element={
                    <ProtectedRoute allowedRole="admin">
                    <ManageUsers />
                    </ProtectedRoute>
                }/>
                <Route path="/admin/applications" element={
                    <ProtectedRoute allowedRole="admin">
                    <ManageApplications />
                    </ProtectedRoute>
                }/>
                <Route
                    path="/admin/jobs/:id"
                    element={
                        <ProtectedRoute allowedRole="admin">
                            <AdminJobDetails />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/users/:id"
                    element={
                        <ProtectedRoute allowedRole="admin">
                            <AdminUserDetails />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/categories"
                    element={
                        <ProtectedRoute allowedRole="admin">
                            <ManageCategories />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/job-types"
                    element={
                        <ProtectedRoute allowedRole="admin">
                            <ManageJobTypes />
                        </ProtectedRoute>
                    }
                />

                {/* Protected routes for jobseeker */}
                <Route path="/jobseeker/dashboard" element={
                    <ProtectedRoute allowedRole="jobseeker">
                    <JobseekerDashboard />
                    </ProtectedRoute>
                }/>
                <Route path="/job/:id" element={
                    <ProtectedRoute allowedRole="jobseeker">
                    <JobDetails />
                    </ProtectedRoute>
                }/>
                <Route path="/jobseeker/applications" element={
                    <ProtectedRoute allowedRole="jobseeker">
                    <MyApplications />
                    </ProtectedRoute>
                }/>
                <Route path="/jobseeker/saved-jobs" element={
                    <ProtectedRoute allowedRole="jobseeker">
                    <SavedJobs />
                    </ProtectedRoute>
                }/>
                <Route path="/jobseeker/profile" element={
                    <ProtectedRoute allowedRole="jobseeker">
                    <JobseekerProfile />
                    </ProtectedRoute>
                }/>

            </Routes>
        </BrowserRouter>
    );
}

export default App;