// ==================== Airtable Service ====================
// هذا الملف يوفر دوال لقراءة وكتابة البيانات من Airtable
import { AIRTABLE_BASE_ID, AIRTABLE_API_KEY } from './airtable-config.js';

const BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

// دالة لجلب جميع السجلات من جدول معين
export async function fetchRecords(tableName) {
  try {
    const response = await fetch(`${BASE_URL}/${tableName}`, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`
      }
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.records; // مصفوفة السجلات
  } catch (error) {
    console.error(`خطأ في جلب البيانات من ${tableName}:`, error);
    throw error;
  }
}

// دالة لإضافة سجل جديد إلى جدول
export async function createRecord(tableName, fields) {
  try {
    const response = await fetch(`${BASE_URL}/${tableName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fields })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data; // السجل المضاف
  } catch (error) {
    console.error(`خطأ في إضافة سجل إلى ${tableName}:`, error);
    throw error;
  }
}

// دالة لتحديث سجل موجود
export async function updateRecord(tableName, recordId, fields) {
  try {
    const response = await fetch(`${BASE_URL}/${tableName}/${recordId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
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
}

// دالة لحذف سجل
export async function deleteRecord(tableName, recordId) {
  try {
    const response = await fetch(`${BASE_URL}/${tableName}/${recordId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`
      }
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data;
  } catch (error) {
    console.error(`خطأ في حذف السجل ${recordId} من ${tableName}:`, error);
    throw error;
  }
}

console.log('✅ airtable-service.js loaded');
