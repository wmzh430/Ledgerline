import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/Button";
import type { VirtualCard } from "../../types";

interface IssueCardModalProps {
  open: boolean;
  onClose: () => void;
  onIssue: (card: VirtualCard) => void;
}

export function IssueCardModal({ open, onClose, onIssue }: IssueCardModalProps) {
  const [label, setLabel] = useState("");
  const [holder, setHolder] = useState("");
  const [limit, setLimit] = useState("5000");
  const [network, setNetwork] = useState<VirtualCard["network"]>("visa");

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const last4 = Math.floor(1000 + Math.random() * 9000).toString();
    onIssue({
      id: `card_${Date.now()}`,
      label: label || "Untitled Card",
      holder: holder || "M. Ahmed",
      number: `4242 4242 4242 ${last4}`,
      last4,
      expiry: "12/29",
      network,
      status: "active",
      limit: Number(limit) || 0,
      spent: 0,
      accountId: "acc_checking",
    });
    setLabel("");
    setHolder("");
    setLimit("5000");
    setNetwork("visa");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Issue a new card</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-[var(--text-muted)] hover:bg-[var(--surface-sunken)]">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Card label</label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Design Tools"
              className="h-10 w-full rounded-lg border border-black/10 px-3 text-sm outline-none focus:border-[var(--brand)]"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Cardholder</label>
            <input
              value={holder}
              onChange={(e) => setHolder(e.target.value)}
              placeholder="e.g. J. Smith"
              className="h-10 w-full rounded-lg border border-black/10 px-3 text-sm outline-none focus:border-[var(--brand)]"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Monthly limit</label>
              <input
                type="number"
                min={0}
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="h-10 w-full rounded-lg border border-black/10 px-3 text-sm outline-none focus:border-[var(--brand)]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Network</label>
              <select
                value={network}
                onChange={(e) => setNetwork(e.target.value as VirtualCard["network"])}
                className="h-10 w-full rounded-lg border border-black/10 px-3 text-sm outline-none focus:border-[var(--brand)]"
              >
                <option value="visa">Visa</option>
                <option value="mastercard">Mastercard</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">Issue card</Button>
        </div>
      </form>
    </div>
  );
}
