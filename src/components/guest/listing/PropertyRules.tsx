import React from 'react';
import { FaClock, FaDoorOpen, FaSmoking, FaUsers } from 'react-icons/fa';
import { MdSecurity, MdOutlineCleaningServices } from 'react-icons/md';
import { IoMdAlert } from 'react-icons/io';
import { PropertyRule } from '@/types/property';

interface PropertyRulesProps {
  rules: PropertyRule;
}

const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  let hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour ? hour : 12; 
  return `${hour}:${minutes} ${ampm}`;
};

const PropertyRules: React.FC<PropertyRulesProps> = ({ rules }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Things to know</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-medium mb-2">House rules</h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              <FaClock className="mr-2" /> Check-in: After {formatTime(rules.check_in_time)}
            </li>
            <li className="flex items-center">
              <FaClock className="mr-2" /> Checkout: {formatTime(rules.check_out_time)}
            </li>
            {rules.self_check_in && <li className="flex items-center"><FaDoorOpen className="mr-2" /> Self check-in with lockbox</li>}
            {rules.no_smoking && <li className="flex items-center"><FaSmoking className="mr-2" /> No smoking</li>}
            {rules.no_parties_or_events && <li className="flex items-center"><FaUsers className="mr-2" /> No parties or events</li>}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Health & safety</h3>
          <ul className="space-y-2">
            <li className="flex items-center"><MdOutlineCleaningServices className="mr-2" /> Committed to Airbnb&apos;s enhanced cleaning process.</li>
            <li className="flex items-center"><IoMdAlert className="mr-2" /> Airbnb&apos;s social-distancing and other COVID-19-related guidelines apply</li>
            {rules.carbon_monoxide_alarm && <li className="flex items-center"><IoMdAlert className="mr-2" /> Carbon monoxide alarm</li>}
            {rules.smoke_alarm && <li className="flex items-center"><IoMdAlert className="mr-2" /> Smoke alarm</li>}
            <li className="flex items-center"><MdSecurity className="mr-2" /> Security Deposit - if you damage the home, you may be charged up to ${rules.security_deposit}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PropertyRules;
