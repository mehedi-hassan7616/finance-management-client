import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AuthContext } from "@/context/auth-context";
import { toast } from "sonner";
import { User, Camera } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/spinner";

export default function MyProfilePage() {
  const { user, profileUpdate } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    photoURL: user?.photoURL || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (profileUpdate) {
        const profileData = {};
        if (formData.displayName)
          profileData.displayName = formData.displayName;
        if (formData.photoURL) profileData.photoURL = formData.photoURL;

        await profileUpdate(profileData);
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(
        error.message || "Failed to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">
              Please log in to view your profile.
            </p>
            <Button onClick={() => navigate("/login")}>Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">My Profile</CardTitle>
          <CardDescription>Manage your profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {/* Profile Photo */}
          <div className="flex flex-col items-center gap-4 pb-6 border-b">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={formData.photoURL || user.photoURL}
                alt={formData.displayName || "User"}
              />
              <AvatarFallback className="text-2xl">
                {formData.displayName
                  ? formData.displayName.charAt(0).toUpperCase()
                  : user.email
                  ? user.email.charAt(0).toUpperCase()
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="font-semibold text-lg">
                {formData.displayName || user.displayName || "User"}
              </p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="space-y-2">
              <Label htmlFor="displayName">
                <User className="inline h-4 w-4 mr-2" />
                Name
              </Label>
              <Input
                id="displayName"
                name="displayName"
                type="text"
                placeholder="Your name"
                value={formData.displayName}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photoURL">
                <Camera className="inline h-4 w-4 mr-2" />
                Photo URL
              </Label>
              <Input
                id="photoURL"
                name="photoURL"
                type="url"
                placeholder="https://example.com/photo.jpg"
                value={formData.photoURL}
                onChange={handleChange}
              />
              <p className="text-xs text-muted-foreground">
                Enter a URL for your profile picture
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Updating..." : "Update Profile"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
