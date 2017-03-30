// table icon names
export const tableIconNames = [
    'accessibility',
    'Accreditations',
    'activity',
    'Aid',
    'ambulance',
    'Apple',
    'arrowdown',
    'arrowleft',
    'arrowright',
    'arrowup',
    'balloons',
    'bananas',
    'Beverage',
    'binoculars',
    'blood',
    'boy',
    'bus',
    'camera',
    'cap',
    'carfront',
    'car_side',
    'Carrot',
    'cat',
    'chart',
    'checkmarkblack',
    'checkmarkknockout',
    'Cheese',
    'Chicken',
    'Coffee_cup',
    'customers',
    'Cutlery',
    'deliverytruck2',
    'deliverytruck',
    'desktopmonitor',
    'dog',
    'drugs',
    'estimates',
    'Exclamation',
    'exercise',
    'female',
    'Fish',
    'girl',
    'heart',
    'hospital',
    'house',
    'invoices',
    'iPad',
    'laptop',
    'lineitems',
    'login',
    'mailbox',
    'male',
    'medicine2',
    'medicine',
    'monitor',
    'newbadge',
    'person',
    'plus',
    'printer',
    'products',
    'projects',
    'purse',
    'questionmark',
    'reports',
    'ruler',
    'Sandals',
    'schedule',
    'signs',
    'snowflake',
    'student',
    'Stuffedanimal',
    'talk',
    'tasks',
    'taxi',
    'teammembers',
    'templatedprojects',
    'testtube',
    'tooth',
    'towtruck',
    'trash',
    'vendors',
    'Whiteboard',
    'x',
    'sign',
    'backpack',
    'barbell',
    'bell',
    'bicycle',
    'Cellphone',
    'Cloud',
    'command',
    'cube',
    'cupcake',
    'diamond',
    'document',
    'dots',
    'Download',
    'ducky',
    'envelope',
    'eyeball',
    'Female',
    'Female2',
    'film',
    'fire',
    'firstaid',
    'flag',
    'Growth',
    'kettlebell',
    'lift',
    'lightbulb',
    'Lock',
    'moneyperson',
    'pages',
    'paperclip',
    'phone',
    'Piggy',
    'Presentation',
    'pricetag',
    'Question',
    'quote',
    'Report',
    'Report2',
    'Risk',
    'rooster',
    'Router',
    'Row_Zoom',
    'Salary',
    'Salesman',
    'Satellite_Dish',
    'Schedule',
    'School_Bell',
    'School',
    'Semi_Trailer_Truck',
    'Send_Package',
    'Ship',
    'Shopping_Cart',
    'bag',
    'Sku',
    'SMS',
    'Smudge',
    'Social_Studies',
    'Sole_Proprietorship_Pencil',
    'Sole_Proprietorship',
    'speedometer',
    'Spreadsheet',
    'Stamp',
    'Star',
    'Stats_Bar_Chart_Star',
    'Stats_Pie_Chart',
    'Stock_Market',
    'Store',
    'girl',
    'Summary_Arrow_Right',
    'Summary_Zoom',
    'Swimming',
    'Table_Footer_Gear',
    'Table_Header2',
    'complete',
    'Task',
    'Tax',
    'team',
    'Technical_Hammer',
    'Technical_Screwdriver',
    'Technical_Wrench',
    'thumbtack',
    'Timer',
    'Treasure_Chest',
    'Trojan',
    'Trophy',
    'Truck',
    'trumpet',
    'umbrella',
    'University',
    'Upload',
    'Upload2',
    'User',
    'video',
    'Videocamera',
    'Warehouse',
    'Whistle',
    'White_List',
    'Wire_Transfer',
    'Achievement',
    'Acquisition_Clock',
    'Administrator',
    'Advertising',
    'Animation',
    'Anonymous',
    'Architecture',
    'Attendance_List',
    'Audio_Knob',
    'Bank_Transaction',
    'Blackboard',
    'Bomb',
    'Book',
    'Bookmark',
    'Bread',
    'Briefcase',
    'Bug',
    'Building',
    'Calculator',
    'Calendar_Month',
    'Calendar_Year',
    'Calendar',
    'Campus',
    'Certificate',
    'Champagne',
    'Chat_Exclamation',
    'Check2',
    'Classroom',
    'Clipboard_Pencil',
    'Clipboard',
    'Clock',
    'College',
    'Color',
    'Company',
    'Competitors',
    'Contact',
    'Contract',
    'Copy',
    'Copy2',
    'Currency_Sign_Dollar2',
    'Curriculum',
    'Customer',
    'Defective_Product',
    'Dimensions',
    'Directive_Board',
    'Dispatch_Order',
    'Door',
    'Economics',
    'Edit',
    'Engineering',
    'Essay',
    'Etiquette',
    'Field_Image',
    'File2',
    'Focus_Group',
    'Folder',
    'Foreign_Language',
    'Fountain_Pen',
    'Frames2',
    'Front_Desk',
    'Geography',
    'Graduate',
    'Group',
    'Hand_Handshake',
    'Hand_Point',
    'up',
    'Hourglass',
    'ID',
    'Inventory_Category2',
    'Inventory',
    'Invoice',
    'ISP',
    'Justice',
    'Key',
    'Laws',
    'List',
    'Location',
    'Marker',
    'Market_Segmentation',
    'Meeting',
    'Meeting3',
    'Money_Bag_Dollar',
    'Network_Monitor',
    'Nurse',
    'Objects',
    'Offer',
    'OSI_Model',
    'OSI_Model2',
    'Paste2',
    'Personal_Record',
    'Phone_Book',
    'Physics_Pendulum',
    'Ping',
    'Plane',
    'Poetry',
    'Product',
    'Protocol2',
    'Purchase',
    'Quality',
    'Refresh',

];

// popular icon names to suggest to the user initially
export const suggestedTableIcons = [
    'tasks', 'Clock', 'customers', 'invoices', 'projects', 'team', 'mailbox', 'paperclip'
];

// map icon names to icon font class names (for now, just add a prefix)
export const tableIconClasses = tableIconNames.map((name) => {
    return {iconName: name, iconClassName: 'iconTableSturdy-' + name};
});

// map multiple icons to a tag name for searching (will need to be localized)
export const tableIconsByTag = [
    {
        "tag": "1099",
        "icons": [
            "Briefcase"
        ]
    },
    {
        "tag": "Access cards",
        "icons": [
            "ID"
        ]
    },
    {
        "tag": "Accounts",
        "icons": [
            "Etiquette",
            "Focus_Group",
            "Folder",
            "Frames2",
            "Hand_Handshake",
            "Invoice",
            "List",
            "Money_Bag_Dollar",
            "Salesman"
        ]
    },
    {
        "tag": "Accounts Payable",
        "icons": [
            "Bank_Transaction"
        ]
    },
    {
        "tag": "Accounts Receivable",
        "icons": [
            "Router"
        ]
    },
    {
        "tag": "Accreditations",
        "icons": [
            "Accreditations"
        ]
    },
    {
        "tag": "Action Item",
        "icons": [
            "Clock",
            "task-complete",
            "thumbtack"
        ]
    },
    {
        "tag": "Action Items",
        "icons": [
            "Advertising",
            "Bomb",
            "flag",
            "Front_Desk",
            "Hand_Point",
            "Hourglass",
            "Offer",
            "Quality",
            "Task",
            "Timer",
            "Whistle"
        ]
    },
    {
        "tag": "Actions",
        "icons": [
            "fire",
            "flag",
            "Offer"
        ]
    },
    {
        "tag": "Activities",
        "icons": [
            "activity",
            "Stock_Market",
            "Task"
        ]
    },
    {
        "tag": "Activity",
        "icons": [
            "activity",
            "Stock_Market",
            "Task",
            "thumbtack"
        ]
    },
    {
        "tag": "Address",
        "icons": [
            "Contact",
            "Door",
            "envelope"
        ]
    },
    {
        "tag": "Addresses",
        "icons": [
            "Contact",
            "envelope",
            "Location"
        ]
    },
    {
        "tag": "Adjustments",
        "icons": [
            "Competitors",
            "Technical_Wrench"
        ]
    },
    {
        "tag": "Admission",
        "icons": [
            "Check2"
        ]
    },
    {
        "tag": "Advertisers",
        "icons": [
            "Advertising",
            "flag",
            "Offer",
            "Star"
        ]
    },
    {
        "tag": "Agenda",
        "icons": [
            "activity",
            "Attendance_List",
            "Bookmark",
            "Calendar",
            "Calendar_Month",
            "Calendar_Year",
            "Report",
            "Report2",
            "Schedule",
            "Spreadsheet"
        ]
    },
    {
        "tag": "Agenda Items",
        "icons": [
            "activity",
            "Task"
        ]
    },
    {
        "tag": "Agendas",
        "icons": [
            "Meeting",
            "tasks"
        ]
    },
    {
        "tag": "Agents",
        "icons": [
            "Administrator",
            "customers",
            "Female",
            "Female2",
            "Salesman",
            "teammembers",
            "vendors"
        ]
    },
    {
        "tag": "Agreements",
        "icons": [
            "Hand_Handshake",
            "Hand_Thumbs-up"
        ]
    },
    {
        "tag": "Aircraft",
        "icons": [
            "Plane"
        ]
    },
    {
        "tag": "Airplane",
        "icons": [
            "Plane"
        ]
    },
    {
        "tag": "Alarms",
        "icons": [
            "Risk",
            "rooster",
            "trumpet",
            "Whistle"
        ]
    },
    {
        "tag": "Alerts",
        "icons": [
            "bell",
            "Competitors",
            "fire",
            "flag",
            "Risk",
            "rooster",
            "trumpet",
            "Whistle"
        ]
    },
    {
        "tag": "Alien",
        "icons": [
            "Bug"
        ]
    },
    {
        "tag": "Amphitheater",
        "icons": [
            "Color"
        ]
    },
    {
        "tag": "Announcements",
        "icons": [
            "Advertising",
            "rooster",
            "trumpet",
            "Whistle"
        ]
    },
    {
        "tag": "Answers",
        "icons": [
            "Foreign_Language"
        ]
    },
    {
        "tag": "Applicants",
        "icons": [
            "Administrator"
        ]
    },
    {
        "tag": "Applications",
        "icons": [
            "Edit",
            "List",
            "pages"
        ]
    },
    {
        "tag": "Appointments",
        "icons": [
            "Calendar",
            "Calendar",
            "Calendar_Month",
            "Calendar_Year",
            "Calendar_Year",
            "Schedule",
            "Schedule",
            "Timer"
        ]
    },
    {
        "tag": "Approvals",
        "icons": [
            "Hand_Thumbs-up",
            "Stamp",
            "Task",
            "White_List"
        ]
    },
    {
        "tag": "Archives",
        "icons": [
            "Frames2"
        ]
    },
    {
        "tag": "Areas",
        "icons": [
            "Geography"
        ]
    },
    {
        "tag": "Arena",
        "icons": [
            "Campus"
        ]
    },
    {
        "tag": "Arrow",
        "icons": [
            "Wire_Transfer"
        ]
    },
    {
        "tag": "Arrows",
        "icons": [
            "reports",
            "Router",
            "Upload",
            "Upload2"
        ]
    },
    {
        "tag": "Articles",
        "icons": [
            "Bookmark",
            "OSI_Model",
            "Report",
            "Report2"
        ]
    },
    {
        "tag": "Assessments",
        "icons": [
            "Economics",
            "quote"
        ]
    },
    {
        "tag": "Assets",
        "icons": [
            "Bank_Transaction",
            "Currency_Sign_Dollar2",
            "Economics",
            "Money_Bag_Dollar",
            "moneyperson",
            "Plane"
        ]
    },
    {
        "tag": "Assignments",
        "icons": [
            "Dispatch_Order",
            "quote",
            "Task",
            "tasks",
            "templatedprojects"
        ]
    },
    {
        "tag": "Assistence",
        "icons": [
            "Question"
        ]
    },
    {
        "tag": "Associates",
        "icons": [
            "Administrator",
            "customers",
            "Directive_Board",
            "Female",
            "Female2",
            "Group",
            "Salesman",
            "team",
            "teammembers",
            "User"
        ]
    },
    {
        "tag": "At sign",
        "icons": [
            "at-sign"
        ]
    },
    {
        "tag": "Athletics",
        "icons": [
            "Achievement",
            "barbell",
            "bicycle",
            "lift"
        ]
    },
    {
        "tag": "Attachments",
        "icons": [
            "Bookmark",
            "paperclip"
        ]
    },
    {
        "tag": "Attendance",
        "icons": [
            "Etiquette",
            "Group"
        ]
    },
    {
        "tag": "Attendees",
        "icons": [
            "Directive_Board"
        ]
    },
    {
        "tag": "Attention",
        "icons": [
            "bell",
            "School_Bell"
        ]
    },
    {
        "tag": "Attorney",
        "icons": [
            "Hand_Handshake"
        ]
    },
    {
        "tag": "Auctions",
        "icons": [
            "Laws"
        ]
    },
    {
        "tag": "Audits",
        "icons": [
            "Calculator",
            "Paste2",
            "Task"
        ]
    },
    {
        "tag": "Awards",
        "icons": [
            "Accreditations",
            "Certificate",
            "Star",
            "Trophy"
        ]
    },
    {
        "tag": "Backpack",
        "icons": [
            "backpack"
        ]
    },
    {
        "tag": "Badges",
        "icons": [
            "Accreditations",
            "ID"
        ]
    },
    {
        "tag": "Bakery",
        "icons": [
            "cupcake"
        ]
    },
    {
        "tag": "Banks",
        "icons": [
            "Building",
            "Campus",
            "Currency_Sign_Dollar2",
            "Money_Bag_Dollar",
            "Store"
        ]
    },
    {
        "tag": "Barbells",
        "icons": [
            "barbell"
        ]
    },
    {
        "tag": "Bell",
        "icons": [
            "bell",
            "Front_Desk",
            "School_Bell"
        ]
    },
    {
        "tag": "Bicycle",
        "icons": [
            "bicycle"
        ]
    },
    {
        "tag": "Bids",
        "icons": [
            "Laws"
        ]
    },
    {
        "tag": "Billable Hours",
        "icons": [
            "invoices",
            "lineitems",
            "Timer"
        ]
    },
    {
        "tag": "Bills",
        "icons": [
            "Invoice",
            "Salary",
            "Tax"
        ]
    },
    {
        "tag": "Bird",
        "icons": [
            "rooster"
        ]
    },
    {
        "tag": "Blackboard",
        "icons": [
            "Blackboard"
        ]
    },
    {
        "tag": "Blog entry",
        "icons": [
            "Essay"
        ]
    },
    {
        "tag": "Blueprints",
        "icons": [
            "Field_Image"
        ]
    },
    {
        "tag": "Boat",
        "icons": [
            "Ship"
        ]
    },
    {
        "tag": "Bomb",
        "icons": [
            "Bomb"
        ]
    },
    {
        "tag": "Bonuses",
        "icons": [
            "Wire_Transfer"
        ]
    },
    {
        "tag": "Bookmarks",
        "icons": [
            "Bookmark"
        ]
    },
    {
        "tag": "Books",
        "icons": [
            "Book",
            "Phone_Book"
        ]
    },
    {
        "tag": "Boutique",
        "icons": [
            "College"
        ]
    },
    {
        "tag": "Bread",
        "icons": [
            "Bread"
        ]
    },
    {
        "tag": "Briefcase",
        "icons": [
            "Briefcase"
        ]
    },
    {
        "tag": "Broadcast",
        "icons": [
            "Advertising"
        ]
    },
    {
        "tag": "Budgets",
        "icons": [
            "Bank_Transaction",
            "Calculator",
            "Currency_Sign_Dollar2",
            "Invoice"
        ]
    },
    {
        "tag": "Bugs",
        "icons": [
            "Bug",
            "Defective_Product",
            "Risk"
        ]
    },
    {
        "tag": "Buildings",
        "icons": [
            "Building",
            "Store",
            "University"
        ]
    },
    {
        "tag": "Bullhorn",
        "icons": [
            "Advertising"
        ]
    },
    {
        "tag": "Business",
        "icons": [
            "Company",
            "reports",
            "vendors"
        ]
    },
    {
        "tag": "Buyers",
        "icons": [
            "Customer",
            "Smudge"
        ]
    },
    {
        "tag": "calculations",
        "icons": [
            "estimates"
        ]
    },
    {
        "tag": "Calculator",
        "icons": [
            "Calculator"
        ]
    },
    {
        "tag": "Calendar",
        "icons": [
            "Calendar",
            "Calendar_Month",
            "Calendar_Year",
            "Schedule",
            "schedule",
            "Table_Footer_Gear",
            "Table_Header2"
        ]
    },
    {
        "tag": "Call logs",
        "icons": [
            "Cellphone",
            "phone",
            "SMS"
        ]
    },
    {
        "tag": "Calls",
        "icons": [
            "Cellphone",
            "Contact",
            "phone",
            "Phone_Book"
        ]
    },
    {
        "tag": "Cameras",
        "icons": [
            "Videocamera"
        ]
    },
    {
        "tag": "Campaigns",
        "icons": [
            "Advertising",
            "Certificate",
            "Directive_Board",
            "Router",
            "Router"
        ]
    },
    {
        "tag": "Campus Locations",
        "icons": [
            "School",
            "University"
        ]
    },
    {
        "tag": "Candidates",
        "icons": [
            "Anonymous",
            "customers",
            "Etiquette",
            "Female",
            "Female2",
            "Graduate",
            "Group",
            "Salesman",
            "teammembers"
        ]
    },
    {
        "tag": "Cart",
        "icons": [
            "Market_Segmentation",
            "products",
            "Purchase",
            "shopping-bag",
            "Shopping_Cart"
        ]
    },
    {
        "tag": "Case",
        "icons": [
            "Briefcase"
        ]
    },
    {
        "tag": "Cases",
        "icons": [
            "firstaid",
            "Frames2",
            "Justice",
            "Laws",
            "pages"
        ]
    },
    {
        "tag": "Categories",
        "icons": [
            "projects",
            "Stats_Bar_Chart_Star",
            "templatedprojects"
        ]
    },
    {
        "tag": "Category",
        "icons": [
            "projects",
            "Stats_Bar_Chart_Star",
            "templatedprojects"
        ]
    },
    {
        "tag": "Celebration",
        "icons": [
            "Champagne"
        ]
    },
    {
        "tag": "Cellphone",
        "icons": [
            "Cellphone"
        ]
    },
    {
        "tag": "Cells",
        "icons": [
            "Row_Zoom"
        ]
    },
    {
        "tag": "Census",
        "icons": [
            "Clipboard",
            "estimates"
        ]
    },
    {
        "tag": "certificates",
        "icons": [
            "Accreditations"
        ]
    },
    {
        "tag": "Certifications",
        "icons": [
            "Accreditations",
            "Certificate",
            "Star",
            "Trophy"
        ]
    },
    {
        "tag": "Chain",
        "icons": [
            "Animation"
        ]
    },
    {
        "tag": "Chalkboard",
        "icons": [
            "Blackboard"
        ]
    },
    {
        "tag": "Change Requests",
        "icons": [
            "Protocol2",
            "Protocol2",
            "Refresh"
        ]
    },
    {
        "tag": "Chart",
        "icons": [
            "lineitems",
            "Table_Footer_Gear",
            "Table_Header2"
        ]
    },
    {
        "tag": "Charts",
        "icons": [
            "reports",
            "Stats_Pie_Chart",
            "Stock_Market",
            "Table_Footer_Gear"
        ]
    },
    {
        "tag": "Chat",
        "icons": [
            "Chat_Exclamation",
            "Essay",
            "Foreign_Language",
            "SMS"
        ]
    },
    {
        "tag": "Check out",
        "icons": [
            "Stamp"
        ]
    },
    {
        "tag": "Checklist",
        "icons": [
            "Attendance_List",
            "Task",
            "tasks",
            "White_List"
        ]
    },
    {
        "tag": "Checks",
        "icons": [
            "Check2",
            "Quality",
            "Salary",
            "White_List"
        ]
    },
    {
        "tag": "Choices",
        "icons": [
            "dots",
            "Physics_Pendulum"
        ]
    },
    {
        "tag": "Claims",
        "icons": [
            "fire",
            "firstaid",
            "Justice"
        ]
    },
    {
        "tag": "Class",
        "icons": [
            "Blackboard",
            "Book",
            "Campus",
            "Schedule",
            "Table_Footer_Gear",
            "Table_Header2"
        ]
    },
    {
        "tag": "Classes",
        "icons": [
            "Blackboard",
            "Book",
            "Campus",
            "Schedule",
            "School",
            "Table_Footer_Gear",
            "Table_Header2",
            "University"
        ]
    },
    {
        "tag": "Classrooms",
        "icons": [
            "Classroom",
            "ducky",
            "University"
        ]
    },
    {
        "tag": "Clients",
        "icons": [
            "add-person",
            "Administrator",
            "Customer",
            "customers",
            "Etiquette",
            "Female",
            "Female2",
            "Focus_Group",
            "Group",
            "Personal_Record",
            "Salesman",
            "teammembers",
            "User"
        ]
    },
    {
        "tag": "Clipboard",
        "icons": [
            "Clipboard",
            "Clipboard_Pencil",
            "Paste2",
            "task-complete",
            "tasks"
        ]
    },
    {
        "tag": "Clock",
        "icons": [
            "Clock",
            "Timer"
        ]
    },
    {
        "tag": "Cloud",
        "icons": [
            "Cloud",
            "ISP",
            "Upload2"
        ]
    },
    {
        "tag": "Collaborations",
        "icons": [
            "Foreign_Language"
        ]
    },
    {
        "tag": "Collateral",
        "icons": [
            "Check2",
            "Field_Image",
            "Money_Bag_Dollar",
            "Money_Bag_Dollar",
            "moneyperson"
        ]
    },
    {
        "tag": "Collections",
        "icons": [
            "projects",
            "templatedprojects"
        ]
    },
    {
        "tag": "Colleges",
        "icons": [
            "School"
        ]
    },
    {
        "tag": "Commands",
        "icons": [
            "command"
        ]
    },
    {
        "tag": "Comments",
        "icons": [
            "Chat_Exclamation",
            "command",
            "Essay",
            "Foreign_Language",
            "Meeting",
            "Question"
        ]
    },
    {
        "tag": "Commissions",
        "icons": [
            "Tax",
            "Wire_Transfer"
        ]
    },
    {
        "tag": "Committees",
        "icons": [
            "Directive_Board"
        ]
    },
    {
        "tag": "Communication",
        "icons": [
            "Chat_Exclamation",
            "Essay",
            "Meeting",
            "Phone_Book",
            "Satellite_Dish",
            "SMS"
        ]
    },
    {
        "tag": "Communications",
        "icons": [
            "Foreign_Language"
        ]
    },
    {
        "tag": "Commute",
        "icons": [
            "bicycle"
        ]
    },
    {
        "tag": "Companies",
        "icons": [
            "Building",
            "Campus",
            "Company",
            "Directive_Board",
            "Store"
        ]
    },
    {
        "tag": "Company",
        "icons": [
            "Building",
            "Campus",
            "Company",
            "Directive_Board"
        ]
    },
    {
        "tag": "Comparisons",
        "icons": [
            "Stats_Bar_Chart_Star"
        ]
    },
    {
        "tag": "Competitor Analysis",
        "icons": [
            "Stats_Bar_Chart_Star"
        ]
    },
    {
        "tag": "Competitors",
        "icons": [
            "Competitors"
        ]
    },
    {
        "tag": "Complete",
        "icons": [
            "task-complete"
        ]
    },
    {
        "tag": "Components",
        "icons": [
            "Table_Footer_Gear",
            "Table_Header2",
            "Table_Header2"
        ]
    },
    {
        "tag": "Concierge",
        "icons": [
            "bell",
            "School_Bell"
        ]
    },
    {
        "tag": "Conference",
        "icons": [
            "Directive_Board"
        ]
    },
    {
        "tag": "Conference Center",
        "icons": [
            "Campus"
        ]
    },
    {
        "tag": "Construction",
        "icons": [
            "cube",
            "Objects",
            "Technical_Hammer",
            "Technical_Screwdriver",
            "Technical_Wrench"
        ]
    },
    {
        "tag": "Consumers",
        "icons": [
            "User"
        ]
    },
    {
        "tag": "Contacts",
        "icons": [
            "at-sign",
            "Cellphone",
            "Contact",
            "ID",
            "Phone_Book"
        ]
    },
    {
        "tag": "Contractors",
        "icons": [
            "Briefcase"
        ]
    },
    {
        "tag": "Contracts",
        "icons": [
            "Attendance_List",
            "Clipboard_Pencil",
            "Contact",
            "Contract",
            "Curriculum",
            "document",
            "Essay",
            "Fountain_Pen"
        ]
    },
    {
        "tag": "Conversation",
        "icons": [
            "command"
        ]
    },
    {
        "tag": "Conversations",
        "icons": [
            "Foreign_Language"
        ]
    },
    {
        "tag": "Copy",
        "icons": [
            "Copy",
            "Copy2"
        ]
    },
    {
        "tag": "Costs",
        "icons": [
            "Calculator",
            "Tax"
        ]
    },
    {
        "tag": "Countries",
        "icons": [
            "Geography"
        ]
    },
    {
        "tag": "Country",
        "icons": [
            "Geography"
        ]
    },
    {
        "tag": "Course Catalog",
        "icons": [
            "Book"
        ]
    },
    {
        "tag": "Course Materials",
        "icons": [
            "Attendance_List",
            "backpack",
            "Book",
            "Bookmark",
            "Contact",
            "Contract",
            "Curriculum",
            "Geography",
            "OSI_Model",
            "pages",
            "Report",
            "Report2",
            "Whiteboard"
        ]
    },
    {
        "tag": "Court Rooms",
        "icons": [
            "Justice"
        ]
    },
    {
        "tag": "Courts",
        "icons": [
            "Justice"
        ]
    },
    {
        "tag": "Cube",
        "icons": [
            "cube"
        ]
    },
    {
        "tag": "Cup",
        "icons": [
            "Trophy"
        ]
    },
    {
        "tag": "Cupcake",
        "icons": [
            "cupcake"
        ]
    },
    {
        "tag": "Curriculum",
        "icons": [
            "Curriculum"
        ]
    },
    {
        "tag": "Customer References",
        "icons": [
            "Personal_Record"
        ]
    },
    {
        "tag": "Customer Service",
        "icons": [
            "Administrator",
            "Anonymous",
            "customers",
            "Etiquette",
            "Female",
            "Female2",
            "Front_Desk",
            "Meeting",
            "phone",
            "Question",
            "Salesman",
            "teammembers"
        ]
    },
    {
        "tag": "Customers",
        "icons": [
            "Customer",
            "customers",
            "Female",
            "Female2",
            "Salesman",
            "Smudge",
            "student-girl"
        ]
    },
    {
        "tag": "Daily",
        "icons": [
            "Inventory"
        ]
    },
    {
        "tag": "Data",
        "icons": [
            "Marker"
        ]
    },
    {
        "tag": "Dates",
        "icons": [
            "Calendar",
            "Calendar_Month",
            "Calendar_Year",
            "Schedule",
            "Timer"
        ]
    },
    {
        "tag": "Deadlines",
        "icons": [
            "Hourglass"
        ]
    },
    {
        "tag": "Deals",
        "icons": [
            "Advertising",
            "pricetag",
            "Star",
            "Trophy"
        ]
    },
    {
        "tag": "Decisions",
        "icons": [
            "Task",
            "task-complete"
        ]
    },
    {
        "tag": "Defects",
        "icons": [
            "Bomb",
            "Bug",
            "Defective_Product",
            "Risk",
            "Risk"
        ]
    },
    {
        "tag": "Deliverable",
        "icons": [
            "pages"
        ]
    },
    {
        "tag": "Deliverables",
        "icons": [
            "Market_Segmentation",
            "pages",
            "Purchase",
            "Send_Package",
            "Truck"
        ]
    },
    {
        "tag": "Deliveries",
        "icons": [
            "products",
            "Semi_Trailer_Truck",
            "Ship",
            "Truck"
        ]
    },
    {
        "tag": "Delivery",
        "icons": [
            "products",
            "Semi_Trailer_Truck",
            "Ship",
            "Truck"
        ]
    },
    {
        "tag": "Department store",
        "icons": [
            "College"
        ]
    },
    {
        "tag": "Departments",
        "icons": [
            "Classroom",
            "Group"
        ]
    },
    {
        "tag": "details",
        "icons": [
            "lineitems"
        ]
    },
    {
        "tag": "Detectives",
        "icons": [
            "Focus_Group"
        ]
    },
    {
        "tag": "Devices",
        "icons": [
            "Cellphone",
            "phone",
            "Videocamera",
            "Videocamera"
        ]
    },
    {
        "tag": "Dial",
        "icons": [
            "Audio_Knob"
        ]
    },
    {
        "tag": "Diamond",
        "icons": [
            "diamond"
        ]
    },
    {
        "tag": "Die",
        "icons": [
            "cube"
        ]
    },
    {
        "tag": "Dimensions",
        "icons": [
            "Dimensions"
        ]
    },
    {
        "tag": "Directions",
        "icons": [
            "Router"
        ]
    },
    {
        "tag": "Dispatch",
        "icons": [
            "Dispatch_Order"
        ]
    },
    {
        "tag": "Docs",
        "icons": [
            "document",
            "Folder",
            "pages"
        ]
    },
    {
        "tag": "Doctor",
        "icons": [
            "Nurse"
        ]
    },
    {
        "tag": "Document Library",
        "icons": [
            "Book",
            "Building",
            "Copy",
            "Copy2",
            "Curriculum",
            "File2",
            "Folder",
            "Frames2",
            "Paste2"
        ]
    },
    {
        "tag": "Documentation",
        "icons": [
            "Bookmark",
            "Clipboard_Pencil",
            "Contract",
            "Copy",
            "Copy2",
            "Curriculum",
            "document",
            "Edit",
            "Folder",
            "Inventory",
            "Invoice",
            "List",
            "paperclip",
            "Report",
            "Report2"
        ]
    },
    {
        "tag": "Documents",
        "icons": [
            "Acquisition_Clock",
            "Book",
            "Bookmark",
            "Check2",
            "Clipboard",
            "Clipboard_Pencil",
            "Competitors",
            "Contact",
            "Contract",
            "Copy",
            "Copy2",
            "Curriculum",
            "Defective_Product",
            "Dispatch_Order",
            "document",
            "Download",
            "Edit",
            "estimates",
            "Field_Image",
            "File2",
            "Folder",
            "Frames2",
            "Inventory",
            "Inventory_Category2",
            "Invoice",
            "invoices",
            "lineitems",
            "List",
            "Money_Bag_Dollar",
            "OSI_Model",
            "pages",
            "pages",
            "paperclip",
            "Paste2",
            "Personal_Record",
            "Poetry",
            "Report",
            "Report",
            "Report2",
            "Report2"
        ]
    },
    {
        "tag": "Dollar sign",
        "icons": [
            "Currency_Sign_Dollar2",
            "Invoice"
        ]
    },
    {
        "tag": "Dollars",
        "icons": [
            "Salary"
        ]
    },
    {
        "tag": "Donations",
        "icons": [
            "Clipboard",
            "Currency_Sign_Dollar2",
            "ducky",
            "Piggy"
        ]
    },
    {
        "tag": "Door",
        "icons": [
            "Classroom",
            "Door"
        ]
    },
    {
        "tag": "Downloads",
        "icons": [
            "Download"
        ]
    },
    {
        "tag": "Drawings",
        "icons": [
            "Field_Image"
        ]
    },
    {
        "tag": "Duplicate",
        "icons": [
            "Copy",
            "Copy2"
        ]
    },
    {
        "tag": "Economics",
        "icons": [
            "Economics"
        ]
    },
    {
        "tag": "Editors",
        "icons": [
            "Fountain_Pen",
            "Sole_Proprietorship",
            "Sole_Proprietorship_Pencil",
            "Whiteboard"
        ]
    },
    {
        "tag": "Edits",
        "icons": [
            "Edit",
            "Fountain_Pen",
            "Whiteboard"
        ]
    },
    {
        "tag": "Education",
        "icons": [
            "backpack",
            "Blackboard",
            "Book",
            "ducky",
            "Graduate",
            "School",
            "student-girl",
            "University"
        ]
    },
    {
        "tag": "Emails",
        "icons": [
            "at-sign",
            "Contact",
            "envelope"
        ]
    },
    {
        "tag": "Employee",
        "icons": [
            "team"
        ]
    },
    {
        "tag": "Employees",
        "icons": [
            "add-person",
            "Bread",
            "customers",
            "Etiquette",
            "Female",
            "Female2",
            "ID",
            "moneyperson",
            "Salesman",
            "team",
            "teammembers"
        ]
    },
    {
        "tag": "Envelope",
        "icons": [
            "envelope"
        ]
    },
    {
        "tag": "Equipment",
        "icons": [
            "products",
            "Satellite_Dish",
            "vendors"
        ]
    },
    {
        "tag": "Escalations",
        "icons": [
            "Animation"
        ]
    },
    {
        "tag": "Essay",
        "icons": [
            "Essay"
        ]
    },
    {
        "tag": "estimates",
        "icons": [
            "estimates",
            "invoices"
        ]
    },
    {
        "tag": "Etiquette",
        "icons": [
            "Etiquette"
        ]
    },
    {
        "tag": "Evaluations",
        "icons": [
            "Attendance_List",
            "Clipboard_Pencil",
            "Contract",
            "Edit",
            "Focus_Group",
            "Hand_Thumbs-up",
            "Meeting"
        ]
    },
    {
        "tag": "Events",
        "icons": [
            "Calendar",
            "Calendar_Month",
            "Calendar_Year",
            "Champagne",
            "Offer",
            "Schedule",
            "Star"
        ]
    },
    {
        "tag": "Exclamation Point",
        "icons": [
            "Risk"
        ]
    },
    {
        "tag": "Exercises",
        "icons": [
            "barbell",
            "kettlebell",
            "lift"
        ]
    },
    {
        "tag": "Expenses",
        "icons": [
            "Calculator",
            "estimates",
            "invoices",
            "pricetag",
            "Tax"
        ]
    },
    {
        "tag": "Express Ship",
        "icons": [
            "Send_Package"
        ]
    },
    {
        "tag": "Eye",
        "icons": [
            "eyeball"
        ]
    },
    {
        "tag": "Facts",
        "icons": [
            "Marker"
        ]
    },
    {
        "tag": "Feedback",
        "icons": [
            "Chat_Exclamation",
            "Foreign_Language"
        ]
    },
    {
        "tag": "Female",
        "icons": [
            "Female",
            "Female2"
        ]
    },
    {
        "tag": "Figure",
        "icons": [
            "Stats_Pie_Chart"
        ]
    },
    {
        "tag": "Files",
        "icons": [
            "Copy",
            "Copy2",
            "File2",
            "film",
            "Folder",
            "pages",
            "Personal_Record",
            "projects",
            "templatedprojects"
        ]
    },
    {
        "tag": "film",
        "icons": [
            "film"
        ]
    },
    {
        "tag": "Finances",
        "icons": [
            "Bank_Transaction",
            "Briefcase",
            "Calculator",
            "Currency_Sign_Dollar2",
            "Invoice",
            "Money_Bag_Dollar",
            "Salary",
            "Stock_Market",
            "Tax",
            "Wire_Transfer"
        ]
    },
    {
        "tag": "Financial",
        "icons": [
            "Currency_Sign_Dollar2",
            "estimates",
            "Network_Monitor",
            "Plane",
            "Salary",
            "Tax"
        ]
    },
    {
        "tag": "Findings",
        "icons": [
            "Marker"
        ]
    },
    {
        "tag": "Finger",
        "icons": [
            "Smudge"
        ]
    },
    {
        "tag": "Finished",
        "icons": [
            "White_List"
        ]
    },
    {
        "tag": "Fire",
        "icons": [
            "fire"
        ]
    },
    {
        "tag": "Fitness",
        "icons": [
            "barbell",
            "kettlebell",
            "lift"
        ]
    },
    {
        "tag": "Fixes",
        "icons": [
            "fire",
            "firstaid",
            "Technical_Hammer",
            "Technical_Screwdriver",
            "Technical_Wrench"
        ]
    },
    {
        "tag": "Flag",
        "icons": [
            "flag"
        ]
    },
    {
        "tag": "Floor",
        "icons": [
            "University"
        ]
    },
    {
        "tag": "Folder",
        "icons": [
            "File2"
        ]
    },
    {
        "tag": "Folders",
        "icons": [
            "Folder",
            "projects",
            "templatedprojects"
        ]
    },
    {
        "tag": "Food",
        "icons": [
            "Champagne",
            "cupcake",
            "rooster"
        ]
    },
    {
        "tag": "forecasts",
        "icons": [
            "reports"
        ]
    },
    {
        "tag": "Forms",
        "icons": [
            "Paste2"
        ]
    },
    {
        "tag": "Gauge",
        "icons": [
            "Audio_Knob",
            "speedometer"
        ]
    },
    {
        "tag": "Gavel",
        "icons": [
            "Laws"
        ]
    },
    {
        "tag": "Gear",
        "icons": [
            "Engineering"
        ]
    },
    {
        "tag": "Geography",
        "icons": [
            "Geography"
        ]
    },
    {
        "tag": "Girl",
        "icons": [
            "student-girl"
        ]
    },
    {
        "tag": "Globe",
        "icons": [
            "Geography",
            "Social_Studies"
        ]
    },
    {
        "tag": "Goals",
        "icons": [
            "Trophy"
        ]
    },
    {
        "tag": "Graduates",
        "icons": [
            "Graduate"
        ]
    },
    {
        "tag": "Grid",
        "icons": [
            "Schedule",
            "Spreadsheet",
            "Table_Footer_Gear",
            "Table_Header2"
        ]
    },
    {
        "tag": "Groups",
        "icons": [
            "Directive_Board",
            "Focus_Group",
            "Group",
            "Hand_Handshake",
            "Meeting",
            "Meeting3",
            "team"
        ]
    },
    {
        "tag": "Gym",
        "icons": [
            "Campus"
        ]
    },
    {
        "tag": "Hammer",
        "icons": [
            "Laws",
            "Technical_Hammer"
        ]
    },
    {
        "tag": "Hand",
        "icons": [
            "Hand_Point",
            "Smudge"
        ]
    },
    {
        "tag": "Handoff",
        "icons": [
            "Protocol2"
        ]
    },
    {
        "tag": "Handout",
        "icons": [
            "OSI_Model"
        ]
    },
    {
        "tag": "Handshake",
        "icons": [
            "Hand_Handshake"
        ]
    },
    {
        "tag": "Heart Monitor",
        "icons": [
            "Network_Monitor"
        ]
    },
    {
        "tag": "Helmet",
        "icons": [
            "Trojan"
        ]
    },
    {
        "tag": "Help",
        "icons": [
            "Question"
        ]
    },
    {
        "tag": "Hire",
        "icons": [
            "ID"
        ]
    },
    {
        "tag": "Hospital Staff",
        "icons": [
            "Nurse"
        ]
    },
    {
        "tag": "Hotel",
        "icons": [
            "Campus"
        ]
    },
    {
        "tag": "Hourglass",
        "icons": [
            "Hourglass"
        ]
    },
    {
        "tag": "Hourly",
        "icons": [
            "Timer"
        ]
    },
    {
        "tag": "Hourly rate",
        "icons": [
            "Clock"
        ]
    },
    {
        "tag": "Hours",
        "icons": [
            "Clock",
            "Timer"
        ]
    },
    {
        "tag": "Human Resources",
        "icons": [
            "Administrator",
            "Anonymous",
            "Sole_Proprietorship",
            "Sole_Proprietorship_Pencil"
        ]
    },
    {
        "tag": "ID",
        "icons": [
            "ID"
        ]
    },
    {
        "tag": "ideas",
        "icons": [
            "Engineering",
            "lightbulb"
        ]
    },
    {
        "tag": "Identification",
        "icons": [
            "ID"
        ]
    },
    {
        "tag": "Images",
        "icons": [
            "Field_Image",
            "film",
            "Videocamera"
        ]
    },
    {
        "tag": "Incidents",
        "icons": [
            "Bomb",
            "Cloud",
            "Competitors",
            "Defective_Product",
            "fire",
            "firstaid",
            "Risk"
        ]
    },
    {
        "tag": "Information",
        "icons": [
            "Advertising"
        ]
    },
    {
        "tag": "Inquiries",
        "icons": [
            "Front_Desk",
            "Question"
        ]
    },
    {
        "tag": "Inquiry",
        "icons": [
            "Front_Desk",
            "Question"
        ]
    },
    {
        "tag": "Inspections",
        "icons": [
            "Focus_Group",
            "Question"
        ]
    },
    {
        "tag": "Installation Tasks",
        "icons": [
            "Engineering",
            "List",
            "Task",
            "Technical_Hammer",
            "Technical_Screwdriver",
            "Technical_Wrench"
        ]
    },
    {
        "tag": "Installations",
        "icons": [
            "Technical_Hammer",
            "Technical_Screwdriver",
            "Technical_Wrench"
        ]
    },
    {
        "tag": "Instructors",
        "icons": [
            "Administrator",
            "customers",
            "Etiquette",
            "Female",
            "Female2",
            "Salesman",
            "User"
        ]
    },
    {
        "tag": "Insurance",
        "icons": [
            "umbrella"
        ]
    },
    {
        "tag": "Interviews",
        "icons": [
            "Meeting"
        ]
    },
    {
        "tag": "Inventory",
        "icons": [
            "Inventory",
            "Inventory_Category2",
            "pricetag",
            "Product",
            "products",
            "Send_Package",
            "shopping-bag",
            "Shopping_Cart",
            "Sku",
            "Warehouse",
            "White_List"
        ]
    },
    {
        "tag": "Invoices",
        "icons": [
            "Bank_Transaction",
            "Currency_Sign_Dollar2",
            "Invoice",
            "invoices",
            "lineitems",
            "pages"
        ]
    },
    {
        "tag": "Issue",
        "icons": [
            "Risk"
        ]
    },
    {
        "tag": "Issues",
        "icons": [
            "Acquisition_Clock",
            "Bomb",
            "Defective_Product",
            "Frames2",
            "Risk"
        ]
    },
    {
        "tag": "Items",
        "icons": [
            "Acquisition_Clock",
            "activity",
            "Attendance_List",
            "Clipboard_Pencil",
            "List",
            "OSI_Model2",
            "Send_Package"
        ]
    },
    {
        "tag": "Iterations",
        "icons": [
            "Calendar",
            "Calendar_Month",
            "Calendar_Year"
        ]
    },
    {
        "tag": "Job",
        "icons": [
            "Sole_Proprietorship"
        ]
    },
    {
        "tag": "Jobs",
        "icons": [
            "Administrator",
            "Anonymous",
            "List",
            "Sole_Proprietorship",
            "Sole_Proprietorship_Pencil"
        ]
    },
    {
        "tag": "Journals",
        "icons": [
            "Inventory",
            "Report",
            "Report2"
        ]
    },
    {
        "tag": "Judgements",
        "icons": [
            "Laws"
        ]
    },
    {
        "tag": "Justice",
        "icons": [
            "Justice"
        ]
    },
    {
        "tag": "Kettlebell",
        "icons": [
            "kettlebell"
        ]
    },
    {
        "tag": "Keys",
        "icons": [
            "Key"
        ]
    },
    {
        "tag": "Laws",
        "icons": [
            "Laws"
        ]
    },
    {
        "tag": "Layer",
        "icons": [
            "OSI_Model"
        ]
    },
    {
        "tag": "Leads",
        "icons": [
            "Certificate",
            "Color",
            "cube",
            "diamond",
            "Growth",
            "Hand_Thumbs-up",
            "lightbulb",
            "Star",
            "White_List"
        ]
    },
    {
        "tag": "Lecture",
        "icons": [
            "Blackboard",
            "Book"
        ]
    },
    {
        "tag": "Lecture Halls",
        "icons": [
            "University"
        ]
    },
    {
        "tag": "Legal",
        "icons": [
            "Contract",
            "Frames2"
        ]
    },
    {
        "tag": "Lessee",
        "icons": [
            "Key"
        ]
    },
    {
        "tag": "Library",
        "icons": [
            "Bookmark",
            "Building"
        ]
    },
    {
        "tag": "Lift",
        "icons": [
            "barbell",
            "kettlebell",
            "lift"
        ]
    },
    {
        "tag": "Light bulb",
        "icons": [
            "lightbulb"
        ]
    },
    {
        "tag": "Lightbulb",
        "icons": [
            "lightbulb"
        ]
    },
    {
        "tag": "Line Items",
        "icons": [
            "invoices",
            "lineitems",
            "Row_Zoom"
        ]
    },
    {
        "tag": "Links",
        "icons": [
            "Animation",
            "Bookmark"
        ]
    },
    {
        "tag": "Listings",
        "icons": [
            "List"
        ]
    },
    {
        "tag": "Lists",
        "icons": [
            "activity",
            "pages"
        ]
    },
    {
        "tag": "Loans",
        "icons": [
            "Money_Bag_Dollar"
        ]
    },
    {
        "tag": "Location",
        "icons": [
            "Store"
        ]
    },
    {
        "tag": "Locations",
        "icons": [
            "Architecture",
            "Building",
            "Door",
            "Location"
        ]
    },
    {
        "tag": "Lock",
        "icons": [
            "Lock",
            "login"
        ]
    },
    {
        "tag": "Logs",
        "icons": [
            "document",
            "phone",
            "Report",
            "Report2",
            "White_List"
        ]
    },
    {
        "tag": "Lots",
        "icons": [
            "Warehouse"
        ]
    },
    {
        "tag": "Magnifying Glass",
        "icons": [
            "Focus_Group",
            "Row_Zoom"
        ]
    },
    {
        "tag": "Mail",
        "icons": [
            "envelope"
        ]
    },
    {
        "tag": "Management",
        "icons": [
            "Advertising",
            "Animation",
            "Attendance_List",
            "Audio_Knob",
            "Bank_Transaction",
            "bell",
            "Blackboard",
            "Bookmark",
            "Calendar",
            "Calendar_Month",
            "Calendar_Year",
            "Certificate",
            "Champagne",
            "Color",
            "Economics",
            "Focus_Group",
            "Foreign_Language",
            "Fountain_Pen",
            "Front_Desk",
            "Hourglass",
            "ISP",
            "Justice",
            "Laws",
            "Marker",
            "Market_Segmentation",
            "Meeting",
            "Meeting3",
            "Objects",
            "Offer",
            "OSI_Model",
            "OSI_Model2",
            "Physics_Pendulum",
            "Ping",
            "Poetry",
            "Product",
            "Protocol2",
            "Purchase",
            "Quality",
            "Refresh",
            "Router",
            "Row_Zoom",
            "Satellite_Dish",
            "Schedule",
            "School_Bell",
            "Sole_Proprietorship",
            "Sole_Proprietorship_Pencil",
            "Spreadsheet",
            "Stamp",
            "Star",
            "Stats_Bar_Chart_Star",
            "Stats_Pie_Chart",
            "Stock_Market",
            "Summary_Arrow_Right",
            "Summary_Zoom",
            "Table_Footer_Gear",
            "Table_Header2",
            "Task",
            "Timer",
            "Treasure_Chest",
            "Trophy",
            "Whistle",
            "White_List",
            "Wire_Transfer"
        ]
    },
    {
        "tag": "Marker",
        "icons": [
            "Location",
            "Marker"
        ]
    },
    {
        "tag": "Markets",
        "icons": [
            "Market_Segmentation"
        ]
    },
    {
        "tag": "Matching",
        "icons": [
            "dots"
        ]
    },
    {
        "tag": "Matrix",
        "icons": [
            "Table_Footer_Gear",
            "Table_Header2"
        ]
    },
    {
        "tag": "Measurement",
        "icons": [
            "Stats_Pie_Chart"
        ]
    },
    {
        "tag": "Medical",
        "icons": [
            "Nurse"
        ]
    },
    {
        "tag": "Meeting",
        "icons": [
            "Hand_Handshake"
        ]
    },
    {
        "tag": "Meetings",
        "icons": [
            "Classroom",
            "Directive_Board",
            "Focus_Group",
            "Group",
            "Hand_Handshake",
            "Meeting",
            "Meeting3",
            "schedule"
        ]
    },
    {
        "tag": "Members",
        "icons": [
            "Bread",
            "customers",
            "Female",
            "Female2",
            "Salesman",
            "User"
        ]
    },
    {
        "tag": "Merchandise",
        "icons": [
            "Semi_Trailer_Truck"
        ]
    },
    {
        "tag": "Merchant",
        "icons": [
            "Sole_Proprietorship"
        ]
    },
    {
        "tag": "Merchants",
        "icons": [
            "Sole_Proprietorship_Pencil"
        ]
    },
    {
        "tag": "Messages",
        "icons": [
            "Advertising",
            "Chat_Exclamation",
            "envelope",
            "Essay",
            "phone",
            "Question",
            "SMS"
        ]
    },
    {
        "tag": "Metrics",
        "icons": [
            "Architecture",
            "Calculator",
            "Economics"
        ]
    },
    {
        "tag": "Milestones",
        "icons": [
            "Certificate",
            "Hand_Thumbs-up",
            "Trophy"
        ]
    },
    {
        "tag": "Minutes",
        "icons": [
            "Clipboard_Pencil",
            "Meeting3",
            "pages"
        ]
    },
    {
        "tag": "Mobile mail",
        "icons": [
            "SMS"
        ]
    },
    {
        "tag": "Money",
        "icons": [
            "Bank_Transaction",
            "Currency_Sign_Dollar2",
            "Money_Bag_Dollar",
            "moneyperson",
            "Piggy",
            "Salary",
            "shopping-bag",
            "Tax",
            "Wire_Transfer"
        ]
    },
    {
        "tag": "Monitor",
        "icons": [
            "Network_Monitor"
        ]
    },
    {
        "tag": "Monthly",
        "icons": [
            "Inventory"
        ]
    },
    {
        "tag": "Months",
        "icons": [
            "Calendar",
            "Calendar_Month",
            "Calendar_Year"
        ]
    },
    {
        "tag": "Mortarboard",
        "icons": [
            "Graduate"
        ]
    },
    {
        "tag": "Movie",
        "icons": [
            "Satellite_Dish"
        ]
    },
    {
        "tag": "Movies",
        "icons": [
            "film",
            "Videocamera"
        ]
    },
    {
        "tag": "Net 30",
        "icons": [
            "Inventory_Category2"
        ]
    },
    {
        "tag": "Network",
        "icons": [
            "Bomb",
            "Bug",
            "Defective_Product",
            "Engineering",
            "Field_Image",
            "Network_Monitor",
            "OSI_Model",
            "Ping",
            "Refresh"
        ]
    },
    {
        "tag": "Networks",
        "icons": [
            "ISP",
            "OSI_Model2",
            "Product",
            "Protocol2",
            "Risk",
            "Router",
            "Satellite_Dish"
        ]
    },
    {
        "tag": "Nominations",
        "icons": [
            "Certificate",
            "Star",
            "Trophy"
        ]
    },
    {
        "tag": "Nominees",
        "icons": [
            "Anonymous"
        ]
    },
    {
        "tag": "Notes",
        "icons": [
            "document",
            "Fountain_Pen",
            "Marker",
            "Paste2",
            "Report",
            "Report2"
        ]
    },
    {
        "tag": "Notes to Admin",
        "icons": [
            "Clipboard_Pencil",
            "document",
            "Etiquette",
            "Female",
            "Female2",
            "Fountain_Pen",
            "Poetry"
        ]
    },
    {
        "tag": "Notifications",
        "icons": [
            "fire",
            "rooster",
            "trumpet"
        ]
    },
    {
        "tag": "Nurse",
        "icons": [
            "Nurse"
        ]
    },
    {
        "tag": "Objects",
        "icons": [
            "Objects"
        ]
    },
    {
        "tag": "Offers",
        "icons": [
            "Certificate",
            "Color",
            "cupcake",
            "Currency_Sign_Dollar2",
            "Customer",
            "diamond",
            "Hand_Thumbs-up",
            "moneyperson",
            "Offer",
            "pricetag",
            "Purchase",
            "Star",
            "Stats_Bar_Chart_Star",
            "thumbtack",
            "Trophy"
        ]
    },
    {
        "tag": "Office",
        "icons": [
            "Building",
            "Store"
        ]
    },
    {
        "tag": "Office Park",
        "icons": [
            "Campus"
        ]
    },
    {
        "tag": "Offshore",
        "icons": [
            "Plane"
        ]
    },
    {
        "tag": "Operators",
        "icons": [
            "ID"
        ]
    },
    {
        "tag": "Opinions",
        "icons": [
            "Clipboard",
            "Clipboard_Pencil"
        ]
    },
    {
        "tag": "Opportunities",
        "icons": [
            "Color",
            "cube",
            "eyeball",
            "Growth",
            "Hand_Handshake",
            "Hand_Thumbs-up",
            "quote"
        ]
    },
    {
        "tag": "Opportunity",
        "icons": [
            "Color",
            "eyeball",
            "Hand_Handshake",
            "Hand_Thumbs-up"
        ]
    },
    {
        "tag": "Order",
        "icons": [
            "shopping-bag"
        ]
    },
    {
        "tag": "Orders",
        "icons": [
            "Hand_Point",
            "shopping-bag",
            "Shopping_Cart"
        ]
    },
    {
        "tag": "Organization",
        "icons": [
            "Bank_Transaction",
            "Refresh",
            "Row_Zoom",
            "Satellite_Dish",
            "Schedule",
            "Spreadsheet",
            "Stats_Bar_Chart_Star",
            "Summary_Arrow_Right",
            "Timer",
            "Trophy"
        ]
    },
    {
        "tag": "Organizations",
        "icons": [
            "Advertising",
            "Animation",
            "Attendance_List",
            "Audio_Knob",
            "bell",
            "Blackboard",
            "Bookmark",
            "Certificate",
            "Champagne",
            "Color",
            "Company",
            "Focus_Group",
            "Front_Desk",
            "Hourglass",
            "ISP",
            "Justice",
            "Laws",
            "Market_Segmentation",
            "Offer",
            "OSI_Model",
            "OSI_Model2",
            "Physics_Pendulum",
            "Product",
            "Protocol2",
            "Purchase",
            "Quality",
            "Router",
            "School_Bell",
            "School_Bell",
            "Sole_Proprietorship",
            "Sole_Proprietorship_Pencil",
            "Stamp",
            "Star",
            "Summary_Zoom",
            "Wire_Transfer"
        ]
    },
    {
        "tag": "OSI",
        "icons": [
            "OSI_Model"
        ]
    },
    {
        "tag": "Overseas",
        "icons": [
            "Ship"
        ]
    },
    {
        "tag": "Packages",
        "icons": [
            "Market_Segmentation",
            "Send_Package"
        ]
    },
    {
        "tag": "Panel",
        "icons": [
            "Directive_Board"
        ]
    },
    {
        "tag": "Paper",
        "icons": [
            "document",
            "Report2"
        ]
    },
    {
        "tag": "Paperclip",
        "icons": [
            "paperclip"
        ]
    },
    {
        "tag": "Papers",
        "icons": [
            "OSI_Model2",
            "Report"
        ]
    },
    {
        "tag": "Parcels",
        "icons": [
            "Send_Package",
            "Truck"
        ]
    },
    {
        "tag": "Participants",
        "icons": [
            "Group",
            "Swimming"
        ]
    },
    {
        "tag": "Partners",
        "icons": [
            "Hand_Handshake",
            "Meeting"
        ]
    },
    {
        "tag": "Parts",
        "icons": [
            "Engineering"
        ]
    },
    {
        "tag": "Passwords",
        "icons": [
            "Key",
            "Lock",
            "login"
        ]
    },
    {
        "tag": "Paste",
        "icons": [
            "Paste2"
        ]
    },
    {
        "tag": "Patch",
        "icons": [
            "Summary_Arrow_Right"
        ]
    },
    {
        "tag": "Patches",
        "icons": [
            "Summary_Arrow_Right"
        ]
    },
    {
        "tag": "Patients",
        "icons": [
            "Nurse"
        ]
    },
    {
        "tag": "payables",
        "icons": [
            "invoices"
        ]
    },
    {
        "tag": "Payment",
        "icons": [
            "shopping-bag"
        ]
    },
    {
        "tag": "Payments",
        "icons": [
            "Currency_Sign_Dollar2",
            "Money_Bag_Dollar",
            "Salary",
            "shopping-bag",
            "Shopping_Cart"
        ]
    },
    {
        "tag": "Payroll",
        "icons": [
            "Bank_Transaction",
            "Bread",
            "Currency_Sign_Dollar2",
            "Invoice"
        ]
    },
    {
        "tag": "Peer Feedback",
        "icons": [
            "Ping"
        ]
    },
    {
        "tag": "Pen",
        "icons": [
            "Fountain_Pen",
            "Marker"
        ]
    },
    {
        "tag": "People",
        "icons": [
            "Achievement",
            "add-person",
            "Administrator",
            "Anonymous",
            "Briefcase",
            "Contact",
            "Customer",
            "customers",
            "Directive_Board",
            "Etiquette",
            "Female",
            "Female2",
            "Graduate",
            "Group",
            "Hand_Handshake",
            "Hand_Thumbs-up",
            "ID",
            "Key",
            "Nurse",
            "Salesman",
            "Salesman",
            "Smudge",
            "Sole_Proprietorship",
            "Sole_Proprietorship_Pencil",
            "student-girl",
            "Swimming",
            "team",
            "Trojan",
            "User",
            "User"
        ]
    },
    {
        "tag": "Performance",
        "icons": [
            "Quality"
        ]
    },
    {
        "tag": "Performance Reviews",
        "icons": [
            "Presentation",
            "Star"
        ]
    },
    {
        "tag": "Person",
        "icons": [
            "Achievement",
            "add-person",
            "Administrator",
            "Anonymous",
            "Bread",
            "Briefcase",
            "Contact",
            "Customer",
            "customers",
            "Directive_Board",
            "Etiquette",
            "Female",
            "Female2",
            "Graduate",
            "Group",
            "Hand_Handshake",
            "Hand_Thumbs-up",
            "ID",
            "Key",
            "moneyperson",
            "Nurse",
            "Salesman",
            "Smudge",
            "Sole_Proprietorship",
            "Sole_Proprietorship_Pencil",
            "Swimming",
            "Trojan",
            "User",
            "vendors"
        ]
    },
    {
        "tag": "Personnel",
        "icons": [
            "Administrator",
            "Anonymous",
            "customers",
            "Etiquette",
            "Female",
            "Female2",
            "Group",
            "Meeting",
            "Nurse",
            "Salesman",
            "student-girl",
            "teammembers",
            "User",
            "vendors"
        ]
    },
    {
        "tag": "Phones",
        "icons": [
            "Cellphone",
            "phone",
            "Phone_Book",
            "SMS"
        ]
    },
    {
        "tag": "Photos",
        "icons": [
            "Field_Image"
        ]
    },
    {
        "tag": "Pictures",
        "icons": [
            "Field_Image"
        ]
    },
    {
        "tag": "Pie",
        "icons": [
            "Stats_Pie_Chart"
        ]
    },
    {
        "tag": "Pig",
        "icons": [
            "Piggy"
        ]
    },
    {
        "tag": "Piggybank",
        "icons": [
            "Piggy"
        ]
    },
    {
        "tag": "Places",
        "icons": [
            "Architecture",
            "Building",
            "Campus",
            "Classroom",
            "College",
            "Company",
            "Door",
            "Geography",
            "Location",
            "School",
            "Semi_Trailer_Truck",
            "Store",
            "University",
            "Warehouse"
        ]
    },
    {
        "tag": "Plane",
        "icons": [
            "Plane"
        ]
    },
    {
        "tag": "planning",
        "icons": [
            "reports"
        ]
    },
    {
        "tag": "Plant",
        "icons": [
            "Growth"
        ]
    },
    {
        "tag": "Player",
        "icons": [
            "Bread"
        ]
    },
    {
        "tag": "Policies",
        "icons": [
            "Bookmark",
            "umbrella"
        ]
    },
    {
        "tag": "Policy",
        "icons": [
            "Bookmark"
        ]
    },
    {
        "tag": "Positions",
        "icons": [
            "Architecture",
            "Audio_Knob"
        ]
    },
    {
        "tag": "Posts",
        "icons": [
            "Essay",
            "List"
        ]
    },
    {
        "tag": "Precincts",
        "icons": [
            "Geography"
        ]
    },
    {
        "tag": "predictions",
        "icons": [
            "reports"
        ]
    },
    {
        "tag": "Presentations",
        "icons": [
            "Whiteboard"
        ]
    },
    {
        "tag": "Presentations and Documents",
        "icons": [
            "Briefcase",
            "command",
            "Essay",
            "List",
            "Network_Monitor",
            "Objects",
            "Presentation",
            "Report",
            "Report2",
            "Stats_Bar_Chart_Star",
            "Stats_Pie_Chart",
            "team",
            "Whiteboard"
        ]
    },
    {
        "tag": "Press Releases",
        "icons": [
            "Copy",
            "Copy2",
            "Curriculum",
            "List",
            "Report",
            "Report2"
        ]
    },
    {
        "tag": "Prices",
        "icons": [
            "pricetag"
        ]
    },
    {
        "tag": "prizes",
        "icons": [
            "Accreditations"
        ]
    },
    {
        "tag": "Problem",
        "icons": [
            "Cloud",
            "Competitors"
        ]
    },
    {
        "tag": "Problem Set",
        "icons": [
            "Dispatch_Order"
        ]
    },
    {
        "tag": "Product Types",
        "icons": [
            "Copy",
            "Copy2",
            "Objects",
            "Product",
            "Purchase",
            "Sku"
        ]
    },
    {
        "tag": "Products",
        "icons": [
            "Product",
            "Product",
            "products",
            "Purchase",
            "Purchase",
            "Sku"
        ]
    },
    {
        "tag": "Professor",
        "icons": [
            "Etiquette"
        ]
    },
    {
        "tag": "Programs",
        "icons": [
            "Edit",
            "File2",
            "Product",
            "Product"
        ]
    },
    {
        "tag": "Projects",
        "icons": [
            "Blackboard",
            "cube",
            "File2",
            "Network_Monitor",
            "Objects",
            "projects",
            "Stats_Pie_Chart",
            "templatedprojects",
            "Whiteboard"
        ]
    },
    {
        "tag": "Promotions",
        "icons": [
            "Growth"
        ]
    },
    {
        "tag": "Properties",
        "icons": [
            "Table_Footer_Gear",
            "Table_Header2"
        ]
    },
    {
        "tag": "Proposals",
        "icons": [
            "Contract",
            "document",
            "quote"
        ]
    },
    {
        "tag": "Prospects",
        "icons": [
            "customers",
            "diamond",
            "Etiquette",
            "Female",
            "Female2",
            "Hand_Handshake",
            "Hand_Thumbs-up",
            "lightbulb",
            "teammembers"
        ]
    },
    {
        "tag": "Protocols",
        "icons": [
            "Protocol2"
        ]
    },
    {
        "tag": "Providers",
        "icons": [
            "customers",
            "Female",
            "Female2",
            "Salesman",
            "team",
            "Trojan",
            "User"
        ]
    },
    {
        "tag": "Provinces",
        "icons": [
            "Geography"
        ]
    },
    {
        "tag": "Publication",
        "icons": [
            "Curriculum"
        ]
    },
    {
        "tag": "Punch List",
        "icons": [
            "Attendance_List",
            "schedule",
            "tasks",
            "White_List"
        ]
    },
    {
        "tag": "Purchase Order",
        "icons": [
            "shopping-bag"
        ]
    },
    {
        "tag": "Purchase Orders",
        "icons": [
            "Inventory",
            "Inventory_Category2",
            "pricetag",
            "shopping-bag",
            "Shopping_Cart"
        ]
    },
    {
        "tag": "QuickBooks",
        "icons": [
            "Accreditations",
            "activity",
            "customers",
            "estimates",
            "ID",
            "invoices",
            "lineitems",
            "products",
            "projects",
            "reports",
            "schedule",
            "tasks",
            "teammembers",
            "templatedprojects",
            "vendors"
        ]
    },
    {
        "tag": "Quality Control",
        "icons": [
            "Quality",
            "Sole_Proprietorship",
            "Sole_Proprietorship_Pencil"
        ]
    },
    {
        "tag": "Questionnaires",
        "icons": [
            "Clipboard",
            "Question"
        ]
    },
    {
        "tag": "Quill Pen",
        "icons": [
            "Poetry"
        ]
    },
    {
        "tag": "Quotes",
        "icons": [
            "document",
            "Network_Monitor",
            "quote"
        ]
    },
    {
        "tag": "Rainbow",
        "icons": [
            "Color"
        ]
    },
    {
        "tag": "Reading",
        "icons": [
            "OSI_Model"
        ]
    },
    {
        "tag": "Receipts",
        "icons": [
            "Check2",
            "Invoice"
        ]
    },
    {
        "tag": "Receivable",
        "icons": [
            "estimates",
            "Invoice"
        ]
    },
    {
        "tag": "Recommendations",
        "icons": [
            "Personal_Record",
            "thumbtack"
        ]
    },
    {
        "tag": "Records",
        "icons": [
            "File2",
            "Folder",
            "OSI_Model",
            "OSI_Model2",
            "pages",
            "Personal_Record"
        ]
    },
    {
        "tag": "Recycle",
        "icons": [
            "Refresh"
        ]
    },
    {
        "tag": "Referrals",
        "icons": [
            "command",
            "Hand_Handshake",
            "Personal_Record",
            "Social_Studies"
        ]
    },
    {
        "tag": "Regional Office",
        "icons": [
            "Building",
            "Store"
        ]
    },
    {
        "tag": "Regions",
        "icons": [
            "Geography",
            "Social_Studies"
        ]
    },
    {
        "tag": "Registrations",
        "icons": [
            "Fountain_Pen",
            "List",
            "pages",
            "User"
        ]
    },
    {
        "tag": "Release",
        "icons": [
            "Summary_Arrow_Right"
        ]
    },
    {
        "tag": "Releases",
        "icons": [
            "Summary_Arrow_Right",
            "Summary_Zoom"
        ]
    },
    {
        "tag": "Renewals",
        "icons": [
            "Stamp"
        ]
    },
    {
        "tag": "Repairs",
        "icons": [
            "Technical_Hammer",
            "Technical_Screwdriver",
            "Technical_Screwdriver",
            "Technical_Wrench",
            "Technical_Wrench"
        ]
    },
    {
        "tag": "Reports",
        "icons": [
            "Copy",
            "Copy2",
            "Inventory",
            "Report",
            "Report2",
            "reports",
            "Summary_Arrow_Right",
            "Summary_Zoom",
            "Summary_Zoom"
        ]
    },
    {
        "tag": "representatives",
        "icons": [
            "customers"
        ]
    },
    {
        "tag": "Requests",
        "icons": [
            "bell",
            "command",
            "flag",
            "Front_Desk",
            "Hand_Point",
            "phone",
            "School_Bell"
        ]
    },
    {
        "tag": "Requirements",
        "icons": [
            "Quality"
        ]
    },
    {
        "tag": "Requisitions",
        "icons": [
            "Inventory_Category2"
        ]
    },
    {
        "tag": "Reservations",
        "icons": [
            "Cellphone",
            "Contract",
            "envelope",
            "Front_Desk",
            "pages",
            "phone"
        ]
    },
    {
        "tag": "Residents",
        "icons": [
            "Key"
        ]
    },
    {
        "tag": "Resource",
        "icons": [
            "team"
        ]
    },
    {
        "tag": "Resources",
        "icons": [
            "Administrator",
            "Bread",
            "customers",
            "document",
            "Female",
            "Female2",
            "pages",
            "team",
            "Treasure_Chest"
        ]
    },
    {
        "tag": "Response",
        "icons": [
            "thumbtack"
        ]
    },
    {
        "tag": "Responses",
        "icons": [
            "Advertising",
            "at-sign",
            "Chat_Exclamation",
            "envelope",
            "Essay",
            "Foreign_Language",
            "Meeting",
            "Question",
            "thumbtack"
        ]
    },
    {
        "tag": "Results",
        "icons": [
            "Market_Segmentation",
            "Stats_Bar_Chart_Star"
        ]
    },
    {
        "tag": "Reviews",
        "icons": [
            "Clipboard_Pencil",
            "Meeting",
            "Personal_Record",
            "Ping",
            "Star"
        ]
    },
    {
        "tag": "Rewards",
        "icons": [
            "Accreditations",
            "Star"
        ]
    },
    {
        "tag": "Ribbons",
        "icons": [
            "Accreditations",
            "Certificate"
        ]
    },
    {
        "tag": "Risks",
        "icons": [
            "Bomb",
            "Cloud",
            "Competitors",
            "Lock",
            "login",
            "Risk",
            "rooster"
        ]
    },
    {
        "tag": "Rolodex",
        "icons": [
            "Contact"
        ]
    },
    {
        "tag": "Rooster",
        "icons": [
            "rooster"
        ]
    },
    {
        "tag": "Rosters",
        "icons": [
            "Attendance_List",
            "Contact",
            "Group",
            "ID",
            "List",
            "pages",
            "Report",
            "Report2",
            "Stats_Bar_Chart_Star",
            "White_List"
        ]
    },
    {
        "tag": "Routers",
        "icons": [
            "Router"
        ]
    },
    {
        "tag": "Rows",
        "icons": [
            "Row_Zoom"
        ]
    },
    {
        "tag": "Safety",
        "icons": [
            "ducky",
            "firstaid",
            "Lock",
            "login",
            "umbrella"
        ]
    },
    {
        "tag": "Safety Issues",
        "icons": [
            "Lock",
            "login",
            "umbrella"
        ]
    },
    {
        "tag": "Salaries",
        "icons": [
            "Salary"
        ]
    },
    {
        "tag": "Salary",
        "icons": [
            "Salary"
        ]
    },
    {
        "tag": "Sales",
        "icons": [
            "Currency_Sign_Dollar2",
            "Hand_Thumbs-up",
            "moneyperson",
            "Offer",
            "Salesman"
        ]
    },
    {
        "tag": "Sales Office",
        "icons": [
            "Building",
            "Store"
        ]
    },
    {
        "tag": "Sales Orders",
        "icons": [
            "Attendance_List",
            "Contract",
            "Edit",
            "Market_Segmentation",
            "Money_Bag_Dollar",
            "moneyperson",
            "Salesman",
            "Shopping_Cart",
            "White_List"
        ]
    },
    {
        "tag": "Sales Reps",
        "icons": [
            "customers",
            "Etiquette",
            "Female",
            "Female2",
            "Group",
            "Meeting",
            "Salesman",
            "Salesman",
            "User"
        ]
    },
    {
        "tag": "Salesman",
        "icons": [
            "Salesman",
            "Sole_Proprietorship",
            "Sole_Proprietorship_Pencil"
        ]
    },
    {
        "tag": "Salespeople",
        "icons": [
            "Sole_Proprietorship_Pencil"
        ]
    },
    {
        "tag": "Salesperson",
        "icons": [
            "Salesman",
            "Sole_Proprietorship",
            "Sole_Proprietorship_Pencil"
        ]
    },
    {
        "tag": "Satellite dish",
        "icons": [
            "Satellite_Dish"
        ]
    },
    {
        "tag": "Scales",
        "icons": [
            "Justice"
        ]
    },
    {
        "tag": "Scans",
        "icons": [
            "Sku"
        ]
    },
    {
        "tag": "Schedules",
        "icons": [
            "Calendar",
            "Calendar_Month",
            "Calendar_Year",
            "Schedule",
            "schedule"
        ]
    },
    {
        "tag": "Schools",
        "icons": [
            "backpack",
            "bell",
            "College",
            "School",
            "School_Bell"
        ]
    },
    {
        "tag": "Screwdriver",
        "icons": [
            "Technical_Screwdriver"
        ]
    },
    {
        "tag": "Selection",
        "icons": [
            "dots"
        ]
    },
    {
        "tag": "Self Reviews",
        "icons": [
            "Clipboard_Pencil",
            "Edit",
            "Poetry",
            "User"
        ]
    },
    {
        "tag": "Self-Reviews",
        "icons": [
            "Clipboard_Pencil",
            "Edit",
            "Poetry",
            "User"
        ]
    },
    {
        "tag": "Seminar",
        "icons": [
            "Blackboard"
        ]
    },
    {
        "tag": "Send",
        "icons": [
            "envelope"
        ]
    },
    {
        "tag": "Servers",
        "icons": [
            "ISP",
            "ISP"
        ]
    },
    {
        "tag": "Service Items",
        "icons": [
            "bell",
            "School_Bell",
            "Technical_Hammer",
            "Technical_Screwdriver",
            "Technical_Wrench"
        ]
    },
    {
        "tag": "service reps",
        "icons": [
            "vendors"
        ]
    },
    {
        "tag": "Service Request",
        "icons": [
            "Treasure_Chest"
        ]
    },
    {
        "tag": "Service Requests",
        "icons": [
            "bell",
            "command",
            "flag",
            "Front_Desk",
            "Hand_Point",
            "phone",
            "School_Bell"
        ]
    },
    {
        "tag": "Services",
        "icons": [
            "bell",
            "School_Bell"
        ]
    },
    {
        "tag": "Session",
        "icons": [
            "Directive_Board"
        ]
    },
    {
        "tag": "Sessions",
        "icons": [
            "Spreadsheet"
        ]
    },
    {
        "tag": "Settings",
        "icons": [
            "Table_Footer_Gear",
            "Table_Header2"
        ]
    },
    {
        "tag": "Shapes",
        "icons": [
            "Objects"
        ]
    },
    {
        "tag": "Shifts",
        "icons": [
            "Clock",
            "Dispatch_Order",
            "Frames2",
            "Hourglass",
            "ID",
            "Schedule",
            "Timer"
        ]
    },
    {
        "tag": "Shipments",
        "icons": [
            "Semi_Trailer_Truck",
            "Send_Package",
            "Ship"
        ]
    },
    {
        "tag": "Shipping/Commerce",
        "icons": [
            "Engineering",
            "products",
            "Send_Package",
            "Ship",
            "Technical_Hammer",
            "Technical_Screwdriver",
            "Truck"
        ]
    },
    {
        "tag": "Shop",
        "icons": [
            "shopping-bag",
            "Shopping_Cart"
        ]
    },
    {
        "tag": "Shopping Cart",
        "icons": [
            "Shopping_Cart"
        ]
    },
    {
        "tag": "Shops",
        "icons": [
            "College",
            "Purchase"
        ]
    },
    {
        "tag": "Site",
        "icons": [
            "Dimensions"
        ]
    },
    {
        "tag": "Sites",
        "icons": [
            "Architecture",
            "Building",
            "Location",
            "Store",
            "University",
            "Warehouse"
        ]
    },
    {
        "tag": "SKU",
        "icons": [
            "Objects",
            "Purchase",
            "Sku"
        ]
    },
    {
        "tag": "SKUs",
        "icons": [
            "Sku"
        ]
    },
    {
        "tag": "SMS",
        "icons": [
            "SMS"
        ]
    },
    {
        "tag": "Smudge",
        "icons": [
            "Smudge"
        ]
    },
    {
        "tag": "Social media",
        "icons": [
            "Essay"
        ]
    },
    {
        "tag": "Social studies",
        "icons": [
            "Social_Studies"
        ]
    },
    {
        "tag": "Software",
        "icons": [
            "Bomb",
            "Bug",
            "Defective_Product",
            "Engineering",
            "Field_Image",
            "ISP",
            "Network_Monitor",
            "OSI_Model",
            "OSI_Model2",
            "Ping",
            "Product",
            "Protocol2",
            "Refresh",
            "Risk",
            "Router",
            "Satellite_Dish"
        ]
    },
    {
        "tag": "Speaker",
        "icons": [
            "Advertising"
        ]
    },
    {
        "tag": "Speaking Points",
        "icons": [
            "Spreadsheet"
        ]
    },
    {
        "tag": "Speedometer",
        "icons": [
            "speedometer"
        ]
    },
    {
        "tag": "Spikey",
        "icons": [
            "Offer"
        ]
    },
    {
        "tag": "Spreadsheet",
        "icons": [
            "Table_Footer_Gear"
        ]
    },
    {
        "tag": "Spreadsheets",
        "icons": [
            "Spreadsheet",
            "Table_Header2"
        ]
    },
    {
        "tag": "Sprint",
        "icons": [
            "Calendar",
            "Calendar_Month",
            "Calendar_Year"
        ]
    },
    {
        "tag": "Sprints",
        "icons": [
            "Schedule"
        ]
    },
    {
        "tag": "Staff",
        "icons": [
            "add-person",
            "Administrator",
            "Customer",
            "customers",
            "Etiquette",
            "Female",
            "Female2",
            "Group",
            "Nurse",
            "Salesman",
            "team",
            "teammembers",
            "User"
        ]
    },
    {
        "tag": "Stamps",
        "icons": [
            "Offer",
            "Stamp"
        ]
    },
    {
        "tag": "Star",
        "icons": [
            "Star"
        ]
    },
    {
        "tag": "States",
        "icons": [
            "Geography",
            "ISP"
        ]
    },
    {
        "tag": "Statistics",
        "icons": [
            "Stats_Pie_Chart"
        ]
    },
    {
        "tag": "Status",
        "icons": [
            "Summary_Arrow_Right",
            "Summary_Zoom"
        ]
    },
    {
        "tag": "Stock Ticker",
        "icons": [
            "Network_Monitor"
        ]
    },
    {
        "tag": "Stocks",
        "icons": [
            "Stock_Market"
        ]
    },
    {
        "tag": "Storage",
        "icons": [
            "Store",
            "Treasure_Chest",
            "Warehouse"
        ]
    },
    {
        "tag": "Store",
        "icons": [
            "Store"
        ]
    },
    {
        "tag": "Stores",
        "icons": [
            "Building",
            "College",
            "Market_Segmentation",
            "Store"
        ]
    },
    {
        "tag": "Student",
        "icons": [
            "student-girl"
        ]
    },
    {
        "tag": "Students",
        "icons": [
            "Graduate",
            "student-girl"
        ]
    },
    {
        "tag": "Success",
        "icons": [
            "Trophy"
        ]
    },
    {
        "tag": "Suitcase",
        "icons": [
            "Briefcase"
        ]
    },
    {
        "tag": "Summaries",
        "icons": [
            "List",
            "Summary_Zoom"
        ]
    },
    {
        "tag": "Summary",
        "icons": [
            "List",
            "Summary_Arrow_Right",
            "Summary_Zoom"
        ]
    },
    {
        "tag": "Suppliers",
        "icons": [
            "Etiquette",
            "Group",
            "Semi_Trailer_Truck",
            "Truck",
            "User"
        ]
    },
    {
        "tag": "Surveys",
        "icons": [
            "Clipboard"
        ]
    },
    {
        "tag": "Swim",
        "icons": [
            "Swimming"
        ]
    },
    {
        "tag": "System Variables",
        "icons": [
            "dots",
            "List",
            "Physics_Pendulum"
        ]
    },
    {
        "tag": "Tack",
        "icons": [
            "thumbtack"
        ]
    },
    {
        "tag": "Task",
        "icons": [
            "task-complete",
            "thumbtack"
        ]
    },
    {
        "tag": "Tasks",
        "icons": [
            "activity",
            "Attendance_List",
            "Briefcase",
            "Clipboard_Pencil",
            "estimates",
            "pages",
            "Task",
            "task-complete",
            "tasks",
            "thumbtack"
        ]
    },
    {
        "tag": "Taxes",
        "icons": [
            "Tax"
        ]
    },
    {
        "tag": "Team",
        "icons": [
            "customers",
            "team"
        ]
    },
    {
        "tag": "Team members",
        "icons": [
            "Group",
            "Swimming",
            "teammembers",
            "User"
        ]
    },
    {
        "tag": "Teams",
        "icons": [
            "Achievement",
            "Directive_Board",
            "Group",
            "team",
            "teammembers"
        ]
    },
    {
        "tag": "Technician",
        "icons": [
            "Nurse"
        ]
    },
    {
        "tag": "Technology",
        "icons": [
            "ISP",
            "Videocamera"
        ]
    },
    {
        "tag": "Telephone Numbers",
        "icons": [
            "Cellphone",
            "phone",
            "Phone_Book"
        ]
    },
    {
        "tag": "Temperature",
        "icons": [
            "speedometer"
        ]
    },
    {
        "tag": "Templates",
        "icons": [
            "Copy",
            "Copy2",
            "Table_Footer_Gear",
            "Table_Header2",
            "templatedprojects"
        ]
    },
    {
        "tag": "Tenants",
        "icons": [
            "customers",
            "Female",
            "Female2",
            "Group",
            "Key",
            "User"
        ]
    },
    {
        "tag": "Tests",
        "icons": [
            "Attendance_List",
            "Edit",
            "List",
            "Network_Monitor",
            "Task"
        ]
    },
    {
        "tag": "Theater",
        "icons": [
            "Campus"
        ]
    },
    {
        "tag": "Third-party",
        "icons": [
            "Social_Studies"
        ]
    },
    {
        "tag": "Thumbtack",
        "icons": [
            "thumbtack"
        ]
    },
    {
        "tag": "Tickets",
        "icons": [
            "Bug",
            "Check2",
            "Hand_Point",
            "pricetag"
        ]
    },
    {
        "tag": "Time",
        "icons": [
            "Calendar",
            "Calendar_Month",
            "Calendar_Year",
            "Clock",
            "Hourglass",
            "Schedule",
            "schedule",
            "Timer"
        ]
    },
    {
        "tag": "Time Card",
        "icons": [
            "ID"
        ]
    },
    {
        "tag": "Time Cards",
        "icons": [
            "Attendance_List",
            "Clipboard_Pencil",
            "Clock",
            "Hourglass",
            "ID",
            "Timer"
        ]
    },
    {
        "tag": "Time Off",
        "icons": [
            "Hourglass"
        ]
    },
    {
        "tag": "Time Sheets",
        "icons": [
            "Attendance_List",
            "Clipboard_Pencil",
            "Clock",
            "Hourglass",
            "ID",
            "Timer"
        ]
    },
    {
        "tag": "time tracking",
        "icons": [
            "Schedule"
        ]
    },
    {
        "tag": "Timecards",
        "icons": [
            "Attendance_List",
            "Clock",
            "Hourglass",
            "schedule"
        ]
    },
    {
        "tag": "Timer",
        "icons": [
            "Audio_Knob"
        ]
    },
    {
        "tag": "Times",
        "icons": [
            "Physics_Pendulum",
            "Treasure_Chest"
        ]
    },
    {
        "tag": "Timesheets",
        "icons": [
            "Attendance_List",
            "Clock",
            "Hourglass",
            "ID"
        ]
    },
    {
        "tag": "To-dos",
        "icons": [
            "estimates",
            "projects",
            "schedule",
            "tasks",
            "tasks",
            "templatedprojects",
            "Whistle"
        ]
    },
    {
        "tag": "Toast",
        "icons": [
            "Champagne"
        ]
    },
    {
        "tag": "Todo List",
        "icons": [
            "Attendance_List",
            "estimates",
            "thumbtack",
            "Whistle"
        ]
    },
    {
        "tag": "Toolbox",
        "icons": [
            "Treasure_Chest"
        ]
    },
    {
        "tag": "Tools",
        "icons": [
            "Advertising",
            "Audio_Knob",
            "bell",
            "bicycle",
            "Fountain_Pen",
            "Front_Desk",
            "Key",
            "Laws",
            "Marker",
            "Poetry",
            "School_Bell",
            "SMS",
            "Stamp",
            "Technical_Hammer",
            "Technical_Hammer",
            "Technical_Screwdriver",
            "Technical_Screwdriver",
            "Technical_Wrench",
            "Treasure_Chest",
            "Videocamera",
            "Whistle",
            "Whistle"
        ]
    },
    {
        "tag": "Transactions",
        "icons": [
            "Bank_Transaction",
            "Currency_Sign_Dollar2",
            "lineitems",
            "Row_Zoom"
        ]
    },
    {
        "tag": "Transfers",
        "icons": [
            "Upload",
            "Upload2",
            "Wire_Transfer"
        ]
    },
    {
        "tag": "Transition",
        "icons": [
            "Protocol2"
        ]
    },
    {
        "tag": "Transport",
        "icons": [
            "bicycle",
            "Truck"
        ]
    },
    {
        "tag": "Trends",
        "icons": [
            "Animation",
            "Economics",
            "reports",
            "Stock_Market"
        ]
    },
    {
        "tag": "Trials",
        "icons": [
            "Justice"
        ]
    },
    {
        "tag": "Trophy",
        "icons": [
            "Achievement",
            "Trophy"
        ]
    },
    {
        "tag": "Truck",
        "icons": [
            "Semi_Trailer_Truck",
            "Truck"
        ]
    },
    {
        "tag": "Trucking companies",
        "icons": [
            "Semi_Trailer_Truck"
        ]
    },
    {
        "tag": "Trucking company",
        "icons": [
            "Semi_Trailer_Truck"
        ]
    },
    {
        "tag": "trumpet",
        "icons": [
            "trumpet"
        ]
    },
    {
        "tag": "Umbrella",
        "icons": [
            "umbrella"
        ]
    },
    {
        "tag": "Undergraduates",
        "icons": [
            "Graduate"
        ]
    },
    {
        "tag": "Units",
        "icons": [
            "Copy",
            "Copy2",
            "Engineering",
            "Objects",
            "OSI_Model",
            "Timer"
        ]
    },
    {
        "tag": "Universities",
        "icons": [
            "School"
        ]
    },
    {
        "tag": "University",
        "icons": [
            "School"
        ]
    },
    {
        "tag": "Update",
        "icons": [
            "Refresh"
        ]
    },
    {
        "tag": "Updates",
        "icons": [
            "Refresh"
        ]
    },
    {
        "tag": "Uploads",
        "icons": [
            "Upload",
            "Upload2"
        ]
    },
    {
        "tag": "User",
        "icons": [
            "Smudge"
        ]
    },
    {
        "tag": "User Access",
        "icons": [
            "Administrator",
            "customers",
            "Etiquette",
            "Female",
            "Female2",
            "Group",
            "Lock",
            "login",
            "User"
        ]
    },
    {
        "tag": "User Profiles",
        "icons": [
            "Administrator",
            "Anonymous",
            "Etiquette",
            "Female",
            "Female2",
            "Group",
            "teammembers",
            "User"
        ]
    },
    {
        "tag": "Users",
        "icons": [
            "Administrator",
            "Customer",
            "customers",
            "Etiquette",
            "Female",
            "Female2",
            "Smudge",
            "teammembers",
            "teammembers"
        ]
    },
    {
        "tag": "Utilities",
        "icons": [
            "Satellite_Dish"
        ]
    },
    {
        "tag": "Vacation Time",
        "icons": [
            "Hourglass"
        ]
    },
    {
        "tag": "Valuables",
        "icons": [
            "Treasure_Chest"
        ]
    },
    {
        "tag": "Vehicles",
        "icons": [
            "Truck"
        ]
    },
    {
        "tag": "Vendor",
        "icons": [
            "Directive_Board",
            "team",
            "User"
        ]
    },
    {
        "tag": "Vendors",
        "icons": [
            "Sole_Proprietorship",
            "Sole_Proprietorship_Pencil",
            "team",
            "vendors"
        ]
    },
    {
        "tag": "Venues",
        "icons": [
            "Campus",
            "Classroom",
            "flag",
            "School"
        ]
    },
    {
        "tag": "Versions",
        "icons": [
            "Objects",
            "Refresh"
        ]
    },
    {
        "tag": "Videocamera",
        "icons": [
            "video",
            "Videocamera"
        ]
    },
    {
        "tag": "Videos",
        "icons": [
            "film",
            "Videocamera"
        ]
    },
    {
        "tag": "Views",
        "icons": [
            "eyeball",
            "Row_Zoom"
        ]
    },
    {
        "tag": "Vision",
        "icons": [
            "eyeball"
        ]
    },
    {
        "tag": "Volunteers",
        "icons": [
            "customers",
            "Directive_Board",
            "Etiquette",
            "Female",
            "Female2",
            "Group",
            "teammembers"
        ]
    },
    {
        "tag": "Wards",
        "icons": [
            "Geography"
        ]
    },
    {
        "tag": "Warehouses",
        "icons": [
            "Semi_Trailer_Truck",
            "Warehouse"
        ]
    },
    {
        "tag": "Warnings",
        "icons": [
            "Risk"
        ]
    },
    {
        "tag": "Weather",
        "icons": [
            "Cloud"
        ]
    },
    {
        "tag": "Wedding",
        "icons": [
            "Champagne"
        ]
    },
    {
        "tag": "Weekly",
        "icons": [
            "Inventory"
        ]
    },
    {
        "tag": "Weight",
        "icons": [
            "lift"
        ]
    },
    {
        "tag": "Whistle",
        "icons": [
            "Whistle"
        ]
    },
    {
        "tag": "Whiteboard",
        "icons": [
            "Whiteboard"
        ]
    },
    {
        "tag": "Wire Transfers",
        "icons": [
            "Wire_Transfer"
        ]
    },
    {
        "tag": "Withdrawals",
        "icons": [
            "Stamp"
        ]
    },
    {
        "tag": "Work Order",
        "icons": [
            "School_Bell"
        ]
    },
    {
        "tag": "Work Orders",
        "icons": [
            "Acquisition_Clock",
            "bell",
            "Clipboard_Pencil",
            "School",
            "School_Bell",
            "Technical_Hammer",
            "Technical_Screwdriver"
        ]
    },
    {
        "tag": "Workers",
        "icons": [
            "ID"
        ]
    },
    {
        "tag": "Workgroup",
        "icons": [
            "Classroom"
        ]
    },
    {
        "tag": "Workplace",
        "icons": [
            "Company"
        ]
    },
    {
        "tag": "World",
        "icons": [
            "Social_Studies"
        ]
    },
    {
        "tag": "Wrench",
        "icons": [
            "Technical_Wrench"
        ]
    },
    {
        "tag": "Writing",
        "icons": [
            "Poetry"
        ]
    },
    {
        "tag": "Zoom",
        "icons": [
            "Row_Zoom"
        ]
    }
];


