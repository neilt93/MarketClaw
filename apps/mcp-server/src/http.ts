import express from "express";
import cors from "cors";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "./server.js";

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", server: "declutter-marketplace" });
});

// MCP endpoint — stateless: new server + transport per request
app.post("/mcp", async (req, res) => {
  const server = createServer();

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless
  });

  res.on("close", () => {
    transport.close();
    server.close();
  });

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

// Handle GET and DELETE for SSE streams (required by spec but we're stateless)
app.get("/mcp", (_req, res) => {
  res.status(405).json({ error: "Method not allowed — use POST" });
});

app.delete("/mcp", (_req, res) => {
  res.status(405).json({ error: "Method not allowed — stateless server" });
});

const port = parseInt(process.env.MCP_SERVER_PORT ?? process.env.PORT ?? "3001");
app.listen(port, () => {
  console.log(`Declutter MCP server listening on http://localhost:${port}/mcp`);
});
