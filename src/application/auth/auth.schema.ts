import { t } from "elysia";

export const RegisterSchema = {
  body: t.Object({
    email: t.String(),
    name: t.String(),
    password: t.String(),
  }),
  detail: {
    tags: ["Auth"],
  },
};

export const LoginSchema = {
  body: t.Object({
    email: t.String(),
    password: t.String(),
  }),
  detail: {
    tags: ["Auth"],
  },
};
