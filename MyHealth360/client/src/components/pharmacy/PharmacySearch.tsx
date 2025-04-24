import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

const PharmacySearch = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input 
          placeholder="Search for pharmacies nearby..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Button>
          <MapPin className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">Enter a location to find pharmacies nearby</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PharmacySearch;