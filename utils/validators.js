export function normalizeWhitespace(value) {
    return value.replace(/\s+/g, " ").trim();
}
export function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
export function isValidPhone(value) {
    return /^\+?[0-9().\-\s]{7,}$/.test(value.trim());
}
export function isValidImage(file) {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    return allowedTypes.includes(file.type) && file.size <= 10 * 1024 * 1024;
}
export function validateBusinessCard(card) {
    const errors = {};
    if (!normalizeWhitespace(card.name ?? "")) {
        errors.name = "Name is required.";
    }
    const email = normalizeWhitespace(card.email ?? "");
    const phone = normalizeWhitespace(card.phone ?? "");
    if (!email && !phone) {
        errors.email = "Email or phone is required.";
        errors.phone = "Email or phone is required.";
    }
    if (email && !isValidEmail(email)) {
        errors.email = "Enter a valid email address.";
    }
    if (phone && !isValidPhone(phone)) {
        errors.phone = "Enter a valid phone number.";
    }
    return errors;
}
function normalizeNullableString(value) {
    if (typeof value !== "string")
        return "";
    return normalizeWhitespace(value);
}
export function businessCardFromPartial(card) {
    return {
        name: normalizeNullableString(card.name),
        designation: normalizeNullableString(card.designation),
        company: normalizeNullableString(card.company),
        email: normalizeNullableString(card.email),
        phone: normalizeNullableString(card.phone),
        website: normalizeNullableString(card.website),
        address: normalizeNullableString(card.address),
        cardImage: normalizeNullableString(card.cardImage),
        rawText: typeof card.rawText === "string" ? card.rawText : ""
    };
}
