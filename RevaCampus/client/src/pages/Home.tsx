import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Heart, Calendar, TrendingUp, Users, Clock } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Welcome back, {user?.firstName || "Student"}! 👋
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay connected with your campus community. Discover what's happening at REVA University today.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3 mx-auto">
                  <Search className="text-blue-600" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">247</h3>
                <p className="text-gray-600 text-sm">Active Lost Items</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3 mx-auto">
                  <Heart className="text-green-600" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">₹12.5L</h3>
                <p className="text-gray-600 text-sm">Funds Raised</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3 mx-auto">
                  <Calendar className="text-purple-600" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">15</h3>
                <p className="text-gray-600 text-sm">Upcoming Events</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-3 mx-auto">
                  <Users className="text-indigo-600" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">3,892</h3>
                <p className="text-gray-600 text-sm">Active Users</p>
              </CardContent>
            </Card>
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Link href="/lost-found">
              <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
                    <Search className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Lost & Found</h3>
                  <p className="text-gray-600 mb-6">
                    Help your fellow students find their lost belongings or report items you've found around campus.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <TrendingUp size={16} />
                      <span>247 active posts</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Explore →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/fundraising">
              <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-6">
                    <Heart className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Fundraising</h3>
                  <p className="text-gray-600 mb-6">
                    Support meaningful causes or start your own campaign to make a positive impact on campus.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <TrendingUp size={16} />
                      <span>42 campaigns</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Support →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/events">
              <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6">
                    <Calendar className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Campus Events</h3>
                  <p className="text-gray-600 mb-6">
                    Discover exciting events, workshops, and activities happening around campus this week.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock size={16} />
                      <span>15 this week</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Browse →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Search className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">New lost item reported</p>
                        <p className="text-sm text-gray-600">iPhone 13 found near Library - 2 hours ago</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Heart className="text-green-600" size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Fundraising milestone reached</p>
                        <p className="text-sm text-gray-600">Study Space campaign reached ₹1L - 4 hours ago</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Calendar className="text-purple-600" size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">New event created</p>
                        <p className="text-sm text-gray-600">AI Workshop scheduled for next week - 6 hours ago</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
