const ENV_DEV = 'development';
const ENV_PROD = 'production';

const constants = {

  API_VERSION_NAME: '1.0.0',
  VERSIONS: ['1'],

  /**
    * ENV constant
    */

  ENV_DEV: ENV_DEV,
  ENV_PROD: ENV_PROD,

  /**
    * Sync time limit create app
    */
  MIN_TIME_SYNC_ORDER_DEFAULT: 1534611600000,
  MIN_TIME_SYNC_PRODUCT_DEFAULT: 1284609081000,
  MIN_TIME_SYNC_CUSTOMER_DEFAULT: 1284609081000,
  ONE_YEAH_MILISECOND: 1000 * 60 * 60 * 24 * 365,
  ONE_MONTH_MILISECOND: 1000 * 60 * 60 * 24 * 30,
  ONE_DAY_MILISECOND: 1000 * 60 * 60 * 24,
  ONE_HOUR_MILISECOND: 1000 * 60 * 60,
  ONE_MINUTE_MILISECOND: 1000 * 60,
  ONE_DAY_MILISECOND: 1000 * 60 * 60 * 24,
  ONE_HOUR_MILISECOND: 1000 * 60 * 60,

  /**
   * Timezone and format time
   */
  SERVER_TIMEZONE: 'Asia/Bangkok',
  FORMAT_UPDATE_AT_TIME: 'YYYY-MM-DD HH:mm',
  FORMAT_TIME_GMT7: 'YYYY-MM-DD HH:mm:ss',
  ZOHO_FORMAT_TIME_ISO8601: 'YYYY-MM-DDThh:mm:ssTZD',
  ZOHO_FORMAT_DATE: 'YYYY-MM-DD',
  ZOHO_FORMAT_DATE_1: 'DD-MM-YYYY',

  TELE_ADMIN_ID: [279354881, 148220528],
  TELE_GROUP: {
    ERROR: (process.env.NODE_ENV == ENV_PROD) ? -1001301169743 : -1001301169743
  },
  MODEL_NAME: {
  },

  RABBIT_CONST: {
    HZCBM: {
      queue_name: 'hzcbm',
      exchange_name: 'hzcbm_exchange',
    },
    HZCBM_01: {
      queue_name: 'hzcbm01',
      exchange_name: 'hzcbm01_exchange',
    }
  },

  SETTING_ID: {
    setting_address: 'setting_address'
  }
};


module.exports = constants;