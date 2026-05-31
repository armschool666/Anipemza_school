/**
 * UI-строки админ-панели. Сейчас интерфейс одноязычный (армянский),
 * вынесено в один файл, чтобы при клонировании или локализации
 * правка была в одном месте.
 */
export const adminStrings = {
  logout: "Ելք",
  step1Legend: "1. Որտեղ տեղադրել",
  sectionLabel: "Բաժին",
  pageLabel: "Էջ",
  previewSelectedPage: "Դիտել ընտրված էջը →",

  step2Legend: "2. Նյութի բովանդակություն",
  titleLabel: "Վերնագիր",
  titlePlaceholder: "Օրինակ՝ 2025 թ. հաշվետվություն",
  bodyLabel: "Բովանդակություն",
  bodyPlaceholder: "Գրել նյութի համառոտ նկարագրությունը",

  step3Legend: "3. Ֆայլեր",
  existingFilesLabel: "Արդեն կցված ֆայլեր (× — հանել)",
  fileChipFallback: "Ֆայլ",
  removeFileTitle: "Հանել ֆայլը",
  uploadNewFiles: "Ավելացնել նոր ֆայլեր",
  uploadFiles: "Վերբեռնել ֆայլեր",
  uploadHint: "Ընտրել PDF, Word, Excel կամ նկարներ համակարգչից",
  manualLinksLabel: "Ձեռքով հղումներ (արտաքին կայքեր)",
  manualLinksPlaceholder:
    "Մեկ տողին մեկ ֆայլ\nՕրինակ՝ 2025 հաշվետվություն | https://example.com/file.pdf",

  willAppearAt: "Նյութը կհայտնվի այստեղ",
  saving: "Պահպանվում է...",
  updateButton: "Թարմացնել նյութը",
  addButton: "Ավելացնել նյութ",
  cancel: "Չեղարկել",
  fillTitleAndBody: "Լրացրեք վերնագիրը և բովանդակությունը։",
  loadFailed: "Չհաջողվեց բեռնել նյութերը։",
  saveFailed: "Չհաջողվեց պահպանել նյութը։",
  deleteFailed: "Չհաջողվեց ջնջել նյութը։ Փորձեք նորից:",
  saved: "Նյութը պահպանվեց։",
  updated: "Նյութը թարմացվեց։",
  deleted: "Նյութը ջնջվեց։",
  editing: "Խմբագրման ռեժիմ։ Կարող եք նաև ավելացնել նոր ֆայլեր։",
  savedPreviewHint: "✓ Նյութը պահպանվեց — այսպիսին է երևում հանրային կայքում.",
  viewOnSite: "Դիտել կայքում →",
  inlinePreviewHint: "Այսպիսին է երևում հանրային կայքում →",

  listHeading: "Ավելացված նյութեր",
  searchPlaceholder: "Որոնել նյութեր...",
  searchAriaLabel: "Որոնել նյութեր",
  onlySelectedPage: "Միայն ընտրված էջը",
  allPages: "Բոլոր էջերը",
  noEntriesForFilter: "Այս ընտրության համար նյութեր չկան։",
  noFiles: "Ֆայլեր չկան",

  edit: "Խմբագրել",
  previewOpen: "Preview",
  previewClose: "Փակել preview",
  remove: "Հեռացնել",
  confirmDelete: (title: string) =>
    `Ջնջե՞լ «${title}» նյութը։\nՖայլերը նույնպես կջնջվեն սկավառակից։`,
};

export type AdminStrings = typeof adminStrings;
