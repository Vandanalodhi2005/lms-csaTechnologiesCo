import Badge from "@/components/ui/Badge.jsx";
import { cn } from "@/utils";
import { AlertTriangle, Ban, CheckCircle2, CircleDashed, FlaskConical } from "lucide-react";

// Status is communicated with text + an icon/dot, never colour alone.
const statusConfig = {
  Connected: { variant: "success", dot: "bg-emerald-500", Icon: CheckCircle2 },
  "Not Connected": { variant: "secondary", dot: "bg-slate-400", Icon: CircleDashed },
  Demo: { variant: "info", dot: "bg-sky-500", Icon: FlaskConical },
  Disabled: { variant: "warning", dot: "bg-amber-500", Icon: Ban },
  Error: { variant: "danger", dot: "bg-red-500", Icon: AlertTriangle },
};

export default function IntegrationStatusBadge({ status, size = "default", withIcon = true }) {
  const config = statusConfig[status] || statusConfig["Not Connected"];
  const { Icon } = config;

  return (
    <Badge variant={config.variant} size={size} className="capitalize">
      {withIcon ? (
        <Icon className="h-3 w-3" aria-hidden="true" />
      ) : (
        <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} aria-hidden="true" />
      )}
      <span>{status}</span>
    </Badge>
  );
}
