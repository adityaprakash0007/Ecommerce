import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { setUser } from "../redux/userSlice";
import MyOrder from "./MyOrder";

import userLogo from "../assets/user-logo.webp";

const BASE_URL = `${import.meta.env.VITE_URL}/api/v1`;

function ProfileImage({ profilePic, onFileChange }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <img
        src={profilePic || userLogo}
        alt="profile"
        className="w-24 h-24 rounded-full object-cover border-2 border-cyan-400/40 shadow-[0_0_25px_rgba(34,211,238,0.20)]"
      />
      <label className="cursor-pointer text-xs px-3 py-1.5 bg-cyan-400 text-black font-semibold rounded-full hover:bg-cyan-300 transition-all duration-300">
        Upload Photo
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
}

function ProfileForm({ updateUser, handleChange, handleSubmit, updating }) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-cyan-400 text-xs uppercase tracking-wider">First Name</Label>
          <input
            type="text"
            name="firstName"
            value={updateUser.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="w-full mt-1 px-3 py-2 bg-[#050b14] border border-white/10 text-white placeholder:text-gray-500 rounded-lg outline-none focus:ring-1 focus:ring-cyan-400/50 focus:border-cyan-400/40 transition-all"
          />
        </div>
        <div>
          <Label className="text-cyan-400 text-xs uppercase tracking-wider">Last Name</Label>
          <input
            type="text"
            name="lastName"
            value={updateUser.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="w-full mt-1 px-3 py-2 bg-[#050b14] border border-white/10 text-white placeholder:text-gray-500 rounded-lg outline-none focus:ring-1 focus:ring-cyan-400/50 focus:border-cyan-400/40 transition-all"
          />
        </div>
      </div>

      <div>
        <Label className="text-cyan-400 text-xs uppercase tracking-wider">Email</Label>
        <input
          type="email"
          name="email"
          value={updateUser.email}
          disabled
          className="w-full mt-1 px-3 py-2 bg-[#050b14]/50 border border-white/5 text-gray-500 rounded-lg cursor-not-allowed"
        />
      </div>

      <div>
        <Label className="text-cyan-400 text-xs uppercase tracking-wider">Phone Number</Label>
        <input
          type="text"
          name="phoneNo"
          value={updateUser.phoneNo}
          onChange={handleChange}
          placeholder="Enter your contact number"
          className="w-full mt-1 px-3 py-2 bg-[#050b14] border border-white/10 text-white placeholder:text-gray-500 rounded-lg outline-none focus:ring-1 focus:ring-cyan-400/50 focus:border-cyan-400/40 transition-all"
        />
      </div>

      <div>
        <Label className="text-cyan-400 text-xs uppercase tracking-wider">Address</Label>
        <input
          type="text"
          name="address"
          value={updateUser.address}
          onChange={handleChange}
          placeholder="Enter your address"
          className="w-full mt-1 px-3 py-2 bg-[#050b14] border border-white/10 text-white placeholder:text-gray-500 rounded-lg outline-none focus:ring-1 focus:ring-cyan-400/50 focus:border-cyan-400/40 transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-cyan-400 text-xs uppercase tracking-wider">City</Label>
          <input
            type="text"
            name="city"
            value={updateUser.city}
            onChange={handleChange}
            placeholder="Enter your city"
            className="w-full mt-1 px-3 py-2 bg-[#050b14] border border-white/10 text-white placeholder:text-gray-500 rounded-lg outline-none focus:ring-1 focus:ring-cyan-400/50 focus:border-cyan-400/40 transition-all"
          />
        </div>
        <div>
          <Label className="text-cyan-400 text-xs uppercase tracking-wider">Zip Code</Label>
          <input
            type="text"
            name="zipCode"
            value={updateUser.zipCode}
            onChange={handleChange}
            placeholder="Enter zip code"
            className="w-full mt-1 px-3 py-2 bg-[#050b14] border border-white/10 text-white placeholder:text-gray-500 rounded-lg outline-none focus:ring-1 focus:ring-cyan-400/50 focus:border-cyan-400/40 transition-all"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={updating}
        className="w-full bg-cyan-400 text-black font-bold py-2 rounded-lg hover:bg-cyan-300 hover:scale-[1.01] transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
      >
        {updating ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [updating, setUpdating] = useState(false);

  const [updateUser, setUpdateUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    address: "",
    city: "",
    zipCode: "",
    profilePic: "",
    role: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(`${BASE_URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (res.data.success) {
          dispatch(setUser(res.data.user));
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("accessToken");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [dispatch, navigate]);

  useEffect(() => {
    if (user) {
      setUpdateUser({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNo: user.phoneNo || "",
        address: user.address || "",
        city: user.city || "",
        zipCode: user.zipCode || "",
        profilePic: user.profilePic || "",
        role: user.role || "",
      });
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUpdateUser((prev) => ({
        ...prev,
        profilePic: URL.createObjectURL(selectedFile),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      toast.error("Please login again");
      navigate("/login");
      setUpdating(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("firstName", updateUser.firstName);
      formData.append("lastName", updateUser.lastName);
      formData.append("email", updateUser.email);
      formData.append("phoneNo", updateUser.phoneNo);
      formData.append("address", updateUser.address);
      formData.append("city", updateUser.city);
      formData.append("zipCode", updateUser.zipCode);
      formData.append("role", updateUser.role);

      if (file) {
        formData.append("file", file);
      }

      const res = await axios.put(
        `${BASE_URL}/user/update/${user?._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Profile updated successfully");

        dispatch(setUser(res.data.user));

        localStorage.setItem(
          "user",
          JSON.stringify(res.data.user)
        );

        if (file) {
          URL.revokeObjectURL(updateUser.profilePic);
        }

        setFile(null);
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-[#050b14] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-cyan-400/20 border-t-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-20 min-h-screen bg-[#050b14] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Please login to view your profile</p>
          <Button
            onClick={() => navigate("/login")}
            className="bg-cyan-400 text-black font-bold hover:bg-cyan-300"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050b14] text-white flex justify-center px-4 pt-8 pb-16">

      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-cyan-400/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-[350px] h-[350px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

      <Tabs defaultValue="profile" className="relative z-10 w-full max-w-2xl">

        <TabsList className="grid w-full grid-cols-2 bg-[#071426] border border-white/10 rounded-xl p-1">

          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black data-[state=active]:font-bold text-gray-400 rounded-lg transition-all"
          >
            Profile
          </TabsTrigger>

          <TabsTrigger
            value="orders"
            className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black data-[state=active]:font-bold text-gray-400 rounded-lg transition-all"
          >
            Orders
          </TabsTrigger>

        </TabsList>

        <TabsContent value="profile">
          <Card className="mt-4 bg-[#071426] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.30)] rounded-2xl">

            <CardHeader className="flex flex-row justify-between items-start">

              <div>
                <CardTitle className="text-white text-2xl font-black tracking-tight">
                  Edit Profile
                </CardTitle>
                <CardDescription className="text-gray-400 mt-1">
                  Update your personal details
                </CardDescription>
              </div>

              <ProfileImage
                profilePic={updateUser.profilePic}
                onFileChange={handleFileChange}
              />

            </CardHeader>

            <CardContent>
              <ProfileForm
                updateUser={updateUser}
                handleChange={handleChange}
                onSubmit={handleSubmit}
                handleSubmit={handleSubmit}
                updating={updating}
              />
            </CardContent>

          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <MyOrder />
        </TabsContent>

      </Tabs>
    </div>
  );
}

export default Profile;