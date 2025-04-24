import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  taken: boolean;
}

interface MedicationTrackerProps {
  medications: Medication[];
  onToggleMedication: (id: number, taken: boolean) => void;
}

const MedicationTracker = ({ medications, onToggleMedication }: MedicationTrackerProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold">Medication Tracker</h3>
        <button className="text-primary text-sm">Manage</button>
      </div>
      
      <div className="space-y-3">
        {medications.length > 0 ? (
          medications.map((medication) => (
            <div key={medication.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="bg-orange-100 rounded-full p-2 mr-3">
                  <i className="ri-medicine-bottle-fill text-orange-500"></i>
                </div>
                <div>
                  <p className="font-medium">{medication.name}</p>
                  <p className="text-sm text-gray-500">{medication.dosage}, {medication.frequency}</p>
                </div>
              </div>
              <div>
                <Checkbox 
                  id={`med-${medication.id}`} 
                  checked={medication.taken}
                  onCheckedChange={(checked) => onToggleMedication(medication.id, checked as boolean)}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">No medications to track</p>
            <button className="mt-2 text-primary">Add Medication</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationTracker;
