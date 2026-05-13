export interface EmployeeSeedData {
  email: string
  department: string
  position: string
  isActive: boolean
}

export const EMPLOYEES: EmployeeSeedData[] = [
  // ─── Human Resources ───
  {
    email: "jane.wanjiku@kenyaairways.co.ke",
    department: "Human Resources",
    position: "HR Manager",
    isActive: true,
  },
  {
    email: "peter.mwangi@kenyaairways.co.ke",
    department: "Human Resources",
    position: "Recruitment Officer",
    isActive: true,
  },

  // ─── IT Department ───
  {
    email: "tom.ochieng@kenyaairways.co.ke",
    department: "IT",
    position: "Systems Administrator",
    isActive: true,
  },
  {
    email: "sarah.njeri@kenyaairways.co.ke",
    department: "IT",
    position: "Software Developer",
    isActive: true,
  },

  // ─── Flight Operations ───
  {
    email: "james.kiprotich@kenyaairways.co.ke",
    department: "Flight Operations",
    position: "Chief Pilot",
    isActive: true,
  },
  {
    email: "david.ochieng@kenyaairways.co.ke",
    department: "Flight Operations",
    position: "First Officer",
    isActive: true,
  },

  // ─── Cabin Crew ───
  {
    email: "faith.wanjiku@kenyaairways.co.ke",
    department: "Cabin Crew",
    position: "Senior Flight Attendant",
    isActive: true,
  },
  {
    email: "grace.akinyi@kenyaairways.co.ke",
    department: "Cabin Crew",
    position: "Flight Attendant",
    isActive: true,
  },
  {
    email: "amina.hassan@kenyaairways.co.ke",
    department: "Cabin Crew",
    position: "Flight Attendant",
    isActive: true,
  },

  // ─── Ground Staff ───
  {
    email: "michael.kamau@kenyaairways.co.ke",
    department: "Ground Staff",
    position: "Ground Operations Manager",
    isActive: true,
  },
  {
    email: "joseph.mushi@kenyaairways.co.ke",
    department: "Ground Staff",
    position: "Check-in Agent",
    isActive: true,
  },

  // ─── Finance ───
  {
    email: "rehema.mwakasege@kenyaairways.co.ke",
    department: "Finance",
    position: "Finance Manager",
    isActive: true,
  },
  {
    email: "samuel.okello@kenyaairways.co.ke",
    department: "Finance",
    position: "Accountant",
    isActive: true,
  },

  // ─── Marketing ───
  {
    email: "margaret.nakato@kenyaairways.co.ke",
    department: "Marketing",
    position: "Marketing Director",
    isActive: true,
  },
  {
    email: "william.thompson@kenyaairways.co.ke",
    department: "Marketing",
    position: "Brand Manager",
    isActive: true,
  },

  // ─── Engineering ───
  {
    email: "robert.anderson@kenyaairways.co.ke",
    department: "Engineering",
    position: "Chief Engineer",
    isActive: true,
  },
  {
    email: "thabo.mbeki@kenyaairways.co.ke",
    department: "Engineering",
    position: "Aircraft Mechanic",
    isActive: true,
  },

  // ─── Customer Service ───
  {
    email: "jennifer.martinez@kenyaairways.co.ke",
    department: "Customer Service",
    position: "Customer Service Manager",
    isActive: true,
  },
  {
    email: "lerato.khumalo@kenyaairways.co.ke",
    department: "Customer Service",
    position: "Call Center Agent",
    isActive: true,
  },

  // ─── Inactive / Former Employees ───
  {
    email: "rajesh.patel@kenyaairways.co.ke",
    department: "IT",
    position: "Junior Developer",
    isActive: false,
  },
  {
    email: "priya.sharma@kenyaairways.co.ke",
    department: "Cabin Crew",
    position: "Trainee Flight Attendant",
    isActive: false,
  },
]
