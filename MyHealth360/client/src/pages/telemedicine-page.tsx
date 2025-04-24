
import { useState } from "react";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function TelemedicinePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [specialityFilter, setSpecialityFilter] = useState("all");

  return (
    <div className="relative">
      <div className="mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Telemedicine</h1>
          <p className="text-muted-foreground">
            Connect with healthcare providers in real-time
          </p>
        </div>

        {/* Search and Filter Section */}
        <Card className="p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search doctors by name or speciality..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select 
              value={specialityFilter}
              onValueChange={setSpecialityFilter}
            >
              <option value="all">All Specialities</option>
              <option value="general">General Physician</option>
              <option value="cardiology">Cardiologist</option>
              <option value="dermatology">Dermatologist</option>
              <option value="pediatrics">Pediatrician</option>
            </Select>
            <Button variant="default">
              Find Doctors
            </Button>
          </div>
        </Card>
        
        <div className="p-1 bg-card rounded-lg shadow-sm">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
