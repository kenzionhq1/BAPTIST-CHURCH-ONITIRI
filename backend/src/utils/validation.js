function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateAdminItem(category, data) {
  const errors = [];

  if (!["sermon", "event", "resource"].includes(category)) {
    errors.push("category must be sermon | event | resource");
    return errors;
  }

  if (!isNonEmptyString(data.title)) errors.push("title is required");

  if (category === "sermon") {
    if (!isNonEmptyString(data.link)) errors.push("sermon.link is required");
    if (!isNonEmptyString(data.speaker)) errors.push("sermon.speaker is required");
  }

  if (category === "event") {
    if (!isNonEmptyString(data.eventTime)) errors.push("event.eventTime is required");
    if (!isNonEmptyString(data.summary)) errors.push("event.summary is required");

    const cover = isNonEmptyString(data.coverImageLink) ? data.coverImageLink : data.fileUrl;
    if (!isNonEmptyString(cover)) errors.push("event cover is required (coverImageLink or fileUrl)");
  }

  if (category === "resource") {
    const hasFile = isNonEmptyString(data.fileUrl);
    const hasLink = isNonEmptyString(data.link);
    if (!hasFile && !hasLink) errors.push("resource requires fileUrl or link");
  }

  return errors;
}

module.exports = { validateAdminItem, isNonEmptyString };

