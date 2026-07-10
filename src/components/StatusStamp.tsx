interface StatusStampProps {
  stockCount: number;
  isInStock: boolean;
  isLow: boolean;
}

export default function StatusStamp({ stockCount, isInStock, isLow }: StatusStampProps) {
  if (!isInStock) return <span className="stamp stamp-out">OUT</span>;
  if (isLow) return <span className="stamp stamp-low">LOW · {stockCount}</span>;
  return <span className="stamp stamp-in">IN STOCK</span>;
}
