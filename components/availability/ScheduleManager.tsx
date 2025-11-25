"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import availabilityService from "@/services/availability";

interface Schedule {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function ScheduleManager() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    dayOfWeek: 1,
    startTime: "09:00",
    endTime: "17:00",
  });

  // Slots generation state
  const [genLoading, setGenLoading] = useState(false);
  const [genData, setGenData] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    slotDuration: 30,
  });

  useEffect(() => {
    loadSchedules();
  }, []);

  async function loadSchedules() {
    setLoading(true);
    setError(null);
    try {
      const res = await availabilityService.getSchedule();
      const data = res?.result ?? res?.data ?? res;
      setSchedules(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || "Failed to load schedules");
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateOrUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (editingId) {
        await availabilityService.updateSchedule(editingId, formData);
        setEditingId(null);
      } else {
        await availabilityService.createSchedule(formData);
      }
      setFormData({ dayOfWeek: 1, startTime: "09:00", endTime: "17:00" });
      await loadSchedules();
    } catch (err: any) {
      setError(err?.message || "Failed to save schedule");
    }
  }

  async function handleDelete(scheduleId: string) {
    if (!confirm("Delete this schedule?")) return;
    setError(null);
    try {
      await availabilityService.deleteSchedule(scheduleId);
      await loadSchedules();
    } catch (err: any) {
      setError(err?.message || "Failed to delete schedule");
    }
  }

  async function handleGenerateSlots(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setGenLoading(true);
    try {
      await availabilityService.generateSlots(genData);
      alert("Slots generated successfully!");
      setGenData({
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        slotDuration: 30,
      });
    } catch (err: any) {
      setError(err?.message || "Failed to generate slots");
    } finally {
      setGenLoading(false);
    }
  }

  function handleEdit(schedule: Schedule) {
    setEditingId(schedule.id);
    setFormData({
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
    });
  }

  function handleCancel() {
    setEditingId(null);
    setFormData({ dayOfWeek: 1, startTime: "09:00", endTime: "17:00" });
  }

  return (
    <div className="space-y-6">
      {error && <div className="text-sm text-rose-600 bg-rose-50 p-3 rounded-lg">{error}</div>}

      {/* Weekly Schedules */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="text-sm text-slate-600">Loading schedules...</div>
          ) : schedules.length ? (
            <div className="space-y-2">
              {schedules.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">{DAYS[s.dayOfWeek]}</div>
                    <div className="text-sm text-slate-600">
                      {s.startTime} – {s.endTime}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge label={s.isActive ? "Active" : "Inactive"} color={s.isActive ? "green" : "gray"} />
                    <button
                      onClick={() => handleEdit(s)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-slate-600">No schedules yet. Create one below.</div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Schedule Form */}
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Schedule" : "Add Schedule"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateOrUpdate} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Day</label>
              <Select
                value={String(formData.dayOfWeek)}
                onChange={(e) => setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })}
              >
                {DAYS.map((day, i) => (
                  <option key={i} value={i}>
                    {day}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Start Time</label>
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">End Time</label>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">{editingId ? "Update" : "Create"} Schedule</Button>
              {editingId && <Button type="button" variant="secondary" onClick={handleCancel}>Cancel</Button>}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Generate Slots */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Slots</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerateSlots} className="space-y-4">
            <p className="text-sm text-slate-600">Generate appointment slots based on your weekly schedule.</p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Start Date</label>
                <Input
                  type="date"
                  value={genData.startDate}
                  onChange={(e) => setGenData({ ...genData, startDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">End Date</label>
                <Input
                  type="date"
                  value={genData.endDate}
                  onChange={(e) => setGenData({ ...genData, endDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Slot Duration (min)</label>
                <Input
                  type="number"
                  min="15"
                  step="15"
                  value={genData.slotDuration}
                  onChange={(e) => setGenData({ ...genData, slotDuration: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={genLoading}>
              {genLoading ? "Generating..." : "Generate Slots"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
