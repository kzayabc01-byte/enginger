/* ============================================
   《代码之下》— 主交互逻辑
   ============================================ */

// ==============================================
// 0. DATA STORE
// ==============================================

/* ----- Knowledge cards ----- */
const knowledgeCards = [
  {
    icon: `<svg class="w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>`,
    title: '职业伦理',
    brief: '理解工程师对公众、雇主与同行的道德义务。',
    detail: '软件工程师应遵循 ACM/IEEE 职业行为准则，将公共利益放在首位。在产品开发中坚持诚实、正直的原则，避免因商业压力而牺牲用户权益。在发现安全隐患或道德风险时，有责任向相关方披露。'
  },
  {
    icon: `<svg class="w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>`,
    title: '信息安全',
    brief: '保护用户数据免受未经授权的访问与泄露。',
    detail: '信息安全是软件质量的核心维度。加密存储、最小权限原则、安全传输（TLS）、定期渗透测试是基本要求。GDPR、《个人信息保护法》等法规要求数据处理全生命周期的合规性，违规将面临严厉处罚。'
  },
  {
    icon: `<svg class="w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>`,
    title: '法律素养',
    brief: '了解与软件开发相关的法律法规及合规框架。',
    detail: '程序员需了解《网络安全法》《数据安全法》《个人信息保护法》《刑法》第285-287条（计算机犯罪）等核心法规。开源协议（GPL、MIT、Apache）也具法律约束力——选错协议可能引发商业纠纷。'
  },
  {
    icon: `<svg class="w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/></svg>`,
    title: '行业责任',
    brief: '技术不止于代码——它塑造社会，定义未来。',
    detail: '算法偏见、数字鸿沟、AI 伦理是当代程序员的共同课题。代码影响着数百万用户的生活——推荐算法可以引导舆论，人脸识别可能侵犯隐私。技术人员的每一次架构决策都在参与社会规则的制定。'
  }
];

/* ----- Case studies ----- */
const caseStudies = [
  {
    id: 1,
    title: '滴滴出行数据安全事件',
    tag: '数据安全 · 2022',
    summary: '因违规收集和使用个人信息，被网信办处以80.26亿元罚款，是中国数据安全领域的标志性案件。',
    icon: `<svg class="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/></svg>`,
    full: {
      timeline: '2021年7月，网络安全审查办公室对滴滴启动安全审查；2022年7月，国家网信办作出行政处罚决定。',
      violation: '违法收集用户手机相册截图、剪切板信息、人脸识别信息等8项严重违法违规行为，共涉及1.67亿条个人信息。',
      consequence: '罚款人民币80.26亿元，对公司董事长兼CEO程维、总裁柳青各处人民币100万元罚款。APP下架整改，直接导致企业IPO后股价暴跌。',
      lesson: '数据收集的边界必须由法律和伦理共同划定，事后补救的成本远高于事先合规。'
    }
  },
  {
    id: 2,
    title: '大众汽车排放作弊门',
    tag: '软件伦理 · 2015',
    summary: '利用"减效装置"软件在排放测试中作弊，全球涉及约1100万辆柴油车，被罚超300亿美元。',
    icon: `<svg class="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
    full: {
      timeline: '2015年9月，美国环保署（EPA）发布违规通知；2017年大众认罪并同意支付43亿美元刑事罚款。',
      violation: '工程师编写"减效装置"（Defeat Device）软件，检测到车辆正在接受排放测试时自动降低发动机性能以通过测试，正常行驶时则关闭控制装置，实际氮氧化物排放超标40倍。',
      consequence: '全球召回和赔偿总额超300亿美元，多名高管和工程师被刑事起诉并被判入狱，公司信誉遭受毁灭性打击。',
      lesson: '工程师不能以"服从上级"为由推卸道德责任——明知代码用于欺诈却继续执行，就是共谋。'
    }
  },
  {
    id: 3,
    title: 'Deepfake AI 换脸侵权',
    tag: 'AI伦理 · 2023',
    summary: '利用深度伪造技术制作未经授权的换脸视频，侵犯肖像权、名誉权，暴露出AI技术的滥用风险。',
    icon: `<svg class="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>`,
    full: {
      timeline: '2023年，多起利用Deepfake技术制作明星、普通公民换脸视频的案件进入司法程序；《民法典》第1019条明确规定不得利用信息技术手段伪造他人肖像。',
      violation: '开发者提供或维护可生成未经授权换脸内容的平台/模型，未建立有效的内容审核和权利人保护机制，导致大量用于色情、诽谤、诈骗等违法场景。',
      consequence: '相关平台被责令下架整改，开发者被追究刑事责任。推动了《生成式人工智能服务管理暂行办法》等法规的加速出台。',
      lesson: 'AI 开发者必须为技术的社会后果负责——"我只是写代码的"不能成为免责理由，技术上可行不等于道德上应做。'
    }
  }
];

/* ----- Lab scenarios ----- */
const labScenarios = [
  {
    id: 1,
    title: '场景一：隐私数据收集困境',
    context: '你是一家社交APP的后端开发工程师。产品经理要求在用户注册时默认勾选"共享通讯录和位置数据"，并把这个勾选框设计成灰色小字放在协议末尾。TA 说："竞品都这样做，这是行业惯例，能提升30%的匹配率。"',
    options: [
      {
        label: 'A. 默许并执行',
        text: '按照产品经理的要求，把默认勾选做进注册流程。毕竟这是公司的商业决策，我只是执行者。',
        outcome: {
          verdict: '伦理失当',
          comment: '你选择了服从商业目标，但忽视了《个人信息保护法》要求的"知情同意"原则。默认勾选属于典型的 dark pattern（黑暗设计模式），剥夺了用户的自主选择权。工程师不应以"我只是写代码的"来推卸责任——是你把这些逻辑变成了现实。'
        }
      },
      {
        label: 'B. 拒绝并上报',
        text: '拒绝执行该需求，并向团队解释这违背了最小必要原则和用户知情权。提议采用清晰的 opt-in（主动勾选）方案。',
        outcome: {
          verdict: '伦理典范',
          comment: '你践行了职业伦理的核心原则：将用户权益置于商业利益之上。opt-in 方案短期可能影响数据指标，但长期建立用户信任才是可持续之道。真正的工程师不仅会写代码，更会在灰色地带做出正确抉择。'
        }
      }
    ]
  },
  {
    id: 2,
    title: '场景二：测试报告造假',
    context: '你负责的支付模块在压力测试中偶尔出现事务不一致——大约0.01%的交易会出现金额偏差。项目经理说："后天就要上线了，0.01%在金融行业可以接受，先把测试用例改成 pass 状态，上线后再修。"',
    options: [
      {
        label: 'A. 修改测试报告，先上线',
        text: '听从项目经理的安排，改动测试用例状态，确保 CI 绿灯亮起。毕竟上线压力很大，而且确实只有极低概率出错。',
        outcome: {
          verdict: '严重违规',
          comment: '篡改测试结果是最严重的职业失德之一。0.01% 在支付场景意味着每万笔交易就有1笔出错——在日均百万笔交易的系统中，每天就是100个用户的资金异常。大众排放门就是前车之鉴：工程师曾明知软件在作弊却选择沉默。'
        }
      },
      {
        label: 'B. 拒绝造假，标记为阻塞',
        text: '将测试失败标记为 P0 阻塞项，要求延期上线。同时向技术总监汇报，并推动根本原因排查。',
        outcome: {
          verdict: '负责任的选择',
          comment: '你做出了正确的决定。金融系统不允许"差不多"——0.01% 的错误率在金融领域是不可接受的。你的坚持保护了用户资金安全和公司长远声誉。真正的专业主义体现在对"零缺陷"的执着追求。'
        }
      }
    ]
  },
  {
    id: 3,
    title: '场景三：开源代码合规',
    context: '你发现团队在核心产品中引入了一个 GPL 协议的开源库，项目已进行了6个月。CTO 说："把版权声明删掉，配置里改个名就行，没人会发现。我们融资在即，重写来不及了。"',
    options: [
      {
        label: 'A. 照做，规避审查',
        text: '删除版权声明和 LICENSE 文件，在依赖列表中把该库改为自研模块。融资要紧，这是公司的生死关头。',
        outcome: {
          verdict: '法律与道德双重违规',
          comment: '违反 GPL 协议不仅是道德问题，更是法律问题——GPL 具有法律约束力，删除版权声明属于故意侵权，可能招致诉讼和高额赔偿。一旦融资后被发现，投资人和用户的信任将瞬间崩塌。公司信誉的损失远大于短期技术债务。'
        }
      },
      {
        label: 'B. 坦诚沟通，制定合规方案',
        text: '向 CTO 说明 GPL 协议的法律风险，提议：评估替代方案、或准备开源对应模块、或联系版权方协商商业授权。',
        outcome: {
          verdict: '专业而勇敢',
          comment: '在融资压力下坚持合规需要巨大勇气。但这不是"固执"，而是保护公司免受未来法律灾难。优秀的工程师不仅会使用开源代码，更懂得尊重知识产权——这正是职业素养的体现。你的坚持可能拯救了整个公司的未来。'
        }
      }
    ]
  }
];

/* ----- Quiz questions ----- */
const quizQuestions = [
  {
    q: '收集用户个人信息时，以下哪项最符合"最小必要原则"？',
    options: ['收集所有能收集的数据，以备将来使用', '只收集实现明确业务目的所必需的最少数据', '根据行业惯例决定收集范围', '当用户提出要求时才减少收集'],
    answer: 1
  },
  {
    q: '发现同事在代码中故意绕过安全审计机制，你首先应该？',
    options: ['帮他隐瞒，避免他被开除', '假装没看到，这不关我的事', '先与同事沟通并建议其纠正，若无效则上报', '直接发到社交媒体曝光'],
    answer: 2
  },
  {
    q: '以下哪种行为违反了开源协议？',
    options: ['使用 MIT 协议的代码并保留版权声明', '使用 GPL 协议的代码但未开源衍生作品', '使用 Apache 2.0 协议的代码并注明修改', '使用 BSD 协议的代码并将其用于商业产品'],
    answer: 1
  },
  {
    q: '在压力测试中发现偶发性数据错误，正确的做法是？',
    options: ['把阈值调低让测试通过，先上线再说', '修改测试用例，将错误改为 pass', '标记为阻塞项，定位根因并修复后再上线', '忽略它，因为发生概率很低'],
    answer: 2
  },
  {
    q: '关于 AI 技术的开发与部署，以下哪项说法正确？',
    options: ['AI模型是技术中立的，开发者无需为其后果负责', '只有在法律明确禁止时才需要考虑伦理问题', '开发者应主动评估AI可能带来的社会影响并建立防护机制', '伦理审查是法务部门的事，与技术开发无关'],
    answer: 2
  }
];

/* ----- Team members ----- */
const teamMembers = [
  { name: '张工', role: '前端开发', bio: '交互逻辑实现' },
  { name: '李工', role: '内容策划', bio: '案例与题库设计' },
  { name: '王工', role: '视觉设计', bio: 'UI/UX 与动效' },
  { name: '陈工', role: '数据调研', bio: '法规与合规资料' }
];

// ==============================================
// 1. THEME TOGGLE
// ==============================================
function initTheme() {
  const html = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const sun = document.getElementById('sunIcon');
  const moon = document.getElementById('moonIcon');

  function setTheme(dark) {
    if (dark) {
      html.classList.add('dark');
      html.classList.remove('light');
      sun.classList.remove('hidden');
      moon.classList.add('hidden');
    } else {
      html.classList.remove('dark');
      html.classList.add('light');
      sun.classList.add('hidden');
      moon.classList.remove('hidden');
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }

  // Default to light (education) mode
  const saved = localStorage.getItem('theme');
  const isDark = saved ? saved === 'dark' : false;
  setTheme(isDark);

  btn.addEventListener('click', () => {
    const next = !html.classList.contains('dark');
    setTheme(next);
  });
}

// ==============================================
// 2. INTERSECTION OBSERVER — Fade-up
// ==============================================
function initScrollReveal() {
  const elements = document.querySelectorAll('[data-fade]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

// ==============================================
// 3. KNOWLEDGE CARDS — Render
// ==============================================
function renderKnowledgeCards() {
  const grid = document.getElementById('knowledgeGrid');

  const iconColors = [
    'text-emerald-500 bg-emerald-50 border-emerald-200',
    'text-sky-500 bg-sky-50 border-sky-200',
    'text-amber-500 bg-amber-50 border-amber-200',
    'text-violet-500 bg-violet-50 border-violet-200'
  ];

  const iconHoverGlows = [
    'group-hover:shadow-emerald-500/20',
    'group-hover:shadow-sky-500/20',
    'group-hover:shadow-amber-500/20',
    'group-hover:shadow-violet-500/20'
  ];

  grid.innerHTML = knowledgeCards.map((card, i) => `
    <div class="bento-card group rounded-3xl border border-slate-100 bg-white/80 backdrop-blur p-8 cursor-default fade-up shadow-lg shadow-slate-200/50 hover:shadow-xl delay-${i * 100}" data-fade>
      <div class="w-14 h-14 rounded-2xl ${iconColors[i]} flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg ${iconHoverGlows[i]} border">
        <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          ${extractSvgPath(card.icon)}
        </svg>
      </div>
      <h3 class="text-xl font-bold mb-2.5 tracking-tight text-slate-900">${card.title}</h3>
      <p class="text-slate-500 text-sm leading-relaxed mb-3">${card.brief}</p>
      <div class="edu-card-detail">
        <div>
          <div class="border-t border-slate-100 pt-4 mt-2 text-slate-400 text-sm leading-relaxed">${card.detail}</div>
        </div>
      </div>
    </div>
  `).join('');
}

// Helper: extract inner SVG path from icon string for re-coloring
function extractSvgPath(iconStr) {
  const m = iconStr.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
  return m ? m[1] : iconStr;
}

// ==============================================
// 4. CASE CAROUSEL + MODAL
// ==============================================
function renderCaseCarousel() {
  const carousel = document.getElementById('caseCarousel');
  carousel.innerHTML = caseStudies.map(c => `
    <div class="snap-start shrink-0 w-[340px] md:w-[400px] rounded-3xl border border-slate-200 bg-white p-6 cursor-pointer hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-500 group shadow-md" onclick="openCaseModal(${c.id})">
      <div class="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110">
        <svg class="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">${extractSvgPath(c.icon)}</svg>
      </div>
      <span class="inline-block text-[10px] tracking-widest uppercase text-amber-600 mb-3 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200">${c.tag}</span>
      <h3 class="text-lg font-bold mb-2 tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">${c.title}</h3>
      <p class="text-slate-500 text-sm leading-relaxed">${c.summary}</p>
    </div>
  `).join('');
}

function openCaseModal(id) {
  const c = caseStudies.find(x => x.id === id);
  if (!c) return;
  const modal = document.getElementById('caseModal');
  const content = document.getElementById('caseModalContent');
  content.innerHTML = `
    <div class="flex items-start justify-between mb-6">
      <div>
        <span class="inline-block text-[10px] tracking-widest uppercase text-amber-600 mb-2 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200">${c.tag}</span>
        <h2 class="text-2xl font-extrabold tracking-tight text-slate-900">${c.title}</h2>
      </div>
      <button onclick="closeCaseModal()" class="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center hover:border-slate-400 hover:bg-slate-50 transition-all duration-300 text-slate-400">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
    <div class="space-y-4 text-sm leading-relaxed">
      <div class="rounded-2xl bg-slate-50 p-5 border border-slate-100">
        <h4 class="text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">事件时间线</h4>
        <p class="text-slate-600">${c.full.timeline}</p>
      </div>
      <div class="rounded-2xl bg-red-50 p-5 border border-red-100">
        <h4 class="text-xs font-bold tracking-widest uppercase text-red-500 mb-2">违规行为</h4>
        <p class="text-slate-600">${c.full.violation}</p>
      </div>
      <div class="rounded-2xl bg-amber-50 p-5 border border-amber-100">
        <h4 class="text-xs font-bold tracking-widest uppercase text-amber-600 mb-2">后果与处罚</h4>
        <p class="text-slate-600">${c.full.consequence}</p>
      </div>
      <div class="rounded-2xl bg-emerald-50 p-5 border border-emerald-100">
        <h4 class="text-xs font-bold tracking-widest uppercase text-emerald-600 mb-2">核心启示</h4>
        <p class="text-slate-800 font-medium">${c.full.lesson}</p>
      </div>
    </div>
  `;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeCaseModal() {
  document.getElementById('caseModal').classList.add('hidden');
  document.body.style.overflow = '';
}

// ==============================================
// 5. ETHICS LAB — State Machine
// ==============================================
let labState = { scenarioIndex: 0, phase: 'intro' }; // intro | context | result

function renderLab() {
  const container = document.getElementById('labContent');
  const total = labScenarios.length;
  const idx = labState.scenarioIndex;

  if (labState.phase === 'intro') {
    container.innerHTML = `
      <div class="scenario-enter text-center">
        <div class="text-violet-300 mb-4">
          <svg class="w-14 h-14 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"/></svg>
        </div>
        <p class="text-slate-800 text-xl mb-2 font-bold">伦理抉择实验室</p>
        <p class="text-slate-500 text-sm mb-8 max-w-md mx-auto leading-relaxed">你将面临 3 个真实世界中的伦理困境。<br>每个场景没有完美的答案——但有更负责任的选择。</p>
        <button onclick="labState.phase='context';renderLab();" class="px-6 py-2.5 rounded-2xl bg-violet-500 text-white text-sm font-semibold shadow-lg shadow-violet-500/25 hover:bg-violet-600 hover:shadow-violet-500/35 transition-all duration-300 hover:-translate-y-0.5">
          开始情境 1/3
        </button>
      </div>
    `;
    return;
  }

  if (labState.phase === 'context') {
    const s = labScenarios[idx];
    container.innerHTML = `
      <div class="scenario-enter">
        <div class="flex items-center gap-2 mb-5">
          <span class="text-[10px] tracking-widest uppercase text-violet-600 px-2.5 py-1 rounded-full bg-violet-50 border border-violet-200 font-semibold">${s.title}</span>
          <span class="text-[10px] text-slate-400 font-medium">情境 ${s.id}/${total}</span>
        </div>
        <p class="text-slate-700 leading-relaxed mb-8 text-sm md:text-base">${s.context}</p>
        <div class="space-y-3">
          ${s.options.map((opt, oi) => `
            <button onclick="selectLabOption(${oi})" class="w-full text-left p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:border-violet-300 hover:bg-violet-50/50 transition-all duration-300 group flex items-start gap-4">
              <span class="shrink-0 w-8 h-8 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-xs font-bold text-violet-500 group-hover:border-violet-300 group-hover:bg-violet-50 transition-all duration-300 mt-0.5">${opt.label[0]}</span>
              <div>
                <p class="text-sm font-semibold text-slate-800 mb-1">${opt.label}</p>
                <p class="text-xs text-slate-500 leading-relaxed">${opt.text}</p>
              </div>
            </button>
          `).join('')}
        </div>
        <div class="mt-6 text-right">
          <span class="text-xs text-slate-400 cursor-pointer hover:text-violet-500 transition-colors font-medium" onclick="if(labState.scenarioIndex>0){labState.scenarioIndex--;labState.phase='context';renderLab();}">${idx > 0 ? '← 返回上一情境' : ''}</span>
        </div>
      </div>
    `;
    return;
  }

  if (labState.phase === 'result') {
    const s = labScenarios[idx];
    const result = s.options[labState.chosenOption];
    const isGood = result.outcome.verdict.includes('典范') || result.outcome.verdict.includes('负责任') || result.outcome.verdict.includes('勇敢');

    container.innerHTML = `
      <div class="scenario-enter">
        <div class="mb-6 text-center">
          <span class="inline-block text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full border font-bold ${
            isGood
              ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
              : 'text-red-500 bg-red-50 border-red-200'
          }">${result.outcome.verdict}</span>
        </div>
        <p class="text-slate-700 leading-relaxed text-sm mb-8">${result.outcome.comment}</p>
        <div class="flex items-center justify-center gap-4">
          ${idx < total - 1 ? `
            <button onclick="labState.scenarioIndex++;labState.phase='context';renderLab();" class="px-6 py-2.5 rounded-2xl bg-violet-500 text-white text-sm font-semibold shadow-lg shadow-violet-500/25 hover:bg-violet-600 hover:shadow-violet-500/35 transition-all duration-300 hover:-translate-y-0.5">
              下一个情境 →
            </button>
          ` : `
            <button onclick="labState.phase='intro';labState.scenarioIndex=0;renderLab();" class="px-6 py-2.5 rounded-2xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold shadow-sm hover:border-violet-300 hover:text-violet-600 transition-all duration-300">
              重新开始
            </button>
          `}
        </div>
      </div>
    `;
  }
}

function selectLabOption(optionIndex) {
  labState.chosenOption = optionIndex;
  labState.phase = 'result';
  renderLab();
}

// ==============================================
// 6. QUIZ — Single-question flow + Ring result
// ==============================================
let quizState = { current: 0, answers: [], finished: false };

function renderQuiz() {
  const container = document.getElementById('quizContainer');
  const progress = document.getElementById('quizProgress');

  // Progress dots
  progress.innerHTML = quizQuestions.map((_, i) => {
    let cls = 'bg-slate-200';
    if (quizState.answers[i] !== undefined) {
      cls = quizState.answers[i] === quizQuestions[i].answer ? 'bg-emerald-500' : 'bg-red-400';
    }
    if (i === quizState.current && !quizState.finished) cls += ' ring-2 ring-sky-400 ring-offset-2';
    return `<span class="w-3 h-3 rounded-full transition-all duration-300 ${cls}"></span>`;
  }).join('');

  if (!quizState.finished) {
    const q = quizQuestions[quizState.current];
    container.innerHTML = `
      <div class="scenario-enter">
        <p class="text-xs tracking-widest uppercase text-sky-500 font-semibold mb-3">第 ${quizState.current + 1} / ${quizQuestions.length} 题</p>
        <h3 class="text-lg font-bold mb-7 leading-relaxed text-slate-800">${q.q}</h3>
        <div class="space-y-3">
          ${q.options.map((opt, oi) => `
            <button onclick="answerQuiz(${oi})" class="w-full text-left p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:border-sky-300 hover:bg-sky-50/50 transition-all duration-300 flex items-center gap-4 group">
              <span class="shrink-0 w-8 h-8 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-xs font-bold text-slate-400 group-hover:border-sky-300 group-hover:text-sky-500 group-hover:bg-sky-50 transition-all duration-300">${String.fromCharCode(65 + oi)}</span>
              <span class="text-sm text-slate-600 font-medium">${opt}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  } else {
    // Show results
    const total = quizQuestions.length;
    const correct = quizState.answers.filter((a, i) => a === quizQuestions[i].answer).length;
    const pct = Math.round((correct / total) * 100);
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (correct / total) * circumference;

    let grade, advice, gradeColor;
    if (pct === 100) { grade = '卓越'; gradeColor = 'text-emerald-600'; advice = '你对职业伦理有全面深入的理解，请继续保持这份专业素养。'; }
    else if (pct >= 80) { grade = '优秀'; gradeColor = 'text-emerald-500'; advice = '基础扎实，建议在数据合规和开源协议方面进一步拓展深度。'; }
    else if (pct >= 60) { grade = '良好'; gradeColor = 'text-sky-500'; advice = '你已具备基本认知，但在实际场景中的判断力仍需加强，推荐深入学习相关法规。'; }
    else { grade = '需提升'; gradeColor = 'text-amber-500'; advice = '职业伦理和合规知识亟待补强，这不仅是知识储备，更是保护自己和企业的护身符。'; }

    container.innerHTML = `
      <div class="scenario-enter text-center">
        <div class="relative inline-flex items-center justify-center mb-6">
          <svg class="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
            <circle class="ring-bg" cx="60" cy="60" r="54" stroke-width="8" fill="none"/>
            <circle id="resultRing" class="ring-fill" cx="60" cy="60" r="54" stroke-width="8" fill="none"
              stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}"/>
          </svg>
          <span class="absolute text-2xl font-extrabold text-slate-800">${pct}%</span>
        </div>
        <p class="text-xl font-bold mb-1 text-slate-800">评级：<span class="${gradeColor}">${grade}</span></p>
        <p class="text-slate-500 text-sm max-w-sm mx-auto mb-6 leading-relaxed">${advice}</p>
        <p class="text-xs text-slate-400 mb-8">${correct} / ${total} 题正确</p>
        <button onclick="quizState={current:0,answers:[],finished:false};renderQuiz();" class="px-6 py-2.5 rounded-2xl bg-sky-500 text-white text-sm font-semibold shadow-lg shadow-sky-500/25 hover:bg-sky-600 hover:shadow-sky-500/35 transition-all duration-300 hover:-translate-y-0.5">
          重新测评
        </button>
      </div>
    `;

    // Animate ring
    setTimeout(() => {
      const ring = document.getElementById('resultRing');
      if (ring) ring.style.strokeDashoffset = offset;
    }, 100);
  }
}

function answerQuiz(optionIndex) {
  quizState.answers[quizState.current] = optionIndex;
  if (quizState.current < quizQuestions.length - 1) {
    quizState.current++;
  } else {
    quizState.finished = true;
  }
  renderQuiz();
}

// ==============================================
// 7. FOOTER — Team cards
// ==============================================
function renderTeam() {
  const grid = document.getElementById('teamGrid');
  grid.innerHTML = teamMembers.map(m => `
    <div class="rounded-2xl border border-slate-200 bg-white p-5 text-left hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-500/5 transition-all duration-300 shadow-sm">
      <p class="font-semibold text-sm mb-1 text-slate-800">${m.name}</p>
      <p class="text-xs text-emerald-600 font-medium mb-1">${m.role}</p>
      <p class="text-xs text-slate-400">${m.bio}</p>
    </div>
  `).join('');
}

// ==============================================
// 8. Smooth scroll — Navbar links
// ==============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ==============================================
// 9. Re-observe after dynamic render
// ==============================================
function reObserve() {
  const elements = document.querySelectorAll('[data-fade]:not(.visible)');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  elements.forEach(el => observer.observe(el));
}

// ==============================================
// 10. BOOT
// ==============================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSmoothScroll();

  renderKnowledgeCards();
  renderCaseCarousel();
  renderLab();
  renderQuiz();
  renderTeam();

  initScrollReveal(); // catch static [data-fade]
  reObserve();        // catch dynamically rendered [data-fade]
});
