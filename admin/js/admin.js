// ==================== admin.js (النسخة الكاملة النهائية) ====================

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
      // الأقسام الأخرى (قيد التطوير)
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

// ==================== لوحة القيادة ====================
async function loadDashboard() {
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
      <div class="stat-card"><h3>إجمالي المبلغ المدين</h3><p>$${totalDebt.toFixed(2)}</p><div style="margin-top:10px;"><span class="stat-link" onclick="loadSection('debtBalance')">عرض تفاصيل الرصيد المدين <i class="fas fa-arrow-left"></i></span></div></div>
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

// ==================== طرق الدفع ====================
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
            <button class="edit-btn" onclick="editPaymentMethod('${rec.id}')">✏️ تعديل</button>
            <button class="delete-btn" onclick="deletePaymentMethod('${rec.id}')">🗑️ حذف</button>
          </div>
        </div>
      `;
    });
  }
  html += '</div>';
  return html;
}

window.showAddPaymentMethodForm = function() {
  const form = `
    <h3>➕ إضافة طريقة دفع</h3>
    <input id="pmName" placeholder="الاسم">
    <input id="pmNumber" placeholder="رقم الحساب/المحفظة">
    <input id="pmImage" placeholder="رابط الصورة (اختياري)">
    <input id="pmAccountName" placeholder="اسم صاحب الحساب (اختياري)">
    <button onclick="savePaymentMethod()">حفظ</button>
  `;
  showModal('genericModal', form);
};

window.savePaymentMethod = async function() {
  const name = document.getElementById('pmName')?.value;
  const number = document.getElementById('pmNumber')?.value;
  const image = document.getElementById('pmImage')?.value;
  const accountName = document.getElementById('pmAccountName')?.value;
  if (!name || !number) return showToast('الرجاء إدخال الاسم والرقم', 'error');

  try {
    await window.createRecord('payment_methods', {
      name,
      accountNumber: number,
      image: image || '',
      accountName: accountName || ''
    });
    showToast('✅ تمت الإضافة');
    closeModal('genericModal');
    loadSection('paymentMethods');
  } catch (error) {
    showToast('فشلت الإضافة', 'error');
  }
};

window.editPaymentMethod = async function(id) {
  const records = await window.fetchRecords('payment_methods') || [];
  const rec = records.find(r => r.id === id);
  if (!rec) return showToast('غير موجود', 'error');
  const f = rec.fields;
  const form = `
    <h3>✏️ تعديل طريقة دفع</h3>
    <input id="pmNameEdit" value="${f.name || ''}" placeholder="الاسم">
    <input id="pmNumberEdit" value="${f.accountNumber || ''}" placeholder="رقم الحساب">
    <input id="pmImageEdit" value="${f.image || ''}" placeholder="رابط الصورة">
    <input id="pmAccountNameEdit" value="${f.accountName || ''}" placeholder="اسم صاحب الحساب">
    <button onclick="updatePaymentMethod('${id}')">تحديث</button>
  `;
  showModal('genericModal', form);
};

window.updatePaymentMethod = async function(id) {
  const name = document.getElementById('pmNameEdit')?.value;
  const number = document.getElementById('pmNumberEdit')?.value;
  const image = document.getElementById('pmImageEdit')?.value;
  const accountName = document.getElementById('pmAccountNameEdit')?.value;
  if (!name || !number) return showToast('الرجاء إدخال الاسم والرقم', 'error');

  try {
    await window.updateRecord('payment_methods', id, {
      name,
      accountNumber: number,
      image: image || '',
      accountName: accountName || ''
    });
    showToast('✅ تم التحديث');
    closeModal('genericModal');
    loadSection('paymentMethods');
  } catch (error) {
    showToast('فشل التحديث', 'error');
  }
};

window.deletePaymentMethod = async function(id) {
  if (!confirm('هل أنت متأكد من الحذف؟')) return;
  try {
    await window.deleteRecord('payment_methods', id);
    showToast('✅ تم الحذف');
    loadSection('paymentMethods');
  } catch (error) {
    showToast('فشل الحذف', 'error');
  }
};

// ==================== العملات ====================
async function loadCurrencies() {
  const records = await window.fetchRecords('currencies') || [];
  let html = '<h2>💰 العملات</h2>';
  html += '<button class="add-btn" onclick="showAddCurrencyForm()">➕ إضافة عملة</button>';
  html += '<table><tr><th>الاسم</th><th>الرمز</th><th>سعر الصرف</th><th>إجراءات</th></tr>';
  if (records.length === 0) {
    html += '<tr><td colspan="4" style="text-align:center;">لا توجد عملات</td></tr>';
  } else {
    records.forEach(rec => {
      const f = rec.fields;
      html += `
        <tr>
          <td>${f.name || '-'}</td>
          <td>${f.symbol || '-'}</td>
          <td>${f.exchangeRate || 1}</td>
          <td>
            <button class="edit-btn" onclick="editCurrency('${rec.id}')">✏️</button>
            <button class="delete-btn" onclick="deleteCurrency('${rec.id}')">🗑️</button>
          </td>
        </tr>
      `;
    });
  }
  html += '</table>';
  return html;
}

window.showAddCurrencyForm = function() {
  const form = `
    <h3>➕ إضافة عملة</h3>
    <input id="curName" placeholder="اسم العملة">
    <input id="curSymbol" placeholder="الرمز">
    <input id="curRate" placeholder="سعر الصرف" value="1">
    <button onclick="saveCurrency()">حفظ</button>
  `;
  showModal('genericModal', form);
};

window.saveCurrency = async function() {
  const name = document.getElementById('curName')?.value;
  const symbol = document.getElementById('curSymbol')?.value;
  const rate = parseFloat(document.getElementById('curRate')?.value) || 1;
  if (!name || !symbol) return showToast('الرجاء إدخال الاسم والرمز', 'error');

  try {
    await window.createRecord('currencies', { name, symbol, exchangeRate: rate });
    showToast('✅ تمت الإضافة');
    closeModal('genericModal');
    loadSection('currencies');
  } catch (error) {
    showToast('فشل الإضافة', 'error');
  }
};

window.editCurrency = async function(id) {
  const records = await window.fetchRecords('currencies') || [];
  const rec = records.find(r => r.id === id);
  if (!rec) return showToast('غير موجود', 'error');
  const f = rec.fields;
  const form = `
    <h3>✏️ تعديل عملة</h3>
    <input id="curNameEdit" value="${f.name || ''}" placeholder="اسم العملة">
    <input id="curSymbolEdit" value="${f.symbol || ''}" placeholder="الرمز">
    <input id="curRateEdit" value="${f.exchangeRate || 1}" placeholder="سعر الصرف">
    <button onclick="updateCurrency('${id}')">تحديث</button>
  `;
  showModal('genericModal', form);
};

window.updateCurrency = async function(id) {
  const name = document.getElementById('curNameEdit')?.value;
  const symbol = document.getElementById('curSymbolEdit')?.value;
  const rate = parseFloat(document.getElementById('curRateEdit')?.value) || 1;
  if (!name || !symbol) return showToast('الرجاء إدخال الاسم والرمز', 'error');

  try {
    await window.updateRecord('currencies', id, { name, symbol, exchangeRate: rate });
    showToast('✅ تم التحديث');
    closeModal('genericModal');
    loadSection('currencies');
  } catch (error) {
    showToast('فشل التحديث', 'error');
  }
};

window.deleteCurrency = async function(id) {
  if (!confirm('حذف العملة؟')) return;
  try {
    await window.deleteRecord('currencies', id);
    showToast('✅ تم الحذف');
    loadSection('currencies');
  } catch (error) {
    showToast('فشل الحذف', 'error');
  }
};

// ==================== نسبة ربح VIP ====================
async function loadVipProfit() {
  const records = await window.fetchRecords('vip_settings') || [];
  let rate = 0;
  if (records.length > 0) rate = records[0].fields.profitRate || 0;
  return `
    <h2>📈 نسبة ربح VIP</h2>
    <div style="max-width: 400px; margin: 20px auto;">
      <input type="number" id="vipRate" value="${rate}" step="0.1" min="0" max="100" style="width:100%; padding:10px; margin-bottom:10px;">
      <button class="add-btn" onclick="saveVipProfit()" style="width:100%;">حفظ</button>
    </div>
  `;
}

window.saveVipProfit = async function() {
  const rate = parseFloat(document.getElementById('vipRate')?.value) || 0;
  try {
    const records = await window.fetchRecords('vip_settings') || [];
    if (records.length > 0) {
      await window.updateRecord('vip_settings', records[0].id, { profitRate: rate });
    } else {
      await window.createRecord('vip_settings', { profitRate: rate });
    }
    showToast('✅ تم الحفظ');
    loadSection('vipProfit');
  } catch (error) {
    showToast('فشل الحفظ', 'error');
  }
};

// ==================== سجل الأرباح ====================
async function loadProfitLog() {
  const orders = await window.fetchRecords('orders') || [];
  const totalSales = orders.reduce((sum, o) => sum + (o.fields.price || 0), 0);
  return `
    <h2>💰 سجل الأرباح</h2>
    <div class="stats-grid" style="grid-template-columns: 1fr 1fr;">
      <div class="stat-card"><h3>إجمالي المبيعات</h3><p>$${totalSales.toFixed(2)}</p></div>
      <div class="stat-card"><h3>عدد الطلبات</h3><p>${orders.length}</p></div>
    </div>
  `;
}

// ==================== المستخدمين ====================
async function loadUsers() {
  const users = await window.fetchRecords('users') || [];
  let html = '<h2>👥 المستخدمين</h2>';
  html += '<table><tr><th>البريد</th><th>الاسم</th><th>رصيد المحفظة</th><th>الرصيد المدين</th><th>السماح بالدين</th></tr>';
  if (users.length === 0) {
    html += '<tr><td colspan="5" style="text-align:center;">لا يوجد مستخدمين</td></tr>';
  } else {
    users.forEach(u => {
      const f = u.fields;
      html += `
        <tr>
          <td>${f.email || '-'}</td>
          <td>${f.name || '-'}</td>
          <td>$${f.walletBalance || 0}</td>
          <td>$${f.debtBalance || 0}</td>
          <td>${f.allowedDebt ? '✅' : '❌'}</td>
        </tr>
      `;
    });
  }
  html += '</table>';
  return html;
}

// ==================== الرصيد المدين ====================
async function loadDebtBalance() {
  const users = await window.fetchRecords('users') || [];
  const debtors = users.filter(u => (u.fields.debtBalance || 0) > 0);
  let html = '<h2>💸 الرصيد المدين</h2>';
  html += '<table><tr><th>المستخدم</th><th>الرصيد المدين</th></tr>';
  if (debtors.length === 0) {
    html += '<tr><td colspan="2" style="text-align:center;">لا يوجد مستخدمين مدينين</td></tr>';
  } else {
    debtors.forEach(u => {
      html += `<tr><td>${u.fields.email}</td><td>$${u.fields.debtBalance}</td></tr>`;
    });
  }
  html += '</table>';
  return html;
}

// ==================== المستخدمون الأكثر صرفاً ====================
async function loadTopSpenders() {
  const orders = await window.fetchRecords('orders') || [];
  const spending = {};
  orders.forEach(o => {
    const email = o.fields.userEmail;
    const price = o.fields.price || 0;
    if (email) spending[email] = (spending[email] || 0) + price;
  });
  const sorted = Object.entries(spending).sort((a, b) => b[1] - a[1]).slice(0, 10);
  let html = '<h2>🏆 المستخدمون الأكثر صرفاً</h2>';
  html += '<table><tr><th>البريد</th><th>الإجمالي</th></tr>';
  if (sorted.length === 0) {
    html += '<tr><td colspan="2" style="text-align:center;">لا توجد بيانات</td></tr>';
  } else {
    sorted.forEach(([email, total]) => {
      html += `<tr><td>${email}</td><td>$${total.toFixed(2)}</td></tr>`;
    });
  }
  html += '</table>';
  return html;
}

// ==================== الطلبات ====================
async function loadOrders() {
  const orders = await window.fetchRecords('orders') || [];
  let html = '<h2>📦 الطلبات</h2>';
  html += '<table><tr><th>المنتج</th><th>السعر</th><th>المستخدم</th><th>الحالة</th><th>التاريخ</th></tr>';
  if (orders.length === 0) {
    html += '<tr><td colspan="5" style="text-align:center;">لا توجد طلبات</td></tr>';
  } else {
    orders.forEach(o => {
      const f = o.fields;
      html += `
        <tr>
          <td>${f.product || '-'}</td>
          <td>$${f.price || 0}</td>
          <td>${f.userEmail || '-'}</td>
          <td>${f.status === 'pending' ? '⏳ قيد الانتظار' : '✅ مكتمل'}</td>
          <td>${new Date(f.createdAt).toLocaleDateString()}</td>
        </tr>
      `;
    });
  }
  html += '</table>';
  return html;
}

// ==================== طلبات الشحن ====================
async function loadCharges() {
  const charges = await window.fetchRecords('charges') || [];
  let html = '<h2>💰 طلبات الشحن</h2>';
  html += '<table><tr><th>المستخدم</th><th>المبلغ</th><th>الحالة</th><th>التاريخ</th></tr>';
  if (charges.length === 0) {
    html += '<tr><td colspan="4" style="text-align:center;">لا توجد طلبات شحن</td></tr>';
  } else {
    charges.forEach(c => {
      const f = c.fields;
      html += `
        <tr>
          <td>${f.userEmail || '-'}</td>
          <td>$${f.amount || 0}</td>
          <td>${f.status === 'pending' ? '⏳ قيد الانتظار' : '✅ مكتمل'}</td>
          <td>${new Date(f.date).toLocaleDateString()}</td>
        </tr>
      `;
    });
  }
  html += '</table>';
  return html;
}

// ==================== وضع الصيانة ====================
async function loadMaintenance() {
  const records = await window.fetchRecords('settings') || [];
  let mode = false;
  if (records.length > 0) mode = records[0].fields.maintenanceMode || false;
  return `
    <h2>🔧 وضع الصيانة</h2>
    <div style="max-width: 400px; margin: 20px auto;">
      <label style="display:flex; align-items:center; gap:10px;">
        <input type="checkbox" id="maintenanceCheck" ${mode ? 'checked' : ''}>
        تفعيل وضع الصيانة
      </label>
      <button class="add-btn" onclick="saveMaintenance()" style="width:100%; margin-top:15px;">حفظ</button>
    </div>
  `;
}

window.saveMaintenance = async function() {
  const enabled = document.getElementById('maintenanceCheck')?.checked || false;
  try {
    const records = await window.fetchRecords('settings') || [];
    if (records.length > 0) {
      await window.updateRecord('settings', records[0].id, { maintenanceMode: enabled });
    } else {
      await window.createRecord('settings', { maintenanceMode: enabled });
    }
    showToast('✅ تم الحفظ');
    loadSection('maintenance');
  } catch (error) {
    showToast('فشل الحفظ', 'error');
  }
};

// دالة تبديل وضع الصيانة من لوحة القيادة
window.toggleMaintenance = async function() {
  try {
    const records = await window.fetchRecords('settings') || [];
    const currentMode = records.length > 0 ? (records[0].fields.maintenanceMode || false) : false;
    const newMode = !currentMode;
    
    if (records.length > 0) {
      await window.updateRecord('settings', records[0].id, { maintenanceMode: newMode });
    } else {
      await window.createRecord('settings', { maintenanceMode: newMode });
    }
    
    showToast(newMode ? '🔧 وضع الصيانة مفعل' : '✅ وضع الصيانة معطل', 'info');
    const maintBtn = document.querySelector('.maintenance-toggle');
    if (maintBtn) maintBtn.textContent = newMode ? 'تعطيل وضع الصيانة' : 'تفعيل وضع الصيانة';
    // إعادة تحميل لوحة القيادة لتحديث حالة الزر
    loadSection('dashboard');
  } catch (error) {
    showToast('فشل تبديل وضع الصيانة', 'error');
  }
};

console.log('✅ admin.js loaded');