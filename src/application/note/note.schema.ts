import { t } from "elysia";

export const CreateNoteSchema = {
  body: t.Object({
    content: t.String(),
    isPrivate: t.Boolean({
      description: "Setting it to False will make this note visible to public",
    }),
  }),
  detail: {
    tags: ["Notes"],
  },
};

export const GetNotesSchema = {
  query: t.Optional(
    t.Object({
      search: t.String({
        description:
          "Narrow down by one or more tags. Example: #food #nasigoreng",
        examples: "#food #nasigoreng",
      }),
      isPrivate: t.Boolean({
        description: "Filter by its privacy. Example: true",
        examples: "true | false",
      }),
      userId: t.String({
        description: "Filter by selected user id",
      }),
    })
  ),
  detail: {
    tags: ["Notes"],
  },
};
