import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Users, Calendar, TrendingUp, Trophy, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { FundraisingCampaign } from "@shared/schema";

interface FundraisingCardProps {
  campaign: FundraisingCampaign;
}

export default function FundraisingCard({ campaign }: FundraisingCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const raisedAmount = parseFloat(campaign.raisedAmount || "0");
  const goalAmount = parseFloat(campaign.goalAmount);
  const progressPercentage = Math.min((raisedAmount / goalAmount) * 100, 100);
  
  const likeMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/likes/toggle", {
        itemId: campaign.id,
        itemType: "campaign",
      });
    },
    onSuccess: (data: any) => {
      setIsLiked(data.liked);
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
        description: "Failed to toggle like. Please try again.",
        variant: "destructive",
      });
    },
  });

  const donateMutation = useMutation({
    mutationFn: async (amount: number) => {
      return await apiRequest("POST", `/api/campaigns/${campaign.id}/donate`, {
        amount: amount.toString(),
        anonymous: false,
        message: "Supporting this great cause!",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast({
        title: "Success",
        description: "Thank you for your donation!",
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
        description: "Failed to process donation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleDonate = () => {
    if (campaign && campaign.id) {
      donateMutation.mutate(100); // Default donation amount
    }
  };

  const getStatusBadge = () => {
    if (campaign.status === "completed" || progressPercentage >= 100) {
      return <Badge className="bg-green-100 text-green-800">COMPLETED</Badge>;
    }
    if (campaign.status === "paused") {
      return <Badge className="bg-yellow-100 text-yellow-800">PAUSED</Badge>;
    }
    if (campaign.status === "cancelled") {
      return <Badge className="bg-red-100 text-red-800">CANCELLED</Badge>;
    }
    return <Badge className="bg-blue-100 text-blue-800">ACTIVE</Badge>;
  };

  const getDaysLeft = () => {
    if (!campaign.endDate) return null;
    const endDate = new Date(campaign.endDate);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days left` : "Ended";
  };

  return (
    <Card className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
      {/* Campaign Image */}
      {campaign.imageUrl && (
        <img 
          src={campaign.imageUrl} 
          alt={campaign.title}
          className="w-full h-48 object-cover"
        />
      )}
      
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          {getStatusBadge()}
          {getDaysLeft() && (
            <span className="text-sm text-gray-600">{getDaysLeft()}</span>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">{campaign.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{campaign.description}</p>
        
        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>₹{raisedAmount.toLocaleString()} raised</span>
            <span>₹{goalAmount.toLocaleString()} goal</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <p className="text-xs text-gray-500 mt-1">{progressPercentage.toFixed(1)}% funded</p>
        </div>
        
        {/* Category Badge */}
        {campaign.category && (
          <Badge variant="outline" className="mb-4 capitalize">
            {campaign.category}
          </Badge>
        )}
        
        {/* Footer Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`text-gray-600 hover:text-red-500 transition-colors duration-200 ${
                isLiked ? "text-red-500" : ""
              }`}
              disabled={likeMutation.isPending}
            >
              <Heart size={16} className={`mr-1 ${isLiked ? "fill-current" : ""}`} />
            </Button>
            
            {campaign.status === "completed" && (
              <div className="flex items-center text-green-600">
                <Trophy size={16} className="mr-1" />
                <span className="text-sm">Goal achieved!</span>
              </div>
            )}
          </div>
          
          {campaign.status === "active" && (
            <Button 
              onClick={handleDonate}
              disabled={donateMutation.isPending}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Heart size={16} className="mr-2" />
              Donate
            </Button>
          )}
          
          {campaign.status === "completed" && (
            <Button variant="outline" size="sm">
              View Updates
            </Button>
          )}
        </div>
        
        {/* Campaign Creator Info */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                <User size={12} />
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-500">
              Created {formatDistanceToNow(new Date(campaign.createdAt!), { addSuffix: true })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
