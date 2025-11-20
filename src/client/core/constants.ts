/*export const baseDomains = Object.freeze({
  FE: 'https://fe.setadiran.ir',
  GETWAY: 'https://gw.setadiran.ir/api',
  PORTAL: 'https://sso2.setadiran.ir/portal',
});
export const AucModules = Object.freeze({
  BOARD: 'centralboard',
  PROPOSAL: 'setadproposal',
  ITEM: 'item',
});
export const AppendixType = Object.freeze({
  AUCTION_ITEMS_CODE: 4426,
  AUCTION_ITEMS_PHOTOS_CODE: 4421,
  ATTACHMENT_CODE: 1122,
  NEWSPAPER_ADVERTISEMENT_CODE: 1911,
  SPECIALIST_OPINION_ATTACHMENT_CODE: 7455,
});
export const PeymentType = Object.freeze({
  PAY_FOR_DEPOSIT: 181,
  PAY_FOR_DIFF_PAYMENT: 182,
  PAY_FOR_DOC: 183,
});*/

export const CLASSIFICATION_IDS = Object.freeze({
  GHOVE: [80901, 80902, 80903], // قوه قضاییه
  EJRA: [80901], // اجرای احکام
  SABT: [80902], // اجرای ثبت
  BANKRUPTCY: [80903], // اداره تصفیه امور ورشکستگی
});

export enum AppTagCode {
  EPROC = 1, // خرید
  ETEND = 2, // مناقصه
  EAUC = 3, // مزایده
}

export enum AppType {
  EPROC = 951,
  ETEND = 957,
  EAUC = 955,
}

export enum EAucTagCode {
  AUC = 31, // اموال منقول
  IMV = 32, // اموال غیر منقول
  RENTAL = 33, // اجاره
  ONLINE = 34,
  ONLINE_GHOVEH = 341, // مزایده قوه قضاییه
  ONLINE_TAMLIKI = 342, // حراج اموال تملیکی
  ONLINE_OTHER = 343, // حراج دستگاه ها
  MINOR = 35, // جزئی
}

export enum EAucTagType {
  AUC = 1061,
  IMV = 1062,
  RENTAL = 1065,
  ONLINE = 1063,
  ONLINE_GHOVEH = 1063,
  ONLINE_TAMLIKI = 1063,
  ONLINE_OTHER = 1063,
  MINOR = 1066,
}

export enum EtendTagType {
  EVALUATION_QUALITY_FOR_PUBLIC_ETENT = 4120, // ارزیابی کیفی برای مناقصه عمومی
  PUBLIC_ETEND = 4121, // مناقصه عمومی
  EVALUATION_QUALITY_FOR_SHORT_LIST = 4123, // ارزیابی کیفی برای لیست کوتاه
  PUBLIC_ETEND_CUNCURRENT_WITH_PUBLIC_ETEND = 4128, //  مناقصه عمومی همزمان با  ارزیابی
  CONSULTATION_EVALUATION_QUALITY = 4130, // خرید خدمات مشاوره
  EVALUATION_QUALIFICATION = 4134, // ارزیابی صلاحیت
}
export enum EprocTagType {
  GOODS = 1431, // کالا
  SERVICE = 1432, // خدمت
  GOODS_AND_SERVICE = 1435, // خدمت/کالا
}

export enum AucState {
  AUC_DECLARATION_WINNER = 1199,
  AUC_EXPIRATION_RESPONSE = 1117,
  AUC_APPROVAL_REFORMS = 1169,
  AUC_REGISTERED = 1111,
  AUC_PERFORMING = 1166,
  AUC_EDIT_DIAGNOSIS_AUTHORITY = 1114,
  AUC_HELD = 1167,
  AUC_CANCELED = 1118,
  AUC_CONFIRMED_SIGNED = 1115,
  AUC_OPENING_OFFERS = 1110,
  AUC_AWAITING_CONFIRMATION = 1112,
  AUC_EDIT_STEP = 1113,
  AUC_WAITING_WINNER = 1198,
  AUC_REFORM_STEP = 1168,
  AUC_PUBLISHED = 1116,
  AUC_WAITING_REOPENING = 1119,
  ONLINE_AUCTION_SHIFT_ONE = 1013335,
  ONLINE_AUCTION_SHIFT_TWO = 1013336,
  ONLINE_AUCTION_SHIFT_ZERO = 1013355,
  DOCUMENT_STATE_TRUE = 1013339,
  DOCUMENT_STATE_FALSE = 1013340,
  OWNERSHIPTYPETRUE = 1013337,
  OWNERSHIPTYPEFALSE = 1013338,
  RENTAL_STATE_TRUE = 1013341,
  RENTAL_STATE_FALSE = 1013342,
  REASON_TYPE_REAL = 231,
  REASON_TYPE_LEGAL = 232,
}

/*
export const APP_TYPE = Object.freeze({
  EPROC: { code: 1, tagCode: 951 }, // BUY خرید
  ETEND: { code: 2, tagCode: 957 }, // TENDER مناقصه
  EAUC: { code: 3, tagCode: 955 }, // AUCTION مزایده
  REG: { code: -1, tagCode: 959 },
  MIS: { code: -1, tagCode: 952 },
  BITADUI: { code: -1, tagCode: 10060 },
  ELITEBI: { code: -1, tagCode: 10064 },
}); */
