import winston from "winston";

export const winstonLogger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [new winston.transports.File({ filename: "combined.log" })],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
  winstonLogger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}
