export interface AirportSeedData {
  code: string
  name: string
  city: string
  country: string
}

export const AIRPORTS: AirportSeedData[] = [
  // ─── East Africa (KQ's home market) ───
  { code: "NBO", name: "Jomo Kenyatta International Airport", city: "Nairobi", country: "Kenya" },
  { code: "MBA", name: "Moi International Airport", city: "Mombasa", country: "Kenya" },
  { code: "KIS", name: "Kisumu International Airport", city: "Kisumu", country: "Kenya" },
  { code: "EDL", name: "Eldoret International Airport", city: "Eldoret", country: "Kenya" },
  { code: "DAR", name: "Julius Nyerere International Airport", city: "Dar es Salaam", country: "Tanzania" },
  { code: "ZNZ", name: "Abeid Amani Karume International Airport", city: "Zanzibar", country: "Tanzania" },
  { code: "EBB", name: "Entebbe International Airport", city: "Entebbe", country: "Uganda" },
  { code: "KGL", name: "Kigali International Airport", city: "Kigali", country: "Rwanda" },
  { code: "ADD", name: "Bole International Airport", city: "Addis Ababa", country: "Ethiopia" },
  { code: "JUB", name: "Juba International Airport", city: "Juba", country: "South Sudan" },

  // ─── Africa ───
  { code: "CPT", name: "Cape Town International Airport", city: "Cape Town", country: "South Africa" },
  { code: "JNB", name: "O.R. Tambo International Airport", city: "Johannesburg", country: "South Africa" },
  { code: "LOS", name: "Murtala Muhammed International Airport", city: "Lagos", country: "Nigeria" },
  { code: "ACC", name: "Kotoka International Airport", city: "Accra", country: "Ghana" },
  { code: "CAI", name: "Cairo International Airport", city: "Cairo", country: "Egypt" },
  { code: "CMN", name: "Mohammed V International Airport", city: "Casablanca", country: "Morocco" },
  { code: "DKR", name: "Blaise Diagne International Airport", city: "Dakar", country: "Senegal" },

  // ─── Europe ───
  { code: "LHR", name: "Heathrow Airport", city: "London", country: "United Kingdom" },
  { code: "CDG", name: "Charles de Gaulle Airport", city: "Paris", country: "France" },
  { code: "AMS", name: "Schiphol Airport", city: "Amsterdam", country: "Netherlands" },
  { code: "FRA", name: "Frankfurt Airport", city: "Frankfurt", country: "Germany" },
  { code: "IST", name: "Istanbul Airport", city: "Istanbul", country: "Turkey" },
  { code: "MAD", name: "Adolfo Suárez Madrid–Barajas Airport", city: "Madrid", country: "Spain" },
  { code: "FCO", name: "Leonardo da Vinci–Fiumicino Airport", city: "Rome", country: "Italy" },
  { code: "DUB", name: "Dublin Airport", city: "Dublin", country: "Ireland" },
  { code: "ZRH", name: "Zurich Airport", city: "Zurich", country: "Switzerland" },
  { code: "VIE", name: "Vienna International Airport", city: "Vienna", country: "Austria" },
  { code: "CPH", name: "Copenhagen Airport", city: "Copenhagen", country: "Denmark" },
  { code: "OSL", name: "Oslo Airport", city: "Oslo", country: "Norway" },
  { code: "HEL", name: "Helsinki Airport", city: "Helsinki", country: "Finland" },
  { code: "STO", name: "Stockholm Arlanda Airport", city: "Stockholm", country: "Sweden" },

  // ─── Middle East ───
  { code: "DXB", name: "Dubai International Airport", city: "Dubai", country: "United Arab Emirates" },
  { code: "DOH", name: "Hamad International Airport", city: "Doha", country: "Qatar" },
  { code: "JED", name: "King Abdulaziz International Airport", city: "Jeddah", country: "Saudi Arabia" },

  // ─── Asia ───
  { code: "BOM", name: "Chhatrapati Shivaji International Airport", city: "Mumbai", country: "India" },
  { code: "BKK", name: "Suvarnabhumi Airport", city: "Bangkok", country: "Thailand" },
  { code: "SIN", name: "Changi Airport", city: "Singapore", country: "Singapore" },
  { code: "PEK", name: "Beijing Capital International Airport", city: "Beijing", country: "China" },

  // ─── North America ───
  { code: "JFK", name: "John F. Kennedy International Airport", city: "New York", country: "United States" },
  { code: "YYZ", name: "Toronto Pearson International Airport", city: "Toronto", country: "Canada" },
]
