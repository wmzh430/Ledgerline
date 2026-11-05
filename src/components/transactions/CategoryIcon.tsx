import {
  Banknote,
  Briefcase,
  Building2,
  Landmark,
  Megaphone,
  Plane,
  Receipt,
  ArrowLeftRight,
  Laptop,
  CircleDollarSign,
} from "lucide-react";
import type { TransactionCategory } from "../../types";

const iconMap: Record<TransactionCategory, typeof Banknote> = {
  payroll: Banknote,
  revenue: CircleDollarSign,
  software: Laptop,
  contractors: Briefcase,
  office: Building2,
  travel: Plane,
  marketing: Megaphone,
  taxes: Landmark,
  transfer: ArrowLeftRight,
  fees: Receipt,
};

export function CategoryIcon({ category, size = 16 }: { category: TransactionCategory; size?: number }) {
  const Icon = iconMap[category];
  return <Icon size={size} />;
}
