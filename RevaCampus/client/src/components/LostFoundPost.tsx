import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Hand, MapPin, Clock, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { LostFoundItem } from "@shared/schema";

interface LostFoundPostProps {
  item: LostFoundItem;
  onClaim: (itemId: string) => void;
}

export default function LostFoundPost({ item, onClaim }: LostFoundPostProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likes || 0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/likes/toggle", {
        itemId: item.id,
        itemType: "lost_found",
      });
    },
    onSuccess: (data: any) => {
      setIsLiked(data.liked);
      setLikeCount(prev => data.liked ? prev + 1 : prev - 1);
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

  const handleLike = () => {
    likeMutation.mutate();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "lost":
        return "bg-red-100 text-red-800";
      case "found":
        return "bg-green-100 text-green-800";
      case "claimed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                <User size={20} />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900">Anonymous User</p>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock size={14} />
                <span>{formatDistanceToNow(new Date(item.createdAt!), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
          <Badge className={getStatusColor(item.type)}>
            {item.type.toUpperCase()}
          </Badge>
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
        <p className="text-gray-700 mb-4">{item.description}</p>

        {/* Location */}
        {item.location && (
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <MapPin size={16} className="mr-2" />
            <span>{item.location}</span>
          </div>
        )}

        {/* Images */}
        {item.imageUrls && item.imageUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            {item.imageUrls.slice(0, 2).map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`${item.title} image ${index + 1}`}
                className="rounded-xl object-cover w-full h-40"
              />
            ))}
          </div>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`text-gray-600 hover:text-red-500 transition-colors duration-200 ${
                isLiked ? "text-red-500" : ""
              }`}
              disabled={likeMutation.isPending}
            >
              <Heart size={16} className={`mr-2 ${isLiked ? "fill-current" : ""}`} />
              <span>{likeCount}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-blue-500 transition-colors duration-200"
            >
              <MessageCircle size={16} className="mr-2" />
              <span>Comment</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-green-500 transition-colors duration-200"
            >
              <Share2 size={16} className="mr-2" />
              <span>Share</span>
            </Button>
          </div>

          {item.status === "active" && (
            <Button
              onClick={() => onClaim(item.id)}
              className={`${
                item.type === "lost"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-green-600 hover:bg-green-700"
              } text-white transition-colors duration-200`}
            >
              <Hand size={16} className="mr-2" />
              {item.type === "lost" ? "I Found This!" : "This is Mine!"}
            </Button>
          )}

          {item.status === "claimed" && (
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              Claimed
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
