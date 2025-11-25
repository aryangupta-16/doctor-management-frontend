"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import availabilityService from "@/services/availability";

interface Slot {
  id: string;
  date: string;
  time: string;
  status: "AVAILABLE" | "BOOKED" | "BLOCKED";
}

export default function SlotManager() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [blockingSlots, setBlockingSlots] = useState<Set<string>>(new Set());
  const [blockReason, setBlockReason] = useState("");
  const [blockLoading, setBlockLoading] = useState(false);

  useEffect(() => {
    loadSlots();
  }, [filterDate]);

  async function loadSlots() {
    setLoading(true);
    setError(null);
    try {
      const res = await availabilityService.getSlots({ date: filterDate });
      // API can respond with { count, slots: [...] } or { result: { slots } } or raw array
      const maybe = res?.result ?? res?.data ?? res;
      const arr = maybe?.slots ?? maybe?.result ?? maybe?.data ?? maybe;
      setSlots(Array.isArray(arr) ? arr : []);
    } catch (err: any) {
      setError(err?.message || "Failed to load slots");
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }

  function toggleSlotSelection(slotId: string) {
    const newSet = new Set(blockingSlots);
    if (newSet.has(slotId)) {
      newSet.delete(slotId);
    } else {
      newSet.add(slotId);
    }
    setBlockingSlots(newSet);
  }

  async function handleBlockSlots(e: React.FormEvent) {
    e.preventDefault();
    if (!blockingSlots.size) {
      setError("Select at least one slot to block.");
      return;
    }
    setError(null);
    setBlockLoading(true);
    try {
      await availabilityService.blockSlots({
        slotIds: Array.from(blockingSlots),
        reason: blockReason || undefined,
      });
      setBlockingSlots(new Set());
      setBlockReason("");
      await loadSlots();
      alert("Slots blocked successfully!");
    } catch (err: any) {
      setError(err?.message || "Failed to block slots");
    } finally {
      setBlockLoading(false);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "green";
      case "BOOKED":
        return "blue";
      case "BLOCKED":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <div className="space-y-6">
      {error && <div className="text-sm text-rose-600 bg-rose-50 p-3 rounded-lg">{error}</div>}

      {/* Filter by Date */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Slots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-slate-700">Date</label>
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
            <Button type="button" variant="secondary" onClick={loadSlots}>
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Slots List */}
      <Card>
        <CardHeader>
          <CardTitle>Slots for {filterDate}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <div className="text-sm text-slate-600">Loading slots...</div>
          ) : slots.length ? (
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className={`rounded-lg border p-3 cursor-pointer transition-all ${
                    blockingSlots.has(slot.id)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => slot.status === "AVAILABLE" && toggleSlotSelection(slot.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-slate-900">{slot.time}</div>
                    <Badge label={slot.status} color={getStatusColor(slot.status)} />
                  </div>
                  {blockingSlots.has(slot.id) && (
                    <div className="mt-1 text-xs text-blue-600">Selected for blocking</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-slate-600">No slots for this date.</div>
          )}
        </CardContent>
      </Card>

      {/* Block Slots Form */}
      {blockingSlots.size > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle>Block {blockingSlots.size} Slot(s)</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBlockSlots} className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Reason (optional)</label>
                <Textarea
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="E.g., Personal emergency, maintenance..."
                  rows={2}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={blockLoading}>
                  {blockLoading ? "Blocking..." : "Block Selected Slots"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setBlockingSlots(new Set())}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
