let chatHistory = [];
let currentSessionId = null; // FIXED: Must be defined globally
let isListening = false;
let recognition;
let audioContext;
let analyser;
let dataArray;

// 1. INITIALIZE SPEECH RECOGNITION
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('speech-preview').innerText = `"${transcript}..."`;
        if (event.results[0].isFinal) {
            document.getElementById('user-input').value = transcript;
            setTimeout(() => {
                toggleVoice(); // Stop listening
                sendMessage();  // Auto-send the voice command
            }, 800);
        }
    };
}

function getCsrfToken() {
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
}

// 2. TOGGLE VOICE MODE
async function toggleVoice() {
    const overlay = document.getElementById('voice-overlay');
    const input = document.getElementById('user-input');

    if (!isListening) {
        // Start Listening
        isListening = true;
        overlay.classList.remove('hidden');
        recognition.start();
        startVisualizer();
    } else {
        // Stop Listening
        isListening = false;
        overlay.classList.add('hidden');
        recognition.stop();
    }
}

// 3. THE "LOUDNESS" VISUALIZER ENGINE
async function startVisualizer() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.fftSize = 64;
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    const canvas = document.getElementById('voice-wave');
    const ctx = canvas.getContext('2d');
    const circle = document.getElementById('visualizer-circle');

    function draw() {
        if (!isListening) {
        // Reset EKG to normal speed when done
            document.querySelectorAll('.animate-ekg').forEach(el => el.style.animationDuration = '10s');
            return;
        }
        requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        // Calculate average "Loudness"
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        let average = sum / dataArray.length;

        // --- NEW: SYNC LOGIC ---

        // 1. Speed up the EKG line based on your voice loudness
        // The louder you talk, the faster the "Heartbeat" moves
        const ekgSpeed = Math.max(1, 10 - (average / 10)); // Goes from 10s down to 1s duration
        document.querySelectorAll('.animate-ekg').forEach(el => {
            el.style.animationDuration = `${ekgSpeed}s`;
        });

        // 2. Make the "Ingestion" node in the roadmap glow when you speak
        const ingestionNode = document.querySelector('.roadmap-node .node-icon'); // First node
        if (ingestionNode) {
            if (average > 10) {
                ingestionNode.style.boxShadow = `0 0 ${average/2}px #14b8a6`;
                ingestionNode.style.borderColor = "#14b8a6";
            } else {
                ingestionNode.style.boxShadow = "none";
            }
        }

        // Animate the circle scale based on loudness
        let scale = 1 + (average / 150);
        circle.style.transform = `scale(${scale})`;
        circle.style.borderColor = `rgba(20, 184, 166, ${0.3 + (average / 255)})`;
        circle.style.boxShadow = `0 0 ${average}px rgba(20, 184, 166, 0.3)`;
        document.getElementById('visualizer-circle').style.transform = `scale(${scale})`;
    }
    draw();
}

// Helper to use suggestion cards
function setPrompt(text) {
    document.getElementById('user-input').value = text;
}

function switchView(viewName) {
    const homePage = document.getElementById('home-page');
    const dashboardApp = document.getElementById('dashboard-app');
    
    // Containers
    const chatCont = document.getElementById('chat-container');
    const formCont = document.getElementById('formula-container');
    const toolCont = document.getElementById('toolkit-container');
    const faqCont = document.getElementById('faq-container'); 
    const memoryCont = document.getElementById('memory-container'); 
    const analyticsCont = document.getElementById('analytics-container'); 
    const dashboardbuild = document.getElementById('dashboard-builder-container'); // NEW
    const onBoard = document.getElementById('onboarding-container');
    const globalInput = document.getElementById('global-input-area');
    const breadcrumb = document.getElementById('breadcrumb');
    const settingsCont = document.getElementById('settings-container');

    // 1. Navigation Toggle: Hide landing and show the dashboard wrapper
    if (homePage) homePage.classList.add('hidden');
    dashboardApp.classList.remove('hidden');
    dashboardApp.classList.add('flex');

    // 2. Hide ALL containers first to ensure a clean slate
    // Added settingsCont to this array
    [chatCont, formCont, toolCont, faqCont, memoryCont, analyticsCont, dashboardbuild, onBoard, settingsCont ].forEach(c => {
        if (c) c.classList.add('hidden');
    });

    // 3. Logic to show the specific view selected
    if (viewName === 'toolkit') {
        toolCont.classList.remove('hidden');
        globalInput.classList.add('hidden');
        breadcrumb.innerText = "Main / Admin Toolkit";
    } 
    else if (viewName === 'chats') {
        chatCont.classList.remove('hidden');
        globalInput.classList.remove('hidden');
        breadcrumb.innerText = "Main / Chat Assistant";
    } 
    else if (viewName === 'formula') {
        formCont.classList.remove('hidden');
        globalInput.classList.add('hidden');
        breadcrumb.innerText = "Main / Formula Builder";
    } 
    else if (viewName === 'faq') {
        faqCont.classList.remove('hidden');
        globalInput.classList.add('hidden');
        breadcrumb.innerText = "Main / FAQ & Knowledge Base";
    }
    else if (viewName === 'analytics') {
        analyticsCont.classList.remove('hidden');
        globalInput.classList.add('hidden');
        breadcrumb.innerText = "Main / Analytics Hub";
    }
    else if (viewName === 'memory') {
        memoryCont.classList.remove('hidden');
        globalInput.classList.add('hidden');
        breadcrumb.innerText = "Main / Memory Hub";
        
        if (typeof loadMemoryHub === "function") {
            loadMemoryHub();
        }
    }
    // NEW: API Connections View Logic
    else if (viewName === 'settings') {
        if (settingsCont) settingsCont.classList.remove('hidden');
        globalInput.classList.add('hidden');
        breadcrumb.innerText = "Main / API Connections";
    }

    else if (viewName === 'dashboard-builder') {
        if (dashboardbuild) dashboardbuild.classList.remove('hidden');
        globalInput.classList.add('hidden');
        breadcrumb.innerText = "Main / Dashboard Builder";
    }

    else if (viewName === 'onboarding') {
        if (onBoard) onBoard.classList.remove('hidden');
        globalInput.classList.add('hidden');
        breadcrumb.innerText = "Main / Onboarding Guide";
    }

    // 4. Update the active state of the sidebar buttons
    updateSidebarUI(viewName);
    
    // 5. Re-render icons
    lucide.createIcons();
}

// TRACK TOOLKIT CLICKS
async function trackClick(toolName) {
    console.log("Tracking click for: " + toolName);
    await fetch('/log-tool-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' ,'X-CSRFToken': getCsrfToken()},
        body: JSON.stringify({ tool_name: toolName })
    });
}

// INTERACTIVE FAQ LOGIC
function askFAQ(question) {
    // 1. Switch to chat
    switchView('chats');
    
    // 2. Clear welcome screen
    document.getElementById('welcome-view').classList.add('hidden');
    document.getElementById('conversation-view').classList.remove('hidden');

    // 3. Put question in input and send it
    document.getElementById('user-input').value = question;
    sendMessage();
}

// Helper to handle the "Green Background" on the active sidebar button
function updateSidebarUI(activeView) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-slate-800', 'text-white');
        btn.classList.add('text-slate-400');
    });
    
    const activeBtn = document.getElementById(`side-${activeView}`);
    if (activeBtn) {
        activeBtn.classList.add('bg-slate-800', 'text-white');
    }
}

function updateSidebarBtns(activeId) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-slate-800', 'text-white');
        btn.classList.add('text-slate-400');
    });
    document.getElementById(activeId).classList.add('bg-slate-800', 'text-white');
}

// Formula Logic
async function buildFormula() {
    const input = document.getElementById('formula-input');
    const outputBox = document.getElementById('formula-result-box');
    const outputDiv = document.getElementById('formula-output');
    
    if (!input.value) return;

    outputBox.classList.remove('hidden');
    outputDiv.innerHTML = "Processing syntax...";

    try {
        const response = await fetch('/formula', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' ,'X-CSRFToken': getCsrfToken()},
            body: JSON.stringify({ query: input.value })
        });

        const data = await response.json();
        
        // Use a simple formatter to highlight the formula in a code block
        outputDiv.innerHTML = data.response.replace(/'([^']+)'/g, '<code class="bg-black/40 text-teal-300 px-2 py-1 rounded border border-teal-500/30">$1</code>');
        
    } catch (e) {
        outputDiv.innerHTML = "Error analyzing formula.";
    }
}

function triggerBuilderUpload() {
    document.getElementById('builder-file-input').click();
}

async function handleBuilderUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Show loading state
    const uploadZone = document.getElementById('builder-upload-zone');
    uploadZone.innerHTML = `<div class="animate-pulse flex flex-col items-center"><i data-lucide="loader" class="w-10 h-10 text-teal-500 animate-spin mb-4"></i><p class="text-white font-bold uppercase tracking-widest text-xs">Architecting Dashboard...</p></div>`;
    lucide.createIcons();

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/generate-dashboard', { method: 'POST' ,headers: {'X-CSRFToken': getCsrfToken()}, body: formData });
        const data = await response.json();

        // 1. Reveal Results Area
        document.getElementById('builder-results').classList.remove('hidden');
        uploadZone.classList.add('hidden');

        // 2. Render Metrics (Scorecards)
        const metricsContainer = document.getElementById('builder-metrics');
        metricsContainer.innerHTML = data.metrics.map(m => `
            <div class="p-6 bg-slate-900/60 border-l-4 rounded-r-2xl" style="border-color: ${getColor(m.color)}">
                <p class="text-[9px] text-slate-500 uppercase font-bold mb-1">${m.label}</p>
                <p class="text-2xl font-black text-white">${m.value}</p>
            </div>
        `).join('');

        // 3. Render Charts
        const chartsContainer = document.getElementById('builder-charts');
        chartsContainer.innerHTML = data.charts.map((c, i) => `
            <div class="p-8 bg-slate-900/60 border border-slate-800 rounded-[30px]">
                <p class="text-xs font-bold text-teal-500 uppercase tracking-widest mb-6">${c.title}</p>
                <div style="height: 250px;"><canvas id="builder-chart-${i}"></canvas></div>
            </div>
        `).join('');

        data.charts.forEach((c, i) => {
            setTimeout(() => window.createChatChart(`builder-chart-${i}`, c), 100);
        });

        // 4. Render AI Summary
        document.getElementById('builder-ai-summary').innerText = "AI INSIGHT: " + data.summary;

    } catch (e) {
        alert("Dashboard generation failed.");
        location.reload();
    }
}

function getColor(name) {
    const colors = { "Teal": "#14b8a6", "Red": "#ef4444", "Blue": "#3b82f6", "Amber": "#f59e0b" };
    return colors[name] || "#14b8a6";
}



async function loadMemoryHub() {
    // 1. Fetch the stats
    const statsResponse = await fetch('/get-stats');
    const stats = await statsResponse.json();

    // 2. Animate the numbers (Roll-up effect)
    animateValue("stat-audits", 0, stats.audits, 1000);
    animateValue("stat-risks", 0, stats.risks, 1000);
    animateValue("stat-formulas", 0, stats.formulas, 1000);
    animateValue("stat-savings", 0, stats.savings, 1500);

    // 3. Existing logic to load cards...
    const response = await fetch('/get-sessions');
    const sessions = await response.json();
    // ... render cards logic from previous step ...
}

// Simple Counter Animation Function
function animateValue(id, start, end, duration) {
    if (start === end) return;
    const obj = document.getElementById(id);
    if (!obj) return;
    const range = end - start;
    const minTimer = 50;
    let stepTime = Math.abs(Math.floor(duration / range));
    stepTime = Math.max(stepTime, minTimer);
    const startTime = new Date().getTime();
    const endTime = startTime + duration;
    let timer;

    function run() {
        const now = new Date().getTime();
        const remaining = Math.max((endTime - now) / duration, 0);
        const value = Math.round(end - (remaining * range));
        obj.innerHTML = value.toLocaleString();
        if (value == end) {
            clearInterval(timer);
        }
    }
    timer = setInterval(run, stepTime);
    run();
}

function triggerDocxUpload() {
    document.getElementById('docx-upload').click();
}

async function handleDocxUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    switchView('chats');
    const conversationView = document.getElementById('conversation-view');
    document.getElementById('welcome-view').classList.add('hidden');
    conversationView.classList.remove('hidden');

    const botId = "bot-docx-" + Date.now();
    conversationView.innerHTML += `
        <div class="flex justify-start items-start gap-4">
            <div class="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
                <i data-lucide="file-text" class="w-4 h-4 text-teal-500 animate-pulse"></i>
            </div>
            <div id="${botId}" class="bg-slate-800/50 border border-slate-700 text-slate-200 px-4 py-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm italic">
                Parsing Microsoft Word document and extracting intelligence...
            </div>
        </div>`;
    lucide.createIcons();

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/summarize-docx', {
            method: 'POST',
            headers: {'X-CSRFToken': getCsrfToken()},
            body: formData
        });
        const data = await response.json();
        
        // Re-use your consolidated renderBotResponse function
        if (window.renderBotResponse) {
            window.renderBotResponse(botId, data.response, true);
        } else {
            // Manual fallback if needed
            document.getElementById(botId).innerHTML = data.response.replace(/\n/g, '<br>');
            document.getElementById(botId).classList.remove('italic');
        }

    } catch (e) {
        document.getElementById(botId).innerText = "Word Doc processing failed.";
    }
}

function triggerPptxUpload() {
    document.getElementById('pptx-upload').click();
}

async function handlePptxUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    switchView('chats');
    const conversationView = document.getElementById('conversation-view');
    document.getElementById('welcome-view').classList.add('hidden');
    conversationView.classList.remove('hidden');

    const botId = "bot-pptx-" + Date.now();
    conversationView.innerHTML += `
        <div class="flex justify-start items-start gap-4">
            <div class="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
                <i data-lucide="presentation" class="w-4 h-4 text-teal-500 animate-pulse"></i>
            </div>
            <div id="${botId}" class="bg-slate-800/50 border border-slate-700 text-slate-200 px-4 py-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm italic">
                Analyzing slide deck and mapping project intelligence...
            </div>
        </div>`;
    lucide.createIcons();

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/summarize-pptx', {
            method: 'POST',
            headers: {'X-CSRFToken': getCsrfToken()},
            body: formData
        });
        const data = await response.json();
        
        // Re-use your consolidated renderBotResponse function
        if (window.renderBotResponse) {
            window.renderBotResponse(botId, data.response, true);
        } else {
            document.getElementById(botId).innerHTML = data.response.replace(/\n/g, '<br>');
            document.getElementById(botId).classList.remove('italic');
        }

    } catch (e) {
        document.getElementById(botId).innerText = "PowerPoint processing failed.";
    }
}

function triggerExcelUpload() {
    document.getElementById('excel-upload').click();
}

async function handleExcelUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    switchView('chats');
    const conversationView = document.getElementById('conversation-view');
    document.getElementById('welcome-view').classList.add('hidden');
    conversationView.classList.remove('hidden');

    const botId = "bot-excel-" + Date.now();
    conversationView.innerHTML += `
        <div class="flex justify-start items-start gap-4">
            <div class="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
                <i data-lucide="table-2" class="w-4 h-4 text-teal-500 animate-pulse"></i>
            </div>
            <div id="${botId}" class="bg-slate-800/50 border border-slate-700 text-slate-200 px-4 py-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm italic">
                Parsing Excel workbook and performing data architecture review...
            </div>
        </div>`;
    lucide.createIcons();

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/summarize-excel', {
            method: 'POST',
            headers: {'X-CSRFToken': getCsrfToken()},
            body: formData
        });
        const data = await response.json();
        
        if (window.renderBotResponse) {
            window.renderBotResponse(botId, data.response, true);
        } else {
            document.getElementById(botId).innerHTML = data.response.replace(/\n/g, '<br>');
            document.getElementById(botId).classList.remove('italic');
        }

    } catch (e) {
        document.getElementById(botId).innerText = "Excel processing failed.";
    }
}

window.toggleMobileMenu = function() {
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('menu-icon');
    
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        menu.classList.add('flex'); // Add flex to show
        icon.setAttribute('data-lucide', 'x');
    } else {
        menu.classList.remove('flex');
        menu.classList.add('hidden'); // Hide it
        icon.setAttribute('data-lucide', 'menu');
    }
    lucide.createIcons();
};

/* ATTACH TO WINDOW TO ENSURE GLOBAL ACCESS*/
window.downloadPDF = function(elementId) {
    const element = document.getElementById(elementId);
    
    // Find and hide the download button so it doesn't appear IN the PDF
    const btnContainer = element.querySelector('button[onclick*="downloadPDF"]').parentElement;
    if (btnContainer) btnContainer.style.display = 'none';

    // PDF Configuration
    const opt = {
        margin:       [0.5, 0.5],
        filename:     `SheetOps_Audit_${new Date().toISOString().slice(0,10)}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
            scale: 2, 
            backgroundColor: '#0f172a', // Your Navy Theme
            useCORS: true 
        },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Create a temporary clone for the PDF content
    const reportHeader = `
        <div style="font-family: sans-serif; color: #14b8a6; margin-bottom: 20px;">
            <h1 style="margin:0; font-size: 22px; text-transform: uppercase;">SheetOps AI | Audit Report</h1>
            <p style="color: #94a3b8; font-size: 10px;">Generated by Gemini 3 on ${new Date().toLocaleString()}</p>
            <hr style="border:0; border-top:1px solid #1e293b; margin-top:10px;">
        </div>
    `;

    const tempDiv = document.createElement('div');
    tempDiv.style.padding = '30px';
    tempDiv.style.background = '#0f172a';
    tempDiv.style.color = '#e2e8f0';
    tempDiv.innerHTML = reportHeader + element.innerHTML;

    // Generate PDF
    html2pdf().set(opt).from(tempDiv).save().then(() => {
        // Show button again in the UI
        if (btnContainer) btnContainer.style.display = 'block';
    });
};

// Create CHart
window.createChatChart = function(canvasId, chartData) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'doughnut', // Doughnut looks more modern than a standard pie
        data: {
            labels: chartData.labels,
            datasets: [{
                data: chartData.values,
                backgroundColor: chartData.colors,
                borderColor: '#0f172a', // Match your Navy background
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#94a3b8', font: { size: 10 } }
                }
            },
            cutout: '70%' // Makes it a sleek ring
        }
    });
};

window.confirmLogout = function() {
    const modal = document.getElementById('logout-modal');
    modal.classList.remove('hidden');
    // Ensure we see the confirmation view first
    document.getElementById('logout-confirm-view').classList.remove('hidden');
    document.getElementById('logout-thanks-view').classList.add('hidden');
    lucide.createIcons();
};

window.closeLogoutModal = function() {
    document.getElementById('logout-modal').classList.add('hidden');
};

window.processLogout = function() {
    // 1. Hide confirmation, show thank you
    document.getElementById('logout-confirm-view').classList.add('hidden');
    document.getElementById('logout-thanks-view').classList.remove('hidden');
    
    // 2. Wait 2.5 seconds for the "Thank You" animation
    setTimeout(() => {
        // 3. Final redirect to the server logout route
        window.location.href = '/logout';
    }, 2500);
};

// ATTACH TO WINDOW FOR GLOBAL ACCESS
window.logFeedback = async function(botId, type) {
    // 1. Visual Feedback: Replace the buttons with a thank you message
    const botElement = document.getElementById(botId);
    const feedbackContainer = botElement.querySelector('.feedback-buttons');
    
    if (feedbackContainer) {
        feedbackContainer.innerHTML = `<span class="text-[9px] text-teal-500 italic animate-pulse">Thank you for your feedback!</span>`;
    }

    // 2. Log to Server (Neon DB + Google Sheets)
    try {
        await fetch('/log-feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' ,'X-CSRFToken': getCsrfToken()},
            body: JSON.stringify({ 
                response_id: botId, 
                feedback_type: type 
            })
        });
    } catch (e) {
        console.error("Feedback logging failed", e);
    }
};

// GLOBAL TOAST FUNCTION
window.showToast = function(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    const borderColor = type === 'error' ? 'border-red-500' : 'border-teal-500';
    const icon = type === 'error' ? 'alert-circle' : 'check-circle';
    const iconColor = type === 'error' ? 'text-red-500' : 'text-teal-500';

    toast.className = `toast-item bg-slate-900 border-l-4 ${borderColor} p-4 shadow-2xl backdrop-blur-md flex items-center gap-3 animate-slide-in`;
    toast.innerHTML = `
        <i data-lucide="${icon}" class="w-5 h-5 ${iconColor}"></i>
        <span class="text-xs font-bold uppercase tracking-widest text-white">${message}</span>
    `;

    container.appendChild(toast);
    lucide.createIcons();

    // Auto-remove after 4 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }, 4000);
};

// AUTO-HIDE EXISTING FLASH MESSAGES
/*window.addEventListener('load', () => {
    const flashes = document.querySelectorAll('.toast-item');
    flashes.forEach(f => {
        setTimeout(() => {
            f.style.opacity = '0';
            f.style.transition = 'opacity 0.5s ease';
            setTimeout(() => f.remove(), 500);
        }, 4000);
    });
});*/

async function sendMessage() {
    const input = document.getElementById('user-input');
    const msg = input.value;
    if (!msg) return;

    // 1. SANITIZE SESSION ID
    let sid = currentSessionId;
    if (sid === "null" || !sid) sid = null;

    // 2. UI TRANSITION
    document.getElementById('welcome-view').classList.add('hidden');
    document.getElementById('conversation-view').classList.remove('hidden');
    const conversationView = document.getElementById('conversation-view');

    // 3. DISPLAY USER MESSAGE
    conversationView.innerHTML += `
        <div class="flex justify-end items-start gap-4 mb-4">
            <div class="bg-teal-600/20 border border-teal-500/30 text-teal-100 px-4 py-3 rounded-2xl rounded-tr-none max-w-[80%] text-sm">
                ${msg}
            </div>
        </div>`;
    
    input.value = "";
    conversationView.parentElement.scrollTop = conversationView.parentElement.scrollHeight;

    // 4. DISPLAY BOT PLACEHOLDER (With Dynamic Progress Logic)
    const botId = "bot-" + Date.now();
    const isAnnouncementReq = /announcement|community|what's new/i.test(msg);

    conversationView.innerHTML += `
        <div class="flex justify-start items-start gap-4 mb-4">
            <div class="w-8 h-8 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center">
                <i data-lucide="bot" class="w-4 h-4 text-teal-400"></i>
            </div>
            <div id="${botId}" class="bg-slate-800/50 border border-slate-700 text-slate-200 px-4 py-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm leading-relaxed">
                <div class="flex items-center gap-3">
                    <div class="w-4 h-4 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin"></div>
                    <span id="text-${botId}">${isAnnouncementReq ? 'Contacting Community...' : 'Thinking...'}</span>
                </div>
            </div>
        </div>`;
    lucide.createIcons();

    // Small interval to update progress text if it's a scrape request
    if (isAnnouncementReq) {
        setTimeout(() => {
            const el = document.getElementById(`text-${botId}`);
            if (el) el.innerText = "Scraping live data...";
        }, 1500);
    }

    try {
        // 5. CALL BACKEND
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' ,'X-CSRFToken': getCsrfToken() },
            body: JSON.stringify({ message: msg, history: chatHistory, session_id: sid })
        });

        const data = await response.json();
        currentSessionId = data.session_id;

        let finalBotHTML = "";

        // --- NEW: BRANCH FOR COMMUNITY ANNOUNCEMENTS ---
        if (data.type === "announcements") {
            let cardsHTML = `<p class="mb-4 text-teal-400 font-semibold">${data.response}</p>
                             <div class="grid grid-cols-1 gap-3">`;

            data.data.forEach(item => {
                cardsHTML += `
                    <a href="${item.link}" target="_blank" class="block p-4 bg-slate-900/60 border border-slate-700 hover:border-teal-500/50 rounded-xl transition-all group">
                        <div class="flex justify-between items-center">
                            <span class="text-xs font-medium text-slate-200 group-hover:text-teal-400 transition-colors">${item.title}</span>
                            <i data-lucide="external-link" class="w-3 h-3 text-slate-500 group-hover:text-teal-400"></i>
                        </div>
                    </a>`;
            });
            cardsHTML += `</div>`;
            finalBotHTML = cardsHTML;

        } else if (data.type === "events") {
            let eventHTML = `<p class="mb-4 text-teal-400 font-semibold">${data.response}</p>
                             <div class="grid grid-cols-1 gap-4">`;

            data.data.forEach(item => {
                eventHTML += `
                    <div class="p-4 bg-slate-900/60 border border-slate-700 rounded-2xl relative overflow-hidden group">
                        <div class="flex flex-col gap-2">
                            <div class="flex justify-between items-start">
                                <span class="px-2 py-0.5 bg-teal-500/20 text-teal-400 text-[10px] font-bold uppercase rounded-md border border-teal-500/30">
                                    ${item.format}
                                </span>
                                <span class="text-[10px] text-slate-500 font-medium">${item.location}</span>
                            </div>
                            <h4 class="text-sm font-bold text-slate-100 mt-1">${item.title}</h4>
                            <div class="flex items-center gap-2 text-xs text-slate-400">
                                <i data-lucide="calendar" class="w-3 h-3"></i>
                                <span>${item.date}</span>
                            </div>
                            <a href="${item.link}" target="_blank" class="mt-3 w-full py-2 bg-teal-500 text-[#0f172a] text-center text-xs font-bold rounded-xl hover:bg-teal-400 transition-colors">
                                Register Now
                            </a>
                        </div>
                    </div>`;
            });
            eventHTML += `</div>`;
            finalBotHTML = eventHTML;
        } else if (data.type === "product_news") {
            let prodHTML = `<p class="mb-4 text-teal-400 font-semibold">${data.response}</p>
                            <div class="grid grid-cols-1 gap-3">`;

            data.data.forEach(item => {
                prodHTML += `
                    <a href="${item.link}" target="_blank" class="block p-4 bg-slate-900/60 border border-slate-700 hover:border-blue-500/50 rounded-xl transition-all group">
                        <div class="flex justify-between items-center mb-1">
                            <span class="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[8px] font-bold uppercase rounded border border-blue-500/30">
                                Feature Release
                            </span>
                            <i data-lucide="zap" class="w-3 h-3 text-blue-400"></i>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-xs font-medium text-slate-200 group-hover:text-blue-400 transition-colors">${item.title}</span>
                            <i data-lucide="external-link" class="w-3 h-3 text-slate-500 group-hover:text-blue-400"></i>
                        </div>
                    </a>`;
            });
            prodHTML += `</div>`;
            finalBotHTML = prodHTML;
        }else if (data.type === "pmo_trends") {
            let pmoHTML = `<p class="mb-4 text-indigo-400 font-semibold">${data.response}</p>
                           <div class="grid grid-cols-1 gap-3">`;

            data.data.forEach(item => {
                pmoHTML += `
                    <a href="${item.link}" target="_blank" class="block p-4 bg-slate-900/60 border border-slate-700 hover:border-indigo-500/50 rounded-xl transition-all group">
                        <div class="flex justify-between items-center mb-1">
                            <span class="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[8px] font-bold uppercase rounded border border-indigo-500/30">
                                PMO Strategy
                            </span>
                            <i data-lucide="trending-up" class="w-3 h-3 text-indigo-400"></i>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-xs font-medium text-slate-200 group-hover:text-indigo-400 transition-colors">${item.title}</span>
                            <i data-lucide="external-link" class="w-3 h-3 text-slate-500 group-hover:text-indigo-400"></i>
                        </div>
                    </a>`;
            });
            pmoHTML += `</div>`;
            finalBotHTML = pmoHTML;
        } else if (data.type === "healthcare_trends") {
            let hcHTML = `<p class="mb-4 text-emerald-400 font-semibold">${data.response}</p>
                          <div class="grid grid-cols-1 gap-3">`;

            data.data.forEach(item => {
                hcHTML += `
                    <a href="${item.link}" target="_blank" class="block p-4 bg-slate-900/60 border border-slate-700 hover:border-emerald-500/50 rounded-xl transition-all group">
                        <div class="flex justify-between items-center mb-1">
                            <span class="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[8px] font-bold uppercase rounded border border-emerald-500/30">
                                Healthcare & Life Sciences
                            </span>
                            <i data-lucide="heart-pulse" class="w-3 h-3 text-emerald-400"></i>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-xs font-medium text-slate-200 group-hover:text-emerald-400 transition-colors">${item.title}</span>
                            <i data-lucide="external-link" class="w-3 h-3 text-slate-500 group-hover:text-emerald-400"></i>
                        </div>
                    </a>`;
            });
            hcHTML += `</div>`;
            finalBotHTML = hcHTML;
        } else if (data.type === "finance_trends") {
            let finHTML = `<p class="mb-4 text-amber-400 font-semibold">${data.response}</p>
                          <div class="grid grid-cols-1 gap-3">`;

            data.data.forEach(item => {
                finHTML += `
                    <a href="${item.link}" target="_blank" class="block p-4 bg-slate-900/60 border border-slate-700 hover:border-amber-500/50 rounded-xl transition-all group">
                        <div class="flex justify-between items-center mb-1">
                            <span class="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[8px] font-bold uppercase rounded border border-amber-500/30">
                                Financial Services
                            </span>
                            <i data-lucide="landmark" class="w-3 h-3 text-amber-400"></i>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-xs font-medium text-slate-200 group-hover:text-amber-400 transition-colors">${item.title}</span>
                            <i data-lucide="external-link" class="w-3 h-3 text-slate-500 group-hover:text-amber-400"></i>
                        </div>
                    </a>`;
            });
            finHTML += `</div>`;
            finalBotHTML = finHTML;
        }else if (data.type === "it_trends") {
            let itHTML = `<p class="mb-4 text-violet-400 font-semibold">${data.response}</p>
                          <div class="grid grid-cols-1 gap-3">`;

            data.data.forEach(item => {
                itHTML += `
                    <a href="${item.link}" target="_blank" class="block p-4 bg-slate-900/60 border border-slate-700 hover:border-violet-500/50 rounded-xl transition-all group">
                        <div class="flex justify-between items-center mb-1">
                            <span class="px-2 py-0.5 bg-violet-500/20 text-violet-400 text-[8px] font-bold uppercase rounded border border-violet-500/30">
                                Digital IT Portfolio
                            </span>
                            <i data-lucide="cpu" class="w-3 h-3 text-violet-400"></i>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-xs font-medium text-slate-200 group-hover:text-violet-400 transition-colors">${item.title}</span>
                            <i data-lucide="external-link" class="w-3 h-3 text-slate-500 group-hover:text-violet-400"></i>
                        </div>
                    </a>`;
            });
            itHTML += `</div>`;
            finalBotHTML = itHTML;
        }else if (data.type === "best_practices") {
            let bpHTML = `<p class="mb-4 text-sky-400 font-semibold">${data.response}</p>
                          <div class="grid grid-cols-1 gap-3">`;

            data.data.forEach(item => {
                bpHTML += `
                    <a href="${item.link}" target="_blank" class="block p-4 bg-slate-900/60 border border-slate-700 hover:border-sky-500/50 rounded-xl transition-all group">
                        <div class="flex justify-between items-center mb-1">
                            <span class="px-2 py-0.5 bg-sky-500/20 text-sky-400 text-[8px] font-bold uppercase rounded border border-sky-500/30">
                                Expert Standards
                            </span>
                            <i data-lucide="sparkles" class="w-3 h-3 text-sky-400"></i>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-xs font-medium text-slate-200 group-hover:text-sky-400 transition-colors">${item.title}</span>
                            <i data-lucide="external-link" class="w-3 h-3 text-slate-500 group-hover:text-sky-400"></i>
                        </div>
                    </a>`;
            });
            bpHTML += `</div>`;
            finalBotHTML = bpHTML;
        }else if (data.type === "b2b_trends") {
            let b2bHTML = `<p class="mb-4 text-rose-400 font-semibold">${data.response}</p>
                          <div class="grid grid-cols-1 gap-3">`;

            data.data.forEach(item => {
                b2bHTML += `
                    <a href="${item.link}" target="_blank" class="block p-4 bg-slate-900/60 border border-slate-700 hover:border-rose-500/50 rounded-xl transition-all group">
                        <div class="flex justify-between items-center mb-1">
                            <span class="px-2 py-0.5 bg-rose-500/20 text-rose-400 text-[8px] font-bold uppercase rounded border border-rose-500/30">
                                B2B Operations
                            </span>
                            <i data-lucide="briefcase" class="w-3 h-3 text-rose-400"></i>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-xs font-medium text-slate-200 group-hover:text-rose-400 transition-colors">${item.title}</span>
                            <i data-lucide="external-link" class="w-3 h-3 text-slate-500 group-hover:text-rose-400"></i>
                        </div>
                    </a>`;
            });
            b2bHTML += `</div>`;
            finalBotHTML = b2bHTML;
        }else {
            // --- STANDARD BOT LOGIC (CHARTS & OPTIONS) ---
            let responseText = data.response;
            let chartHTML = "";
            let optionsHTML = "";

            // --- STEP 6: PARSE CHART DATA ---
            const chartMatch = responseText.match(/\[CHART_DATA:\s*({[\s\S]*?})\s*\]/);
            if (chartMatch) {
                try {
                    const chartData = JSON.parse(chartMatch[1]);
                    const canvasId = "canvas-" + botId;
                    responseText = responseText.replace(chartMatch[0], "").trim();

                    let metricsHTML = `<div class="grid grid-cols-2 gap-2 mb-4">`;
                    chartData.labels.forEach((label, index) => {
                        const value = chartData.values[index];
                        const color = chartData.colors[index];
                        metricsHTML += `
                            <div class="bg-slate-900/40 border-l-4 p-2 rounded-r-xl flex flex-col justify-center" style="border-color: ${color}">
                                <span class="text-[8px] text-slate-500 uppercase font-bold tracking-tighter truncate">${label}</span>
                                <span class="text-lg font-black text-white leading-none">${value}</span>
                            </div>`;
                    });
                    metricsHTML += `</div>`;

                    chartHTML = `<div class="mt-4 mb-2 p-4 bg-black/40 rounded-2xl border border-teal-500/20 shadow-xl">
                                    <p class="text-[9px] font-bold text-teal-500 uppercase tracking-[0.2em] mb-4 text-center">Sheet Health Scorecard</p>
                                    ${metricsHTML}
                                    <div style="height: 160px; position: relative;"><canvas id="${canvasId}"></canvas></div>
                                 </div>`;

                    setTimeout(() => { if (window.createChatChart) window.createChatChart(canvasId, chartData); }, 300);
                } catch (e) { console.error("Chart Error:", e); }
            }

            // --- STEP 7: PARSE OPTIONS ---
            if (data.options && data.options.length > 0) {
                optionsHTML = `<div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">`;
                data.options.forEach(opt => {
                    optionsHTML += `
                        <button onclick="window.selectOption('${opt}')" class="px-3 py-2 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-400 text-[10px] font-bold uppercase hover:bg-teal-500 hover:text-[#0f172a] transition-all text-left flex justify-between items-center group">
                            ${opt} <i data-lucide="chevron-right" class="w-3 h-3 opacity-0 group-hover:opacity-100 transition"></i>
                        </button>`;
                });
                optionsHTML += `</div>`;
            }

            const formattedText = responseText.replace(/\n/g, '<br>');
            finalBotHTML = `
                <div class="space-y-4">
                    <div class="bot-text-content leading-relaxed">${formattedText}</div>
                    ${chartHTML}
                    ${optionsHTML}
                </div>`;
        }

        // 9. INJECT FINAL CONTENT AND FEEDBACK BUTTONS
        const feedbackHTML = `
            <div class="feedback-buttons flex items-center gap-4 pt-4 mt-4 border-t border-slate-700/30">
                <span class="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Helpful?</span>
                <button onclick="logFeedback('${botId}', 'helpful')" class="text-slate-500 hover:text-teal-400 transition group"><i data-lucide="thumbs-up" class="w-3 h-3"></i></button>
                <button onclick="logFeedback('${botId}', 'not-helpful')" class="text-slate-500 hover:text-red-400 transition group"><i data-lucide="thumbs-down" class="w-3 h-3"></i></button>
            </div>`;

        document.getElementById(botId).innerHTML = finalBotHTML + feedbackHTML;
        lucide.createIcons();

        // 10. HISTORY & SIDEBAR UPDATES
        if (data.new_history_entry) {
            chatHistory.push(data.new_history_entry[0]);
            chatHistory.push(data.new_history_entry[1]);
        }

        if (window.loadSidebarSessions) window.loadSidebarSessions();
        conversationView.parentElement.scrollTop = conversationView.parentElement.scrollHeight;

    } catch (e) {
        console.error("Chat Error:", e);
        document.getElementById(botId).innerText = "System error connecting to SheetOps AI.";
    }
}

// Ensure this helper is defined globally for your dropdown buttons
window.selectOption = function(val) {
    document.getElementById('user-input').value = val;
    sendMessage();
};

function triggerCSVUpload() {
    document.getElementById('csv-upload').click();
}

async function handleCSVUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // 1. Switch to Chat View and show loading
    switchView('chats');
    const conversationView = document.getElementById('conversation-view');
    document.getElementById('welcome-view').classList.add('hidden');
    conversationView.classList.remove('hidden');

    const botId = "bot-audit-" + Date.now();
    conversationView.innerHTML += `
        <div class="flex justify-start items-start gap-4">
            <div class="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
                <i data-lucide="loader" class="w-4 h-4 text-teal-500 animate-spin"></i>
            </div>
            <div id="${botId}" class="bg-slate-800/50 border border-slate-700 text-slate-200 px-4 py-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm">
                Analyzing User Export CSV... Please wait.
            </div>
        </div>
    `;
    lucide.createIcons();

    // 2. Prepare Form Data
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/user-audit', {
            method: 'POST',
            headers: {'X-CSRFToken': getCsrfToken()},
            body: formData // No headers needed, browser sets Multipart
        });

        const data = await response.json();                                                                 /* Add export button */
        const botHTML = `
            <div class="space-y-4">
                <div>${data.response.replace(/\n/g, '<br>')}</div>
                
                <!-- Feedback Buttons Container -->
                <div class="feedback-buttons flex items-center gap-4 pt-2 border-t border-slate-700/30">
                    <span class="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Was this helpful?</span>
                    <button onclick="logFeedback('${botId}', 'helpful')" class="text-slate-500 hover:text-teal-400 transition group">
                        <i data-lucide="thumbs-up" class="w-3 h-3"></i>
                    </button>
                    <button onclick="logFeedback('${botId}', 'not-helpful')" class="text-slate-500 hover:text-red-400 transition group">
                        <i data-lucide="thumbs-down" class="w-3 h-3"></i>
                    </button>
                </div>
            </div>
        `;
        const formattedText = data.response.replace(/\n/g, '<br>');

        // 2. Create the Export Button HTML
        const exportBtn = `
            <div class="mt-6 pt-4 border-t border-slate-700/50">
                <button onclick="downloadPDF('${botId}')" class="flex items-center gap-2 text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/20 px-4 py-2 rounded-xl hover:bg-teal-500 hover:text-[#0f172a] transition-all duration-300 uppercase font-bold tracking-widest group">
                    <i data-lucide="file-down" class="w-4 h-4 group-hover:scale-110 transition"></i>
                    Download Audit Report (PDF)
                </button>
            </div>
        `;
        
       // 3. Inject into the bot bubble
        document.getElementById(botId).innerHTML = formattedText + botHTML + exportBtn
        
        // Push to history for context
        chatHistory.push({ role: "user", parts: [{ text: "Uploaded User CSV for Audit" }] });
        chatHistory.push({ role: "model", parts: [{ text: data.response }] });

    } catch (error) {
        document.getElementById(botId).innerText = "Failed to analyze CSV. Ensure it is a valid Smartsheet User Export.";
    }
}

function triggerSeatUpload() {
    document.getElementById('seat-upload').click();
}

// Handler for the Seat Audit file
async function handleSeatUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Switch to chat view
    switchView('chats');
    const conversationView = document.getElementById('conversation-view');
    document.getElementById('welcome-view').classList.add('hidden');
    conversationView.classList.remove('hidden');

    const botId = "bot-seat-" + Date.now();
    conversationView.innerHTML += `
        <div class="flex justify-start items-start gap-4">
            <div class="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
                <i data-lucide="trending-down" class="w-4 h-4 text-teal-500 animate-pulse"></i>
            </div>
            <div id="${botId}" class="bg-slate-800/50 border border-slate-700 text-slate-200 px-4 py-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm italic">
                Analyzing license utilization and potential cost savings...
            </div>
        </div>
    `;
    lucide.createIcons();

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/seat-audit', {
            method: 'POST',
            headers: {'X-CSRFToken': getCsrfToken()},
            body: formData
        });
        const data = await response.json();                                                                 /* Add export button */
        const botHTML = `
            <div class="space-y-4">
                <div>${data.response.replace(/\n/g, '<br>')}</div>
                
                <!-- Feedback Buttons Container -->
                <div class="feedback-buttons flex items-center gap-4 pt-2 border-t border-slate-700/30">
                    <span class="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Was this helpful?</span>
                    <button onclick="logFeedback('${botId}', 'helpful')" class="text-slate-500 hover:text-teal-400 transition group">
                        <i data-lucide="thumbs-up" class="w-3 h-3"></i>
                    </button>
                    <button onclick="logFeedback('${botId}', 'not-helpful')" class="text-slate-500 hover:text-red-400 transition group">
                        <i data-lucide="thumbs-down" class="w-3 h-3"></i>
                    </button>
                </div>
            </div>
        `;
        const formattedText = data.response.replace(/\n/g, '<br>');

        // 2. Create the Export Button HTML
        const exportBtn = `
            <div class="mt-6 pt-4 border-t border-slate-700/50">
                <button onclick="downloadPDF('${botId}')" class="flex items-center gap-2 text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/20 px-4 py-2 rounded-xl hover:bg-teal-500 hover:text-[#0f172a] transition-all duration-300 uppercase font-bold tracking-widest group">
                    <i data-lucide="file-down" class="w-4 h-4 group-hover:scale-110 transition"></i>
                    Download Audit Report (PDF)
                </button>
            </div>
        `;
        
       // 3. Inject into the bot bubble
        document.getElementById(botId).innerHTML = formattedText + botHTML + exportBtn
        
        document.getElementById(botId).classList.remove('italic');

    } catch (e) {
        document.getElementById(botId).innerText = "Seat Audit failed. Please try again.";
    }
}

function triggerAttachmentUpload() {
    document.getElementById('attachment-upload').click();
}

async function handleAttachmentUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // 1. UI Transition: Switch to chat and hide welcome
    switchView('chats');
    const conversationView = document.getElementById('conversation-view');
    document.getElementById('welcome-view').classList.add('hidden');
    conversationView.classList.remove('hidden');

    // 2. Create loading bubble
    const botId = "bot-att-" + Date.now();
    conversationView.innerHTML += `
        <div class="flex justify-start items-start gap-4">
            <div class="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
                <i data-lucide="paperclip" class="w-4 h-4 text-teal-500 animate-bounce"></i>
            </div>
            <div id="${botId}" class="bg-slate-800/50 border border-slate-700 text-slate-200 px-4 py-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm italic">
                Analyzing attachment inventory for security risks and storage bloat...
            </div>
        </div>`;
    lucide.createIcons();

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/attachment-audit', { method: 'POST', headers: {'X-CSRFToken': getCsrfToken()}, body: formData });
        const data = await response.json();
        
        const formattedText = data.response.replace(/\n/g, '<br>');

        // 3. Define Feedback Buttons
        const feedbackHTML = `
            <div class="feedback-buttons flex items-center gap-4 mt-4 pt-3 border-t border-slate-700/30">
                <span class="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Was this helpful?</span>
                <button onclick="logFeedback('${botId}', 'helpful')" class="text-slate-500 hover:text-teal-400 transition">
                    <i data-lucide="thumbs-up"></i>
                </button>
                <button onclick="logFeedback('${botId}', 'not-helpful')" class="text-slate-500 hover:text-red-400 transition">
                    <i data-lucide="thumbs-down"></i>
                </button>
            </div>
        `;

        // 4. Define PDF Export Button
        const exportBtn = `
            <div class="mt-3">
                <button onclick="downloadPDF('${botId}')" class="flex items-center gap-2 text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/20 px-3 py-1.5 rounded-lg hover:bg-teal-500 hover:text-[#0f172a] transition-all uppercase font-bold tracking-widest group">
                    <i data-lucide="file-down" class="w-3 h-3 group-hover:scale-110 transition"></i>
                    Download Attachment Audit (PDF)
                </button>
            </div>
        `;

        // 5. Inject everything at once to prevent overwriting
        const botElement = document.getElementById(botId);
        botElement.innerHTML = `<div class="space-y-2">${formattedText}</div>` + feedbackHTML + exportBtn;
        botElement.classList.remove('italic');

        // 6. Refresh Icons and Scroll
        lucide.createIcons();
        conversationView.parentElement.scrollTop = conversationView.parentElement.scrollHeight;

    } catch (e) {
        document.getElementById(botId).innerText = "Attachment Audit failed. Please check the file format.";
    }
}

function triggerHygieneUpload() {
    document.getElementById('hygiene-upload').click();
}

async function handleHygieneUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    switchView('chats');
    const conversationView = document.getElementById('conversation-view');
    document.getElementById('welcome-view').classList.add('hidden');
    conversationView.classList.remove('hidden');

    const botId = "bot-hygiene-" + Date.now();
    conversationView.innerHTML += `
        <div class="flex justify-start items-start gap-4">
            <div class="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
                <i data-lucide="trash-2" class="w-4 h-4 text-teal-500 animate-bounce"></i>
            </div>
            <div id="${botId}" class="bg-slate-800/50 border border-slate-700 text-slate-200 px-4 py-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm italic">
                Scanning for abandoned assets and sheet sprawl...
            </div>
        </div>
    `;
    lucide.createIcons();

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/hygiene-audit', {
            method: 'POST',
            headers: {'X-CSRFToken': getCsrfToken()},
            body: formData
        });
        const data = await response.json();                                                                 /* Add export button */
        const botHTML = `
            <div class="space-y-4">
                <div>${data.response.replace(/\n/g, '<br>')}</div>
                
                <!-- Feedback Buttons Container -->
                <div class="feedback-buttons flex items-center gap-4 pt-2 border-t border-slate-700/30">
                    <span class="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Was this helpful?</span>
                    <button onclick="logFeedback('${botId}', 'helpful')" class="text-slate-500 hover:text-teal-400 transition group">
                        <i data-lucide="thumbs-up" class="w-3 h-3"></i>
                    </button>
                    <button onclick="logFeedback('${botId}', 'not-helpful')" class="text-slate-500 hover:text-red-400 transition group">
                        <i data-lucide="thumbs-down" class="w-3 h-3"></i>
                    </button>
                </div>
            </div>
        `;
        const formattedText = data.response.replace(/\n/g, '<br>');

        // 2. Create the Export Button HTML
        const exportBtn = `
            <div class="mt-6 pt-4 border-t border-slate-700/50">
                <button onclick="downloadPDF('${botId}')" class="flex items-center gap-2 text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/20 px-4 py-2 rounded-xl hover:bg-teal-500 hover:text-[#0f172a] transition-all duration-300 uppercase font-bold tracking-widest group">
                    <i data-lucide="file-down" class="w-4 h-4 group-hover:scale-110 transition"></i>
                    Download Audit Report (PDF)
                </button>
            </div>
        `;
        
       // 3. Inject into the bot bubble
        document.getElementById(botId).innerHTML = formattedText + botHTML + exportBtn
        document.getElementById(botId).classList.remove('italic');
    } catch (e) {
        document.getElementById(botId).innerText = "Hygiene Audit failed.";
    }
}

function triggerReportUpload() {
    document.getElementById('report-upload').click();
}

async function handleReportUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    switchView('chats');
    const conversationView = document.getElementById('conversation-view');
    document.getElementById('welcome-view').classList.add('hidden');
    conversationView.classList.remove('hidden');

    const botId = "bot-report-" + Date.now();
    conversationView.innerHTML += `
        <div class="flex justify-start items-start gap-4">
            <div class="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
                <i data-lucide="file-text" class="w-4 h-4 text-teal-500 animate-pulse"></i>
            </div>
            <div id="${botId}" class="bg-slate-800/50 border border-slate-700 text-slate-200 px-4 py-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm italic">
                Analyzing report inventory for sprawl and stale assets...
            </div>
        </div>
    `;
    lucide.createIcons();

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/report-audit', {
            method: 'POST',
            headers: {'X-CSRFToken': getCsrfToken()},
            body: formData
        });
        const data = await response.json();                                                                 /* Add export button */
        const botHTML = `
            <div class="space-y-4">
                <div>${data.response.replace(/\n/g, '<br>')}</div>
                
                <!-- Feedback Buttons Container -->
                <div class="feedback-buttons flex items-center gap-4 pt-2 border-t border-slate-700/30">
                    <span class="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Was this helpful?</span>
                    <button onclick="logFeedback('${botId}', 'helpful')" class="text-slate-500 hover:text-teal-400 transition group">
                        <i data-lucide="thumbs-up" class="w-3 h-3"></i>
                    </button>
                    <button onclick="logFeedback('${botId}', 'not-helpful')" class="text-slate-500 hover:text-red-400 transition group">
                        <i data-lucide="thumbs-down" class="w-3 h-3"></i>
                    </button>
                </div>
            </div>
        `;
        const formattedText = data.response.replace(/\n/g, '<br>');

        // 2. Create the Export Button HTML
        const exportBtn = `
            <div class="mt-6 pt-4 border-t border-slate-700/50">
                <button onclick="downloadPDF('${botId}')" class="flex items-center gap-2 text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/20 px-4 py-2 rounded-xl hover:bg-teal-500 hover:text-[#0f172a] transition-all duration-300 uppercase font-bold tracking-widest group">
                    <i data-lucide="file-down" class="w-4 h-4 group-hover:scale-110 transition"></i>
                    Download Audit Report (PDF)
                </button>
            </div>
        `;
        
       // 3. Inject into the bot bubble
        document.getElementById(botId).innerHTML = formattedText + botHTML +exportBtn
        document.getElementById(botId).classList.remove('italic');
    } catch (e) {
        document.getElementById(botId).innerText = "Report Audit failed.";
    }
}

function triggerDashboardUpload() {
    document.getElementById('dashboard-upload').click();
}

async function handleDashboardUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    switchView('chats');
    const conversationView = document.getElementById('conversation-view');
    document.getElementById('welcome-view').classList.add('hidden');
    conversationView.classList.remove('hidden');

    const botId = "bot-dash-" + Date.now();
    conversationView.innerHTML += `
        <div class="flex justify-start items-start gap-4">
            <div class="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
                <i data-lucide="layout" class="w-4 h-4 text-teal-500 animate-pulse"></i>
            </div>
            <div id="${botId}" class="bg-slate-800/50 border border-slate-700 text-slate-200 px-4 py-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm italic">
                Scanning executive dashboard inventory for stale reporting...
            </div>
        </div>
    `;
    lucide.createIcons();

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/dashboard-audit', {
            method: 'POST',
            headers: {'X-CSRFToken': getCsrfToken()},
            body: formData
        });
        const data = await response.json();                                                                 /* Add export button */
        const botHTML = `
            <div class="space-y-4">
                <div>${data.response.replace(/\n/g, '<br>')}</div>
                
                <!-- Feedback Buttons Container -->
                <div class="feedback-buttons flex items-center gap-4 pt-2 border-t border-slate-700/30">
                    <span class="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Was this helpful?</span>
                    <button onclick="logFeedback('${botId}', 'helpful')" class="text-slate-500 hover:text-teal-400 transition group">
                        <i data-lucide="thumbs-up" class="w-3 h-3"></i>
                    </button>
                    <button onclick="logFeedback('${botId}', 'not-helpful')" class="text-slate-500 hover:text-red-400 transition group">
                        <i data-lucide="thumbs-down" class="w-3 h-3"></i>
                    </button>
                </div>
            </div>
        `;
        const formattedText = data.response.replace(/\n/g, '<br>');

        // 2. Create the Export Button HTML
        const exportBtn = `
            <div class="mt-6 pt-4 border-t border-slate-700/50">
                <button onclick="downloadPDF('${botId}')" class="flex items-center gap-2 text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/20 px-4 py-2 rounded-xl hover:bg-teal-500 hover:text-[#0f172a] transition-all duration-300 uppercase font-bold tracking-widest group">
                    <i data-lucide="file-down" class="w-4 h-4 group-hover:scale-110 transition"></i>
                    Download Audit Report (PDF)
                </button>
            </div>
        `;
        
       // 3. Inject into the bot bubble
        document.getElementById(botId).innerHTML = formattedText + botHTML + exportBtn
        document.getElementById(botId).classList.remove('italic');
    } catch (e) {
        document.getElementById(botId).innerText = "Dashboard Audit failed.";
    }
}

function triggerWebhookUpload() {
    document.getElementById('webhook-upload').click();
}

async function handleWebhookUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    switchView('chats');
    const conversationView = document.getElementById('conversation-view');
    document.getElementById('welcome-view').classList.add('hidden');
    conversationView.classList.remove('hidden');

    const botId = "bot-webhook-" + Date.now();
    conversationView.innerHTML += `
        <div class="flex justify-start items-start gap-4">
            <div class="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
                <i data-lucide="webhook" class="text-teal-500 w-4 h-4 animate-spin"></i>
            </div>
            <div id="${botId}" class="bg-slate-800/50 border border-slate-700 text-slate-200 px-4 py-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm italic">
                Auditing webhook security and integration status...
            </div>
        </div>
    `;
    lucide.createIcons();

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/webhook-audit', {
            method: 'POST',
            headers: {'X-CSRFToken': getCsrfToken()},
            body: formData
        });
        const data = await response.json();                                                                 /* Add export button */
        const botHTML = `
            <div class="space-y-4">
                <div>${data.response.replace(/\n/g, '<br>')}</div>
                
                <!-- Feedback Buttons Container -->
                <div class="feedback-buttons flex items-center gap-4 pt-2 border-t border-slate-700/30">
                    <span class="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Was this helpful?</span>
                    <button onclick="logFeedback('${botId}', 'helpful')" class="text-slate-500 hover:text-teal-400 transition group">
                        <i data-lucide="thumbs-up" class="w-3 h-3"></i>
                    </button>
                    <button onclick="logFeedback('${botId}', 'not-helpful')" class="text-slate-500 hover:text-red-400 transition group">
                        <i data-lucide="thumbs-down" class="w-3 h-3"></i>
                    </button>
                </div>
            </div>
        `;
        const formattedText = data.response.replace(/\n/g, '<br>');

        // 2. Create the Export Button HTML
        const exportBtn = `
            <div class="mt-6 pt-4 border-t border-slate-700/50">
                <button onclick="downloadPDF('${botId}')" class="flex items-center gap-2 text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/20 px-4 py-2 rounded-xl hover:bg-teal-500 hover:text-[#0f172a] transition-all duration-300 uppercase font-bold tracking-widest group">
                    <i data-lucide="file-down" class="w-4 h-4 group-hover:scale-110 transition"></i>
                    Download Audit Report (PDF)
                </button>
            </div>
        `;
        
       // 3. Inject into the bot bubble
        document.getElementById(botId).innerHTML = formattedText + botHTML + exportBtn
        document.getElementById(botId).classList.remove('italic');
    } catch (e) {
        document.getElementById(botId).innerText = "Webhook Audit failed.";
    }
}

function triggerWorkspaceUpload() {
    document.getElementById('workspace-upload').click();
}

async function handleWorkspaceUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    switchView('chats');
    const conversationView = document.getElementById('conversation-view');
    document.getElementById('welcome-view').classList.add('hidden');
    conversationView.classList.remove('hidden');

    const botId = "bot-ws-" + Date.now();
    conversationView.innerHTML += `
        <div class="flex justify-start items-start gap-4">
            <div class="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
                <i data-lucide="folder-kanban" class="w-4 h-4 text-teal-500 animate-bounce"></i>
            </div>
            <div id="${botId}" class="bg-slate-800/50 border border-slate-700 text-slate-200 px-4 py-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm italic">
                Auditing workspace governance and ownership distribution...
            </div>
        </div>
    `;
    lucide.createIcons();

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/workspace-audit', {
            method: 'POST',
            headers: {'X-CSRFToken': getCsrfToken()},
            body: formData
        });
        const data = await response.json();                                                                 /* Add export button */
        const botHTML = `
            <div class="space-y-4">
                <div>${data.response.replace(/\n/g, '<br>')}</div>
                
                <!-- Feedback Buttons Container -->
                <div class="feedback-buttons flex items-center gap-4 pt-2 border-t border-slate-700/30">
                    <span class="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Was this helpful?</span>
                    <button onclick="logFeedback('${botId}', 'helpful')" class="text-slate-500 hover:text-teal-400 transition group">
                        <i data-lucide="thumbs-up" class="w-3 h-3"></i>
                    </button>
                    <button onclick="logFeedback('${botId}', 'not-helpful')" class="text-slate-500 hover:text-red-400 transition group">
                        <i data-lucide="thumbs-down" class="w-3 h-3"></i>
                    </button>
                </div>
            </div>
        `;
        const formattedText = data.response.replace(/\n/g, '<br>');

        // 2. Create the Export Button HTML
        const exportBtn = `
            <div class="mt-6 pt-4 border-t border-slate-700/50">
                <button onclick="downloadPDF('${botId}')" class="flex items-center gap-2 text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/20 px-4 py-2 rounded-xl hover:bg-teal-500 hover:text-[#0f172a] transition-all duration-300 uppercase font-bold tracking-widest group">
                    <i data-lucide="file-down" class="w-4 h-4 group-hover:scale-110 transition"></i>
                    Download Audit Report (PDF)
                </button>
            </div>
        `;
        
       // 3. Inject into the bot bubble
        document.getElementById(botId).innerHTML = formattedText + botHTML + exportBtn
        document.getElementById(botId).classList.remove('italic');
    } catch (e) {
        document.getElementById(botId).innerText = "Workspace Audit failed.";
    }
}

function triggerPublishedUpload() {
    document.getElementById('published-upload').click();
}

async function handlePublishedUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    switchView('chats');
    const conversationView = document.getElementById('conversation-view');
    document.getElementById('welcome-view').classList.add('hidden');
    conversationView.classList.remove('hidden');

    const botId = "bot-pub-" + Date.now();
    conversationView.innerHTML += `
        <div class="flex justify-start items-start gap-4">
            <div class="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
                <i data-lucide="globe" class="w-4 h-4 text-teal-500 animate-pulse"></i>
            </div>
            <div id="${botId}" class="bg-slate-800/50 border border-slate-700 text-slate-200 px-4 py-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm italic">
                Scanning for public data exposure and stale published links...
            </div>
        </div>
    `;
    lucide.createIcons();

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/published-audit', {
            method: 'POST',
            headers: {'X-CSRFToken': getCsrfToken()},
            body: formData
        });
        const data = await response.json();
        const botHTML = `
            <div class="space-y-4">
                <div>${data.response.replace(/\n/g, '<br>')}</div>
                
                <!-- Feedback Buttons Container -->
                <div class="feedback-buttons flex items-center gap-4 pt-2 border-t border-slate-700/30">
                    <span class="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Was this helpful?</span>
                    <button onclick="logFeedback('${botId}', 'helpful')" class="text-slate-500 hover:text-teal-400 transition group">
                        <i data-lucide="thumbs-up" class="w-3 h-3"></i>
                    </button>
                    <button onclick="logFeedback('${botId}', 'not-helpful')" class="text-slate-500 hover:text-red-400 transition group">
                        <i data-lucide="thumbs-down" class="w-3 h-3"></i>
                    </button>
                </div>
            </div>
        `;
        const formattedText = data.response.replace(/\n/g, '<br>');

        // 2. Create the Export Button HTML
        const exportBtn = `
            <div class="mt-6 pt-4 border-t border-slate-700/50">
                <button onclick="downloadPDF('${botId}')" class="flex items-center gap-2 text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/20 px-4 py-2 rounded-xl hover:bg-teal-500 hover:text-[#0f172a] transition-all duration-300 uppercase font-bold tracking-widest group">
                    <i data-lucide="file-down" class="w-4 h-4 group-hover:scale-110 transition"></i>
                    Download Audit Report (PDF)
                </button>
            </div>
        `;
        
       // 3. Inject into the bot bubble
        document.getElementById(botId).innerHTML = formattedText + botHTML + exportBtn
        document.getElementById(botId).classList.remove('italic');
    } catch (e) {
        document.getElementById(botId).innerText = "Published Items Audit failed.";
    }
}

function triggerWorkappsUpload() {
    document.getElementById('workapps-upload').click();
}

async function handleWorkappsUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    switchView('chats');
    const conversationView = document.getElementById('conversation-view');
    document.getElementById('welcome-view').classList.add('hidden');
    conversationView.classList.remove('hidden');

    const botId = "bot-work-" + Date.now();
    conversationView.innerHTML += `
        <div class="flex justify-start items-start gap-4">
            <div class="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
                <i data-lucide="layout-template" class="text-teal-500 w-4 h-4 animate-pulse"></i>
            </div>
            <div id="${botId}" class="bg-slate-800/50 border border-slate-700 text-slate-200 px-4 py-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm italic">
                Auditing WorkApps utilization and collaborator pack efficiency...
            </div>
        </div>
    `;
    lucide.createIcons();

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/workapps-audit', {
            method: 'POST',
            headers: {'X-CSRFToken': getCsrfToken()},
            body: formData
        });
        const data = await response.json();     
        const botHTML = `
            <div class="space-y-4">
                <div>${data.response.replace(/\n/g, '<br>')}</div>
                
                <!-- Feedback Buttons Container -->
                <div class="feedback-buttons flex items-center gap-4 pt-2 border-t border-slate-700/30">
                    <span class="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Was this helpful?</span>
                    <button onclick="logFeedback('${botId}', 'helpful')" class="text-slate-500 hover:text-teal-400 transition group">
                        <i data-lucide="thumbs-up" class="w-3 h-3"></i>
                    </button>
                    <button onclick="logFeedback('${botId}', 'not-helpful')" class="text-slate-500 hover:text-red-400 transition group">
                        <i data-lucide="thumbs-down" class="w-3 h-3"></i>
                    </button>
                </div>
            </div>
        `;                                                            /* Add export button */
        const formattedText = data.response.replace(/\n/g, '<br>');

        // 2. Create the Export Button HTML
        const exportBtn = `
            <div class="mt-6 pt-4 border-t border-slate-700/50">
                <button onclick="downloadPDF('${botId}')" class="flex items-center gap-2 text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/20 px-4 py-2 rounded-xl hover:bg-teal-500 hover:text-[#0f172a] transition-all duration-300 uppercase font-bold tracking-widest group">
                    <i data-lucide="file-down" class="w-4 h-4 group-hover:scale-110 transition"></i>
                    Download Audit Report (PDF)
                </button>
            </div>
        `;
        
       // 3. Inject into the bot bubble
        document.getElementById(botId).innerHTML = formattedText + botHTML + exportBtn
        document.getElementById(botId).classList.remove('italic');
    } catch (e) {
        document.getElementById(botId).innerText = "WorkApps Audit failed.";
    }
}

async function loadSidebarSessions() {
    try {
        const response = await fetch('/get-sessions');
        const sessions = await response.json();
        const list = document.getElementById('sessions-list');
        
        if (sessions.length > 0) {
            list.innerHTML = ""; 
            sessions.forEach(s => {
                const btn = document.createElement('button');
                btn.className = "w-full text-left px-3 py-2 rounded-lg text-[11px] text-slate-400 hover:bg-slate-800 hover:text-teal-400 transition truncate flex items-center gap-2 group";
                btn.innerHTML = `<i data-lucide="message-square" class="w-3 h-3 opacity-50 group-hover:opacity-100"></i> ${s.session_title}`;
                btn.onclick = () => loadPreviousSession(s.id, s.module_type);
                list.appendChild(btn);
            });
            lucide.createIcons();
        }
    } catch (e) {
        console.error("Error loading sessions:", e);
    }
}

// 3. LOAD A PREVIOUS SESSION
async function loadPreviousSession(sessionId, moduleType) {
    currentSessionId = sessionId;
    
    // Switch UI context
    switchView('chats');
    document.getElementById('welcome-view').classList.add('hidden');
    document.getElementById('conversation-view').classList.remove('hidden');
    
    const convView = document.getElementById('conversation-view');
    convView.innerHTML = `<div class="text-center text-slate-500 py-10 animate-pulse text-xs uppercase tracking-widest">Loading history...</div>`;
    
    try {
        const response = await fetch(`/get-session-chat/${sessionId}`);
        const messages = await response.json();
        
        convView.innerHTML = ""; 
        chatHistory = []; 

        messages.forEach(m => {
            const roleClass = m.role === 'user' ? "justify-end" : "justify-start";
            const bubbleClass = m.role === 'user' ? "bg-teal-600/20 border-teal-500/30 text-teal-100" : "bg-slate-800/50 border-slate-700 text-slate-200";
            
            convView.innerHTML += `
                <div class="flex ${roleClass} items-start gap-4">
                    <div class="border ${bubbleClass} px-4 py-3 rounded-2xl max-w-[80%] text-sm leading-relaxed">
                        ${m.content.replace(/\n/g, '<br>')}
                    </div>
                </div>`;
            
            chatHistory.push({ role: m.role === 'user' ? "user" : "model", parts: [{ text: m.content }] });
        });
        
        convView.parentElement.scrollTop = convView.parentElement.scrollHeight;
    } catch (e) {
        convView.innerHTML = "Failed to load chat history.";
    }
}

function triggerPDFUpload() {
    document.getElementById('pdf-upload').click();
}

async function handlePDFUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Switch to Chat View and show loading
    switchView('chats');
    const conversationView = document.getElementById('conversation-view');
    document.getElementById('welcome-view').classList.add('hidden');
    conversationView.classList.remove('hidden');

    const botId = "bot-pdf-" + Date.now();
    conversationView.innerHTML += `
        <div class="flex justify-start items-start gap-4">
            <div class="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
                <i data-lucide="file-text" class="w-4 h-4 text-teal-500 animate-pulse"></i>
            </div>
            <div id="${botId}" class="bg-slate-800/50 border border-slate-700 text-slate-200 px-4 py-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm italic">
                Reading PDF and generating intelligence summary...
            </div>
        </div>
    `;
    lucide.createIcons();

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/summarize-pdf', {
            method: 'POST',
            headers: {'X-CSRFToken': getCsrfToken()},
            body: formData
        });
        const data = await response.json();
        
        // Use our consolidated render function (from the feedback step)
        // Pass 'true' if you want a PDF Export button for the summary too!
        if (window.renderBotResponse) {
            renderBotResponse(botId, data.response, true);
        } else {
            document.getElementById(botId).innerHTML = data.response.replace(/\n/g, '<br>');
        }

    } catch (e) {
        document.getElementById(botId).innerText = "PDF processing failed. Ensure the file is not password protected.";
    }
}

window.saveSmartsheetKey = async function() {
    const sKey = document.getElementById('user-smartsheet-key').value;

    if (!sKey) {
        showToast("Token is required!", "error");
        return;
    }

    const response = await fetch('/save-smartsheet-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' ,'X-CSRFToken': getCsrfToken()},
        body: JSON.stringify({ token: sKey })
    });

    if (response.ok) {
        // Change status light to green in header
        const statusDot = document.getElementById('connection-status');
        if (statusDot) {
            statusDot.classList.remove('bg-red-500');
            statusDot.classList.add('bg-green-500');
        }
        showToast("Smartsheet Connected! Audits are now active.");
        switchView('toolkit'); // Take them back to the toolkit
    } else {
        showToast("Connection failed. Check your token.", "error");
    }
};

// Allow "Enter" key to send
document.getElementById("user-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

/*window.addEventListener('load', () => {
    // We wait 2.5 seconds so the user actually sees the beautiful animation
    setTimeout(() => {
        const loader = document.getElementById('loading-screen');
        
        // Start Fade Out
        loader.style.opacity = '0';
        
        // Remove from DOM after fade finishes
        setTimeout(() => {
            loader.style.display = 'none';
            document.body.classList.remove('loading-active');
        }, 1000); 
        
    }, 2500); 
    loadSidebarSessions();
});*/
window.addEventListener('load', async () => {
    // 1. Handle Auto-hiding Toast/Flash Messages
    const flashes = document.querySelectorAll('.toast-item');
    flashes.forEach(f => {
        setTimeout(() => {
            f.style.opacity = '0';
            f.style.transition = 'opacity 0.5s ease';
            setTimeout(() => f.remove(), 500);
        }, 4000);
    });

    // 2. Handle the Beautiful Animation / Loading Screen
    setTimeout(() => {
        const loader = document.getElementById('loading-screen');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                document.body.classList.remove('loading-active');
            }, 1000);
        }
    }, 2500); 

    // 3. Load UI Data (Sidebar Sessions)
    loadSidebarSessions();

    // 4. NEW: Check if the user already has a token in the DB
    // This makes the "Status Light" green automatically on login
    try {
        const resp = await fetch('/check-connection');
        if (resp.ok) {
            const data = await resp.json();
            if (data.connected) {
                const dot = document.getElementById('connection-status');
                if (dot) {
                    dot.classList.remove('bg-red-500');
                    dot.classList.add('bg-green-500');
                    console.log("Smartsheet connection restored from secure vault.");
                }
            }
        }
    } catch (e) {
        // This will fail silently if the user is on the landing page (not logged in)
        console.log("User not authenticated yet.");
    }
});

// Keypress Enter
document.getElementById("user-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

function setPrompt(text) {
    document.getElementById('user-input').value = text;
}

window.startNewSession = function() {
    currentSessionId = null;
    chatHistory = [];
    document.getElementById('conversation-view').innerHTML = "";
    document.getElementById('conversation-view').classList.add('hidden');
    document.getElementById('welcome-view').classList.remove('hidden');
    switchView('chats');
};

window.copyActionPlan = function(text, btnId) {
    // This regex finds the "Admin Checklist" part of the AI response
    const checklistPart = text.split("Admin Checklist")[1] || text;
    
    navigator.clipboard.writeText(checklistPart.trim()).then(() => {
        const btn = document.getElementById(btnId);
        btn.innerHTML = '<i data-lucide="check" class="w-3 h-3"></i> Plan Copied!';
        setTimeout(() => {
            btn.innerHTML = '<i data-lucide="copy" class="w-3 h-3"></i> Copy Checklist';
            lucide.createIcons();
        }, 2000);
        lucide.createIcons();
    });
};

// Initialize body state
document.body.classList.add('loading-active');