// ==================== charges.js ====================
window.addEventListener('load', async () => {
  await loadCharges();
});

async function loadCharges() {
  const contentDiv = document.getElementById('contentArea');
  contentDiv.innerHTML = '<p style="text-align:center;">⏳ جاري التحميل...</p>';

  try {
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
    contentDiv.innerHTML = html;
  } catch (error) {
    contentDiv.innerHTML = `<p style="color: red;">❌ حدث خطأ: ${error.message}</p>`;
    showToast('فشل تحميل البيانات', 'error');
  }
}