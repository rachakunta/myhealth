
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export default function NursingPage() {
  const [serviceType, setServiceType] = useState("transactional");
  const [selectedService, setSelectedService] = useState("");
  const [showBooking, setShowBooking] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleBookService = (service: string) => {
    setSelectedService(service);
    setShowBooking(true);
  };

  return (
    <div className="relative">
      <div className="mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Nursing Care Services</h1>
          <p className="text-muted-foreground mt-2">
            Professional nursing care services provided by qualified GNM or BSc Nursing professionals
          </p>
        </div>

        <Tabs defaultValue="home" className="mb-8">
          <TabsList>
            <TabsTrigger value="home">Home Care</TabsTrigger>
            <TabsTrigger value="facility">Facility Care</TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Service Type</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button 
                        variant={serviceType === "transactional" ? "default" : "outline"}
                        onClick={() => setServiceType("transactional")}
                        className="justify-start h-auto p-4"
                      >
                        <div className="text-left">
                          <div className="font-semibold">Transactional Care</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Short-term services like injections, dressing, vitals check
                          </div>
                        </div>
                      </Button>
                      <Button 
                        variant={serviceType === "continuous" ? "default" : "outline"}
                        onClick={() => setServiceType("continuous")}
                        className="justify-start h-auto p-4"
                      >
                        <div className="text-left">
                          <div className="font-semibold">Continuous Care</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Long-term advanced services like tracheostomy, ostomy care
                          </div>
                        </div>
                      </Button>
                    </div>
                  </div>

                  {serviceType === "transactional" ? (
                    <div className="grid gap-4">
                      <h3 className="text-lg font-semibold">Available Services</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                          { name: "Intramuscular Injections", price: "$30" },
                          { name: "Intravenous Infusion", price: "$45" },
                          { name: "Wound Dressing", price: "$35" },
                          { name: "Nebulization", price: "$25" },
                          { name: "Vitals Check", price: "$20" }
                        ].map((service) => (
                          <Card key={service.name} className="p-4 cursor-pointer hover:bg-accent">
                            <div className="font-medium">{service.name}</div>
                            <div className="text-sm text-muted-foreground mt-1">{service.price}</div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-2"
                              onClick={() => handleBookService(service.name)}
                            >
                              Book Now
                            </Button>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      <h3 className="text-lg font-semibold">Advanced Care Services</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { name: "Tracheostomy Care", price: "$250/day" },
                          { name: "Ostomy Care", price: "$200/day" },
                          { name: "RT Feeds", price: "$180/day" },
                          { name: "PEG Feeding", price: "$180/day" },
                          { name: "Ventilator Monitoring", price: "$300/day" },
                          { name: "Wound Care", price: "$150/day" }
                        ].map((service) => (
                          <Card key={service.name} className="p-4 cursor-pointer hover:bg-accent">
                            <div className="font-medium">{service.name}</div>
                            <div className="text-sm text-muted-foreground mt-1">24/7 Professional Care</div>
                            <div className="text-sm font-medium text-primary mt-1">{service.price}</div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-2"
                              onClick={() => handleBookService(service.name)}
                            >
                              Request Quote
                            </Button>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {showBooking && (
                    <Card className="mt-6">
                      <CardContent className="pt-6">
                        <h3 className="text-lg font-semibold mb-4">Book {selectedService}</h3>
                        <div className="grid gap-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Preferred Date</Label>
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="mt-2"
                              />
                            </div>
                            <div className="space-y-4">
                              <div>
                                <Label>Patient Name</Label>
                                <Input className="mt-1" placeholder="Enter patient name" />
                              </div>
                              <div>
                                <Label>Contact Number</Label>
                                <Input className="mt-1" placeholder="Enter contact number" />
                              </div>
                              <div>
                                <Label>Address</Label>
                                <Input className="mt-1" placeholder="Enter complete address" />
                              </div>
                              <Button className="w-full">Confirm Booking</Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="facility">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Facility Care Services</h3>
                <p className="text-muted-foreground mb-6">
                  Professional nursing care in hospitals, nursing homes, rehabilitation centers, and hospice facilities
                </p>
                <div className="grid gap-4">
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <i className="ri-hospital-line text-2xl text-primary"></i>
                    </div>
                    <div>
                      <h4 className="font-medium">Hospital Care</h4>
                      <p className="text-sm text-muted-foreground">24/7 professional nursing support in hospital settings</p>
                    </div>
                    <Button className="ml-auto">Enquire</Button>
                  </div>
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <i className="ri-home-heart-line text-2xl text-primary"></i>
                    </div>
                    <div>
                      <h4 className="font-medium">Nursing Home Care</h4>
                      <p className="text-sm text-muted-foreground">Long-term care in specialized nursing facilities</p>
                    </div>
                    <Button className="ml-auto">Enquire</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
