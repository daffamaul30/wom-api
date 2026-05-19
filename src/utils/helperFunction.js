const formatDateToIndonesian = (isoDateString, includeDay = true) => {
  if (!isoDateString) return "";

  try {
    const dateObj = new Date(isoDateString);

    if (isNaN(dateObj.getTime())) {
      console.warn(
        "Invalid date format passed to formatDateToIndonesian:",
        isoDateString,
      );
      return "";
    }

    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      ...(includeDay && { weekday: "long" }),
      timeZone: "Asia/Jakarta",
    };

    return new Intl.DateTimeFormat("id-ID", options).format(dateObj);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

const capitalize = (text, withoutSpace, withoutReplace) => {
  const newtext = withoutReplace ? text : text?.replace(/[-_ ]/g, " ");
  const arr = newtext?.replace(/([a-z0-9])([A-Z])/g, "$1 $2")?.split(" ");
  for (let i = 0; i < arr?.length; i++) {
    arr[i] = arr[i]?.charAt(0).toUpperCase() + arr[i].slice(1);
  }
  if (!withoutSpace) {
    return arr.join(" ");
  } else {
    return arr.join("");
  }
};

const refactorFormatTemplate = (client, events) => {
  const templateData = {
    bride: {
      photo:
        client.bride.photo ||
        "https://res.cloudinary.com/dvs3xx23a/image/upload/v1778671256/Stock_CPW_n2i5cf.jpg",
      fullname: client.bride.fullName,
      nickname: client.bride.nickname,
      phone: client.bride.phone,
      childNumber: client.bride.childNumber,
      siblingsTotal: client.bride.siblingsTotal,
      father: client.bride.father.name,
      fatherPhone: client.bride.father.phone,
      mother: client.bride.mother.name,
      motherPhone: client.bride.mother.phone,

      siblings: client.bride.siblings.map((sibling, index) => {
        let text1 =
          `${index + 1}. ` +
          `${sibling.name} ` +
          `(${sibling.phone}) - ` +
          `${sibling.relation}`;

        let text2 = "";
        if (sibling.spouseName) {
          text2 +=
            ` ${sibling.spouseStatus}: ` +
            `${sibling.spouseName} ` +
            `(${sibling.spousePhone})`;
        }

        return {
          text1,
          ...(text2 !== "" ? { text2 } : {}),
        };
      }),
    },

    groom: {
      photo:
        client.groom.photo ||
        "https://res.cloudinary.com/dvs3xx23a/image/upload/v1778671256/Stock_CPP_f50n5l.jpg",
      fullname: client.groom.fullName,
      nickname: client.groom.nickname,
      phone: client.groom.phone,
      childNumber: client.groom.childNumber,
      siblingsTotal: client.groom.siblingsTotal,
      father: client.groom.father.name,
      fatherPhone: client.groom.father.phone,
      mother: client.groom.mother.name,
      motherPhone: client.groom.mother.phone,

      siblings: client.groom.siblings.map((sibling, index) => {
        let text1 =
          `${index + 1}. ` +
          `${sibling.name} ` +
          `(${sibling.phone}) - ` +
          `${sibling.relation}`;

        let text2 = "";
        if (sibling.spouseName) {
          text2 +=
            ` ${sibling.spouseStatus}: ` +
            `${sibling.spouseName} ` +
            `(${sibling.spousePhone})`;
        }

        return {
          text1,
          ...(text2 !== "" ? { text2 } : {}),
        };
      }),
    },

    events: events
      .sort((a, b) => {
        const dateA = new Date(`${a.eventDate} ${a.startTime}`);

        const dateB = new Date(`${b.eventDate} ${b.startTime}`);

        return dateA - dateB;
      })
      .map((event) => ({
        name: capitalize(event.eventName),

        type: capitalize(event.eventType),

        date: formatDateToIndonesian(event.eventDate),

        start: event.startTime || "",

        end: event.endTime || "",

        venueName: event.venueName || "",

        venueAddress: event.venueAddress || "",

        notes: event.notes || "",
      })),
  };

  return templateData;
};

// const refactorFormatTemplate = (client, akadEvent, resepsiEvent) => {
//   const templateData = {
//     bride: {
//       photo:
//         client.bride.photo ||
//         "https://res.cloudinary.com/dvs3xx23a/image/upload/v1778671256/Stock_CPW_n2i5cf.jpg",
//       fullname: client.bride.fullName,
//       nickname: client.bride.nickname,
//       phone: client.bride.phone,
//       childNumber: client.bride.childNumber,
//       siblingsTotal: client.bride.siblingsTotal,
//       father: client.bride.father.name,
//       fatherPhone: client.bride.father.phone,
//       mother: client.bride.mother.name,
//       motherPhone: client.bride.mother.phone,

//       siblings: client.bride.siblings.map((sibling, index) => {
//         let text1 =
//           `${index + 1}. ` +
//           `${sibling.name} ` +
//           `(${sibling.phone}) - ` +
//           `${sibling.relation}`;

//         let text2 = "";
//         if (sibling.spouseName) {
//           text2 +=
//             ` ${sibling.spouseStatus}: ` +
//             `${sibling.spouseName} ` +
//             `(${sibling.spousePhone})`;
//         }

//         return {
//           text1,
//           ...(text2 !== "" ? { text2 } : {}),
//         };
//       }),
//     },

//     groom: {
//       photo:
//         client.groom.photo ||
//         "https://res.cloudinary.com/dvs3xx23a/image/upload/v1778671256/Stock_CPP_f50n5l.jpg",
//       fullname: client.groom.fullName,
//       nickname: client.groom.nickname,
//       phone: client.groom.phone,
//       childNumber: client.groom.childNumber,
//       siblingsTotal: client.groom.siblingsTotal,
//       father: client.groom.father.name,
//       fatherPhone: client.groom.father.phone,
//       mother: client.groom.mother.name,
//       motherPhone: client.groom.mother.phone,

//       siblings: client.groom.siblings.map((sibling, index) => {
//         let text1 =
//           `${index + 1}. ` +
//           `${sibling.name} ` +
//           `(${sibling.phone}) - ` +
//           `${sibling.relation}`;

//         let text2 = "";
//         if (sibling.spouseName) {
//           text2 +=
//             ` ${sibling.spouseStatus}: ` +
//             `${sibling.spouseName} ` +
//             `(${sibling.spousePhone})`;
//         }

//         return {
//           text1,
//           ...(text2 !== "" ? { text2 } : {}),
//         };
//       }),
//     },

//     event: {
//       date:
//         akadEvent?.eventDate || resepsiEvent?.eventDate
//           ? formatDateToIndonesian(
//               akadEvent?.eventDate || resepsiEvent?.eventDate,
//             )
//           : "",
//       venueName: akadEvent?.venueName || resepsiEvent?.venueName || "",
//       akad: {
//         start: akadEvent?.startTime || "",
//         end: akadEvent?.endTime || "",
//       },

//       resepsi: {
//         start: resepsiEvent?.startTime || "",
//         end: resepsiEvent?.endTime || "",
//       },
//     },
//   };

//   return templateData;
// };

module.exports = { formatDateToIndonesian, refactorFormatTemplate, capitalize };
