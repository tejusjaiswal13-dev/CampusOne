# Entity relationships

Use the report-ready master diagram in [diagrams/index.html](diagrams/index.html):

- [Master ER diagram (PNG)](diagrams/master-er.png)
- [Master ER diagram (SVG)](diagrams/master-er.svg)
- [Captions and implementation notes](diagrams/README.md)

The master diagram is grounded in the current SQLite implementation. It includes all 16 tables and distinguishes the four physical SQL foreign keys from references encoded in JSON/application logic. Thirteen content tables store id, validated JSON data, created_at and updated_at. Accounts, sessions and notification_reads have dedicated columns. Facilities are campus-wide and have no department foreign key. Career eligibility uses embedded department-code arrays. Bookmark targets are polymorphic. Separate approvals, subjects, semesters and timetable tables are not implemented.
