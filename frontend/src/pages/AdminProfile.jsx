import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import api from "../services/api";

function AdminProfile() {

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    // ==========================================
    // Profile Form
    // ==========================================

    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        address: ""
    });

    // ==========================================
    // Password Form
    // ==========================================

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const fileInputRef = useRef(null);

    // ==========================================
    // Fetch Profile
    // ==========================================

    const fetchProfile = async () => {

        try {

            setLoading(true);

            const response = await api.get("/profile");

            const data = response.data;

            setProfile(data);

            setFormData({
                email: data.email || "",
                phone: data.phone || "",
                address: data.address || ""
            });

        } catch (error) {

            console.error(
                "Admin profile error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to load profile."
            );

        } finally {

            setLoading(false);

        }

    };

    // ==========================================
    // Load Profile
    // ==========================================

    useEffect(() => {

        fetchProfile();

    }, []);

    // ==========================================
    // Form Change
    // ==========================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

    };

    // ==========================================
    // Update Profile
    // ==========================================

    const handleSaveProfile = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);

            await api.put(
                "/profile",
                formData
            );

            toast.success(
                "Profile updated successfully."
            );

            await fetchProfile();

            window.dispatchEvent(
                new Event("profileUpdated")
            );

        } catch (error) {

            console.error(
                "Update profile error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to update profile."
            );

        } finally {

            setSaving(false);

        }

    };

    // ==========================================
    // Photo
    // ==========================================

    const handlePhotoClick = () => {

        fileInputRef.current?.click();

    };

    // ==========================================
    // Upload Photo
    // ==========================================

    const handlePhotoUpload = async (e) => {

        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {

            toast.error(
                "Only JPG, JPEG, PNG and WEBP images are allowed."
            );

            e.target.value = "";

            return;
        }

        if (file.size > 2 * 1024 * 1024) {

            toast.error(
                "Image size must be less than 2 MB."
            );

            e.target.value = "";

            return;
        }

        try {

            setUploading(true);

            const data = new FormData();

            data.append(
                "profile_image",
                file
            );

            const response = await api.post(
                "/profile/photo",
                data
            );

            setProfile(prev => ({
                ...prev,
                profile_image:
                    response.data.profile_image
            }));

            window.dispatchEvent(
                new Event("profileUpdated")
            );

            toast.success(
                "Profile photo updated successfully."
            );

        } catch (error) {

            console.error(
                "Profile photo error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to upload profile photo."
            );

        } finally {

            setUploading(false);

            e.target.value = "";

        }

    };

    // ==========================================
    // Password
    // ==========================================

    const handlePasswordChange = (e) => {

        const { name, value } = e.target;

        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));

    };

    // ==========================================
    // Change Password
    // ==========================================

    const handleChangePassword = async (e) => {

        e.preventDefault();

        if (
            !passwordData.currentPassword ||
            !passwordData.newPassword ||
            !passwordData.confirmPassword
        ) {

            toast.error(
                "Please fill all password fields."
            );

            return;
        }

        if (
            passwordData.newPassword !==
            passwordData.confirmPassword
        ) {

            toast.error(
                "New passwords do not match."
            );

            return;
        }

        if (
            passwordData.newPassword.length < 6
        ) {

            toast.error(
                "New password must be at least 6 characters."
            );

            return;
        }

        try {

            setChangingPassword(true);

            await api.put(
                "/profile/password",
                {
                    currentPassword:
                        passwordData.currentPassword,

                    newPassword:
                        passwordData.newPassword
                }
            );

            toast.success(
                "Password changed successfully."
            );

            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

        } catch (error) {

            console.error(
                "Change password error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to change password."
            );

        } finally {

            setChangingPassword(false);

        }

    };

    // ==========================================
    // Loading
    // Keep Layout mounted
    // ==========================================

    if (loading) {

        return (

            <Layout>

                <div className="container-fluid py-5 text-center">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    ></div>

                    <p className="text-muted mt-3">
                        Loading profile...
                    </p>

                </div>

            </Layout>

        );

    }

    // ==========================================
    // Profile Not Found
    // ==========================================

    if (!profile) {

        return (

            <Layout>

                <div className="container-fluid py-5">

                    <div className="alert alert-danger">
                        Unable to load profile.
                    </div>

                </div>

            </Layout>

        );

    }

    // ==========================================
    // UI
    // ==========================================

    return (

        <Layout>

            <div className="container-fluid">

                {/* =====================================
                    HEADER
                ===================================== */}

                <div className="mb-4">

                    <h2 className="fw-bold mb-1">
                        My Profile
                    </h2>

                    <p className="text-muted">
                        Manage your administrator account.
                    </p>

                </div>

                {/* =====================================
                    PROFILE HEADER
                ===================================== */}

                <div className="card border-0 shadow-sm rounded-4 mb-4">

                    <div className="card-body p-4">

                        <div className="row align-items-center">

                            {/* PHOTO */}

                            <div className="col-md-3 text-center">

                                <div
                                    className="mx-auto"
                                    style={{
                                        width: "150px",
                                        height: "150px"
                                    }}
                                >

                                    {profile.profile_image ? (

                                        <img
                                            src={profile.profile_image}
                                            alt="Profile"
                                            className="rounded-circle shadow"
                                            style={{
                                                width: "150px",
                                                height: "150px",
                                                objectFit: "cover"
                                            }}
                                        />

                                    ) : (

                                        <div
                                            className="rounded-circle bg-dark text-white d-flex justify-content-center align-items-center shadow"
                                            style={{
                                                width: "150px",
                                                height: "150px",
                                                fontSize: "55px"
                                            }}
                                        >

                                            <i className="bi bi-person-fill"></i>

                                        </div>

                                    )}

                                </div>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handlePhotoUpload}
                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                    style={{
                                        display: "none"
                                    }}
                                />

                                <button
                                    type="button"
                                    className="btn btn-dark rounded-pill mt-3 px-4"
                                    onClick={handlePhotoClick}
                                    disabled={uploading}
                                >

                                    {uploading ? (

                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                            ></span>

                                            Uploading...
                                        </>

                                    ) : (

                                        <>
                                            <i className="bi bi-camera-fill me-2"></i>

                                            Change Photo
                                        </>

                                    )}

                                </button>

                                <small className="text-muted d-block mt-2">
                                    JPG, PNG or WEBP • Max 2 MB
                                </small>

                            </div>

                            {/* BASIC INFO */}

                            <div className="col-md-9 mt-4 mt-md-0">

                                <div className="d-flex align-items-center mb-2">

                                    <h3 className="fw-bold mb-0">
                                        {profile.username}
                                    </h3>

                                    <span className="badge bg-dark ms-3">
                                        ADMIN
                                    </span>

                                </div>

                                <p className="text-muted mb-0">

                                    <i className="bi bi-shield-check me-2"></i>

                                    School Management System Administrator

                                </p>

                            </div>

                        </div>

                    </div>

                </div>

                {/* =====================================
                    INFORMATION
                ===================================== */}

                <div className="row">

                    {/* PERSONAL INFORMATION */}

                    <div className="col-lg-7 mb-4">

                        <div className="card border-0 shadow-sm rounded-4">

                            <div className="card-header bg-white border-0 pt-4 px-4">

                                <h5 className="fw-bold">

                                    <i className="bi bi-person-lines-fill text-primary me-2"></i>

                                    Personal Information

                                </h5>

                                <small className="text-muted">
                                    Update your contact information.
                                </small>

                            </div>

                            <div className="card-body p-4">

                                <form onSubmit={handleSaveProfile}>

                                    {/* USERNAME */}

                                    <div className="mb-3">

                                        <label className="form-label fw-semibold">
                                            Username
                                        </label>

                                        <input
                                            className="form-control bg-light"
                                            value={
                                                profile.username || ""
                                            }
                                            disabled
                                        />

                                        <small className="text-muted">
                                            Username cannot be changed.
                                        </small>

                                    </div>

                                    {/* EMAIL */}

                                    <div className="mb-3">

                                        <label className="form-label fw-semibold">
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    {/* PHONE */}

                                    <div className="mb-3">

                                        <label className="form-label fw-semibold">
                                            Phone
                                        </label>

                                        <input
                                            type="text"
                                            name="phone"
                                            className="form-control"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    {/* ADDRESS */}

                                    <div className="mb-4">

                                        <label className="form-label fw-semibold">
                                            Address
                                        </label>

                                        <textarea
                                            name="address"
                                            className="form-control"
                                            rows="3"
                                            value={formData.address}
                                            onChange={handleChange}
                                        ></textarea>

                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary rounded-pill px-4"
                                        disabled={saving}
                                    >

                                        {saving ? (

                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                ></span>

                                                Saving...
                                            </>

                                        ) : (

                                            <>
                                                <i className="bi bi-check-lg me-2"></i>

                                                Save Changes
                                            </>

                                        )}

                                    </button>

                                </form>

                            </div>

                        </div>

                    </div>

                    {/* SECURITY */}

                    <div className="col-lg-5 mb-4">

                        <div className="card border-0 shadow-sm rounded-4">

                            <div className="card-header bg-white border-0 pt-4 px-4">

                                <h5 className="fw-bold">

                                    <i className="bi bi-shield-lock-fill text-danger me-2"></i>

                                    Security

                                </h5>

                                <small className="text-muted">
                                    Change your account password.
                                </small>

                            </div>

                            <div className="card-body p-4">

                                <form onSubmit={handleChangePassword}>

                                    <input
                                        type="password"
                                        name="currentPassword"
                                        className="form-control mb-3"
                                        placeholder="Current Password"
                                        value={
                                            passwordData.currentPassword
                                        }
                                        onChange={handlePasswordChange}
                                    />

                                    <input
                                        type="password"
                                        name="newPassword"
                                        className="form-control mb-3"
                                        placeholder="New Password"
                                        value={
                                            passwordData.newPassword
                                        }
                                        onChange={handlePasswordChange}
                                    />

                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        className="form-control mb-4"
                                        placeholder="Confirm New Password"
                                        value={
                                            passwordData.confirmPassword
                                        }
                                        onChange={handlePasswordChange}
                                    />

                                    <button
                                        type="submit"
                                        className="btn btn-danger rounded-pill w-100"
                                        disabled={changingPassword}
                                    >

                                        {changingPassword ? (

                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                ></span>

                                                Changing Password...
                                            </>

                                        ) : (

                                            <>
                                                <i className="bi bi-key-fill me-2"></i>

                                                Change Password
                                            </>

                                        )}

                                    </button>

                                </form>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </Layout>

    );

}

export default AdminProfile;