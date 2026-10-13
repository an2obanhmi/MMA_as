# PRACTICAL EXAM 1 REPORT: MOBILE TASK MANAGEMENT APPLICATION
**Course**: Mobile Application Architecture / Development  
**Student Name**: [Your Full Name]  
**Student ID**: [Your Student ID]  
**Date**: October 12, 2026  

---

## 1. PROJECT LINKS & REPOSITORIES

- **GitHub Public Repository**: [https://github.com/your-username/task-management-app](https://github.com/your-username/task-management-app)
- **Expo Project Link / QR Code**: [https://expo.dev/@your-username/task-management-app](https://expo.dev/@your-username/task-management-app)
- **APK Download Link (if built via EAS)**: *Optional / Provided upon request*

---

## 2. FIRESTORE DATA MODEL DESCRIPTION

The application connects to **Google Cloud Firestore** (in Test Mode, without authentication) to store tasks in a root-level collection named `tasks`. Each task document contains the following fields:

| Field | Type | Description | Exam Requirement Status |
|---|---|---|---|
| `id` | `string` | Auto-generated Firestore Document ID | Handled via `docSnap.id` |
| `title` | `string` | Task title (client-side validated, non-empty) | Mandatory |
| `description` | `string` | Optional details or instructions | Optional |
| `status` | `string` | `'To Do'` \| `'In Progress'` \| `'Done'` | Default: `'To Do'` |
| `priority` | `string` | `'Low'` \| `'Medium'` \| `'High'` | Default: `'Medium'` |
| `dueDate` | `string` | Optional target date string (e.g. `2026-10-25`) | Optional |
| `createdAt` | `Timestamp` | Firestore `serverTimestamp()` for ordering | Mandatory |
| `teamId` | `null` | Reserved for Practical Exam 2 | Nullable |
| `assigneeId` | `null` | Reserved for Practical Exam 2 | Nullable |

### Firestore ERD Schema:
```text
+-------------------------------------------------------+
|                        TASKS                          |
+-------------------------------------------------------+
| id          : string [PK, Auto-generated]             |
| title       : string [Required]                       |
| description : string [Optional]                       |
| status      : 'To Do' | 'In Progress' | 'Done'        |
| priority    : 'Low' | 'Medium' | 'High'               |
| dueDate     : string [Optional]                       |
| createdAt   : Timestamp [serverTimestamp]             |
| teamId      : null [Reserved for Exam 2]              |
| assigneeId  : null [Reserved for Exam 2]              |
+-------------------------------------------------------+
```

---

## 3. SCREENSHOT DELIVERABLES & EVIDENCE

*(Note: Paste your screenshots into the designated placeholders below before saving as `.docx`)*

### 3.1. Firebase Console (Firestore Data Tab)
*Screenshot showing the `tasks` collection with sample documents and auto-generated IDs.*
> **[Insert Screenshot Here: Firebase Console showing tasks collection and document fields]**

---

### 3.2. Home Screen Overview (Task List & Create Button)
*Screenshot of the Home screen displaying the App Header, short description, Status Filter chips, and the task list.*
> **[Insert Screenshot Here: Home Screen overview with tasks and bottom tabs visible]**

---

### 3.3. Create Task Form (Filled In Before Submitting)
*Screenshot of the modal form filled in with a Title, Description, Status, Priority, and Due Date before tapping "Create Task".*
> **[Insert Screenshot Here: Create Task modal form with input data]**

---

### 3.4. Task List After Task Creation
*Screenshot of the Home screen demonstrating that the new task is rendered at the top of the list in real-time.*
> **[Insert Screenshot Here: Task List showing the newly created task]**

---

### 3.5. Edit Task Screen / Modal (With Updated Values)
*Screenshot showing the modal pre-filled with the existing task data and updated values.*
> **[Insert Screenshot Here: Edit Task modal with modified title or status]**

---

### 3.6. Task List After Task Edit
*Screenshot demonstrating the updated task reflecting the changes immediately via `onSnapshot`.*
> **[Insert Screenshot Here: Task list showing updated task values]**

---

### 3.7. Delete Task Confirmation & Removal
*Screenshot showing the `Alert.alert` confirmation prompt, followed by the task list after the item is deleted.*
> **[Insert Screenshot Here: Confirmation alert dialog and task list without the deleted item]**

---

### 3.8. Bottom Navigation & "Teams" Coming Soon Screen
*Screenshot showing the active Teams tab and the placeholder screen.*
> **[Insert Screenshot Here: Teams tab with "Coming Soon (Practical Exam 2)" message]**

---

### 3.9. Bottom Navigation & "Profile" Coming Soon Screen
*Screenshot showing the active Profile tab and the placeholder screen.*
> **[Insert Screenshot Here: Profile tab with Guest User / Coming Soon message]**

---

## 4. ARCHITECTURE HIGHLIGHTS & BONUS FEATURES

1. **Clean Modular Structure**: Code organized strictly into `components/`, `hooks/`, `navigation/`, `screens/`, `services/`, and `types/`.
2. **Real-Time Data Sync**: Implemented using Firestore's `onSnapshot()` for zero-delay synchronization across devices.
3. **Form Validation**: Client-side validation ensuring title is present and trimmed.
4. **Interactive Status Filter Bar**: Quick filter chips ('All', 'To Do', 'In Progress', 'Done') complete with dynamic count badges.
5. **Responsive Layout**: Accommodates both mobile phones and tablet viewports via adaptive container width constraints.
6. **Continuous Integration (CI)**: Configured GitHub Actions workflow (`.github/workflows/ci.yml`) that verifies TypeScript types on every commit.
