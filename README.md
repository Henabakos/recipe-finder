# 🍴 Global Recipe Finder

**A deliciously simple way to explore international recipes!**

Global Recipe Finder is a **responsive**, **accessible**, and **SEO-optimized** static web application built with **Next.js**. It lets food lovers search for recipes worldwide using keywords like ingredients, cuisines, or dish names.

Powered by **TheMealDB API** for recipe data and **Groq API** for AI-enhanced semantic search, this app delivers a fast and delightful experience.

🌍 *Craving sushi, curry, or tacos? Find your next culinary adventure with ease!*

---

## ✨ Features

- **🧠 AI-Powered Search**  
  Use natural language queries like `"vegan Italian pasta"` or `"quick desserts with berries"` thanks to the **Groq API**.

- **⚡ Static Site Generation (SSG)**  
  Pre-rendered pages using Next.js App Router for lightning-fast performance and SEO.

- **📱 Responsive Design**  
  Mobile-first UI built with **Tailwind CSS** and **shadcn/ui** for a seamless experience across all devices.

- **♿ Accessibility**  
  Semantic HTML, ARIA attributes, and full keyboard navigation for inclusivity.

- **🔍 SEO Optimized**  
  Dynamic meta tags, JSON-LD structured data, and optimized images for better rankings.

- **🍽️ Rich Recipe Pages**  
  Detailed recipe views with ingredients, instructions, and vibrant imagery.

---

## 🛠️ Tech Stack

| Category     | Tech                                                  |
|--------------|-------------------------------------------------------|
| **Framework**| [Next.js](https://nextjs.org/) (App Router, SSG mode) |
| **Styling**  | [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) |
| **APIs**     | [TheMealDB](https://www.themealdb.com/api.php), [Groq API](https://console.groq.com/) |
| **Language** | TypeScript                                            |
| **Deployment** | [Vercel](https://vercel.com/)                      |
| **Tools**    | ESLint, Prettier, Husky                               |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later  
- npm or yarn  
- A Groq API Key

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Henabakos/recipe-finder.git
   cd recipe-finder

npm install
# or
yarn install

Set Up Environment Variables

Create a .env.local file in the root directory:
```
GROQ_API_KEY=your_groq_api_key_here

```
Run the Development Server
```
npm run dev
# or
yarn dev

```

Visit http://localhost:3000 to explore recipes!

##📂 Project Structure

```
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

```
##📜 License

Licensed under the MIT License — use, modify, and share freely!

##🙌 Acknowledgments

    TheMealDB for their amazing recipe API
    Groq API
    Open-source heroes behind Next.js, Tailwind CSS, and shadcn/ui




