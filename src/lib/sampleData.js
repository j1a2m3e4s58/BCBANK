// Sample data for demo - replace with real API/Firebase calls in production

export const sampleTransactions = [
  { id: 1, name: "MTN Mobile Money", category: "airtime", type: "debit", amount: "150.00", date: "Apr 17", time: "2:30 PM", status: "completed", details: { provider: "MTN", recipient: "+233 241234567" } },
  { id: 2, name: "Salary Deposit", category: "receive", type: "credit", amount: "4,500.00", date: "Apr 16", time: "9:00 AM", status: "completed", details: { source: "Payroll" } },
  { id: 3, name: "ECG Electricity", category: "electricity", type: "debit", amount: "320.00", date: "Apr 15", time: "11:45 AM", status: "completed", details: { provider: "ECG", accountId: "MTR-441928" } },
  { id: 4, name: "Melcom Shopping", category: "shopping", type: "debit", amount: "890.50", date: "Apr 14", time: "3:20 PM", status: "completed", details: { merchant: "Melcom" } },
  { id: 5, name: "Telecel Internet", category: "internet", type: "debit", amount: "99.00", date: "Apr 13", time: "8:15 AM", status: "completed", details: { provider: "Telecel", accountId: "0241002003" } },
  { id: 6, name: "Transfer from Kofi", category: "receive", type: "credit", amount: "1,200.00", date: "Apr 12", time: "4:50 PM", status: "completed", details: { recipient: "Kwame Asante", source: "Kofi Boateng" } },
  { id: 7, name: "KFC Order", category: "food", type: "debit", amount: "75.00", date: "Apr 11", time: "12:30 PM", status: "completed", details: { merchant: "KFC" } },
  { id: 8, name: "Bank Fee", category: "bank", type: "debit", amount: "5.00", date: "Apr 10", time: "12:00 AM", status: "completed", details: { fee: "5.00" } },
  { id: 9, name: "Transfer to Ama", category: "transfer", type: "debit", amount: "500.00", date: "Apr 9", time: "6:20 PM", status: "completed", details: { recipient: "Ama Mensah", bank: "GCB Bank", account: "****5621" } },
  { id: 10, name: "Interest Credit", category: "bank", type: "credit", amount: "45.20", date: "Apr 8", time: "12:00 AM", status: "completed", details: { source: "Savings Interest" } },
];

export const sampleCards = [
  { id: 1, type: "Visa Debit", number: "4821  ****  ****  7634", holder: "Kwame Asante", expiry: "09/27", balance: "GH₵ 24,850.00" },
  { id: 2, type: "Mastercard", number: "5412  ****  ****  3891", holder: "Kwame Asante", expiry: "03/28", balance: "GH₵ 8,420.00" },
];

export const sampleBeneficiaries = [
  { id: 1, name: "Ama Mensah", bank: "GCB Bank", account: "****5621", avatar: "AM" },
  { id: 2, name: "Kofi Boateng", bank: "Ecobank", account: "****8934", avatar: "KB" },
  { id: 3, name: "Yaa Asantewaa", bank: "Fidelity Bank", account: "****2147", avatar: "YA" },
  { id: 4, name: "Nana Adjei", bank: "Bawjiase CB", account: "****6780", avatar: "NA" },
  { id: 5, name: "Efua Darkoa", bank: "Stanbic Bank", account: "****3456", avatar: "ED" },
];

export const sampleBillers = [
  { id: 1, label: "Home ECG Meter", provider: "ECG", category: "Electricity", accountId: "MTR-441928", favorite: true },
  { id: 2, label: "Office Telecel Fiber", provider: "Telecel", category: "Internet", accountId: "0241002003", favorite: true },
  { id: 3, label: "My MTN Airtime", provider: "MTN", category: "Airtime", accountId: "0245678901", favorite: false },
  { id: 4, label: "DSTV Decoder", provider: "DSTV", category: "TV/Cable", accountId: "DSTV-33129", favorite: false },
];

export const sampleDisputes = [
  {
    id: 1,
    reference: "BCB88991234",
    title: "Transfer delayed to beneficiary",
    channel: "Transfer",
    status: "Open",
    createdAt: "Apr 16, 9:15 AM",
    summary: "Recipient has not confirmed receipt after successful debit.",
  },
];

export const sampleNotifications = [
  { id: 1, title: "Transfer Successful", message: "GH₵ 500.00 sent to Ama Mensah", time: "2 min ago", read: false },
  { id: 2, title: "Bill Payment", message: "ECG electricity bill paid successfully", time: "1 hr ago", read: false },
  { id: 3, title: "Salary Received", message: "GH₵ 4,500.00 deposited to your account", time: "Yesterday", read: true },
  { id: 4, title: "Card Alert", message: "Your Visa card was used at Melcom", time: "2 days ago", read: true },
];

export const userProfile = {
  name: "Kwame Asante",
  email: "kwame.asante@email.com",
  phone: "+233 24 567 8901",
  accountNumber: "0012345678",
  branch: "Bawjiase Main Branch",
  memberSince: "March 2019",
};
