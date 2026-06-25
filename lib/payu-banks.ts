// PayU India netbanking bank codes.
// Map of PayU netbanking `bankcode` -> human-readable bank name.
// Only Netbanking + Debit Cards are enabled on MID 13683759 today.
// To add more banks later, just append entries here.

export interface PayuBank {
  /** PayU netbanking code, sent as `bankcode` in the collect/initiate request. */
  code: string;
  /** Display name shown in the dropdown. */
  name: string;
}

export const PAYU_NETBANKING_BANKS: PayuBank[] = [
  { code: "HDFCB", name: "HDFC Bank" },
  { code: "ICIB", name: "ICICI Bank" },
  { code: "SBIB", name: "State Bank of India" },
  { code: "AXIB", name: "Axis Bank" },
  { code: "162B", name: "Kotak Mahindra Bank" },
  { code: "AUSFNB", name: "AU Small Finance Bank" },
  { code: "YESB", name: "Yes Bank" },
  { code: "IDFCNB", name: "IDFC FIRST Bank" },
  { code: "RBLNB", name: "RBL Bank" },
  { code: "PNBB", name: "Punjab National Bank" },
  { code: "BARBR", name: "Bank of Baroda" },
  { code: "CABB", name: "Canara Bank" },
  { code: "UBIB", name: "Union Bank of India" },
  { code: "INDB", name: "IndusInd Bank" },
  { code: "FDRLNB", name: "Federal Bank" },
  { code: "IDIB", name: "Indian Bank" },
  { code: "CBIB", name: "Central Bank of India" },
  { code: "BOIB", name: "Bank of India" },
  { code: "IOBNB", name: "Indian Overseas Bank" },
  { code: "CSBNB", name: "CSB Bank" },
  { code: "SIBNB", name: "South Indian Bank" },
  { code: "KVBB", name: "Karur Vysya Bank" },
  { code: "DLSB", name: "Dhanlaxmi Bank" },
  { code: "JAKB", name: "J&K Bank" },
  { code: "SVCB", name: "SVC Co-operative Bank" },
  { code: "BBKM", name: "Bank of Maharashtra" },
];

/** Lookup a bank display name by its PayU code. */
export const getPayuBankName = (code: string): string =>
  PAYU_NETBANKING_BANKS.find((b) => b.code === code)?.name ?? code;
