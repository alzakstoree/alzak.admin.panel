// ==================== Airtable Service ====================

const BASE_URL = `https://api.airtable.com/v0/${window.AIRTABLE_BASE_ID}`;
const HEADERS = {
  'Authorization': `Bearer ${window.AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json'
};

// ==================== جلب السجلات ====================
window.fetchRecords = async function(tableName) {

  let allRecords = [];
  let offset = null;

  try {

    do {

      let url = `${BASE_URL}/${tableName}`;

      if (offset) {
        url += `?offset=${offset}`;
      }

      const response = await fetch(url, {
        headers: HEADERS
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error.message);

      allRecords = allRecords.concat(data.records);

      offset = data.offset;

    } while (offset);

    return allRecords;

  } catch (error) {
    console.error(`خطأ في جلب ${tableName}:`, error);
    throw error;
  }

};

// ==================== إضافة سجل ====================
window.createRecord = async function(tableName, fields) {

  try {

    const response = await fetch(`${BASE_URL}/${tableName}`, {
      method: 'POST',
      headers: HEADERS,
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

// ==================== تحديث سجل ====================
window.updateRecord = async function(tableName, recordId, fields) {

  try {

    const response = await fetch(`${BASE_URL}/${tableName}/${recordId}`, {
      method: 'PATCH',
      headers: HEADERS,
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

// ==================== حذف سجل ====================
window.deleteRecord = async function(tableName, recordId) {

  try {

    const response = await fetch(`${BASE_URL}/${tableName}/${recordId}`, {
      method: 'DELETE',
      headers: HEADERS
    });

    const data = await response.json();

    if (data.error) throw new Error(data.error.message);

    return data;

  } catch (error) {

    console.error(`خطأ في حذف السجل ${recordId} من ${tableName}:`, error);
    throw error;

  }

};

console.log("✅ airtable-service.js loaded");