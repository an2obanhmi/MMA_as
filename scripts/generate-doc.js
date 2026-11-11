const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  WidthType,
  ShadingType,
} = require('docx');
const fs = require('fs');
const path = require('path');

function createDoc() {
  const tableBorder = {
    top: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
    left: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
    right: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
  };

  const imagePlaceholderTable = (sectionTitle, reqCode, captionText) => {
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              borders: tableBorder,
              shading: { type: ShadingType.CLEAR, fill: 'F4F6F8' },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `[SCREENSHOT PLACEHOLDER: ${sectionTitle}]`,
                      bold: true,
                      color: '002FA7',
                      size: 22,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 240, after: 120 },
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `(Paste your actual full-screen image here. Replace this box or insert image directly inside)`,
                      italics: true,
                      color: '777777',
                      size: 18,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 0, after: 240 },
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              borders: tableBorder,
              shading: { type: ShadingType.CLEAR, fill: 'FFFFFF' },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: 'Figure Caption: ', bold: true, size: 20 }),
                    new TextRun({ text: `[${reqCode}] `, bold: true, color: 'E65100', size: 20 }),
                    new TextRun({ text: captionText, size: 20 }),
                  ],
                  spacing: { before: 120, after: 120 },
                }),
              ],
            }),
          ],
        }),
      ],
    });
  };

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: 'PRACTICAL EXAM 2 – SUBMISSION REPORT',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 100 },
          }),
          new Paragraph({
            text: 'TASK MANAGEMENT APP: AUTHENTICATION, TEAMS & REAL-TIME CHAT',
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 300 },
          }),

          // Metadata Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    borders: tableBorder,
                    shading: { type: ShadingType.CLEAR, fill: 'F0F4F8' },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Student ID:', bold: true })],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    borders: tableBorder,
                    children: [new Paragraph({ text: 'QE170113' })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: tableBorder,
                    shading: { type: ShadingType.CLEAR, fill: 'F0F4F8' },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Student Name:', bold: true })],
                      }),
                    ],
                  }),
                  new TableCell({
                    borders: tableBorder,
                    children: [new Paragraph({ text: '[Điền Họ và Tên của bạn]' })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: tableBorder,
                    shading: { type: ShadingType.CLEAR, fill: 'F0F4F8' },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Course / Subject:', bold: true })],
                      }),
                    ],
                  }),
                  new TableCell({
                    borders: tableBorder,
                    children: [new Paragraph({ text: 'MMA301 - Mobile Application Development' })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: tableBorder,
                    shading: { type: ShadingType.CLEAR, fill: 'F0F4F8' },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'GitHub Repository:', bold: true })],
                      }),
                    ],
                  }),
                  new TableCell({
                    borders: tableBorder,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'https://github.com/an2obanhmi/MMA_as.git',
                            color: '002FA7',
                            underline: {},
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: tableBorder,
                    shading: { type: ShadingType.CLEAR, fill: 'F0F4F8' },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Expo / APK Link:', bold: true })],
                      }),
                    ],
                  }),
                  new TableCell({
                    borders: tableBorder,
                    children: [
                      new Paragraph({
                        text: '[Điền Expo project link / QR Code / EAS Build APK link tại đây]',
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: tableBorder,
                    shading: { type: ShadingType.CLEAR, fill: 'F0F4F8' },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Submission Date:', bold: true })],
                      }),
                    ],
                  }),
                  new TableCell({
                    borders: tableBorder,
                    children: [new Paragraph({ text: new Date().toLocaleDateString('vi-VN') })],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: '', spacing: { before: 200, after: 200 } }),

          // Section 1
          new Paragraph({
            text: '1. PROJECT OVERVIEW & DELIVERABLE LINKS',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '• Public GitHub Repository: ',
                bold: true,
              }),
              new TextRun({
                text: 'https://github.com/an2obanhmi/MMA_as.git',
                color: '002FA7',
                underline: {},
              }),
              new TextRun({
                text: ' (Contains complete TypeScript React Native source code, commits, and instructions).',
              }),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '• Test Accounts Used in Demonstration:',
                bold: true,
              }),
            ],
            spacing: { after: 60 },
          }),
          new Paragraph({
            text: '   - Account 1 (Owner/Admin): testuser1@gmail.com / Pass: 123456 (Tên: Test User 1)',
            spacing: { after: 40 },
          }),
          new Paragraph({
            text: '   - Account 2 (Member): testuser2@gmail.com / Pass: 123456 (Tên: Test User 2)',
            spacing: { after: 150 },
          }),

          // Section 2
          new Paragraph({
            text: '2. FIREBASE CONSOLE EVIDENCE',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text: '2.1. Firebase Authentication Console',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 100, after: 80 },
          }),
          imagePlaceholderTable(
            'Firebase Authentication Console - Users List',
            'Req 1',
            'Firebase Authentication console displaying registered test users (e.g., testuser1@gmail.com, testuser2@gmail.com) demonstrating active email/password provider.'
          ),

          new Paragraph({
            text: '2.2. Cloud Firestore Database Collections',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 80 },
          }),
          imagePlaceholderTable(
            'Cloud Firestore Console - users, teams, tasks, and messages',
            'Req 2, 3, 4',
            'Cloud Firestore database console showing structured collections: `users`, `teams`, `tasks`, and subcollection `messages` populated with sample live test data.'
          ),

          new Paragraph({
            text: '2.3. Firestore Security Rules',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 80 },
          }),
          imagePlaceholderTable(
            'Firebase Console - Security Rules Published',
            'Req 5',
            'Firestore Security Rules tab published in Firebase Console enforcing `request.auth != null` access control on teams, tasks, and chat messages.'
          ),

          // Section 3
          new Paragraph({
            text: '3. APPLICATION SCREENS & FUNCTIONAL EVIDENCE',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 100 },
          }),

          new Paragraph({
            text: '3.1. Authentication Screens (Sign Up & Login)',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 100, after: 80 },
          }),
          imagePlaceholderTable(
            'Sign Up Screen & Validation',
            'Req 1',
            'Sign Up screen with input fields (name, email, password, confirm password) and form validation / password visibility toggles.'
          ),
          new Paragraph({ text: '', spacing: { before: 100, after: 100 } }),
          imagePlaceholderTable(
            'Login Screen',
            'Req 1',
            'Login screen allowing users to sign in with Firebase Auth and navigating to Home/Teams upon success.'
          ),

          new Paragraph({
            text: '3.2. Home Screen (Authenticated Task Management)',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 80 },
          }),
          imagePlaceholderTable(
            'Home Screen - Team-Linked Task List',
            'Req 1 & 3',
            'Home screen protected behind login, displaying tasks categorized by status and showing team tag and assignee name.'
          ),

          new Paragraph({
            text: '3.3. Teams Management (Create, Join & Team Detail)',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 80 },
          }),
          imagePlaceholderTable(
            'Teams Screen - Workspace List, Create & Join Modal',
            'Req 2',
            'Teams screen showing active team memberships with options to create a new team or join with a team code.'
          ),
          new Paragraph({ text: '', spacing: { before: 100, after: 100 } }),
          imagePlaceholderTable(
            'Team Detail Screen - Members & Team Tasks',
            'Req 2',
            'Team Detail screen showing team details, team code, list of members with roles (OWNER / MEMBER), and tasks assigned to the workspace.'
          ),

          new Paragraph({
            text: '3.4. Tasks Linked to Teams & Assignees',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 80 },
          }),
          imagePlaceholderTable(
            'Task Form - Team & Member Assignee Dropdown',
            'Req 3',
            'Task creation/edit modal showing dropdown to select target Team and dropdown to select specific Assignee from team members.'
          ),
          new Paragraph({ text: '', spacing: { before: 100, after: 100 } }),
          imagePlaceholderTable(
            'Resulting Task Card Showing Assignee',
            'Req 3',
            'Task Card rendered on screen clearly displaying the designated Team tag and @Assignee badge.'
          ),

          new Paragraph({
            text: '3.5. Real-Time Team Chat Screen',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 80 },
          }),
          imagePlaceholderTable(
            'Real-Time Chat Screen - Conversation Between Two Users',
            'Req 4',
            'Real-time Chat screen showing multi-user conversation with timestamps, visual bubble distinction for current user vs other team members, and instant live sync.'
          ),

          new Paragraph({
            text: '3.6. Profile Screen & Safe Logout',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 80 },
          }),
          imagePlaceholderTable(
            'Profile Screen with User Details & Logout Confirmation',
            'Req 1',
            'Profile screen displaying current logged-in user name, email, avatar, theme toggle, and Logout action returning user back to Login screen.'
          ),

          // Section 4
          new Paragraph({
            text: '4. SELF-EVALUATION & CHECKLIST MATRIX',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 100 },
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 10, type: WidthType.PERCENTAGE },
                    borders: tableBorder,
                    shading: { type: ShadingType.CLEAR, fill: '002FA7' },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'No.', bold: true, color: 'FFFFFF' })],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 45, type: WidthType.PERCENTAGE },
                    borders: tableBorder,
                    shading: { type: ShadingType.CLEAR, fill: '002FA7' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Requirement Description', bold: true, color: 'FFFFFF' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    borders: tableBorder,
                    shading: { type: ShadingType.CLEAR, fill: '002FA7' },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Status', bold: true, color: 'FFFFFF' })],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    borders: tableBorder,
                    shading: { type: ShadingType.CLEAR, fill: '002FA7' },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'Evidence Figure', bold: true, color: 'FFFFFF' })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: tableBorder, children: [new Paragraph({ text: '1' })] }),
                  new TableCell({
                    borders: tableBorder,
                    children: [
                      new Paragraph({
                        text: 'Firebase Auth: Sign Up, Login, Logout, Persist Session (AsyncStorage), Protected Screens',
                      }),
                    ],
                  }),
                  new TableCell({
                    borders: tableBorder,
                    children: [new Paragraph({ children: [new TextRun({ text: 'COMPLETED [100%]', bold: true, color: '008000' })] })],
                  }),
                  new TableCell({
                    borders: tableBorder,
                    children: [new Paragraph({ text: 'Section 2.1, 3.1, 3.6' })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: tableBorder, children: [new Paragraph({ text: '2' })] }),
                  new TableCell({
                    borders: tableBorder,
                    children: [
                      new Paragraph({
                        text: 'Teams: Create Team, Join by Code, Team Detail (Members & Tasks)',
                      }),
                    ],
                  }),
                  new TableCell({
                    borders: tableBorder,
                    children: [new Paragraph({ children: [new TextRun({ text: 'COMPLETED [100%]', bold: true, color: '008000' })] })],
                  }),
                  new TableCell({
                    borders: tableBorder,
                    children: [new Paragraph({ text: 'Section 2.2, 3.3' })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: tableBorder, children: [new Paragraph({ text: '3' })] }),
                  new TableCell({
                    borders: tableBorder,
                    children: [
                      new Paragraph({
                        text: 'Tasks Linked to Teams & Assignees: Assignee selector dropdown, Task card badges',
                      }),
                    ],
                  }),
                  new TableCell({
                    borders: tableBorder,
                    children: [new Paragraph({ children: [new TextRun({ text: 'COMPLETED [100%]', bold: true, color: '008000' })] })],
                  }),
                  new TableCell({
                    borders: tableBorder,
                    children: [new Paragraph({ text: 'Section 3.2, 3.4' })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: tableBorder, children: [new Paragraph({ text: '4' })] }),
                  new TableCell({
                    borders: tableBorder,
                    children: [
                      new Paragraph({
                        text: 'Real-Time Team Chat: onSnapshot listener, multi-user messages, visual bubble distinction',
                      }),
                    ],
                  }),
                  new TableCell({
                    borders: tableBorder,
                    children: [new Paragraph({ children: [new TextRun({ text: 'COMPLETED [100%]', bold: true, color: '008000' })] })],
                  }),
                  new TableCell({
                    borders: tableBorder,
                    children: [new Paragraph({ text: 'Section 2.2, 3.5' })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: tableBorder, children: [new Paragraph({ text: '5' })] }),
                  new TableCell({
                    borders: tableBorder,
                    children: [
                      new Paragraph({
                        text: 'Firestore Security Rules: request.auth != null rule applied and published',
                      }),
                    ],
                  }),
                  new TableCell({
                    borders: tableBorder,
                    children: [new Paragraph({ children: [new TextRun({ text: 'COMPLETED [100%]', bold: true, color: '008000' })] })],
                  }),
                  new TableCell({
                    borders: tableBorder,
                    children: [new Paragraph({ text: 'Section 2.3' })],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: '', spacing: { before: 200, after: 200 } }),
        ],
      },
    ],
  });

  const targetPath = path.resolve('d:/assignmentMMA/task-management-app', 'QE170113.docx');
  const targetPathExam2 = path.resolve('d:/assignmentMMA/task-management-app', 'QE170113_Exam2.docx');

  Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync(targetPath, buffer);
    fs.writeFileSync(targetPathExam2, buffer);
    console.log('Successfully generated docx files:');
    console.log('1.', targetPath);
    console.log('2.', targetPathExam2);
  });
}

createDoc();
