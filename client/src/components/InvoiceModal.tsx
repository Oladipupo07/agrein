import React from 'react';
import { X, Printer, ShieldCheck, Download, CheckCircle, FileText, MapPin, Calendar, Package } from 'lucide-react';

interface InvoiceModalProps {
  order: any;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const subtotal = Number(order.total_amount || 0);
  const platformFee = subtotal * 0.05;
  const farmerPayout = subtotal * 0.95;
  const usdExchangeRate = 1450; // NGN per USD
  const totalInUSD = (subtotal / usdExchangeRate).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 print:my-0 print:shadow-none print:w-full print:max-w-none">
        
        {/* Modal Controls (Hidden when printing) */}
        <div className="bg-emerald-900 text-white p-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">Agrein Official Escrow Receipt & Waybill</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 print:p-6 space-y-6">
          {/* Header & Branding */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-emerald-900">Agrein</span>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded border border-emerald-300">Marketplace</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Connecting Farmers to Buyers, One Harvest at a Time.</p>
              <p className="text-xs text-slate-500">Agrein Marketplace Ltd. • Abuja, Nigeria</p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200 text-xs font-bold mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Interswitch Escrow Verified</span>
              </div>
              <div className="text-xs font-mono text-slate-600">Ref: <span className="font-bold text-slate-900">{order.payment_reference || 'AGR-' + order.id.slice(0, 8)}</span></div>
              <div className="text-xs text-slate-500">{new Date(order.created_at || Date.now()).toLocaleDateString()}</div>
            </div>
          </div>

          {/* Order Status & Roles Grid */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1">Buyer Details</span>
              <div className="font-bold text-slate-900 text-sm">{order.buyer_name || 'Agrein Registered Buyer'}</div>
              <div className="text-slate-600 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {order.delivery_address || 'Lagos, Nigeria'}
              </div>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1">Farmer & Origin</span>
              <div className="font-bold text-slate-900 text-sm">{order.farmer_name || 'Verified Cooperative Farmer'}</div>
              <div className="text-slate-600 flex items-center gap-1 mt-1">
                <Package className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {order.farmer_state || 'Kano State'}, Nigeria
              </div>
            </div>
          </div>

          {/* Order Items Table */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 mb-3">Itemized Produce Breakdown</h4>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-600 font-semibold uppercase text-[10px]">
                  <th className="p-3 rounded-l-lg">Produce Description</th>
                  <th className="p-3 text-center">Quantity</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3 text-right rounded-r-lg">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td className="p-3 font-semibold text-slate-800">{item.product_name}</td>
                      <td className="p-3 text-center text-slate-600">{item.quantity} {item.unit || 'units'}</td>
                      <td className="p-3 text-right text-slate-600">₦{Number(item.price_per_unit || 0).toLocaleString()}</td>
                      <td className="p-3 text-right font-bold text-slate-900">₦{(Number(item.quantity) * Number(item.price_per_unit)).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">{order.product_title || 'Fresh Harvest Produce Batch'}</td>
                    <td className="p-3 text-center text-slate-600">1 Bulk Shipment</td>
                    <td className="p-3 text-right text-slate-600">₦{subtotal.toLocaleString()}</td>
                    <td className="p-3 text-right font-bold text-slate-900">₦{subtotal.toLocaleString()}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation & Escrow Split */}
          <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs space-y-1 max-w-xs">
              <div className="font-bold text-emerald-900 flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Interswitch Multi-Split Escrow</span>
              </div>
              <div className="text-slate-600">Farmer Payout (95%): <span className="font-bold text-slate-800">₦{farmerPayout.toLocaleString()}</span></div>
              <div className="text-slate-600">Agrein Platform Commission (5%): <span className="font-bold text-slate-800">₦{platformFee.toLocaleString()}</span></div>
            </div>

            <div className="text-right space-y-1 w-full sm:w-auto">
              <div className="text-xs text-slate-500">Total Payable Amount</div>
              <div className="text-2xl font-extrabold text-emerald-900">₦{subtotal.toLocaleString()}</div>
              <div className="text-xs text-slate-400 font-mono">≈ ${totalInUSD} USD</div>
            </div>
          </div>

          {/* Verification Watermark Footer */}
          <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-[11px] text-slate-400">
            <div>This invoice is automatically generated upon Interswitch payment verification.</div>
            <div className="font-mono font-bold text-slate-600">Agrein Escrow Certified</div>
          </div>
        </div>
      </div>
    </div>
  );
};
