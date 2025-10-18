import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Users, 
  DollarSign, 
  Calendar, 
  Package, 
  BarChart3, 
  Settings, 
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { User, LostFoundItem, FundraisingCampaign, CampusEvent } from "@shared/schema";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Data queries
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    retry: false,
  });

  const { data: campaigns = [] } = useQuery<FundraisingCampaign[]>({
    queryKey: ["/api/campaigns"],
    retry: false,
  });

  const { data: events = [] } = useQuery<CampusEvent[]>({
    queryKey: ["/api/events"],
    retry: false,
  });

  const { data: lostFoundItems = [] } = useQuery<LostFoundItem[]>({
    queryKey: ["/api/lost-found"],
    retry: false,
  });

  // Admin actions
  const updateItemStatusMutation = useMutation({
    mutationFn: async ({ type, id, status }: { type: string; id: string; status: string }) => {
      let endpoint = "";
      switch (type) {
        case "campaign":
          endpoint = `/api/admin/campaigns/${id}/status`;
          break;
        case "event":
          endpoint = `/api/admin/events/${id}/status`;
          break;
        case "lost-found":
          endpoint = `/api/admin/lost-found/${id}/status`;
          break;
        default:
          throw new Error("Invalid type");
      }
      return await apiRequest("PATCH", endpoint, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      queryClient.invalidateQueries({ queryKey: ["/api/lost-found"] });
      toast({
        title: "Success",
        description: "Status updated successfully!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async ({ type, id }: { type: string; id: string }) => {
      let endpoint = "";
      switch (type) {
        case "campaign":
          endpoint = `/api/admin/campaigns/${id}`;
          break;
        case "event":
          endpoint = `/api/admin/events/${id}`;
          break;
        case "lost-found":
          endpoint = `/api/admin/lost-found/${id}`;
          break;
        default:
          throw new Error("Invalid type");
      }
      return await apiRequest("DELETE", endpoint);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      queryClient.invalidateQueries({ queryKey: ["/api/lost-found"] });
      toast({
        title: "Success",
        description: "Item deleted successfully!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleStatusUpdate = (type: string, id: string, status: string) => {
    updateItemStatusMutation.mutate({ type, id, status });
  };

  const handleDelete = (type: string, id: string) => {
    if (confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
      deleteItemMutation.mutate({ type, id });
    }
  };

  // Calculate statistics
  const totalUsers = users.length;
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(c => c.status === "active").length;
  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => new Date(e.startDate) > new Date()).length;
  const totalLostFound = lostFoundItems.length;
  const activeLostFound = lostFoundItems.filter(i => i.status === "active").length;

  const totalRaised = campaigns.reduce((sum, campaign) => {
    return sum + parseFloat(campaign.raisedAmount || "0");
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navigation />
      
      <div className="pt-24 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Shield className="text-purple-600 mr-3" size={32} />
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Manage and monitor the REVA Campus Services Platform
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3 mx-auto">
                  <Users className="text-blue-600" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{totalUsers}</h3>
                <p className="text-gray-600 text-sm">Total Users</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3 mx-auto">
                  <DollarSign className="text-green-600" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">₹{totalRaised.toLocaleString()}</h3>
                <p className="text-gray-600 text-sm">Total Raised</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3 mx-auto">
                  <Calendar className="text-purple-600" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{totalEvents}</h3>
                <p className="text-gray-600 text-sm">Total Events</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-3 mx-auto">
                  <Package className="text-orange-600" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{totalLostFound}</h3>
                <p className="text-gray-600 text-sm">Lost & Found Items</p>
              </CardContent>
            </Card>
          </div>

          {/* Management Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="lost-found">Lost & Found</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="mr-2" size={20} />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Active Campaigns</span>
                      <Badge variant="default">{activeCampaigns}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Upcoming Events</span>
                      <Badge variant="default">{upcomingEvents}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Active Lost & Found</span>
                      <Badge variant="default">{activeLostFound}</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="mr-2" size={20} />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <p className="font-medium">New campaign created</p>
                        <p className="text-gray-600">2 hours ago</p>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">Event registered</p>
                        <p className="text-gray-600">4 hours ago</p>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">Lost item reported</p>
                        <p className="text-gray-600">6 hours ago</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Campaigns Management */}
            <TabsContent value="campaigns" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg">
                <CardHeader>
                  <CardTitle>Manage Fundraising Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {campaigns.map((campaign) => (
                      <div key={campaign.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{campaign.title}</h4>
                            <p className="text-gray-600 text-sm mb-2">{campaign.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>Goal: ₹{parseFloat(campaign.goalAmount).toLocaleString()}</span>
                              <span>Raised: ₹{parseFloat(campaign.raisedAmount || "0").toLocaleString()}</span>
                              <Badge variant={campaign.status === "active" ? "default" : "secondary"}>
                                {campaign.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate("campaign", campaign.id, 
                                campaign.status === "active" ? "paused" : "active")}
                              disabled={updateItemStatusMutation.isPending}
                            >
                              {campaign.status === "active" ? <XCircle size={16} /> : <CheckCircle size={16} />}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete("campaign", campaign.id)}
                              disabled={deleteItemMutation.isPending}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Events Management */}
            <TabsContent value="events" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg">
                <CardHeader>
                  <CardTitle>Manage Campus Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div key={event.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{event.title}</h4>
                            <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>Location: {event.location}</span>
                              <span>Date: {new Date(event.startDate).toLocaleDateString()}</span>
                              <Badge variant={event.status === "active" ? "default" : "secondary"}>
                                {event.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate("event", event.id,
                                event.status === "active" ? "cancelled" : "active")}
                              disabled={updateItemStatusMutation.isPending}
                            >
                              {event.status === "active" ? <XCircle size={16} /> : <CheckCircle size={16} />}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete("event", event.id)}
                              disabled={deleteItemMutation.isPending}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Lost & Found Management */}
            <TabsContent value="lost-found" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg">
                <CardHeader>
                  <CardTitle>Manage Lost & Found Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {lostFoundItems.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{item.title}</h4>
                            <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>Type: {item.type}</span>
                              <span>Location: {item.location}</span>
                              <Badge variant={item.status === "active" ? "default" : "secondary"}>
                                {item.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate("lost-found", item.id,
                                item.status === "active" ? "claimed" : "active")}
                              disabled={updateItemStatusMutation.isPending}
                            >
                              {item.status === "active" ? <CheckCircle size={16} /> : <XCircle size={16} />}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete("lost-found", item.id)}
                              disabled={deleteItemMutation.isPending}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}