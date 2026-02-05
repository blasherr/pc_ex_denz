export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder' | 'image';
  content?: string;
  locked?: boolean;
  password?: string;
  children?: FileItem[];
  deleted?: boolean;
  canOpen?: boolean;
}

export const fileSystem: FileItem[] = [
  {
    id: 'research-01',
    name: 'Research_Alpha',
    type: 'folder',
    children: [
      { id: 'doc-01', name: 'Analysis_Report.pdf', type: 'file', canOpen: false },
      { id: 'doc-02', name: 'Data_Compilation.xlsx', type: 'file', canOpen: false },
      { id: 'doc-03', name: 'Notes_2024.txt', type: 'file', canOpen: false },
    ],
  },
  {
    id: 'research-02',
    name: 'Project_Beta',
    type: 'folder',
    children: [
      { id: 'doc-04', name: 'Specification.docx', type: 'file', canOpen: false },
      { id: 'doc-05', name: 'Timeline.pdf', type: 'file', canOpen: false },
    ],
  },
  {
    id: 'research-03',
    name: 'Experiments_2025',
    type: 'folder',
    children: [
      { id: 'doc-06', name: 'Test_Results.csv', type: 'file', canOpen: false },
      { id: 'doc-07', name: 'Observations.txt', type: 'file', canOpen: false },
      { id: 'doc-08', name: 'Protocol_v2.pdf', type: 'file', canOpen: false },
    ],
  },
  {
    id: 'research-04',
    name: 'Lab_Records',
    type: 'folder',
    children: [
      { id: 'doc-09', name: 'Entry_001.txt', type: 'file', canOpen: false },
      { id: 'doc-10', name: 'Entry_002.txt', type: 'file', canOpen: false },
    ],
  },
  {
    id: 'research-05',
    name: 'Archive_2023',
    type: 'folder',
    children: [
      { id: 'doc-11', name: 'OldFiles.zip', type: 'file', canOpen: false },
    ],
  },
  {
    id: 'research-06',
    name: 'Development_Docs',
    type: 'folder',
    children: [
      { id: 'doc-12', name: 'README.md', type: 'file', canOpen: false },
      { id: 'doc-13', name: 'Setup_Guide.pdf', type: 'file', canOpen: false },
    ],
  },
  {
    id: 'research-07',
    name: 'Financial_Reports',
    type: 'folder',
    children: [
      { id: 'doc-14', name: 'Q1_2025.xlsx', type: 'file', canOpen: false },
      { id: 'doc-15', name: 'Budget.pdf', type: 'file', canOpen: false },
    ],
  },
  {
    id: 'research-08',
    name: 'Meeting_Notes',
    type: 'folder',
    children: [
      { id: 'doc-16', name: 'Jan_2025.docx', type: 'file', canOpen: false },
    ],
  },
  {
    id: 'research-09',
    name: 'Backup_Files',
    type: 'folder',
    children: [
      { id: 'doc-17', name: 'backup_01.zip', type: 'file', canOpen: false },
      { id: 'doc-18', name: 'backup_02.zip', type: 'file', canOpen: false },
    ],
  },
  {
    id: 'research-10',
    name: 'Misc_Documents',
    type: 'folder',
    children: [
      { id: 'doc-19', name: 'TODO.txt', type: 'file', canOpen: false },
      { id: 'doc-20', name: 'Ideas.txt', type: 'file', canOpen: false },
    ],
  },
];

// Recycle Bin Items
export const recycleBin: FileItem[] = [
  {
    id: 'recycle-01',
    name: 'ex-toxique',
    type: 'folder',
    deleted: true,
    children: [
      { id: 'chat-01', name: 'Conversation_01.png', type: 'image', content: '/images/chat-01.png' },
      { id: 'chat-02', name: 'Conversation_02.png', type: 'image', content: '/images/chat-02.png' },
      { id: 'chat-03', name: 'Conversation_03.png', type: 'image', content: '/images/chat-03.png' },
      { id: 'chat-04', name: 'Conversation_04.png', type: 'image', content: '/images/chat-04.png' },
      { id: 'chat-05', name: 'Conversation_05.png', type: 'image', content: '/images/chat-05.png' },
      { id: 'chat-06', name: 'Conversation_06.png', type: 'image', content: '/images/chat-06.png' },
      { id: 'chat-07', name: 'Conversation_Custody.png', type: 'image', content: '/images/chat-07.png' },
    ],
  },
  {
    id: 'recycle-02',
    name: 'image +18',
    type: 'folder',
    deleted: true,
    children: [
      { id: 'report-01', name: 'GP-TWO_Report_001.pdf', type: 'file', content: '/reports/report-01.txt', canOpen: true },
      { id: 'report-02', name: 'GP-TWO_Report_002.pdf', type: 'file', content: '/reports/report-02.txt', canOpen: true },
      { id: 'report-03', name: 'GP-TWO_Report_003.pdf', type: 'file', content: '/reports/report-03.txt', canOpen: true },
      { id: 'report-04', name: 'GP-TWO_Report_004.pdf', type: 'file', content: '/reports/report-04.txt', canOpen: true },
      { id: 'report-05', name: 'GP-TWO_Report_005.pdf', type: 'file', content: '/reports/report-05.txt', canOpen: true },
      { id: 'report-06', name: 'GP-TWO_Report_006.pdf', type: 'file', content: '/reports/report-06.txt', canOpen: true },
      { id: 'report-07', name: 'GP-TWO_Report_007.pdf', type: 'file', content: '/reports/report-07.txt', canOpen: true },
      { id: 'report-08', name: 'GP-TWO_Report_008.pdf', type: 'file', content: '/reports/report-08.txt', canOpen: true },
      { id: 'report-09', name: 'GP-TWO_Report_009.pdf', type: 'file', content: '/reports/report-09.txt', canOpen: true },
      { id: 'report-10', name: 'GP-TWO_Report_010.pdf', type: 'file', content: '/reports/report-10.txt', canOpen: true },
    ],
  },
  {
    id: 'recycle-03',
    name: 'dossier test',
    type: 'folder',
    deleted: true,
    locked: true,
    password: '123456789',
    children: [
      { id: 'test-01', name: 'Confidential.txt', type: 'file', canOpen: false },
      { id: 'test-02', name: 'Encrypted_Data.dat', type: 'file', canOpen: false },
    ],
  },
];
