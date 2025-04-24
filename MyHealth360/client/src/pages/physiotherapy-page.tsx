
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PhysiotherapyPage() {
  const handleBookService = (service: string) => {
    // TODO: Implement booking logic
    console.log("Booking service:", service);
  };

  return (
    <div className="mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Physiotherapy Services</h1>
        <p className="text-muted-foreground mt-2">
          Professional physiotherapy services at home and virtually
        </p>
      </div>

      <Tabs defaultValue="home" className="space-y-4">
        <TabsList>
          <TabsTrigger value="home">Home Visit</TabsTrigger>
          <TabsTrigger value="virtual">Virtual Consultation</TabsTrigger>
        </TabsList>

        <TabsContent value="home" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Home Physiotherapy Services</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: "Post-Surgery Rehabilitation", price: "$80/session" },
                      { name: "Sports Injury Recovery", price: "$70/session" },
                      { name: "Stroke Rehabilitation", price: "$85/session" },
                      { name: "Musculoskeletal Treatment", price: "$75/session" },
                      { name: "Geriatric Physiotherapy", price: "$75/session" },
                      { name: "Joint Pain Management", price: "$65/session" }
                    ].map((service) => (
                      <Card key={service.name} className="p-4">
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-muted-foreground mt-1">Professional Care at Home</div>
                        <div className="text-sm font-medium text-primary mt-1">{service.price}</div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => handleBookService(service.name)}
                        >
                          Book Session
                        </Button>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="virtual">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Virtual Physiotherapy Services</h3>
              <p className="text-muted-foreground mb-6">
                Expert physiotherapy guidance through video consultation
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "Initial Assessment", price: "$50/session" },
                  { name: "Follow-up Session", price: "$40/session" },
                  { name: "Exercise Program Review", price: "$35/session" },
                  { name: "Progress Monitoring", price: "$45/session" }
                ].map((service) => (
                  <Card key={service.name} className="p-4">
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">Online Video Consultation</div>
                    <div className="text-sm font-medium text-primary mt-1">{service.price}</div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => handleBookService(service.name)}
                    >
                      Book Consultation
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
