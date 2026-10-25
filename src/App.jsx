import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Plus, Trash2, Settings, Code, Sparkles, Search, FileJson,
  CheckCircle2, AlertCircle, Loader2, ArrowRight, Copy, Check,
  Download, Layers, Zap, Terminal, Globe, Cpu, HelpCircle,
  ChevronRight, ChevronDown, RefreshCw, Send, Lock, Eye, Share2,
  Database, Sliders, MessageSquare, Briefcase, Mail, ShieldCheck
} from 'lucide-react';

// ==========================================
// PRE-BUILT PRODUCTION TEMPLATES
// ==========================================
const WORKFLOW_TEMPLATES = [
  {
    id: 'competitor-intel',
    name: 'Live Competitor & Market Intelligence',
    category: 'Research & Strategy',
    icon: Globe,
    description: 'Scrapes live web data via Google Search, analyzes competitor positioning, and outputs a structured JSON battlecard + executive Slack/Email brief.',
    triggerInput: 'Analyze the current market positioning and recent AI product announcements of Notion vs Linear in 2026.',
    nodes: [
      {
        id: 'node-1',
        type: 'researcher',
        title: 'Live Web Researcher',
        description: 'Queries live Google Search for up-to-date facts, news, and pricing.',
        useSearch: true,
        outputFormat: 'text',
        systemPrompt: 'You are an elite market intelligence researcher. Search the live web and compile a comprehensive, factual dossier on the requested companies or topic. Focus on recent announcements, pricing, strengths, and weaknesses.',
        userPromptTemplate: 'Conduct deep live web research on: {{input}}'
      },
      {
        id: 'node-2',
        type: 'extractor',
        title: 'Structured Battlecard Extractor',
        description: 'Converts raw research into a strict JSON schema for databases/CRMs.',
        useSearch: false,
        outputFormat: 'json',
        jsonSchema: JSON.stringify({
          type: "OBJECT",
          properties: {
            executiveSummary: { type: "STRING" },
            competitors: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  name: { type: "STRING" },
                  keyStrengths: { type: "ARRAY", items: { type: "STRING" } },
                  vulnerabilities: { type: "ARRAY", items: { type: "STRING" } },
                  threatLevel: { type: "STRING" }
                },
                propertyOrdering: ["name", "keyStrengths", "vulnerabilities", "threatLevel"]
              }
            },
            recommendedActionPlan: { type: "ARRAY", items: { type: "STRING" } }
          },
          propertyOrdering: ["executiveSummary", "competitors", "recommendedActionPlan"]
        }, null, 2),
        systemPrompt: 'Transform the raw research report into a clean, structured JSON competitive battlecard.',
        userPromptTemplate: 'Extract structured battlecard data from this research:\n\n{{previous_output}}'
      },
      {
        id: 'node-3',
        type: 'writer',
        title: 'Executive Action Synthesizer',
        description: 'Drafts a high-impact internal memo & sales enablement email.',
        useSearch: false,
        outputFormat: 'text',
        systemPrompt: 'You are a Chief Strategy Officer. Write a punchy, ready-to-send executive memo and sales team briefing based on the structured JSON battlecard. Use clean Markdown formatting.',
        userPromptTemplate: 'Create an executive strategy brief from this structured intelligence:\n\n{{previous_output}}'
      }
    ]
  },
  {
    id: 'lead-enrichment',
    name: 'Autonomous Inbound Lead Qualifier & Outbound',
    category: 'Sales & Revenue Ops',
    icon: Briefcase,
    description: 'Enriches raw lead inquiries with live company data, scores ICP fit in structured JSON, and drafts a hyper-personalized response.',
    triggerInput: 'Inbound Lead: Sarah Jenkins, VP of Engineering at Stripe. Message: "We are looking to automate our internal developer documentation and PR triage workflows for 400+ engineers."',
    nodes: [
      {
        id: 'lead-1',
        type: 'researcher',
        title: 'Company & Role Enrichment',
        description: 'Looks up the company tech stack, scale, and recent engineering initiatives.',
        useSearch: true,
        outputFormat: 'text',
        systemPrompt: 'You are a B2B Revenue Operations Enrichment Agent. Research the company and context mentioned in the lead payload.',
        userPromptTemplate: 'Enrich this inbound lead with company background and technical context:\n\n{{input}}'
      },
      {
        id: 'lead-2',
        type: 'extractor',
        title: 'MEDDIC Lead Scoring Engine',
        description: 'Scores the lead from 0-100 and identifies urgency, budget tier, and routing.',
        useSearch: false,
        outputFormat: 'json',
        jsonSchema: JSON.stringify({
          type: "OBJECT",
          properties: {
            leadScore: { type: "INTEGER" },
            qualificationTier: { type: "STRING" },
            estimatedDealSize: { type: "STRING" },
            identifiedPainPoints: { type: "ARRAY", items: { type: "STRING" } },
            recommendedNextStep: { type: "STRING" }
          },
          propertyOrdering: ["leadScore", "qualificationTier", "estimatedDealSize", "identifiedPainPoints", "recommendedNextStep"]
        }, null, 2),
        systemPrompt: 'Evaluate the enriched lead and output a strict JSON qualification scorecard.',
        userPromptTemplate: 'Original Lead:\n{{input}}\n\nEnrichment Data:\n{{previous_output}}'
      },
      {
        id: 'lead-3',
        type: 'writer',
        title: 'Hyper-Personalized Sequence Writer',
        description: 'Generates the exact email response and calendar invite agenda.',
        useSearch: false,
        outputFormat: 'text',
        systemPrompt: 'You are a top-performing Enterprise Account Executive. Write a warm, zero-fluff, deeply consultative reply email tailored to their exact pain points, plus a 3-bullet discovery call agenda.',
        userPromptTemplate: 'Lead Context:\n{{input}}\n\nQualification JSON:\n{{previous_output}}\n\nDraft the outreach response.'
      }
    ]
  },
  {
    id: 'support-triage',
    name: 'omni-Channel Support Triage & Bug Router',
    category: 'Customer Support & Eng',
    icon: ShieldCheck,
    description: 'Classifies customer tickets, extracts reproduction steps into Jira-ready JSON, and drafts empathetic customer responses.',
    triggerInput: 'Ticket #8942 from enterprise@acme.org: "URGENT! Since your v4.2 update 2 hours ago, our webhook endpoints are returning HTTP 502 Bad Gateway whenever payloads exceed 2MB. Our production billing pipeline is blocked!"',
    nodes: [
      {
        id: 'sup-1',
        type: 'extractor',
        title: 'Incident & Jira Ticket Classifier',
        description: 'Extracts severity, component, SLA timer, and engineering reproduction payload.',
        useSearch: false,
        outputFormat: 'json',
        jsonSchema: JSON.stringify({
          type: "OBJECT",
          properties: {
            severity: { type: "STRING" },
            category: { type: "STRING" },
            affectedComponent: { type: "STRING" },
            isProductionBlocked: { type: "BOOLEAN" },
            jiraSummary: { type: "STRING" },
            suggestedEngineeringFix: { type: "STRING" }
          },
          propertyOrdering: ["severity", "category", "affectedComponent", "isProductionBlocked", "jiraSummary", "suggestedEngineeringFix"]
        }, null, 2),
        systemPrompt: 'You are a Principal Site Reliability Engineer. Triage incoming support tickets into strict JSON metadata for automated PagerDuty/Jira routing.',
        userPromptTemplate: 'Triage this incoming customer report:\n\n{{input}}'
      },
      {
        id: 'sup-2',
        type: 'writer',
        title: 'Customer Incident Response & Workaround',
        description: 'Writes an immediate, reassuring response with technical workarounds.',
        useSearch: false,
        outputFormat: 'text',
        systemPrompt: 'You are a Head of Technical Support. Draft two outputs: 1) An immediate internal Slack alert for #incident-response, and 2) An empathetic, technically credible customer response offering an immediate mitigation step.',
        userPromptTemplate: 'Customer Ticket:\n{{input}}\n\nTriage JSON:\n{{previous_output}}'
      }
    ]
  }
];

// ==========================================
// GEMINI API HELPER WITH EXPONENTIAL BACKOFF
// ==========================================
async function executeGeminiNode({ systemPrompt, userPrompt, useSearch, outputFormat, jsonSchema }) {
  const apiKey = ""; // Provided by runtime environment
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: userPrompt }] }],
    systemInstruction: {
      parts: [{ text: systemPrompt || "You are a helpful AI automation agent." }]
    }
  };

  if (useSearch && outputFormat !== 'json') {
    payload.tools = [{ google_search: {} }];
  }

  if (outputFormat === 'json' && jsonSchema) {
    try {
      const parsedSchema = JSON.parse(jsonSchema);
      payload.generationConfig = {
        responseMimeType: "application/json",
        responseSchema: parsedSchema
      };
    } catch (e) {
      throw new Error(`Invalid JSON Schema in node configuration: ${e.message}`);
    }
  }

  const delays = [1000, 2000, 4000];
  let lastError = null;

  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API Error (${response.status}): ${errText}`);
      }

      const result = await response.json();
      const candidate = result.candidates?.[0];
      const text = candidate?.content?.parts?.[0]?.text || "";

      let sources = [];
      const groundingMetadata = candidate?.groundingMetadata;
      if (groundingMetadata?.groundingAttributions) {
        sources = groundingMetadata.groundingAttributions
          .map(attr => ({
            uri: attr.web?.uri,
            title: attr.web?.title
          }))
          .filter(s => s.uri && s.title);
      }

      return { text, sources };
    } catch (err) {
      lastError = err;
      if (attempt < delays.length) {
        await new Promise(r => setTimeout(r, delays[attempt]));
      }
    }
  }

  throw lastError || new Error("Failed to execute AI node.");
}

// ==========================================
// MAIN APPLICATION COMPONENT
// ==========================================
export default function App() {
  const [activeTab, setActiveTab] = useState('studio'); // 'studio' | 'logs' | 'deploy'
  const [selectedTemplateId, setSelectedTemplateId] = useState(WORKFLOW_TEMPLATES[0].id);
  const [workflowName, setWorkflowName] = useState(WORKFLOW_TEMPLATES[0].name);
  const [triggerInput, setTriggerInput] = useState(WORKFLOW_TEMPLATES[0].triggerInput);
  const [nodes, setNodes] = useState(WORKFLOW_TEMPLATES[0].nodes);
  const [selectedNodeId, setSelectedNodeId] = useState(WORKFLOW_TEMPLATES[0].nodes[0].id);

  // Execution state
  const [isRunning, setIsRunning] = useState(false);
  const [nodeStatuses, setNodeStatuses] = useState({}); // { [nodeId]: { status: 'idle'|'running'|'success'|'error', output: '', sources: [], durationMs: 0, error: '' } }
  const [executionHistory, setExecutionHistory] = useState([]);
  const [copiedKey, setCopiedKey] = useState(null);
  const [deployLang, setDeployLang] = useState('nodejs');
  const [notification, setNotification] = useState(null);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Load template
  const handleSelectTemplate = (template) => {
    setSelectedTemplateId(template.id);
    setWorkflowName(template.name);
    setTriggerInput(template.triggerInput);
    setNodes(JSON.parse(JSON.stringify(template.nodes)));
    setSelectedNodeId(template.nodes[0]?.id || null);
    setNodeStatuses({});
    showToast(`Loaded "${template.name}" pipeline`);
  };

  // Node CRUD operations
  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  const updateSelectedNode = (field, value) => {
    if (!selectedNode) return;
    setNodes(prev => prev.map(n => n.id === selectedNode.id ? { ...n, [field]: value } : n));
  };

  const addNode = () => {
    const newId = `node-${Date.now()}`;
    const newNode = {
      id: newId,
      type: 'writer',
      title: `AI Agent Step #${nodes.length + 1}`,
      description: 'Custom AI processing step in the automation pipeline.',
      useSearch: false,
      outputFormat: 'text',
      jsonSchema: JSON.stringify({
        type: "OBJECT",
        properties: {
          summary: { type: "STRING" },
          actionItems: { type: "ARRAY", items: { type: "STRING" } }
        },
        propertyOrdering: ["summary", "actionItems"]
      }, null, 2),
      systemPrompt: 'You are a specialized automation agent. Process the incoming payload accurately.',
      userPromptTemplate: 'Original Trigger:\n{{input}}\n\nPrevious Step Output:\n{{previous_output}}\n\nProvide your analysis:'
    };
    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newId);
    showToast('Added new AI Agent step to pipeline');
  };

  const removeNode = (id) => {
    if (nodes.length <= 1) {
      showToast('Pipeline must have at least one AI agent node.', 'error');
      return;
    }
    const filtered = nodes.filter(n => n.id !== id);
    setNodes(filtered);
    if (selectedNodeId === id) {
      setSelectedNodeId(filtered[0].id);
    }
  };

  // Run Full Automation Pipeline
  const runPipeline = async () => {
    if (!triggerInput.trim()) {
      showToast('Please provide a trigger input payload first.', 'error');
      return;
    }

    setIsRunning(true);
    const initialStatuses = {};
    nodes.forEach(n => {
      initialStatuses[n.id] = { status: 'idle', output: '', sources: [], durationMs: 0 };
    });
    setNodeStatuses(initialStatuses);

    let previousOutput = triggerInput;
    const runStart = Date.now();
    const stepLogs = [];

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const stepStart = Date.now();

      setNodeStatuses(prev => ({
        ...prev,
        [node.id]: { ...prev[node.id], status: 'running' }
      }));

      // Interpolate variables
      const interpolatedPrompt = node.userPromptTemplate
        .replace(/\{\{input\}\}/g, triggerInput)
        .replace(/\{\{previous_output\}\}/g, previousOutput);

      try {
        const result = await executeGeminiNode({
          systemPrompt: node.systemPrompt,
          userPrompt: interpolatedPrompt,
          useSearch: node.useSearch,
          outputFormat: node.outputFormat,
          jsonSchema: node.jsonSchema
        });

        const durationMs = Date.now() - stepStart;
        previousOutput = result.text;

        setNodeStatuses(prev => ({
          ...prev,
          [node.id]: {
            status: 'success',
            output: result.text,
            sources: result.sources || [],
            durationMs
          }
        }));

        stepLogs.push({
          nodeId: node.id,
          title: node.title,
          status: 'success',
          durationMs,
          output: result.text,
          sources: result.sources || []
        });
      } catch (error) {
        const durationMs = Date.now() - stepStart;
        setNodeStatuses(prev => ({
          ...prev,
          [node.id]: {
            status: 'error',
            output: '',
            sources: [],
            durationMs,
            error: error.message
          }
        }));
        stepLogs.push({
          nodeId: node.id,
          title: node.title,
          status: 'error',
          durationMs,
          error: error.message
        });
        setIsRunning(false);
        showToast(`Pipeline halted at "${node.title}": ${error.message}`, 'error');
        return;
      }
    }

    const totalDuration = Date.now() - runStart;
    setExecutionHistory(prev => [
      {
        id: `run-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        workflowName,
        triggerInput,
        totalDuration,
        steps: stepLogs,
        finalOutput: previousOutput
      },
      ...prev
    ]);

    setIsRunning(false);
    showToast(`Automation completed in ${(totalDuration / 1000).toFixed(1)}s!`);
  };

  // Copy helper compatible with iframe restrictions
  const copyToClipboard = (text, key) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
    showToast('Copied to clipboard!');
  };

  // Download JSON Blueprint
  const exportBlueprintJson = () => {
    const blueprint = {
      name: workflowName,
      version: "1.0.0",
      exportedAt: new Date().toISOString(),
      triggerInput,
      nodes
    };
    const blob = new Blob([JSON.stringify(blueprint, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflowName.toLowerCase().replace(/\s+/g, '-')}-blueprint.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded JSON Blueprint');
  };

  // Generate Ready-to-Deploy Code Snippets
  const generateDeployCode = (lang) => {
    const serializedNodes = JSON.stringify(nodes.map(n => ({
      title: n.title,
      systemPrompt: n.systemPrompt,
      userPromptTemplate: n.userPromptTemplate,
      useSearch: n.useSearch,
      outputFormat: n.outputFormat,
      jsonSchema: n.outputFormat === 'json' ? JSON.parse(n.jsonSchema || '{}') : null
    })), null, 2);

    if (lang === 'nodejs') {
      return `/**
 * ${workflowName} - Production Microservice
 * Ready to deploy on Node.js 18+, Vercel, Cloudflare Workers, or AWS Lambda
 * Usage: GEMINI_API_KEY="your_key" node pipeline.js
 */

const API_KEY = process.env.GEMINI_API_KEY;
const ENDPOINT = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=\${API_KEY}\`;

const PIPELINE_NODES = ${serializedNodes};

async function runNode(node, triggerInput, previousOutput) {
  const prompt = node.userPromptTemplate
    .replace(/\\{\\{input\\}\\}/g, triggerInput)
    .replace(/\\{\\{previous_output\\}\\}/g, previousOutput);

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: node.systemPrompt }] }
  };

  if (node.useSearch && node.outputFormat !== 'json') {
    payload.tools = [{ google_search: {} }];
  }

  if (node.outputFormat === 'json' && node.jsonSchema) {
    payload.generationConfig = {
      responseMimeType: "application/json",
      responseSchema: node.jsonSchema
    };
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

export async function executeAutomation(triggerPayload) {
  let currentOutput = triggerPayload;
  const results = [];

  for (const node of PIPELINE_NODES) {
    console.log(\`[Running] \${node.title}...\`);
    currentOutput = await runNode(node, triggerPayload, currentOutput);
    results.push({ step: node.title, output: currentOutput });
  }

  return { finalOutput: currentOutput, trace: results };
}

// Execute immediately if run directly
executeAutomation(${JSON.stringify(triggerInput)})
  .then(res => console.log("Pipeline Complete:\\n", res.finalOutput))
  .catch(err => console.error("Pipeline Failed:", err));`;
    }

    if (lang === 'python') {
      return `# ${workflowName} - Production Python Automation Script
# Dependencies: pip install requests
# Usage: export GEMINI_API_KEY="your_key" && python pipeline.py

import os
import json
import requests

API_KEY = os.environ.get("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY")
ENDPOINT = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key={API_KEY}"

PIPELINE_NODES = json.loads("""${serializedNodes.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}""")

def run_pipeline(trigger_input: str):
    previous_output = trigger_input
    trace = []

    for node in PIPELINE_NODES:
        print(f"[Executing] {node['title']}...")
        prompt = (
            node["userPromptTemplate"]
            .replace("{{input}}", trigger_input)
            .replace("{{previous_output}}", previous_output)
        )

        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "systemInstruction": {"parts": [{"text": node["systemPrompt"]}]}
        }

        if node.get("useSearch") and node.get("outputFormat") != "json":
            payload["tools"] = [{"google_search": {}}]

        if node.get("outputFormat") == "json" and node.get("jsonSchema"):
            payload["generationConfig"] = {
                "responseMimeType": "application/json",
                "responseSchema": node["jsonSchema"]
            }

        response = requests.post(ENDPOINT, json=payload, timeout=60)
        response.raise_for_status()
        data = response.json()
        previous_output = data["candidates"][0]["content"]["parts"][0]["text"]
        trace.append({"step": node["title"], "output": previous_output})

    return {"final_output": previous_output, "trace": trace}

if __name__ == "__main__":
    result = run_pipeline(${JSON.stringify(triggerInput)})
    print("\\n=== FINAL PIPELINE OUTPUT ===")
    print(result["final_output"])`;
    }

    // cURL / Webhook format
    const firstNode = nodes[0];
    return `# Direct REST API Call for Step 1 (${firstNode.title})
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=\${GEMINI_API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify({
      contents: [{ parts: [{ text: firstNode.userPromptTemplate.replace('{{input}}', triggerInput) }] }],
      systemInstruction: { parts: [{ text: firstNode.systemPrompt }] },
      ...(firstNode.useSearch && firstNode.outputFormat !== 'json' ? { tools: [{ google_search: {} }] } : {})
    }, null, 2)}'`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Notification Toast */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md transition-all bg-slate-900/95 border-indigo-500/40 text-sm font-medium">
          {notification.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Top Navigation Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg tracking-tight text-white">
                  NexusFlow <span className="text-indigo-400">AI</span>
                </h1>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  v2.4 Production Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Autonomous Multi-Agent Pipeline Builder & Instant Microservice Exporter
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('studio')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'studio'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Workflow Studio</span>
            </button>
            <button
              onClick={() => setActiveTab('deploy')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'deploy'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>Deploy & Export</span>
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'logs'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Run Logs</span>
              {executionHistory.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 rounded-full text-[10px]">
                  {executionHistory.length}
                </span>
              )}
            </button>
          </div>

          {/* Primary Execute CTA */}
          <div className="flex items-center gap-2">
            <button
              onClick={exportBlueprintJson}
              title="Download Workflow Blueprint JSON"
              className="p-2 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={runPipeline}
              disabled={isRunning}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm shadow-lg transition-all ${
                isRunning
                  ? 'bg-indigo-600/50 text-indigo-200 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/25 cursor-pointer'
              }`}
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Executing Pipeline...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Run Automation</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'studio' && (
          <div className="space-y-6">
            {/* Template Selector Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {WORKFLOW_TEMPLATES.map((tpl) => {
                const IconComponent = tpl.icon;
                const isSelected = selectedTemplateId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl)}
                    className={`text-left p-4 rounded-2xl border transition-all flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-500/10'
                        : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl ${isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 block">
                            {tpl.category}
                          </span>
                          <h3 className="font-semibold text-sm text-white leading-snug">
                            {tpl.name}
                          </h3>
                        </div>
                      </div>
                      {isSelected && (
                        <span className="text-[10px] font-medium bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-500/30">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {tpl.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Studio Grid: Left Pipeline Flow + Right Node Inspector & Live Output */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Trigger + Agent Nodes (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                {/* Webhook / Trigger Input Card */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        1. Trigger Payload / Input Webhook
                      </h2>
                    </div>
                    <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
                      {"{{input}}"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">
                    Enter the incoming webhook data, customer inquiry, or research target that kicks off the automation.
                  </p>
                  <textarea
                    rows={3}
                    value={triggerInput}
                    onChange={(e) => setTriggerInput(e.target.value)}
                    placeholder="Enter trigger payload..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* Pipeline Nodes List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      2. Multi-Agent Execution Chain ({nodes.length} Steps)
                    </h2>
                    <button
                      onClick={addNode}
                      className="flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Agent Step</span>
                    </button>
                  </div>

                  {nodes.map((node, index) => {
                    const st = nodeStatuses[node.id]?.status || 'idle';
                    const isSelected = selectedNode?.id === node.id;

                    return (
                      <div key={node.id} className="relative">
                        {index > 0 && (
                          <div className="flex justify-center -my-1.5 relative z-10">
                            <div className="bg-slate-800 text-slate-400 rounded-full p-1 border border-slate-700">
                              <ArrowRight className="w-3 h-3 rotate-90" />
                            </div>
                          </div>
                        )}

                        <div
                          onClick={() => setSelectedNodeId(node.id)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/10'
                              : 'bg-slate-900/50 border-slate-800/90 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                                st === 'success'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : st === 'running'
                                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                                  : st === 'error'
                                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                  : 'bg-slate-800 text-slate-300'
                              }`}>
                                {st === 'running' ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : st === 'success' ? (
                                  <Check className="w-3.5 h-3.5" />
                                ) : (
                                  index + 1
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-semibold text-sm text-white">
                                    {node.title}
                                  </h3>
                                  {node.useSearch && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20">
                                      <Globe className="w-2.5 h-2.5" /> Live Search
                                    </span>
                                  )}
                                  {node.outputFormat === 'json' && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                      <FileJson className="w-2.5 h-2.5" /> Strict JSON
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                  {node.description}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              {nodeStatuses[node.id]?.durationMs > 0 && (
                                <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded">
                                  {(nodeStatuses[node.id].durationMs / 1000).toFixed(1)}s
                                </span>
                              )}
                              {nodes.length > 1 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeNode(node.id);
                                  }}
                                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                                  title="Delete Step"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Preview of step output if available */}
                          {nodeStatuses[node.id]?.output && (
                            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                              <span className="text-emerald-400 font-medium flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Output generated
                              </span>
                              <span className="text-slate-400 text-[11px]">
                                Click to inspect payload →
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Active Node Configuration & Live Output Inspector (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {selectedNode && (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                    {/* Inspector Header */}
                    <div className="px-5 py-4 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <Settings className="w-4 h-4 text-indigo-400" />
                        <h2 className="font-bold text-sm text-white">
                          Configure Agent Step: <span className="text-indigo-400">{selectedNode.title}</span>
                        </h2>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedNode.useSearch}
                            disabled={selectedNode.outputFormat === 'json'}
                            onChange={(e) => updateSelectedNode('useSearch', e.target.checked)}
                            className="rounded accent-indigo-500"
                          />
                          <Globe className="w-3.5 h-3.5 text-sky-400" />
                          <span>Google Search Grounding</span>
                        </label>

                        <select
                          value={selectedNode.outputFormat}
                          onChange={(e) => {
                            const fmt = e.target.value;
                            updateSelectedNode('outputFormat', fmt);
                            if (fmt === 'json') updateSelectedNode('useSearch', false);
                          }}
                          className="bg-slate-900 text-xs text-slate-200 px-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500"
                        >
                          <option value="text">Output: Markdown / Text</option>
                          <option value="json">Output: Strict JSON Schema</option>
                        </select>
                      </div>
                    </div>

                    {/* Inspector Body */}
                    <div className="p-5 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">
                            Agent Step Name
                          </label>
                          <input
                            type="text"
                            value={selectedNode.title}
                            onChange={(e) => updateSelectedNode('title', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">
                            Role Description
                          </label>
                          <input
                            type="text"
                            value={selectedNode.description}
                            onChange={(e) => updateSelectedNode('description', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">
                          System Instructions (Agent Persona & Guardrails)
                        </label>
                        <textarea
                          rows={2}
                          value={selectedNode.systemPrompt}
                          onChange={(e) => updateSelectedNode('systemPrompt', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-medium text-slate-400">
                            Prompt Template
                          </label>
                          <div className="flex items-center gap-2 text-[11px]">
                            <span className="text-slate-500">Variables:</span>
                            <code className="px-1.5 py-0.5 rounded bg-slate-950 text-indigo-400 border border-slate-800">
                              {"{{input}}"}
                            </code>
                            <code className="px-1.5 py-0.5 rounded bg-slate-950 text-purple-400 border border-slate-800">
                              {"{{previous_output}}"}
                            </code>
                          </div>
                        </div>
                        <textarea
                          rows={3}
                          value={selectedNode.userPromptTemplate}
                          onChange={(e) => updateSelectedNode('userPromptTemplate', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      {selectedNode.outputFormat === 'json' && (
                        <div>
                          <label className="block text-xs font-medium text-amber-400 mb-1">
                            Response JSON Schema (Enforced by Gemini Structured Outputs)
                          </label>
                          <textarea
                            rows={6}
                            value={selectedNode.jsonSchema}
                            onChange={(e) => updateSelectedNode('jsonSchema', e.target.value)}
                            className="w-full bg-slate-950 border border-amber-500/30 rounded-xl p-3 text-xs font-mono text-amber-200 focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Live Execution Output Viewer */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="px-5 py-3.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <h3 className="font-bold text-sm text-white">
                        Live Step Output: <span className="text-purple-400">{selectedNode?.title}</span>
                      </h3>
                    </div>

                    {nodeStatuses[selectedNode?.id]?.output && (
                      <button
                        onClick={() => copyToClipboard(nodeStatuses[selectedNode.id].output, 'step-out')}
                        className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        {copiedKey === 'step-out' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy Output</span>
                      </button>
                    )}
                  </div>

                  <div className="p-5">
                    {nodeStatuses[selectedNode?.id]?.status === 'running' ? (
                      <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
                        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                        <div>
                          <p className="text-sm font-medium text-slate-200">
                            Executing "{selectedNode.title}" via Gemini 3 Flash...
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {selectedNode.useSearch ? 'Searching live web sources & synthesizing response...' : 'Processing structured agent instructions...'}
                          </p>
                        </div>
                      </div>
                    ) : nodeStatuses[selectedNode?.id]?.status === 'error' ? (
                      <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-rose-200">
                          <AlertCircle className="w-4 h-4" /> Step Execution Error
                        </div>
                        <p className="font-mono">{nodeStatuses[selectedNode.id].error}</p>
                      </div>
                    ) : nodeStatuses[selectedNode?.id]?.output ? (
                      <div className="space-y-4">
                        <pre className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs sm:text-sm text-slate-200 whitespace-pre-wrap font-mono overflow-x-auto max-h-96 overflow-y-auto leading-relaxed">
                          {nodeStatuses[selectedNode.id].output}
                        </pre>

                        {/* Grounding Citations if Present */}
                        {nodeStatuses[selectedNode.id].sources?.length > 0 && (
                          <div className="pt-2">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-sky-400 mb-2 flex items-center gap-1.5">
                              <Globe className="w-3.5 h-3.5" /> Verified Live Web Sources ({nodeStatuses[selectedNode.id].sources.length})
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {nodeStatuses[selectedNode.id].sources.map((src, i) => (
                                <a
                                  key={i}
                                  href={src.uri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 text-sky-300 px-3 py-1.5 rounded-lg transition-colors truncate max-w-xs"
                                >
                                  {src.title || src.uri}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="py-10 text-center">
                        <Cpu className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                        <p className="text-sm text-slate-400 font-medium">
                          No output generated for this step yet.
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Click <span className="text-indigo-400 font-semibold">"Run Automation"</span> in the top bar to execute the full pipeline.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 2: DEPLOY & EXPORT MICROSERVICE CODE
           ========================================== */}
        {activeTab === 'deploy' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/60 border border-indigo-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Zero-Lock-In Production Export
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  Deploy "{workflowName}" Immediately
                </h2>
                <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                  Your entire multi-agent workflow is compiled into clean, dependency-free production code. Drop it directly into an AWS Lambda, Vercel Serverless Function, FastAPI endpoint, or cron job.
                </p>
              </div>
              <button
                onClick={exportBlueprintJson}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold border border-slate-700 shrink-0 transition-colors"
              >
                <Download className="w-4 h-4 text-indigo-400" />
                <span>Download Blueprint (.json)</span>
              </button>
            </div>

            {/* Code Generator Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDeployLang('nodejs')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      deployLang === 'nodejs'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Node.js / Serverless ESM
                  </button>
                  <button
                    onClick={() => setDeployLang('python')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      deployLang === 'python'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Python 3 Microservice
                  </button>
                  <button
                    onClick={() => setDeployLang('curl')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      deployLang === 'curl'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    cURL / Webhook Test
                  </button>
                </div>

                <button
                  onClick={() => copyToClipboard(generateDeployCode(deployLang), 'deploy-code')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-colors"
                >
                  {copiedKey === 'deploy-code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Ready-to-Deploy Code</span>
                </button>
              </div>

              <div className="p-5 bg-slate-950">
                <pre className="text-xs sm:text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed">
                  {generateDeployCode(deployLang)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 3: EXECUTION LOGS & AUDIT TRAIL
           ========================================== */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Pipeline Execution History & Telemetry</h2>
                <p className="text-xs text-slate-400">
                  Full trace logs, latency metrics, and final payloads for every automation run in this session.
                </p>
              </div>
              {executionHistory.length > 0 && (
                <button
                  onClick={() => setExecutionHistory([])}
                  className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
                >
                  Clear History
                </button>
              )}
            </div>

            {executionHistory.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
                <Terminal className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-slate-300">No Pipeline Runs Recorded Yet</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Trigger an automation run from the Studio to inspect step-by-step telemetry and JSON outputs.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {executionHistory.map((run) => (
                  <div key={run.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          COMPLETED
                        </span>
                        <h3 className="font-bold text-sm text-white">{run.workflowName}</h3>
                        <span className="text-xs text-slate-500">• {run.timestamp}</span>
                      </div>
                      <span className="text-xs font-mono text-indigo-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                        Total Latency: {(run.totalDuration / 1000).toFixed(2)}s
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {run.steps.map((st, idx) => (
                        <div key={idx} className="bg-slate-950 border border-slate-800/80 rounded-xl p-3">
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="font-semibold text-slate-200">
                              Step {idx + 1}: {st.title}
                            </span>
                            <span className="font-mono text-[11px] text-emerald-400">
                              {(st.durationMs / 1000).toFixed(1)}s
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-mono line-clamp-4">
                            {st.output}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}