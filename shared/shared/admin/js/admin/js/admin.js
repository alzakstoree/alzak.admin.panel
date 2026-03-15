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
      case 'notifications':
        html = '<h2>🔔 إرسال إشعار</h2><p>هذه الصفحة قيد التطوير.</p>';
        break;
      case 'providers':
        html = '<h2>🚚 إدارة المزودين</h2><p>هذه الصفحة قيد التطوير.</p>';
        break;
      case 'design':
        html = '<h2>🎨 التصميم</h2><p>هذه الصفحة قيد التطوير.</p>';
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

// ===== دوال تحميل الأقسام =====
async function loadDashboard() {
  const products = await window.fetchRecords('products');
  const users = await window.fetchRecords('users');
  const orders = await window.fetchRecords('orders');
  
  const totalProducts = products.length;
  const totalUsers = users.length;
  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, o) => sum + (o.fields.price || 0), 0);

  return `
    <h2>📊 لوحة القيادة</h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
      <div class="stat-card">
        <h3>إجمالي المنتجات</h3>
        <p style="font-size: 2em;">${totalProducts}</p>
      </div>
      <div class="stat-card">
        <h3>إجمالي المستخدمين</h3>
        <p style="font-size: 2em;">${totalUsers}</p>
      </div>
      <div class="stat-card">
        <h3>إجمالي الطلبات</h3>
        <p style="font-size: 2em;">${totalOrders}</p>
      </div>
      <div class="stat-card">
        <h3>إجمالي المبيعات</h3>
        <p style="font-size: 2em;">$${totalSales.toFixed(2)}</p>
      </div>
    </div>
  `;
}

async function loadPaymentMethods() {
  const records = await window.fetchRecords('payment_methods');
  let html = '<h2>💳 طرق الدفع</h2>';
  html += '<button class="add-btn" onclick="showAddPaymentMethodForm()">➕ إضافة طريقة دفع</button>';
  html += '<div class="records-grid">';
  
  records.forEach(rec => {
    const f = rec.fields;
    html += `
      <div class="record-card" data-id="${rec.id}">
        <p><strong>${f.name || 'بدون اسم'}</strong></p>
        <p>رقم الحساب: ${f.accountNumber || '-'}</p>
        <p>صاحب الحساب: ${f.accountName || '-'}</p>
        ${f.image ? `<img src="${f.image}" style="max-width:100px;">` : ''}
        <br>
        <button onclick="editPaymentMethod('${rec.id}')">✏️ تعديل</button>
        <button onclick="deletePaymentMethod('${rec.id}')">🗑️ حذف</button>
      </div>
    `;
  });
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

async function loadCurrencies() {
  const records = await window.fetchRecords('currencies');
  let html = '<h2>💰 العملات</h2>';
  html += '<button class="add-btn" onclick="showAddCurrencyForm()">➕ إضافة عملة</button>';
  html += '<table><tr><th>الاسم</th><th>الرمز</th><th>سعر الصرف</th><th>إجراءات</th></tr>';
  records.forEach(rec => {
    const f = rec.fields;
    html += `
      <tr>
        <td>${f.name || '-'}</td>
        <td>${f.symbol || '-'}</td>
        <td>${f.exchangeRate || 1}</td>
        <td>
          <button onclick="editCurrency('${rec.id}')">✏️</button>
          <button onclick="deleteCurrency('${rec.id}')">🗑️</button>
        </td>
      </tr>
    `;
  });
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

async function loadVipProfit() {
  const records = await window.fetchRecords('vip_settings');
  let rate = 0;
  if (records.length > 0) rate = records[0].fields.profitRate || 0;
  return `
    <h2>📈 نسبة ربح VIP</h2>
    <input type="number" id="vipRate" value="${rate}" step="0.1" min="0" max="100">
    <button onclick="saveVipProfit()">حفظ</button>
  `;
}

window.saveVipProfit = async function() {
  const rate = parseFloat(document.getElementById('vipRate')?.value) || 0;
  try {
    const records = await window.fetchRecords('vip_settings');
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

async function loadProfitLog() {
  const orders = await window.fetchRecords('orders');
  const totalSales = orders.reduce((sum, o) => sum + (o.fields.price || 0), 0);
  return `
    <h2>💰 سجل الأرباح</h2>
    <p>إجمالي المبيعات: $${totalSales.toFixed(2)}</p>
    <p>عدد الطلبات: ${orders.length}</p>
  `;
}

async function loadUsers() {
  const users = await window.fetchRecords('users');
  let html = '<h2>👥 المستخدمين</h2>';
  html += '<table><tr><th>البريد</th><th>الاسم</th><th>رصيد المحفظة</th><th>الرصيد المدين</th><th>السماح بالدين</th></tr>';
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
  html += '</table>';
  return html;
}

async function loadDebtBalance() {
  const users = await window.fetchRecords('users');
  const debtors = users.filter(u => (u.fields.debtBalance || 0) > 0);
  let html = '<h2>💸 الرصيد المدين</h2>';
  html += '<table><tr><th>المستخدم</th><th>الرصيد المدين</th></tr>';
  debtors.forEach(u => {
    html += `<tr><td>${u.fields.email}</td><td>$${u.fields.debtBalance}</td></tr>`;
  });
  html += '</table>';
  return html;
}

async function loadTopSpenders() {
  const orders = await window.fetchRecords('orders');
  const spending = {};
  orders.forEach(o => {
    const email = o.fields.userEmail;
    const price = o.fields.price || 0;
    if (email) spending[email] = (spending[email] || 0) + price;
  });
  const sorted = Object.entries(spending).sort((a, b) => b[1] - a[1]).slice(0, 10);
  let html = '<h2>🏆 المستخدمون الأكثر صرفاً</h2><table><tr><th>البريد</th><th>الإجمالي</th></tr>';
  sorted.forEach(([email, total]) => {
    html += `<tr><td>${email}</td><td>$${total.toFixed(2)}</td></tr>`;
  });
  html += '</table>';
  return html;
}

async function loadMaintenance() {
  const records = await window.fetchRecords('settings');
  let mode = false;
  if (records.length > 0) mode = records[0].fields.maintenanceMode || false;
  return `
    <h2>🔧 وضع الصيانة</h2>
    <label>
      <input type="checkbox" id="maintenanceCheck" ${mode ? 'checked' : ''}>
      تفعيل وضع الصيانة
    </label>
    <button onclick="saveMaintenance()">حفظ</button>
  `;
}

window.saveMaintenance = async function() {
  const enabled = document.getElementById('maintenanceCheck')?.checked || false;
  try {
    const records = await window.fetchRecords('settings');
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

// دوال مؤقتة للباقي
window.showVipUsers = function() { showToast('🚧 إدارة الدولاء قيد التطوير', 'info'); };
window.showReferrals = function() { showToast('🚧 الإجالات قيد التطوير', 'info'); };
window.showDesign = function() { showToast('🚧 التصميم قيد التطوير', 'info'); };
window.showOrderMessages = function() { showToast('🚧 رسائل الطلب قيد التطوير', 'info'); };
window.showOrderManagement = function() { showToast('🚧 إدارة الترتيب قيد التطوير', 'info'); };
window.showContactMethods = function() { showToast('🚧 وسائل التواصل قيد التطوير', 'info'); };
window.showAdminAccounts = function() { showToast('🚧 حسابات الإدارة قيد التطوير', 'info'); };
window.showTwoFactor = function() { showToast('🚧 الحقوق بخطوتين قيد التطوير', 'info'); };

console.log('✅ admin.js loaded');