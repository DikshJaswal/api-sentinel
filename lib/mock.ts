export type MockLog = {
  id: number;
  status: "UP" | "DOWN";
  responseTime: number | null;
  createdAt: Date;
};

// This store keeps the demo usable without PostgreSQL. It lasts for the
// lifetime of the Next.js server and is intentionally not persistent.
const now = Date.now();
const mockLogs: MockLog[] = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  status: index === 3 ? "DOWN" : "UP",
  responseTime: index === 3 ? null : 140 + ((index * 47) % 240),
  createdAt: new Date(now - (9 - index) * 15_000),
}));

export function isMockMode() {
  return process.env.USE_MOCK_DATA !== "false" || !process.env.DATABASE_URL;
}

export function getMockLogs() {
  return [...mockLogs].sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
  );
}

export function addMockLog() {
  const isUp = Math.random() > 0.15;
  const log: MockLog = {
    id: mockLogs.length + 1,
    status: isUp ? "UP" : "DOWN",
    responseTime: isUp ? 120 + Math.floor(Math.random() * 380) : null,
    createdAt: new Date(),
  };

  mockLogs.push(log);
  if (mockLogs.length > 50) mockLogs.shift();
  return log;
}
