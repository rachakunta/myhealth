import { Link } from "wouter";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
  iconBgClass: string;
  iconColor: string;
  buttonText: string;
  buttonColor: string;
  path: string;
}

const ServiceCard = ({
  title,
  description,
  icon,
  iconBgClass,
  iconColor,
  buttonText,
  buttonColor,
  path
}: ServiceCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 flex flex-col">
      <div className={`rounded-full ${iconBgClass} w-14 h-14 flex items-center justify-center mb-4`}>
        <i className={`${icon} text-2xl ${iconColor}`}></i>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 flex-grow">{description}</p>
      <Link href={path}>
        <div className={`${buttonColor} font-medium flex items-center cursor-pointer`}>
          {buttonText}
          <i className="ri-arrow-right-line ml-1"></i>
        </div>
      </Link>
    </div>
  );
};

export default ServiceCard;
