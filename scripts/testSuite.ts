import assert from "node:assert";
import {
  getAllServices,
  getServiceById,
  addService,
  updateService,
  deleteService,
  pingService,
  getLogs,
  recordLog,
} from "../lib/registry";
import {
  dispatchIncidentAlert,
  getAlertHistory,
} from "../lib/notifications";

async function runTests() {
  console.log("=========================================");
  console.log("🛡️  RUNNING API SENTINEL TEST SUITE");
  console.log("=========================================\n");

  let passed = 0;
  let total = 0;

  function test(name: string, fn: () => void | Promise<void>) {
    total++;
    try {
      const res = fn();
      if (res instanceof Promise) {
        return res
          .then(() => {
            console.log(`  ✓ ${name}`);
            passed++;
          })
          .catch((err) => {
            console.error(`  ✗ ${name}:`, err.message);
            throw err;
          });
      } else {
        console.log(`  ✓ ${name}`);
        passed++;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ ${name}:`, msg);
      throw err;
    }
  }

  // 1. Registry defaults
  await test("1. Multi-service registry initializes with default projects", () => {
    const services = getAllServices();
    assert.strictEqual(services.length >= 4, true, "Should have at least 4 default services");

    const resolveApi = services.find((s) => s.id === "srv-resolve-api");
    assert.ok(resolveApi, "RESOLVE Backend API must be registered");
    assert.strictEqual(resolveApi.url, "https://resolve-api-7q6z.onrender.com/api/health");

    const codeflow = services.find((s) => s.id === "srv-codeflow");
    assert.ok(codeflow, "CodeFlow JS Debugger must be registered");
    assert.strictEqual(codeflow.url, "https://codeflow-javascript-debugger.vercel.app/");

    const resolveWeb = services.find((s) => s.id === "srv-resolve-web");
    assert.ok(resolveWeb, "RESOLVE Web Client must be registered");
  });

  // 2. Add Service
  await test("2. Add new service dynamically to monitoring registry", () => {
    const newService = addService({
      name: "Stripe Webhook Listener",
      url: "https://jsonplaceholder.typicode.com/todos/1",
      method: "GET",
      expectedCode: 200,
      timeoutMs: 3000,
      category: "Third-Party",
      isActive: true,
    });

    assert.ok(newService.id, "Generated service ID must exist");
    assert.strictEqual(newService.name, "Stripe Webhook Listener");

    const retrieved = getServiceById(newService.id);
    assert.strictEqual(retrieved?.id, newService.id);
  });

  // 3. Update Service
  await test("3. Update service active status (pause/resume)", () => {
    const services = getAllServices();
    const target = services[0];
    const previous = target.isActive;

    const updated = updateService(target.id, { isActive: !previous });
    assert.strictEqual(updated?.isActive, !previous, "Active state should be toggled");

    // Reset back
    updateService(target.id, { isActive: previous });
  });

  // 4. Ping Service
  await test("4. Ping target service and verify round-trip telemetry", async () => {
    const testService = {
      id: "srv-unit-test",
      name: "Fast Mock Ping",
      url: "https://jsonplaceholder.typicode.com/posts/1",
      method: "GET" as const,
      expectedCode: 200,
      timeoutMs: 8000,
      category: "Microservice" as const,
      isActive: true,
      lastStatus: "UNKNOWN" as const,
      lastChecked: null,
      lastLatency: null,
      uptimeScore: 100.0,
      totalChecks: 0,
      failedChecks: 0,
    };

    const result = await pingService(testService);
    assert.strictEqual(result.status, "UP");
    assert.strictEqual(result.statusCode, 200);
    assert.strictEqual(typeof result.responseTime, "number");
    assert.ok(result.responseTime! > 0, "Response time should be positive");
  });

  // 5. Audit Logging
  await test("5. Log recording and retrieval", () => {
    const logId = `test-log-${Date.now()}`;
    recordLog({
      id: logId,
      serviceId: "srv-unit-test",
      serviceName: "Fast Mock Ping",
      status: "UP",
      statusCode: 200,
      responseTime: 42,
      createdAt: new Date().toISOString(),
    });

    const logs = getLogs("srv-unit-test", 10);
    const found = logs.find((l) => l.id === logId);
    assert.ok(found, "Recorded log must be present in retrieval stream");
    assert.strictEqual(found?.responseTime, 42);
  });

  // 6. Alert Dispatching
  await test("6. Incident Alert engine dispatches simulated/live notification", async () => {
    const alert = await dispatchIncidentAlert({
      serviceId: "srv-alert-test",
      serviceName: "Critical Test Service",
      serviceUrl: "https://api.example.com",
      type: "OUTAGE",
      statusCode: 500,
      responseTime: 1200,
      errorMessage: "HTTP 500 Internal Server Error",
      targetEmail: "engineer@gmail.com",
    });

    assert.ok(alert.id, "Alert record must have an ID");
    assert.strictEqual(alert.type, "OUTAGE");
    assert.strictEqual(alert.recipient, "engineer@gmail.com");
    assert.ok(alert.status === "DELIVERED" || alert.status === "SIMULATED");

    const history = getAlertHistory();
    const inHistory = history.find((a) => a.id === alert.id);
    assert.ok(inHistory, "Dispatched alert must be stored in alert history");
  });

  // 7. Alert Deduplication
  await test("7. Alert engine suppresses duplicate alerts for persistent outage", async () => {
    const duplicateAlert = await dispatchIncidentAlert({
      serviceId: "srv-alert-test",
      serviceName: "Critical Test Service",
      serviceUrl: "https://api.example.com",
      type: "OUTAGE",
      statusCode: 500,
      errorMessage: "Still failing",
    });

    assert.ok(
      duplicateAlert.id.startsWith("suppressed-"),
      "Subsequent alert in same failure state must be suppressed"
    );
  });

  // 8. Delete Service
  await test("8. Delete service from monitoring registry", () => {
    const toDelete = addService({
      name: "Temporary Service",
      url: "https://example.com",
      method: "GET",
      expectedCode: 200,
      timeoutMs: 3000,
      category: "Third-Party",
      isActive: true,
    });

    const deleted = deleteService(toDelete.id);
    assert.strictEqual(deleted, true);

    const check = getServiceById(toDelete.id);
    assert.strictEqual(check, undefined, "Service should no longer exist");
  });

  console.log("\n=========================================");
  console.log(`🎉 ALL ${passed}/${total} API SENTINEL TESTS PASSED!`);
  console.log("=========================================\n");
}

runTests().catch((err) => {
  console.error("Test suite failed:", err);
  process.exit(1);
});
