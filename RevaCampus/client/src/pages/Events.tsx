import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import EventCard from "@/components/EventCard";
import CreateEventForm from "@/components/CreateEventForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Filter, Calendar, Users, Clock } from "lucide-react";
import type { CampusEvent } from "@shared/schema";

export default function Events() {
  const [category, setCategory] = useState<string>("all");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: events = [], isLoading } = useQuery<CampusEvent[]>({
    queryKey: ["/api/events", { category: category === "all" ? undefined : category }],
    enabled: true,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Navigation />
        <div className="pt-24 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading campus events...</p>
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
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Campus Events</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover exciting activities, workshops, and social events happening around campus
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3 mx-auto">
                  <Calendar className="text-purple-600" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">15</h3>
                <p className="text-gray-600 text-sm">This Week</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3 mx-auto">
                  <Users className="text-blue-600" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">2,341</h3>
                <p className="text-gray-600 text-sm">Total Attendees</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3 mx-auto">
                  <Clock className="text-green-600" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">89</h3>
                <p className="text-gray-600 text-sm">This Month</p>
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
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="tech">Technology</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Plus size={16} className="mr-2" />
              {showCreateForm ? "Cancel" : "Create Event"}
            </Button>
          </div>

          {/* Create Event Form */}
          {showCreateForm && (
            <div className="mb-8">
              <CreateEventForm onSuccess={() => setShowCreateForm(false)} />
            </div>
          )}

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.length === 0 ? (
              <div className="col-span-full">
                <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg">
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="text-gray-400" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
                    <p className="text-gray-600">Try adjusting your filters or create the first event!</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              events.map((event: CampusEvent) => (
                <EventCard key={event.id} event={event} />
              ))
            )}
          </div>

          {/* Create Event CTA */}
          <div className="mt-16">
            <Card className="bg-white/80 backdrop-blur-lg border-white/50 shadow-xl">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Host Your Own Event</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Planning a club meeting, study group, or social gathering? Create an event listing and invite the campus community.
                </p>
                <Button 
                  size="lg" 
                  onClick={() => setShowCreateForm(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus size={20} className="mr-2" />
                  Create Event
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
