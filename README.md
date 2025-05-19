🍴 Global Recipe Finder
A deliciously simple way to explore international recipes!
Global Recipe Finder is a responsive, accessible, and SEO-optimized static web application built with Next.js. It lets food lovers search for recipes worldwide using keywords like ingredients, cuisines, or dish names. Powered by TheMealDB API for recipe data and Groq API for AI-enhanced semantic search, this app delivers a fast and delightful experience.
🌍 Craving sushi, curry, or tacos? Find your next culinary adventure with ease!
✨ Features

AI-Powered Search 🧠Use natural language queries like "vegan Italian pasta" or "quick desserts with berries" thanks to the Groq API.

Static Site Generation (SSG) ⚡Pre-rendered pages with Next.js for lightning-fast performance and SEO.

Responsive Design 📱Mobile-first UI built with Tailwind CSS and shadcn/ui components for a seamless experience on any device.

Accessibility ♿Semantic HTML, ARIA attributes, and keyboard navigation ensure inclusivity.

SEO Optimized 🔍Dynamic meta tags, JSON-LD structured data, and optimized images for better search rankings.

Rich Recipe Pages 🍽️Detailed views with ingredients, step-by-step instructions, and vibrant images.


🛠️ Tech Stack

Framework: Next.js (App Router, SSG mode)  
Styling: Tailwind CSS + shadcn/ui  
APIs:  
TheMealDB for recipes  
Groq API for semantic search


Language: TypeScript  
Deployment: Vercel  
Tools: ESLint, Prettier, Husky

🚀 Getting Started
Get the app running locally in just a few steps!
Prerequisites

Node.js 18.x or later  
npm or yarn  
A Groq API key

Installation

Clone the Repository  
git clone https://github.com/yourusername/global-recipe-finder.git
cd global-recipe-finder


Install Dependencies  
npm install
# or
yarn install


Set Up Environment VariablesCreate a .env.local file in the root and add:  
GROQ_API_KEY=your_groq_api_key_here


Run the Development Server  
npm run dev
# or
yarn dev


Open the AppVisit http://localhost:3000 to start exploring recipes!


Production Build
To generate a static site:  
npm run build
# or
yarn build

Output will be in the out directory, ready for deployment.
🌐 Deploy to Vercel
Deploying to Vercel is a breeze:

Push your code to a Git repository (GitHub, GitLab, Bitbucket).  
Import the project in Vercel.  
Add the GROQ_API_KEY environment variable in Vercel settings.  
Deploy and share your app with the world! 🎉

See Vercel Docs for more details.
📂 Project Structure
global-recipe-finder/
├── app/                     # Next.js App Router
│   ├── layout.tsx           # Global layout and metadata
│   ├── page.tsx             # Homepage with search
│   ├── search/              # Search results page
│   ├── recipe/[id]/         # Recipe detail pages
│   └── not-found.tsx        # Custom 404 page
├── components/              # Reusable React components
├── lib/                     # API utilities and helpers
├── public/                  # Static assets (images, fonts)
├── styles/                  # Tailwind and global CSS
├── types/                   # TypeScript types
├── .env.local               # Environment variables
├── next.config.js           # Next.js config
├── tsconfig.json            # TypeScript config
└── README.md                # Project docs

🧪 Testing
Run unit tests with Jest and React Testing Library:  
npm run test
# or
yarn test

🤝 Contributing
We’d love your help to make this project even tastier! To contribute:

Fork the repo.  
Create a branch: git checkout -b feature/your-feature.  
Commit changes: git commit -m "Add your feature".  
Push: git push origin feature/your-feature.  
Open a Pull Request.

See our Contributing Guide and Code of Conduct.
📜 License
Licensed under the MIT License. Use, modify, and share freely!
🙌 Acknowledgments

TheMealDB for their amazing recipe API.  
xAI for the Groq API.  
Open-source heroes behind Next.js, Tailwind CSS, and shadcn/ui.


🍽️ Ready to cook up something amazing? Star this repo, dive in, and let’s make global cuisines accessible to all! 😋  
Have questions? Open an issue or reach out.
