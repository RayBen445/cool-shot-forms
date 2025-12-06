# Cool Shot Forms

A Google Forms clone built with Next.js 15 (App Router), featuring a drag-and-drop form builder and real-time form viewer.

## Features

- 🎨 **Form Builder**: Create forms with an intuitive drag-and-drop interface
- 📝 **Multiple Question Types**: Text, email, number, textarea, checkbox, radio, and dropdown
- 🔄 **Drag & Drop Reordering**: Easily reorder questions using @dnd-kit
- 💾 **MongoDB Backend**: Persistent storage for forms and responses
- 🎯 **Required Fields**: Mark questions as required
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Next.js 15**: Built with the latest Next.js App Router

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Font**: Roboto Slab for headings
- **Icons**: Lucide React
- **Database**: MongoDB with Mongoose
- **Drag & Drop**: @dnd-kit/core and @dnd-kit/sortable

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/RayBen445/cool-shot-forms.git
cd cool-shot-forms
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
MONGODB_URI=mongodb://localhost:27017/cool-shot-forms
```

For MongoDB Atlas, use:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cool-shot-forms?retryWrites=true&w=majority
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/RayBen445/cool-shot-forms)

### Manual Deployment

1. Push your code to GitHub

2. Go to [Vercel](https://vercel.com) and sign in

3. Click "Add New" → "Project"

4. Import your GitHub repository

5. Configure environment variables:
   - Add `MONGODB_URI` with your MongoDB connection string

6. Click "Deploy"

### Setting up MongoDB for Production

**Option 1: MongoDB Atlas (Recommended)**

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user with read/write permissions
4. Get your connection string from the "Connect" button
5. Add it as `MONGODB_URI` in Vercel's environment variables

**Option 2: Self-hosted MongoDB**

If you're using a self-hosted MongoDB, ensure it's accessible from the internet and add the connection string to Vercel's environment variables.

## Project Structure

```
cool-shot-forms/
├── app/
│   ├── api/
│   │   ├── forms/           # Form CRUD endpoints
│   │   │   ├── [id]/
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   └── responses/       # Response submission endpoint
│   │       └── route.ts
│   ├── builder/             # Form builder page
│   │   └── page.tsx
│   ├── view/                # Form viewer
│   │   └── [id]/
│   │       └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── FormBuilder.tsx      # Drag-and-drop form builder
├── lib/
│   └── db.ts               # MongoDB connection
├── models/
│   ├── Form.ts             # Form schema
│   └── Response.ts         # Response schema
└── public/
```

## Usage

### Creating a Form

1. Go to the home page and click "Create Form"
2. Enter a form title
3. Click "Add Question" to add questions
4. Configure each question:
   - Enter the question text
   - Select question type
   - Mark as required (optional)
   - For radio/checkbox/select, add options
5. Drag questions to reorder them
6. Click "Save Form"
7. Copy the view URL to share your form

### Viewing and Filling a Form

1. Navigate to `/view/[form-id]` or use the link from the builder
2. Fill in the form
3. Click "Submit" to save your response

## API Endpoints

### Forms

- `POST /api/forms` - Create a new form
- `GET /api/forms/[id]` - Get a form by ID
- `PUT /api/forms/[id]` - Update a form

### Responses

- `POST /api/responses` - Submit a form response

## Development

### Build for Production

```bash
npm run build
```

### Run Production Build Locally

```bash
npm run start
```

### Lint

```bash
npm run lint
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- Drag and drop by [@dnd-kit](https://dndkit.com/)