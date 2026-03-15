// ==================== maintenance.js ====================
window.addEventListener('load', async () => {
  await loadMaintenance();
});

async function loadMaintenance() {
  const contentDiv = document.getElementById('contentArea');
  contentDiv.innerHTML = '<p style="text-align:center;">⏳ جاري التحميل...</p>';

  try {
    const records = await window.fetchRecords('settings') || [];
    let mode = false;
    if (records.length > 0) mode = records[0].fields.maintenanceMode || false;
    const html = `
      <h2>🔧 وضع الصيانة</h2>
      <div style="max-width: 400px; margin: 20px auto;">
        <label style="display:flex; align-items:center; gap:10px;">
          <input type="checkbox" id="maintenanceCheck" ${mode ? 'checked' : ''}>
          تفعيل وضع الصيانة
        </label>
        <button class="add-btn" onclick="saveMaintenance()" style="width:100%; margin-top:15px;">حفظ</button>
      </div>
    `;
    contentDiv.innerHTML = html;
  } catch (error) {
    contentDiv.innerHTML = `<p style="color: red;">❌ حدث خطأ: ${error.message}</p>`;
    showToast('فشل تحميل البيانات', 'error');
  }
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
    loadMaintenance();
  } catch (error) {
    showToast('فشل الحفظ', 'error');
  }
};