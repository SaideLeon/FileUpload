# **App Name**: File Forge Admin

## Core Features:

- Project Listing: Display all projects with file counts and total sizes retrieved from the file system, using data from the `/projects` endpoint.
- File Listing per Project: List files within a selected project, showing names, URLs, sizes, and upload dates using data from the `/list?project={nome}` endpoint.
- File Deletion: Enable deletion of individual files from a project via the `/delete?project={nome}&file={arquivo}` endpoint.
- File Upload: Interface for uploading files to specific projects, utilizing the `/upload` endpoint.
- Project Selection: Dropdown menu for selecting a project to view or manage files.
- Stats Summary: Generative AI powered 'tool' to provide a summary and actionable insights on a project's file stats (e.g., dominant file types, average file size), suggesting ways to optimize storage or file management based on the nature of the files. Uses an LLM to evaluate statistics and reasoning about how users can derive value from file types (images, videos, documents, spreadsheets) as well as frequency/size.

## Style Guidelines:

- Primary color: Slate blue (#778DA9) to give a sense of calm and organization.
- Background color: Very light gray (#F1F1F1), nearly white, providing a clean and neutral backdrop.
- Accent color: Muted teal (#41B3A3), drawing attention to interactive elements.
- Body and headline font: 'Inter', a sans-serif font known for its readability, for both headings and body text.
- Use minimalist icons from a consistent set, providing visual cues for file types and actions.
- Employ a grid-based layout to maintain alignment and organization of project and file lists.
- Subtle transition effects for file uploads and deletions to enhance user experience.