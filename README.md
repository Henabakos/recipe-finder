# Global Recipe Finder

A responsive, accessible static web application built with Next.js that allows users to search for international recipes using keywords like ingredients, cuisine, or dish name. The app uses TheMealDB public API to fetch recipe data and integrates Groq API for AI-enhanced semantic search.

## Features

- **AI-Powered Search**: Natural language processing for recipe search queries
- **Static Site Generation**: Pre-rendered pages for optimal performance
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: ARIA attributes and semantic HTML
- **SEO Optimized**: Meta tags, structured data, and optimized images

## Tech Stack

- **Framework**: Next.js (App Router, SSG mode)
- **Styling**: Tailwind CSS with shadcn/ui components
- **APIs**: 
  - TheMealDB for recipe data
  - Groq API for semantic search
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/global-recipe-finder.git
   cd global-recipe-finder
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Create a `.env.local` file in the root directory with your Groq API key:
   \`\`\`
   GROQ_API_KEY=your_groq_api_key_here
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

To build the application for production:

\`\`\`bash
npm run build
# or
yarn build
\`\`\`

This will generate a static export of the application in the `out` directory.

## Deployment to Vercel

The easiest way to deploy the application is to use the [Vercel Platform](https://vercel.com).

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).
2. Import the project to Vercel.
3. Add the `GROQ_API_KEY` environment variable in the Vercel project settings.
4. Deploy!

## Project Structure

\`\`\`
global-recipe-finder/
├── app/                  # Next.js App Router
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Homepage
│   ├── search/           # Search results page
│   ├── recipe/[id]/      # Recipe detail page
│   └── not-found.tsx     # 404 page
├── components/           # React components
├── lib/                  # Utility functions and API integration
├── public/               # Static assets
└── README.md             # Project documentation
\`\`\`

## License

This project is licensed under the MIT License.
