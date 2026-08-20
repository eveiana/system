export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
  bio: string;
  location: string;
  phone: string;
}

export type MemberRole = 'Owner' | 'Admin' | 'Member' | 'Guest';
export type MemberStatus = 'Active' | 'Inactive' | 'Pending';

export interface Member {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  status: MemberStatus;
  joinedDate: string;
  avatar: string;
  department: string;
}

export interface Application {
  id: string;
  name: string;
  email: string;
  type: 'Membership' | 'Project Funding' | 'Resource Access';
  title: string;
  description: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedDate: string;
}

export type ProjectStatus = 'Planning' | 'In Progress' | 'Completed' | 'On Hold';

export interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: ProjectStatus;
  members: string[]; // member names or avatars
  deadline: string;
  budget: number;
  category?: string;
  imageUrl?: string;
}

export type TaskStatus = 'Todo' | 'In Progress' | 'In Review' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assigneeName: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: 'Workshop' | 'Meetup' | 'Networking' | 'Conference';
  registeredMembers: string[]; // member names
}

export interface Booking {
  id: string;
  resourceName: string;
  userName: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
}

export interface ResourceFile {
  id: string;
  name: string;
  category: 'Guides' | 'Templates' | 'Assets' | 'Legal';
  type: string;
  size: string;
  uploaderName: string;
  uploadDate: string;
  url?: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
  description: string;
  status: 'Completed' | 'Pending';
}

export interface Invoice {
  id: string;
  recipient: string;
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  dueDate: string;
  issueDate: string;
}

export interface MediaItem {
  id: string;
  url: string;
  title: string;
  category: string;
  size: string;
  date: string;
  uploaderName?: string;
  description?: string;
  tags?: string[];
  dimensions?: string;
  downloadCount?: number;
}

export interface MarketItem {
  id: string;
  title: string;
  creatorName: string;
  category: 'Alternative Art' | 'Fashion & Wear' | 'Literature & Books' | 'Audio & Beats' | 'Eco Crafts' | 'Other';
  price: number;
  stock: number;
  description: string;
  url?: string;
  type: 'Physical' | 'Digital';
  salesCount: number;
}

export interface MarketSale {
  id: string;
  itemId: string;
  itemTitle: string;
  buyerName: string;
  units: number;
  totalAmount: number;
  date: string;
  payoutStatus: 'Paid' | 'Processing' | 'Held';
}

export interface Programme {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  badgeColor?: string;
  imageUrl?: string;
  externalUrl?: string;
  pillars?: {
    title: string;
    desc: string;
  }[];
  keyProjects?: {
    title: string;
    description: string;
    imageUrl?: string;
    tag?: string;
  }[];
}

export interface Masterclass {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  facilitatorName: string;
  facilitatorBio: string;
  facilitatorAvatar?: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  price: string;
  isPaid: boolean;
  enrolledCount: number;
  capacity: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  imageUrl: string;
  learningOutcomes: string[];
  prerequisites?: string;
  status: 'Upcoming' | 'Enrolling' | 'Completed' | 'On-Demand';
  externalUrl?: string;
}


