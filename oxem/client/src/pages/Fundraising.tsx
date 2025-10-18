import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import FundraisingCard from "@/components/FundraisingCard";
import CreateCampaignForm from "@/components/CreateCampaignForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Filter, TrendingUp } from "lucide-react";
import type { FundraisingCampaign } from "@shared/schema";

export default function Fundraising() {
  const [category, setCategory] = useState<string>("all");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: campaigns = [], isLoading } = useQuery<FundraisingCampaign[]>({
    queryKey: ["/api/campaigns", { category: category === "all" ? undefined : category }],
    enabled: true,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <Navigation />
        <div className="pt-24 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading fundraising campaigns...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Navigation />
      
      <div className="pt-24 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Campus Fundraising</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Support meaningful causes and create positive impact in your campus community
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3 mx-auto">
                  <TrendingUp className="text-green-600" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">₹12.5L</h3>
                <p className="text-gray-600 text-sm">Total Funds Raised</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3 mx-auto">
                  <Plus className="text-blue-600" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">42</h3>
                <p className="text-gray-600 text-sm">Active Campaigns</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3 mx-auto">
                  <TrendingUp className="text-purple-600" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">1,247</h3>
                <p className="text-gray-600 text-sm">Total Donors</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter size={16} className="mr-2" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
                <SelectItem value="community">Community</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Plus size={16} className="mr-2" />
              {showCreateForm ? "Cancel" : "Create Campaign"}
            </Button>
          </div>

          {/* Create Campaign Form */}
          {showCreateForm && (
            <div className="mb-8">
              <CreateCampaignForm onSuccess={() => setShowCreateForm(false)} />
            </div>
          )}

          {/* Campaigns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.length === 0 ? (
              <div className="col-span-full">
                <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg">
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Filter className="text-gray-400" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No campaigns found</h3>
                    <p className="text-gray-600">Try adjusting your filters or create the first campaign!</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              campaigns.map((campaign: FundraisingCampaign) => (
                <FundraisingCard key={campaign.id} campaign={campaign} />
              ))
            )}
          </div>

          {/* Create Campaign CTA */}
          <div className="mt-16">
            <Card className="bg-white/80 backdrop-blur-lg border-white/50 shadow-xl">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Start Your Own Campaign</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Have a cause you're passionate about? Create a fundraising campaign and rally your campus community for support.
                </p>
                <Button 
                  size="lg" 
                  onClick={() => setShowCreateForm(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Plus size={20} className="mr-2" />
                  Create Campaign
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
