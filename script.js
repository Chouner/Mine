/* Header scroll */
const header = document.querySelector(".site-header");
const hero = document.querySelector(".hero");
const syncHeader = () => { header.dataset.elevated = window.scrollY > 18 ? "true" : "false"; };
syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

/* Scroll reveal */
document.querySelectorAll(".section, .case-card, .resume-block, .journey-phase, .insight-card, .reflection-item, .method-item").forEach(el => el.dataset.reveal = "");
const revealObserver = new IntersectionObserver((entries) => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-visible"); revealObserver.unobserve(e.target); } }); }, { threshold: 0.12 });
document.querySelectorAll("[data-reveal]").forEach(el => revealObserver.observe(el));

/* Hero parallax */
if (hero) hero.addEventListener("pointermove", (e) => { const r = hero.getBoundingClientRect(); hero.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3)); hero.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5).toFixed(3)); }, { passive: true });

/* Card hover glow */
document.querySelectorAll(".case-card").forEach(card => { card.addEventListener("pointermove", (e) => { const r = card.getBoundingClientRect(); card.style.background = `radial-gradient(circle at ${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%, rgba(128,184,178,0.14), transparent 36%), var(--card)`; }, { passive: true }); card.addEventListener("pointerleave", () => card.style.background = ""); });

/* ═══════════════ PROJECT DETAIL OVERLAY ═══════════════ */
const backdrop = document.getElementById("overlay-backdrop");
const panel = document.getElementById("detail-panel");
const detailInner = document.getElementById("detail-inner");
const closeBtn = document.getElementById("detail-close");

const projectDetails = {
  "sonar-raw": {
    title: "Raw 数据到 Sv/TS 标准化计算",
    period: "2025.04 - 2025.06", role: "算法工程师",
    stages: [
      { title: "背景", text: "声呐硬件（NEO-SV、分裂波束、EK80）采集的原始数据是电压/强度值，无法直接用于生物量估算。需要一套标准化的计算流程将 Raw 数据转化为 Sv（体积后向散射强度）和 TS（目标强度），并与 Echoview 工业标准对标验证。" },
      { title: "方案", text: "按声呐方程将 Raw 电压值经 KTR/KTD 校正、传播损失补偿、吸收衰减修正后转换为 Sv。海底区域用最大斜率+变化点检测自动识别，阈值自适应调整。含单体目标检测与 TS 计算。以 Echoview 输出为参考基准，在 133 个 raw 文件、87,047,436 个有效样本上进行细胞级/脉冲级/区域级三层对比验证。", tags: ["Raw->SV", "KTR/KTD", "海底检测", "Echoview 对标"] },
      { title: "成果", text: "Sv RMSE = 0.050 dB（工程阈值 0.5 dB 的 1/10），MAE = 0.0059 dB，p95 绝对差 = 0.0038 dB。建立了声呐数据处理软件的标准化计算内核。", metrics: [["0.050dB","Sv RMSE"],["87M","验证样本"],["133","验证文件"]] },
      { title: "收获", text: "声呐数据处理不是简单的公式套用——不同换能器、不同水体环境、不同频率都需要不同的参数配置。与 Echoview 的对标验证不是一次性的，而是每当算法参数调整、新增换能器型号或切换水体环境时都需要重新跑一遍。把验证流程标准化、自动化，比写好算法本身更关键。" }
    ]
  },
  "aris": {
    title: "ARIS 声呐水母检测系统",
    period: "2025.06 - 2026.05", role: "AI 产品经理 / 项目负责人",
    stages: [
      { title: "背景", text: "ARIS 声呐图像边界模糊、目标密集、纹理稀疏。人工标注一帧需要 2-3 分钟（需领域专家），86,000 帧的成本不可接受。客户需要在滨海水母监测、出海科研调查、沙蛰养殖评估等场景中快速准确地检测水母。" },
      { title: "判断", text: "直接训练 YOLO 数据不够，纯 LLM 标注在声呐图像上泛化差。选择了「LLM 初筛 + 人工矫正 + 模型训练 + 传统 CV 后处理」的融合路线。同时将 ARIS 多波束三维数据（帧 x ping x 深度）压缩到二维（ping x 深度），从不同切面交叉验证检测结果。" },
      { title: "方案", text: "JSON 结构化 Prompt 引导 Qwen3-VL 输出 YOLO 标注格式。标注循环：LLM 预标注 → 人工矫正 → 质量检查（IoU > 0.7）→ 模型训练 → 模型预测下一批 → 人工抽检。YOLOv8（157 层/7M 参数），推理后用强度检测+边缘密度+形态滤波消除噪声误检。", tags: ["LLM辅助标注", "YOLOv8", "数据降维", "传统CV后处理"] },
      { title: "成果", text: "解析 86,342 帧，74,092 帧检测；mAP 0.889，计数精度 98.94%。FPS 从 5.6 提升到 26.7。已对外商业化销售，客户续签下一年合同。", metrics: [["0.889","mAP"],["98.94%","计数精度"],["26.7FPS","推理速度"],["客户续签","商业化"]] },
      { title: "收获", text: "AI 辅助标注本质是一个成本结构问题，不是纯技术问题。LLM 能不能完美标注不重要——重要的是它的输出能把人工工作量从「从头标注」降到「快速核查」。同时，声呐图像在像素空间上做检测天然处于劣势，换一个维度组织数据（三维→二维）效果提升明显。" }
    ]
  },
  "ek80-skill": {
    title: "EK80 多频段 Skill 算法系统",
    period: "2025.05 - 至今", role: "AI 产品经理 / 产品负责人",
    stages: [
      { title: "背景", text: "EK80 科学探鱼仪支持 18/38/70/120/200/333 kHz 多频段同时采集。每个频段需要的去噪参数、校准系数和生物解释规则都不同。传统做法是每个频段独立写一套处理脚本，维护成本极高，且物理约束在代码迭代中频繁丢失。" },
      { title: "判断", text: "放弃「一个脚本处理所有频段」的思路，改建 Skill 体系——每个频段（甚至每个处理步骤）封装为含公式、契约和验证阈值的独立模块。Agent 根据输入数据的频率和类型自动选择合适的 Skill 组合，而非让开发人员手动选择参数。" },
      { title: "方案", text: "定义了 18 个声学 Skill（元数据提取、校准治理、Sv/TS 契约、TVG 去除、去噪、边界锁定、结构分析、物种识别、EDSU/NASC 聚合等），14 个带类型约束的 SkillContract。搭建了 C++ 跨语言桥接验证 Python/C++ 输出一致。Docker 部署（web+worker），支持 CLI/FastAPI/systemd 多种运行模式。", tags: ["Skill契约", "多频段", "C++桥接", "Docker"] },
      { title: "成果", text: "18 个 Skill 落地，14 个 SkillContract 数据类。FastAPI Web 仪表板 + Docker Compose 部署。典型模块开发周期从约 1 周压缩至 0.5-2 天。", metrics: [["18","Skill落地"],["14","SkillContract"],["6频段","18-333kHz"],["FastAPI","Web部署"]] },
      { title: "收获", text: "FM 数据缺少校准曲线时必须返回 NaN 而不是静默退化——这个决策在算法层面看不出重要性，但在产品层面是信任的底线。如果软件输出了一个「看起来合理但物理上是错的」结果，且没有任何标记，那整个产品就不可信。" }
    ]
  },
  "fishsurvey": {
    title: "中西太平洋渔业资源评估报告",
    period: "2025.06 - 2026.03", role: "AI 产品经理 / 算法工程师",
    stages: [
      { title: "背景", text: "甲方需要基于多年 EK80 和声呐走航调查数据，对中西太平洋海域的渔业资源量进行系统评估。数据涵盖 5 个年度、多个航次、多种频率，需要统一的处理标准和可复现的分析流程。" },
      { title: "方案", text: "基于 EK80 Skill 系统的多频段算法模块，针对甲方数据特征配置去噪参数、校准系数和物种识别规则。处理链路：原始数据 → 元数据提取 → 校准 → TVG 去除 → 去噪 → 海底/海表检测 → 鱼群结构分析 → 物种掩码生成 → NASC 聚合 → EDSU 分割 → 资源量估算 → 报告生成。每个步骤输出可追溯的中间产物和统计摘要。", tags: ["多频段", "NASC", "EDSU", "资源评估"] },
      { title: "成果", text: "完成 5 年中西太平洋数据分析，输出标准化评估报告，甲方验收通过。建立了可复现的渔业资源评估流程：新的年度数据接入后只需调整配置参数即可跑通全流程。", metrics: [["5年","数据跨度"],["甲方验收","交付状态"],["多频段","18-333kHz"]] },
      { title: "收获", text: "商业化交付和算法开发的区别在于——客户关心的不是「模型精度」而是「报告能不能用」。一份 Sv RMSE 0.050 dB 但在关键区域漏掉了鱼群的报告，比一份 RMSE 0.5 dB 但鱼群分布描述准确的报告，对客户来说更没有价值。评估指标需要从「算法视角」切换到「用户视角」。" }
    ]
  },
  "deepfish": {
    title: "深海鱼类识别 · CLIP + RAG", period: "2025.11 - 2026.05", role: "AI 产品经理 / 算法工程师",
    stages: [
      { title: "背景", text: "深海鱼类种类多（110+）、样本少（长尾分布）、图像质量差（低光/损伤/非标准角度）。YOLO 直接分类失败，CLIP Top-1 仅 20%。分类学关键特征（发光器位置、尾柄腺体、侧线鳞数）纯视觉模型看不出来。" },
      { title: "判断", text: "换一个领域方法：放弃端到端视觉分类，引入分类学诊断知识做约束。CLIP 做视觉候选召回，RAG 用结构化专家知识做验证推理——「这个候选种的发光器数量对吗？尾柄特征匹配吗？」" },
      { title: "方案", text: "Stage 1：CLIP (OpenCLIP ViT-L/14) 视觉召回 Top-5 候选。Stage 2：Qwen3-VL-Plus 结构化图像描述 → text-embedding-v4 检索 → Qwen3-Max 逐项诊断。880 碎片文本语义聚合为 90 知识单元（形态/色泽/诊断特征/易混淆种辨析）。", tags: ["CLIP召回", "RAG推理", "知识聚合"] },
      { title: "成果", text: "Top-1 83.15%，Top-3 94.38%，Family 96.63%。RAG 成功将光彩标灯鱼从 CLIP 误判的第 9 名纠到第 1 名。", metrics: [["83.15%","Top-1"],["94.38%","Top-3"],["90","知识单元"]] },
      { title: "收获", text: "传统图像方法在声学领域不一定好用——换一个领域方法（引入专家知识），比换一个更大的模型更有效。" }
    ]
  },
  "qa-agent": {
    title: "声学问答 Agent 客服", period: "2025.02 - 2025.08", role: "AI 产品经理 / 产品负责人",
    stages: [
      { title: "背景", text: "声学门槛高，客户频繁询问基础问题（产品参数、声呐原理），销售无法专业解答，工程师被重复性问题挤占时间。通用大模型在声学专业术语上回答不准确。" },
      { title: "方案", text: "ChatGPT/Gemini/Claude 作为教师模型生成 100 核心术语定义，扩展到 3,789 条知识描述。Qwen-7B 微调（30min），通过阿里云百炼部署到微信公众号。", tags: ["教师-学生策略","Qwen-7B","知识库","微信公众号"] },
      { title: "成果", text: "试运行 6 个月，218 用户，引导咨询 20+，转化销售 5+ 单。长期部署为公司公众号标准入口。", metrics: [["218","用户"],["3,789","条目"],["6个月","试运行"]] },
      { title: "收获", text: "知识库质量 > 模型大小。3,789 条预过滤、预验证的结构化知识描述，比喂给模型 10 本 PDF 更有效。在没有足够数据时，「借用大模型知识 + 小模型低成本部署」比硬训大模型高效得多。" }
    ]
  },
  "pinger-decode": {
    title: "Pinger 信号解码与深度计算", period: "2025.03 - 2025.05", role: "算法工程师",
    stages: [
      { title: "背景", text: "超声波标记（Pinger）通过 60kHz 载波发射编码脉冲：双脉冲编码深度信息，三脉冲编码深度+温度。需要从接收机采集的原始信号中解码出脉冲 ID、深度值和温度数据。" },
      { title: "方案", text: "解析双脉冲时间差计算深度（depth = a*(Δt*1000 - b)），code1/code2 组合识别不同标记个体。脉冲周期约束下的振铃过滤和码间干扰处理。period_min/period_max 约束排除伪脉冲。", tags: ["60kHz","双脉冲解码","深度公式","脉冲周期约束"] },
      { title: "成果", text: "建立了标准化的信号解码和深度计算流程，为后续定位系统提供了可靠的数据输入。支持多种 Pinger 型号的解码参数配置。", metrics: [["深度范围","60-80m"],["双脉冲","编码方式"]] },
      { title: "收获", text: "信号解码的鲁棒性比精度更重要。浅水环境下多径效应会产生大量伪脉冲，如果不在解码阶段做严格筛选，后续定位步骤会收到大量垃圾数据，定位结果完全不可用。" }
    ]
  },
  "pinger-sim": {
    title: "Pinger 仿真系统", period: "2025.05", role: "产品经理 / 开发",
    stages: [
      { title: "背景", text: "真实水下定位测试成本极高（需要租船、布放接收机、投放标记鱼）。在实际部署之前，需要一个可控的仿真环境来验证定位算法的正确性和鲁棒性。" },
      { title: "方案", text: "基于 PyQt5 + folium 地图构建可配置仿真平台。支持地图选点放置接收机和标记鱼，配置声波传播距离限制、随机丢包率、接收机覆盖范围等参数。生成符合真实格式的仿真 CSV 数据供定位算法使用。", tags: ["PyQt5","folium","地图选点","丢包模拟"] },
      { title: "成果", text: "建成可复用仿真平台，后续定位算法的开发调试均基于此平台进行可控测试，显著降低了实地测试的次数和成本。" }
    ]
  },
  "pinger-position": {
    title: "水下定位主系统 ProcessPingerPosition", period: "2025.05 - 2025.08", role: "算法负责人",
    stages: [
      { title: "背景", text: "超声波标记定位需要信号解码、深度计算、时钟同步、TDOA 定位、结果存储和可视化的一体化系统。系统面对的是真实野外数据——接收机会断电、时钟会漂移、信号会被多径污染。" },
      { title: "方案", text: "DDD 分层架构（config/data_layer/domain/processing/UI）。三级校时：参考信标对齐 → PPS 秒脉冲计数 → UTC 分钟触发，TimeSyncResultCache 跨批次继承。TDOA 双曲线定位 + 三点/四点球面交会。五级降级策略保证数据连续性。支持 process/UI/service 三种运行模式。", tags: ["DDD架构","三级校时","TDOA","五级降级"] },
      { title: "成果", text: "处理 4,720 个脉冲组，25,064 组 TDOA 数据对，21,292 个深度值。五级降级策略保证了在任何数据条件下系统都能输出结果。", metrics: [["4,720","脉冲组"],["25,064","TDOA对"],["5级","降级策略"]] },
      { title: "收获", text: "野外系统最核心的挑战是异常处理，不是算法精度。在这个场景里，1m 精度但连续稳定的轨迹，远优于 10cm 精度但随时断连的散点。降级策略不是补充逻辑，是系统设计的第一优先级。" }
    ]
  },
  "sturgeon-phase1": {
    title: "中华鲟监测 · 浅水多径数据筛选与定位", period: "2025.09 - 2025.12", role: "算法负责人 / 产品负责人",
    stages: [
      { title: "背景", text: "宜昌/网鱼河实测环境中，浅水环境（<10m）导致严重的多径效应——声波经水面和水底反射后产生大量伪脉冲，有效信号被淹没。同时接收机在长时间监测中可能断电重启，造成时钟偏移、数据时间轴断裂。" },
      { title: "判断", text: "在浅水环境下，传统的时间窗分组法会引入大量伪脉冲。需要基于信号物理特征（到达时间一致性、脉冲间隔稳定性）做更精细的筛选，而不是简单扩大时间窗。" },
      { title: "方案", text: "分位自适应阈值：对每个接收机的脉冲到达时间序列计算分位数，将显著偏离主体分布的脉冲标记为伪脉冲。最早到达优先原则：多径信号总是比直达信号晚到，同一脉冲组内取最早到达的信号。信标对选择与 TDOA 双曲线定位。同时处理时钟偏移校正：基于基准信标的已知位置反算时钟偏移量，最大校正 129.52 秒。", tags: ["多径过滤","自适应阈值","信标对选择","时钟校正"] },
      { title: "成果", text: "成功从高噪声浅水数据中提取有效脉冲组并完成定位。验证了浅水环境下的数据筛选和定位流程可行性。", metrics: [["浅水多径","场景"],["129.52s","最大时钟校正"]] },
      { title: "收获", text: "浅水定位和深水定位是两种完全不同的问题。深水的挑战在声线弯曲和传播时间，浅水的挑战在信号污染和数据连续性。同一个算法框架需要针对不同环境做完全不同的预处理策略。" }
    ]
  },
  "sturgeon-phase2": {
    title: "中华鲟监测 · 软件商业化与推广", period: "2025.12 - 2026.03", role: "产品负责人",
    stages: [
      { title: "背景", text: "经过宜昌实测数据验证后，需要将定位算法从实验脚本转化为可交付的软件产品，供客户在不同项目中独立使用。目标是让非技术用户（渔业研究员、现场工程师）也能操作。" },
      { title: "方案", text: "将定位核心算法封装为独立软件，含 Web 可视化面板（XY 2D定位图、深度时间轴、热力图、3D点云）。数据库管理（3,544,034 条记录），支持历史数据回放和实时监控。配置文件管理（接收机坐标、信标参数、参考信标、鱼编号）。", tags: ["软件产品化","Web可视化","数据库","实时监控"] },
      { title: "成果", text: "软件在黄河野外鱼类繁殖项目中投入使用。长江中华鲟后续产卵监测项目已签订商业合同。定位误差 < 1m，系统稳定运行 3 个月+。", metrics: [["黄河","落地"],["长江","签合同"],["<1m","定位误差"]] },
      { title: "收获", text: "从算法到软件，最大的工作不在代码而在「产品化」——配置管理、错误提示、操作文档、异常处理、性能优化，每一项都比算法本身的精度调整更费时间，但也更决定了产品能不能被客户真正用起来。" }
    ]
  },
  "yaps": {
    title: "YAPS 轨迹平滑算法集成", period: "2025.06 - 2025.10", role: "算法工程师",
    stages: [
      { title: "背景", text: "TDOA 定位结果受噪声影响会有抖动，需要后处理平滑才能得到连续、生物合理的轨迹。YAPS（Yet Another Positioning Solver）是 R 语言生态中成熟的鱼类轨迹平滑包。" },
      { title: "方案", text: "Python 主流程通过 subprocess 调用 R 环境运行 YAPS。完成数据格式转换（Python dict → R data.frame）、接收机数组配置、时钟对齐参数传递和结果回传解析。支持批量处理和单条轨迹调试。", tags: ["Python/R集成","YAPS","轨迹平滑"] },
      { title: "成果", text: "实现了 Python 和 R 之间的稳定调用链路，为定位结果增加了轨迹后处理能力。" }
    ]
  }
};

function renderDetail(projectId) {
  const data = projectDetails[projectId];
  if (!data) return;
  let html = `<h2 style="font-size:26px;color:var(--green-deep);margin-bottom:4px;">${data.title}</h2>`;
  html += `<p style="color:var(--muted);font-size:14px;margin-bottom:6px;">${data.period} · ${data.role}</p>`;
  html += `<hr style="border:0;border-top:1px solid var(--line);margin:16px 0;">`;
  data.stages.forEach((s, i) => {
    html += `<div class="detail-stage"><h4>Step ${i+1} · ${s.title}</h4>`;
    if (s.text) html += `<p>${s.text}</p>`;
    if (s.tags) { html += `<div class="detail-flow">`; s.tags.forEach(t => html += `<span>${t}</span>`); html += `</div>`; }
    if (s.metrics) { html += `<div class="detail-metric-grid">`; s.metrics.forEach(([v,l]) => html += `<div class="detail-metric"><strong>${v}</strong><span>${l}</span></div>`); html += `</div>`; }
    html += `</div>`;
  });
  detailInner.innerHTML = html;
}

function openDetail(id) { renderDetail(id); backdrop.classList.add("active"); panel.classList.add("active"); document.body.style.overflow = "hidden"; }
function closeDetail() { backdrop.classList.remove("active"); panel.classList.remove("active"); document.body.style.overflow = ""; }

document.querySelectorAll(".detail-trigger").forEach(btn => { btn.addEventListener("click", e => { e.stopPropagation(); const card = btn.closest(".case-card"); if (card && card.dataset.project) openDetail(card.dataset.project); }); });
document.querySelectorAll(".case-card[data-project]").forEach(card => { card.addEventListener("click", () => { if (card.dataset.project) openDetail(card.dataset.project); }); card.style.cursor = "pointer"; });
closeBtn.addEventListener("click", closeDetail);
backdrop.addEventListener("click", closeDetail);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeDetail(); });

/* Journey phase toggle */
document.querySelectorAll(".phase-marker").forEach(m => { m.style.cursor = "pointer"; m.addEventListener("click", () => { const d = m.closest(".journey-phase").querySelector(".phase-detail"); if (d) d.style.maxHeight = d.style.maxHeight ? null : d.scrollHeight + "px"; }); });
document.querySelectorAll(".phase-detail").forEach(d => { d.style.overflow = "hidden"; d.style.transition = "max-height 300ms ease"; d.style.maxHeight = d.scrollHeight + "px"; });
