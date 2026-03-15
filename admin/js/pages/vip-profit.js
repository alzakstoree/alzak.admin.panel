// ==================== vip-profit.js ====================
window.addEventListener('load', async () => {
  await loadVipProfit();
});

async function loadVipProfit() {
  const contentDiv = document.getElementById('contentArea');
  contentDiv.innerHTML = '<p style="text-align:center;">⏳ جاري التحميل...</p>';

  try {
    const records = await window.fetchRecords('vip_settings') || [];
    let rate = 0;
    if (records.length > 0) rate = records[0].fields.profitRate || 0;
    const html = `
      <h2>📈 نسبة ربح VIP</h2>
      <div style="max-width: 400px; margin: 20px auto;">
        <input type="number" id="vipRate" value="${rate}" step="0.1" min="0" max="100" style="width:100%; padding:10px; margin-bottom:10px;">
        <button class="add-btn" onclick="saveVipProfit()" style="width:100%;">حفظ</button>
      </div>
    `;
    contentDiv.innerHTML = html;
  } catch (error) {
    contentDiv.innerHTML = `<p style="color: red;">❌ حدث خطأ: ${error.message}</p>`;
    showToast('فشل تحميل البيانات', 'error');
  }
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
    loadVipProfit();
  } catch (error) {
    showToast('فشل الحفظ', 'error');
  }
};