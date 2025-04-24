import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import ServiceCard from "@/components/services/ServiceCard";
import TestimonialCard from "@/components/testimonials/TestimonialCard";
import AIHealthAssistant from "@/components/ai/AIHealthAssistant";
import { SERVICES, TESTIMONIALS } from "@/lib/constants";

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary bg-opacity-5 py-6 md:py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Complete Healthcare in One Platform
              </h1>
              <p className="text-gray-600 text-lg mb-6">
                One platform for all your healthcare needs. Telemedicine, diagnostics, medicine delivery, and wellness tools - integrated seamlessly.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/dashboard">
                  <Button size="lg" className="shadow-md">
                    Get Started
                  </Button>
                </Link>
                <Link href="#services">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                alt="Healthcare professionals" 
                className="rounded-lg shadow-lg max-w-full h-auto object-cover" 
                width="500" 
                height="350"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Your Health Journey, Simplified</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                description={service.description}
                icon={service.icon}
                iconBgClass={service.iconBgClass}
                iconColor={service.iconColor}
                buttonText={service.buttonText}
                buttonColor={service.buttonColor}
                path={service.path}
              />
            ))}
          </div>
        </div>
      </section>

      {/* AI Insights Section */}
      <AIHealthAssistant />

      {/* Testimonials Section */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-2">What Our Users Say</h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            Hear from people who have transformed their healthcare experience with MyHealth360.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                text={testimonial.text}
                author={testimonial.author}
                role={testimonial.role}
                initials={testimonial.initials}
                rating={testimonial.rating}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready for a Complete Healthcare Solution?</h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their healthcare experience with MyHealth360's integrated platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/dashboard">
              <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-gray-100">
                Get Started Now
              </Button>
            </Link>
            <Link href="/support">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-primary-dark">
                Schedule a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
