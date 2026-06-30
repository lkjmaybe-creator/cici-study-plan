const tasks = [
  { id: "math", icon: "➕", title: "数学口算", detail: "认真练习 15 分钟", stars: 3, color: "#ffe38a" },
  { id: "pinyin", icon: "🔤", title: "语文拼音", detail: "朗读和拼读 15 分钟", stars: 3, color: "#9fd7ff" },
  { id: "writing", icon: "✏️", title: "语文练字", detail: "工工整整写 1 页", stars: 3, color: "#ffcfdf" },
  { id: "english", icon: "🎧", title: "英语跟读", detail: "开口跟读 10 分钟", stars: 3, color: "#c5a7ff" },
  { id: "jump", icon: "🏃", title: "跳绳", detail: "活力运动 10 分钟", stars: 3, color: "#8be0c8" },
  { id: "veggie", icon: "🥦", title: "吃一种蔬菜", detail: "给身体加一点绿色能量", stars: 2, color: "#b7e58c" }
];

const defaultRewards = [
  { stars: 60, icon: "🍟", title: "奖励一次薯条" },
  { stars: 100, icon: "🍗", title: "奖励一次鸡块" },
  { stars: 200, icon: "🎁", title: "奖励一个神秘礼物" }
];

const defaultEntertainment = {
  ipad: { label: "iPad", minutes: 30, endMessage: "今天 iPad 时间结束啦，休息一下眼睛吧😊" },
  tv: { label: "电视", minutes: 40, endMessage: "今天电视时间结束啦，休息一下眼睛吧😊" }
};

const badges = [
  { id: "week", icon: "🏅", title: "第一周坚持", description: "连续完成 7 天全部任务", isUnlocked: () => getStreakDays() >= 7 },
  { id: "math", icon: "🏅", title: "数学达人", description: "数学口算累计完成 7 次", isUnlocked: () => countTaskCompletions("math") >= 7 },
  { id: "english", icon: "🏅", title: "英语达人", description: "英语跟读累计完成 7 次", isUnlocked: () => countTaskCompletions("english") >= 7 },
  { id: "jump", icon: "🏅", title: "跳绳达人", description: "跳绳累计完成 7 次", isUnlocked: () => countTaskCompletions("jump") >= 7 },
  { id: "veggie", icon: "🏅", title: "健康小卫士", description: "连续吃蔬菜 5 天", isUnlocked: () => getTaskStreak("veggie") >= 5 }
];

const aiOpeners = [
  "CiCi，今天的你有一点点亮晶晶。",
  "亲爱的 CiCi，学习伙伴来给你加油啦。",
  "今天也不用着急，我们慢慢来。",
  "CiCi 的努力已经被小星星记住啦。",
  "温柔提醒时间到，今天也可以很棒。",
  "CiCi，请收下一句甜甜的鼓励。",
  "今天的成长树正在等你浇水。",
  "每次开始，都是很勇敢的一步。",
  "CiCi，你的小进步很珍贵。",
  "学习伙伴看到你认真生活的样子啦。"
];

const aiMiddles = [
  "坚持一点点，你会越来越厉害。",
  "先完成一个小任务，就像点亮一颗小星星。",
  "不用一次做到很多，愿意开始就已经很好。",
  "今天多练一点点，明天就会轻松一点点。",
  "认真不是很严肃的事，也可以可爱地完成。",
  "你每打一次卡，都是在给未来的自己送礼物。",
  "慢慢来，稳稳来，CiCi 会越来越有力量。",
  "学习、运动、吃蔬菜，都是照顾自己的方式。",
  "今天的任务可以一项一项来，不需要慌张。",
  "你做过的努力不会消失，它们会悄悄变成能力。",
  "如果有点累，就先做最短的那个任务。",
  "小小的 5 分钟，也能打开今天的好状态。",
  "你的字会越来越工整，口算也会越来越快。",
  "开口读英语就是进步，声音小一点也没关系。",
  "每一天都不需要完美，只要比昨天多一点勇气。",
  "完成任务的 CiCi，正在给成长树添新叶子。",
  "今天的你值得被表扬，也值得被温柔陪伴。",
  "把难的任务拆小一点，CiCi 就能一步一步完成。",
  "星星不是催促你，是陪你看见自己的努力。",
  "你已经在路上啦，这就是很棒的事情。"
];

const aiClosers = [
  "给你一颗大大的鼓励星。",
  "今天也要为自己拍拍手。",
  "我们一起继续加油。",
  "慢慢长大，慢慢变厉害。",
  "CiCi 的成长树会越来越漂亮。",
  "愿今天有一点甜甜的成就感。",
  "你可以先从最喜欢的一项开始。",
  "完成后记得给自己一个笑脸。",
  "学习伙伴一直在这里陪你。",
  "今天的努力，明天会看见。"
];

const storageKey = "cici-summer-checkin-v2";
const legacyStorageKey = "cici-summer-checkin-v1";
const cloudConfigKey = "cici-summer-cloud-config-v1";
const parentPasswordKey = "cici-parent-password-v1";
const defaultParentPassword = "cici2026";
const cloudTableName = "cici_app_state";
const today = getDateKey(new Date());

const currentDateText = document.querySelector("#currentDateText");
const taskList = document.querySelector("#taskList");
const rewardList = document.querySelector("#rewardList");
const badgeList = document.querySelector("#badgeList");
const totalStarsEl = document.querySelector("#totalStars");
const todayProgressText = document.querySelector("#todayProgressText");
const todayProgressBar = document.querySelector("#todayProgressBar");
const streakDaysEl = document.querySelector("#streakDays");
const resetTodayButton = document.querySelector("#resetTodayButton");
const aiMessage = document.querySelector("#aiMessage");
const aiEncourageButton = document.querySelector("#aiEncourageButton");
const growthTree = document.querySelector("#growthTree");
const treeMessage = document.querySelector("#treeMessage");
const parentCenterButton = document.querySelector("#parentCenterButton");
const parentModal = document.querySelector("#parentModal");
const closeParentCenterButton = document.querySelector("#closeParentCenterButton");
const parentLoginPanel = document.querySelector("#parentLoginPanel");
const parentContent = document.querySelector("#parentContent");
const parentLoginForm = document.querySelector("#parentLoginForm");
const parentLoginPasswordInput = document.querySelector("#parentLoginPasswordInput");
const parentLoginError = document.querySelector("#parentLoginError");
const parentPasswordForm = document.querySelector("#parentPasswordForm");
const parentPasswordInput = document.querySelector("#parentPasswordInput");
const parentPasswordStatus = document.querySelector("#parentPasswordStatus");
const rewardSettingsForm = document.querySelector("#rewardSettingsForm");
const reward60Input = document.querySelector("#reward60Input");
const reward100Input = document.querySelector("#reward100Input");
const reward200Input = document.querySelector("#reward200Input");
const entertainmentSettingsForm = document.querySelector("#entertainmentSettingsForm");
const ipadMinutesInput = document.querySelector("#ipadMinutesInput");
const tvMinutesInput = document.querySelector("#tvMinutesInput");
const ipadTimer = document.querySelector("#ipadTimer");
const tvTimer = document.querySelector("#tvTimer");
const ipadStatus = document.querySelector("#ipadStatus");
const tvStatus = document.querySelector("#tvStatus");
const cloudSettingsForm = document.querySelector("#cloudSettingsForm");
const supabaseUrlInput = document.querySelector("#supabaseUrlInput");
const supabaseAnonKeyInput = document.querySelector("#supabaseAnonKeyInput");
const familyCodeInput = document.querySelector("#familyCodeInput");
const syncNowButton = document.querySelector("#syncNowButton");
const cloudStatus = document.querySelector("#cloudStatus");

let state = loadState();
let entertainmentInterval = null;
let cloudConfig = loadCloudConfig();
let cloudSaveTimer = null;
let isCloudApplying = false;

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(dateKey, offset) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + offset);
  return getDateKey(date);
}

function getParentPassword() {
  return localStorage.getItem(parentPasswordKey) || defaultParentPassword;
}

function renderCurrentDate() {
  const now = new Date();
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  if (currentDateText) {
    currentDateText.textContent = `今天是 ${now.getMonth() + 1}月${now.getDate()}日 星期${weekdays[now.getDay()]}`;
  }
}

function cloneRewards(rewards) {
  return rewards.map((reward) => ({ ...reward }));
}

function loadState() {
  const saved = localStorage.getItem(storageKey);
  const legacySaved = localStorage.getItem(legacyStorageKey);
  const defaultState = {
    totalStars: 0,
    days: {},
    rewards: cloneRewards(defaultRewards),
    entertainment: createDefaultEntertainmentState(),
    updatedAt: Date.now()
  };

  const raw = saved || legacySaved;
  if (!raw) {
    return defaultState;
  }

  try {
    const parsed = JSON.parse(raw);
    return normalizeState(parsed);
  } catch {
    return defaultState;
  }
}

function normalizeState(parsed) {
  const days = parsed.days || {};

  Object.values(days).forEach((day) => {
    day.completedAll = isFullDay(day);
  });

  return {
    totalStars: Number(parsed.totalStars) || 0,
    days,
    rewards: normalizeRewards(parsed.rewards),
    entertainment: normalizeEntertainment(parsed.entertainment),
    updatedAt: Number(parsed.updatedAt) || 0
  };
}

function normalizeRewards(savedRewards) {
  if (!Array.isArray(savedRewards)) {
    return cloneRewards(defaultRewards);
  }

  return defaultRewards.map((defaultReward) => {
    const saved = savedRewards.find((reward) => Number(reward.stars) === defaultReward.stars);
    return {
      stars: defaultReward.stars,
      icon: defaultReward.icon,
      title: (saved?.title || defaultReward.title).replace(`（${"盲"}${"盒"}）`, "")
    };
  });
}

function createDefaultEntertainmentState() {
  return Object.fromEntries(Object.entries(defaultEntertainment).map(([device, config]) => {
    return [device, createEntertainmentDay(config.minutes)];
  }));
}

function createEntertainmentDay(minutes, dateKey = getDateKey(new Date())) {
  return {
    date: dateKey,
    dailyMinutes: minutes,
    remainingSeconds: minutes * 60,
    running: false,
    startedAt: null,
    ended: false,
    message: `每日默认 ${minutes} 分钟`
  };
}

function normalizeEntertainment(savedEntertainment) {
  const normalized = {};
  const currentDate = getDateKey(new Date());

  Object.entries(defaultEntertainment).forEach(([device, config]) => {
    const saved = savedEntertainment?.[device] || {};
    const minutes = sanitizeMinutes(saved.dailyMinutes, config.minutes);
    const isToday = saved.date === currentDate;

    normalized[device] = isToday
      ? {
          date: currentDate,
          dailyMinutes: minutes,
          remainingSeconds: Math.min(minutes * 60, Math.max(0, Number(saved.remainingSeconds) || minutes * 60)),
          running: Boolean(saved.running),
          startedAt: Number(saved.startedAt) || null,
          ended: Boolean(saved.ended),
          message: saved.message || `每日默认 ${minutes} 分钟`
        }
      : createEntertainmentDay(minutes, currentDate);
  });

  return normalized;
}

function sanitizeMinutes(value, fallback) {
  const minutes = Number(value);
  if (!Number.isFinite(minutes)) {
    return fallback;
  }
  return Math.min(240, Math.max(1, Math.round(minutes)));
}

function loadCloudConfig() {
  const saved = localStorage.getItem(cloudConfigKey);
  if (!saved) {
    return {
      supabaseUrl: "",
      anonKey: "",
      familyCode: ""
    };
  }

  try {
    const parsed = JSON.parse(saved);
    return {
      supabaseUrl: parsed.supabaseUrl || "",
      anonKey: parsed.anonKey || "",
      familyCode: parsed.familyCode || ""
    };
  } catch {
    return {
      supabaseUrl: "",
      anonKey: "",
      familyCode: ""
    };
  }
}

function saveCloudConfig() {
  localStorage.setItem(cloudConfigKey, JSON.stringify(cloudConfig));
}

function isCloudConfigured() {
  return Boolean(cloudConfig.supabaseUrl && cloudConfig.anonKey && cloudConfig.familyCode);
}

function setCloudStatus(message) {
  if (cloudStatus) {
    cloudStatus.textContent = message;
  }
}

function getCloudBaseUrl() {
  return `${cloudConfig.supabaseUrl.replace(/\/$/, "")}/rest/v1/${cloudTableName}`;
}

async function fetchCloudState() {
  if (!isCloudConfigured()) {
    return null;
  }

  const url = `${getCloudBaseUrl()}?family_code=eq.${encodeURIComponent(cloudConfig.familyCode)}&select=data,updated_at`;
  const response = await fetch(url, {
    headers: {
      apikey: cloudConfig.anonKey,
      Authorization: `Bearer ${cloudConfig.anonKey}`
    }
  });

  if (!response.ok) {
    throw new Error("云端读取失败");
  }

  const rows = await response.json();
  return rows[0]?.data ? normalizeState(rows[0].data) : null;
}

async function uploadCloudState() {
  if (!isCloudConfigured()) {
    return;
  }

  if (!state.updatedAt) {
    state.updatedAt = Date.now();
    localStorage.setItem(storageKey, JSON.stringify(state));
  }

  const response = await fetch(`${getCloudBaseUrl()}?on_conflict=family_code`, {
    method: "POST",
    headers: {
      apikey: cloudConfig.anonKey,
      Authorization: `Bearer ${cloudConfig.anonKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates"
    },
    body: JSON.stringify({
      family_code: cloudConfig.familyCode,
      data: state,
      updated_at: new Date(state.updatedAt || Date.now()).toISOString()
    })
  });

  if (!response.ok) {
    throw new Error("云端保存失败");
  }
}

function queueCloudSave() {
  if (!isCloudConfigured() || isCloudApplying) {
    return;
  }

  clearTimeout(cloudSaveTimer);
  cloudSaveTimer = setTimeout(async () => {
    try {
      setCloudStatus("正在同步到云端...");
      await uploadCloudState();
      setCloudStatus(`已同步到云端：${new Date().toLocaleTimeString()}`);
    } catch (error) {
      setCloudStatus("云同步失败，请检查 Supabase 配置。");
    }
  }, 600);
}

async function syncFromCloud() {
  if (!isCloudConfigured()) {
    setCloudStatus("未开启云同步，当前数据保存在本设备。");
    return;
  }

  try {
    setCloudStatus("正在连接云端...");
    const remoteState = await fetchCloudState();

    if (remoteState && Number(remoteState.updatedAt || 0) > Number(state.updatedAt || 0)) {
      isCloudApplying = true;
      state = remoteState;
      saveState({ touch: false, upload: false });
      render();
      isCloudApplying = false;
      setCloudStatus(`已从云端加载较新的数据：${new Date().toLocaleTimeString()}`);
      return;
    }

    await uploadCloudState();
    setCloudStatus(`已同步到云端：${new Date().toLocaleTimeString()}`);
  } catch (error) {
    isCloudApplying = false;
    setCloudStatus("云同步失败，请检查网络、表结构和 Supabase 配置。");
  }
}

function saveState(options = {}) {
  const { touch = true, upload = true } = options;
  if (touch) {
    state.updatedAt = Date.now();
  }

  localStorage.setItem(storageKey, JSON.stringify(state));

  if (upload) {
    queueCloudSave();
  }
}

function getTodayTasks() {
  if (!state.days[today]) {
    state.days[today] = {};
  }
  return state.days[today];
}

function isFullDay(dayTasks) {
  return tasks.every((task) => Boolean(dayTasks?.[task.id]));
}

function syncTodayCompletion() {
  const todayTasks = getTodayTasks();
  todayTasks.completedAll = isFullDay(todayTasks);
}

function toggleTask(task) {
  const todayTasks = getTodayTasks();
  const isDone = Boolean(todayTasks[task.id]);

  todayTasks[task.id] = !isDone;
  state.totalStars += isDone ? -task.stars : task.stars;
  state.totalStars = Math.max(0, state.totalStars);
  syncTodayCompletion();

  saveState();
  render();
}

function resetToday() {
  const todayTasks = getTodayTasks();
  const removedStars = tasks.reduce((sum, task) => {
    return sum + (todayTasks[task.id] ? task.stars : 0);
  }, 0);

  state.days[today] = {};
  state.totalStars = Math.max(0, state.totalStars - removedStars);

  saveState();
  render();
}

function getCompletedCount() {
  const todayTasks = getTodayTasks();
  return tasks.filter((task) => todayTasks[task.id]).length;
}

function countTaskCompletions(taskId) {
  return Object.values(state.days).filter((day) => day?.[taskId]).length;
}

function getCompletedDayCount() {
  return Object.values(state.days).filter((day) => day?.completedAll || isFullDay(day)).length;
}

function getStreakDays() {
  let streak = 0;
  let cursor = isFullDay(getTodayTasks()) ? today : addDays(today, -1);

  while (state.days[cursor]?.completedAll || isFullDay(state.days[cursor])) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

function getTaskStreak(taskId) {
  let streak = 0;
  let cursor = state.days[today]?.[taskId] ? today : addDays(today, -1);

  while (state.days[cursor]?.[taskId]) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

function seededIndex(seedText, max) {
  let hash = 0;
  for (let index = 0; index < seedText.length; index += 1) {
    hash = (hash * 31 + seedText.charCodeAt(index)) >>> 0;
  }
  return max ? hash % max : 0;
}

function buildAiPool() {
  const todayTasks = getTodayTasks();
  const completedCount = getCompletedCount();
  const pool = [];

  aiOpeners.forEach((opener) => {
    aiMiddles.forEach((middle) => {
      aiClosers.forEach((closer) => {
        pool.push(`${opener} ${middle} ${closer}`);
      });
    });
  });

  if (completedCount === 0) {
    pool.push(
      "没关系，明天我们一起继续，加油！今天也可以先选一个最简单的小任务。",
      "CiCi，今天还没开始也没关系。先做 5 分钟，我们就算勇敢启动啦。",
      "没有完成任务不是失败，明天重新开始就好。学习伙伴会温柔陪着你。"
    );
  } else {
    tasks.forEach((task) => {
      if (todayTasks[task.id]) {
        pool.push(`今天${task.title}完成啦！CiCi 真棒！这一颗星星很认真。`);
      }
    });
  }

  if (!todayTasks.math) {
    pool.push("数学小提醒：今天可以先做 5 分钟口算，做完一点点也算勇敢开始。");
  }

  if (!todayTasks.pinyin) {
    pool.push("拼音小提醒：拼音每天一点点，会越来越熟，CiCi 的小嘴巴会越来越灵活。");
  }

  if (!todayTasks.english) {
    pool.push("英语小提醒：开口读英语最重要，声音小一点也没关系，敢读就是进步。");
  }

  if (todayTasks.jump) {
    pool.push("今天跳绳完成，运动很棒！CiCi 的身体能量正在充电。");
  }

  if (todayTasks.veggie) {
    pool.push("特别表扬吃蔬菜的 CiCi。愿意尝试绿色能量，真的很不容易。");
  }

  return pool;
}

function getAiMessage(isRandom = false) {
  const pool = buildAiPool();
  const todayTasks = getTodayTasks();
  const completedCount = getCompletedCount();
  const doneIds = tasks.filter((task) => todayTasks[task.id]).map((task) => task.id).join("-");
  const seed = `${today}-${doneIds}-${completedCount}-${isRandom ? Date.now() : "daily"}`;
  const mainMessage = pool[seededIndex(seed, pool.length)];
  const extras = [];

  if (!todayTasks.math) {
    extras.push("今天可以先做 5 分钟口算。");
  }
  if (!todayTasks.pinyin) {
    extras.push("拼音每天一点点，会越来越熟。");
  }
  if (!todayTasks.english) {
    extras.push("开口读英语最重要。");
  }
  if (todayTasks.jump) {
    extras.push("跳绳完成，运动很棒。");
  }
  if (todayTasks.veggie) {
    extras.push("吃蔬菜完成，特别表扬。");
  }

  if (isRandom) {
    return mainMessage;
  }

  if (completedCount === 0) {
    return [
      "没关系，今天还没开始也不着急，我们可以一起慢慢来。",
      "明天我们一起继续，加油！",
      ...extras
    ].join(" ");
  }

  return [mainMessage, ...extras].join(" ");
}

function renderTasks() {
  const todayTasks = getTodayTasks();

  taskList.innerHTML = tasks.map((task) => {
    const isDone = Boolean(todayTasks[task.id]);
    return `
      <article class="task-card ${isDone ? "done" : ""}" style="--task-color: ${task.color}">
        <div class="task-icon" aria-hidden="true">${task.icon}</div>
        <div>
          <h3>${task.title}</h3>
          <p>${task.detail} · ${task.stars} 星</p>
        </div>
        <button class="check-button" type="button" data-task-id="${task.id}">
          ${isDone ? "已完成" : "打卡"}
        </button>
      </article>
    `;
  }).join("");

  document.querySelectorAll(".check-button").forEach((button) => {
    button.addEventListener("click", () => {
      const task = tasks.find((item) => item.id === button.dataset.taskId);
      toggleTask(task);
    });
  });
}

function renderProgress() {
  const completedCount = getCompletedCount();
  const percent = Math.round((completedCount / tasks.length) * 100);

  todayProgressText.textContent = `${completedCount} / ${tasks.length}`;
  todayProgressBar.style.width = `${percent}%`;
  totalStarsEl.textContent = state.totalStars;
  streakDaysEl.textContent = getStreakDays();
}

function renderRewards() {
  rewardList.innerHTML = state.rewards.map((reward) => {
    const unlocked = state.totalStars >= reward.stars;
    const remaining = Math.max(0, reward.stars - state.totalStars);
    return `
      <article class="reward-card ${unlocked ? "unlocked" : ""}">
        <div class="reward-icon" aria-hidden="true">${reward.icon}</div>
        <strong>${reward.stars} 星：${reward.title}</strong>
        <p>${unlocked ? "已经解锁，可以和爸爸妈妈兑换啦。" : `还差 ${remaining} 星解锁。`}</p>
      </article>
    `;
  }).join("");
}

function renderAiMessage() {
  aiMessage.textContent = getAiMessage(false);
}

function encourageWithAi() {
  aiMessage.textContent = getAiMessage(true);
}

function renderGrowthTree() {
  const completedDays = getCompletedDayCount();
  const streak = getStreakDays();
  const grow = Math.min(72, completedDays * 7 + streak * 3);
  const sparkleOpacity = Math.min(1, 0.18 + streak * 0.1);

  growthTree.style.setProperty("--tree-grow", `${grow}px`);
  growthTree.style.setProperty("--tree-sparkle-opacity", sparkleOpacity);
  treeMessage.textContent = completedDays > 0
    ? `成长树已经长大 ${completedDays} 次，连续坚持 ${streak} 天。`
    : "完成一整天任务后，成长树会长高一点。";
}

function renderBadges() {
  badgeList.innerHTML = badges.map((badge) => {
    const unlocked = badge.isUnlocked();
    return `
      <article class="badge-item ${unlocked ? "unlocked" : "locked"}">
        <span class="badge-icon" aria-hidden="true">${unlocked ? badge.icon : "🔒"}</span>
        <div>
          <strong>${badge.title}</strong>
          <p>${unlocked ? "已解锁，CiCi 真棒！" : badge.description}</p>
        </div>
      </article>
    `;
  }).join("");
}

function getEntertainmentRemaining(device) {
  const timer = state.entertainment[device];
  if (!timer.running || !timer.startedAt) {
    return timer.remainingSeconds;
  }

  const elapsed = Math.floor((Date.now() - timer.startedAt) / 1000);
  return Math.max(0, timer.remainingSeconds - elapsed);
}

function formatTime(seconds) {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const rest = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

function startEntertainment(device) {
  const timer = state.entertainment[device];
  const remaining = getEntertainmentRemaining(device);

  if (remaining <= 0) {
    timer.ended = true;
    timer.running = false;
    timer.message = defaultEntertainment[device].endMessage;
  } else {
    timer.remainingSeconds = remaining;
    timer.running = true;
    timer.startedAt = Date.now();
    timer.ended = false;
    timer.message = `${defaultEntertainment[device].label} 时间进行中`;
  }

  saveState();
  renderEntertainment();
}

function pauseEntertainment(device) {
  const timer = state.entertainment[device];
  timer.remainingSeconds = getEntertainmentRemaining(device);
  timer.running = false;
  timer.startedAt = null;
  timer.message = `${defaultEntertainment[device].label} 时间已暂停`;

  saveState();
  renderEntertainment();
}

function endEntertainment(device) {
  const timer = state.entertainment[device];
  timer.remainingSeconds = 0;
  timer.running = false;
  timer.startedAt = null;
  timer.ended = true;
  timer.message = defaultEntertainment[device].endMessage;

  saveState();
  renderEntertainment();
}

function saveEntertainmentSettings(event) {
  event.preventDefault();

  const nextSettings = {
    ipad: sanitizeMinutes(ipadMinutesInput.value, defaultEntertainment.ipad.minutes),
    tv: sanitizeMinutes(tvMinutesInput.value, defaultEntertainment.tv.minutes)
  };

  Object.entries(nextSettings).forEach(([device, minutes]) => {
    state.entertainment[device] = createEntertainmentDay(minutes);
  });

  saveState();
  renderEntertainment();
}

function refreshEntertainmentForCurrentDate() {
  const currentDate = getDateKey(new Date());
  let didReset = false;

  Object.keys(defaultEntertainment).forEach((device) => {
    const timer = state.entertainment[device];
    if (timer.date !== currentDate) {
      state.entertainment[device] = createEntertainmentDay(timer.dailyMinutes, currentDate);
      didReset = true;
    }
  });

  if (didReset) {
    saveState();
  }
}

function renderEntertainment() {
  refreshEntertainmentForCurrentDate();

  Object.entries(defaultEntertainment).forEach(([device, config]) => {
    const timer = state.entertainment[device];
    const remaining = getEntertainmentRemaining(device);

    if (timer.running && remaining <= 0) {
      timer.remainingSeconds = 0;
      timer.running = false;
      timer.startedAt = null;
      timer.ended = true;
      timer.message = config.endMessage;
      saveState();
    }

    const display = device === "ipad" ? ipadTimer : tvTimer;
    const status = device === "ipad" ? ipadStatus : tvStatus;
    display.textContent = formatTime(getEntertainmentRemaining(device));
    status.textContent = timer.message || `每日默认 ${timer.dailyMinutes} 分钟`;
  });
}

function startEntertainmentTicker() {
  if (entertainmentInterval) {
    clearInterval(entertainmentInterval);
  }

  entertainmentInterval = setInterval(renderEntertainment, 1000);
}

function fillParentCenterForms() {
  const reward60 = state.rewards.find((reward) => reward.stars === 60);
  const reward100 = state.rewards.find((reward) => reward.stars === 100);
  const reward200 = state.rewards.find((reward) => reward.stars === 200);

  reward60Input.value = reward60?.title || "";
  reward100Input.value = reward100?.title || "";
  reward200Input.value = reward200?.title || "";
  ipadMinutesInput.value = state.entertainment.ipad.dailyMinutes;
  tvMinutesInput.value = state.entertainment.tv.dailyMinutes;
  supabaseUrlInput.value = cloudConfig.supabaseUrl;
  supabaseAnonKeyInput.value = cloudConfig.anonKey;
  familyCodeInput.value = cloudConfig.familyCode;
  renderEntertainment();
}

function showParentLogin(shouldFocus = true) {
  parentLoginPanel.classList.remove("is-hidden");
  parentContent.classList.add("is-hidden");
  parentLoginPasswordInput.value = "";
  parentLoginError.textContent = "";
  if (shouldFocus) {
    window.setTimeout(() => parentLoginPasswordInput.focus(), 50);
  }
}

function showParentContent() {
  fillParentCenterForms();
  parentLoginPanel.classList.add("is-hidden");
  parentContent.classList.remove("is-hidden");
}

function openParentCenter() {
  showParentLogin();
  parentModal.classList.add("open");
  parentModal.setAttribute("aria-hidden", "false");
}

function closeParentCenter() {
  parentModal.classList.remove("open");
  parentModal.setAttribute("aria-hidden", "true");
  showParentLogin(false);
}

function unlockParentCenter(event) {
  event.preventDefault();

  if (parentLoginPasswordInput.value === getParentPassword()) {
    showParentContent();
    return;
  }

  parentLoginError.textContent = "密码不正确，请家长再试一次。";
  parentLoginPasswordInput.select();
}

function saveParentPassword(event) {
  event.preventDefault();

  const nextPassword = parentPasswordInput.value.trim();
  if (nextPassword.length < 4) {
    parentPasswordStatus.textContent = "密码至少需要 4 个字符。";
    return;
  }

  localStorage.setItem(parentPasswordKey, nextPassword);
  parentPasswordInput.value = "";
  parentPasswordStatus.textContent = "新密码已保存，下次进入家长中心会生效。";
}

function saveRewardSettings(event) {
  event.preventDefault();

  state.rewards = defaultRewards.map((reward) => {
    const input = {
      60: reward60Input,
      100: reward100Input,
      200: reward200Input
    }[reward.stars];

    return {
      ...reward,
      title: input.value.trim() || reward.title
    };
  });

  saveState();
  closeParentCenter();
  renderRewards();
}

function saveCloudSettings(event) {
  event.preventDefault();

  cloudConfig = {
    supabaseUrl: supabaseUrlInput.value.trim(),
    anonKey: supabaseAnonKeyInput.value.trim(),
    familyCode: familyCodeInput.value.trim()
  };

  saveCloudConfig();
  syncFromCloud();
}

function render() {
  renderCurrentDate();
  syncTodayCompletion();
  renderTasks();
  renderProgress();
  renderRewards();
  renderAiMessage();
  renderGrowthTree();
  renderBadges();
  renderEntertainment();
  saveState({ touch: false });
}

resetTodayButton.addEventListener("click", resetToday);
aiEncourageButton.addEventListener("click", encourageWithAi);
parentCenterButton.addEventListener("click", openParentCenter);
closeParentCenterButton.addEventListener("click", closeParentCenter);
parentModal.addEventListener("click", (event) => {
  if (event.target === parentModal) {
    closeParentCenter();
  }
});
parentLoginForm.addEventListener("submit", unlockParentCenter);
parentPasswordForm.addEventListener("submit", saveParentPassword);
rewardSettingsForm.addEventListener("submit", saveRewardSettings);
cloudSettingsForm.addEventListener("submit", saveCloudSettings);
syncNowButton.addEventListener("click", syncFromCloud);
entertainmentSettingsForm.addEventListener("submit", saveEntertainmentSettings);
document.querySelectorAll("[data-device][data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const { device, action } = button.dataset;

    if (action === "start") {
      startEntertainment(device);
    } else if (action === "pause") {
      pauseEntertainment(device);
    } else if (action === "end") {
      endEntertainment(device);
    }
  });
});

render();
startEntertainmentTicker();
syncFromCloud();
