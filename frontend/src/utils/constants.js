export const ROLES = {
  INDIVIDUAL_DONOR: 'individual_donor',
  RESTAURANT_DONOR: 'restaurant_donor',
  NGO: 'ngo',
  INDIVIDUAL_RECIPIENT: 'individual_recipient',
};

export const ROLE_LABELS = {
  [ROLES.INDIVIDUAL_DONOR]: 'Individual Donor',
  [ROLES.RESTAURANT_DONOR]: 'Restaurant / Business',
  [ROLES.NGO]: 'NGO / Community Org',
  [ROLES.INDIVIDUAL_RECIPIENT]: 'Food Seeker',
};

export const ROLE_DESCRIPTIONS = {
  [ROLES.INDIVIDUAL_DONOR]: 'Share surplus food from your home or events',
  [ROLES.RESTAURANT_DONOR]: 'List surplus food from your restaurant or business at low prices or for free',
  [ROLES.NGO]: 'Collect food on behalf of people your organization supports',
  [ROLES.INDIVIDUAL_RECIPIENT]: 'Find affordable or free food near you',
};

export const DIETARY_TAGS = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free',
  'Halal', 'Kosher', 'Nut-Free', 'Organic',
];

export const ALLERGENS = [
  'Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Wheat',
  'Soy', 'Fish', 'Shellfish', 'Sesame',
];

export const FOOD_CATEGORIES = [
  'Prepared Meals', 'Fresh Produce', 'Baked Goods',
  'Dairy & Eggs', 'Grains & Pasta', 'Beverages',
  'Canned Goods', 'Snacks', 'Mixed / Other',
];

export const CLAIM_STATUS = {
  AVAILABLE: 'available',
  PENDING: 'pending',
  CLAIMED: 'claimed',
  RESERVED: 'reserved',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  PICKED_UP: 'picked_up',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
};

export const CLAIM_STATUS_LABELS = {
  available: 'Available',
  pending: 'Pending',
  claimed: 'Claimed',
  reserved: 'Reserved',
  accepted: 'Accepted',
  rejected: 'Rejected',
  picked_up: 'Picked Up',
  expired: 'Expired',
  cancelled: 'Cancelled',
};

export const isDonorRole = (role) =>
  role === ROLES.INDIVIDUAL_DONOR || role === ROLES.RESTAURANT_DONOR;

export const isRecipientRole = (role) =>
  role === ROLES.NGO || role === ROLES.INDIVIDUAL_RECIPIENT;
