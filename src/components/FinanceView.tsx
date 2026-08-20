import { useState, FormEvent } from 'react';
import { Transaction } from '../types';
import { Search, Plus, DollarSign, ArrowUpRight, ArrowDownRight, Trash2, X, ClipboardCheck, Sparkles } from 'lucide-react';

export interface FinanceInvoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: 'Paid' | 'Sent' | 'Overdue';
}

interface FinanceViewProps {
  transactions: Transaction[];
  invoices: FinanceInvoice[];
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  onDeleteTransaction: (id: string) => void;
  onAddInvoice: (invoice: { clientName: string; amount: number; dueDate: string; status: 'Sent' | 'Paid' }) => void;
  onUpdateInvoiceStatus: (id: string, status: 'Paid' | 'Sent' | 'Overdue') => void;
}

export function FinanceView({
  transactions,
  invoices,
  onAddTransaction,
  onDeleteTransaction,
  onAddInvoice,
  onUpdateInvoiceStatus
}: FinanceViewProps) {
  const [activeTab, setActiveTab] = useState<'ledger' | 'invoices'>('ledger');
  const [search, setSearch] = useState("");

  // Transaction modal States
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [txDesc, setTxDesc] = useState("");
  const [txAmount, setTxAmount] = useState<number>(0);
  const [txType, setTxType] = useState<'income' | 'expense'>('income');
  const [txCategory, setTxCategory] = useState("Subscription Fee");

  // Invoice modal States
  const [isInvModalOpen, setIsInvModalOpen] = useState(false);
  const [invClient, setInvClient] = useState("");
  const [invAmount, setInvAmount] = useState<number>(0);
  const [invDueDate, setInvDueDate] = useState("");

  // Account calculations
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const totalBalance = totalIncome - totalExpense;

  const filteredTx = transactions.filter(t => t.description.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()));
  const filteredInvs = invoices.filter(i => i.clientName.toLowerCase().includes(search.toLowerCase()));

  const handleAddTxSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!txDesc || txAmount <= 0) {
      alert("Please provide a description and a valid positive amount!");
      return;
    }

    onAddTransaction({
      description: txDesc,
      amount: txAmount,
      type: txType,
      category: txCategory,
      status: 'Completed'
    });

    // Reset and Close
    setTxDesc("");
    setTxAmount(0);
    setIsTxModalOpen(false);
  };

  const handleAddInvSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!invClient || invAmount <= 0 || !invDueDate) {
      alert("Please complete all invoice billing fields!");
      return;
    }

    onAddInvoice({
      clientName: invClient,
      amount: invAmount,
      dueDate: invDueDate,
      status: "Sent"
    });

    // Reset and Close
    setInvClient("");
    setInvAmount(0);
    setInvDueDate("");
    setIsInvModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">Finance Operations</h2>
          <p className="text-xs text-zinc-500 mt-1">Review operational ledgers, generate customer invoices, and track cash-flows.</p>
        </div>
        <div className="flex gap-2.5">
          <button 
            onClick={() => setIsTxModalOpen(true)}
            className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Ledger Entry
          </button>
          <button 
            onClick={() => setIsInvModalOpen(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Invoice Client
          </button>
        </div>
      </div>

      {/* Account Balance Banner Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Net Vault Balance */}
        <div className="bg-zinc-950 p-6 rounded-2xl text-white relative overflow-hidden border border-zinc-900 shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
          <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">Workspace Net Balance</p>
          <h3 className="text-3xl font-extrabold tracking-tight mt-2.5">KSh {totalBalance.toLocaleString()}</h3>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold mt-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Audited Vault Secured</span>
          </div>
        </div>

        {/* Total Inflow */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">Aggregated Receipts</p>
            <h3 className="text-2xl font-extrabold tracking-tight text-zinc-800 mt-2.5">KSh {totalIncome.toLocaleString()}</h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 mt-4">
            <div className="p-1 bg-emerald-50 rounded text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
            <span>Revenue streams thriving</span>
          </div>
        </div>

        {/* Total Outflow */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">Operational Burnout</p>
            <h3 className="text-2xl font-extrabold tracking-tight text-zinc-800 mt-2.5">KSh {totalExpense.toLocaleString()}</h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 mt-4">
            <div className="p-1 bg-rose-50 rounded text-rose-600">
              <ArrowDownRight className="w-3.5 h-3.5" />
            </div>
            <span>Costs and bills optimized</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-zinc-100 flex gap-5 text-sm font-bold text-zinc-400 select-none">
        <button 
          onClick={() => { setActiveTab('ledger'); setSearch(""); }}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === 'ledger' ? 'border-indigo-600 text-indigo-600 font-extrabold' : 'border-transparent hover:text-zinc-600'
          }`}
        >
          General Ledger ({transactions.length})
        </button>
        <button 
          onClick={() => { setActiveTab('invoices'); setSearch(""); }}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === 'invoices' ? 'border-indigo-600 text-indigo-600 font-extrabold' : 'border-transparent hover:text-zinc-600'
          }`}
        >
          Invoices & Billing ({invoices.length})
        </button>
      </div>

      {/* Tab Contents: Ledger list */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-zinc-100 shadow-sm">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search transactions by item description, subscription fees..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all text-zinc-800"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/50 text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider">
                    <th className="px-6 py-4">Transaction Details</th>
                    <th className="px-6 py-4">Accounting Category</th>
                    <th className="px-6 py-4">Posting Date</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4 text-right">Amount (KSh)</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-xs font-medium text-zinc-700">
                  {filteredTx.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-zinc-400 font-semibold">
                        No transactions registered in this period.
                      </td>
                    </tr>
                  ) : (
                    filteredTx.map((tx) => (
                      <tr key={tx.id} className="hover:bg-zinc-50/30 transition-colors">
                        <td className="px-6 py-4 font-bold text-zinc-800">
                          {tx.description}
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-zinc-100 text-zinc-600 px-2.5 py-1 rounded-full text-[10px] font-bold">
                            {tx.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-zinc-400">
                          {tx.date}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className={`px-6 py-4 text-right font-mono font-bold text-sm ${
                          tx.type === 'income' ? 'text-emerald-600' : 'text-zinc-800'
                        }`}>
                          {tx.type === 'income' ? '+' : '-'}KSh {tx.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => {
                              if (confirm(`Remove transaction "${tx.description}"?`)) {
                                onDeleteTransaction(tx.id);
                              }
                            }}
                            className="p-1 hover:bg-rose-50 text-zinc-300 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                            title="Delete Transaction"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab Contents: Invoices List */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-zinc-100 shadow-sm">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search invoices by client name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all text-zinc-800"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/50 text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider">
                    <th className="px-6 py-4">Invoice ID</th>
                    <th className="px-6 py-4">Customer Client</th>
                    <th className="px-6 py-4">Issue Date</th>
                    <th className="px-6 py-4">Payment Due Date</th>
                    <th className="px-6 py-4">Invoice Amount (KSh)</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Mark Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-xs font-medium text-zinc-700">
                  {filteredInvs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-zinc-400 font-semibold">
                        No invoices generated.
                      </td>
                    </tr>
                  ) : (
                    filteredInvs.map((inv) => (
                      <tr key={inv.id} className="hover:bg-zinc-50/30 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-zinc-800">
                          {inv.invoiceNumber}
                        </td>
                        <td className="px-6 py-4 font-bold text-zinc-800">
                          {inv.clientName}
                        </td>
                        <td className="px-6 py-4 font-mono text-zinc-400">
                          {inv.issueDate}
                        </td>
                        <td className="px-6 py-4 font-mono text-zinc-400">
                          {inv.dueDate}
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-sm text-zinc-800">
                          KSh {inv.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                            inv.status === 'Paid' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                              : inv.status === 'Sent'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
                              : 'bg-rose-50 text-rose-700 border-rose-100'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button 
                              onClick={() => onUpdateInvoiceStatus(inv.id, 'Paid')}
                              className="px-2 py-1 bg-emerald-50 border border-emerald-100 hover:bg-emerald-600 hover:text-white rounded-lg text-[9px] font-extrabold text-emerald-700 cursor-pointer transition-all"
                            >
                              Paid
                            </button>
                            <button 
                              onClick={() => onUpdateInvoiceStatus(inv.id, 'Sent')}
                              className="px-2 py-1 bg-indigo-50 border border-indigo-100 hover:bg-indigo-600 hover:text-white rounded-lg text-[9px] font-extrabold text-indigo-700 cursor-pointer transition-all"
                            >
                              Sent
                            </button>
                            <button 
                              onClick={() => onUpdateInvoiceStatus(inv.id, 'Overdue')}
                              className="px-2 py-1 bg-rose-50 border border-rose-100 hover:bg-rose-600 hover:text-white rounded-lg text-[9px] font-extrabold text-rose-700 cursor-pointer transition-all"
                            >
                              Late
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Ledger Modal */}
      {isTxModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-zinc-100 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-5 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
              <h3 className="font-extrabold text-zinc-800 text-sm">Post New Ledger Entry</h3>
              <button 
                onClick={() => setIsTxModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTxSubmit} className="p-5 space-y-4 text-xs font-semibold text-zinc-600">
              <div className="space-y-1.5">
                <label className="block text-zinc-500">Transaction Item Description</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Fiber Internet Subscription, Stripe Fee..."
                  value={txDesc}
                  onChange={(e) => setTxDesc(e.target.value)}
                  className="w-full p-2.5 border border-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none font-medium text-zinc-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-zinc-500">Amount (KSh)</label>
                  <input 
                    type="number"
                    required
                    value={txAmount}
                    onChange={(e) => setTxAmount(parseFloat(e.target.value))}
                    className="w-full p-2.5 border border-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none font-medium text-zinc-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-zinc-500">Flow Direction</label>
                  <select 
                    value={txType}
                    onChange={(e) => setTxType(e.target.value as any)}
                    className="w-full p-2.5 border border-zinc-200 bg-white rounded-xl outline-none font-bold text-zinc-800"
                  >
                    <option value="income">Income (+)</option>
                    <option value="expense">Expense (-)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-zinc-500">Posting Category</label>
                <select 
                  value={txCategory}
                  onChange={(e) => setTxCategory(e.target.value)}
                  className="w-full p-2.5 border border-zinc-200 bg-white rounded-xl outline-none font-bold text-zinc-800"
                >
                  <option value="Subscription Fee">Subscription Fee</option>
                  <option value="Room Booking">Room Booking</option>
                  <option value="Operational Hardware">Operational Hardware</option>
                  <option value="Office Utilities">Office Utilities</option>
                  <option value="Startup Funding Grant">Startup Funding Grant</option>
                  <option value="Marketing Ad Spend">Marketing Ad Spend</option>
                </select>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex justify-end gap-2.5">
                <button 
                  type="button"
                  onClick={() => setIsTxModalOpen(false)}
                  className="px-4 py-2.5 border border-zinc-200 hover:bg-zinc-50 rounded-xl text-zinc-600 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold cursor-pointer shadow-lg shadow-indigo-600/15"
                >
                  Register Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {isInvModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-zinc-100 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-5 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
              <h3 className="font-extrabold text-zinc-800 text-sm">Generate Customer Invoice</h3>
              <button 
                onClick={() => setIsInvModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddInvSubmit} className="p-5 space-y-4 text-xs font-semibold text-zinc-600">
              <div className="space-y-1.5">
                <label className="block text-zinc-500">Customer Name / Client</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Sophia Martinez, Safaricom PLC..."
                  value={invClient}
                  onChange={(e) => setInvClient(e.target.value)}
                  className="w-full p-2.5 border border-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none font-medium text-zinc-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-zinc-500">Billing Amount (KSh)</label>
                  <input 
                    type="number"
                    required
                    value={invAmount}
                    onChange={(e) => setInvAmount(parseFloat(e.target.value))}
                    className="w-full p-2.5 border border-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none font-medium text-zinc-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-zinc-500">Payment Deadline Target</label>
                  <input 
                    type="date"
                    required
                    value={invDueDate}
                    onChange={(e) => setInvDueDate(e.target.value)}
                    className="w-full p-2.5 border border-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none font-medium text-zinc-800"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex justify-end gap-2.5">
                <button 
                  type="button"
                  onClick={() => setIsInvModalOpen(false)}
                  className="px-4 py-2.5 border border-zinc-200 hover:bg-zinc-50 rounded-xl text-zinc-600 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold cursor-pointer shadow-lg shadow-indigo-600/15"
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
