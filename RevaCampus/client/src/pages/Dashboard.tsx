import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Heart, Calendar, TrendingUp, Flag, UserX, CheckCircle, XCircle } from "lucide-react";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

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

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/analytics"],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  if (isLoading || analyticsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-24 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-24 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="bg-white shadow-xl">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserX className="text-red-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
                <p className="text-gray-600">You need admin privileges to access this dashboard.</p>
              </CardContent>
            </Card>
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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Comprehensive analytics and management tools for campus services platform</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Search className="text-blue-600" size={24} />
                  </div>
                  <Badge variant="secondary" className="text-green-600 bg-green-100">+12%</Badge>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{analytics?.totalLostFoundPosts || 0}</h3>
                <p className="text-gray-600 text-sm">Lost & Found Posts</p>
                <p className="text-xs text-gray-500 mt-1">589 resolved this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Heart className="text-green-600" size={24} />
                  </div>
                  <Badge variant="secondary" className="text-green-600 bg-green-100">+8%</Badge>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">₹{(analytics?.totalFundsRaised || 0).toFixed(0)}</h3>
                <p className="text-gray-600 text-sm">Funds Raised</p>
                <p className="text-xs text-gray-500 mt-1">{analytics?.totalCampaigns || 0} campaigns</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Calendar className="text-purple-600" size={24} />
                  </div>
                  <Badge variant="secondary" className="text-green-600 bg-green-100">+25%</Badge>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{analytics?.totalEvents || 0}</h3>
                <p className="text-gray-600 text-sm">Events</p>
                <p className="text-xs text-gray-500 mt-1">2,341 total attendees</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <Users className="text-indigo-600" size={24} />
                  </div>
                  <Badge variant="secondary" className="text-green-600 bg-green-100">+18%</Badge>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{analytics?.totalUsers || 0}</h3>
                <p className="text-gray-600 text-sm">Active Users</p>
                <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
              </CardContent>
            </Card>
          </div>

          {/* Management Tools */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Content Moderation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Content Moderation</span>
                  <Badge variant="destructive">5 Pending</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Flag className="text-red-500" size={20} />
                      <div>
                        <p className="font-semibold text-gray-900">Inappropriate Content Report</p>
                        <p className="text-sm text-gray-600">Lost & Found post flagged by users</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                        <CheckCircle size={16} className="mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                        <XCircle size={16} className="mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Flag className="text-yellow-500" size={20} />
                      <div>
                        <p className="font-semibold text-gray-900">Spam Campaign Detected</p>
                        <p className="text-sm text-gray-600">Fundraising campaign needs review</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                        <CheckCircle size={16} className="mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                        <XCircle size={16} className="mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-4" variant="outline">
                  View All Reports
                </Button>
              </CardContent>
            </Card>

            {/* User Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>User Management</span>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Add User
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Dr. Sarah Johnson</p>
                        <p className="text-sm text-gray-600">Administrator • Active</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                        Suspend
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="text-green-600" size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Raj Patel</p>
                        <p className="text-sm text-gray-600">Student • Active</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                        Suspend
                      </Button>
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-4" variant="outline">
                  View All Users
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="text-gray-400 mx-auto mb-2" size={48} />
                    <p className="text-gray-600">Interactive Analytics Chart</p>
                    <p className="text-sm text-gray-500">Chart.js integration required</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Engagement Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="text-gray-400 mx-auto mb-2" size={48} />
                    <p className="text-gray-600">Engagement Metrics</p>
                    <p className="text-sm text-gray-500">D3.js visualization required</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
