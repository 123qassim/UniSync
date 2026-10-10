/**
 * ZeroQ Domain Models & Types
 * Complete University Admission, Onboarding & Campus Commerce Platform
 */

export type ZeroQRole =
  | 'student'
  | 'admissions_officer'
  | 'university_admin'
  | 'merchant'
  | 'platform_admin';

export interface KUCCPSPlacementRecord {
  studentName: string;
  kcseIndexNumber: string;
  examinationYear: number;
  placementStatus: 'Successfully Placed' | 'Pending Placement' | 'Not Placed';
  institutionName: string;
  institutionCode: string;
  programmeName: string;
  programmeCode: string;
  placementCategory: 'Degree' | 'Diploma' | 'Certificate';
  resultVerification: string;
  officialPortalUrl: string;
  letterDownloaded: boolean;
  isDemo: boolean;
}

export interface ZeroQUniversity {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  coverImage: string;
  location: string;
  officialWebsiteUrl: string;
  portalUrl: string;
  description: string;
  studentCount: string;
  ranking: string;
  facultiesCount: number;
  programmesCount: number;
  programmes: {
    code: string;
    name: string;
    level: string;
    duration: string;
    tuitionPerYearKSh: number;
    clusterPoints: number;
    requirements: string[];
  }[];
  admissionRequirements: string[];
  academicCalendar: {
    semester: string;
    reportingDate: string;
    orientationWeek: string;
    classesBegin: string;
  };
  accommodation: {
    onCampusAvailable: boolean;
    hostelBookingUrl: string;
    averageFeePerSemesterKSh: number;
    description: string;
  };
  studentServices: string[];
  contacts: {
    admissionsEmail: string;
    phone: string;
    postalAddress: string;
  };
  isDemo: boolean;
}

export type ApplicationStatus =
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'More Information Required'
  | 'Approved'
  | 'Rejected'
  | 'Withdrawn';

export interface ApplicationTimelineEvent {
  id: string;
  status: ApplicationStatus;
  note: string;
  timestamp: string;
  actor: string;
}

export interface ZeroQApplication {
  id: string; // e.g. "ZQ-APP-2026-0042"
  studentId: string;
  studentName: string;
  universityId: string;
  universityName: string;
  programmeName: string;
  programmeCode: string;
  status: ApplicationStatus;
  submissionTimestamp?: string;
  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    email: string;
    phone: string;
    county: string;
    nationality: string;
  };
  academicInfo: {
    examinationType: string;
    examinationYear: number;
    schoolAttended: string;
    indexNumber: string;
    meanGrade: string;
    placementDetails: string;
  };
  timeline: ApplicationTimelineEvent[];
  reviewerComments?: string;
  isDemo: boolean;
}

export type DocumentReviewStatus =
  | 'Missing'
  | 'Uploaded'
  | 'Under Review'
  | 'Accepted'
  | 'Rejected'
  | 'Resubmission Required';

export interface ZeroQDocument {
  id: string;
  documentType:
    | 'KUCCPS Placement Letter'
    | 'KCSE Official Result Slip'
    | 'National ID / Birth Certificate'
    | 'Passport Photograph'
    | 'Medical Examination Form';
  fileName?: string;
  fileSize?: string;
  uploadedAt?: string;
  status: DocumentReviewStatus;
  reviewerComments?: string;
  isMandatory: boolean;
  demoSampleUrl?: string;
}

export interface ZeroQStudentCredential {
  credentialId: string; // e.g. "DEMO-CRED-MS-2026-0042"
  studentName: string;
  universityName: string;
  programmeName: string;
  studentNumber: string; // e.g. "DEMO-MS-2026-0042"
  status: 'Pending Verification' | 'Demo Verified' | 'Revoked' | 'Suspended';
  issueDate: string;
  expiryDate: string;
  issuingInstitution: string;
  photoUrl: string;
  qrPayload: string; // encoded verification URL
  isDemo: boolean;
}

export interface CampusMerchant {
  id: string;
  name: string;
  category: string;
  location: string;
  contactPhone: string;
  rating: number;
  totalOrders: number;
  bannerImage: string;
  isDemo: boolean;
}

export interface CampusProduct {
  id: string;
  merchantId: string;
  merchantName: string;
  name: string;
  category: string;
  priceKSh: number;
  stockQuantity: number;
  rating: number;
  reviewsCount: number;
  description: string;
  imageUrl: string;
  isVoucherEligible: boolean;
  isDemo: boolean;
}

export interface ZeroQCartItem {
  productId: string;
  product: CampusProduct;
  quantity: number;
}

export type OrderStatus =
  | 'Pending Payment'
  | 'Paid'
  | 'Processing'
  | 'Ready For Collection'
  | 'Collected'
  | 'Cancelled';

export interface ZeroQOrder {
  orderId: string; // e.g. "ZQ-ORD-1042"
  studentId: string;
  studentName: string;
  merchantId: string;
  merchantName: string;
  items: {
    productId: string;
    productName: string;
    unitPriceKSh: number;
    quantity: number;
    totalKSh: number;
  }[];
  subtotalKSh: number;
  feesKSh: number;
  totalKSh: number;
  status: OrderStatus;
  paymentMethod: 'Demo M-Pesa' | 'Demo Card' | 'Campus Voucher';
  paymentReference?: string;
  deliveryOption: 'Campus Collection' | 'Hostel Delivery';
  deliveryNote?: string;
  timestamp: string;
  voucherId?: string;
  isDemo: boolean;
}

export type VoucherStatus = 'Active' | 'Redeemed' | 'Expired' | 'Cancelled';

export interface ZeroQCampusVoucher {
  voucherId: string; // e.g. "ZQ-DEMO-2026-00841"
  orderId: string;
  studentId: string;
  studentName: string;
  merchantId: string;
  merchantName: string;
  itemName: string;
  valueKSh: number;
  status: VoucherStatus;
  qrCodeData: string;
  issueDate: string;
  expiryDate: string;
  redeemedAt?: string;
  redeemedByMerchant?: string;
  isDemo: boolean;
}

export interface ZeroQAuditLog {
  id: string;
  actorRole: string;
  actorName: string;
  action: string;
  target: string;
  timestamp: string;
  details: string;
}

export interface ZeroQNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'admission' | 'document' | 'verification' | 'order' | 'voucher';
}
