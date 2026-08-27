import { createHmac, timingSafeEqual } from "node:crypto";

export const createSessionToken = (tokenValue, secret) => {
  const signature = createHmac("sha256", secret)
    .update(tokenValue)
    .digest("base64url");

  return `${tokenValue}.${signature}`;
};

export const isSessionTokenValid = (token, secret) => {
  if (!token) {
    return false;
  }

  const [tokenValue, signature] = token.split(".");

  if (!tokenValue || !signature) {
    return false;
  }

  const expectedToken = createSessionToken(tokenValue, secret);
  const tokenBuffer = Buffer.from(token);
  const expectedBuffer = Buffer.from(expectedToken);

  if (tokenBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(tokenBuffer, expectedBuffer);
};
