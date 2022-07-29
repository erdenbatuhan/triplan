export const EMPTY_FILTER = {
  filterData: {
    selectedCity: '',
    restaurantFilter: { cuisines: [], foodTypes: [], priceLevels: [] },
    touristAttractionFilter: { types: [] }
  }
};

export const CUISINES = [
  'Japanese',
  'Chinese',
  'Indian',
  'Lebanese',
  'Turkish',
  'Greek',
  'Italian',
  'German',
  'Spanish',
  'American',
  'Mexican'
];
export const PRICE_LEVELS = ['€', '€€', '€€€'];
export const FOOD_TYPES = ['Regular', 'Vegetarian', 'Vegan', 'Gluten Free'];
export const TOURIST_ATTRACTION_TYPES = [
  'Museum',
  'Art Gallery',
  'Point of Interest',
  'Establishment',
  'Church',
  'Place of Worship',
  'Park',
  'Natural Feature',
  'Travel Agency',
  'Mosque',
  'Lodging',
  'City Hall',
  'Local Government Office',
  'Night Club',
  'School',
  'Department Store',
  'Store',
  'Synagogue',
  'Bar',
  'Restaurant',
  'Food',
  'Aquarium',
  'Spa',
  'Stadium',
  'Home Goods Store',
  'Cafe',
  'Library',
  'Zoo',
  'Parking',
  'Book Store',
  'Cemetery',
  'Amusement Park',
  'Movie Theater',
  'Jewelry Store',
  'Train Station',
  'Transit Station',
  'Shopping Mall',
  'General Contractor',
  'Finance',
  'Health',
  'Route',
  'Hair Care',
  'University',
  'Meal Takeaway'
];
export const TOURIST_ATTRACTION_TYPE_MAP = [
  {
    name: 'Tourist Attraction',
    value: 'tourist_attraction'
  },
  {
    name: 'Museum',
    value: 'museum'
  },
  {
    name: 'Point of Interest',
    value: 'point_of_interest'
  },
  {
    name: 'Establishment',
    value: 'establishment'
  },
  {
    name: 'Church',
    value: 'church'
  },
  {
    name: 'Place of Worship',
    value: 'place_of_worship'
  },
  {
    name: 'Park',
    value: 'park'
  },
  {
    name: 'Art Gallery',
    value: 'art_gallery'
  },
  {
    name: 'Natural Feature',
    value: 'natural_feature'
  },
  {
    name: 'Travel Agency',
    value: 'travel_agency'
  },
  {
    name: 'Mosque',
    value: 'mosque'
  },
  {
    name: 'Lodging',
    value: 'lodging'
  },
  {
    name: 'City Hall',
    value: 'city_hall'
  },
  {
    name: 'Local Government Office',
    value: 'local_government_office'
  },
  {
    name: 'Night Club',
    value: 'night_club'
  },
  {
    name: 'School',
    value: 'school'
  },
  {
    name: 'Department Store',
    value: 'department_store'
  },
  {
    name: 'Store',
    value: 'store'
  },
  {
    name: 'Synagogue',
    value: 'synagogue'
  },
  {
    name: 'Bar',
    value: 'bar'
  },
  {
    name: 'Restaurant',
    value: 'restaurant'
  },
  {
    name: 'Food',
    value: 'food'
  },
  {
    name: 'Aquarium',
    value: 'aquarium'
  },
  {
    name: 'Spa',
    value: 'spa'
  },
  {
    name: 'Stadium',
    value: 'stadium'
  },
  {
    name: 'Home Goods Store',
    value: 'home_goods_store'
  },
  {
    name: 'Cafe',
    value: 'cafe'
  },
  {
    name: 'Library',
    value: 'library'
  },
  {
    name: 'Zoo',
    value: 'zoo'
  },
  {
    name: 'Parking',
    value: 'parking'
  },
  {
    name: 'Book Store',
    value: 'book_store'
  },
  {
    name: 'Cemetery',
    value: 'cemetery'
  },
  {
    name: 'Amusement Park',
    value: 'amusement_park'
  },
  {
    name: 'Movie Theater',
    value: 'movie_theater'
  },
  {
    name: 'Jewelry Store',
    value: 'jewelry_store'
  },
  {
    name: 'Train Station',
    value: 'train_station'
  },
  {
    name: 'Transit Station',
    value: 'transit_station'
  },
  {
    name: 'Shopping Mall',
    value: 'shopping_mall'
  },
  {
    name: 'General Contractor',
    value: 'general_contractor'
  },
  {
    name: 'Finance',
    value: 'finance'
  },
  {
    name: 'Health',
    value: 'health'
  },
  {
    name: 'Route',
    value: 'route'
  },
  {
    name: 'Hair Care',
    value: 'hair_care'
  },
  {
    name: 'University',
    value: 'university'
  },
  {
    name: 'Meal Takeaway',
    value: 'meal_takeaway'
  }
];

export const PARTNER_TYPE_RESTAURANT = 'RESTAURANT';
export const PARTNER_TYPE_TOURIST_ATTRACTION = 'TOURIST_ATTRACTION';

export const USER_TYPE_ADMIN = 'ADMIN';
export const USER_TYPE_USER = 'USER';
export const USER_TYPE_RESTAURANT = PARTNER_TYPE_RESTAURANT;
export const USER_TYPE_TOURIST_ATTRACTION = PARTNER_TYPE_TOURIST_ATTRACTION;

export const TRANSACTION_TYPE_DEPOSIT = 'Deposit';
export const TRANSACTION_TYPE_WITHDRAW = 'Withdraw';
export const TRANSACTION_TYPE_PURCHASE = 'Purchase';

export const TRANSACTION_STATUS_SUCCESSFUL = 'Successful';
export const TRANSACTION_STATUS_REJECTED = 'Rejected';

export const CURRENCIES = [
  {
    value: 'USD',
    label: '$'
  },
  {
    value: 'EUR',
    label: '€'
  }
];

export const PRIMARY_COLOR = '#15A4FF';
export const SECONDARY_COLOR = '#FFF7E3';

export const MIN_AMOUNT_FOR_COUPON = 100;
export const DEFAULT_VALUE_OF_COUPON = 5;
