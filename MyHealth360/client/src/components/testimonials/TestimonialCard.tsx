interface TestimonialCardProps {
  text: string;
  author: string;
  role: string;
  initials: string;
  rating: number;
}

const TestimonialCard = ({
  text,
  author,
  role,
  initials,
  rating
}: TestimonialCardProps) => {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="ri-star-fill"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="ri-star-half-fill"></i>);
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center mb-4">
        <div className="text-yellow-400 flex">
          {renderStars(rating)}
        </div>
      </div>
      <p className="text-gray-600 mb-4">
        "{text}"
      </p>
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
          <span className="font-medium text-sm">{initials}</span>
        </div>
        <div>
          <p className="font-medium">{author}</p>
          <p className="text-sm text-gray-600">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
