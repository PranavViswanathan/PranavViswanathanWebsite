/* ── Per-project banner animations ──────────────────────────────────────────
 * Each entry returns a self-contained SVG string sized for an 80px-tall
 * banner that spans the full card width. SVGs use `currentColor` so the
 * accent color is controlled by `.project-banner` in style.css.
 *
 * Animations are pure SVG + scoped CSS keyframes. No JS runtime cost after
 * insertion. Each project's keyframe names are uniquely prefixed to avoid
 * collisions when multiple banners share the document.
 * ───────────────────────────────────────────────────────────────────────── */

const projectAnimations = {

  /* CaduceusAI — EKG heartbeat scrolling left */
  'CaduceusAI': `
    <svg viewBox="0 0 320 80" preserveAspectRatio="xMidYMid slice" class="anim-svg">
      <style>
        .cad-base { stroke: currentColor; stroke-width: 0.4; opacity: 0.18; }
        .cad-line { stroke: currentColor; stroke-width: 1.6; fill: none;
                    stroke-linecap: round; stroke-linejoin: round;
                    animation: cad-scroll 1.6s linear infinite; }
        .cad-cross { stroke: currentColor; stroke-width: 1.2; opacity: 0.55; }
        @keyframes cad-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-80px); }
        }
      </style>
      <line class="cad-base" x1="0" y1="40" x2="320" y2="40"/>
      <g>
        <path class="cad-line" d="M-80 40 H-40 l4 -2 l4 -18 l5 36 l5 -36 l5 18 l3 2 H40 l4 -2 l4 -18 l5 36 l5 -36 l5 18 l3 2 H160 l4 -2 l4 -18 l5 36 l5 -36 l5 18 l3 2 H280 l4 -2 l4 -18 l5 36 l5 -36 l5 18 l3 2 H400"/>
      </g>
      <g class="cad-cross" transform="translate(20 40)">
        <line x1="-6" y1="0" x2="6" y2="0"/>
        <line x1="0" y1="-6" x2="0" y2="6"/>
      </g>
    </svg>`,

  /* DistroSim — three nodes in a triangle with packets flowing along edges */
  'DistroSim': `
    <svg viewBox="0 0 320 80" preserveAspectRatio="xMidYMid slice" class="anim-svg">
      <style>
        .ds-edge { stroke: currentColor; stroke-width: 0.8; opacity: 0.35; fill: none; }
        .ds-node { stroke: currentColor; stroke-width: 1.4; fill: none;
                   animation: ds-pulse 2.4s ease-in-out infinite; }
        .ds-node-b { animation-delay: 0.8s; }
        .ds-node-c { animation-delay: 1.6s; }
        .ds-packet { fill: currentColor; }
        @keyframes ds-pulse {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 1; }
        }
      </style>
      <path class="ds-edge" id="ds-ab" d="M80 24 L240 24"/>
      <path class="ds-edge" id="ds-bc" d="M240 24 L160 64"/>
      <path class="ds-edge" id="ds-ca" d="M160 64 L80 24"/>
      <circle class="ds-node" cx="80" cy="24" r="7"/>
      <circle class="ds-node ds-node-b" cx="240" cy="24" r="7"/>
      <circle class="ds-node ds-node-c" cx="160" cy="64" r="7"/>
      <circle class="ds-packet" r="2.2">
        <animateMotion dur="2.4s" repeatCount="indefinite">
          <mpath href="#ds-ab"/>
        </animateMotion>
      </circle>
      <circle class="ds-packet" r="2.2">
        <animateMotion dur="2.4s" begin="0.8s" repeatCount="indefinite">
          <mpath href="#ds-bc"/>
        </animateMotion>
      </circle>
      <circle class="ds-packet" r="2.2">
        <animateMotion dur="2.4s" begin="1.6s" repeatCount="indefinite">
          <mpath href="#ds-ca"/>
        </animateMotion>
      </circle>
    </svg>`,

  /* MERC — three modality streams (T/A/V) fusing into a central node */
  'MERC': `
    <svg viewBox="0 0 320 80" preserveAspectRatio="xMidYMid slice" class="anim-svg">
      <style>
        .merc-edge { stroke: currentColor; stroke-width: 0.8; opacity: 0.3; fill: none; }
        .merc-mod  { stroke: currentColor; stroke-width: 1.2; fill: none; opacity: 0.7; }
        .merc-hub  { stroke: currentColor; stroke-width: 1.6; fill: none;
                     animation: merc-hub 1.8s ease-in-out infinite; transform-origin: 220px 40px; }
        .merc-label { font: 9px ui-monospace, monospace; fill: currentColor; opacity: 0.7; }
        .merc-flow { fill: currentColor; }
        @keyframes merc-hub {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50%      { transform: scale(1.18); opacity: 1; }
        }
      </style>
      <path class="merc-edge" id="merc-t" d="M64 20 L220 40"/>
      <path class="merc-edge" id="merc-a" d="M64 40 L220 40"/>
      <path class="merc-edge" id="merc-v" d="M64 60 L220 40"/>
      <circle class="merc-mod" cx="64" cy="20" r="6"/>
      <circle class="merc-mod" cx="64" cy="40" r="6"/>
      <circle class="merc-mod" cx="64" cy="60" r="6"/>
      <text class="merc-label" x="44" y="23">T</text>
      <text class="merc-label" x="44" y="43">A</text>
      <text class="merc-label" x="44" y="63">V</text>
      <circle class="merc-hub" cx="220" cy="40" r="9"/>
      <circle class="merc-flow" r="2">
        <animateMotion dur="1.8s" repeatCount="indefinite"><mpath href="#merc-t"/></animateMotion>
      </circle>
      <circle class="merc-flow" r="2">
        <animateMotion dur="1.8s" begin="0.6s" repeatCount="indefinite"><mpath href="#merc-a"/></animateMotion>
      </circle>
      <circle class="merc-flow" r="2">
        <animateMotion dur="1.8s" begin="1.2s" repeatCount="indefinite"><mpath href="#merc-v"/></animateMotion>
      </circle>
    </svg>`,

  /* OmniRAG — central node with orbiting satellites, rotating slowly */
  'OmniRAG': `
    <svg viewBox="0 0 320 80" preserveAspectRatio="xMidYMid slice" class="anim-svg">
      <style>
        .or-orbit { stroke: currentColor; stroke-width: 0.4; opacity: 0.2; fill: none; }
        .or-hub   { stroke: currentColor; stroke-width: 1.6; fill: none; }
        .or-sat   { stroke: currentColor; stroke-width: 1.2; fill: currentColor; }
        .or-spin  { transform-origin: 160px 40px; animation: or-rot 6s linear infinite; }
        .or-spin-rev { transform-origin: 160px 40px; animation: or-rot 8s linear infinite reverse; }
        @keyframes or-rot { to { transform: rotate(360deg); } }
      </style>
      <ellipse class="or-orbit" cx="160" cy="40" rx="56" ry="24"/>
      <ellipse class="or-orbit" cx="160" cy="40" rx="92" ry="34"/>
      <circle class="or-hub" cx="160" cy="40" r="6"/>
      <g class="or-spin">
        <circle class="or-sat" cx="216" cy="40" r="2.4"/>
        <circle class="or-sat" cx="104" cy="40" r="2.4"/>
        <circle class="or-sat" cx="160" cy="16" r="2"/>
        <circle class="or-sat" cx="160" cy="64" r="2"/>
      </g>
      <g class="or-spin-rev">
        <circle class="or-sat" cx="252" cy="40" r="2"/>
        <circle class="or-sat" cx="68"  cy="40" r="2"/>
      </g>
    </svg>`,

  /* Rebalance-AI — forecast line drawing across a sparkline */
  'Rebalance-AI': `
    <svg viewBox="0 0 320 80" preserveAspectRatio="xMidYMid slice" class="anim-svg">
      <style>
        .reb-axis  { stroke: currentColor; stroke-width: 0.4; opacity: 0.18; }
        .reb-hist  { stroke: currentColor; stroke-width: 1.4; fill: none; opacity: 0.55;
                     stroke-linejoin: round; stroke-linecap: round; }
        .reb-fcst  { stroke: currentColor; stroke-width: 1.6; fill: none;
                     stroke-linejoin: round; stroke-linecap: round;
                     stroke-dasharray: 200; stroke-dashoffset: 200;
                     animation: reb-draw 3.4s ease-in-out infinite; }
        .reb-band  { fill: currentColor; opacity: 0.08;
                     animation: reb-band 3.4s ease-in-out infinite; }
        @keyframes reb-draw {
          0%        { stroke-dashoffset: 200; }
          55%, 80%  { stroke-dashoffset: 0; }
          100%      { stroke-dashoffset: 200; }
        }
        @keyframes reb-band {
          0%, 100% { opacity: 0; }
          55%, 80% { opacity: 0.1; }
        }
      </style>
      <line class="reb-axis" x1="16" y1="64" x2="304" y2="64"/>
      <path class="reb-band" d="M160 64 L160 30 L 248 22 L 304 38 L 304 64 Z"/>
      <path class="reb-hist" d="M16 50 L40 44 L64 52 L88 40 L112 46 L136 36 L160 42"/>
      <path class="reb-fcst" d="M160 42 L192 30 L 224 36 L 256 22 L 288 30"/>
      <circle cx="160" cy="42" r="2" fill="currentColor"/>
    </svg>`,

  /* SwarmCoordinator — dots morphing between formations */
  'SwarmCoordinator': `
    <svg viewBox="0 0 320 80" preserveAspectRatio="xMidYMid slice" class="anim-svg">
      <style>
        .sw-dot { fill: currentColor; }
        .sw-leader { stroke: currentColor; stroke-width: 1; fill: none; opacity: 0.6;
                     animation: sw-ring 2.4s ease-in-out infinite; transform-origin: center; }
        @keyframes sw-ring {
          0%, 100% { opacity: 0.2; r: 6; }
          50%      { opacity: 0.7; r: 10; }
        }
      </style>
      <circle class="sw-dot" cx="0" cy="0" r="2.4">
        <animate attributeName="cx" values="60;100;140;100;60" dur="6s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="40;20;40;60;40" dur="6s" repeatCount="indefinite"/>
      </circle>
      <circle class="sw-dot" cx="0" cy="0" r="2.4">
        <animate attributeName="cx" values="100;140;180;140;100" dur="6s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="40;20;40;60;40" dur="6s" repeatCount="indefinite"/>
      </circle>
      <circle class="sw-dot" cx="0" cy="0" r="2.4">
        <animate attributeName="cx" values="140;180;220;180;140" dur="6s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="40;20;40;60;40" dur="6s" repeatCount="indefinite"/>
      </circle>
      <circle class="sw-dot" cx="0" cy="0" r="2.4">
        <animate attributeName="cx" values="180;220;260;220;180" dur="6s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="40;20;40;60;40" dur="6s" repeatCount="indefinite"/>
      </circle>
      <circle class="sw-dot" cx="0" cy="0" r="2.4">
        <animate attributeName="cx" values="220;260;220;180;220" dur="6s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="40;60;40;20;40" dur="6s" repeatCount="indefinite"/>
      </circle>
      <circle class="sw-dot" cx="0" cy="0" r="3.2">
        <animate attributeName="cx" values="160;180;200;180;160" dur="6s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="40;30;40;50;40" dur="6s" repeatCount="indefinite"/>
      </circle>
      <circle class="sw-leader" cx="180" cy="40" r="6"/>
    </svg>`,

  /* Lucera — low-res blocks on the left sharpen into high-res frames on the right */
  'Lucera': `
    <svg viewBox="0 0 320 80" preserveAspectRatio="xMidYMid slice" class="anim-svg">
      <style>
        .luc-frame { stroke: currentColor; stroke-width: 1; fill: none; opacity: 0.7; }
        .luc-pix-lo { fill: currentColor; animation: luc-flick 1.2s steps(4) infinite; }
        .luc-pix-hi { fill: currentColor; animation: luc-flick 1.2s steps(8) infinite reverse; }
        .luc-arrow { stroke: currentColor; stroke-width: 1.4; fill: none;
                     stroke-linecap: round; stroke-linejoin: round;
                     animation: luc-arrow 1.6s ease-in-out infinite; }
        @keyframes luc-flick { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.85; } }
        @keyframes luc-arrow {
          0%, 100% { transform: translateX(0); opacity: 0.6; }
          50%      { transform: translateX(6px); opacity: 1; }
        }
      </style>
      <rect class="luc-frame" x="20" y="20" width="80" height="40" rx="2"/>
      <g class="luc-pix-lo">
        <rect x="28" y="28" width="16" height="12"/>
        <rect x="48" y="28" width="16" height="12"/>
        <rect x="68" y="28" width="16" height="12"/>
        <rect x="28" y="44" width="16" height="12"/>
        <rect x="48" y="44" width="16" height="12" opacity="0.5"/>
        <rect x="68" y="44" width="16" height="12"/>
      </g>
      <g class="luc-arrow" transform="translate(140 40)">
        <line x1="-12" y1="0" x2="12" y2="0"/>
        <polyline points="6,-5 12,0 6,5"/>
      </g>
      <rect class="luc-frame" x="200" y="20" width="100" height="40" rx="2"/>
      <g class="luc-pix-hi">
        <rect x="204" y="24" width="6" height="6"/>
        <rect x="212" y="24" width="6" height="6" opacity="0.4"/>
        <rect x="220" y="24" width="6" height="6"/>
        <rect x="228" y="24" width="6" height="6" opacity="0.6"/>
        <rect x="236" y="24" width="6" height="6"/>
        <rect x="244" y="24" width="6" height="6" opacity="0.5"/>
        <rect x="252" y="24" width="6" height="6"/>
        <rect x="260" y="24" width="6" height="6" opacity="0.7"/>
        <rect x="268" y="24" width="6" height="6"/>
        <rect x="276" y="24" width="6" height="6" opacity="0.4"/>
        <rect x="284" y="24" width="6" height="6"/>
        <rect x="292" y="24" width="6" height="6" opacity="0.6"/>
        <rect x="204" y="32" width="6" height="6" opacity="0.5"/>
        <rect x="212" y="32" width="6" height="6"/>
        <rect x="220" y="32" width="6" height="6" opacity="0.6"/>
        <rect x="228" y="32" width="6" height="6"/>
        <rect x="236" y="32" width="6" height="6" opacity="0.4"/>
        <rect x="244" y="32" width="6" height="6"/>
        <rect x="252" y="32" width="6" height="6" opacity="0.7"/>
        <rect x="260" y="32" width="6" height="6"/>
        <rect x="268" y="32" width="6" height="6" opacity="0.5"/>
        <rect x="276" y="32" width="6" height="6"/>
        <rect x="284" y="32" width="6" height="6" opacity="0.6"/>
        <rect x="292" y="32" width="6" height="6"/>
        <rect x="204" y="40" width="6" height="6"/>
        <rect x="212" y="40" width="6" height="6" opacity="0.5"/>
        <rect x="220" y="40" width="6" height="6"/>
        <rect x="228" y="40" width="6" height="6" opacity="0.7"/>
        <rect x="236" y="40" width="6" height="6"/>
        <rect x="244" y="40" width="6" height="6" opacity="0.4"/>
        <rect x="252" y="40" width="6" height="6"/>
        <rect x="260" y="40" width="6" height="6" opacity="0.6"/>
        <rect x="268" y="40" width="6" height="6"/>
        <rect x="276" y="40" width="6" height="6" opacity="0.5"/>
        <rect x="284" y="40" width="6" height="6"/>
        <rect x="292" y="40" width="6" height="6" opacity="0.7"/>
        <rect x="204" y="48" width="6" height="6" opacity="0.6"/>
        <rect x="212" y="48" width="6" height="6"/>
        <rect x="220" y="48" width="6" height="6" opacity="0.4"/>
        <rect x="228" y="48" width="6" height="6"/>
        <rect x="236" y="48" width="6" height="6" opacity="0.7"/>
        <rect x="244" y="48" width="6" height="6"/>
        <rect x="252" y="48" width="6" height="6" opacity="0.5"/>
        <rect x="260" y="48" width="6" height="6"/>
        <rect x="268" y="48" width="6" height="6" opacity="0.6"/>
        <rect x="276" y="48" width="6" height="6"/>
        <rect x="284" y="48" width="6" height="6" opacity="0.4"/>
        <rect x="292" y="48" width="6" height="6"/>
      </g>
    </svg>`,

  /* HawkEye — radar sweep over concentric rings with intermittent blips */
  'HawkEye': `
    <svg viewBox="0 0 320 80" preserveAspectRatio="xMidYMid slice" class="anim-svg">
      <style>
        .he-ring { stroke: currentColor; stroke-width: 0.5; fill: none; opacity: 0.25; }
        .he-cross { stroke: currentColor; stroke-width: 0.4; opacity: 0.2; }
        .he-sweep { transform-origin: 160px 40px; animation: he-rot 3s linear infinite; }
        .he-beam { fill: currentColor; opacity: 0.18; }
        .he-blip { fill: currentColor; opacity: 0; animation: he-blip 3s ease-out infinite; }
        @keyframes he-rot { to { transform: rotate(360deg); } }
        @keyframes he-blip {
          0%, 100% { opacity: 0; }
          15%      { opacity: 1; }
          60%      { opacity: 0; }
        }
      </style>
      <circle class="he-ring" cx="160" cy="40" r="12"/>
      <circle class="he-ring" cx="160" cy="40" r="22"/>
      <circle class="he-ring" cx="160" cy="40" r="32"/>
      <line class="he-cross" x1="120" y1="40" x2="200" y2="40"/>
      <line class="he-cross" x1="160" y1="4"  x2="160" y2="76"/>
      <g class="he-sweep">
        <path class="he-beam" d="M160 40 L196 24 A38 38 0 0 1 196 56 Z"/>
        <line x1="160" y1="40" x2="196" y2="40" stroke="currentColor" stroke-width="1.2"/>
      </g>
      <circle class="he-blip" cx="178" cy="28" r="2" style="animation-delay: 0.4s"/>
      <circle class="he-blip" cx="146" cy="52" r="2" style="animation-delay: 1.6s"/>
      <circle class="he-blip" cx="184" cy="50" r="2" style="animation-delay: 2.4s"/>
    </svg>`,

  /* EcoStockAI — inventory bars oscillating with a reorder threshold */
  'EcoStockAI': `
    <svg viewBox="0 0 320 80" preserveAspectRatio="xMidYMid slice" class="anim-svg">
      <style>
        .es-axis { stroke: currentColor; stroke-width: 0.4; opacity: 0.18; }
        .es-th   { stroke: currentColor; stroke-width: 0.8; opacity: 0.45;
                   stroke-dasharray: 3 3; }
        .es-bar  { fill: currentColor; transform-box: fill-box; transform-origin: bottom; }
      </style>
      <line class="es-axis" x1="16" y1="64" x2="304" y2="64"/>
      <line class="es-th" x1="16" y1="44" x2="304" y2="44"/>
      <rect class="es-bar" x="32"  y="64" width="16" height="0">
        <animate attributeName="height" values="14;36;22;30;14" dur="3.2s" repeatCount="indefinite"/>
        <animate attributeName="y" values="50;28;42;34;50" dur="3.2s" repeatCount="indefinite"/>
      </rect>
      <rect class="es-bar" x="64" y="64" width="16" height="0">
        <animate attributeName="height" values="24;18;34;20;24" dur="3.2s" begin="0.2s" repeatCount="indefinite"/>
        <animate attributeName="y" values="40;46;30;44;40" dur="3.2s" begin="0.2s" repeatCount="indefinite"/>
      </rect>
      <rect class="es-bar" x="96" y="64" width="16" height="0">
        <animate attributeName="height" values="32;26;14;38;32" dur="3.2s" begin="0.4s" repeatCount="indefinite"/>
        <animate attributeName="y" values="32;38;50;26;32" dur="3.2s" begin="0.4s" repeatCount="indefinite"/>
      </rect>
      <rect class="es-bar" x="128" y="64" width="16" height="0">
        <animate attributeName="height" values="20;30;26;16;20" dur="3.2s" begin="0.6s" repeatCount="indefinite"/>
        <animate attributeName="y" values="44;34;38;48;44" dur="3.2s" begin="0.6s" repeatCount="indefinite"/>
      </rect>
      <rect class="es-bar" x="160" y="64" width="16" height="0">
        <animate attributeName="height" values="28;22;32;24;28" dur="3.2s" begin="0.8s" repeatCount="indefinite"/>
        <animate attributeName="y" values="36;42;32;40;36" dur="3.2s" begin="0.8s" repeatCount="indefinite"/>
      </rect>
      <rect class="es-bar" x="192" y="64" width="16" height="0">
        <animate attributeName="height" values="16;34;28;22;16" dur="3.2s" begin="1.0s" repeatCount="indefinite"/>
        <animate attributeName="y" values="48;30;36;42;48" dur="3.2s" begin="1.0s" repeatCount="indefinite"/>
      </rect>
      <rect class="es-bar" x="224" y="64" width="16" height="0">
        <animate attributeName="height" values="36;20;26;30;36" dur="3.2s" begin="1.2s" repeatCount="indefinite"/>
        <animate attributeName="y" values="28;44;38;34;28" dur="3.2s" begin="1.2s" repeatCount="indefinite"/>
      </rect>
      <rect class="es-bar" x="256" y="64" width="16" height="0">
        <animate attributeName="height" values="22;28;18;32;22" dur="3.2s" begin="1.4s" repeatCount="indefinite"/>
        <animate attributeName="y" values="42;36;46;32;42" dur="3.2s" begin="1.4s" repeatCount="indefinite"/>
      </rect>
    </svg>`,

  /* NeuroPilot — car (dot) lapping an oval racing track */
  'NeuroPilot': `
    <svg viewBox="0 0 320 80" preserveAspectRatio="xMidYMid slice" class="anim-svg">
      <style>
        .np-track-outer { stroke: currentColor; stroke-width: 1; fill: none; opacity: 0.5; }
        .np-track-inner { stroke: currentColor; stroke-width: 0.6; fill: none;
                          opacity: 0.3; stroke-dasharray: 2 4; }
        .np-car { fill: currentColor; }
        .np-trail { stroke: currentColor; stroke-width: 1.2; fill: none; opacity: 0.4;
                    stroke-dasharray: 12 280; stroke-linecap: round;
                    animation: np-trail 3.2s linear infinite; }
        @keyframes np-trail { to { stroke-dashoffset: -292; } }
      </style>
      <path class="np-track-outer" id="np-track" d="M40 40 a 36 24 0 1 0 240 0 a 36 24 0 1 0 -240 0"/>
      <path class="np-track-inner" d="M40 40 a 36 24 0 1 0 240 0 a 36 24 0 1 0 -240 0"/>
      <path class="np-trail" d="M40 40 a 36 24 0 1 0 240 0 a 36 24 0 1 0 -240 0"/>
      <circle class="np-car" r="3">
        <animateMotion dur="3.2s" repeatCount="indefinite" rotate="auto">
          <mpath href="#np-track"/>
        </animateMotion>
      </circle>
    </svg>`,

  /* Kernal-Combat — two duelling terminal prompts typing toward each other */
  'Kernal-Combat': `
    <svg viewBox="0 0 320 80" preserveAspectRatio="xMidYMid slice" class="anim-svg">
      <style>
        .kc-prompt { font: 11px ui-monospace, "SF Mono", Menlo, monospace;
                     fill: currentColor; }
        .kc-caret-l { fill: currentColor; animation: kc-blink 1s steps(2) infinite; }
        .kc-caret-r { fill: currentColor; animation: kc-blink 1s steps(2) infinite;
                      animation-delay: 0.5s; }
        @keyframes kc-blink { 50% { opacity: 0; } }
        .kc-l { animation: kc-type-l 4s steps(20) infinite; }
        .kc-r { animation: kc-type-r 4s steps(20) infinite; }
        @keyframes kc-type-l { 0% { clip-path: inset(0 100% 0 0); }
                               45%, 100% { clip-path: inset(0 0 0 0); } }
        @keyframes kc-type-r { 0% { clip-path: inset(0 0 0 100%); }
                               45%, 100% { clip-path: inset(0 0 0 0); } }
      </style>
      <text class="kc-prompt" x="16" y="32">$ <tspan class="kc-l">./solve --fast</tspan></text>
      <rect class="kc-caret-l" x="118" y="22" width="6" height="12"/>
      <text class="kc-prompt" x="172" y="62" text-anchor="start">$ <tspan class="kc-r">./solve --tight</tspan></text>
      <rect class="kc-caret-r" x="282" y="52" width="6" height="12"/>
      <line x1="16" y1="44" x2="304" y2="44" stroke="currentColor" stroke-width="0.4" opacity="0.2"/>
    </svg>`,

  /* Image Manipulation Toolkit — RGB channels separating and recombining */
  'Image Manipulation Toolkit': `
    <svg viewBox="0 0 320 80" preserveAspectRatio="xMidYMid slice" class="anim-svg">
      <style>
        .img-frame { stroke: currentColor; stroke-width: 0.6; fill: none; opacity: 0.4; }
        .img-r { fill: #ff5577; opacity: 0.55; mix-blend-mode: screen;
                 animation: img-r 3.6s ease-in-out infinite; }
        .img-g { fill: #55ff88; opacity: 0.55; mix-blend-mode: screen;
                 animation: img-g 3.6s ease-in-out infinite; }
        .img-b { fill: #5577ff; opacity: 0.55; mix-blend-mode: screen;
                 animation: img-b 3.6s ease-in-out infinite; }
        @keyframes img-r {
          0%, 100% { transform: translate(0, 0); }
          50%      { transform: translate(-12px, -6px); }
        }
        @keyframes img-g {
          0%, 100% { transform: translate(0, 0); }
          50%      { transform: translate(12px, 0); }
        }
        @keyframes img-b {
          0%, 100% { transform: translate(0, 0); }
          50%      { transform: translate(0, 6px); }
        }
        .img-hist { stroke: currentColor; stroke-width: 1; fill: none; opacity: 0.6; }
      </style>
      <rect class="img-frame" x="60" y="14" width="80" height="52" rx="2"/>
      <g style="transform-origin: 100px 40px">
        <circle class="img-r" cx="100" cy="40" r="20"/>
        <circle class="img-g" cx="100" cy="40" r="20"/>
        <circle class="img-b" cx="100" cy="40" r="20"/>
      </g>
      <path class="img-hist" d="M180 60 L188 50 L196 40 L204 32 L212 26 L220 32 L228 40 L236 36 L244 28 L252 36 L260 44 L268 38 L276 46 L284 52 L292 58 L300 60"/>
      <line x1="180" y1="60" x2="300" y2="60" stroke="currentColor" stroke-width="0.4" opacity="0.3"/>
    </svg>`,

  /* ctxbundle — multiple file glyphs converging into a single bundle */
  'ctxbundle': `
    <svg viewBox="0 0 320 80" preserveAspectRatio="xMidYMid slice" class="anim-svg">
      <style>
        .cx-file { stroke: currentColor; stroke-width: 1; fill: none; }
        .cx-bundle { stroke: currentColor; stroke-width: 1.4; fill: none;
                     animation: cx-throb 2.4s ease-in-out infinite;
                     transform-origin: 250px 40px; }
        @keyframes cx-throb {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50%      { transform: scale(1.08); opacity: 1; }
        }
        .cx-f1 { animation: cx-fly1 2.4s ease-in-out infinite; }
        .cx-f2 { animation: cx-fly2 2.4s ease-in-out infinite; animation-delay: 0.2s; }
        .cx-f3 { animation: cx-fly3 2.4s ease-in-out infinite; animation-delay: 0.4s; }
        .cx-f4 { animation: cx-fly4 2.4s ease-in-out infinite; animation-delay: 0.1s; }
        @keyframes cx-fly1 {
          0%, 15%   { transform: translate(0, 0); opacity: 0.8; }
          60%, 100% { transform: translate(160px, 20px); opacity: 0; }
        }
        @keyframes cx-fly2 {
          0%, 15%   { transform: translate(0, 0); opacity: 0.8; }
          60%, 100% { transform: translate(180px, 0px); opacity: 0; }
        }
        @keyframes cx-fly3 {
          0%, 15%   { transform: translate(0, 0); opacity: 0.8; }
          60%, 100% { transform: translate(160px, -20px); opacity: 0; }
        }
        @keyframes cx-fly4 {
          0%, 15%   { transform: translate(0, 0); opacity: 0.8; }
          60%, 100% { transform: translate(200px, 10px); opacity: 0; }
        }
      </style>
      <g class="cx-f1"><path class="cx-file" d="M30 16 h14 l4 4 v18 h-18 z M44 16 v4 h4"/></g>
      <g class="cx-f2"><path class="cx-file" d="M30 32 h14 l4 4 v18 h-18 z M44 32 v4 h4"/></g>
      <g class="cx-f3"><path class="cx-file" d="M30 56 h14 l4 4 v14 h-18 z M44 56 v4 h4" /></g>
      <g class="cx-f4"><path class="cx-file" d="M70 28 h14 l4 4 v18 h-18 z M84 28 v4 h4"/></g>
      <g class="cx-bundle">
        <rect x="232" y="22" width="36" height="36" rx="2"/>
        <line x1="232" y1="32" x2="268" y2="32"/>
        <line x1="232" y1="42" x2="268" y2="42"/>
        <line x1="232" y1="52" x2="268" y2="52"/>
      </g>
    </svg>`,
};

/* Fallback animation — terminal cursor blink, used when a project title has no
 * registered animation (e.g., future projects added to projects.json). */
const fallbackAnimation = `
  <svg viewBox="0 0 320 80" preserveAspectRatio="xMidYMid slice" class="anim-svg">
    <style>
      .fb-prompt { font: 12px ui-monospace, "SF Mono", Menlo, monospace;
                   fill: currentColor; opacity: 0.7; }
      .fb-caret { fill: currentColor; animation: fb-blink 1.1s steps(2) infinite; }
      @keyframes fb-blink { 50% { opacity: 0; } }
    </style>
    <text class="fb-prompt" x="120" y="46">~/projects $</text>
    <rect class="fb-caret" x="206" y="36" width="7" height="13"/>
  </svg>`;

function getProjectAnimation(title) {
  return projectAnimations[title] || fallbackAnimation;
}
