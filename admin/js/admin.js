// ==================== admin.js (نسخة نهائية مع إحصائيات كاملة) ====================
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
      case 'notifications':
        html = '<h2>🔔 إرسال إشعار</h2><p>هذه الصفحة قيد التطوير.</p>';
        break;
      case 'providers':
        html = '<h2>🚚 إدارة المزودين</h2><p>هذه الصفحة قيد التطوير.</p>';
        break;
      case 'import':
        html = '<h2>📦 استيراد منتجات</h2><p>هذه الصفحة قيد التطوير.</p>';
        break;
      case 'maintenance':
        html = await loadMaintenance();
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

// ===== الصفحة الرئيسية (لوحة القيادة) بالإحصائيات الكاملة =====
async function loadDashboard() {
  try {
    // جلب جميع البيانات المطلوبة من Airtable
    const products = await window.fetchRecords('products') || [];
    const users = await window.fetchRecords('users') || [];
    const orders = await window.fetchRecords('orders') || [];
    const charges = await window.fetchRecords('charges') || [];

    // إحصائيات المنتجات
    const activeProducts = products.length;

    // إحصائيات المستخدمين
    const totalUsers = users.length;
    const totalUserBalance = users.reduce((sum, u) => sum + (u.fields.walletBalance || 0), 0);
    const allowedDebtUsers = users.filter(u => u.fields.allowedDebt).length;

    // إحصائيات الطلبات
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.fields.status === 'pending').length;
    const totalSales = orders.reduce((sum, o) => sum + (o.fields.price || 0), 0);

    // عدد الطلبات هذا الشهر
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
    const monthlyOrders = orders.filter(o => 
      o.fields.createdAt >= startOfMonth && o.fields.createdAt <= endOfMonth
    ).length;

    // تنسيق التاريخ للعرض
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const monthRange = `${lastDay.toLocaleDateString()} – ${firstDay.toLocaleDateString()}`;

    // إحصائيات الشحن
    const processedCharges = charges.filter(c => c.fields.status === 'completed').length;

    // إحصائيات الدين
    const totalDebt = users.reduce((sum, u) => sum + (u.fields.debtBalance || 0), 0);

    // التكلفة الكلية (مثال افتراضي، يمكن تعديله حسب بياناتك)
    const totalCost = 0; // سيتم تحديثه لاحقاً إذا كان لديك حقل cost

    // الأرباح الصافية
    const netProfit = totalSales - totalCost;

    // المبلغ المستلم (نفترض أنه نفس totalSales)
    const receivedAmount = totalSales;

    return `
      <h2>📊 لوحة القيادة</h2>
      
      <!-- الصف الأول: إجمالي المبيعات، التكلفة الكلية، الأرباح الصافية، المبلغ المستلم -->
      <div class="stats-grid" style="grid-template-columns: repeat(4, 1fr);">
        <div class="stat-card">
          <h3>إجمالي المبيعات</h3>
          <p>$${totalSales.toFixed(2)}</p>
          <small>المبلغ المستلم من العملاء</small>
        </div>
        <div class="stat-card">
          <h3>التكلفة الكلية</h3>
          <p>$${totalCost.toFixed(2)}</p>
          <small>تكلفة شراء المنتجات</small>
        </div>
        <div class="stat-card">
          <h3>الأرباح الصافية</h3>
          <p>$${netProfit.toFixed(2)}</p>
          <small>بعد خصم التكاليف</small>
        </div>
        <div class="stat-card">
          <h3>المبلغ المستلم</h3>
          <p>$${receivedAmount.toFixed(2)}</p>
          <small>من العملاء</small>
        </div>
      </div>

      <!-- بطاقة وضع الصيانة -->
      <div class="maintenance-card" style="background: #111; border: 2px solid #ef4444; border-radius: 20px; padding: 20px; margin: 20px 0; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 15px;">
          <i class="fas fa-tools" style="font-size: 30px; color: #ef4444;"></i>
          <div>
            <h4 style="color: #ef4444; margin-bottom: 5px;">وضع الصيانة</h4>
            <p style="color: #888; font-size: 12px;">التحكم بتفعيل أو إيقاف واجهة المستخدمين</p>
          </div>
        </div>
        <button class="maintenance-toggle" onclick="toggleMaintenance()" style="background: #ef4444; color: #fff; border: none; border-radius: 30px; padding: 10px 25px; font-weight: 700; cursor: pointer;">
          تفعيل وضع الصيانة
        </button>
      </div>

      <!-- الصف الثاني: إجمالي المبلغ المدين + عدد الطلبات هذا الشهر -->
      <div class="stats-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
        <div class="stat-card">
          <h3>إجمالي المبلغ المدين</h3>
          <p>$${totalDebt.toFixed(2)}</p>
          <div style="margin-top: 10px;">
            <span class="stat-link" onclick="loadSection('debtBalance')" style="color: #fbbf24; cursor: pointer;">
              عرض تفاصيل الرصيد المدين <i class="fas fa-arrow-left"></i>
            </span>
          </div>
        </div>
        <div class="stat-card">
          <h3>عدد الطلبات هذا الشهر</h3>
          <p>${monthlyOrders}</p>
          <small>${monthRange}</small>
        </div>
      </div>

      <!-- الصف الثالث: بطاقات متعددة -->
      <div class="stats-grid" style="grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 15px;">
        <div class="stat-card">
          <h3>الطلبات قيد الانتظار</h3>
          <p>${pendingOrders}</p>
          <div>
            <span class="stat-link" onclick="loadSection('orders')" style="color: #fbbf24; cursor: pointer;">
              إدارة الطلبات <i class="fas fa-arrow-left"></i>
            </span>
          </div>
        </div>
        <div class="stat-card">
          <h3>المنتجات النشطة</h3>
          <p>${activeProducts}</p>
        </div>
        <div class="stat-card">
          <h3>عدد المستخدمين</h3>
          <p>${totalUsers}</p>
          <div>
            <span class="stat-link" onclick="loadSection('users')" style="color: #fbbf24; cursor: pointer;">
              عرض المستخدمين <i class="fas fa-arrow-left"></i>
            </span>
          </div>
        </div>
        <div class="stat-card">
          <h3>إجمالي رصيد المستخدمين</h3>
          <p>$${totalUserBalance.toFixed(2)}</p>
        </div>
      </div>

      <!-- الصف الرابع: المزيد من البطاقات -->
      <div class="stats-grid" style="grid-template-columns: repeat(3, 1fr); gap: 15px;">
        <div class="stat-card">
          <h3>طلبات شحن معالجة</h3>
          <p>${processedCharges}</p>
          <div>
            <span class="stat-link" onclick="loadSection('charges')" style="color: #fbbf24; cursor: pointer;">
              إدارة طلبات الشحن <i class="fas fa-arrow-left"></i>
            </span>
          </div>
        </div>
        <div class="stat-card">
          <h3>المستخدمون المسموح لهم برصيد مدين</h3>
          <p>${allowedDebtUsers}</p>
        </div>
        <div class="stat-card">
          <h3>عدد الطلبات</h3>
          <p>${totalOrders}</p>
          <div>
            <span class="stat-link" onclick="loadSection('orders')" style="color: #fbbf24; cursor: pointer;">
              عرض التفاصيل <i class="fas fa-arrow-left"></i>
            </span>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('خطأ في تحميل لوحة القيادة:', error);
    return '<p style="color: red;">❌ حدث خطأ في تحميل الإحصائيات</p>';
  }
};

// ===== باقي دوال الأقسام (كما هي سابقاً) =====
// طرق الدفع، العملات، نسبة VIP، سجل الأرباح، المستخدمين، الرصيد المدين، الأكثر صرفاً، وضع الصيانة
// (لن أكررها هنا للاختصار، لكنها موجودة في الكود السابق ويجب الاحتفاظ بها)

// دوال مؤقتة للباقي
window.showVipUsers = function() { showToast('🚧 إدارة الدولاء قيد التطوير', 'info'); };
window.showReferrals = function() { showToast('🚧 الإجالات قيد التطوير', 'info'); };
window.showDesign = function() { showToast('🚧 التصميم قيد التطوير', 'info'); };
window.showOrderMessages = function() { showToast('🚧 رسائل الطلب قيد التطوير', 'info'); };
window.showOrderManagement = function() { showToast('🚧 إدارة الترتيب قيد التطوير', 'info'); };
window.showContactMethods = function() { showToast('🚧 وسائل التواصل قيد التطوير', 'info'); };
window.showAdminAccounts = function() { showToast('🚧 حسابات الإدارة قيد التطوير', 'info'); };
window.showTwoFactor = function() { showToast('🚧 الحقوق بخطوتين قيد التطوير', 'info'); };