import PdfPrinter from "pdfmake";

export const getPDFReadableStream = (posts) => {
  const fonts = {
    Roboto: {
      normal: "Helvetica",
    },
  };

  const printer = new PdfPrinter(fonts);
  const docDefinition = {
    content: [posts.title, posts.author.name, posts.content],
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition);
  pdfReadableStream.end();

  return pdfReadableStream;
};
