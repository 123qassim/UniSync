import React, { useState } from 'react';
import {
  Ticket,
  QrCode,
  CheckCircle,
  Clock,
  Store,
  Calendar,
  X,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { ZeroQCampusVoucher } from '../../types/zeroq';
import { generateQRCodeDataUrl } from '../../utils/qrGenerator';

interface ZeroQVouchersProps {
  vouchers: ZeroQCampusVoucher[];
  onNavigateTab: (tab: string) => void;
}

export const ZeroQVouchers: React.FC<ZeroQVouchersProps> = ({
  vouchers,
  onNavigateTab,
}) => {
  const [selectedVoucher, setSelectedVoucher] = useState<ZeroQCampusVoucher | null>(null);
  const [activeQrUrl, setActiveQrUrl] = useState<string>('');

  const openVoucherModal = async (v: ZeroQCampusVoucher) => {
    setSelectedVoucher(v);
    const dataUrl = await generateQRCodeDataUrl(v.qrCodeData, { width: 260, margin: 1 });
    setActiveQrUrl(dataUrl);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded uppercase tracking-wider border border-amber-800">
              Collection Passes
            </span>
            <span className="text-xs text-slate-500 font-medium">Digital Redemptions</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            My Campus Vouchers
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Digital QR vouchers issued upon order payment. Present to the partner merchant stall for instant collection.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('marketplace')}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          Browse Marketplace Offers
        </button>
      </div>

      {/* Vouchers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vouchers.map((v) => {
          const isActive = v.status === 'Active';

          return (
            <div
              key={v.voucherId}
              className={`rounded-3xl border p-6 shadow-xs transition-all space-y-4 flex flex-col justify-between ${
                isActive
                  ? 'bg-white border-slate-200 hover:border-slate-300'
                  : 'bg-slate-50 border-slate-200 opacity-75'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded">
                    {v.voucherId}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {v.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{v.itemName}</h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                    <Store className="w-3.5 h-3.5 text-violet-600" />
                    <span>{v.merchantName}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Voucher Value:</span>
                  <span className="font-mono font-extrabold text-slate-900 text-sm">
                    KSh {v.valueKSh.toLocaleString()}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 space-y-0.5">
                  <div>Issued: {v.issueDate} · Expires: {v.expiryDate}</div>
                  {v.redeemedAt && (
                    <div className="text-emerald-700 font-semibold">
                      Redeemed on {new Date(v.redeemedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">Ref: {v.orderId}</span>
                <button
                  type="button"
                  onClick={() => openVoucherModal(v)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>{isActive ? 'Show QR Code' : 'View Pass Receipt'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Single Voucher Display with Scannable QR Code */}
      {selectedVoucher && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 text-center">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-violet-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  ZeroQ Campus Voucher
                </h3>
              </div>
              <button
                onClick={() => setSelectedVoucher(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded">
                {selectedVoucher.voucherId}
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-1">
                {selectedVoucher.itemName}
              </h2>
              <p className="text-xs text-slate-500">
                Redeemable at <strong className="text-slate-800">{selectedVoucher.merchantName}</strong>
              </p>
            </div>

            {/* QR Code */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl inline-block">
              {activeQrUrl ? (
                <img
                  src={activeQrUrl}
                  alt="Voucher QR Code"
                  className="w-48 h-48 object-contain mx-auto rounded-lg"
                />
              ) : (
                <div className="w-48 h-48 bg-slate-200 flex items-center justify-center text-xs text-slate-500">
                  Rendering QR...
                </div>
              )}
            </div>

            <div className="text-xs space-y-1 font-mono">
              <div className="font-bold text-slate-900 text-base">
                Value: KSh {selectedVoucher.valueKSh.toLocaleString()}
              </div>
              <div className="text-slate-500 text-[11px]">
                Status: <strong className="uppercase">{selectedVoucher.status}</strong> · Expiry: {selectedVoucher.expiryDate}
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 font-semibold">
              DEMONSTRATION VOUCHER — NO CASH VALUE
            </div>

            <button
              onClick={() => setSelectedVoucher(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
