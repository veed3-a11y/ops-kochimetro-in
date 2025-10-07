/**
 * Formats a number as Indian Rupees currency
 * @param amount - The amount to format
 * @param options - Optional formatting options
 * @returns Formatted currency string
 */
export function formatINR(
  amount: number,
  options?: {
    showSymbol?: boolean;
    decimals?: number;
  }
): string {
  const { showSymbol = true, decimals = 0 } = options || {};
  
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);

  // If symbol should not be shown, remove the ₹ symbol
  if (!showSymbol) {
    return formatted.replace(/₹\s?/, "");
  }

  return formatted;
}

/**
 * Formats a number with Indian numbering system (lakhs, crores)
 * @param num - The number to format
 * @returns Formatted string with K, L, Cr suffixes
 */
export function formatIndianNumber(num: number): string {
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  }
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)} L`;
  }
  if (num >= 1000) {
    return `₹${(num / 1000).toFixed(2)} K`;
  }
  return `₹${num.toFixed(0)}`;
}
