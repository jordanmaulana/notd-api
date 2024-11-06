import { t } from "elysia";

export const CreateNoteSchema = {
  body: t.Object({
    content: t.String(),
    isPrivate: t.Boolean(),
  }),
};

export const GetNotesSchema = {
  query: t.Object(
    {
      search: t.Optional(
        t.String({
          description:
            "Narrow down notes by one or more tags. Example: #food #nasigoreng",
        })
      ),
    },
    {
      examples: {
        query: "#food #nasigoreng",
      },
    }
  ),
};
