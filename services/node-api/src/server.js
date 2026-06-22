import http from "node:http";

const startedAt = new Date();

function json(res, statusCode, body) {
  const payload = JSON.stringify(body);

  res.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(payload),
  });
  res.end(payload);
}

function metrics() {
  const uptimeSeconds = Math.floor(process.uptime());

  return [
    "# HELP node_api_uptime_seconds Process uptime in seconds.",
    "# TYPE node_api_uptime_seconds gauge",
    `node_api_uptime_seconds ${uptimeSeconds}`,
    "# HELP node_api_info Static service information.",
    "# TYPE node_api_info gauge",
    `node_api_info{service="node-api",version="${process.env.APP_VERSION ?? "dev"}"} 1`,
    "",
  ].join("\n");
}

export function createServer() {
  return http.createServer((req, res) => {
    const path = new URL(req.url ?? "/", "http://localhost").pathname;

    if (path === "/health") {
      json(res, 200, { status: "ok" });
      return;
    }

    if (path === "/ready") {
      json(res, 200, { status: "ready" });
      return;
    }

    if (path === "/version") {
      json(res, 200, {
        service: "node-api",
        version: process.env.APP_VERSION ?? "dev",
        commit: process.env.GIT_SHA ?? "local",
        startedAt: startedAt.toISOString(),
      });
      return;
    }

    if (path === "/metrics") {
      const payload = metrics();
      res.writeHead(200, {
        "content-type": "text/plain; version=0.0.4; charset=utf-8",
        "content-length": Buffer.byteLength(payload),
      });
      res.end(payload);
      return;
    }

    json(res, 404, { error: "not_found" });
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number.parseInt(process.env.PORT ?? "3000", 10);
  const server = createServer();

  server.listen(port, "0.0.0.0", () => {
    console.log(`node-api listening on :${port}`);
  });
}
