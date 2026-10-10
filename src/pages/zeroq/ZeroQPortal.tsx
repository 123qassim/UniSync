/**
 * ZeroQ Unified Portal
 * UniSync Ecosystem: University Admission, Student Onboarding & Campus Commerce Platform
 */

import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Building2,
  FileText,
  FileCheck,
  Camera,
  QrCode,
  ShoppingBag,
  Ticket,
  Users,
  Store,
  Settings,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShoppingCart
} from 'lucide-react';
import { ZeroQLogo } from '../../components/BrandLogos';

import {
  KUCCPSPlacementRecord,
  ZeroQApplication,
  ZeroQDocument,
  ZeroQStudentCredential,
  CampusMerchant,
  CampusProduct,
  ZeroQCartItem,
  ZeroQOrder,
  ZeroQCampusVoucher,
  ZeroQAuditLog,
  ApplicationStatus,
  DocumentReviewStatus,
} from '../../types/zeroq';

import {
  DEFAULT_PLACEMENT_RECORD,
  INITIAL_APPLICATION,
  INITIAL_DOCUMENTS,
  INITIAL_CREDENTIAL,
  CAMPUS_MERCHANTS,
  CAMPUS_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_VOUCHERS,
  INITIAL_AUDIT_LOGS,
} from '../../data/zeroqMockData';

import { ZeroQStudentDashboard } from './ZeroQStudentDashboard';
import { ZeroQPlacementModule } from './ZeroQPlacementModule';
import { ZeroQUniversityDiscovery } from './ZeroQUniversityDiscovery';
import { ZeroQApplicationWizard } from './ZeroQApplicationWizard';
import { ZeroQDocumentCentre } from './ZeroQDocumentCentre';
import { ZeroQFaceVerification } from './ZeroQFaceVerification';
import { ZeroQDigitalStudentID } from './ZeroQDigitalStudentID';
import { ZeroQMarketplace } from './ZeroQMarketplace';
import { ZeroQCartAndCheckout } from './ZeroQCartAndCheckout';
import { ZeroQVouchers } from './ZeroQVouchers';
import { ZeroQAdmissionsDashboard } from './ZeroQAdmissionsDashboard';
import { ZeroQMerchantDashboard } from './ZeroQMerchantDashboard';
import { ZeroQAdminDashboard } from './ZeroQAdminDashboard';

interface ZeroQPortalProps {
  onOpenApexAI: () => void;
  onNavigateHome?: () => void;
  initialTab?: string;
}

export type ZeroQViewRole = 'student' | 'admissions' | 'merchant' | 'admin';

export const ZeroQPortal: React.FC<ZeroQPortalProps> = ({
  onOpenApexAI,
  onNavigateHome,
  initialTab = 'overview',
}) => {
  // Active Role and Sub-Tab
  const [activeRole, setActiveRole] = useState<ZeroQViewRole>('student');
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Live Data States
  const [placement, setPlacement] = useState<KUCCPSPlacementRecord>(DEFAULT_PLACEMENT_RECORD);
  const [applications, setApplications] = useState<ZeroQApplication[]>([INITIAL_APPLICATION]);
  const [documents, setDocuments] = useState<ZeroQDocument[]>(INITIAL_DOCUMENTS);
  const [credential, setCredential] = useState<ZeroQStudentCredential>(INITIAL_CREDENTIAL);
  const [merchants, setMerchants] = useState<CampusMerchant[]>(CAMPUS_MERCHANTS);
  const [products, setProducts] = useState<CampusProduct[]>(CAMPUS_PRODUCTS);
  const [orders, setOrders] = useState<ZeroQOrder[]>(INITIAL_ORDERS);
  const [vouchers, setVouchers] = useState<ZeroQCampusVoucher[]>(INITIAL_VOUCHERS);
  const [auditLogs, setAuditLogs] = useState<ZeroQAuditLog[]>(INITIAL_AUDIT_LOGS);

  // Cart State
  const [cart, setCart] = useState<ZeroQCartItem[]>([]);

  // Feedback Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Synchronize initial data from backend if available
  const loadZeroQData = async () => {
    try {
      const [
        placementRes,
        appsRes,
        docsRes,
        credRes,
        merchantsRes,
        productsRes,
        ordersRes,
        vouchersRes,
        logsRes,
      ] = await Promise.all([
        fetch('/api/zeroq/placement').then((r) => (r.ok ? r.json() : null)),
        fetch('/api/zeroq/applications').then((r) => (r.ok ? r.json() : null)),
        fetch('/api/zeroq/documents').then((r) => (r.ok ? r.json() : null)),
        fetch('/api/zeroq/credentials').then((r) => (r.ok ? r.json() : null)),
        fetch('/api/zeroq/merchants').then((r) => (r.ok ? r.json() : null)),
        fetch('/api/zeroq/products').then((r) => (r.ok ? r.json() : null)),
        fetch('/api/zeroq/orders').then((r) => (r.ok ? r.json() : null)),
        fetch('/api/zeroq/vouchers').then((r) => (r.ok ? r.json() : null)),
        fetch('/api/zeroq/admin/audit-logs').then((r) => (r.ok ? r.json() : null)),
      ]);

      if (placementRes) setPlacement(placementRes);
      if (appsRes && appsRes.length) setApplications(appsRes);
      if (docsRes && docsRes.length) setDocuments(docsRes);
      if (credRes) setCredential(credRes);
      if (merchantsRes && merchantsRes.length) setMerchants(merchantsRes);
      if (productsRes && productsRes.length) setProducts(productsRes);
      if (ordersRes && ordersRes.length) setOrders(ordersRes);
      if (vouchersRes && vouchersRes.length) setVouchers(vouchersRes);
      if (logsRes && logsRes.length) setAuditLogs(logsRes);
    } catch {
      // Keep state initialized from mock data
    }
  };

  useEffect(() => {
    loadZeroQData();
  }, []);

  // Update URL hash or scroll on tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Handlers ---
  const handleDownloadPlacementLetter = async () => {
    try {
      const res = await fetch('/api/zeroq/placement/download-letter', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setPlacement(data.placement);
        showToast('KUCCPS Placement Offer letter generated and simulated download ready.');
      }
    } catch {
      setPlacement((prev) => ({ ...prev, letterDownloaded: true }));
      showToast('Downloaded simulated KUCCPS placement letter.');
    }
  };

  const handleSaveApplication = async (newApp: ZeroQApplication) => {
    try {
      const res = await fetch('/api/zeroq/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApp),
      });
      if (res.ok) {
        const saved = await res.json();
        setApplications((prev) => [saved, ...prev.filter((a) => a.id !== saved.id)]);
      } else {
        setApplications((prev) => [newApp, ...prev.filter((a) => a.id !== newApp.id)]);
      }
    } catch {
      setApplications((prev) => [newApp, ...prev.filter((a) => a.id !== newApp.id)]);
    }
    showToast('Admissions application submitted successfully to Maseno University registrar.');
  };

  const handleUploadDocument = async (docType: ZeroQDocument['documentType'], fileName: string) => {
    try {
      const res = await fetch('/api/zeroq/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentType: docType, fileName }),
      });
      if (res.ok) {
        const data = await res.json();
        setDocuments((prev) =>
          prev.map((d) => (d.documentType === docType ? data.document : d))
        );
      } else {
        setDocuments((prev) =>
          prev.map((d) =>
            d.documentType === docType
              ? {
                  ...d,
                  fileName,
                  fileSize: '1.8 MB',
                  uploadedAt: new Date().toISOString(),
                  status: 'Uploaded',
                }
              : d
          )
        );
      }
    } catch {
      setDocuments((prev) =>
        prev.map((d) =>
          d.documentType === docType
            ? {
                ...d,
                fileName,
                fileSize: '1.8 MB',
                uploadedAt: new Date().toISOString(),
                status: 'Uploaded',
              }
            : d
        )
      );
    }
    showToast(`Document "${fileName}" submitted for review.`);
  };

  const handleUpdateAppStatus = async (
    appId: string,
    status: ApplicationStatus,
    note: string
  ) => {
    try {
      const res = await fetch(`/api/zeroq/applications/${appId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note, actor: 'Registrar Admissions Officer' }),
      });
      if (res.ok) {
        const data = await res.json();
        setApplications((prev) => prev.map((a) => (a.id === appId ? data.application : a)));
        if (data.credential) setCredential(data.credential);
      }
    } catch {
      setApplications((prev) =>
        prev.map((a) =>
          a.id === appId
            ? {
                ...a,
                status,
                reviewerComments: note,
                timeline: [
                  ...a.timeline,
                  {
                    id: `evt-${Date.now()}`,
                    status,
                    note,
                    timestamp: new Date().toISOString(),
                    actor: 'Registrar Admissions Officer',
                  },
                ],
              }
            : a
        )
      );
      if (status === 'Approved') {
        setCredential((prev) => ({ ...prev, status: 'Demo Verified' }));
      }
    }
    showToast(`Application ${appId} marked as "${status}".`);
  };

  const handleUpdateDocStatus = async (
    docId: string,
    status: DocumentReviewStatus,
    comments: string
  ) => {
    try {
      const res = await fetch(`/api/zeroq/documents/${docId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, comments, actor: 'Registrar Admissions Officer' }),
      });
      if (res.ok) {
        const data = await res.json();
        setDocuments((prev) => prev.map((d) => (d.id === docId ? data.document : d)));
      }
    } catch {
      setDocuments((prev) =>
        prev.map((d) => (d.id === docId ? { ...d, status, reviewerComments: comments } : d))
      );
    }
    showToast(`Document verified as "${status}".`);
  };

  const handleFaceVerificationComplete = async () => {
    try {
      const res = await fetch('/api/zeroq/credentials/verify-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Demo Verified', actor: 'Automated Biometric Liveness Engine' }),
      });
      if (res.ok) {
        const cred = await res.json();
        setCredential(cred);
      } else {
        setCredential((prev) => ({ ...prev, status: 'Demo Verified' }));
      }
    } catch {
      setCredential((prev) => ({ ...prev, status: 'Demo Verified' }));
    }
    showToast('Biometric face verification completed. Digital Student ID credential activated!');
  };

  // Cart operations
  const handleAddToCart = (product: CampusProduct, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId: product.id, product, quantity }];
    });
    showToast(`Added ${quantity}x "${product.name}" to cart.`);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleOrderPlaced = (order: ZeroQOrder, voucher: ZeroQCampusVoucher) => {
    setOrders((prev) => [order, ...prev]);
    setVouchers((prev) => [voucher, ...prev]);
    setCart([]);
    showToast(`Order ${order.orderId} placed! Campus Collection Voucher generated.`);
  };

  const handleRedeemVoucher = async (voucherIdOrCode: string, merchantId: string) => {
    try {
      const res = await fetch('/api/zeroq/vouchers/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voucherCode: voucherIdOrCode, merchantId }),
      });
      const data = await res.json();
      if (res.ok) {
        setVouchers((prev) =>
          prev.map((v) => (v.voucherId === data.voucher.voucherId ? data.voucher : v))
        );
        loadZeroQData();
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.error || 'Failed to redeem voucher' };
      }
    } catch {
      return { success: false, message: 'Server communication error' };
    }
  };

  const handleResetDemoData = async () => {
    try {
      const res = await fetch('/api/zeroq/admin/reset', { method: 'POST' });
      if (res.ok) {
        await loadZeroQData();
        showToast('All ZeroQ demo records reset to pristine seed state.');
      }
    } catch {
      // Local fallback reset
      setPlacement(DEFAULT_PLACEMENT_RECORD);
      setApplications([INITIAL_APPLICATION]);
      setDocuments(INITIAL_DOCUMENTS);
      setCredential(INITIAL_CREDENTIAL);
      setOrders(INITIAL_ORDERS);
      setVouchers(INITIAL_VOUCHERS);
      showToast('Demo data reset locally.');
    }
  };

  // Calculations for Badges
  const activeApplication = applications[0] || INITIAL_APPLICATION;
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const activeVouchersCount = vouchers.filter((v) => v.status === 'Active').length;
  const isVerifiedStudent = credential.status === 'Demo Verified';

  // Navigation Items for Student Role
  const studentNavItems = [
    { id: 'overview', label: 'Onboarding Hub', icon: FileCheck },
    { id: 'placement', label: 'KUCCPS Placement', icon: GraduationCap },
    { id: 'universities', label: 'Universities & Catalog', icon: Building2 },
    { id: 'application', label: 'Admission Application', icon: FileText, badge: activeApplication.status },
    { id: 'documents', label: 'Document Centre', icon: FileCheck },
    { id: 'face-check', label: 'Face Verification', icon: Camera, badge: isVerifiedStudent ? 'Verified' : 'Required' },
    { id: 'digital-id', label: 'Digital Student ID', icon: QrCode },
    { id: 'marketplace', label: 'Campus Marketplace', icon: ShoppingBag },
    { id: 'cart', label: 'Cart & Checkout', icon: ShoppingCart, count: totalCartCount },
    { id: 'vouchers', label: 'Campus Vouchers', icon: Ticket, count: activeVouchersCount },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ZeroQ Top Brand & Role Bar */}
      <div className="bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Brand Title */}
            <div className="flex items-center gap-3">
              <ZeroQLogo size={42} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-tight text-white">ZeroQ</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/40 px-2.5 py-0.5 rounded-full">
                    Admissions & Commerce
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Paperless university onboarding, digital student ID & campus voucher infrastructure
                </p>
              </div>
            </div>

            {/* Role Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto overflow-x-auto max-w-full">
              <button
                onClick={() => {
                  setActiveRole('student');
                  setActiveTab('overview');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  activeRole === 'student'
                    ? 'bg-teal-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Student Hub</span>
              </button>

              <button
                onClick={() => {
                  setActiveRole('admissions');
                  setActiveTab('admissions-admin');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  activeRole === 'admissions'
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Admissions Officer</span>
              </button>

              <button
                onClick={() => {
                  setActiveRole('merchant');
                  setActiveTab('merchant');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  activeRole === 'merchant'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Merchant POS</span>
              </button>

              <button
                onClick={() => {
                  setActiveRole('admin');
                  setActiveTab('admin');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  activeRole === 'admin'
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Platform Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Role Navigation Strip (When Student Hub is active) */}
      {activeRole === 'student' && (
        <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar">
              {studentNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    {item.count !== undefined && item.count > 0 && (
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-teal-400 text-slate-950' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {item.count}
                      </span>
                    )}
                    {item.badge && (
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                        item.badge === 'Approved' || item.badge === 'Verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Role Notice Banner for Officer / Merchant / Admin */}
      {activeRole !== 'student' && (
        <div className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="flex items-center gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-violet-400" />
              <span>
                Simulating active portal role:{' '}
                <strong className="text-white capitalize">{activeRole.replace('-', ' ')}</strong>
              </span>
            </span>
            <button
              onClick={() => {
                setActiveRole('student');
                setActiveTab('overview');
              }}
              className="text-teal-400 hover:underline font-semibold flex items-center gap-1"
            >
              <span>Back to Student Portal</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="mt-4">
        {activeRole === 'student' && (
          <>
            {activeTab === 'overview' && (
              <ZeroQStudentDashboard
                placement={placement}
                application={activeApplication}
                documents={documents}
                credential={credential}
                vouchers={vouchers}
                orders={orders}
                onNavigateTab={handleTabChange}
                onOpenApexAI={onOpenApexAI}
              />
            )}

            {activeTab === 'placement' && (
              <ZeroQPlacementModule
                placement={placement}
                onDownloadLetter={handleDownloadPlacementLetter}
                onNavigateTab={handleTabChange}
              />
            )}

            {activeTab === 'universities' && (
              <ZeroQUniversityDiscovery
                onStartApplication={() => handleTabChange('application')}
                onOpenApexAI={onOpenApexAI}
                applicationStatus={activeApplication.status}
              />
            )}

            {activeTab === 'application' && (
              <ZeroQApplicationWizard
                existingApplication={activeApplication}
                documents={documents}
                onSaveApplication={handleSaveApplication}
                onNavigateTab={handleTabChange}
              />
            )}

            {activeTab === 'documents' && (
              <ZeroQDocumentCentre
                documents={documents}
                onUploadDocument={handleUploadDocument}
                onNavigateTab={handleTabChange}
              />
            )}

            {activeTab === 'face-check' && (
              <ZeroQFaceVerification
                onVerificationComplete={handleFaceVerificationComplete}
                onNavigateTab={handleTabChange}
              />
            )}

            {activeTab === 'digital-id' && (
              <ZeroQDigitalStudentID
                credential={credential}
                onNavigateTab={handleTabChange}
                onOpenApexAI={onOpenApexAI}
              />
            )}

            {activeTab === 'marketplace' && (
              <ZeroQMarketplace
                products={products}
                merchants={merchants}
                onAddToCart={handleAddToCart}
                onOpenCart={() => handleTabChange('cart')}
                cartCount={totalCartCount}
              />
            )}

            {activeTab === 'cart' && (
              <ZeroQCartAndCheckout
                cart={cart}
                onUpdateQuantity={handleUpdateCartQuantity}
                onRemoveItem={handleRemoveCartItem}
                onClearCart={handleClearCart}
                onOrderPlaced={handleOrderPlaced}
                onNavigateTab={handleTabChange}
              />
            )}

            {activeTab === 'vouchers' && (
              <ZeroQVouchers
                vouchers={vouchers}
                onNavigateTab={handleTabChange}
              />
            )}
          </>
        )}

        {activeRole === 'admissions' && (
          <ZeroQAdmissionsDashboard
            applications={applications}
            documents={documents}
            onUpdateAppStatus={handleUpdateAppStatus}
            onUpdateDocStatus={handleUpdateDocStatus}
          />
        )}

        {activeRole === 'merchant' && (
          <ZeroQMerchantDashboard
            merchants={merchants}
            products={products}
            orders={orders}
            vouchers={vouchers}
            onRedeemVoucher={handleRedeemVoucher}
          />
        )}

        {activeRole === 'admin' && (
          <ZeroQAdminDashboard
            metrics={{
              registeredDemoStudents: 1,
              submittedApplications: applications.length,
              applicationsAwaitingReview: applications.filter(
                (a) => a.status === 'Submitted' || a.status === 'Under Review'
              ).length,
              completedOnboardingJourneys: isVerifiedStudent ? 1 : 0,
              activeDemoCredentials: isVerifiedStudent ? 1 : 0,
              demoMerchants: merchants.length,
              demoOrders: orders.length,
              activeVouchers: activeVouchersCount,
              successfulRedemptions: vouchers.filter((v) => v.status === 'Redeemed').length,
            }}
            auditLogs={auditLogs}
            onResetDemoData={handleResetDemoData}
          />
        )}
      </div>
    </div>
  );
};
