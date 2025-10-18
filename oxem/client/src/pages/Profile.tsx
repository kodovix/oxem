import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Calendar, MapPin, Settings, Activity, Heart, MessageCircle, Search } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Get user's posts and activity
  const { data: userPosts = [] } = useQuery({
    queryKey: ["/api/lost-found", { userId: user?.id }],
    enabled: isAuthenticated && !!user?.id,
  });

  const { data: userCampaigns = [] } = useQuery({
    queryKey: ["/api/campaigns", { userId: user?.id }],
    enabled: isAuthenticated && !!user?.id,
  });

  const { data: userEvents = [] } = useQuery({
    queryKey: ["/api/events", { userId: user?.id }],
    enabled: isAuthenticated && !!user?.id,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ["/api/notifications"],
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-24 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-24 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Profile Header */}
          <Card className="bg-white shadow-xl mb-8">
            <CardContent className="p-8">
              <div className="flex items-center space-x-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user?.profileImageUrl || ""} alt={user?.firstName || "User"} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                    {user?.firstName?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <div className="flex items-center space-x-4 text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Mail size={16} className="mr-2" />
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex items-center">
                      <User size={16} className="mr-2" />
                      <Badge variant="outline" className="capitalize">
                        {user?.role || "Student"}
                      </Badge>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2" />
                      <span>Joined {user?.createdAt ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true }) : "recently"}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Settings size={16} className="mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline">
                      <Activity size={16} className="mr-2" />
                      View Activity
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3 mx-auto">
                  <Search className="text-blue-600" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{userPosts.length}</h3>
                <p className="text-gray-600 text-sm">Lost & Found Posts</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3 mx-auto">
                  <Heart className="text-green-600" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{userCampaigns.length}</h3>
                <p className="text-gray-600 text-sm">Fundraising Campaigns</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3 mx-auto">
                  <Calendar className="text-purple-600" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{userEvents.length}</h3>
                <p className="text-gray-600 text-sm">Events Created</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-3 mx-auto">
                  <Activity className="text-indigo-600" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{notifications.length}</h3>
                <p className="text-gray-600 text-sm">Notifications</p>
              </CardContent>
            </Card>
          </div>

          {/* Content Tabs */}
          <Card className="bg-white shadow-xl">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="posts">My Posts</TabsTrigger>
                  <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                  <TabsTrigger value="events">Events</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" value={user?.firstName || ""} readOnly />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" value={user?.lastName || ""} readOnly />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" value={user?.email || ""} readOnly />
                        </div>
                        <div>
                          <Label htmlFor="role">Role</Label>
                          <Input id="role" value={user?.role || "student"} readOnly />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                      <div className="space-y-3">
                        {notifications.slice(0, 5).map((notification: any) => (
                          <div key={notification.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Activity size={16} className="text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                              <p className="text-xs text-gray-600">{notification.message}</p>
                            </div>
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="posts" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">My Lost & Found Posts</h3>
                    {userPosts.length === 0 ? (
                      <div className="text-center py-12">
                        <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No posts yet. Create your first lost & found post!</p>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {userPosts.map((post: any) => (
                          <Card key={post.id}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-gray-900">{post.title}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{post.description}</p>
                                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                    <Badge variant="outline" className={post.type === "lost" ? "text-red-600" : "text-green-600"}>
                                      {post.type.toUpperCase()}
                                    </Badge>
                                    <span>{post.location}</span>
                                    <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                                  </div>
                                </div>
                                <Badge variant={post.status === "active" ? "default" : "secondary"}>
                                  {post.status}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="campaigns" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">My Fundraising Campaigns</h3>
                    {userCampaigns.length === 0 ? (
                      <div className="text-center py-12">
                        <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No campaigns yet. Start your first fundraising campaign!</p>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {userCampaigns.map((campaign: any) => (
                          <Card key={campaign.id}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-gray-900">{campaign.title}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{campaign.description}</p>
                                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                    <span>₹{parseFloat(campaign.raisedAmount || "0").toLocaleString()} raised</span>
                                    <span>₹{parseFloat(campaign.goalAmount).toLocaleString()} goal</span>
                                    <span>{formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}</span>
                                  </div>
                                </div>
                                <Badge variant={campaign.status === "active" ? "default" : "secondary"}>
                                  {campaign.status}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="events" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">My Events</h3>
                    {userEvents.length === 0 ? (
                      <div className="text-center py-12">
                        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No events yet. Create your first campus event!</p>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {userEvents.map((event: any) => (
                          <Card key={event.id}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                    <span>{event.location}</span>
                                    <span>{new Date(event.startDate).toLocaleDateString()}</span>
                                    <span>{formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}</span>
                                  </div>
                                </div>
                                <Badge variant={event.status === "active" ? "default" : "secondary"}>
                                  {event.status}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}