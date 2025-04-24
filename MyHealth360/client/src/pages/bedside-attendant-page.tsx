
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BedsideAttendantPage() {
  const handleBookService = (service: string) => {
    // TODO: Implement booking logic
    console.log("Booking service:", service);
  };

  return (
    <div className="mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Bedside Attendant Services</h1>
        <p className="text-muted-foreground mt-2">
          Professional caregivers providing personalized care and support
        </p>
      </div>

      <Tabs defaultValue="home" className="space-y-4">
        <TabsList>
          <TabsTrigger value="home">Home Care</TabsTrigger>
          <TabsTrigger value="facility">Facility Care</TabsTrigger>
        </TabsList>

        <TabsContent value="home" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Home Care Services</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: "12-Hour Care", duration: "Daily", price: "$45/day" },
                      { name: "24-Hour Care", duration: "Daily", price: "$85/day" },
                      { name: "12-Hour Care", duration: "Weekly", price: "$299/week" },
                      { name: "24-Hour Care", duration: "Weekly", price: "$549/week" },
                      { name: "12-Hour Care", duration: "Monthly", price: "$1199/month" },
                      { name: "24-Hour Care", duration: "Monthly", price: "$2199/month" }
                    ].map((service) => (
                      <Card key={service.name + service.duration} className="p-4">
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-muted-foreground mt-1">{service.duration} Plan</div>
                        <div className="text-sm font-medium text-primary mt-1">{service.price}</div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => handleBookService(`${service.name} - ${service.duration}`)}
                        >
                          Book Now
                        </Button>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Services Included</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      "Personal Hygiene Assistance",
                      "Mobility Support",
                      "Feeding Assistance",
                      "Medication Reminders",
                      "Toileting & Diaper Change",
                      "Companionship",
                      "Daily Activity Assistance",
                      "Grooming Support",
                      "Basic Health Monitoring"
                    ].map((service) => (
                      <div key={service} className="flex items-center gap-2 p-3 border rounded-lg">
                        <div className="h-2 w-2 bg-primary rounded-full" />
                        <span className="text-sm">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facility">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Facility Care Services</h3>
              <p className="text-muted-foreground mb-6">
                Professional bedside attendant services in hospitals, nursing homes, and other healthcare facilities
              </p>
              <div className="grid gap-4">
                {[
                  {
                    title: "Hospital Care",
                    description: "24/7 personal care support for hospital patients",
                    location: "Hospitals"
                  },
                  {
                    title: "Nursing Home Support",
                    description: "Dedicated care in nursing home settings",
                    location: "Nursing Homes"
                  },
                  {
                    title: "Rehabilitation Support",
                    description: "Assistance during rehabilitation programs",
                    location: "Rehabilitation Centers"
                  },
                  {
                    title: "Hospice Care",
                    description: "Compassionate care for hospice patients",
                    location: "Hospice Facilities"
                  }
                ].map((service) => (
                  <Card key={service.title} className="p-4">
                    <div className="font-medium">{service.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">{service.description}</div>
                    <div className="text-sm text-muted-foreground mt-1">Location: {service.location}</div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => handleBookService(service.title)}
                    >
                      Request Quote
                    </Button>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
