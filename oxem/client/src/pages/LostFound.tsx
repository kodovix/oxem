import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import LostFoundPost from "@/components/LostFoundPost";
import CreatePostForm from "@/components/CreatePostForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Filter } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { LostFoundItem } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function LostFound() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [category, setCategory] = useState<string>("all");
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery<LostFoundItem[]>({
    queryKey: ["/api/lost-found", { type: activeTab === "all" ? undefined : activeTab, category: category === "all" ? undefined : category }],
    enabled: true,
  });

  const claimMutation = useMutation({
    mutationFn: async (itemId: string) => {
      return await apiRequest("PATCH", `/api/lost-found/${itemId}/claim`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lost-found"] });
      toast({
        title: "Success",
        description: "Item claimed successfully!",
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
        description: "Failed to claim item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleClaim = (itemId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to claim items.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
    claimMutation.mutate(itemId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Navigation />
        <div className="pt-24 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading lost & found items...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation />
      
      <div className="pt-24 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Lost & Found Hub</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with your campus community to recover lost items through our intelligent social feed
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create Post Section */}
            <div className="lg:col-span-1">
              <Card className="bg-white/80 backdrop-blur-lg border-white/50 shadow-xl sticky top-24">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Report Item</h3>
                    <Button
                      onClick={() => setShowCreateForm(!showCreateForm)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus size={16} className="mr-1" />
                      {showCreateForm ? "Cancel" : "New Post"}
                    </Button>
                  </div>
                  
                  {showCreateForm ? (
                    <CreatePostForm onSuccess={() => {
                      setShowCreateForm(false);
                      queryClient.invalidateQueries({ queryKey: ["/api/lost-found"] });
                    }} />
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="text-gray-400" size={24} />
                      </div>
                      <p className="text-gray-600 text-sm">Click "New Post" to report a lost or found item</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Posts Feed */}
            <div className="lg:col-span-2">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All Items</TabsTrigger>
                    <TabsTrigger value="lost">Lost</TabsTrigger>
                    <TabsTrigger value="found">Found</TabsTrigger>
                  </TabsList>
                </Tabs>

                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter size={16} className="mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                    <SelectItem value="documents">Documents</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Posts */}
              <div className="space-y-6">
                {items.length === 0 ? (
                  <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg">
                    <CardContent className="p-12 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Filter className="text-gray-400" size={24} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
                      <p className="text-gray-600">Try adjusting your filters or be the first to post!</p>
                    </CardContent>
                  </Card>
                ) : (
                  items.map((item: LostFoundItem) => (
                    <LostFoundPost
                      key={item.id}
                      item={item}
                      onClaim={handleClaim}
                    />
                  ))
                )}
              </div>

              {/* Load More */}
              {items.length > 0 && (
                <div className="text-center pt-8">
                  <Button variant="outline" className="bg-white/80">
                    Load More Posts
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
