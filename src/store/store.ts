export interface SideBarMenuItemType {
  name: string;
  icon: JSX.Element;
  path?: string;
  isExpandable?: boolean;
  subItems?: SideBarMenuItemType[]; 
}

export interface MemberDetails {
  Member_id: string;
  Name: string;
  mobileno: string;
  email: string;
  state: string;
  city: string;
  address: string;
  pincode: string;
  Father_name: string;
  gender: string;
  dob: string;
  Date_of_joining: string;
  spackage: string;
  package_value: number;
  epin_no: string;
  amount: number;
  mode_of_payment: string;
  Pan_no: string;
  Nominee_name: string;
  Nominee_age: number;
  Nominee_Relation: string;
  status: string;
  node: string;
  transaction_pass: string;
  bdb_value: string;
  directreferal_value: string;
  bank_details: string;
  last_logged_in: string;
  google_pay: string;
  phonepe: string;
  member_code: string;
  roi_status: string;
  upgrade_package: string;
  upgrade_status: string;
  level_eligible: string;
  TBPDays: string;
  level_income: string;
  direct_income: string;
}
 export interface SponsorRewardData {
  isEligibleForReward: boolean;
  rewardAmount?: number;
  // other properties from your API response
}

export interface PaymentCustomer {
  customer_id?: string;
  customer_email: string;
  customer_phone: string;
  customer_name?: string;
}

export interface PaymentNotes {
  note?: string;
  meta?: any;
}

export interface CreateOrderRequest {
  amount: number;
  currency?: string;
  customer: PaymentCustomer;
  notes?: PaymentNotes;
}

export interface CreateOrderResponse {
  orderId: string;
  cfOrderId: string;
  paymentSessionId: string;
  amount: number;
  currency: string;
  status: string;
}


