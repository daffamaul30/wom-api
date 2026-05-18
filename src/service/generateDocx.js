const fs = require("fs");

const createReport = require("docx-templates").default;

const generateDocx = async ({ templatePath, data, outputPath }) => {
  const template = fs.readFileSync(templatePath);

  const buffer = await createReport({
    template,
    data,

    cmdDelimiter: ["{", "}"],

    additionalJsContext: {
      async image(url, width, height) {
        const response = await fetch(url);

        const arrayBuffer = await response.arrayBuffer();

        const buffer = Buffer.from(arrayBuffer);

        return {
          width,
          height,

          data: buffer,

          extension: ".jpg",
        };
      },
    },
  });

  fs.writeFileSync(outputPath, buffer);

  return {
    buffer,
    outputPath,
  };
};

module.exports = generateDocx;
