import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Medicine {
  id: number;
  name: string;
  manufacturer: string;
  description: string;
  price: number;
  dosage: string;
  category: string;
  requiresPrescription: boolean;
  inStock: boolean;
}

interface OrderFormProps {
  medicines: {medicine: Medicine, quantity: number}[];
  onSuccess: () => void;
}

// Form schema
const formSchema = z.object({
  deliveryAddress: z.string().min(5, { message: "Address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  zipCode: z.string().min(3, { message: "Zip code is required" }),
  phoneNumber: z.string().min(10, { message: "Valid phone number is required" }),
  paymentMethod: z.enum(["cod", "card", "wallet"], {
    required_error: "Please select a payment method",
  }),
  specialInstructions: z.string().optional(),
  hasPrescription: z.boolean().optional(),
  acceptedTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const OrderForm = ({ medicines, onSuccess }: OrderFormProps) => {
  const { toast } = useToast();
  const [hasPrescriptionRequired, setHasPrescriptionRequired] = useState(
    medicines.some(item => item.medicine.requiresPrescription)
  );
  
  // Calculate order total
  const orderTotal = medicines.reduce(
    (total, item) => total + item.medicine.price * item.quantity, 
    0
  );
  
  // Default form values
  const defaultValues: Partial<FormValues> = {
    paymentMethod: "cod",
    specialInstructions: "",
    hasPrescription: false,
    acceptedTerms: false,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      // In a real app, you would create a proper order with line items
      // Simplified for this example
      const orderData = {
        ...data,
        items: medicines.map(item => ({
          medicationId: item.medicine.id,
          name: item.medicine.name,
          quantity: item.quantity,
          price: item.medicine.price
        })),
        total: orderTotal,
        status: "pending"
      };
      
      // Here we're just creating a medication record for demo
      const res = await apiRequest("POST", "/api/medications", {
        name: medicines.map(item => item.medicine.name).join(", "),
        dosage: medicines.map(item => item.medicine.dosage).join(", "),
        frequency: "As directed",
        startDate: new Date().toISOString(),
        instructions: data.specialInstructions || "Take as prescribed"
      });
      
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/medications"] });
      toast({
        title: "Order placed successfully",
        description: "Your order has been received and will be processed shortly.",
      });
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to place order",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    // Check if prescription is required but not uploaded
    if (hasPrescriptionRequired && !data.hasPrescription) {
      toast({
        title: "Prescription Required",
        description: "Please upload a prescription for the prescribed medications in your order.",
        variant: "destructive",
      });
      return;
    }
    
    createOrderMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium">Order Summary</h3>
          <div className="max-h-40 overflow-auto rounded border p-2">
            {medicines.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-sm">{item.medicine.name}</p>
                  <p className="text-xs text-gray-500">{item.medicine.dosage} x {item.quantity}</p>
                </div>
                <p className="font-medium">${(item.medicine.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center py-2 font-bold">
            <p>Total</p>
            <p>${orderTotal.toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="deliveryAddress"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Delivery Address</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter your full delivery address"
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Enter city" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter zip code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number for delivery" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Method</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="cod">Cash on Delivery</SelectItem>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="wallet">Digital Wallet</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specialInstructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Instructions (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Any special instructions for delivery"
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {hasPrescriptionRequired && (
          <div className="bg-blue-50 p-4 rounded-md space-y-3">
            <div className="flex items-start">
              <i className="ri-file-list-3-line text-blue-600 text-xl mr-3 mt-1"></i>
              <div>
                <h3 className="font-medium text-blue-800">Prescription Required</h3>
                <p className="text-sm text-blue-700">
                  One or more items in your order require a valid prescription. Please upload a prescription.
                </p>
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="hasPrescription"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal text-blue-800">
                      I have uploaded a valid prescription
                    </FormLabel>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="mt-2 bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
                  >
                    <i className="ri-upload-2-line mr-2"></i>
                    Upload Prescription
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="acceptedTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  I accept the terms and conditions
                </FormLabel>
                <FormDescription>
                  I confirm that all information provided is accurate and complete.
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={createOrderMutation.isPending}
        >
          {createOrderMutation.isPending ? "Processing Order..." : "Place Order"}
        </Button>
      </form>
    </Form>
  );
};

export default OrderForm;
