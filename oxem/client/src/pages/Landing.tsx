import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Heart, Calendar, University, Users, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/25 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl shadow-lg flex items-center justify-center">
                <University className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">REVA Campus</h1>
                <p className="text-xs text-gray-600">Services Platform</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Link href="/login">
                <Button variant="outline" className="bg-white/50">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Your Campus,<br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Connected</span>
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            The ultimate platform for REVA University students to find lost items, support causes, 
            and discover amazing campus events - all in one beautiful, social experience.
          </p>
          
          <div className="flex justify-center gap-4 mb-12">
            <Link href="/signup">
              <Button 
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button 
                size="lg"
                variant="outline"
                className="bg-white/50 text-lg px-8 py-3"
              >
                Login
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card className="bg-white/25 backdrop-blur-lg border-white/30 shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Search className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Lost & Found</h3>
                <p className="text-gray-600 text-sm">Find your lost items or help others recover theirs through our smart matching system</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/25 backdrop-blur-lg border-white/30 shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Heart className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Fundraising</h3>
                <p className="text-gray-600 text-sm">Support meaningful causes and create impactful campaigns for your community</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/25 backdrop-blur-lg border-white/30 shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Calendar className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Campus Events</h3>
                <p className="text-gray-600 text-sm">Never miss out on exciting campus activities and connect with fellow students</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose REVA Campus Services?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built by students, for students. Experience the future of campus connectivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <Users className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Social Integration</h3>
              <p className="text-gray-600">Connect with your campus community through an Instagram-inspired interface</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <TrendingUp className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Updates</h3>
              <p className="text-gray-600">Get instant notifications about claims, donations, and event updates</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <University className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">University Focused</h3>
              <p className="text-gray-600">Designed specifically for REVA University students and campus life</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of REVA students already using our platform to stay connected and make a difference.
          </p>
          <Link href="/signup">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg px-12 py-4"
            >
              Join REVA Campus Services
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl shadow-lg flex items-center justify-center">
                <University className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">REVA Campus Services</h3>
                <p className="text-gray-600">Connecting the campus community</p>
              </div>
            </div>
            <p className="text-gray-600">
              © 2024 REVA Campus Services Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
