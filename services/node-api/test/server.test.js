import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";

import { createServer } from "../src/server.js";

describe("node-api", () => {
  let server;
  let baseUrl;

  before(async () => {
    server = createServer();
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

    const address = server.address();
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  after(async () => {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  it("returns health status", async () => {
    const response = await fetch(`${baseUrl}/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, { status: "ok" });
  });

  it("returns readiness status", async () => {
    const response = await fetch(`${baseUrl}/ready`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, { status: "ready" });
  });

  it("exposes prometheus metrics", async () => {
    const response = await fetch(`${baseUrl}/metrics`);
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(body, /node_api_uptime_seconds/);
    assert.match(body, /node_api_info/);
  });
});
