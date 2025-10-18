import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, Users, Clock, Star, User, Heart, MessageCircle, UserPlus } from "lucide-react";
import { formatDistanceToNow, format, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import CountdownTimer from "./CountdownTimer";
import type { CampusEvent } from "@shared/schema";

interface EventCardProps {
  event: CampusEvent;
}

export default function EventCard({ event }: EventCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<string>("not_attending");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const startDate = new Date(event.startDate);
  const isUpcoming = startDate > new Date();
  
  const likeMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/likes/toggle", {
        itemId: event.id,
        itemType: "event",
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

  const rsvpMutation = useMutation({
    mutationFn: async (status: string) => {
      return await apiRequest("POST", `/api/events/${event.id}/rsvp`, {
        eventId: event.id,
        status,
      });
    },
    onSuccess: (data: any) => {
      setRsvpStatus(data.status);
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({
        title: "Success",
        description: `RSVP updated to ${data.status}!`,
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
        description: "Failed to update RSVP. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleRSVP = (status: string) => {
    rsvpMutation.mutate(status);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "tech":
        return "bg-blue-500 text-white";
      case "workshop":
        return "bg-green-500 text-white";
      case "cultural":
        return "bg-purple-500 text-white";
      case "sports":
        return "bg-orange-500 text-white";
      case "academic":
        return "bg-indigo-500 text-white";
      case "social":
        return "bg-pink-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusBadge = () => {
    if (event.status === "cancelled") {
      return <Badge variant="destructive">CANCELLED</Badge>;
    }
    if (event.status === "completed") {
      return <Badge className="bg-gray-100 text-gray-800">COMPLETED</Badge>;
    }
    if (!isUpcoming) {
      return <Badge className="bg-orange-100 text-orange-800">ONGOING</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">UPCOMING</Badge>;
  };

  return (
    <Card className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
      {/* Event Image */}
      {event.imageUrl && (
        <img 
          src={event.imageUrl} 
          alt={event.title}
          className="w-full h-48 object-cover"
        />
      )}
      
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          {event.category && (
            <Badge className={getCategoryColor(event.category)}>
              {event.category.toUpperCase()}
            </Badge>
          )}
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">
              {format(startDate, "MMM dd")}
            </p>
            <p className="text-xs text-gray-600">
              {format(startDate, "h:mm a")}
            </p>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
        
        {/* Location */}
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <MapPin size={16} className="mr-2" />
          <span>{event.location}</span>
        </div>
        
        {/* Countdown Timer for upcoming events */}
        {isUpcoming && event.status === "active" && (
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <p className="text-xs text-gray-500 mb-2">EVENT STARTS IN</p>
            <CountdownTimer targetDate={startDate} />
          </div>
        )}
        
        {/* Event Details */}
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {event.maxAttendees ? "Limited Seats" : "Open Event"}
              </p>
              {event.maxAttendees && (
                <p className="text-xs text-gray-600">
                  Max {event.maxAttendees} attendees
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="flex items-center text-sm text-gray-600">
                <Users size={16} className="mr-1" />
                <span>Interested</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {event.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Actions */}
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
            
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-blue-500 transition-colors duration-200"
            >
              <MessageCircle size={16} className="mr-1" />
            </Button>
            
            {event.status === "active" && (
              <div className="flex items-center space-x-1">
                <Star className="text-yellow-500" size={16} />
                <span className="text-sm text-gray-600">4.8</span>
              </div>
            )}
          </div>

          {event.status === "active" && isUpcoming && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRSVP("interested")}
                disabled={rsvpMutation.isPending}
                className={rsvpStatus === "interested" ? "bg-purple-50 text-purple-600 border-purple-600" : ""}
              >
                <Heart size={16} className="mr-1" />
                Interested
              </Button>
              <Button
                onClick={() => handleRSVP("attending")}
                disabled={rsvpMutation.isPending}
                className={`${
                  event.category === "tech" 
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : event.category === "workshop"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-purple-600 hover:bg-purple-700"
                } text-white ${rsvpStatus === "attending" ? "ring-2 ring-offset-2 ring-blue-500" : ""}`}
              >
                <UserPlus size={16} className="mr-1" />
                {rsvpStatus === "attending" ? "Attending" : event.category === "workshop" ? "Register" : "RSVP"}
              </Button>
            </div>
          )}

          {event.status === "completed" && (
            <Badge variant="outline" className="text-gray-600 border-gray-600">
              Completed
            </Badge>
          )}

          {event.status === "cancelled" && (
            <Badge variant="destructive">
              Cancelled
            </Badge>
          )}
        </div>
        
        {/* Event Creator Info */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                <User size={12} />
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-500">
              Created {formatDistanceToNow(new Date(event.createdAt!), { addSuffix: true })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
