
  .canvas-area {
    flex: 1;
    position: relative;
    overflow: hidden;
    background: 
      radial-gradient(circle at 20% 50%, rgba(88,166,255,0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 50%, rgba(63,185,80,0.03) 0%, transparent 50%),
      var(--bg-primary);
  }

  .canvas-area::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(48,54,61,0.3) 1px, transparent 1px),
      linear-gradient(90deg, rgba(48,54,61,0.3) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
  }

  .side-panel {
    width: 400px;
    min-width: 350px;
    background: var(--bg-secondary);
    border-left: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .panel-tabs {
    display: flex;
    border-bottom: 1px solid var(--border-color);
  }

  .panel-tab {
    flex: 1;
    padding: 0.75rem;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.2s;
  }

  .panel-tab:hover { color: var(--text-primary); }
  .panel-tab.active {
    color: var(--accent-blue);
    background: var(--bg-tertiary);
  }

  .panel-content {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
  }

  /* Topology Canvas */
  #topologyCanvas {
    width: 100%;
    height: 100%;
    display: block;
  }

  /* Simulation Controls */
  .sim-controls {
    position: absolute;
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.5rem;
    background: var(--bg-secondary);
    padding: 0.75rem 1.5rem;
    border-radius: 12px;
    border: 1px solid var(--border-color);
    box-shadow: 0 4px 20px var(--shadow);
  }

  .ctrl-btn {
    padding: 0.6rem 1.2rem;
    border: 1px solid var(--border-color);
    background: var(--bg-tertiary);
    color: var(--text-primary);
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .ctrl-btn:hover {
    background: var(--bg-card);
    border-color: var(--accent-blue);
    transform: translateY(-1px);
  }

  .ctrl-btn:active { transform: translateY(0); }

  .ctrl-btn.primary {
    background: var(--accent-blue);
    color: #fff;
    border-color: var(--accent-blue);
  }

  .ctrl-btn.primary:hover {
    background: #79b8ff;
  }

  .ctrl-btn.danger {
    background: var(--accent-red);
    color: #fff;
    border-color: var(--accent-red);
  }

  .speed-control {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: 0.5rem;
    padding-left: 0.75rem;
    border-left: 1px solid var(--border-color);
  }

  .speed-control label {
    font-size: 0.75rem;
    color: var(--text-secondary);
  }

  .speed-control input[type="range"] {
    width: 80px;
    accent-color: var(--accent-blue);
  }

  /* Topology Selector */
  .topology-selector {
    position: absolute;
    top: 1rem;
    left: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    background: var(--bg-secondary);
    padding: 0.75rem;
    border-radius: 10px;
    border: 1px solid var(--border-color);
    box-shadow: 0 4px 20px var(--shadow);
  }

  .topology-selector-title {
    font-size: 0.75rem;
    text-transform: uppercase;
    color: var(--text-secondary);
    letter-spacing: 0.5px;
    margin-bottom: 0.25rem;
  }

  .topo-btn {
    padding: 0.5rem 1rem;
    border: 1px solid var(--border-color);
    background: var(--bg-tertiary);
    color: var(--text-secondary);
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.2s;
    text-align: left;
  }

  .topo-btn:hover {
    background: var(--bg-card);
    color: var(--text-primary);
  }

  .topo-btn.active {
    background: var(--accent-blue);
    color: #fff;
    border-color: var(--accent-blue);
  }

  /* Step Indicator */
  .step-indicator {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: var(--bg-secondary);
    padding: 0.75rem 1rem;
    border-radius: 10px;
    border: 1px solid var(--border-color);
    font-size: 0.85rem;
    color: var(--text-secondary);
  }

  .step-indicator .step-num {
    color: var(--accent-blue);
    font-weight: bold;
  }

  /* Info Panel Cards */
  .info-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    padding: 1rem;
    margin-bottom: 0.75rem;
  }

  .info-card h3 {
    font-size: 0.95rem;
    color: var(--accent-blue);
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .info-card p, .info-card li {
    font-size: 0.85rem;
    color: var(--text-secondary);
    line-height: 1.6;
  }

  .info-card ul {
    padding-left: 1.2rem;
  }

  .info-card li { margin-bottom: 0.25rem; }

  .tag {
    display: inline-block;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .tag-blue { background: rgba(88,166,255,0.15); color: var(--accent-blue); }
  .tag-green { background: rgba(63,185,80,0.15); color: var(--accent-green); }
  .tag-orange { background: rgba(240,136,62,0.15); color: var(--accent-orange); }
  .tag-red { background: rgba(248,81,73,0.15); color: var(--accent-red); }
  .tag-purple { background: rgba(163,113,247,0.15); color: var(--accent-purple); }

  /* Packet Inspector */
  .packet-inspector {
    font-family: 'Courier New', monospace;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 0.75rem;
    font-size: 0.75rem;
    overflow-x: auto;
  }

  .packet-line {
    padding: 0.15rem 0;
    color: var(--text-secondary);
  }

  .packet-line .field { color: var(--accent-blue); }
  .packet-line .value { color: var(--accent-green); }
  .packet-line .hex { color: var(--accent-purple); }

  /* CLI Terminal */
  .cli-terminal {
    background: #000;
    border-radius: 8px;
    padding: 1rem;
    font-family: 'Courier New', monospace;
    font-size: 0.8rem;
    line-height: 1.6;
    color: #0f0;
    height: 300px;
    overflow-y: auto;
    border: 1px solid #333;
  }

  .cli-terminal .prompt {
    color: var(--accent-green);
  }

  .cli-terminal .cmd {
    color: #fff;
  }

  .cli-terminal .output {
    color: #aaa;
  }

  .cli-terminal .error {
    color: var(--accent-red);
  }

  .cli-input-line {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .cli-input {
    background: transparent;
    border: none;
    color: #0f0;
    font-family: inherit;
    font-size: inherit;
    flex: 1;
    outline: none;
  }

  .cli-cursor {
    display: inline-block;
    width: 8px;
    height: 16px;
    background: #0f0;
    animation: blink 1s infinite;
    vertical-align: middle;
  }

  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }

  /* Device Legend */
  .device-legend {
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    background: var(--bg-secondary);
    padding: 0.75rem;
    border-radius: 10px;
    border: 1px solid var(--border-color);
    font-size: 0.75rem;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.35rem;
    color: var(--text-secondary);
  }

  .legend-icon {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  /* Status Bar */
  .status-bar {
    position: absolute;
    bottom: 5rem;
    left: 1rem;
    background: var(--bg-secondary);
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    font-size: 0.75rem;
    color: var(--text-secondary);
  }

  .status-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 0.3rem;
  }

  .status-active { background: var(--accent-green); box-shadow: 0 0 6px var(--accent-green); }
  .status-paused { background: var(--accent-yellow); }
  .status-stopped { background: var(--accent-red); }

  /* Packet animation overlay */
  .packet-overlay {
    position: absolute;
    pointer-events: none;
  }

  /* Responsive */
  @media (max-width: 900px) {
    .main-container { flex-direction: column; }
    .side-panel { width: 100%; height: 300px; min-width: unset; border-left: none; border-top: 1px solid var(--border-color); }
    .canvas-area { height: 400px; }
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: var(--bg-secondary); }
  ::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--text-secondary); }

  /* Expandable section */
  .expandable {
    border: 1px solid var(--border-color);
    border-radius: 8px;
    margin-bottom: 0.5rem;
    overflow: hidden;
  }

  .expandable-header {
    padding: 0.6rem 0.75rem;
    background: var(--bg-tertiary);
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85rem;
    color: var(--text-primary);
    transition: background 0.2s;
  }

  .expandable-header:hover { background: var(--bg-card); }

  .expandable-body {
    padding: 0.75rem;
    font-size: 0.8rem;
    color: var(--text-secondary);
    line-height: 1.6;
    display: none;
  }

  .expandable.expanded .expandable-body { display: block; }
  .expandable.expanded .expand-arrow { transform: rotate(180deg); }

  .expand-arrow {
    transition: transform 0.2s;
    font-size: 0.7rem;
  }

  /* Tooltip */
  .tooltip {
    position: absolute;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 0.75rem;
    font-size: 0.8rem;
    color: var(--text-primary);
    pointer-events: none;
    z-index: 50;
    max-width: 250px;
    box-shadow: 0 4px 20px var(--shadow);
    display: none;
  }

  .tooltip-title {
    font-weight: 600;
    color: var(--accent-blue);
    margin-bottom: 0.25rem;
  }

  .tooltip-detail {
    color: var(--text-secondary);
    font-size: 0.75rem;
  }

  /* Table Styles */
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8rem;
    margin: 0.5rem 0;
  }

  th, td {
    padding: 0.4rem 0.5rem;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
  }

  th {
    color: var(--accent-blue);
    font-weight: 600;
    background: var(--bg-tertiary);
  }

  td { color: var(--text-secondary); }

  /* Highlight effect */
  .highlight-box {
    background: rgba(88,166,255,0.08);
    border-left: 3px solid var(--accent-blue);
    padding: 0.5rem 0.75rem;
    border-radius: 0 6px 6px 0;
    margin: 0.5rem 0;
    font-size: 0.8rem;
    color: var(--text-secondary);
  }

  .highlight-box.green {
    background: rgba(63,185,80,0.08);
    border-left-color: var(--accent-green);
  }

  .highlight-box.orange {
    background: rgba(240,136,62,0.08);
    border-left-color: var(--accent-orange);
  }
</style>
</head>
<body>

<div class="header">
  <div>
    <h1>Network Topology</h1>
    <div class="header-subtitle">Interactive Learning Lab — CCIE Network Architect Series</div>
  </div>
  <div style="display:flex;align-items:center;gap:1rem;">
    <span class="tag tag-blue">CCNA</span>
    <span class="tag tag-purple">CCNP</span>
    <span class="tag tag-green">Interactive</span>
  </div>
</div>

<div class="nav-tabs">
  <button class="nav-tab active" data-tab="visual">Visual Topology</button>
  <button class="nav-tab" data-tab="packet">Packet Flow</button>
  <button class="nav-tab" data-tab="cli">Cisco CLI Sim</button>
  <button class="nav-tab" data-tab="compare">Topology Compare</button>
  <button class="nav-tab" data-tab="quiz">Quick Quiz</button>
</div>

<div class="main-container">
  <div class="canvas-area" id="canvasArea">
    <canvas id="topologyCanvas"></canvas>
    
    <div class="topology-selector">
      <div class="topology-selector-title">Select Topology</div>
      <button class="topo-btn active" data-topo="star">Star</button>
      <button class="topo-btn" data-topo="bus">Bus</button>
      <button class="topo-btn" data-topo="ring">Ring</button>
      <button class="topo-btn" data-topo="mesh">Mesh</button>
      <button class="topo-btn" data-topo="tree">Tree</button>
      <button class="topo-btn" data-topo="leafspine">Leaf-Spine</button>
      <button class="topo-btn" data-topo="hubspoke">Hub-and-Spoke</button>
    </div>

    <div class="step-indicator" id="stepIndicator" style="display:none;">
      Step <span class="step-num" id="currentStep">0</span> / <span id="totalSteps">0</span>
    </div>

    <div class="status-bar" id="statusBar">
      <span class="status-dot status-stopped" id="statusDot"></span>
      <span id="statusText">Ready</span>
    </div>

    <div class="device-legend" id="deviceLegend">
      <div class="legend-item"><span class="legend-icon" style="background:var(--device-router)"></span> Router</div>
      <div class="legend-item"><span class="legend-icon" style="background:var(--device-switch)"></span> Switch</div>
      <div class="legend-item"><span class="legend-icon" style="background:var(--device-pc)"></span> PC/Host</div>
      <div class="legend-item"><span class="legend-icon" style="background:var(--device-server)"></span> Server</div>
    </div>

    <div class="sim-controls" id="simControls">
      <button class="ctrl-btn primary" id="btnStart">▶ Start</button>
      <button class="ctrl-btn" id="btnPause">⏸ Pause</button>
      <button class="ctrl-btn danger" id="btnReset">↺ Reset</button>
      <button class="ctrl-btn" id="btnStep">→ Step</button>
      <div class="speed-control">
        <label>Speed</label>
        <input type="range" id="speedRange" min="1" max="5" value="3">
      </div>
    </div>

    <div class="tooltip" id="tooltip"></div>
  </div>

  <div class="side-panel">
    <div class="panel-tabs">
      <button class="panel-tab active" data-panel="info">Info</button>
      <button class="panel-tab" data-panel="packets">Packets</button>
      <button class="panel-tab" data-panel="commands">Commands</button>
      <button class="panel-tab" data-panel="details">Details</button>
    </div>

    <div class="panel-content" id="panelInfo">
      <!-- Dynamic content -->
    </div>
  </div>
</div>

<script>
// ======================
// DATA & CONFIGURATION
// ======================

const topologyData = {
  star: {
    name: "Star Topology",
    description: "All devices connect to a central switch. Each device has a dedicated point-to-point link to the center.",
    devices: [
      { id: "sw1", type: "switch", label: "Switch", x: 0.5, y: 0.5 },
      { id: "pc1", type: "pc", label: "PC-1", x: 0.2, y: 0.2 },
      { id: "pc2", type: "pc", label: "PC-2", x: 0.8, y: 0.2 },
      { id: "pc3", type: "pc", label: "PC-3", x: 0.8, y: 0.8 },
      { id: "srv1", type: "server", label: "Server", x: 0.2, y: 0.8 }
    ],
    links: [
      { from: "pc1", to: "sw1" },
      { from: "pc2", to: "sw1" },
      { from: "pc3", to: "sw1" },
      { from: "srv1", to: "sw1" }
    ],
    pros: ["Easy to install and manage", "Fault isolation — one link failure affects only one device", "Adding/removing devices doesn't disrupt network", "Modern switches provide full-duplex, collision-free operation"],
    cons: ["Central switch is single point of failure", "More cabling than bus topology", "Cable length limited to 100m for UTP"],
    ccna: "Star is the most common physical topology in modern networks. Remember: hub = logical bus, switch = true star.",
    steps: [
      "PC-1 wants to send data to Server. It encapsulates the frame with Destination MAC = Server's MAC.",
      "Frame travels along the dedicated UTP cable from PC-1 to the Switch on Port 1.",
      "Switch receives the frame and inspects the Destination MAC address.",
      "Switch looks up the MAC in its CAM table. If found, forwards only to the destination port.",
      "If MAC is unknown, Switch floods the frame to all ports except the incoming port.",
      "Server receives the frame, recognizes its MAC, and processes the data.",
      "Other devices (PC-2, PC-3) discard the frame as it's not addressed to them."
    ]
  },
  bus: {
    name: "Bus Topology",
    description: "All devices connect to a single shared backbone cable. Data travels in both directions.",
    devices: [
      { id: "bus", type: "bus", label: "Backbone", x: 0.5, y: 0.5 },
      { id: "t1", type: "pc", label: "PC-A", x: 0.15, y: 0.35 },
      { id: "t2", type: "pc", label: "PC-B", x: 0.35, y: 0.65 },
      { id: "t3", type: "server", label: "Server", x: 0.55, y: 0.35 },
      { id: "t4", type: "pc", label: "PC-C", x: 0.75, y: 0.65 },
      { id: "t5", type: "pc", label: "PC-D", x: 0.9, y: 0.35 }
    ],
    links: [
      { from: "t1", to: "bus", anchor: "top" },
      { from: "t2", to: "bus", anchor: "bottom" },
      { from: "t3", to: "bus", anchor: "top" },
      { from: "t4", to: "bus", anchor: "bottom" },
      { from: "t5", to: "bus", anchor: "top" }
    ],
    pros: ["Minimal cabling required", "Simple to understand and install", "Inexpensive for very small networks"],
    cons: ["Single point of failure (backbone cable)", "Difficult to troubleshoot cable faults", "Collisions reduce