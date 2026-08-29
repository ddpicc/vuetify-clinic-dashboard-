function normalizePhone(value) {
  if (value === null || value === undefined) return null;

  let phone = String(value).trim();
  if (!phone) return null;

  phone = phone.replace(/[\s-]+/g, '');
  phone = phone.replace(/^\+86/, '').replace(/^0086/, '');
  if (phone.startsWith('86') && phone.length === 13) phone = phone.slice(2);

  if (!/^\d+$/.test(phone)) throw new Error('手机号格式无效');
  if (/^0+$/.test(phone)) return null;
  if (phone.length < 5 || phone.length > 20) throw new Error('手机号格式无效');

  return phone;
}

module.exports = { normalizePhone };
