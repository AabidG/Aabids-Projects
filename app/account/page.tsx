"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  User,
  Settings,
  Bell,
  Shield,
  Palette,
  Heart,
  Sparkles,
  Eye,
  Clock,
  MapPin,
  Building2,
  Edit,
  Camera,
  Mail,
  Calendar,
  BarChart3,
  Bookmark,
  Download,
  Share2,
} from "lucide-react"

// Mock user data
const mockUser = {
  id: "user-123",
  name: "Alex Johnson",
  email: "alex.johnson@email.com",
  phone: "+1 (555) 123-4567",
  avatar: "/placeholder.svg?height=120&width=120",
  joinDate: "2023-06-15",
  location: "San Francisco, CA",
  bio: "Tech enthusiast and global news follower. Passionate about AI, climate change, and international politics.",
  verified: true,
  premium: false,
  stats: {
    articlesRead: 1247,
    timeSpent: 89, // hours
    followedSources: 23,
    followedLocations: 8,
    bookmarkedArticles: 156,
    sharedArticles: 89,
  },
  preferences: {
    notifications: {
      breaking: true,
      following: true,
      recommendations: false,
      weekly: true,
    },
    privacy: {
      profilePublic: false,
      showReadingHistory: false,
      allowRecommendations: true,
    },
    display: {
      darkMode: true,
      compactView: false,
      autoplay: false,
    },
  },
  recentActivity: [
    {
      type: "read",
      title: "Breakthrough in Quantum Computing Achieved",
      source: "MIT Technology Review",
      time: "2 hours ago",
    },
    {
      type: "bookmark",
      title: "Revolutionary Gene Therapy Shows Promise",
      source: "Nature Medicine",
      time: "5 hours ago",
    },
    {
      type: "follow",
      title: "Started following BBC Science",
      source: "BBC Science",
      time: "1 day ago",
    },
    {
      type: "share",
      title: "Global Climate Agreement Reached",
      source: "Reuters",
      time: "2 days ago",
    },
  ],
}

export default function AccountPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [userInfo, setUserInfo] = useState(mockUser)

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically save to backend
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "read":
        return <Eye className="w-4 h-4 text-blue-400" />
      case "bookmark":
        return <Bookmark className="w-4 h-4 text-yellow-400" />
      case "follow":
        return <Heart className="w-4 h-4 text-red-400" />
      case "share":
        return <Share2 className="w-4 h-4 text-green-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Space Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="absolute inset-0 opacity-20">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => router.push("/")} className="text-gray-300 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div className="flex items-center gap-3">
              <User className="w-8 h-8 text-blue-400" />
              <h1 className="text-4xl font-bold text-white">Account & Settings</h1>
            </div>
          </div>
        </div>

        {/* Profile Header Card */}
        <Card className="bg-black/60 border-gray-700 mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="relative">
                <Image
                  src={userInfo.avatar || "/placeholder.svg"}
                  alt={userInfo.name}
                  width={120}
                  height={120}
                  className="rounded-full object-cover border-4 border-blue-500"
                />
                <Button size="sm" className="absolute bottom-0 right-0 rounded-full bg-blue-600 hover:bg-blue-700 p-2">
                  <Camera className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-white">{userInfo.name}</h2>
                  {userInfo.verified && <Badge className="bg-blue-600 text-white">Verified</Badge>}
                  {userInfo.premium && <Badge className="bg-yellow-600 text-white">Premium</Badge>}
                </div>
                <p className="text-gray-300 mb-4">{userInfo.bio}</p>
                <div className="flex items-center gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {userInfo.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {userInfo.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(userInfo.joinDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <Button onClick={() => setIsEditing(!isEditing)} className="bg-blue-600 hover:bg-blue-700">
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-black/60 border-gray-700">
            <CardContent className="p-4 text-center">
              <Eye className="w-6 h-6 mx-auto mb-2 text-blue-400" />
              <div className="text-2xl font-bold text-white">{userInfo.stats.articlesRead}</div>
              <div className="text-xs text-gray-400">Articles Read</div>
            </CardContent>
          </Card>
          <Card className="bg-black/60 border-gray-700">
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <div className="text-2xl font-bold text-white">{userInfo.stats.timeSpent}h</div>
              <div className="text-xs text-gray-400">Time Spent</div>
            </CardContent>
          </Card>
          <Card className="bg-black/60 border-gray-700">
            <CardContent className="p-4 text-center">
              <Building2 className="w-6 h-6 mx-auto mb-2 text-purple-400" />
              <div className="text-2xl font-bold text-white">{userInfo.stats.followedSources}</div>
              <div className="text-xs text-gray-400">Sources</div>
            </CardContent>
          </Card>
          <Card className="bg-black/60 border-gray-700">
            <CardContent className="p-4 text-center">
              <MapPin className="w-6 h-6 mx-auto mb-2 text-red-400" />
              <div className="text-2xl font-bold text-white">{userInfo.stats.followedLocations}</div>
              <div className="text-xs text-gray-400">Locations</div>
            </CardContent>
          </Card>
          <Card className="bg-black/60 border-gray-700">
            <CardContent className="p-4 text-center">
              <Bookmark className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
              <div className="text-2xl font-bold text-white">{userInfo.stats.bookmarkedArticles}</div>
              <div className="text-xs text-gray-400">Bookmarks</div>
            </CardContent>
          </Card>
          <Card className="bg-black/60 border-gray-700">
            <CardContent className="p-4 text-center">
              <Share2 className="w-6 h-6 mx-auto mb-2 text-orange-400" />
              <div className="text-2xl font-bold text-white">{userInfo.stats.sharedArticles}</div>
              <div className="text-xs text-gray-400">Shared</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/60 border border-gray-700 mb-8">
            <TabsTrigger value="profile" className="data-[state=active]:bg-blue-600">
              Profile
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-blue-600">
              Preferences
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-blue-600">
              Activity
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-blue-600">
              Security
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-black/60 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <Input
                      value={userInfo.name}
                      disabled={!isEditing}
                      className="bg-black/40 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <Input
                      value={userInfo.email}
                      disabled={!isEditing}
                      className="bg-black/40 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                    <Input
                      value={userInfo.phone}
                      disabled={!isEditing}
                      className="bg-black/40 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                    <Input
                      value={userInfo.location}
                      disabled={!isEditing}
                      className="bg-black/40 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                  <textarea
                    value={userInfo.bio}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-3 py-2 bg-black/40 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-blue-400"
                  />
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                      Save Changes
                    </Button>
                    <Button onClick={() => setIsEditing(false)} variant="outline" className="border-gray-600">
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Notifications */}
              <Card className="bg-black/60 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bell className="w-5 h-5 text-blue-400" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Breaking News</span>
                    <Switch checked={userInfo.preferences.notifications.breaking} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Following Updates</span>
                    <Switch checked={userInfo.preferences.notifications.following} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">AI Recommendations</span>
                    <Switch checked={userInfo.preferences.notifications.recommendations} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Weekly Summary</span>
                    <Switch checked={userInfo.preferences.notifications.weekly} />
                  </div>
                </CardContent>
              </Card>

              {/* Privacy */}
              <Card className="bg-black/60 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Public Profile</span>
                    <Switch checked={userInfo.preferences.privacy.profilePublic} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Show Reading History</span>
                    <Switch checked={userInfo.preferences.privacy.showReadingHistory} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Allow AI Recommendations</span>
                    <Switch checked={userInfo.preferences.privacy.allowRecommendations} />
                  </div>
                </CardContent>
              </Card>

              {/* Display */}
              <Card className="bg-black/60 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Palette className="w-5 h-5 text-purple-400" />
                    Display
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Dark Mode</span>
                    <Switch checked={userInfo.preferences.display.darkMode} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Compact View</span>
                    <Switch checked={userInfo.preferences.display.compactView} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Auto-play Videos</span>
                    <Switch checked={userInfo.preferences.display.autoplay} />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-black/60 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-yellow-400" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => router.push("/following")}
                    className="w-full justify-start bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Manage Following
                  </Button>
                  <Button
                    onClick={() => router.push("/for-you")}
                    className="w-full justify-start bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 border border-yellow-600/30"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Preferences
                  </Button>
                  <Button className="w-full justify-start bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-600/30">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-black/60 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userInfo.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-gray-800/30">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{activity.title}</h4>
                        <p className="text-sm text-gray-400">{activity.source}</p>
                      </div>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-black/60 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-400" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">Change Password</Button>
                <Button className="w-full justify-start bg-green-600 hover:bg-green-700">
                  Enable Two-Factor Authentication
                </Button>
                <Button className="w-full justify-start bg-yellow-600 hover:bg-yellow-700">
                  Download Account Data
                </Button>
                <Button className="w-full justify-start bg-red-600 hover:bg-red-700">Delete Account</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
