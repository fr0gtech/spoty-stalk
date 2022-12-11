import pino from "pino";

export const log = pino({
  name: "spoty-stalk-backend",
  level: "debug",
});
