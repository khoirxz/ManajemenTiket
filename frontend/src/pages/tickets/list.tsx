// src/pages/tickets/List.tsx
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/client";
import { echo } from "../../realtime/echo";
import { Link, useSearchParams } from "react-router";

export default function TicketsListPage() {
  const [sp, setSp] = useSearchParams();
  const q = sp.get("q") || "";
  const status = sp.get("status") || "";
  const page = Number(sp.get("page") || 1);

  const qc = useQueryClient();

  const { data } = useQuery({
    queryKey: ["tickets", { q, status, page }],
    queryFn: async () => {
      const { data } = await api.get("/tickets", {
        params: { q, status, page, per_page: 10 },
      });
      return data;
    },
  });

  useEffect(() => {
    const ch = echo.channel("tickets");
    const onCreated = () => qc.invalidateQueries({ queryKey: ["tickets"] });
    const onUpdated = () => qc.invalidateQueries({ queryKey: ["tickets"] });
    const onStatus = () => qc.invalidateQueries({ queryKey: ["tickets"] });

    ch.listen(".ticket.created", onCreated)
      .listen(".ticket.updated", onUpdated)
      .listen(".ticket.status", onStatus);

    return () => {
      ch.stopListening(".ticket.created")
        .stopListening(".ticket.updated")
        .stopListening(".ticket.status");
      echo.leave("tickets"); // alias yg aman
    };
  }, [qc]);

  return (
    <div className="p-4 space-y-3">
      <div className="flex gap-2">
        <input
          placeholder="Cari judul/desc"
          defaultValue={q}
          onChange={(e) =>
            setSp((p) => {
              p.set("q", e.target.value);
              p.set("page", "1");
              return p;
            })
          }
          className="border p-2"
        />
        <select
          defaultValue={status}
          onChange={(e) =>
            setSp((p) => {
              p.set("status", e.target.value);
              p.set("page", "1");
              return p;
            })
          }
          className="border p-2">
          <option value="">All</option>
          <option>OPEN</option>
          <option>IN_PROGRESS</option>
          <option>RESOLVED</option>
          <option>CLOSED</option>
        </select>
      </div>
      <ul className="divide-y">
        {data?.data?.map((t: any) => (
          <li key={t.id} className="py-2 flex justify-between">
            <div>
              <div className="font-medium">{t.title}</div>
              <div className="text-xs opacity-70">
                {t.status} • {t.priority} • {t.customer?.name}
              </div>
            </div>
            <Link to={`/tickets/${t.id}`} className="text-blue-600 text-sm">
              Detail
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
