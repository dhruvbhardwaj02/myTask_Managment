export interface Task {
    id: string;       // Unique identifier for the task
    name: string;     // Name of the task
    details: string;   // Description or details of the task
    status: string;   // Current status of the task (e.g., Pending, Completed)
    startDate: Date;  // Start date of the task
    endDate: Date;    // End date or deadline of the task
    assign: string | null;  // Assigned person (null by default)
    team: string | null;    // Team name (null by default)
    type: string;     // Name of the task
    createdBy: string;     // Name of the task
  }