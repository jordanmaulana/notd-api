import { t } from "elysia";

export const CreateNoteSchema = {
  body: t.Object({
    content: t.String(),
    isPrivate: t.Boolean({
      description: "Setting it to False will make this note visible to public",
    }),
  }),
};

export const GetNotesSchema = {
  query: t.Object({
    search: t.Optional(
      t.String({
        description:
          "Narrow down notes by one or more tags. Example: #food #nasigoreng",
        examples: "#food #nasigoreng",
      })
    ),
  }),
};
