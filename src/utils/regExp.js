const REGEXP_CONFIG = {
  review: /^[?!,.A-Za-z0-9\u0621-\u064A\s]+$/,
};

export const UtilsParserReviews = value => {
  return REGEXP_CONFIG.review.test(value);
};
