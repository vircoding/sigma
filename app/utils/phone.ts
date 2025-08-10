import parsePhoneNumber from 'libphonenumber-js';

const countries = getCountries();

export function parsePhone(phone: string) {
  const parsedPhone = parsePhoneNumber(phone);

  if (parsedPhone) {
    const country = countries.find(
      (country) => country.code === parsedPhone.country?.toLowerCase(),
    );

    if (country) {
      return {
        code: country.callingCode,
        phone: parsedPhone.nationalNumber,
      };
    } else throw showError(createError({ status: 500 }));
  } else throw showError(createError({ status: 500 }));
}
