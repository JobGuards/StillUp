import { Router } from "express";
import { apiKeyMiddleware, authMiddleware, projectAccessMiddleware } from "../middleware/auth.js";
import { GuardsService } from "../services/GuardsService.js";

const router = Router();

/**
 * Initialize a ReplayGuard session
 * POST /api/guards/session
 */
router.post("/session", apiKeyMiddleware, async (req, res) => {
  try {
    const { monitorId, externalId } = req.body;
    
    if (!monitorId) {
      return res.status(400).json({ error: "monitorId is required" });
    }

    const execution = await GuardsService.createSession(monitorId, externalId);
    
    res.json({
      executionId: execution.id,
      attempt: execution.attempt,
    });
  } catch (error) {
    console.error("[Guards] Session initialization error:", error);
    res.status(500).json({ error: "Failed to initialize session" });
  }
});

/**
 * Verify a side effect fingerprint
 * POST /api/guards/verify
 */
router.post("/verify", apiKeyMiddleware, async (req, res) => {
  try {
    const { executionId, fingerprint, type, target, inputHash } = req.body;

    if (!executionId || !fingerprint) {
      return res.status(400).json({ error: "executionId and fingerprint are required" });
    }

    const result = await GuardsService.verifySideEffect(
      executionId,
      fingerprint,
      type || "GENERIC",
      target || "unknown",
      inputHash || ""
    );

    res.json(result);
  } catch (error) {
    console.error("[Guards] Verification error:", error);
    res.status(500).json({ error: "Failed to verify side effect" });
  }
});

/**
 * Complete a guarded execution
 * PATCH /api/guards/execution/:id
 */
router.patch("/execution/:id", apiKeyMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["SUCCESS", "FAILED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    await GuardsService.completeExecution(id, status);
    res.json({ success: true });
  } catch (error) {
    console.error("[Guards] Completion error:", error);
    res.status(500).json({ error: "Failed to complete execution" });
  }
});

/**
 * List all guarded executions for the project (Dashboard)
 * GET /api/guards
 */
router.get("/", authMiddleware, projectAccessMiddleware("MEMBER"), async (req, res) => {
  try {
    const { project } = req;
    if (!project) return res.status(401).json({ error: "Project context missing" });

    const executions = await GuardsService.listExecutions(project.id);
    res.json(executions);
  } catch (error) {
    console.error("[Guards] List error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Get detailed execution info (Dashboard)
 * GET /api/guards/:id
 */
router.get("/:id", authMiddleware, projectAccessMiddleware("MEMBER"), async (req, res) => {
  try {
    const { project } = req;
    if (!project) return res.status(401).json({ error: "Project context missing" });

    const execution = await GuardsService.getExecutionDetails(req.params.id, project.id);
    if (!execution) return res.status(404).json({ error: "Execution not found" });

    res.json(execution);
  } catch (error) {
    console.error("[Guards] Detail error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
