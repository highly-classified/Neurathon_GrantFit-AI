GrantFit AI

AI-powered grant matching platform with intelligent pitch practice and application readiness features for researchers and early-stage startup founders.

GrantFit AI revolutionizes grant discovery by combining smart eligibility matching with interactive pitch practice, helping users not only find the right grants but also prepare winning applications.
🎯 Problem Statement

Finding the right grants is time-consuming and error-prone.

Researchers and founders often:

    Waste effort applying to grants they're ineligible for
    Miss opportunities due to information overload
    Submit unprepared applications without practice or feedback
    Struggle to articulate their ideas effectively to funders

GrantFit AI solves this by combining intelligent grant matching with AI-powered pitch practice and readiness assessment to maximize application success rates.
✨ Key Features
🔍 Intelligent Grant Matching

Two-Layer Filtering System:

    Hard Eligibility Filter
        Binary criteria enforcement (citizenship, age, role, organization type)
        Instant disqualification of incompatible grants
    AI Preference Matching
        Analyzes historical grant data (funded profiles, rejections, winning topics)
        Scores alignment between user profile and funder preferences
        Surfaces hidden compatibility patterns

🎤 AI-Powered Pitch Practice (Our Novelty)

    Interactive Pitch Sessions
        Practice your grant pitch with AI feedback
        Real-time evaluation of clarity, persuasiveness, and alignment
    Application Readiness Assessment
        AI analyzes your pitch and profile completeness
        Identifies gaps in your application strategy
        Provides actionable improvement suggestions
    Iterative Refinement
        Practice multiple times to improve scores
        Track readiness progress over time

📊 Smart Dashboard

    Three-Tier Categorization:
        ✅ Eligible – Full compatibility
        ⚠️ May Be Eligible – Partial match (review required)
        ❌ Ineligible – Apply option disabled
    Deadline-Sorted Views
    Visual Eligibility Indicators
    Search & Advanced Filtering

👤 Structured User Profiles

Users create comprehensive profiles including:

    Research domain / startup sector
    Funding requirements
    Role (researcher/founder)
    Demographics (age, gender, citizenship)
    Organization details

📝 Grant Management

    View detailed grant information
    Access organizer contacts
    Apply directly through platform
    Track applications in registered grants dashboard

🛠 Tech Stack
Layer	Technologies
Frontend	React 19, Vite, Tailwind CSS
Animation	Framer Motion
Icons	Lucide React
Routing	React Router DOM
Backend	Firebase (Auth, Firestore, Hosting)
AI/ML	LLM-based matching & pitch analysis
🚀 Getting Started
Prerequisites

    Node.js v18+ (Download)
    npm or yarn
    Git

Installation
bash

# Clone the repository
git clone https://github.com/highly-classified/neurathon.git

# Navigate to project directory
cd neurathon

# Install dependencies
npm install

# Start development server
npm run dev

The application will launch at http://localhost:5173
Build for Production
bash

npm run build
```

---

## 📁 Project Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── dashboard/       # Dashboard components
│   │   ├── pitch/           # Pitch practice components
│   │   └── ...
│   ├── pages/               # Route pages
│   ├── services/            # API & Firebase services
│   ├── utils/               # Helper functions
│   ├── App.jsx              # Root component
│   └── main.jsx             # Entry point
├── public/                  # Static assets
└── package.json

🧠 How It Works
Eligibility Logic

Hard Filters (Binary Pass/Fail)

    Citizenship requirements
    Age restrictions
    Role constraints (academic vs. commercial)
    Organization type eligibility

AI Preference Matching (Soft Scoring)

    Topic similarity analysis
    Historical awardee profile alignment
    Funder preference pattern detection
    Success probability modeling

Pitch Practice & Readiness

AI-Powered Assessment

    Evaluates pitch clarity and structure
    Checks alignment with grant objectives
    Scores application readiness
    Provides personalized improvement feedback

User Flow

    Onboarding → User submits idea and completes profile
    Matching → AI analyzes profile against grant database
    Categorization → Grants sorted into Eligible/Maybe/Ineligible tiers
    Practice → User practices pitch with AI feedback (Novel Feature)
    Readiness Check → AI assesses application preparedness (Novel Feature)
    Application → User applies to top-matched grants
    Tracking → Monitor application status in dashboard

👥 Target Users

    🎓 Academic researchers
    📚 Graduate research scholars
    🚀 Early-stage startup founders
    🏢 Innovation-focused organizations

🗺 Roadmap

    Enhanced AI pitch feedback with speech recognition
    Grant success probability scoring dashboard
    Collaborative team features for joint applications
    Admin panel for grant providers
    Integration with grant submission APIs
    Export application materials in standard formats

🤝 Contributing

We welcome contributions! Here's how to get started:

    Fork the repository
    Create a feature branch (git checkout -b feature/AmazingFeature)
    Commit your changes (git commit -m 'Add AmazingFeature')
    Push to the branch (git push origin feature/AmazingFeature)
    Open a Pull Request

Development Guidelines

    Follow existing code style (Prettier/ESLint configs)
    Write meaningful commit messages
    Add tests for new features
    Update documentation as needed

📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
📧 Contact & Support

    Repository: github.com/highly-classified/neurathon
    Issues: Report a bug
    Discussions: Feature requests

🌟 Acknowledgments

Built with ❤️ for the research and startup communities.

Special thanks to all contributors and early adopters helping shape the future of grant discovery and application preparation.

Powered by AI to help innovators find grants, practice pitches, and secure funding faster. 
