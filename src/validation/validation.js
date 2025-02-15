import Validator from 'validator';
import I18n from '../utils/i18n';

export const registerValidation = (data, lang) => {
  let errors = {};

  data.firstName = data.first_name.trim() ? data.first_name.trim() : '';
  data.lastName = data.last_name.trim() ? data.last_name.trim() : '';
  data.mobile = data.mobile.trim() ? data.mobile.trim() : '';
  data.email = data.email.trim() ? data.email.trim() : '';
  data.password = data.password.trim() ? data.password : '';
  data.is_term = data.is_term ? data.is_term : false;

  /*  if (!Validator.isLength(data.firstName, {min: 2, max: 30})) {
    errors.firstName = 'First name minimum characters 2 and maximum 30';
  } */

  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = I18n.t('firstNameIsRequired', {locale: lang});
    errors.isFirstName = true;
  }

  /*  if (!Validator.isLength(data.lastName, {min: 2, max: 30})) {
    errors.lastName = 'Last name minimum characters 2 and maximum 30';
  } */

  if (Validator.isEmpty(data.lastName)) {
    errors.isLastName = true;
    errors.lastName = I18n.t('lastNameIsRequired', {locale: lang});
  }

  if (Validator.isEmpty(data.mobile)) {
    errors.isMobile = true;
    errors.mobile = I18n.t('phoneNumberIsRequired', {locale: lang});
  } else if (!Validator.isNumeric(data.mobile)) {
    errors.isMobile = true;
    errors.mobile = I18n.t('PhoneNumberOnly', {locale: lang});
  } else if (!Validator.isLength(data.mobile, {min: 8, max: 13})) {
    errors.isMobile = true;
    errors.mobile = I18n.t('PhoneNumberNotValid', {locale: lang});
  }

  if (Validator.isEmpty(data.email)) {
    errors.isEmail = true;
    errors.email = I18n.t('emailIsRequired', {locale: lang});
  } else if (!Validator.isEmail(data.email)) {
    errors.isEmail = true;
    errors.email = I18n.t('EmailInvalid', {locale: lang});
  }

  if (Validator.isEmpty(data.password)) {
    errors.isPassword = true;
    errors.password = I18n.t('passwordIsRequired', {locale: lang});
  } else if (!Validator.isLength(data.password, {min: 6, max: 30})) {
    errors.isPassword = true;
    errors.password = I18n.t('PasswordMustMinimumCharacters', {locale: lang});
  }

  if (!data.is_term) {
    errors.isTerm = true;
    errors.isTerm = I18n.t('YouAgreeTermsAndPolicy', {locale: lang});
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

export const loginValidation = (data, lang) => {
  let errors = {};

  data.mobile = data.mobile.trim() ? data.mobile.trim() : '';
  data.password = data.password.trim() ? data.password.trim() : '';

  if (Validator.isEmpty(data.mobile)) {
    errors.isMobile = true;
    errors.mobile = I18n.t('phoneNumberIsRequired', {locale: lang});
  } else if (!Validator.isNumeric(data.mobile)) {
    errors.isMobile = true;
    errors.mobile = I18n.t('PhoneNumberOnly', {locale: lang});
  } else if (!Validator.isLength(data.mobile, {min: 8, max: 13})) {
    errors.isMobile = true;
    errors.mobile = I18n.t('PhoneNumberNotValid', {locale: lang});
  }

  /* if (Validator.isEmpty(data.password)) {
    errors.isPassword = true;
    //errors.password = 'Password field is required';
  } */

  if (Validator.isEmpty(data.password)) {
    errors.isPassword = true;
    errors.password = I18n.t('passwordIsRequired', {locale: lang});
  } else if (!Validator.isLength(data.password, {min: 4, max: 30})) {
    errors.isPassword = true;
    errors.password = I18n.t('PasswordMustMinimumCharacters', {locale: lang});
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

export const forgotPasswordValidation = (data, lang) => {
  let errors = {};

  data.mobile = data.mobile.trim() ? data.mobile.trim() : '';

  if (Validator.isEmpty(data.mobile)) {
    errors.isMobile = true;
    errors.mobile = I18n.t('phoneNumberIsRequired', {locale: lang});
  } else if (!Validator.isNumeric(data.mobile)) {
    errors.isMobile = true;
    errors.mobile = I18n.t('PhoneNumberOnly', {locale: lang});
  } else if (!Validator.isLength(data.mobile, {min: 8, max: 8})) {
    errors.isMobile = true;
    errors.mobile = I18n.t('PhoneNumberNotValid', {locale: lang});
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

export const resetValidation = (data, lang) => {
  let errors = {};
  data.password = data.password.trim() ? data.password.trim() : '';
  data.confirm_password = data.confirm_password.trim()
    ? data.confirm_password.trim()
    : '';

  if (Validator.isEmpty(data.password)) {
    errors.isPassword = true;
    errors.password = I18n.t('passwordNewIsRequired', {locale: lang});
  } else if (!Validator.isLength(data.password, {min: 6, max: 30})) {
    errors.isPassword = true;
    errors.password = I18n.t('PasswordMustMinimumCharacters', {locale: lang});
  }

  if (Validator.isEmpty(data.confirm_password)) {
    errors.isConfirmPassword = true;
    errors.confirmPassword = I18n.t('confirmNewPasswordIsRequired', {
      locale: lang,
    });
  } else if (!Validator.isLength(data.confirm_password, {min: 6, max: 30})) {
    errors.isConfirmPassword = true;
    errors.confirmPassword = I18n.t('PasswordMustMinimumCharacters', {
      locale: lang,
    });
  } else if (!Validator.equals(data.password, data.confirm_password)) {
    errors.confirmPassword = I18n.t('PasswordDoesnotMatch', {locale: lang});
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

export const changePasswordValidation = data => {
  let errors = {};
  data.password = data.password.trim() ? data.password.trim() : '';
  data.new_password = data.new_password.trim() ? data.new_password.trim() : '';
  data.confirm_password = data.confirm_password.trim()
    ? data.confirm_password.trim()
    : '';

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }
  if (Validator.isEmpty(data.new_password)) {
    errors.new_password = 'New password field is required';
  }
  if (Validator.isEmpty(data.confirm_password)) {
    errors.confirm_password = 'Confirm password field is required';
  }

  if (!Validator.equals(data.new_password, data.confirm_password)) {
    errors.confirm_password = "Password doesn't match";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

export const updateUserValidation = (data, lang) => {
  let errors = {};

  data.firstName = data.first_name.trim() ? data.first_name.trim() : '';
  data.lastName = data.last_name.trim() ? data.last_name.trim() : '';
  //data.mobile = data.mobile.trim() ? data.mobile : '';

  if (data.email) {
    data.email = data.email.trim() ? data.email.trim() : '';
    if (Validator.isEmpty(data.email)) {
      errors.isEmail = true;
      errors.email = I18n.t('emailIsRequired', {locale: lang});
    } else if (!Validator.isEmail(data.email)) {
      errors.isEmail = true;
      errors.email = I18n.t('EmailInvalid', {locale: lang});
    }
  }

  //data.password = data.password.trim() ? data.password : '';

  /*  if (!Validator.isLength(data.firstName, {min: 2, max: 30})) {
    errors.firstName = 'First name minimum characters 2 and maximum 30';
  } */

  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = I18n.t('firstNameIsRequired', {locale: lang});
    errors.isFirstName = true;
  }

  /*  if (!Validator.isLength(data.lastName, {min: 2, max: 30})) {
    errors.lastName = 'Last name minimum characters 2 and maximum 30';
  } */

  if (Validator.isEmpty(data.lastName)) {
    errors.isLastName = true;
    errors.lastName = I18n.t('lastNameIsRequired', {locale: lang});
  }

  if (data.isChangePassword) {
    data.current_password = data.current_password.trim()
      ? data.current_password.trim()
      : '';
    data.password = data.password.trim() ? data.password.trim() : '';
    data.confirm_password = data.confirm_password.trim()
      ? data.confirm_password.trim()
      : '';
    if (Validator.isEmpty(data.current_password)) {
      errors.isPassword = true;
      errors.password = I18n.t('oldPasswordIsRequired', {locale: lang});
    }
    if (Validator.isEmpty(data.password)) {
      errors.isNewPassword = true;
      errors.new_password = I18n.t('passwordIsRequired', {locale: lang});
    } else if (!Validator.isLength(data.password, {min: 6, max: 30})) {
      errors.isNewPassword = true;
      errors.new_password = I18n.t('PasswordMustMinimumCharacters', {
        locale: lang,
      });
    }

    if (Validator.isEmpty(data.confirm_password)) {
      errors.isConfirmPassword = true;
      errors.confirm_password = I18n.t('confirmPasswordIsRequired', {
        locale: lang,
      });
    } else if (!Validator.isLength(data.confirm_password, {min: 6, max: 30})) {
      errors.isConfirmPassword = true;
      errors.confirm_password = I18n.t('PasswordMustMinimumCharacters', {
        locale: lang,
      });
    } else if (!Validator.equals(data.password, data.confirm_password)) {
      errors.isConfirmPassword = true;
      errors.confirm_password = I18n.t('PasswordDoesnotMatch', {locale: lang});
    }
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

export const addReviewValidation = (data, lang) => {
  let errors = {};

  data.rating = data.rating ? data.rating : 0;
  data.description = data.description.trim() ? data.description.trim() : '';

  if (!data.rating) {
    errors.rating = I18n.t('ratingIsRequired', {locale: lang});
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = I18n.t('descriptionIsRequired', {locale: lang});
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

export const contactValidation = (data, lang) => {
  let errors = {};

  data.name = data.name.trim() ? data.name.trim() : '';
  data.mobile = data.mobile.trim() ? data.mobile.trim() : '';
  data.email = data.email.trim() ? data.email.trim() : '';
  data.message = data.message.trim() ? data.message : '';

  if (Validator.isEmpty(data.name)) {
    errors.name = I18n.t('nameIsRequired', {locale: lang});
    errors.isName = true;
  }

  if (Validator.isEmpty(data.mobile)) {
    errors.isMobile = true;
    errors.mobile = I18n.t('phoneNumberIsRequired', {locale: lang});
  } else if (!Validator.isNumeric(data.mobile)) {
    errors.isMobile = true;
    errors.mobile = I18n.t('PhoneNumberOnly', {locale: lang});
  } else if (!Validator.isLength(data.mobile, {min: 8, max: 8})) {
    errors.isMobile = true;
    errors.mobile = I18n.t('PhoneNumberNotValid', {locale: lang});
  }

  if (Validator.isEmpty(data.email)) {
    errors.isEmail = true;
    errors.email = I18n.t('emailIsRequired', {locale: lang});
  } else if (!Validator.isEmail(data.email)) {
    errors.isEmail = true;
    errors.email = I18n.t('EmailInvalid', {locale: lang});
  }

  if (Validator.isEmpty(data.message)) {
    errors.isMessage = true;
    errors.message = I18n.t('messageFieldIsRequired', {locale: lang});
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
