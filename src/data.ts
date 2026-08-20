import Images from './images';
import { 
  UserProfile, 
  Member, 
  Application, 
  Project, 
  Task, 
  Event, 
  Booking, 
  ResourceFile, 
  Transaction, 
  Invoice, 
  MediaItem,
  MarketItem,
  MarketSale,
  Programme,
  Masterclass
} from './types';

export const INITIAL_USER: UserProfile = {
  name: "Evaline Atieno",
  email: "evalineatieno857@gmail.com",
  role: "Community Director",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  bio: "Passionate about creating collaborative ecosystems and supporting early-stage founders, creators, and community builders.",
  location: "Nairobi, Kenya",
  phone: "+254 712 345 678"
};

export const INITIAL_MEMBERS: Member[] = [
  {
    id: "mem-1",
    name: "Alex 2",
    email: "alex@creativehub.org",
    role: "Admin",
    status: "Active",
    joinedDate: "2025-01-15",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    department: "Product Design"
  },
  {
    id: "mem-2",
    name: "Zahra Hassan",
    email: "zahra@techfoundry.co",
    role: "Member",
    status: "Active",
    joinedDate: "2025-02-10",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    department: "Software Engineering"
  },
  {
    id: "mem-3",
    name: "Michael Chen",
    email: "m.chen@ventures.com",
    role: "Member",
    status: "Active",
    joinedDate: "2025-03-01",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    department: "Marketing & Growth"
  },
  {
    id: "mem-4",
    name: "C2",
    email: "elena@designstudio.ru",
    role: "Member",
    status: "Pending",
    joinedDate: "2026-07-01",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
    department: "Product Design"
  },
  {
    id: "mem-5",
    name: "David Ndwiga",
    email: "david@finflow.org",
    role: "Guest",
    status: "Active",
    joinedDate: "2025-11-20",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150",
    department: "Finance"
  },
  {
    id: "mem-6",
    name: "Sarah Jenkins",
    email: "sarah@greenloop.earth",
    role: "Member",
    status: "Inactive",
    joinedDate: "2025-05-14",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    department: "Sustainability"
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: "app-1",
    name: "cg3",
    email: "cg@sondekashows.ke",
    type: "Membership",
    title: "Sondeka Academy Podcast Collective",
    description: "Applying for podcast and recording studio space membership to produce local independent community-centric podcast series.",
    status: "Pending",
    submittedDate: "2026-07-07"
  },
  {
    id: "app-2",
    name: "Sophia cj",
    email: "sophia@cj.com",
    type: "Project Funding",
    title: "EcoBright Upcycling Initiative",
    description: "Seeking community grant funding (KSh 150,000) for starting a local plastic waste upcycling station in Nairobi West as a Sondeka Awards entry.",
    status: "Pending",
    submittedDate: "2026-07-08"
  },
  {
    id: "app-3",
    name: "Achieng' Odera",
    email: "achieng@femmolution.ke",
    type: "Resource Access",
    title: "Femmolution Residency Project",
    description: "Applying for creative incubation under the Femmolution Series to record acoustic EP in the community sound room.",
    status: "Approved",
    submittedDate: "2026-07-05"
  },
  {
    id: "app-4",
    name: "Jane Doe",
    email: "jane@startupbox.com",
    type: "Membership",
    title: "StartupBox Growth Hackers",
    description: "Requesting a permanent hot desk team package for our SaaS product launch squad.",
    status: "Rejected",
    submittedDate: "2026-06-28"
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "Sondeka Festival 2026",
    description: "Organizing the premier multidisciplinary festival that celebrates innovations and alternative forms of creative expression.",
    progress: 75,
    status: "In Progress",
    members: ["Alex Kamau", "Zahra Hassan", "Evaline Atieno"],
    deadline: "2026-10-15",
    budget: 350000,
    category: "General Hub"
  },
  {
    id: "proj-2",
    name: "Femmolution Showcase",
    description: "Providing a platform for female creative practitioners in East Africa to collaborate, perform, and access business coaching.",
    progress: 40,
    status: "In Progress",
    members: ["Sarah Jenkins", "Michael Chen"],
    deadline: "2026-09-30",
    budget: 180000,
    category: "Women Programme",
    imageUrl: Images.africanWom
  },
  {
    id: "proj-3",
    name: "Sondeka Awards Selection",
    description: "Curating the panel and receiving submissions for the annual awards celebrating East Africa's most innovative creations.",
    progress: 95,
    status: "Planning",
    members: ["Michael Chen", "Alex Kamau", "David Ndwiga"],
    deadline: "2026-11-20",
    budget: 250000,
    category: "General Hub"
  },
  {
    id: "proj-4",
    name: "Garage Market Platform",
    description: "Re-platforming the online store to empower local designers and authors to list, distribute, and sell physical and digital works.",
    progress: 100,
    status: "Completed",
    members: ["Zahra Hassan", "David Ndwiga", "Evaline Atieno"],
    deadline: "2026-06-20",
    budget: 120000,
    category: "General Hub"
  },
  {
    id: "proj-w1",
    name: "A thirst trap for Sextortion",
    description: "In a nation thirsting for change, this is a bold call to expose exploitation and demand accountability.",
    progress: 85,
    status: "In Progress",
    members: ["Evaline Atieno", "Zahra Hassan"],
    deadline: "2026-11-30",
    budget: 200000,
    category: "Women Programme",
    imageUrl: Images.black
  },
  {
    id: "proj-w2",
    name: "Genesis",
    description: "A poetic reawakening of an origin story, rooted in memory, myth, and becoming.",
    progress: 100,
    status: "Completed",
    members: ["Evaline Atieno", "Elena Rostova"],
    deadline: "2026-05-15",
    budget: 150000,
    category: "Women Programme",
    imageUrl: Images.realPeople
  },
  {
    id: "proj-w3",
    name: "Reserved for Women",
    description: "Challenging stereotypes and prejudices while boldly promoting gender equality.",
    progress: 90,
    status: "In Progress",
    members: ["Evaline Atieno", "Elena Rostova"],
    deadline: "2026-10-01",
    budget: 180000,
    category: "Women Programme",
    imageUrl: Images.tales
  },
  {
    id: "proj-w4",
    name: "Mama Mboga",
    description: "Celebrating everyday heroes at the heart of Kenya’s national food security.",
    progress: 100,
    status: "Completed",
    members: ["Evaline Atieno", "Alex Kamau"],
    deadline: "2026-04-20",
    budget: 220000,
    category: "Women Programme",
    imageUrl: Images.mamaMboga
  },
  {
    id: "proj-w5",
    name: "I Speak",
    description: "Amplifying the voices of marginalized women in Tana River through story and strength.",
    progress: 60,
    status: "In Progress",
    members: ["Evaline Atieno", "cg5"],
    deadline: "2026-11-15",
    budget: 250000,
    category: "Women Programme",
    imageUrl: Images.iSpeak
  },
  {
    id: "proj-w6",
    name: "African Women in Cultural Leadership",
    description: "A six-month mentorship program nurturing the next generation of women cultural leaders across the continent.",
    progress: 50,
    status: "In Progress",
    members: ["Evaline Atieno", "cg4"],
    deadline: "2027-01-31",
    budget: 400000,
    category: "Women Programme",
    imageUrl: Images.africanWom
  },
  {
    id: "proj-w7",
    name: "Tales of Dreamers",
    description: "A collection of short stories celebrating the inspiring journeys and resilience of Kenyan women.",
    progress: 100,
    status: "Completed",
    members: ["Evaline Atieno", "cg6"],
    deadline: "2026-03-10",
    budget: 160000,
    category: "Women Programme",
    imageUrl: Images.tales
  },
  {
    id: "proj-w8",
    name: "Tana Stories",
    description: "Capturing the voices and perspectives of local women through lived experience and storytelling.",
    progress: 80,
    status: "In Progress",
    members: ["Evaline Atieno", "gg7"],
    deadline: "2026-10-30",
    budget: 210000,
    category: "Women Programme",
    imageUrl: Images.tana
  },
  {
    id: "proj-w9",
    name: "Binti Uongozini",
    description: "Inspiring and empowering young women to actively participate in national politics and leadership.",
    progress: 45,
    status: "Planning",
    members: ["Evaline Atieno", "cg3"],
    deadline: "2026-12-20",
    budget: 280000,
    category: "Women Programme",
    imageUrl: Images.binti
  },
  {
    id: "proj-w10",
    name: "Black Valentine",
    description: "A short film confronting the chilling undercurrent of intimate partner violence.",
    progress: 100,
    status: "Completed",
    members: ["Evaline Atieno", "Alex Kamau"],
    deadline: "2026-02-14",
    budget: 190000,
    category: "Women Programme",
    imageUrl: Images.black
  },
  {
    id: "proj-w11",
    name: "Laugh Out Ladies",
    description: "A platform for Black African women to share their stories, experiences, and unapologetic laughter through comedy and community.",
    progress: 75,
    status: "In Progress",
    members: ["Evaline Atieno", "cg."],
    deadline: "2026-09-15",
    budget: 170000,
    category: "Women Programme",
    imageUrl: Images.laugh
  },
  {
    id: "proj-ma-1",
    name: "Kalabars",
    description: "Innovative media & film distribution platform focused on sharing bold, authentic, and diverse African narratives.",
    progress: 90,
    status: "In Progress",
    members: ["Alex Kamau", "Evaline Atieno"],
    deadline: "2026-12-15",
    budget: 300000,
    category: "Commerce & Trade",
    imageUrl: "https://images.unsplash.com/photo-1578022761797-b8636ac1773c?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: "proj-ma-2",
    name: "Baiskeli Store (baiskeli.store)",
    description: "Creatives Garage's flagship e-commerce and retail platform celebrating Kenyan pop and contemporary culture through published books, anthologies, zines, comics, apparel, and artisan crafts.",
    progress: 100,
    status: "Completed",
    members: ["Zahra Hassan", "Michael Chen"],
    deadline: "2026-06-30",
    budget: 250000,
    category: "Commerce & Trade",
    imageUrl: Images.marketAccess
  },
  {
    id: "proj-ma-3",
    name: "CG Studios",
    description: "State-of-the-art audio production facility offering mentorship, podcasting, film scores, and music licensing access.",
    progress: 85,
    status: "In Progress",
    members: ["cg3", "cg5"],
    deadline: "2026-11-10",
    budget: 320000,
    category: "Commerce & Trade",
    imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: "proj-ct-1",
    name: "Mental Notes",
    description: "Digital anthology created in collaboration with Sisi Wellness exploring mental health struggles, anxiety, depression, and burnout among Kenyan creatives.",
    progress: 95,
    status: "Completed",
    members: ["Evaline Atieno", "Zahra Hassan"],
    deadline: "2026-08-30",
    budget: 180000,
    category: "Collection of Thoughts",
    imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: "proj-ct-2",
    name: "Copy Paste – Anatomy of a Regret Letter",
    description: "Mixed-media installation by Thayù exploring the psychological impact of professional rejection on artists, transforming rejection into resilience.",
    progress: 90,
    status: "In Progress",
    members: ["Alex Kamau", "Michael Chen"],
    deadline: "2026-11-20",
    budget: 220000,
    category: "Collection of Thoughts",
    imageUrl: "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: "proj-ct-3",
    name: "Stories of Pride Anthology",
    description: "Personal narratives and memoirs from queer individuals in Kenya, fostering empathy, dignity, and societal understanding.",
    progress: 100,
    status: "Completed",
    members: ["Zahra Hassan", "Evaline Atieno"],
    deadline: "2026-05-15",
    budget: 200000,
    category: "Collection of Thoughts",
    imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: "proj-ct-4",
    name: "Category Is...",
    description: "Postcard series and visual arts celebrating the Kenyan LGBTQA+ community and ballroom culture as a form of self-expression.",
    progress: 85,
    status: "In Progress",
    members: ["Mutua Kilonzo", "Zahra Hassan"],
    deadline: "2026-12-01",
    budget: 150000,
    category: "Collection of Thoughts",
    imageUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: "proj-colab-1",
    name: "Ole Sondeka vs Bwana Stache",
    description: "An adventurous computer game blending East African folklore, satire, and interactive video game mechanics.",
    progress: 80,
    status: "In Progress",
    members: ["Alex Kamau", "Michael Chen", "Evaline Atieno"],
    deadline: "2026-11-15",
    budget: 350000,
    category: "Co-Lab X",
    imageUrl: Images.sondeka
  },
  {
    id: "proj-colab-2",
    name: "Shall We Go?",
    description: "A poignant short film exploring mental health, emotional vulnerability, and healing among African youth.",
    progress: 100,
    status: "Completed",
    members: ["Zahra Hassan", "Evaline Atieno"],
    deadline: "2026-05-20",
    budget: 200000,
    category: "Co-Lab X",
    imageUrl: Images.realPeople
  },
  {
    id: "proj-colab-3",
    name: "MASKAN",
    description: "An evocative art installation and memorial addressing femicide and gender-based violence in Kenya.",
    progress: 90,
    status: "In Progress",
    members: ["Evaline Atieno", "Sarah Jenkins"],
    deadline: "2026-10-10",
    budget: 220000,
    category: "Co-Lab X",
    imageUrl: Images.black
  },
  {
    id: "proj-colab-4",
    name: "Shoejaa",
    description: "An experimental research and craft initiative studying sustainable leather value chains in Kenya.",
    progress: 65,
    status: "In Progress",
    members: ["David Ndwiga", "Alex Kamau"],
    deadline: "2026-12-01",
    budget: 180000,
    category: "Co-Lab X",
    imageUrl: Images.mamaMboga
  },
  {
    id: "proj-colab-5",
    name: "Nairobi By-Laws",
    description: "A striking visual and graphic presentation decoding minor road offenses and civic rights.",
    progress: 100,
    status: "Completed",
    members: ["Michael Chen", "Evaline Atieno"],
    deadline: "2026-03-30",
    budget: 140000,
    category: "Co-Lab X",
    imageUrl: Images.tales
  },
  {
    id: "proj-colab-6",
    name: "Ditoro",
    description: "An immersive visual dreamscape exploring memory, myth, ancestry, and longing.",
    progress: 85,
    status: "In Progress",
    members: ["Elena Rostova", "Evaline Atieno"],
    deadline: "2026-09-25",
    budget: 210000,
    category: "Co-Lab X",
    imageUrl: Images.realPeople
  },
  {
    id: "proj-colab-7",
    name: "Not All Birds",
    description: "A poetic anthology exploring resilience, flight, freedom, and African identity.",
    progress: 100,
    status: "Completed",
    members: ["Evaline Atieno", "Zahra Hassan"],
    deadline: "2026-04-10",
    budget: 160000,
    category: "Co-Lab X",
    imageUrl: Images.tana
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Verify Sondeka Awards submissions",
    description: "Pre-screen submitted categories for short films, digital art, and audio podcasts to prepare for jury review.",
    status: "In Progress",
    priority: "High",
    dueDate: "2026-07-15",
    assigneeName: "David Ndwiga"
  },
  {
    id: "task-2",
    title: "Draft Femmolution stage layout",
    description: "Coordinate with audio-visual partners to finalize live-sound requirements for the acoustic sets.",
    status: "Todo",
    priority: "Medium",
    dueDate: "2026-07-12",
    assigneeName: "Michael Chen"
  },
  {
    id: "task-3",
    title: "Onboard new Sondeka Academy cohort",
    description: "Review residency application documents and arrange intro Zoom sessions for selected fellows.",
    status: "Todo",
    priority: "High",
    dueDate: "2026-07-10",
    assigneeName: "Evaline Atieno"
  },
  {
    id: "task-4",
    title: "Review portal wireframes",
    description: "Sign off on high-fidelity dashboard layouts with the design team lead.",
    status: "In Review",
    priority: "Medium",
    dueDate: "2026-07-08",
    assigneeName: "Alex Kamau"
  },
  {
    id: "task-5",
    title: "Order sustainable materials for Pop-up Market",
    description: "Order recycled display boards and tables for the main garage exhibition hall setup.",
    status: "Done",
    priority: "Low",
    dueDate: "2026-07-05",
    assigneeName: "Alex Kamau"
  }
];

export const INITIAL_EVENTS: Event[] = [
  {
    id: "evt-1",
    title: "Sondeka Academy: IP & Copyright for Artists",
    description: "An intensive masterclass on protecting intellectual property, understanding copyrights, licensing music, and monetizing your art.",
    date: "2026-07-12",
    time: "09:00 - 11:30",
    location: "Main Workshop Hall",
    category: "Workshop",
    registeredMembers: ["Alex Kamau", "Zahra Hassan", "Michael Chen", "Evaline Atieno"]
  },
  {
    id: "evt-2",
    title: "Femmolution Creative Lounge",
    description: "An intimate evening of panels, networking, and acoustic showcases amplifying local female artists, writers, and cultural practitioners.",
    date: "2026-07-18",
    time: "18:00 - 21:00",
    location: "Acoustic Lounge",
    category: "Meetup",
    registeredMembers: ["Zahra Hassan", "Alex Kamau", "Elena Rostova"]
  },
  {
    id: "evt-3",
    title: "Garage Monthly Pop-up Market",
    description: "A bustling indoor-outdoor market featuring alternative fashion, eco-furniture, local literature, hand-painted art, and live beats.",
    date: "2026-08-05",
    time: "10:00 - 18:00",
    location: "Main Auditorium & Yard",
    category: "Conference",
    registeredMembers: ["Sarah Jenkins", "Michael Chen", "Kofi Mensah", "Zahra Hassan"]
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "book-1",
    resourceName: "Conference Room A (Glass Wall)",
    userName: "Michael Chen",
    date: "2026-07-09",
    startTime: "10:00",
    endTime: "11:30",
    purpose: "Marketing sprint alignment and brand update"
  },
  {
    id: "book-2",
    resourceName: "Podcast & Media Studio",
    userName: "Alex Kamau",
    date: "2026-07-09",
    startTime: "14:00",
    endTime: "16:00",
    purpose: "Recording Community Stories - Episode 12"
  },
  {
    id: "book-3",
    resourceName: "Innovation Sandbox Lab",
    userName: "Zahra Hassan",
    date: "2026-07-10",
    startTime: "11:00",
    endTime: "13:00",
    purpose: "Frontend code integration pairing session"
  }
];

export const INITIAL_RESOURCES: ResourceFile[] = [
  {
    id: "res-1",
    name: "Co-working Code of Conduct 2026.pdf",
    category: "Guides",
    type: "pdf",
    size: "1.4 MB",
    uploaderName: "Evaline Atieno",
    uploadDate: "2026-01-01"
  },
  {
    id: "res-2",
    name: "Pitch Deck Template & Checklist.zip",
    category: "Templates",
    type: "zip",
    size: "14.2 MB",
    uploaderName: "Michael Chen",
    uploadDate: "2026-03-15"
  },
  {
    id: "res-3",
    name: "Sondeka Festival Poster 2026.png",
    category: "Assets",
    type: "png",
    size: "4.2 MB",
    uploaderName: "Alex Kamau",
    uploadDate: "2026-02-10",
    url: "https://images.unsplash.com/photo-1542744173-8e0ee268cfec?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "res-4",
    name: "Membership Service Level Agreement.docx",
    category: "Legal",
    type: "docx",
    size: "340 KB",
    uploaderName: "Evaline Atieno",
    uploadDate: "2026-01-05"
  },
  {
    id: "res-5",
    name: "Femmolution Key Visual.jpg",
    category: "Assets",
    type: "jpg",
    size: "2.8 MB",
    uploaderName: "Achieng' Odera",
    uploadDate: "2026-03-20",
    url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "res-6",
    name: "Garage Maker Space Blueprint.svg",
    category: "Assets",
    type: "svg",
    size: "820 KB",
    uploaderName: "Mutua Kilonzo",
    uploadDate: "2026-04-12",
    url: "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&q=80&w=600"
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    type: "income",
    amount: 14500,
    category: "Memberships",
    date: "2026-07-01",
    description: "Monthly recurring space memberships collection",
    status: "Completed"
  },
  {
    id: "tx-2",
    type: "expense",
    amount: 1200,
    category: "Utilities",
    date: "2026-07-02",
    description: "High-speed fiber-optic internet connection fee",
    status: "Completed"
  },
  {
    id: "tx-3",
    type: "income",
    amount: 3200,
    category: "Room Bookings",
    date: "2026-07-03",
    description: "External enterprise meeting room rental",
    status: "Completed"
  },
  {
    id: "tx-4",
    type: "expense",
    amount: 450,
    category: "Kitchen & Pantry",
    date: "2026-07-04",
    description: "Organic Kenyan roasted coffee bean refills",
    status: "Completed"
  },
  {
    id: "tx-5",
    type: "income",
    amount: 5000,
    category: "Sponsorships",
    date: "2026-07-05",
    description: "Expo sponsorship deposit - TechVenture Africa",
    status: "Completed"
  },
  {
    id: "tx-6",
    type: "expense",
    amount: 800,
    category: "Marketing",
    date: "2026-07-06",
    description: "Social ad campaign promotion for Innovation Hackathon",
    status: "Completed"
  },
  {
    id: "tx-7",
    type: "expense",
    amount: 2500,
    category: "Salaries",
    date: "2026-07-07",
    description: "Part-time hosting and reception team payment",
    status: "Completed"
  },
  {
    id: "tx-8",
    type: "income",
    amount: 1200,
    category: "Event Tickets",
    date: "2026-07-08",
    description: "Ticket sales for Evening Entrepreneurship Panel",
    status: "Completed"
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: "INV-2026-001",
    recipient: "Alex Kamau (Creatives Garage)",
    amount: 1200,
    status: "Paid",
    dueDate: "2026-07-05",
    issueDate: "2026-06-25"
  },
  {
    id: "INV-2026-002",
    recipient: "Zahra Hassan (TechFoundry)",
    amount: 1800,
    status: "Paid",
    dueDate: "2026-07-05",
    issueDate: "2026-06-25"
  },
  {
    id: "INV-2026-003",
    recipient: "Kofi Mensah (AfricaTech)",
    amount: 950,
    status: "Unpaid",
    dueDate: "2026-07-25",
    issueDate: "2026-07-05"
  },
  {
    id: "INV-2026-004",
    recipient: "Sophia Martinez (EcoBright)",
    amount: 600,
    status: "Overdue",
    dueDate: "2026-07-01",
    issueDate: "2026-06-15"
  }
];

export const INITIAL_MEDIA: MediaItem[] = [
  {
    id: "med-1",
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
    title: "Creatives Garage Main Hub (The Mall, Westlands)",
    category: "Workspace",
    size: "4.8 MB",
    date: "2026-01-10",
    uploaderName: "Evaline Atieno",
    description: "Open plan creative co-working space, hot desks, and meeting pods located at The Mall Westlands, Nairobi.",
    tags: ["Westlands", "Co-Working", "Hub"],
    dimensions: "3840 x 2160",
    downloadCount: 42
  },
  {
    id: "med-2",
    url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200",
    title: "Sondeka AI & Tech Innovation Workshop",
    category: "Events",
    size: "3.8 MB",
    date: "2026-02-18",
    uploaderName: "Kofi Mensah",
    description: "Hands-on masterclass session exploring AI tools, generative art, and digital storytelling for East African creatives.",
    tags: ["AI", "Sondeka", "Masterclass"],
    dimensions: "1920 x 1080",
    downloadCount: 88
  },
  {
    id: "med-3",
    url: "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&q=80&w=1200",
    title: "Femmolution Residency Exhibition Launch",
    category: "Events",
    size: "5.1 MB",
    date: "2026-03-12",
    uploaderName: "Zahra Hassan",
    description: "Opening night for the Femmolution Art Residency featuring feminist murals, live music performance, and panel discussions.",
    tags: ["Femmolution", "Exhibition", "Art"],
    dimensions: "2400 x 1600",
    downloadCount: 65
  },
  {
    id: "med-4",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200",
    title: "Women Programme Production Planning",
    category: "Projects",
    size: "2.7 MB",
    date: "2026-04-05",
    uploaderName: "Achieng' Odera",
    description: "Creative review and storyboarding session for upcoming women-led film and documentary projects.",
    tags: ["Women Programme", "Film", "Planning"],
    dimensions: "1920 x 1280",
    downloadCount: 31
  },
  {
    id: "med-5",
    url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1200",
    title: "Audio Studio & Podcast Recording Booth",
    category: "Workspace",
    size: "6.3 MB",
    date: "2026-05-11",
    uploaderName: "Mutua Kilonzo",
    description: "Acoustically treated podcasting studio equipped with studio microphones, mixing console, and livestream camera setup.",
    tags: ["Audio", "Podcast", "Studio"],
    dimensions: "3000 x 2000",
    downloadCount: 94
  },
  {
    id: "med-6",
    url: "https://images.unsplash.com/photo-1542744173-8e0ee268cfec?auto=format&fit=crop&q=80&w=1200",
    title: "Sondeka Festival Main Stage Keynote",
    category: "Marketing",
    size: "4.9 MB",
    date: "2026-06-20",
    uploaderName: "Alex Kamau",
    description: "High-resolution press photo of the Sondeka Festival main stage pitch and creative showcases.",
    tags: ["Sondeka", "Festival", "Press"],
    dimensions: "2560 x 1440",
    downloadCount: 112
  },
  {
    id: "med-7",
    url: Images.logo,
    title: "Creatives Garage Brand Identity Vector",
    category: "Branding",
    size: "1.2 MB",
    date: "2026-06-25",
    uploaderName: "Evaline Atieno",
    description: "Official Creatives Garage high-resolution brand logo mark and typography guide for press and partners.",
    tags: ["Logo", "Branding", "Vector"],
    dimensions: "1200 x 1200",
    downloadCount: 240
  },
  {
    id: "med-8",
    url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200",
    title: "Sondeka Beats Music Production Session",
    category: "Projects",
    size: "3.5 MB",
    date: "2026-07-02",
    uploaderName: "Mutua Kilonzo",
    description: "Live synthesizer, percussion, and audio mixing session for Sondeka Beats compilation Vol. 2.",
    tags: ["Audio", "Sondeka", "Music"],
    dimensions: "1920 x 1080",
    downloadCount: 53
  },
  {
    id: "med-9",
    url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=1200",
    title: "Queer & Inclusive Anthology Press Release",
    category: "Press Kit",
    size: "2.1 MB",
    date: "2026-07-15",
    uploaderName: "Alex Kamau",
    description: "Promotional press cover for the East African Queer Literature and Poetry anthology publication.",
    tags: ["Press Kit", "Literature", "Inclusion"],
    dimensions: "2000 x 3000",
    downloadCount: 76
  }
];

export const INITIAL_MARKET_ITEMS: MarketItem[] = [
  // Official Baiskeli Shop Collection (Featured Categories from Video)
  {
    id: "mkt-baiskeli-1",
    title: "Digital Art on Canvas",
    creatorName: "Creatives Garage Artists",
    category: "Alternative Art",
    price: 4500,
    stock: 20,
    description: "Vibrant high-definition digital artwork stretched on premium cotton canvas featuring East African contemporary themes.",
    url: Images.frameByFrame,
    type: "Physical",
    salesCount: 18
  },
  {
    id: "mkt-baiskeli-2",
    title: "Illustrated Pop Culture Notebooks",
    creatorName: "Baiskeli Store Collective",
    category: "Literature & Books",
    price: 800,
    stock: 60,
    description: "Spiral and hardbound notebooks adorned with colorful African pop art and custom graphic illustrations.",
    url: Images.realPeople,
    type: "Physical",
    salesCount: 42
  },
  {
    id: "mkt-baiskeli-3",
    title: "ChaiTEA Ceramic Mugs",
    creatorName: "Baiskeli Store",
    category: "Eco Crafts",
    price: 1200,
    stock: 50,
    description: "Premium ceramic coffee & tea mugs featuring quirky Kenyan typography and 'ChaiTEA' signature pop graphics.",
    url: Images.laugh,
    type: "Physical",
    salesCount: 35
  },
  {
    id: "mkt-baiskeli-4",
    title: "10x10 Canvas Art – 'AKI IMAGINE KARIBU KWETU'",
    creatorName: "Creatives Garage Collective",
    category: "Alternative Art",
    price: 2500,
    stock: 15,
    description: "10x10 inch framed canvas art print featuring authentic Sheng Kenyan street phrase typography.",
    url: Images.binti,
    type: "Physical",
    salesCount: 29
  },
  {
    id: "mkt-baiskeli-5",
    title: "Graphic Tote Bags – 'ATI ATI ATI'",
    creatorName: "Baiskeli Store",
    category: "Fashion & Wear",
    price: 1800,
    stock: 40,
    description: "Heavy-duty eco canvas tote bag styled with bold color-block East African pop culture lettering.",
    url: Images.black,
    type: "Physical",
    salesCount: 50
  },
  {
    id: "mkt-baiskeli-6",
    title: "Pop Art Canvas Toiletry Bags",
    creatorName: "Baiskeli Store",
    category: "Fashion & Wear",
    price: 2200,
    stock: 25,
    description: "Durable zippered travel toiletry wash bags with inner waterproof lining and custom graphics.",
    url: Images.mamaMboga,
    type: "Physical",
    salesCount: 16
  },
  {
    id: "mkt-baiskeli-7",
    title: "Illustrated Pencil Pouch",
    creatorName: "Baiskeli Store",
    category: "Eco Crafts",
    price: 1000,
    stock: 30,
    description: "Compact multi-purpose pouch for stationery, brushes, and accessories decorated with bicycle art.",
    url: Images.tana,
    type: "Physical",
    salesCount: 21
  }
];

export const INITIAL_MARKET_SALES: MarketSale[] = [
  {
    id: "sale-1",
    itemId: "mkt-2",
    itemTitle: "The Sondeka Beat Pack Vol. 2",
    buyerName: "Kofi Mensah",
    units: 1,
    totalAmount: 2000,
    date: "2026-07-10",
    payoutStatus: "Paid"
  },
  {
    id: "sale-2",
    itemId: "mkt-1",
    itemTitle: "Hand-Crafted Upcycled Denim Jacket",
    buyerName: "Zahra Hassan",
    units: 1,
    totalAmount: 4500,
    date: "2026-07-12",
    payoutStatus: "Paid"
  },
  {
    id: "sale-3",
    itemId: "mkt-3",
    itemTitle: "Alternative East African Queer Anthologies",
    buyerName: "Sophia Martinez",
    units: 2,
    totalAmount: 3000,
    date: "2026-07-14",
    payoutStatus: "Processing"
  },
  {
    id: "sale-4",
    itemId: "mkt-4",
    itemTitle: "Eco-Coconut Shell Sound Amplifier",
    buyerName: "Elena Rostova",
    units: 1,
    totalAmount: 3200,
    date: "2026-07-15",
    payoutStatus: "Paid"
  }
];

export const INITIAL_PROGRAMMES: Programme[] = [
  {
    id: "prog-ai-tech",
    title: "AI x Tech",
    tagline: "Investigating the impact & ethics of Artificial Intelligence on African creativity, memory, and IP",
    description: "Explores the impact of Artificial Intelligence on the creative industry in Kenya and Africa. Investigating how African creatives perceive, engage with, and challenge technology, AI ethics, cultural memory, intellectual property, and representation.",
    category: "AI & Innovation",
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200",
    pillars: [
      { title: "Research & Impact", desc: "Investigating how AI shapes African creative livelihoods in partnership with Mozilla Foundation." },
      { title: "Ethical AI & IP", desc: "Defending African cultural memory, copyright, and creator attribution in generative model training." },
      { title: "AI Storytelling Labs", desc: "Training storytellers to harness AI tools for visual effects, animation, and hybrid film production." }
    ],
    keyProjects: [
      { title: "AI Impact Investigation", description: "In-depth study on how generative AI models affect young Kenyan artists and cultural workers.", tag: "Research" },
      { title: "AI Storytelling Incubator", description: "Hands-on lab pairing traditional animators with AI workflow tools.", tag: "Incubator" }
    ]
  },
  {
    id: "prog-artivism",
    title: "Artivism",
    tagline: "Multidisciplinary art activism challenging injustice, reclaiming public spaces, and driving civic change",
    description: "Brings together multidisciplinary creatives to develop powerful, localized responses to injustice. Utilizing theatre, dance, poetry, independent publishing, zines, and illustration to challenge narratives and advocate for community justice.",
    category: "Civic & Activism",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1200",
    pillars: [
      { title: "Protest & Visual Design", desc: "Creating bold posters, murals, and digital graphics for frontline community campaigns." },
      { title: "Civic Education & Rights", desc: "Workshops covering constitutional rights, digital safety, and rapid content creation." },
      { title: "Independent Publishing", desc: "Producing resistance zines, underground comics, and protest poetry compilations." }
    ],
    keyProjects: [
      { title: "Reclaim The Streets", description: "Public art installations and performance art advocating for youth human rights.", tag: "Public Art" },
      { title: "Resistance Zines & Comics", description: "Underground graphic publications distributed across community libraries.", tag: "Publication" }
    ]
  },
  {
    id: "prog-lgbtq",
    title: "LGBTQ+ Programme",
    tagline: "Creating safe, affirming, and collaborative spaces for queer creatives across East Africa",
    description: "Dedicated to creating safe and collaborative spaces for queer creatives to express themselves, connect, and challenge oppression through film, theatre, poetry, gaming, XR, and immersive storytelling. We tell bold, human stories, run queer-affirming creative labs, advocate through public art, and provide mental health and expression spaces.",
    category: "Inclusion & Identity",
    badgeColor: "bg-zinc-100 text-zinc-900 border-zinc-300",
    imageUrl: Images.tales,
    externalUrl: "https://creativesgarage.org/lgbtq",
    pillars: [
      { title: "Storytelling for Change", desc: "Telling bold, human stories reflecting East African queer lived experiences through short films and podcast anthologies." },
      { title: "Workshops & Labs", desc: "Queer-affirming labs focusing on scriptwriting, digital art, podcasting, gaming, and performance." },
      { title: "Advocacy Through Art", desc: "Challenging stigma and censorship via public art interventions, experimental formats, and reclaimed visibility." },
      { title: "Mental Health & Safe Spaces", desc: "Collaborative healing spaces, journaling sessions, peer support groups, and art therapy tools." }
    ],
    keyProjects: [
      { title: "Love, Sex and Choices: LGBTQ+ Survival Kit", description: "Clear, affirming information about bodies, choices, and joy serving as an educational resource.", tag: "Interactive Media" },
      { title: "Queer-Tendo", description: "Vibrant side-scrolling adventure game set in a Kenyan-inspired world celebrating queer joy and resistance.", tag: "Gaming & XR" },
      { title: "Stories of Pride", description: "Anthology of anonymous personal narratives and poetry promoting empathy, understanding, and acceptance.", tag: "Anthology" },
      { title: "Blooms in the Dark", description: "Multimedia presentation and visual exhibition defiantly exploring queerness and resilience.", tag: "Exhibition" },
      { title: "Songs to Heal a Broken Heart", description: "Audio-visual initiative celebrating the enduring spirit of love, loss, and renewal.", tag: "Music & Audio" },
      { title: "Saidia", description: "Interactive game and tool helping queer individuals navigate systems and access support in Kenya.", tag: "Community Tool" }
    ]
  },
  {
    id: "prog-women",
    title: "Women Programme",
    tagline: "Dismantling patriarchy through poetry, performance, pixels, paint, and power moves",
    description: "In a world where women are told to shrink, we create spaces for them to expand and champion women as creators, entrepreneurs, storytellers, and disruptors. Centering women's voices, labor, joy, and struggles.",
    category: "Gender Equity",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    imageUrl: Images.africanWom,
    pillars: [
      { title: "Skills & Economic Empowerment", desc: "Training in filmmaking, design, digital art, e-commerce, and creative tech." },
      { title: "Storytelling & Advocacy", desc: "Plays, short films, zines, comics, poetry, and podcasts fighting exploitation." },
      { title: "Wellness & Safe Spaces", desc: "Affirming spaces for mental health check-ins, healing circles, and creative therapy." },
      { title: "Mentorship & Networks", desc: "Connecting emerging women creators with seasoned African cultural leaders." }
    ],
    keyProjects: [
      { title: "A thirst trap for Sextortion", description: "Exposing exploitation and demanding institutional accountability.", imageUrl: Images.black, tag: "Film & Campaign" },
      { title: "Genesis", description: "Poetic reawakening of origin stories rooted in memory, myth, and becoming.", imageUrl: Images.realPeople, tag: "Visual Art" },
      { title: "Femmolution", description: "A powerful rallying call for the advancement and transformation of women.", imageUrl: Images.africanWom, tag: "Residency" },
      { title: "Reserved for Women", description: "Challenging stereotypes and prejudices while promoting gender equality.", imageUrl: Images.tales, tag: "Exhibition" },
      { title: "Mama Mboga", description: "Celebrating everyday heroes at the heart of Kenya's food security.", imageUrl: Images.mamaMboga, tag: "Documentary" },
      { title: "I Speak", description: "Amplifying voices of marginalized women in Tana River through story & strength.", imageUrl: Images.iSpeak, tag: "Community" }
    ]
  },
  {
    id: "prog-market-access",
    title: "Market Access",
    tagline: "Assisting African creatives in selling, showcasing, distributing, and scaling their work globally",
    description: "Creatives Garage's Market Access programme bridges the gap between African creative talent and economic sustainability. We empower storytellers, visual artists, musicians, filmmakers, and craftspeople by providing direct platforms to sell, showcase, distribute, and monetize their works locally and internationally.",
    category: "Commerce & Trade",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    imageUrl: Images.marketAccess,
    pillars: [
      { title: "Media Distribution & Streaming", desc: "Distributing authentic African feature films, documentaries, shorts, and audio stories via Kalabars and Frame by Frame." },
      { title: "Retail & E-Commerce", desc: "Connecting physical pop culture, merchandise, books, and handmade crafts to global buyers through Baiskeli Store." },
      { title: "Audio Production & Licensing", desc: "CG Studios recording facility providing podcasting, film scoring, sound engineering, and music licensing access." },
      { title: "Trade Expositions & Art Shows", desc: "Biannual Sondeka Festival trade fairs, gallery exhibitions, and live pop-up showcases for creators." }
    ],
    keyProjects: [
      { title: "Kalabars", description: "Innovative media & film distribution platform focused on sharing bold, authentic, and diverse African narratives.", imageUrl: "https://images.unsplash.com/photo-1578022761797-b8636ac1773c?auto=format&fit=crop&q=80&w=1200", tag: "Media & Distribution" },
      { title: "Baiskeli Store", description: "Vibrant retail and e-commerce journey through Kenyan pop culture, contemporary fashion, artisan crafts, and books.", imageUrl: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&q=80&w=1200", tag: "Retail & Crafts" },
      { title: "CG Studios", description: "State-of-the-art audio production facility offering mentorship, podcasting, film scores, and music licensing access.", imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1200", tag: "Audio & Music" },
      { title: "Frame by Frame", description: "Global distribution initiative bringing African films, shorts, and documentaries to international film markets.", imageUrl: Images.frameByFrame, tag: "Film Export" },
      { title: "Art Shows", description: "Virtual and physical exhibitions showcasing diverse visual art from emerging and established African creators.", imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1200", tag: "Gallery & Art" },
      { title: "Sondeka Festival & Market Fair", description: "Premier dynamic platform and trade exposition for creative innovation, co-creation, and artisan trade.", imageUrl: Images.sondeka, tag: "Exposition" },
      { title: "Real People Real Stories", description: "Documentary campaign in partnership with Meta highlighting how ordinary Kenyans use creativity to inspire.", imageUrl: Images.realPeople, tag: "Meta Partnership" },
      { title: "Live Events & Popups", description: "Carefully curated live performance events and pop-up artisan markets at The Mall Westlands.", imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200", tag: "Live Showcases" }
    ]
  },
  {
    id: "prog-bamba-kids",
    title: "Bamba Kids",
    tagline: "Immersive African edutainment combining stories, play, and learning for children aged 3 to 10",
    description: "An immersive edutainment program for children aged 3 to 10, combining African stories, play, and learning through a physical kids club, mobile app, website, classes, podcast, animations, and educational games.",
    category: "Youth & Edutainment",
    badgeColor: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1200",
    pillars: [
      { title: "African Storytelling & Animation", desc: "Producing engaging animated shorts featuring relatable African characters." },
      { title: "STEM Mobile App & Games", desc: "Interactive mobile application teaching STEM concepts through fun storytelling." },
      { title: "Bamba Kids Physical Club", desc: "Weekend creative workshops in clay sculpting, storytelling, and music." }
    ],
    keyProjects: [
      { title: "Bamba Kids STEM Mobile App", description: "Interactive app with games, songs, and podcasts rooted in African folklore.", tag: "Mobile App" },
      { title: "Tales of Bamba Animated Shorts", description: "2D animated series broadcasting values of empathy, curiosity, and nature.", tag: "Animation" }
    ]
  },
  {
    id: "prog-frame-by-frame",
    title: "Frame by Frame",
    tagline: "Championing emerging filmmakers, AI cinema, animation, XR & experimental visual narratives",
    description: "Champions emerging filmmakers and visual artists who experiment with new forms of storytelling, including AI-powered cinema, hybrid documentaries, animation, XR, and experimental visual narratives.",
    category: "Cinema & New Media",
    badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    imageUrl: Images.frameByFrame,
    pillars: [
      { title: "Frame by Frame Festival", desc: "Bi-annual independent film festival in Nairobi celebrating African short films & media." },
      { title: "Experimental Film Labs", desc: "Nurturing directors pushing boundaries in XR, hybrid documentary, and digital art." },
      { title: "Screenings & Distribution", desc: "Regular community screenings followed by director Q&A sessions and panel debates." }
    ],
    keyProjects: [
      { title: "Frame by Frame Film Festival", description: "Independent festival showcasing groundbreaking East African filmmakers.", imageUrl: Images.frameByFrame, tag: "Film Festival" },
      { title: "Kuyo Feature Film", description: "Award-winning independent short film screened across continental festivals.", tag: "Cinema" }
    ]
  },
  {
    id: "prog-masterclasses",
    title: "Masterclasses",
    tagline: "Hands-on masterclasses in creative entrepreneurship, digital arts, IP & traditional music",
    description: "Offers specialized masterclasses covering artist entrepreneurship, digital storytelling, AI creative writing, intellectual property, traditional African instruments, and film directing.",
    category: "Education & Skills",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200",
    pillars: [
      { title: "Artist Entrepreneurship", desc: "Business models, pricing, pitch decks, and financial management for creatives." },
      { title: "Technical & Craft Mastery", desc: "In-depth workshops on traditional instruments, sound design, and film directing." },
      { title: "Legal & IP Navigation", desc: "Protecting creative rights, copyright contracts, and fair compensation." }
    ],
    keyProjects: [
      { title: "Artist Entrepreneurship Masterclass", description: "Led by industry leaders focusing on people, processes, and monetization in art.", tag: "Masterclass" },
      { title: "Traditional Heritage Music Series", description: "Hands-on instruction in playing Nyatiti, Kalimba, and traditional percussion.", tag: "Heritage" }
    ]
  },
  {
    id: "prog-collection-of-thoughts",
    title: "Collection of Thoughts",
    tagline: "Anthologies, mixed-media installations, and publications addressing mental health, identity, and social commentary",
    description: "Creatives Garage's 'Collection of Thoughts' is a signature publishing and multimedia initiative that tackles complex cultural, psychological, and social themes. Through digital anthologies, mixed-media art installations, poetry, and postcards, it explores mental wellness, rejection resilience, LGBTQA+ pride, women's liberation, and African storytelling.",
    category: "Publishing & Social Commentary",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    imageUrl: Images.collectionOfThoughts,
    pillars: [
      { title: "Mental Wellness & Healing", desc: "Destigmatizing mental health struggles like anxiety and burnout through digital anthologies like Mental Notes with Sisi Wellness." },
      { title: "Rejection & Resilience in Arts", desc: "Transforming professional artist rejection into narrative installations and creative resilience." },
      { title: "LGBTQA+ Narratives & Pride", desc: "Amplifying queer voices, ballroom culture, and personal memoirs fostering empathy across society." },
      { title: "Women's Journeys & Reclaiming Voices", desc: "Poetic anthologies, spoken word, and leadership initiatives reclaiming silenced African heritage." }
    ],
    keyProjects: [
      { title: "Mental Notes", description: "Digital anthology created in collaboration with Sisi Wellness focusing on personal journeys through anxiety, depression, and burnout.", imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1200", tag: "Mental Wellness" },
      { title: "Copy Paste – Anatomy of a Regret Letter", description: "Mixed-media installation by Thayù exploring the psychological impact of rejection on artists and transforming regret into resilience.", imageUrl: "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=1200", tag: "Mixed-Media" },
      { title: "Stories of Pride", description: "Anthology of personal narratives from queer individuals in Kenya, aiming to foster empathy and dignity within society.", imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1200", tag: "Anthology" },
      { title: "Category Is...", description: "Series of postcards celebrating the Kenyan LGBTQA+ community, drawing inspiration from ballroom culture and voguing.", imageUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=1200", tag: "Postcard Series" },
      { title: "Reclaiming Silenced Voices", description: "Poetic anthology and spoken word series empowering silenced voices and celebrating women's political leadership.", imageUrl: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=1200", tag: "Spoken Word" },
      { title: "Real People Real Stories", description: "Short documentary series in partnership with Meta highlighting how ordinary Kenyans use creativity to inspire communities.", imageUrl: Images.realPeople, tag: "Documentary" }
    ]
  },
  {
    id: "prog-co-lab",
    title: "Co-Lab X",
    tagline: "Collaborative multi-disciplinary initiatives producing bold, boundary-pushing African creative works",
    description: "Co-Lab X is a flagship initiative where Creatives Garage collaborates with a diverse range of creators—writers, illustrators, filmmakers, designers, game developers, musicians, and digital artists—to produce impactful, radical, and socially conscious storytelling across books, films, games, installations, and digital experiences.",
    category: "Multi-Disciplinary Innovation",
    badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    imageUrl: Images.frameByFrame,
    externalUrl: "https://creativesgarage.org/co-lab",
    pillars: [
      { title: "Multi-Disciplinary Co-Creation", desc: "Fostering cross-genre partnerships between writers, visual artists, game developers, and sound designers." },
      { title: "Experimental Media & Games", desc: "Producing computer video games, photo-comics, art installations, and VR/XR dreamscapes." },
      { title: "Bold & Unheard Narratives", desc: "Tackling social justice, mental health, civic rights, and cultural heritage through radical African storytelling." }
    ],
    keyProjects: [
      { title: "Ole Sondeka vs Bwana Stache", description: "An adventurous computer game blending East African folklore, satire, and interactive video game mechanics.", imageUrl: Images.sondeka, tag: "Video Game" },
      { title: "Shall We Go?", description: "A poignant short film exploring mental health, emotional vulnerability, and healing among African youth.", imageUrl: Images.realPeople, tag: "Short Film" },
      { title: "MASKAN", description: "An evocative art installation and memorial addressing femicide and gender-based violence in Kenya.", imageUrl: Images.black, tag: "Art Installation" },
      { title: "Frame by Frame", description: "Pan-African short film showcase, animation lab, and director development laboratory.", imageUrl: Images.frameByFrame, tag: "Film & Visual" },
      { title: "Shoejaa", description: "An experimental research and craft initiative studying sustainable leather value chains in Kenya.", imageUrl: Images.mamaMboga, tag: "Research & Craft" },
      { title: "Nairobi By-Laws", description: "A striking visual and graphic presentation decoding minor road offenses and civic rights.", imageUrl: Images.tales, tag: "Civic Graphic" },
      { title: "Ditoro", description: "An immersive visual dreamscape exploring memory, myth, ancestry, and longing.", imageUrl: Images.realPeople, tag: "Visual Art" },
      { title: "Not All Birds", description: "A poetic anthology exploring resilience, flight, freedom, and African identity.", imageUrl: Images.tana, tag: "Poetry Anthology" },
      { title: "Bamba Kids", description: "An immersive edutainment experience combining storytelling, games, and learning for children.", imageUrl: Images.binti, tag: "Edutainment" },
      { title: "Mental Notes", description: "A digital anthology and wellness project destigmatizing mental health in creative communities.", imageUrl: Images.iSpeak, tag: "Mental Wellness" }
    ]
  }
];

export const INITIAL_MASTERCLASSES: Masterclass[] = [
  {
    id: "mc-1",
    title: "AI x Podcasting Masterclass",
    category: "AI & Innovation",
    tagline: "Supercharging African audio creators with AI scriptwriting, noise restoration, and automated RSS workflows",
    description: "A hands-on masterclass exploring how artificial intelligence tools (Descript, Adobe Podcast, ChatGPT, ElevenLabs) can streamline podcast research, script polishing, audio restoration, dynamic transcription, and cross-platform marketing.",
    facilitatorName: "Mutua Kilonzo",
    facilitatorBio: "Lead Audio Engineer & AI Researcher at Creatives Garage, with over 10 years experience producing award-winning East African podcasts.",
    facilitatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    date: "2026-03-05",
    time: "10:00 AM - 1:00 PM EAT",
    duration: "3 Hours",
    location: "Creatives Garage Hub, The Mall Westlands / Zoom Stream",
    price: "KES 1,500",
    isPaid: true,
    enrolledCount: 38,
    capacity: 50,
    level: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=1200",
    learningOutcomes: [
      "Master AI voice cleaning, background noise removal & studio voicing tools",
      "Build automated episode transcriptions and SEO-friendly show notes",
      "Distribution & monetization strategies for Spotify for Podcasters and Apple Podcasts"
    ],
    prerequisites: "Basic podcasting concept or working audio recorder / laptop.",
    status: "Enrolling",
    externalUrl: "https://creativesgarage.org/masterclasses"
  },
  {
    id: "mc-2",
    title: "Digital Storytelling & Transmedia Narratives",
    category: "Digital Arts & Media",
    tagline: "Crafting multi-platform stories across interactive web, audio, comics, and video",
    description: "Learn how to build multidimensional story worlds that expand across social media, podcasting, graphic novels, and live performance. Discover how Creatives Garage constructs transmedia impact campaigns for African narratives.",
    facilitatorName: "Liz Kilili",
    facilitatorBio: "Founder & Managing Trustee at Creatives Garage, cultural disruptor, and executive producer of transmedia African projects.",
    facilitatorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
    date: "2026-03-18",
    time: "2:00 PM - 5:00 PM EAT",
    duration: "3 Hours",
    location: "Creatives Garage Hub, The Mall Westlands",
    price: "Free (RSVP Required)",
    isPaid: false,
    enrolledCount: 45,
    capacity: 60,
    level: "All Levels",
    imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1200",
    learningOutcomes: [
      "Structure non-linear transmedia story arcs for African audiences",
      "Integrate interactive web elements, Meta AR filters, and graphic zines",
      "Audience retention metrics and digital distribution channel setup"
    ],
    prerequisites: "Open to storytellers, writers, filmmakers, and digital artists.",
    status: "Enrolling",
    externalUrl: "https://creativesgarage.org/masterclasses"
  },
  {
    id: "mc-3",
    title: "AI & Creative Writing: Storytelling in the Machine Age",
    category: "AI & Innovation",
    tagline: "Leveraging generative LLMs for worldbuilding, character depth, and plot outlining without losing authentic voice",
    description: "Demystifying AI in literature. This masterclass dives into using artificial intelligence as a collaborative co-writer for speculative fiction, poetry, screenplay outlines, and character bible generation while protecting indigenous narratives.",
    facilitatorName: "Zahra Hassan",
    facilitatorBio: "Speculative fiction author, editor of Queer African Anthologies, and digital humanities advocate.",
    facilitatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    date: "2026-04-02",
    time: "11:00 AM - 2:00 PM EAT",
    duration: "3 Hours",
    location: "Online Interactive Zoom Workshop",
    price: "KES 2,000",
    isPaid: true,
    enrolledCount: 29,
    capacity: 40,
    level: "Beginner",
    imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1200",
    learningOutcomes: [
      "Ethical AI prompt engineering for fiction and non-fiction writers",
      "Deep worldbuilding using custom mythologies and character bibles",
      "Navigating copyright, originality, and attribution when using AI writing tools"
    ],
    prerequisites: "Laptop with internet connection.",
    status: "Upcoming",
    externalUrl: "https://creativesgarage.org/masterclasses"
  },
  {
    id: "mc-4",
    title: "Intellectual Property, Copyright & Rights for Artists",
    category: "Legal & Business",
    tagline: "Monetizing art rights, licensing contracts, royalty collection, and legal protection in East Africa",
    description: "An essential legal survival guide for African artists. Gain practical clarity on copyright registration, Collective Management Organizations (KECOBO, MCSK, KAMP, PRISK), contract negotiation, sync licensing, and preventing creative theft.",
    facilitatorName: "Advocate Achieng' Odera",
    facilitatorBio: "Intellectual Property Attorney specializing in creative sector contracts, IP litigation, and artist advocacy.",
    facilitatorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300",
    date: "2026-04-15",
    time: "2:00 PM - 5:00 PM EAT",
    duration: "3 Hours",
    location: "Creatives Garage Boardroom, Westlands",
    price: "KES 1,000",
    isPaid: true,
    enrolledCount: 52,
    capacity: 60,
    level: "All Levels",
    imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=1200",
    learningOutcomes: [
      "Understanding KECOBO registration, CMOs, and royalty tracking",
      "Drafting robust sync licensing agreements & non-disclosure contracts",
      "Protecting digital artwork and writing against unauthorized AI scraping"
    ],
    prerequisites: "None. Essential for all active creative practitioners.",
    status: "Enrolling",
    externalUrl: "https://creativesgarage.org/masterclasses"
  },
  {
    id: "mc-5",
    title: "Film Directing & Visual Grammar: From Script to Screen",
    category: "Film & Cinema",
    tagline: "Shot list design, actor blocking, camera choreography, and visual pacing for independent directors",
    description: "Step into the director's chair. This intensive masterclass breaks down how to translate screenplay emotions into camera angles, lighting moods, actor performance notes, and seamless post-production editing cuts.",
    facilitatorName: "Kofi Mensah",
    facilitatorBio: "Pan-African filmmaker, director of Frame by Frame award-winning short films, and cinema lecturer.",
    facilitatorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
    date: "2026-05-08",
    time: "9:00 AM - 4:00 PM EAT",
    duration: "7 Hours (Full Day)",
    location: "Creatives Garage Main Studio, Westlands",
    price: "KES 3,500",
    isPaid: true,
    enrolledCount: 22,
    capacity: 30,
    level: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1200",
    learningOutcomes: [
      "Translating emotional script beats into visual director's treatments",
      "Effective communication with Cinematographers and Actors on set",
      "Budgeting & execution strategies for low-budget African indie feature films"
    ],
    prerequisites: "Prior experience or interest in filmmaking, writing, or theater.",
    status: "Upcoming",
    externalUrl: "https://creativesgarage.org/masterclasses"
  },
  {
    id: "mc-6",
    title: "Podcasting Production, Acoustics & Monetization",
    category: "Audio & Music",
    tagline: "Setting up a broadcast-grade studio, mic technique, host chemistry, and sponsor pitch decks",
    description: "Master the technical and commercial mechanics of podcasting. Learn microphone selection, acoustic room treatment, vocal editing in Logic Pro / Audacity, host dynamics, and monetizing through corporate sponsorships.",
    facilitatorName: "Alex Kamau",
    facilitatorBio: "Senior Audio Producer & Sound Designer behind top-charting Kenyan narrative podcasts.",
    facilitatorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300",
    date: "2026-05-22",
    time: "10:00 AM - 1:00 PM EAT",
    duration: "3 Hours",
    location: "Creatives Garage Podcast Studio, Westlands",
    price: "KES 1,500",
    isPaid: true,
    enrolledCount: 19,
    capacity: 25,
    level: "Beginner",
    imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=1200",
    learningOutcomes: [
      "Acoustic treatment hacks for small rooms & vocal mic placement",
      "Editing multi-track conversations in DAW (Logic / Audacity / Reaper)",
      "Building pitch decks for corporate sponsors & listener Patreon models"
    ],
    prerequisites: "None.",
    status: "Upcoming",
    externalUrl: "https://creativesgarage.org/masterclasses"
  },
  {
    id: "mc-7",
    title: "Marketing & Branding a Music Act or Band",
    category: "Music & Business",
    tagline: "Building an irresistible brand identity, Electronic Press Kits (EPK), Spotify playlist pitching, and gig booking",
    description: "Transform your musical talent into a thriving sustainable career. Learn how independent East African musicians build cohesive visual aesthetics, assemble EPKs, land editorial playlist placement, and negotiate live show performance fees.",
    facilitatorName: "Sande Nduku",
    facilitatorBio: "Music Manager, PR Strategist, and founder of Sondeka Beats artist accelerator.",
    facilitatorAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300",
    date: "2026-06-10",
    time: "2:00 PM - 5:00 PM EAT",
    duration: "3 Hours",
    location: "Creatives Garage Lounge & Live Stream",
    price: "KES 2,000",
    isPaid: true,
    enrolledCount: 31,
    capacity: 40,
    level: "All Levels",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200",
    learningOutcomes: [
      "Designing high-converting Electronic Press Kits (EPKs) for festival programmers",
      "Pitching directly to Spotify, Apple Music, and Boomplay editorial playlist curators",
      "Live show booking, performance riders, and financial split agreements"
    ],
    prerequisites: "Active solo musical artists, band members, or talent managers.",
    status: "Upcoming",
    externalUrl: "https://creativesgarage.org/masterclasses"
  },
  {
    id: "mc-8",
    title: "Traditional African Drums & Percussive Heritage",
    category: "Heritage & Music",
    tagline: "Mastering Nyatiti rhythms, Ohangla drums, Djembe polyrhythms, and stage performance dynamics",
    description: "A transformative hands-on workshop celebrating traditional percussive heritage. Practice polyrhythms, drum tuning, traditional vocal chants, and blending indigenous rhythms with modern Afrobeat and electronic productions.",
    facilitatorName: "Mzee Omondi",
    facilitatorBio: "Master Cultural Drummer, Nyatiti virtuoso, and heritage sound archivist with 35+ years of stage experience.",
    facilitatorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300",
    date: "2026-06-25",
    time: "10:00 AM - 2:00 PM EAT",
    duration: "4 Hours",
    location: "Creatives Garage Open Courtyard Stage",
    price: "KES 1,000",
    isPaid: true,
    enrolledCount: 16,
    capacity: 25,
    level: "Beginner",
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200",
    learningOutcomes: [
      "Traditional rhythm patterns across Luo, Mijikenda & West African drumming traditions",
      "Tuning, skin care, and maintaining authentic wooden percussion instruments",
      "Fusing heritage percussive grooves into contemporary electronic and Afro-pop tracks"
    ],
    prerequisites: "Drums provided on site. Open to all music lovers.",
    status: "Upcoming",
    externalUrl: "https://creativesgarage.org/masterclasses"
  },
  {
    id: "mc-9",
    title: "Voice Acting, Characterisation & Mic Technique",
    category: "Performance",
    tagline: "Vocal control, accent work, animation dubbing, and commercial voiceover auditions",
    description: "Unlock your voice for animation, audiobooks, video games, radio commercials, and documentary narration. Learn breathing techniques, microphone proximity control, accent adaptation, and audition recording.",
    facilitatorName: "Wanjiku Muriithi",
    facilitatorBio: "Voice Artist, Commercial Talent, and Bamba Kids Animation Voice Director.",
    facilitatorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300",
    date: "2026-07-12",
    time: "1:00 PM - 4:00 PM EAT",
    duration: "3 Hours",
    location: "Creatives Garage Sound Booth",
    price: "KES 2,500",
    isPaid: true,
    enrolledCount: 14,
    capacity: 20,
    level: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=1200",
    learningOutcomes: [
      "Creating distinct character voices for animation & video games",
      "Microphone proximity effect and breath control in recording sessions",
      "Constructing a professional 60-second commercial voice demo reel"
    ],
    prerequisites: "Comfortable speaking and performing in English and/or Swahili.",
    status: "Upcoming",
    externalUrl: "https://creativesgarage.org/masterclasses"
  },
  {
    id: "mc-10",
    title: "Visual Storytelling & Documentary Photography",
    category: "Visual Arts",
    tagline: "Composition, lighting in raw environmental conditions, ethics of consent, and photo essay editing",
    description: "Master the art of documentary photography. Learn how to tell compelling stories through static imagery, work respectfully with vulnerable communities, manage natural lighting, and curate photo essays for galleries and international media.",
    facilitatorName: "David Njeri",
    facilitatorBio: "Documentary Photographer whose work has been published across international photojournalism outlets.",
    facilitatorAvatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=300",
    date: "2026-07-28",
    time: "9:00 AM - 1:00 PM EAT",
    duration: "4 Hours",
    location: "Creatives Garage Hub & Field Location",
    price: "KES 2,000",
    isPaid: true,
    enrolledCount: 20,
    capacity: 25,
    level: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&q=80&w=1200",
    learningOutcomes: [
      "Capturing candid human emotion without intrusive staging",
      "Ethical frameworks & informed consent in African documentary photography",
      "Color grading raw files in Adobe Lightroom for print exhibition"
    ],
    prerequisites: "Bring a DSLR, mirrorless camera, or high-end camera phone.",
    status: "Upcoming",
    externalUrl: "https://creativesgarage.org/masterclasses"
  }
];


