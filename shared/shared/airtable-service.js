// ==================== Airtable Service ====================
const BASE_URL = `https://api.airtable.com/v0/${window.AIRTABLE_BASE_ID}`;

window.fetchRecords = async function(tableName) {
  try {
    const response = await fetch(`${BASE_URL}/${tableName}`, {
      headers: { 'Authorization': `Bearer ${window.AIRTABLE_API_KEY}` }
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.records;
  } catch (error) {
    console.error(`خطأ في جلب ${tableName}:`, error);
    throw error;
  }
};

window.createRecord = async function(tableName, fields) {
  try {
    const response = await fetch(`${BASE_URL}/${tableName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${window.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fields })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data;
  } catch (error) {
    console.error(`خطأ في الإضافة إلى ${tableName}:`, error);
    throw error;
  }
};

window.updateRecord = async function(tableName, recordId, fields) {
  try {
    const response = await fetch(`${BASE_URL}/${tableName}/${recordId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${window.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fields })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data;
  } catch (error) {
    console.error(`خطأ في تحديث السجل ${recordId} في ${tableName}:`, error);
    throw error;
  }
};

window.deleteRecord = async function(tableName, recordId) {
  try {
    const response = await fetch(`${BASE_URL}/${tableName}/${recordId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${window.AIRTABLE_API_KEY}` }
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data;
  } catch (error) {
    console.error(`خطأ في حذف السجل ${recordId} من ${tableName}:`, error);
    throw error;
  }
};

console.log('✅ airtable-service.js loaded');