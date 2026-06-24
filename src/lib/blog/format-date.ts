const BLOG_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

export function formatBlogDate(isoDate: string): string {
  return BLOG_DATE_FORMATTER.format(new Date(`${isoDate}T00:00:00.000Z`));
}
