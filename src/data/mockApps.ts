import { GeneratedApp, SwarmAgent } from '../types';

export const INITIAL_SWARM_AGENTS: SwarmAgent[] = [
  {
    id: 'agent-architect',
    modelId: 'deepseek-r1',
    role: 'architect',
    titleAr: 'مهندس المعمارية والمنطق (DeepSeek-R1)',
    titleEn: 'System Architect (DeepSeek-R1)',
    avatarColor: 'from-amber-500 to-orange-600',
    isActive: true,
    systemPrompt: 'أنت مهندس المعمارية والمنطق. تقوم بتحليل المتطلبات، وضع المخطط الهيكلي وخوارزمية الحل، واختيار هياكل البيانات المثلى.',
  },
  {
    id: 'agent-developer',
    modelId: 'qwen-2.5-coder',
    role: 'developer',
    titleAr: 'المطور الرئيسي للواجهات والكود (Qwen 2.5 Coder)',
    titleEn: 'Lead Developer (Qwen 2.5 Coder)',
    avatarColor: 'from-blue-600 to-indigo-600',
    isActive: true,
    systemPrompt: 'أنت المطور الرئيسي للتطبيق. تكتب كوداً تنفيذاً نظيفاً، كاملاً، تفاعلياً، ومتوافقاً مع معايير الويب دون اختصارات.',
  },
  {
    id: 'agent-designer',
    modelId: 'flux-1-schnell',
    role: 'designer',
    titleAr: 'مصمم تجربة المستخدم والهوية (FLUX.1 UI/UX)',
    titleEn: 'UI/UX Visual Stylist (FLUX.1)',
    avatarColor: 'from-pink-500 to-rose-600',
    isActive: true,
    systemPrompt: 'أنت مصمم واجهات وتجربة المستخدم. تختار أنظمة الألوان المتناسقة، التدرجات العصرية، وأبعاد التصميم المتجاوبة.',
  },
  {
    id: 'agent-reviewer',
    modelId: 'gemini-3.8-flash',
    role: 'reviewer',
    titleAr: 'المدقق البرمجي ومحسن الأداء (Gemini 3.8)',
    titleEn: 'Code Auditor & Optimizer (Gemini 3.8)',
    avatarColor: 'from-cyan-500 to-blue-600',
    isActive: true,
    systemPrompt: 'أنت المدقق البرمجي. تفحص الكود للتحقق من خلوه من الأخطاء، تحسين السرعة، وإضافة التعامل مع الحالات الخاصة.',
  },
  {
    id: 'agent-tester',
    modelId: 'llama-3.3-70b',
    role: 'tester',
    titleAr: 'مهندس الجودة واختبارات التشغيل (Llama 3.3)',
    titleEn: 'QA & Test Engineer (Llama 3.3)',
    avatarColor: 'from-emerald-500 to-teal-600',
    isActive: true,
    systemPrompt: 'أنت مسؤول ضمان الجودة. تختبر سيناريوهات تفاعل المستخدم، وتوثق كيفية تشغيل التطبيق بنجاح.',
  },
];

export const INITIAL_GENERATED_APPS: GeneratedApp[] = [
  {
    id: 'app-kanban',
    title: 'تطبيق إدارة المشاريع والمهام (Nexus Kanban Board)',
    description: 'تطبيق تفاعلي كامل لإدارة مهام الفرق، إضافة بطاقات جديدة، النقل بين الأعمدة، وإحصائيات الإنجاز مع حفظ الحالة محلياً.',
    category: 'saas',
    modelContributors: ['DeepSeek-R1 (المعمارية)', 'Qwen 2.5 Coder (الكود)', 'Gemini 3.8 (التدقيق)'],
    createdAt: Date.now() - 3600000 * 24,
    updatedAt: Date.now() - 3600000 * 4,
    previewDevice: 'desktop',
    htmlCode: '',
    fullBundleCode: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nexus Kanban Board</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Cairo', sans-serif; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-4 sm:p-6">
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <header class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
      <div>
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold">📋</div>
          <h1 class="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            لوحة مهام المشاريع الذكية
          </h1>
        </div>
        <p class="text-xs text-slate-400 mt-1">تم بناؤه وتوليده بالتعاون بين DeepSeek و Qwen Coder</p>
      </div>

      <div class="flex items-center gap-2">
        <button onclick="openAddTaskModal()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5">
          <span>+ إضافة مهمة جديدة</span>
        </button>
      </div>
    </header>

    <!-- Stats Bar -->
    <div class="grid grid-cols-3 gap-3 mb-6">
      <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
        <span class="text-xs text-slate-400">قيد الانتظار</span>
        <div id="count-todo" class="text-lg font-bold text-indigo-400">0</div>
      </div>
      <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
        <span class="text-xs text-slate-400">قيد التنفيذ</span>
        <div id="count-progress" class="text-lg font-bold text-amber-400">0</div>
      </div>
      <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
        <span class="text-xs text-slate-400">مكتملة بنجاح</span>
        <div id="count-done" class="text-lg font-bold text-emerald-400">0</div>
      </div>
    </div>

    <!-- Kanban Columns -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Col 1: Todo -->
      <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col">
        <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
          <span class="font-bold text-xs flex items-center gap-2 text-indigo-400">
            <span class="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            المهام القادمة (To Do)
          </span>
        </div>
        <div id="col-todo" class="space-y-3 flex-1 min-h-[220px]"></div>
      </div>

      <!-- Col 2: In Progress -->
      <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col">
        <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
          <span class="font-bold text-xs flex items-center gap-2 text-amber-400">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            قيد العمل (In Progress)
          </span>
        </div>
        <div id="col-progress" class="space-y-3 flex-1 min-h-[220px]"></div>
      </div>

      <!-- Col 3: Done -->
      <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col">
        <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
          <span class="font-bold text-xs flex items-center gap-2 text-emerald-400">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            تم الإنجاز (Completed)
          </span>
        </div>
        <div id="col-done" class="space-y-3 flex-1 min-h-[220px]"></div>
      </div>
    </div>
  </div>

  <script>
    let tasks = [
      { id: 1, title: 'تصميم هيكل قاعدة البيانات', priority: 'عالية', status: 'todo' },
      { id: 2, title: 'ربط واجهة البرمجة (REST API)', priority: 'متوسطة', status: 'progress' },
      { id: 3, title: 'تدقيق أمان التشفير والمصادقة', priority: 'حرجة', status: 'done' },
      { id: 4, title: 'إعداد المعاينة التفاعلية للتطبيقات', priority: 'عالية', status: 'progress' }
    ];

    function renderTasks() {
      const colTodo = document.getElementById('col-todo');
      const colProgress = document.getElementById('col-progress');
      const colDone = document.getElementById('col-done');

      colTodo.innerHTML = '';
      colProgress.innerHTML = '';
      colDone.innerHTML = '';

      let todoCount = 0, progressCount = 0, doneCount = 0;

      tasks.forEach(task => {
        const card = document.createElement('div');
        card.className = 'p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 shadow-sm text-xs hover:border-slate-600 transition';
        
        let priorityBg = task.priority === 'حرجة' ? 'bg-rose-950 text-rose-300 border-rose-800' :
                         task.priority === 'عالية' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                         'bg-blue-950 text-blue-300 border-blue-800';

        card.innerHTML = \`
          <div class="flex items-start justify-between gap-2 mb-2">
            <h4 class="font-bold text-slate-100">\${task.title}</h4>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold border \${priorityBg}">\${task.priority}</span>
          </div>
          <div class="flex items-center justify-between pt-2 border-t border-slate-700/50 text-[10px]">
            <button onclick="moveTask(\${task.id}, 'prev')" class="text-slate-400 hover:text-white font-bold">\${task.status !== 'todo' ? '◀ السابق' : ''}</button>
            <button onclick="deleteTask(\${task.id})" class="text-rose-400 hover:text-rose-300">حذف</button>
            <button onclick="moveTask(\${task.id}, 'next')" class="text-slate-400 hover:text-white font-bold">\${task.status !== 'done' ? 'التالي ▶' : ''}</button>
          </div>
        \`;

        if (task.status === 'todo') {
          colTodo.appendChild(card);
          todoCount++;
        } else if (task.status === 'progress') {
          colProgress.appendChild(card);
          progressCount++;
        } else {
          colDone.appendChild(card);
          doneCount++;
        }
      });

      document.getElementById('count-todo').innerText = todoCount;
      document.getElementById('count-progress').innerText = progressCount;
      document.getElementById('count-done').innerText = doneCount;
    }

    function moveTask(id, dir) {
      const task = tasks.find(t => t.id === id);
      if (!task) return;
      if (dir === 'next') {
        if (task.status === 'todo') task.status = 'progress';
        else if (task.status === 'progress') task.status = 'done';
      } else {
        if (task.status === 'done') task.status = 'progress';
        else if (task.status === 'progress') task.status = 'todo';
      }
      renderTasks();
    }

    function deleteTask(id) {
      tasks = tasks.filter(t => t.id !== id);
      renderTasks();
    }

    function openAddTaskModal() {
      const title = prompt('أدخل عنوان المهمة الجديدة:');
      if (!title || !title.trim()) return;
      tasks.push({
        id: Date.now(),
        title: title.trim(),
        priority: 'عالية',
        status: 'todo'
      });
      renderTasks();
    }

    renderTasks();
  </script>
</body>
</html>`,
  },
  {
    id: 'app-ecommerce',
    title: 'متجر تجارة إلكترونية متجاوب (CyberTech Store)',
    description: 'واجهة متجر إلكتروني للمنتجات الرقمية مع عربة تسوق تفاعلية، تصفية حسب الفئة، وبحث فوري، وحساب الإجمالي.',
    category: 'ecommerce',
    modelContributors: ['Qwen 2.5 Coder', 'FLUX.1 (التصميم البصري)', 'Llama 3.3'],
    createdAt: Date.now() - 3600000 * 18,
    updatedAt: Date.now() - 3600000 * 2,
    previewDevice: 'desktop',
    htmlCode: '',
    fullBundleCode: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CyberTech Store</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style> body { font-family: 'Cairo', sans-serif; } </style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen">
  <!-- Nav -->
  <header class="border-b border-slate-800 bg-slate-950/80 sticky top-0 z-20 backdrop-blur px-6 py-4 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <span class="text-2xl font-black text-cyan-400">⚡ CyberStore</span>
      <span class="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">تطبيق تفاعلي</span>
    </div>
    <button onclick="toggleCart()" class="relative px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2">
      <span>🛒 السلة</span>
      <span id="cart-badge" class="px-1.5 py-0.2 rounded-full bg-rose-500 text-[10px]">0</span>
    </button>
  </header>

  <!-- Products Grid -->
  <main class="max-w-6xl mx-auto p-6">
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
      <h2 class="text-lg font-bold text-white">المنتجات التقنية الرائدة</h2>
      <input type="text" id="search-input" oninput="filterProducts()" placeholder="ابحث عن منتج..." class="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none w-full sm:w-64">
    </div>

    <div id="products-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"></div>
  </main>

  <!-- Cart Modal -->
  <div id="cart-modal" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 hidden items-center justify-center p-4">
    <div class="w-full max-w-md rounded-2xl bg-slate-950 border border-slate-800 p-5 shadow-2xl">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <h3 class="font-bold text-base text-white">عربة المشتريات</h3>
        <button onclick="toggleCart()" class="text-slate-400 hover:text-white text-lg font-bold">✕</button>
      </div>
      <div id="cart-items" class="space-y-3 max-h-60 overflow-y-auto mb-4 text-xs"></div>
      <div class="flex items-center justify-between border-t border-slate-800 pt-3 mb-4 text-sm font-bold">
        <span>الإجمالي النهائي:</span>
        <span id="cart-total" class="text-emerald-400">$0.00</span>
      </div>
      <button onclick="checkout()" class="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg transition">
        إتمام الطلب والدفع الفوري
      </button>
    </div>
  </div>

  <script>
    const products = [
      { id: 1, name: 'سماعات رأس لاسلكية إلغاء الضوضاء', price: 129, emoji: '🎧', category: 'صوتيات' },
      { id: 2, name: 'كاميرا سينمائية ذكية 4K Ultra', price: 449, emoji: '📷', category: 'تصوير' },
      { id: 3, name: 'لوحة مفاتيح ميكانيكية مخصصة', price: 89, emoji: '⌨️', category: 'ملحقات' },
      { id: 4, name: 'ساعة يد ذكية لمتابعة المؤشرات', price: 199, emoji: '⌚', category: 'أجهزة ذكية' },
      { id: 5, name: 'جهاز عرض ليزري مصغر ثلاثي الأبعاد', price: 299, emoji: '📽️', category: 'عرض' },
      { id: 6, name: 'شاحن طاقة شمسية فائق السرعة', price: 59, emoji: '🔋', category: 'طاقة' }
    ];

    let cart = [];

    function renderProducts(items) {
      const grid = document.getElementById('products-grid');
      grid.innerHTML = items.map(p => \`
        <div class="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition">
          <div class="text-center py-6 text-5xl bg-slate-900 rounded-xl mb-4">\${p.emoji}</div>
          <div>
            <span class="text-[10px] text-cyan-400 font-bold">\${p.category}</span>
            <h4 class="font-bold text-sm text-white mt-1 mb-2">\${p.name}</h4>
          </div>
          <div class="flex items-center justify-between pt-3 border-t border-slate-800 mt-2">
            <span class="text-lg font-black text-emerald-400">$\${p.price}</span>
            <button onclick="addToCart(\${p.id})" class="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs transition">
              أضف للسلة +
            </button>
          </div>
        </div>
      \`).join('');
    }

    function addToCart(id) {
      const p = products.find(prod => prod.id === id);
      cart.push(p);
      updateCartBadge();
    }

    function updateCartBadge() {
      document.getElementById('cart-badge').innerText = cart.length;
    }

    function toggleCart() {
      const modal = document.getElementById('cart-modal');
      modal.classList.toggle('hidden');
      modal.classList.toggle('flex');
      renderCartItems();
    }

    function renderCartItems() {
      const container = document.getElementById('cart-items');
      if (cart.length === 0) {
        container.innerHTML = '<p class="text-slate-500 text-center py-4">العربة فارغة حالياً.</p>';
        document.getElementById('cart-total').innerText = '$0.00';
        return;
      }
      container.innerHTML = cart.map((item, idx) => \`
        <div class="flex items-center justify-between p-2 rounded-lg bg-slate-900">
          <span>\${item.emoji} \${item.name}</span>
          <div class="flex items-center gap-3">
            <span class="font-bold text-emerald-400">$\${item.price}</span>
            <button onclick="removeFromCart(\${idx})" class="text-rose-400 hover:text-rose-300">✕</button>
          </div>
        </div>
      \`).join('');

      const total = cart.reduce((sum, i) => sum + i.price, 0);
      document.getElementById('cart-total').innerText = '$' + total.toFixed(2);
    }

    function removeFromCart(index) {
      cart.splice(index, 1);
      updateCartBadge();
      renderCartItems();
    }

    function checkout() {
      if (cart.length === 0) return alert('العربة فارغة!');
      alert('تم تأكيد طلبك بنجاح! شكراً لاستخدامك المتجر التفاعلي.');
      cart = [];
      updateCartBadge();
      toggleCart();
    }

    function filterProducts() {
      const q = document.getElementById('search-input').value.toLowerCase();
      const filtered = products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
      renderProducts(filtered);
    }

    renderProducts(products);
  </script>
</body>
</html>`,
  },
  {
    id: 'app-arcade-game',
    title: 'لعبة آركيد الفضاء ثنائية الأبعاد (Space Defender 2D Game)',
    description: 'لعبة آركيد ممتعة تعمل على Canvas ومجهزة بالصوت والمؤثرات، التحكم بحركة السفينة الفضائية وإطلاق الليزر ومواجهة الكويكبات وحساب النقاط.',
    category: 'game',
    modelContributors: ['DeepSeek-R1 (الخوارزمية الفيزيائية)', 'Qwen 2.5 Coder (محرك اللعبة)', 'Gemini 3.8'],
    createdAt: Date.now() - 3600000 * 12,
    updatedAt: Date.now() - 3600000 * 1,
    previewDevice: 'desktop',
    htmlCode: '',
    fullBundleCode: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Space Defender 2D</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet">
  <style> body { font-family: 'Cairo', sans-serif; } canvas { background: #030712; } </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col items-center justify-center p-4">
  <div class="max-w-lg w-full text-center">
    <!-- Header -->
    <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
      <div>
        <h1 class="text-xl font-black text-cyan-400">🚀 حامي الفضاء (Space Defender)</h1>
        <p class="text-xs text-slate-400">لعبة 2D فورية تفاعلية تم توليدها بالذكاء الاصطناعي</p>
      </div>
      <div class="text-end">
        <span class="text-xs text-slate-400 block">النقاط:</span>
        <span id="score-val" class="text-lg font-black font-mono text-emerald-400">0</span>
      </div>
    </div>

    <!-- Canvas -->
    <div class="relative rounded-2xl overflow-hidden border-2 border-slate-800 shadow-2xl mb-4">
      <canvas id="gameCanvas" width="480" height="340" class="w-full"></canvas>
      <div id="start-overlay" class="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center p-4">
        <h3 class="text-2xl font-black text-white mb-2">استعد للانطلاق!</h3>
        <p class="text-xs text-slate-300 mb-4">استخدم الأسهم ◀ ▶ للتحرك، وزر المسافة (Space) لإطلاق الليزر.</p>
        <button onclick="startGame()" class="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-black text-xs shadow-lg transition">
          بدء اللعب الآن 🎮
        </button>
      </div>
    </div>

    <!-- Mobile Touch Controls -->
    <div class="flex items-center justify-center gap-3">
      <button onmousedown="keys.ArrowLeft=true" onmouseup="keys.ArrowLeft=false" class="px-5 py-3 rounded-xl bg-slate-800 text-white font-bold text-sm active:bg-slate-700">◀ يسار</button>
      <button onclick="shoot()" class="px-6 py-3 rounded-xl bg-rose-600 text-white font-black text-sm active:bg-rose-700 shadow-lg">🔥 إطلاق</button>
      <button onmousedown="keys.ArrowRight=true" onmouseup="keys.ArrowRight=false" class="px-5 py-3 rounded-xl bg-slate-800 text-white font-bold text-sm active:bg-slate-700">يمين ▶</button>
    </div>
  </div>

  <script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    let gameRunning = false;
    let score = 0;

    let ship = { x: 220, y: 300, w: 32, h: 24, speed: 6 };
    let bullets = [];
    let asteroids = [];
    let keys = {};

    window.addEventListener('keydown', e => {
      keys[e.code] = true;
      if (e.code === 'Space' && gameRunning) shoot();
    });
    window.addEventListener('keyup', e => { keys[e.code] = false; });

    function shoot() {
      bullets.push({ x: ship.x + ship.w / 2 - 2, y: ship.y, w: 4, h: 10, speed: 8 });
    }

    function startGame() {
      document.getElementById('start-overlay').classList.add('hidden');
      score = 0;
      bullets = [];
      asteroids = [];
      ship.x = canvas.width / 2 - 16;
      gameRunning = true;
      requestAnimationFrame(gameLoop);
    }

    function gameOver() {
      gameRunning = false;
      const overlay = document.getElementById('start-overlay');
      overlay.classList.remove('hidden');
      overlay.querySelector('h3').innerText = 'انتهت اللعبة! مجموعك: ' + score;
    }

    let spawnTimer = 0;

    function gameLoop() {
      if (!gameRunning) return;

      // Update ship
      if (keys['ArrowLeft'] && ship.x > 0) ship.x -= ship.speed;
      if (keys['ArrowRight'] && ship.x < canvas.width - ship.w) ship.x += ship.speed;

      // Spawn asteroids
      spawnTimer++;
      if (spawnTimer % 40 === 0) {
        asteroids.push({
          x: Math.random() * (canvas.width - 24),
          y: -24,
          r: 12 + Math.random() * 8,
          speed: 2 + Math.random() * 2
        });
      }

      // Update bullets
      bullets.forEach(b => { b.y -= b.speed; });
      bullets = bullets.filter(b => b.y > -10);

      // Update asteroids
      asteroids.forEach(a => { a.y += a.speed; });

      // Bullet-Asteroid Collision
      bullets.forEach((b, bIdx) => {
        asteroids.forEach((a, aIdx) => {
          const dist = Math.hypot(b.x - a.x, b.y - a.y);
          if (dist < a.r + 4) {
            bullets.splice(bIdx, 1);
            asteroids.splice(aIdx, 1);
            score += 10;
            document.getElementById('score-val').innerText = score;
          }
        });
      });

      // Ship collision
      for (let a of asteroids) {
        if (Math.hypot(ship.x + ship.w/2 - a.x, ship.y + ship.h/2 - a.y) < a.r + 14) {
          gameOver();
          return;
        }
      }

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Stars bg
      ctx.fillStyle = '#1e293b';
      for(let i=0; i<30; i++) {
        ctx.fillRect((i*47)%canvas.width, (i*31 + spawnTimer)%canvas.height, 2, 2);
      }

      // Draw Ship
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.moveTo(ship.x + ship.w/2, ship.y);
      ctx.lineTo(ship.x, ship.y + ship.h);
      ctx.lineTo(ship.x + ship.w, ship.y + ship.h);
      ctx.fill();

      // Draw Bullets
      ctx.fillStyle = '#f43f5e';
      bullets.forEach(b => { ctx.fillRect(b.x, b.y, b.w, b.h); });

      // Draw Asteroids
      ctx.fillStyle = '#94a3b8';
      asteroids.forEach(a => {
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(gameLoop);
    }
  </script>
</body>
</html>`,
  }
];

export const APP_BUILDER_TOOLS = [
  {
    id: 'tool-wireframe-ui',
    titleAr: 'توليد واجهات المستخدم وتصميم الـ UI/UX',
    titleEn: 'UI/UX & Component Generator',
    descriptionAr: 'تصميم مكونات الويب المتجاوبة بنظام Tailwind CSS الحديث مع تناغم الألوان وعناصر التفاعل.',
    descriptionEn: 'Generate modern responsive Tailwind components and interactive web layouts.',
    iconName: 'Layout',
    category: 'ui',
    targetModelId: 'qwen-2.5-coder',
    defaultPrompt: 'صمم واجهة مستخدم تفاعلية عصرية بنظام Tailwind CSS مع الوضع الليلي وتأثيرات حركية خفيفة.',
  },
  {
    id: 'tool-db-schema',
    titleAr: 'هندسة قواعد البيانات ومخطط الـ Schema',
    titleEn: 'Database Schema & ERD Architect',
    descriptionAr: 'توليد مخططات PostgreSQL و Supabase و Drizzle ORM مع علاقات الجداول والـ Foreign Keys.',
    descriptionEn: 'Architect relational SQL schemas, migrations, indexes, and relations.',
    iconName: 'Database',
    category: 'database',
    targetModelId: 'deepseek-r1',
    defaultPrompt: 'أنشئ مخطط قاعدة بيانات علائقية كامل مع الفهارس والمفاتيح والعلاقات (1-to-many, many-to-many).',
  },
  {
    id: 'tool-backend-api',
    titleAr: 'بناء مسارات الـ API وخوادم الـ Express',
    titleEn: 'Backend API & Express Router',
    descriptionAr: 'توليد نقاط اتصال RESTful endpoints كاملة مع التحقق من صحة المدخلات ومعالجة الأخطاء.',
    descriptionEn: 'Produce secure, production-grade Express/Node.js API routes and middleware.',
    iconName: 'Server',
    category: 'backend',
    targetModelId: 'qwen-2.5-coder',
    defaultPrompt: 'اكتب خادم Express متكامل مع مسارات CRUD وJWT authentication والتحقق من صحة المدخلات.',
  },
  {
    id: 'tool-testing-suite',
    titleAr: 'مكتشف الثغرات ومولد اختبارات الوحدة (Testing)',
    titleEn: 'Bug Auditor & Test Suite Generator',
    descriptionAr: 'فحص الكود بحثاً عن الثغرات الأمنية واختناقات الذاكرة وتوليد اختبارات Jest / Vitest.',
    descriptionEn: 'Audit codebase for vulnerabilities, race conditions, and generate comprehensive unit tests.',
    iconName: 'ShieldCheck',
    category: 'testing',
    targetModelId: 'llama-3.3-70b',
    defaultPrompt: 'قم بفحص الكود التالي، واكتشف أي ثغرات أمنية، واكتب اختبارات وحدة شاملة تغطي كافة الحالات المتطرفة.',
  },
];
