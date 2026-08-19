/**
 * Converts a numeric amount to Indian Rupee Words representation.
 * Example: 14750 -> "Fourteen Thousand Seven Hundred Fifty Rupees Only"
 */
export function numberToWords(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Zero Rupees Only';
  }

  const numeric = Math.round(Math.abs(Number(amount)));
  if (numeric === 0) return 'Zero Rupees Only';

  const units = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertChunk(n) {
    if (n < 20) return units[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + units[n % 10] : '');
    if (n < 1000) return units[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertChunk(n % 100) : '');
    if (n < 100000) return convertChunk(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + convertChunk(n % 1000) : '');
    if (n < 10000000) return convertChunk(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + convertChunk(n % 100000) : '');
    return convertChunk(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + convertChunk(n % 10000000) : '');
  }

  const result = convertChunk(numeric);
  return result ? `${result} Rupees Only` : 'Zero Rupees Only';
}
