// ==================== admin.js ====================
window.loadSection = async function(section) {
  const contentDiv = document.getElementById('contentArea');
  contentDiv.innerHTML = '<p style="text-align:center;">⏳ جاري التحميل...</p>';

  try {
    let html = '';
    switch (section) {
      case 'dashboard':
        html = await loadDashboard();
        break;
      case 'paymentMethods':
        html = await loadPaymentMethods();
        break;
      case 'currencies':
        html = await loadCurrencies();
        break;
      case 'vipProfit':
        html = await loadVipProfit();
        break;
      case 'profitLog':
        html = await loadProfitLog();
        break;
      case 'users':
        html = await loadUsers();
        break;
      case 'debtBalance':
        html = await loadDebtBalance();
        break;
      case 'topSpenders':
        html = await loadTopSpenders();
        break;
      case 'orders':
        html = await loadOrders();
        break;
      case 'charges':
        html = await loadCharges();
        break;
      case 'maintenance':
        html = await loadMaintenance();
        break;
      // الصفحات الأخرى (قيد التطوير)
      case 'notifications':
      case 'providers':
      case 'import':
      case 'storeCards':
      case 'vipUsers':
      case 'referrals':
      case 'design':
      case 'orderMessages':
      case 'orderManagement':
      case 'contactMethods':
      case 'adminAccounts':
      case 'twoFactor':
      case 'disputes':
      case 'categories':
      case 'addProduct':
      case 'manageProducts':
      case 'stock':
      case 'operations':
      case 'viewAll':
        html = `<h2>${getSectionTitle(section)}</h2><p style="text-align:center;">هذه الصفحة قيد التطوير. سيتم إضافتها قريبًا.</p>`;
        break;
      default:
        html = '<h2>قسم غير معروف</h2>';
    }
    contentDiv.innerHTML = html;
  } catch (error) {
    contentDiv.innerHTML = `<p style="color: red;">❌ حدث خطأ: ${error.message}</p>`;
    showToast('فشل تحميل البيانات', 'error');
  }
};

function getSectionTitle(section) {
  const titles = {
    dashboard: '📊 لوحة القيادة',
    paymentMethods: '💳 طرق الدفع',
    currencies: '💰 العملات',
    vipProfit: '📈 نسبة ربح VIP',
    profitLog: '💰 سجل الأرباح',
    users: '👥 إدارة المستخدمين',
    debtBalance: '💸 الرصيد المدين',
    topSpenders: '🏆 الأكثر صرفاً',
    orders: '📦 الطلبات',
    charges: '💰 طلبات الشحن',
    maintenance: '🔧 وضع الصيانة',
    notifications: '🔔 إرسال إشعار',
    providers: '🚚 إدارة المزودين',
    import: '📦 استيراد منتجات',
    storeCards: '💳 بطاقات المتجر',
    vipUsers: '👑 الدولاء',
    referrals: '🤝 الإجالات',
    design: '🎨 التصميم',
    orderMessages: '✉️ رسائل الطلب والردود',
    orderManagement: '🔀 إدارة الترتيب',
    contactMethods: '📞 وسائل التواصل',
    adminAccounts: '👤 حسابات الإدارة',
    twoFactor: '🔐 الحقوق بخطوتين',
    disputes: '⚖️ طلبات الاعتراض',
    categories: '📂 الأقسام',
    addProduct: '➕ إضافة منتج',
    manageProducts: '✏️ إدارة المنتجات',
    stock: '📦 منتجات المخزون',
    operations: '⚙️ العمليات',
    viewAll: '👁️ عرضها'
  };
  return titles[section] || 'القسم';
}

// ===== دوال تحميل الأقسام الأساسية =====
async function loadDashboard() {
  // نسخ دالة loadDashboard من dashboard.js هنا
  const products = await window.fetchRecords('products') || [];
  const users = await window.fetchRecords('users') || [];
  const orders = await window.fetchRecords('orders') || [];
  const charges = await window.fetchRecords('charges') || [];

  const activeProducts = products.length;
  const totalUsers = users.length;
  const totalUserBalance = users.reduce((sum, u) => sum + (u.fields.walletBalance || 0), 0);
  const allowedDebtUsers = users.filter(u => u.fields.allowedDebt).length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.fields.status === 'pending').length;
  const totalSales = orders.reduce((sum, o) => sum + (o.fields.price || 0), 0);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
  const monthlyOrders = orders.filter(o => o.fields.createdAt >= startOfMonth && o.fields.createdAt <= endOfMonth).length;

  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const monthRange = `${lastDay.toLocaleDateString()} – ${firstDay.toLocaleDateString()}`;

  const processedCharges = charges.filter(c => c.fields.status === 'completed').length;
  const totalDebt = users.reduce((sum, u) => sum + (u.fields.debtBalance || 0), 0);
  const totalCost = 0;
  const netProfit = totalSales - totalCost;
  const receivedAmount = totalSales;

  return `
    <h2>📊 لوحة القيادة</h2>
    <div class="stats-grid" style="grid-template-columns: repeat(4, 1fr);">
      <div class="stat-card"><h3>إجمالي المبيعات</h3><p>$${totalSales.toFixed(2)}</p><small>المبلغ المستلم من العملاء</small></div>
      <div class="stat-card"><h3>التكلفة الكلية</h3><p>$${totalCost.toFixed(2)}</p><small>تكلفة شراء المنتجات</small></div>
      <div class="stat-card"><h3>الأرباح الصافية</h3><p>$${netProfit.toFixed(2)}</p><small>بعد خصم التكاليف</small></div>
      <div class="stat-card"><h3>المبلغ المستلم</h3><p>$${receivedAmount.toFixed(2)}</p><small>من العملاء</small></div>
    </div>
    <div class="maintenance-card">
      <div style="display: flex; align-items: center; gap: 15px;">
        <i class="fas fa-tools" style="font-size: 30px; color: #ef4444;"></i>
        <div><h4 style="color: #ef4444;">وضع الصيانة</h4><p style="color: #888;">التحكم بتفعيل أو إيقاف واجهة المستخدمين</p></div>
      </div>
      <button class="maintenance-toggle" onclick="toggleMaintenance()">تفعيل وضع الصيانة</button>
    </div>
    <div class="stats-row">
      <div class="stat-card"><h3>إجمالي المبلغ المدين</h3><p>$${totalDebt.toFixed(2)}</p><div style="margin-top:10px;"><span class="stat-link" onclick="loadSection('debtBalance')">عرض التفاصيل <i class="fas fa-arrow-left"></i></span></div></div>
      <div class="stat-card"><h3>عدد الطلبات هذا الشهر</h3><p>${monthlyOrders}</p><small>${monthRange}</small></div>
    </div>
    <div class="stats-grid" style="grid-template-columns: repeat(4,1fr);">
      <div class="stat-card"><h3>الطلبات قيد الانتظار</h3><p>${pendingOrders}</p><div><span class="stat-link" onclick="loadSection('orders')">إدارة الطلبات <i class="fas fa-arrow-left"></i></span></div></div>
      <div class="stat-card"><h3>المنتجات النشطة</h3><p>${activeProducts}</p></div>
      <div class="stat-card"><h3>عدد المستخدمين</h3><p>${totalUsers}</p><div><span class="stat-link" onclick="loadSection('users')">عرض المستخدمين <i class="fas fa-arrow-left"></i></span></div></div>
      <div class="stat-card"><h3>إجمالي رصيد المستخدمين</h3><p>$${totalUserBalance.toFixed(2)}</p></div>
    </div>
    <div class="stats-grid" style="grid-template-columns: repeat(3,1fr);">
      <div class="stat-card"><h3>طلبات شحن معالجة</h3><p>${processedCharges}</p><div><span class="stat-link" onclick="loadSection('charges')">إدارة طلبات الشحن <i class="fas fa-arrow-left"></i></span></div></div>
      <div class="stat-card"><h3>المستخدمون المسموح لهم برصيد مدين</h3><p>${allowedDebtUsers}</p></div>
      <div class="stat-card"><h3>عدد الطلبات</h3><p>${totalOrders}</p><div><span class="stat-link" onclick="loadSection('orders')">عرض التفاصيل <i class="fas fa-arrow-left"></i></span></div></div>
    </div>
  `;
}

// ===== دوال الأقسام الأخرى (انسخها من ملفات pages السابقة) =====
// يجب نسخ محتوى الدوال التالية من الملفات التي أرسلتها سابقاً:
// loadPaymentMethods, loadCurrencies, loadVipProfit, loadProfitLog, loadUsers, loadDebtBalance, loadTopSpenders, loadOrders, loadCharges, loadMaintenance
// مع تعديلها لتعمل في هذا السياق (إزالة window.addEventListener واستخدام return للـ HTML)

// مثال لـ loadPaymentMethods (يجب أن تعيد HTML):
async function loadPaymentMethods() {
  const records = await window.fetchRecords('payment_methods') || [];
  let html = '<h2>💳 طرق الدفع</h2>';
  html += '<button class="add-btn" onclick="showAddPaymentMethodForm()">➕ إضافة طريقة دفع جديدة</button>';
  html += '<div class="records-grid">';
  if (records.length === 0) {
    html += '<p style="text-align:center;">لا توجد طرق دفع مضافة بعد.</p>';
  } else {
    records.forEach(rec => {
      const f = rec.fields;
      html += `
        <div class="record-card" data-id="${rec.id}">
          <p><strong>${f.name || 'بدون اسم'}</strong></p>
          <p>رقم الحساب: ${f.accountNumber || '-'}</p>
          <p>صاحب الحساب: ${f.accountName || '-'}</p>
          ${f.image ? `<img src="${f.image}" style="max-width:100px;">` : ''}
          <div style="margin-top:10px;">
            <button class="edit-btn" onclick="editPaymentMethod('${rec.id}')">✏️</button>
            <button class="delete-btn" onclick="deletePaymentMethod('${rec.id}')">🗑️</button>
          </div>
        </div>
      `;
    });
  }
  html += '</div>';
  return html;
}

// يجب إضافة جميع الدوال الأخرى (loadCurrencies, loadVipProfit, ...) بنفس الطريقة
// ثم إضافة دوال الإضافة والتعديل والحذف (showAddPaymentMethodForm, savePaymentMethod, ...) كما هي