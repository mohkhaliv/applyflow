import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { getStats } from '../utils/stats';
import type { JobApplication } from '../types';
export function ActivityChart({ apps }: { apps: JobApplication[] }) {
  const data = getStats(apps).overTime;
  return (
    <section className="panel">
      <div className="panel-title">
        <h2>Application activity</h2>
        <span>By applied date</span>
      </div>
      <div className="chart">
        {data.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 15, right: 15, bottom: 0, left: -25 }}
            >
              <CartesianGrid vertical={false} stroke="#edf0f4" />
              <XAxis
                dataKey="date"
                tickFormatter={(d) =>
                  new Date(d + 'T12:00:00').toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })
                }
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                minTickGap={30}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <Tooltip />
              <Area
                dataKey="count"
                name="Applications"
                stroke="#315de1"
                fill="#eaf0ff"
                strokeWidth={2.5}
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="empty">
            Your application activity will appear here once you apply.
          </p>
        )}
      </div>
    </section>
  );
}
export function StatusChart({ apps }: { apps: JobApplication[] }) {
  const s = getStats(apps);
  return (
    <section className="panel">
      <div className="panel-title">
        <h2>Pipeline overview</h2>
        <span>{apps.length} tracked</span>
      </div>
      <div className="status-bars">
        {s.byStatus.map(({ status, count }) => (
          <div key={status}>
            <span>
              <i className={'status-dot ' + status.toLowerCase()} />
              {status}
            </span>
            <div className="bar-track">
              <div
                className={'bar-fill ' + status.toLowerCase()}
                style={{
                  width: (apps.length ? (count / apps.length) * 100 : 0) + '%',
                }}
              />
            </div>
            <strong>{count}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
