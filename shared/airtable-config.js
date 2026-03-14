// ==================== Airtable Configuration ====================
// هذا الملف يقرأ المفاتيح من متغيرات البيئة (للاستضافة على Netlify)
// للتجربة المحلية، يمكنك وضع المفاتيح مباشرة (ولكن انتبه للتحذير)

export const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'app2ssSvgAGl1mWWG';
export const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || 'patgPYc0XPvoomHIW.d407970d89d322bd61ea166fa9a32c9f825ca7c523e27bcf54b85e9689119105';

console.log('✅ airtable-config.js loaded (with env support)');
