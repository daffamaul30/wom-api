// const fs = require("fs");

// const libre = require("libreoffice-convert");

// const convertToPdf = async ({ buffer, outputPath }) => {
//   const pdfBuffer = await new Promise((resolve, reject) => {
//     libre.convert(
//       buffer,
//       ".pdf",
//       undefined,

//       (err, done) => {
//         if (err) {
//           reject(err);
//           return;
//         }

//         resolve(done);
//       },
//     );
//   });

//   fs.writeFileSync(outputPath, pdfBuffer);

//   return {
//     pdfBuffer,
//     outputPath,
//   };
// };

// module.exports = convertToPdf;

const fs = require("fs");
const path = require("path");
const ILovePDFApi = require("@ilovepdf/ilovepdf-nodejs");
const ILovePDFFile = require("@ilovepdf/ilovepdf-nodejs/ILovePDFFile");

const instance = new ILovePDFApi(
  process.env.ILOVEAPI_PUBLIC_KEY,
  process.env.ILOVEAPI_SECRET_KEY,
);

const convertToPdf = async ({ inputPath, outputPath }) => {try {
    // fs.writeFileSync(tempDocxPath, buffer);
    // 1. Inisialisasi task baru khusus untuk konversi Office ke PDF
    const task = await instance.newTask("officepdf");

    // =====================
    // START TASK
    // =====================

    await task.start();

    // =====================
    // ADD FILE
    // =====================
    const file = new ILovePDFFile(inputPath);

    await task.addFile(file);

    // =====================
    // PROCESS
    // =====================

    await task.process();

    // =====================
    // DOWNLOAD PDF
    // =====================

    const pdfBuffer = await task.download();

    // =====================
    // SAVE PDF
    // =====================

    fs.writeFileSync(outputPath, pdfBuffer);

    return {
      pdfBuffer,
      outputPath,
    };
  } catch (error) {
    console.error("Gagal konversi menggunakan iLovePDF API");
    console.error("Status Code: ", error.status);
    console.error("Detail Error: ", error.message);
    throw error;
  }
};

// const convertToPdf = async ({ inputPath, outputPath }) => {
//   const ilovepdf = new ILovePDFApi(
//     process.env.ILOVEAPI_PUBLIC_KEY,
//     process.env.ILOVEAPI_SECRET_KEY,
//   );

//   const task = ilovepdf.newTask("officepdf");

//   await task.addFile(inputPath);

//   await task.process();

//   const pdfBuffer = await task.download();

//   return {
//     pdfBuffer,
//     outputPath,
//   };
// };

module.exports = convertToPdf;

// const fs = require("fs");
// const path = require("path");
// const axios = require("axios");
// const FormData = require("form-data");

// const convertToPdf = async ({ inputPath, outputPath }) => {
//   try {
//     // 1. OTENTIKASI: Dapatkan Auth Token dari iLovePDF
//     // Menggunakan URLSearchParams agar data dikirim sebagai form-urlencoded (wajib bagi iLovePDF)
//     const params = new URLSearchParams();
//     params.append("public_key", process.env.ILOVEAPI_PUBLIC_KEY);

//     const authResponse = await axios.post(
//       "https://api.ilovepdf.com/v1/auth",
//       params,
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       },
//     );

//     const token = authResponse.data.token;
//     const headers = { Authorization: `Bearer ${token}` };

//     // 2. MULAI TASK: Buat sebuah session task khusus 'officepdf'
//     const taskResponse = await axios.post(
//       "https://api.ilovepdf.com/v1/start/officepdf",
//       {},
//       { headers },
//     );
//     const { task, server } = taskResponse.data;

//     // Ambil nama file asli (misal: panduan-acara.docx)
//     const filename = path.basename(inputPath);

//     // 3. UPLOAD FILE: Kirim file .docx menggunakan FormData dan Stream
//     const form = new FormData();
//     form.append("task", task);
//     // Tambahkan opsi { filename } agar server cloud iLovePDF mengenali ekstensi .docx kamu
//     form.append("file", fs.createReadStream(inputPath), { filename: filename });

//     await axios.post(`https://${server}/v1/upload`, form, {
//       headers: {
//         ...headers,
//         ...form.getHeaders(),
//       },
//     });

//     // 4. PROSES KONVERSI: Instruksikan server untuk mulai mengubah berkas ke PDF
//     await axios.post(
//       `https://${server}/v1/process`,
//       {
//         task,
//         tool: "officepdf",
//         files: [
//           {
//             server_filename: filename,
//             filename: filename,
//           },
//         ],
//       },
//       { headers },
//     );

//     // 5. DOWNLOAD: Unduh file hasil konversi berupa buffer binary
//     const downloadResponse = await axios.get(
//       `https://${server}/v1/download/${task}`,
//       {
//         headers,
//         responseType: "arraybuffer", // Pastikan berbentuk binary data/buffer
//       },
//     );

//     // 6. SIMPAN: Tulis buffer PDF tersebut menjadi file fisik di disk kamu
//     const pdfBuffer = Buffer.from(downloadResponse.data);
//     fs.writeFileSync(outputPath, pdfBuffer);

//     return {
//       pdfBuffer,
//       outputPath,
//     };
//   } catch (error) {
//     const errorData = error.response ? error.response.data : error.message;
//     console.error("Gagal konversi menggunakan REST API iLovePDF:", errorData);
//     throw error;
//   }
// };

// module.exports = convertToPdf;
