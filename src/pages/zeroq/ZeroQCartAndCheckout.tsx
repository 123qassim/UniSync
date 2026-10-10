import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldAlert,
  Smartphone,
  CreditCard,
  Ticket,
  CheckCircle2,
  Clock,
  QrCode
} from 'lucide-react';
import { ZeroQCartItem, ZeroQOrder, ZeroQCampusVoucher } from '../../types/zeroq';

interface ZeroQCartAndCheckoutProps {
  cart: ZeroQCartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOrderPlaced: (order: ZeroQOrder, voucher: ZeroQCampusVoucher) => void;
  onNavigateTab: (tab: string) => void;
}

export const ZeroQCartAndCheckout: React.FC<ZeroQCartAndCheckoutProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderPlaced,
  onNavigateTab,
}) => {
  const [deliveryOption, setDeliveryOption] = useState<'Campus Collection' | 'Hostel Delivery'>('Campus Collection');
  const [paymentMethod, setPaymentMethod] = useState<'Demo M-Pesa' | 'Demo Card' | 'Campus Voucher'>('Demo M-Pesa');
  const [mpesaPhone, setMpesaPhone] = useState('0712 345 678');
  const [isProcessing, setIsProcessing] = useState(false);
  const [stkPushStep, setStkPushStep] = useState<string | null>(null);
  const [placedReceipt, setPlacedReceipt] = useState<{ order: ZeroQOrder; voucher: ZeroQCampusVoucher } | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.product.priceKSh * item.quantity, 0);
  const deliveryFee = deliveryOption === 'Hostel Delivery' ? 100 : 0;
  const total = subtotal + deliveryFee;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || isProcessing) return;

    setIsProcessing(true);

    if (paymentMethod === 'Demo M-Pesa') {
      setStkPushStep('Sending simulated STK push prompt to ' + mpesaPhone + '...');
      await new Promise((r) => setTimeout(r, 1200));
      setStkPushStep('STK Prompt Approved: Enter M-Pesa PIN 1234 on simulated phone...');
      await new Promise((r) => setTimeout(r, 1200));
      setStkPushStep('M-Pesa transaction confirmed by Safaricom mock gateway!');
      await new Promise((r) => setTimeout(r, 800));
    } else {
      setStkPushStep('Simulating payment gateway authorization...');
      await new Promise((r) => setTimeout(r, 1500));
    }

    try {
      const response = await fetch('/api/zeroq/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((c) => ({
            productId: c.productId,
            merchantId: c.product.merchantId,
            quantity: c.quantity,
          })),
          paymentMethod,
          deliveryOption,
          mpesaPhone,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPlacedReceipt(data);
        onOrderPlaced(data.order, data.voucher);
        onClearCart();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
      setStkPushStep(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Campus Shopping Cart & Checkout
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review your items, select fulfillment, and test simulated payment.
        </p>
      </div>

      {/* Mandatory Demo Checkout Warning Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 text-amber-900 rounded-2xl p-4 text-xs font-bold flex items-center gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
        <span>DEMO CHECKOUT — NO REAL MONEY WILL BE CHARGED. ALL PAYMENTS ARE SIMULATED.</span>
      </div>

      {placedReceipt ? (
        /* Order Receipt Confirmation */
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900">Order Placed Successfully!</h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Receipt Reference: <strong className="font-mono text-slate-900">{placedReceipt.order.orderId}</strong>
            </p>
          </div>

          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl max-w-md mx-auto text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Merchant:</span>
              <span className="font-bold text-slate-900">{placedReceipt.order.merchantName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Paid (Simulated):</span>
              <span className="font-mono font-bold text-slate-900">KSh {placedReceipt.order.totalKSh.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Reference:</span>
              <span className="font-mono text-emerald-700 font-bold">{placedReceipt.order.paymentReference}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Generated Voucher ID:</span>
              <span className="font-mono text-violet-700 font-bold">{placedReceipt.voucher.voucherId}</span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigateTab('vouchers')}
              className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              <span>View Collection Voucher QR</span>
            </button>
            <button
              onClick={() => onNavigateTab('marketplace')}
              className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      ) : cart.length === 0 ? (
        /* Empty Cart State */
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Your campus cart is empty</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Discover student equipment, lab stationery, and cafeteria food vouchers in the marketplace.
          </p>
          <button
            onClick={() => onNavigateTab('marketplace')}
            className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Browse Products
          </button>
        </div>
      ) : (
        /* Populated Cart & Checkout Flow */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 shadow-xs overflow-hidden">
              {cart.map((item) => (
                <div key={item.productId} className="p-4 sm:p-5 flex items-center gap-4">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0"
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="font-bold text-slate-900 text-sm truncate">
                      {item.product.name}
                    </h3>
                    <div className="text-xs text-slate-500">
                      {item.product.merchantName}
                    </div>
                    <div className="font-mono font-bold text-slate-900 text-xs">
                      KSh {item.product.priceKSh.toLocaleString()} each
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                      className="p-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-xs font-bold w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                      className="p-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onRemoveItem(item.productId)}
                      className="p-1 text-slate-400 hover:text-rose-600 ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout & Payment Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5 text-xs">
              <h3 className="font-bold text-slate-900 text-sm">Order Summary</h3>

              {/* Delivery / Collection Option */}
              <div className="space-y-2">
                <span className="font-semibold text-slate-700 block">Fulfillment Method</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryOption('Campus Collection')}
                    className={`p-2.5 rounded-xl border font-semibold transition-all ${
                      deliveryOption === 'Campus Collection'
                        ? 'border-violet-600 bg-violet-50 text-violet-900'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Campus Pickup (Free)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryOption('Hostel Delivery')}
                    className={`p-2.5 rounded-xl border font-semibold transition-all ${
                      deliveryOption === 'Hostel Delivery'
                        ? 'border-violet-600 bg-violet-50 text-violet-900'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Hostel Delivery (+100)
                  </button>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="font-semibold text-slate-700 block">Simulated Payment Mode</span>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Demo M-Pesa'}
                      onChange={() => setPaymentMethod('Demo M-Pesa')}
                      className="text-emerald-600"
                    />
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-slate-900">Demo M-Pesa</span>
                  </label>

                  {paymentMethod === 'Demo M-Pesa' && (
                    <div className="pl-6 space-y-1">
                      <label className="text-[10px] text-slate-500 font-semibold uppercase">M-Pesa Number</label>
                      <input
                        type="tel"
                        value={mpesaPhone}
                        onChange={(e) => setMpesaPhone(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                      />
                    </div>
                  )}

                  <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Demo Card'}
                      onChange={() => setPaymentMethod('Demo Card')}
                      className="text-violet-600"
                    />
                    <CreditCard className="w-4 h-4 text-violet-600" />
                    <span className="font-bold text-slate-900">Demo Card Payment</span>
                  </label>
                </div>
              </div>

              {/* Price Calculation */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>KSh {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Fulfillment Fee:</span>
                  <span>KSh {deliveryFee}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Due:</span>
                  <span className="text-violet-700">KSh {total.toLocaleString()}</span>
                </div>
              </div>

              {stkPushStep && (
                <div className="p-3 bg-teal-50 border border-teal-200 text-teal-900 rounded-xl text-[11px] font-semibold animate-pulse">
                  {stkPushStep}
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full py-3 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{isProcessing ? 'Processing Payment...' : 'Complete Simulated Purchase'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
