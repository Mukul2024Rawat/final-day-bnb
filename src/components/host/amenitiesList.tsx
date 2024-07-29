// amenitiesList.ts

import React from 'react';
import {
  MdAcUnit, MdKitchen, MdLocalLaundryService, MdFitnessCenter, MdLocalParking,
  MdPool, MdOutdoorGrill, MdPets
} from 'react-icons/md';
import { FiWifi, FiTv, FiHome } from 'react-icons/fi';
import { FaFirstAid, FaBell, FaShieldAlt } from 'react-icons/fa';

export const amenitiesList = [
  { id: '1', name: 'Air conditioning', icon: <MdAcUnit /> },
  { id: '2', name: 'WiFi', icon: <FiWifi /> },
  { id: '3', name: 'TV', icon: <FiTv /> },
  { id: '4', name: 'Kitchen', icon: <MdKitchen /> },
  { id: '5', name: 'Washing machine', icon: <MdLocalLaundryService /> },
  { id: '6', name: 'Exercise equipment', icon: <MdFitnessCenter /> },
  { id: '7', name: 'Parking', icon: <MdLocalParking /> },
  { id: '8', name: 'Swimming pool', icon: <MdPool /> },
  { id: '9', name: 'Outdoor dining area', icon: <MdOutdoorGrill /> },
  { id: '10', name: 'First aid kit', icon: <FaFirstAid /> },
  { id: '11', name: 'Pet allowed', icon: <MdPets /> },
  { id: '12', name: 'Smoke alarm', icon: <FaBell /> },
  { id: '13', name: 'Dedicated workspace', icon: <FiHome /> },
  { id: '14', name: 'Security and monitoring', icon: <FaShieldAlt /> },
];