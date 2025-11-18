// partial search in mongodb
export const processPartialSearch = (
  filter,
  searchableFields = [],
  exactMatchFields = []
) => {
  const processedFilter = { ...filter };

  // Xử lý partial search (regex)
  searchableFields.forEach((field) => {
    if (processedFilter[field]) {
      // convert to regex for partial search (case insensitive)
      if (typeof processedFilter[field] === "string") {
        processedFilter[field] = {
          $regex: processedFilter[field],
          $options: "i",
        };
      }
      // object with $in property
      else if (
        typeof processedFilter[field] === "object" &&
        processedFilter[field].$in
      ) {
        const regexPatterns = processedFilter[field].$in.map(
          (value) => new RegExp(value, "i")
        );
        processedFilter[field] = {
          $in: regexPatterns,
        };
      }
    }
  });

  return processedFilter;
};

export const USER_SEARCHABLE_FIELDS = [
  "username",
  "fullName",
  "email",
  "phone",
  "address",
  "role",
];

export const CATEGORY_SEARCHABLE_FIELDS = ["name", "slug", "description"];

export const COURSE_SEARCHABLE_FIELDS = [
  "title",
  "slug",
  "description",
  "shortDescription",
];

export const COURSE_EXACT_MATCH_FIELDS = [
  "level",
  "language",
  "status",
  "categoryId",
  "instructorId",
];

export const CHAPTER_SEARCHABLE_FIELDS = ["title", "description"];

export const LECTURE_SEARCHABLE_FIELDS = ["title", "description", "content"];
