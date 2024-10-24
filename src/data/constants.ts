export const DAYS_OF_WEEK_IN_ORDER = [
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
  "sabádo",
  "domingo",
] as const;

export const religions = [
  "Católico",
  "Evangélico",
  "Islamismo",
  "Hinduísmo",
  "Budismo",
  "Ateísmo",
  "Espiritismo",
  "Candomblé",
  "Outros",
] as const;

export const educationLevels = [
  "Fundamental Incompleto",
  "Fundamental Completo",
  "Médio Incompleto",
  "Médio Completo",
  "Superior Incompleto",
  "Superior Completo",
  "Pós-Graduação",
  "Mestrado",
  "Doutorado",
  "Outros",
] as const;

export const modules = {
  toolbar: {
    container: [
      [{ header: [2, 3, 4, false] }],
      ["bold", "italic", "underline", "blockquote"],
      [{ color: [] }, { background: [] }],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
    ],
  },
  clipboard: {
    matchVisual: true,
  },
};

export const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "color",
  "background",
  "clean",
];
