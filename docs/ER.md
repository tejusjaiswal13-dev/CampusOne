# Entity relationships

Use the report-ready diagrams in [diagrams/index.html](diagrams/index.html):

- [Core ER diagram](diagrams/01-er-core.svg)
- [Academic and notification ER diagram](diagrams/02-er-academic.svg)
- [Captions, cardinalities and implementation notes](diagrams/README.md)

These are logical diagrams grounded in the current implementation. Solid edges indicate actual SQL foreign keys; dashed edges indicate JSON/application relationships. Thirteen content tables store id, validated JSON data, created_at and updated_at. Accounts, sessions and notification_reads have dedicated columns. Facilities are campus-wide and have no department foreign key. Career eligibility uses embedded department-code arrays. Bookmark targets are polymorphic. Separate approvals, subjects, semesters and timetable tables are not implemented.
