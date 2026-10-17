"use client";

import * as React from "react";
import Link from "next/link";
import {
  Wallet,
  DollarSign,
  TrendingUp,
  Download,
  CheckCircle2,
  Clock,
  Building,
  CreditCard,
  FileText,
  ArrowUpRight,
  ExternalLink,
  X,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/utils";
import { toast } from "sonner";

const formatINR = (val) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);

const PAYOUT_HISTORY = [
  {
    id: "PAY-2026-1001",
    date: "Oct 01, 2026",
    amount: 142000,
    method: "HDFC Bank (•••• 9812)",
    status: "completed",
    period: "Sep 01 - Sep 30, 2026",
  },
  {
    id: "PAY-2026-0901",
    date: "Sep 01, 2026",
    amount: 128500,
    method: "HDFC Bank (•••• 9812)",
    status: "completed",
    period: "Aug 01 - Aug 31, 2026",
  },
  {
    id: "PAY-2026-0801",
    date: "Aug 01, 2026",
    amount: 115000,
    method: "HDFC Bank (•••• 9812)",
    status: "completed",
    period: "Jul 01 - Jul 31, 2026",
  },
  {
    id: "PAY-2026-0701",
    date: "Jul 01, 2026",
    amount: 98000,
    method: "HDFC Bank (•••• 9812)",
    status: "completed",
    period: "Jun 01 - Jun 30, 2026",
  },
];

export default function InstructorPayoutsPage() {
  const [history] = React.useState(PAYOUT_HISTORY);
  const [earlyPayoutOpen, setEarlyPayoutOpen] = React.useState(false);

  const pendingBalance = 64500;

  const handleRequestEarlyPayout = (e) => {
    e.preventDefault();
    toast.success(`Early withdrawal of ${formatINR(pendingBalance)} initiated to HDFC Bank!`);
    setEarlyPayoutOpen(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-2">
            <Wallet className="w-3.5 h-3.5" />
            <span>Financials & Earnings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Payouts & Instructor Earnings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor course royalties, automated monthly bank disbursements, and tax documentation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setEarlyPayoutOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2"
          >
            <DollarSign className="w-4 h-4" />
            <span>Withdraw Pending Balance</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Pending Balance</span>
          <p className="text-2xl font-black text-amber-600 mt-2">{formatINR(pendingBalance)}</p>
          <p className="text-[11px] text-amber-700 font-medium mt-1">Disburses on Nov 01, 2026</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Last Payout</span>
          <p className="text-2xl font-black text-emerald-600 mt-2">{formatINR(142000)}</p>
          <p className="text-[11px] text-slate-500 mt-1">Transferred on Oct 01, 2026</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Lifetime Earnings</span>
          <p className="text-2xl font-black text-slate-900 mt-2">{formatINR(1487000)}</p>
          <p className="text-[11px] text-blue-600 font-medium mt-1">85% Revenue share split</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Payout Status</span>
          <p className="text-2xl font-black text-blue-600 mt-2">Active &amp; OK</p>
          <p className="text-[11px] text-emerald-600 font-bold mt-1">KYC Verified</p>
        </div>
      </div>

      {/* Payout Method Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Primary Account: HDFC Bank Ltd.
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Verified Direct Deposit
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Account: •••••••• 9812 • IFSC: HDFC0001248 • Automated payout on 1st of every month
            </p>
          </div>
        </div>

        <button
          onClick={() => toast.info("Opening secure banking credential manager...")}
          className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shrink-0"
        >
          Manage Payout Account
        </button>
      </div>

      {/* Payout History Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-2xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Disbursement Statements</h3>
            <p className="text-xs text-slate-500">Historical remittance records and tax receipts.</p>
          </div>
          <span className="text-xs font-bold text-blue-600">{history.length} Statements</span>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Statement Reference</th>
                <th className="py-3.5 px-4">Billing Period</th>
                <th className="py-3.5 px-4">Payout Method</th>
                <th className="py-3.5 px-4">Disbursed Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-slate-800">{item.id}</span>
                    <span className="text-[10px] text-slate-400 block">{item.date}</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{item.period}</td>
                  <td className="py-3.5 px-4 text-slate-600">{item.method}</td>
                  <td className="py-3.5 px-4 font-black text-slate-900 text-sm">
                    {formatINR(item.amount)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Completed</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => toast.success(`Downloading tax slip for ${item.id}`)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 inline-flex transition-colors"
                      title="Download PDF statement"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Early Payout Modal */}
      {earlyPayoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-base font-bold text-slate-900">Request Early Payout</h3>
              <button
                onClick={() => setEarlyPayoutOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestEarlyPayout} className="p-6 space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-amber-700">Available Balance</span>
                <p className="text-2xl font-black text-amber-900">{formatINR(pendingBalance)}</p>
                <p className="text-[11px] text-amber-800">
                  Early withdrawals arrive within 2–4 hours via IMPS instant transfer.
                </p>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Receiving Bank Account</label>
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800">
                  HDFC Bank (•••• 9812)
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEarlyPayoutOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-sm"
                >
                  Confirm Withdrawal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
