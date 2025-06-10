export const sessionValue = {
  isLogin: true,
  env: "development",
  user: {
    info: {
      email: "rohit.sharma@paytm.com",
      id: "1000910480",
      userTypes: [
        "BANK_CUSTOMER",
        "AGENT",
        "SD_MERCHANT",
        "P2P_MERCHANT",
        "POSTPAID_USER",
        "MERCHANT",
      ],
      minKycDetails: { isMinKyc: false, kycState: "PAYTM_PRIMITIVE" },
      expiryTime: "1749625111000",
      userAttributeInfo: {
        IVR_FLAG: "1",
        USER_TYPE: "28,8,5,3,4,7",
        CUSTOMER_TYPE: "0",
        BANK_CONSENT: "true",
        POSTPAID_STATUS: "LIVE",
        CREDIT_CARD: "true",
        SMS_FLAG: "1",
        GOLD_ACCOUNT: "true",
      },
      userPicture:
        "https://accounts-staging-assets.paytm.com/staging/bsnf9p5zu5yj2o28.jpeg",
      firstName: "Test",
      lastName: "",
      mobile: 7777799999,
      countryCode: "91",
      walletType: "SCW",
      sendEmailFLag: false,
      is_verified_email: false,
      is_verified_mobile: false,
      username: "Test",
    },
    id: "1000910480",
    email: "rohit.sharma@paytm.com",
    sso_token_enc:
      "637f44ea142e45ca005090031d6cf897afc35d9ec49f476384e47d1c66582572e1a74c9e05ff11e174ab61f29d970d48",
    sso_token_enc_iv:
      "e802a4f01d543443c6588ea95d80fc4ae55642db6097e990d14ed583e6f1d110d03a2cf33b6177111e7bdc47ff77de9f",
    encWalletToken:
      "637f44ea142e45ca005090031d6cf897afc35d9ec49f476384e47d1c66582572e1a74c9e05ff11e174ab61f29d970d48",
    encWalletTokenIV:
      "e802a4f01d543443c6588ea95d80fc4ae55642db6097e990d14ed583e6f1d110d03a2cf33b6177111e7bdc47ff77de9f",
  },
};

export const PaytmTravelLoginFetched = "2025-16-05T08:33:46.084Z";
export const login_successful = {
  event_category: "loginVerify",
  screenName: "/loginVerify",
  event_action: "login_successful",
  event_label: "phone_number_otp",
  utm_campaign: "Desktop",
  utm_source: "paytm-mweb-staging",
  event: "custom_event",
  vertical_name: "oauth",
  event_label5: "BUS_MWEB",
  event_label7: "bus/seat",
  event_label8: "SEO",
  event_label9: "/bus/seat",
  event_label10: "funnel_login",
};
