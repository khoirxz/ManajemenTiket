// src/pages/tickets/Detail.tsx
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { echo } from "../../realtime/echo";
import { api } from "../../api/client";
import { useParams } from "react-router";
import { useState, useEffect } from "react";

export default function TicketDetailPage() {
  const { id } = useParams();
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["ticket", id],
    queryFn: async () => (await api.get(`/tickets/${id}`)).data,
  });
  const [to, setTo] = useState("IN_PROGRESS");
  const [note, setNote] = useState("");

  const mutate = useMutation({
    mutationFn: async () =>
      (await api.patch(`/tickets/${id}/status`, { to, note })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ticket", id] }),
  });

  // di TicketDetail
  useEffect(() => {
    if (!id) return;
    const ch = echo.private(`tickets.${id}`);
    const onAny = () => qc.invalidateQueries({ queryKey: ["ticket", id] });
    ch.listen(".ticket.updated", onAny).listen(".ticket.status", onAny);
    return () => {
      ch.stopListening(".ticket.updated", onAny).stopListening(
        ".ticket.status",
        onAny
      );
      echo.leaveChannel(`private-tickets.${id}`);
    };
  }, [id, qc]);

  if (!data) return null;
  return (
    <div className="p-4 space-y-4">
      <div className="text-xl font-semibold">{data.title}</div>
      <div className="text-sm opacity-70">
        {data.status} • {data.priority} • {data.customer?.name}
      </div>

      <div className="space-y-2">
        <div className="font-medium">Ubah Status</div>
        <div className="flex gap-2">
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border p-2">
            <option>IN_PROGRESS</option>
            <option>RESOLVED</option>
            <option>CLOSED</option>
          </select>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Catatan"
            className="border p-2"
          />
          <button onClick={() => mutate.mutate()} className="border px-3">
            Kirim
          </button>
        </div>
        {mutate.isError && (
          <div className="text-red-600 text-sm">
            {(mutate.error as any)?.response?.data?.message ||
              JSON.stringify((mutate.error as any)?.response?.data)}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="font-medium">Timeline</div>
        <ul className="text-sm">
          {data.events?.map((e: any) => (
            <li key={e.id}>
              {e.created_at} — {e.from ?? "∅"} → {e.to}{" "}
              {e.note ? `• ${e.note}` : ""}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
