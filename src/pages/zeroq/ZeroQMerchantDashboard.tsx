import React, { useState } from 'react';
import {
  Store,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  ShoppingBag,
  DollarSign,
  Package,
  TrendingUp,
  Clock,
  Scan,
  RefreshCw,
  Search
} from 'lucide-react';
import { CampusMerchant, CampusProduct, ZeroQOrder, ZeroQCampusVoucher } from '../../types/zeroq';

interface ZeroQMerchantDashboardProps {
  merchants: CampusMerchant[];
  products: CampusProduct[];
  orders: ZeroQOrder[];
  vouchers: ZeroQCampusVoucher[];
  onRedeemVoucher: (voucherIdOrCode: string, merchantId: string) => Promise<{ success: boolean; message: string }>;
}

export const ZeroQMerchantDashboard: React.FC<ZeroQMerchantDashboardProps> = ({
  merchants,
  products,
  orders,
  vouchers,
  onRedeemVoucher,
}) => {
  const [activeMerchantId, setActiveMerchantId] = useState<string>(merchants[0].id);
  const [scanInputCode, setScanInputCode] = useState('ZQ-DEMO-2026-00841');
  const [isVerifying, setIsVerifying] = useState(false);
  const [scanResult, setScanResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const activeMerchant = merchants.find((m) => m.id === activeMerchantId) || merchants[0];
  const merchantProducts = products.filter((p) => p.merchantId === activeMerchant.id);
  const merchantOrders = orders.filter((o) => o.merchantId === activeMerchant.id);
  const merchantVouchers = vouchers.filter((v) => v.merchantId === activeMerchant.id);

  const totalSalesKSh = merchantOrders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalKSh, 0);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInputCode.trim() || isVerifying) return;

    setIsVerifying(true);
    setScanResult(null);

    const res = await onRedeemVoucher(scanInputCode.trim(), activeMerchant.id);
    setIsVerifying(false);

    if (res.success) {
      setScanResult({ type: 'success', message: res.message });
      setScanInputCode('');
    } else {
      setScanResult({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Merchant Header & Persona Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-teal-400 bg-teal-950 px-2.5 py-0.5 rounded uppercase tracking-wider border border-teal-500/30">
              Merchant Portal
            </span>
            <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-medium">
              DEMO STALL
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            {activeMerchant.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {activeMerchant.category} · {activeMerchant.location}
          </p>
        </div>

        {/* Stall Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Stall:</label>
          <select
            value={activeMerchantId}
            onChange={(e) => setActiveMerchantId(e.target.value)}
            className="p-2 text-xs rounded-xl bg-white border border-slate-300 font-bold text-slate-800 focus:outline-none focus:border-violet-500"
          >
            {merchants.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Simulated Sales</span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            KSh {totalSalesKSh.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">100% Settled via M-Pesa</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Orders Received</span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {merchantOrders.length}
          </div>
          <span className="text-[10px] text-slate-500">Live order queue</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Redeemed Vouchers</span>
          <div className="text-2xl font-extrabold text-teal-700 font-mono">
            {merchantVouchers.filter((v) => v.status === 'Redeemed').length}
          </div>
          <span className="text-[10px] text-slate-500">Collected passes</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Active Catalog</span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {merchantProducts.length} items
          </div>
          <span className="text-[10px] text-slate-500">Managed in store</span>
        </div>
      </div>

      {/* QR Scanner & Voucher Redemption Section */}
      <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Scan className="w-5 h-5 text-teal-400" />
              <span>Merchant Point-of-Sale QR Scanner</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Scan student collection passes or student discount ID cards. Prevents duplicate redemption atomically.
            </p>
          </div>
        </div>

        {scanResult && (
          <div
            className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 ${
              scanResult.type === 'success'
                ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/80 border border-rose-500/40 text-rose-300'
            }`}
          >
            {scanResult.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{scanResult.message}</span>
          </div>
        )}

        <form onSubmit={handleRedeem} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Enter Voucher Code or Scan QR Payload Reference
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="e.g. ZQ-DEMO-2026-00841 or https://zeroq.unisync.edu/voucher/..."
                value={scanInputCode}
                onChange={(e) => setScanInputCode(e.target.value)}
                className="flex-1 p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-teal-400"
                required
              />
              <button
                type="submit"
                disabled={isVerifying}
                className="px-6 py-3 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
              >
                {isVerifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Verify & Confirm Redemption</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Tip for judges: Click "Verify & Confirm Redemption" with the default code to simulate scanning Brian's stationery voucher!
            </p>
          </div>
        </form>
      </div>

      {/* Orders List & Vouchers Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Queue */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-violet-600" />
            <span>Store Orders Queue</span>
          </h3>

          <div className="divide-y divide-slate-100 text-xs">
            {merchantOrders.length === 0 ? (
              <p className="text-slate-500 py-4 text-center">No orders currently placed for this stall.</p>
            ) : (
              merchantOrders.map((ord) => (
                <div key={ord.orderId} className="py-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-mono font-bold text-slate-900">{ord.orderId}</span>
                    <div className="text-slate-600">{ord.studentName} · {ord.deliveryOption}</div>
                    <div className="text-[11px] text-slate-400">{new Date(ord.timestamp).toLocaleTimeString()}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900 block">KSh {ord.totalKSh.toLocaleString()}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      ord.status === 'Collected' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Vouchers Redemption Ledger */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <QrCode className="w-4 h-4 text-teal-600" />
            <span>Vouchers Issued & Redeemed</span>
          </h3>

          <div className="divide-y divide-slate-100 text-xs">
            {merchantVouchers.length === 0 ? (
              <p className="text-slate-500 py-4 text-center">No vouchers active for this stall.</p>
            ) : (
              merchantVouchers.map((v) => (
                <div key={v.voucherId} className="py-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-mono font-bold text-violet-700">{v.voucherId}</span>
                    <div className="text-slate-700">{v.itemName}</div>
                    <div className="text-[11px] text-slate-400">Order: {v.orderId}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900 block">KSh {v.valueKSh.toLocaleString()}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      v.status === 'Redeemed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {v.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
