/**
 * 日期格式化工具模块
 * 支持格式符：YYYY、MM、DD、HH、hh、mm、ss、SSS、AP/ap
 */

/**
 * 日期格式化函数
 * @param {Date|string|number} input - 支持 Date 对象、时间戳、ISO 日期字符串
 * @param {string} [format='YYYY-MM-DD HH:mm:ss'] - 格式模板
 * @returns {string} 格式化后的日期字符串
 */
function dateFormat(input, format = 'YYYY-MM-DD HH:mm:ss') {
  // 处理非法输入
  const date = input instanceof Date ? input : new Date(input);
  if (isNaN(date.getTime())) throw new Error('Invalid date input');

  // 补零函数
  const pad = (num, len = 2) => String(num).padStart(len, '0');

  // 格式符映射表
  const map = {
    YYYY: date.getFullYear(),
    MM: pad(date.getMonth() + 1),
    DD: pad(date.getDate()),
    HH: pad(date.getHours()),
    hh: pad(date.getHours() % 12 || 12),
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
    SSS: pad(date.getMilliseconds(), 3),
    AP: date.getHours() < 12 ? 'AM' : 'PM',
    ap: date.getHours() < 12 ? 'am' : 'pm'
  };

  // 正则替换
  return format.replace(
    /YYYY|MM|DD|HH|hh|mm|ss|SSS|AP|ap/g, 
    match => map[match]
  );
}

// 导出模块（ES6）
export { dateFormat };

// 导出模块（CommonJS）
// module.exports = { dateFormat };