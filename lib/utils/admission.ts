export function generateApplicationNumber(): string {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  
  return `KPB-${year}-${timestamp}${random}`;
}

export function generateOTPCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
