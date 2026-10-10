/**
 * UniPath Synthetic Demonstration Data
 * All sample programmes, units, and student personas are clearly identified
 * as demonstration records for educational discovery and testing.
 */

import {
  University,
  Career,
  GradingScale,
  BrainMatePeerMatch,
  CommunityResource,
  AcademicComparisonCohort,
} from '../types';

export const GRADING_SCALES: Record<string, GradingScale> = {
  percentage: {
    id: 'percentage',
    name: 'Standard University Percentage Scale (East Africa / UK Style)',
    description: 'A: 70-100% (First Class), B: 60-69% (Second Upper), C: 50-59% (Second Lower), D: 40-49% (Pass), E: 0-39% (Fail)',
    min: 0,
    max: 100,
    step: 1,
    passThreshold: 40,
    gradeBands: [
      { grade: 'A', label: 'First Class Honours', min: 70, max: 100 },
      { grade: 'B', label: 'Second Class Upper Division', min: 60, max: 69 },
      { grade: 'C', label: 'Second Class Lower Division', min: 50, max: 59 },
      { grade: 'D', label: 'Pass', min: 40, max: 49 },
      { grade: 'E', label: 'Fail / Retake Required', min: 0, max: 39 },
    ],
  },
  gpa4: {
    id: 'gpa4',
    name: '4.0 Grade Point Average Scale (US Style)',
    description: '4.0 (A), 3.7 (A-), 3.3 (B+), 3.0 (B), 2.7 (B-), 2.0 (C), 1.0 (D), 0.0 (F)',
    min: 0.0,
    max: 4.0,
    step: 0.1,
    passThreshold: 2.0,
    gradeBands: [
      { grade: 'A', label: 'Excellent (3.7 - 4.0)', min: 3.7, max: 4.0 },
      { grade: 'B', label: 'Good (3.0 - 3.6)', min: 3.0, max: 3.6 },
      { grade: 'C', label: 'Satisfactory (2.0 - 2.9)', min: 2.0, max: 2.9 },
      { grade: 'D', label: 'Minimum Passing (1.0 - 1.9)', min: 1.0, max: 1.9 },
      { grade: 'F', label: 'Failing (0.0 - 0.9)', min: 0.0, max: 0.9 },
    ],
  },
};

export const UNIVERSITIES: University[] = [
  {
    id: 'maseno',
    name: 'Maseno University',
    shortName: 'MSU',
    country: 'Kenya',
    city: 'Kisumu / Maseno',
    isDemo: true,
    status: 'partner',
    faculties: [
      {
        id: 'maseno-computing',
        universityId: 'maseno',
        name: 'School of Computing and Informatics',
        programmes: [],
      },
      {
        id: 'maseno-maths',
        universityId: 'maseno',
        name: 'School of Mathematics, Statistics & Actuarial Science',
        programmes: [],
      },
      {
        id: 'maseno-business',
        universityId: 'maseno',
        name: 'School of Business and Economics',
        programmes: [],
      },
      {
        id: 'maseno-health',
        universityId: 'maseno',
        name: 'School of Nursing and Public Health',
        programmes: [],
      },
      {
        id: 'maseno-education',
        universityId: 'maseno',
        name: 'School of Education',
        programmes: [],
      },
      {
        id: 'maseno-engineering',
        universityId: 'maseno',
        name: 'School of Engineering and Built Environment',
        programmes: [],
      },
    ],
  },
  {
    id: 'uon',
    name: 'University of Nairobi',
    shortName: 'UoN',
    country: 'Kenya',
    city: 'Nairobi',
    isDemo: true,
    status: 'active',
    faculties: [
      {
        id: 'uon-science',
        universityId: 'uon',
        name: 'Faculty of Science & Technology',
        programmes: [],
      },
      {
        id: 'uon-engineering',
        universityId: 'uon',
        name: 'Faculty of Engineering',
        programmes: [],
      },
    ],
  },
  {
    id: 'strathmore',
    name: 'Strathmore University',
    shortName: 'SU',
    country: 'Kenya',
    city: 'Nairobi',
    isDemo: true,
    status: 'active',
    faculties: [
      {
        id: 'strath-it',
        universityId: 'strathmore',
        name: 'Faculty of Information Technology',
        programmes: [],
      },
      {
        id: 'strath-business',
        universityId: 'strathmore',
        name: 'Strathmore University Business School',
        programmes: [],
      },
    ],
  },
];

export const DEMO_PROGRAMMES = [
  {
    id: 'bsc-cs',
    universityId: 'maseno',
    facultyId: 'maseno-computing',
    name: 'BSc Computer Science',
    code: 'CSC',
    level: 'Undergraduate' as const,
    durationYears: 4,
    description: 'Foundations of computation, algorithms, software development, artificial intelligence, and network systems engineering.',
    isDemo: true,
    targetIndustries: ['Software Engineering', 'Artificial Intelligence', 'Cybersecurity', 'Cloud Computing', 'Fintech'],
    academicYears: [
      {
        yearNumber: 1,
        yearLabel: 'Year 1',
        semesters: [
          {
            semesterNumber: 1,
            semesterLabel: 'Semester 1',
            units: [
              { id: 'cs-111', programmeId: 'bsc-cs', unitCode: 'CSC 111', title: 'Introduction to Programming in C', description: 'Structured programming fundamentals, pointers, memory allocation, and problem solving.', yearNumber: 1, semesterNumber: 1, credits: 3, coreSkills: ['C Programming', 'Algorithmic Thinking', 'Debugging'], isDemo: true },
              { id: 'cs-112', programmeId: 'bsc-cs', unitCode: 'CSC 112', title: 'Discrete Mathematics for Computing', description: 'Logic, set theory, graph theory, combinatorics, and mathematical proofs.', yearNumber: 1, semesterNumber: 1, credits: 3, coreSkills: ['Mathematical Logic', 'Set Theory', 'Combinatorics'], isDemo: true },
              { id: 'cs-113', programmeId: 'bsc-cs', unitCode: 'CSC 113', title: 'Computer Architecture & Organization', description: 'Digital logic, instruction set architecture, CPU registers, and memory hierarchy.', yearNumber: 1, semesterNumber: 1, credits: 3, coreSkills: ['Hardware Organization', 'Assembly Basics', 'Digital Logic'], isDemo: true },
            ],
          },
          {
            semesterNumber: 2,
            semesterLabel: 'Semester 2',
            units: [
              { id: 'cs-121', programmeId: 'bsc-cs', unitCode: 'CSC 121', title: 'Object-Oriented Programming (Java)', description: 'Polymorphism, encapsulation, inheritance, exceptions, and design patterns.', yearNumber: 1, semesterNumber: 2, credits: 3, coreSkills: ['Java', 'OOP Design', 'Unit Testing'], isDemo: true },
              { id: 'cs-122', programmeId: 'bsc-cs', unitCode: 'CSC 122', title: 'Calculus for Computer Science', description: 'Differential and integral calculus, continuous functions, and rates of change.', yearNumber: 1, semesterNumber: 2, credits: 3, coreSkills: ['Calculus', 'Continuous Modeling'], isDemo: true },
              { id: 'cs-123', programmeId: 'bsc-cs', unitCode: 'CSC 123', title: 'Data Communication & Computer Networks', description: 'OSI layers, TCP/IP protocol suite, subnetting, routing, and sockets.', yearNumber: 1, semesterNumber: 2, credits: 3, coreSkills: ['Networking', 'TCP/IP', 'Socket Programming'], isDemo: true },
            ],
          },
        ],
      },
      {
        yearNumber: 2,
        yearLabel: 'Year 2',
        semesters: [
          {
            semesterNumber: 1,
            semesterLabel: 'Semester 1',
            units: [
              { id: 'cs-211', programmeId: 'bsc-cs', unitCode: 'CSC 211', title: 'Data Structures & Algorithms', description: 'Trees, heaps, graph traversal, Big-O asymptotic analysis, dynamic programming.', yearNumber: 2, semesterNumber: 1, credits: 4, coreSkills: ['Data Structures', 'Algorithm Design', 'Time Complexity'], isDemo: true },
              { id: 'cs-212', programmeId: 'bsc-cs', unitCode: 'CSC 212', title: 'Database Systems & SQL Modeling', description: 'Relational algebra, normalization (3NF/BCNF), query optimization, and transactions.', yearNumber: 2, semesterNumber: 1, credits: 3, coreSkills: ['PostgreSQL', 'Database Normalization', 'Relational Modeling'], isDemo: true },
              { id: 'cs-213', programmeId: 'bsc-cs', unitCode: 'CSC 213', title: 'Linear Algebra & Matrix Methods', description: 'Vector spaces, matrix decomposition, eigenvalues, and transformations for graphics/AI.', yearNumber: 2, semesterNumber: 1, credits: 3, coreSkills: ['Linear Algebra', 'Vector Operations', 'Eigenvalues'], isDemo: true },
            ],
          },
          {
            semesterNumber: 2,
            semesterLabel: 'Semester 2',
            units: [
              { id: 'cs-221', programmeId: 'bsc-cs', unitCode: 'CSC 221', title: 'Operating Systems & Concurrency', description: 'Process scheduling, threads, virtual memory, synchronization primitives, deadlocks.', yearNumber: 2, semesterNumber: 2, credits: 3, coreSkills: ['Concurrency', 'Memory Management', 'POSIX Systems'], isDemo: true },
              { id: 'cs-222', programmeId: 'bsc-cs', unitCode: 'CSC 222', title: 'Software Engineering Principles', description: 'Agile methodologies, system architecture, version control, CI/CD, testing life cycle.', yearNumber: 2, semesterNumber: 2, credits: 3, coreSkills: ['Git', 'System Architecture', 'CI/CD Pipelines'], isDemo: true },
              { id: 'cs-223', programmeId: 'bsc-cs', unitCode: 'CSC 223', title: 'Web Application Technologies', description: 'REST APIs, client-server state, asynchronous JavaScript/TypeScript, secure headers.', yearNumber: 2, semesterNumber: 2, credits: 3, coreSkills: ['TypeScript', 'REST APIs', 'Full-Stack Architecture'], isDemo: true },
            ],
          },
        ],
      },
      {
        yearNumber: 3,
        yearLabel: 'Year 3',
        semesters: [
          {
            semesterNumber: 1,
            semesterLabel: 'Semester 1',
            units: [
              { id: 'cs-311', programmeId: 'bsc-cs', unitCode: 'CSC 311', title: 'Artificial Intelligence & Search', description: 'Heuristic search, constraint satisfaction, adversarial games, knowledge representation.', yearNumber: 3, semesterNumber: 1, credits: 3, coreSkills: ['AI Fundamentals', 'A* Search', 'Knowledge Graphs'], isDemo: true },
              { id: 'cs-312', programmeId: 'bsc-cs', unitCode: 'CSC 312', title: 'Information Security & Cryptography', description: 'Symmetric/asymmetric encryption, hashing, PKI, threat modeling, OWASP standards.', yearNumber: 3, semesterNumber: 1, credits: 3, coreSkills: ['Cryptography', 'Threat Modeling', 'OWASP Security'], isDemo: true },
              { id: 'cs-313', programmeId: 'bsc-cs', unitCode: 'CSC 313', title: 'Cloud Infrastructure & Distributed Systems', description: 'Microservices, consensus algorithms, containerization (Docker), load balancing.', yearNumber: 3, semesterNumber: 1, credits: 3, coreSkills: ['Docker', 'Distributed Systems', 'Cloud Architecture'], isDemo: true },
            ],
          },
          {
            semesterNumber: 2,
            semesterLabel: 'Semester 2',
            units: [
              { id: 'cs-321', programmeId: 'bsc-cs', unitCode: 'CSC 321', title: 'Machine Learning & Data Mining', description: 'Supervised/unsupervised models, regression, decision trees, gradient descent, evaluation.', yearNumber: 3, semesterNumber: 2, credits: 3, coreSkills: ['Machine Learning', 'Python Scikit-Learn', 'Model Evaluation'], isDemo: true },
              { id: 'cs-322', programmeId: 'bsc-cs', unitCode: 'CSC 322', title: 'Mobile Applications Engineering', description: 'Native/hybrid mobile architecture, offline-first data, location and background tasks.', yearNumber: 3, semesterNumber: 2, credits: 3, coreSkills: ['Mobile Engineering', 'State Management', 'Offline Sync'], isDemo: true },
            ],
          },
        ],
      },
      {
        yearNumber: 4,
        yearLabel: 'Year 4',
        semesters: [
          {
            semesterNumber: 1,
            semesterLabel: 'Semester 1',
            units: [
              { id: 'cs-411', programmeId: 'bsc-cs', unitCode: 'CSC 411', title: 'Senior Capstone Project I', description: 'Industry-grade product design, architecture specification, prototyping, and ethical review.', yearNumber: 4, semesterNumber: 1, credits: 4, coreSkills: ['Project Management', 'System Design', 'Technical Writing'], isDemo: true },
              { id: 'cs-412', programmeId: 'bsc-cs', unitCode: 'CSC 412', title: 'Compilers & Formal Languages', description: 'Lexical analysis, parsing, AST generation, intermediate code optimization.', yearNumber: 4, semesterNumber: 1, credits: 3, coreSkills: ['Compilers', 'Automata Theory', 'Parsing'], isDemo: true },
            ],
          },
          {
            semesterNumber: 2,
            semesterLabel: 'Semester 2',
            units: [
              { id: 'cs-421', programmeId: 'bsc-cs', unitCode: 'CSC 421', title: 'Senior Capstone Project II', description: 'Final implementation, automated test suites, production deployment, and presentation.', yearNumber: 4, semesterNumber: 2, credits: 4, coreSkills: ['Production Deployment', 'End-to-End Testing', 'Presentation'], isDemo: true },
              { id: 'cs-422', programmeId: 'bsc-cs', unitCode: 'CSC 422', title: 'High Performance Computing', description: 'Parallel architectures, MPI, GPU CUDA computing, performance benchmarking.', yearNumber: 4, semesterNumber: 2, credits: 3, coreSkills: ['Parallel Computing', 'Benchmarking', 'GPU Acceleration'], isDemo: true },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'bsc-it',
    universityId: 'maseno',
    facultyId: 'maseno-computing',
    name: 'BSc Information Technology',
    code: 'BIT',
    level: 'Undergraduate' as const,
    durationYears: 4,
    description: 'Enterprise IT architecture, system administration, cybersecurity operations, web systems, and cloud management.',
    isDemo: true,
    targetIndustries: ['IT Systems Management', 'Cloud Solutions', 'Cybersecurity', 'DevOps', 'Network Administration'],
    academicYears: [
      {
        yearNumber: 1,
        yearLabel: 'Year 1',
        semesters: [
          {
            semesterNumber: 1,
            semesterLabel: 'Semester 1',
            units: [
              { id: 'it-111', programmeId: 'bsc-it', unitCode: 'BIT 111', title: 'Introduction to Information Systems', description: 'Enterprise hardware, operating environments, software stacks, IT services.', yearNumber: 1, semesterNumber: 1, credits: 3, coreSkills: ['IT Literacy', 'Systems Overview'], isDemo: true },
              { id: 'it-112', programmeId: 'bsc-it', unitCode: 'BIT 112', title: 'Computer Hardware & Network Fundamentals', description: 'LAN/WAN topologies, Ethernet cabling, routers, switches, PC troubleshooting.', yearNumber: 1, semesterNumber: 1, credits: 3, coreSkills: ['Hardware Repair', 'Network Cabling', 'Subnetting'], isDemo: true },
            ],
          },
          {
            semesterNumber: 2,
            semesterLabel: 'Semester 2',
            units: [
              { id: 'it-121', programmeId: 'bsc-it', unitCode: 'BIT 121', title: 'Structured Programming (Python)', description: 'Python scripting, file I/O, automated tooling, data processing basics.', yearNumber: 1, semesterNumber: 2, credits: 3, coreSkills: ['Python', 'Automation', 'Scripting'], isDemo: true },
              { id: 'it-122', programmeId: 'bsc-it', unitCode: 'BIT 122', title: 'Web Design & Digital Media', description: 'Semantic HTML5, CSS responsive layouts, UI wireframing, accessibility.', yearNumber: 1, semesterNumber: 2, credits: 3, coreSkills: ['HTML5/CSS3', 'Responsive Design', 'Accessibility'], isDemo: true },
            ],
          },
        ],
      },
      {
        yearNumber: 2,
        yearLabel: 'Year 2',
        semesters: [
          {
            semesterNumber: 1,
            semesterLabel: 'Semester 1',
            units: [
              { id: 'it-211', programmeId: 'bsc-it', unitCode: 'BIT 211', title: 'Relational Database Management', description: 'Schema engineering, SQL queries, backup replication, stored procedures.', yearNumber: 2, semesterNumber: 1, credits: 3, coreSkills: ['SQL', 'Database Administration', 'Backup Strategies'], isDemo: true },
              { id: 'it-212', programmeId: 'bsc-it', unitCode: 'BIT 212', title: 'Linux System Administration', description: 'Bash scripting, systemd services, SSH hardening, user permissions, cron automation.', yearNumber: 2, semesterNumber: 1, credits: 3, coreSkills: ['Linux CLI', 'Bash Scripting', 'Server Hardening'], isDemo: true },
            ],
          },
          {
            semesterNumber: 2,
            semesterLabel: 'Semester 2',
            units: [
              { id: 'it-221', programmeId: 'bsc-it', unitCode: 'BIT 221', title: 'Enterprise Network Engineering', description: 'VLANs, OSPF routing protocols, ACL firewalls, VPN tunnels, Wireshark packet capture.', yearNumber: 2, semesterNumber: 2, credits: 3, coreSkills: ['Cisco Routing', 'Packet Analysis', 'VPNs'], isDemo: true },
              { id: 'it-222', programmeId: 'bsc-it', unitCode: 'BIT 222', title: 'Cybersecurity Fundamentals & SOC', description: 'Intrusion detection, SIEM log analysis, defense in depth, zero-trust.', yearNumber: 2, semesterNumber: 2, credits: 3, coreSkills: ['SOC Monitoring', 'SIEM', 'Intrusion Detection'], isDemo: true },
            ],
          },
        ],
      },
      {
        yearNumber: 3,
        yearLabel: 'Year 3',
        semesters: [
          {
            semesterNumber: 1,
            semesterLabel: 'Semester 1',
            units: [
              { id: 'it-311', programmeId: 'bsc-it', unitCode: 'BIT 311', title: 'Cloud Solutions & AWS/GCP Architecture', description: 'Compute instances, object storage, IAM policies, VPC design, serverless.', yearNumber: 3, semesterNumber: 1, credits: 3, coreSkills: ['Cloud IAM', 'AWS/GCP', 'VPC Networking'], isDemo: true },
              { id: 'it-312', programmeId: 'bsc-it', unitCode: 'BIT 312', title: 'DevOps & Infrastructure as Code', description: 'Terraform, Docker, GitHub Actions CI/CD pipelines, container orchestration.', yearNumber: 3, semesterNumber: 1, credits: 3, coreSkills: ['Terraform', 'CI/CD Pipelines', 'Docker'], isDemo: true },
            ],
          },
          {
            semesterNumber: 2,
            semesterLabel: 'Semester 2',
            units: [
              { id: 'it-321', programmeId: 'bsc-it', unitCode: 'BIT 321', title: 'IT Service Management & ITIL', description: 'Incident response, SLA management, change governance, disaster recovery.', yearNumber: 3, semesterNumber: 2, credits: 3, coreSkills: ['ITIL Framework', 'Disaster Recovery', 'SLA Governance'], isDemo: true },
            ],
          },
        ],
      },
      {
        yearNumber: 4,
        yearLabel: 'Year 4',
        semesters: [
          {
            semesterNumber: 1,
            semesterLabel: 'Semester 1',
            units: [
              { id: 'it-411', programmeId: 'bsc-it', unitCode: 'BIT 411', title: 'IT Governance, Ethics & Audit', description: 'ISO 27001 compliance, GDPR/Data Protection Act, IT auditing, risk registers.', yearNumber: 4, semesterNumber: 1, credits: 3, coreSkills: ['Compliance', 'IT Auditing', 'Risk Assessment'], isDemo: true },
            ],
          },
          {
            semesterNumber: 2,
            semesterLabel: 'Semester 2',
            units: [
              { id: 'it-421', programmeId: 'bsc-it', unitCode: 'BIT 421', title: 'Capstone IT Infrastructure Project', description: 'Full deployment of resilient multi-tier enterprise architecture.', yearNumber: 4, semesterNumber: 2, credits: 4, coreSkills: ['Enterprise Architecture', 'Documentation', 'Production Ops'], isDemo: true },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'bsc-math',
    universityId: 'maseno',
    facultyId: 'maseno-maths',
    name: 'BSc Mathematics',
    code: 'MAT',
    level: 'Undergraduate' as const,
    durationYears: 4,
    description: 'Pure and applied mathematics, statistics, stochastic modeling, numerical analysis, and quantitative research.',
    isDemo: true,
    targetIndustries: ['Quantitative Finance', 'Data Science', 'Actuarial Analysis', 'Academic Research', 'Operations Research'],
    academicYears: [
      {
        yearNumber: 1,
        yearLabel: 'Year 1',
        semesters: [
          {
            semesterNumber: 1,
            semesterLabel: 'Semester 1',
            units: [
              { id: 'mat-111', programmeId: 'bsc-math', unitCode: 'MAT 111', title: 'Foundations of Pure Mathematics', description: 'Axiomatic set theory, relations, functions, mathematical induction.', yearNumber: 1, semesterNumber: 1, credits: 3, coreSkills: ['Rigorous Proofs', 'Set Theory'], isDemo: true },
              { id: 'mat-112', programmeId: 'bsc-math', unitCode: 'MAT 112', title: 'Differential Calculus', description: 'Limits, continuity, mean value theorem, Taylor expansions.', yearNumber: 1, semesterNumber: 1, credits: 3, coreSkills: ['Calculus', 'Series Expansion'], isDemo: true },
            ],
          },
          {
            semesterNumber: 2,
            semesterLabel: 'Semester 2',
            units: [
              { id: 'mat-121', programmeId: 'bsc-math', unitCode: 'MAT 121', title: 'Linear Algebra I', description: 'Matrices, Gaussian elimination, determinants, vector spaces, subspaces.', yearNumber: 1, semesterNumber: 2, credits: 3, coreSkills: ['Vector Spaces', 'Matrix Theory'], isDemo: true },
              { id: 'mat-122', programmeId: 'bsc-math', unitCode: 'MAT 122', title: 'Probability & Statistics I', description: 'Random variables, discrete distributions, expectation, variance, Bayes theorem.', yearNumber: 1, semesterNumber: 2, credits: 3, coreSkills: ['Probability Distributions', 'Bayesian Inference'], isDemo: true },
            ],
          },
        ],
      },
      {
        yearNumber: 2,
        yearLabel: 'Year 2',
        semesters: [
          {
            semesterNumber: 1,
            semesterLabel: 'Semester 1',
            units: [
              { id: 'mat-211', programmeId: 'bsc-math', unitCode: 'MAT 211', title: 'Multivariable Calculus', description: 'Partial derivatives, multiple integrals, Green and Stokes theorems.', yearNumber: 2, semesterNumber: 1, credits: 3, coreSkills: ['Multivariable Optimization', 'Vector Fields'], isDemo: true },
              { id: 'mat-212', programmeId: 'bsc-math', unitCode: 'MAT 212', title: 'Ordinary Differential Equations', description: 'First and second order ODEs, Laplace transforms, dynamic systems.', yearNumber: 2, semesterNumber: 1, credits: 3, coreSkills: ['Differential Equations', 'Dynamical Systems'], isDemo: true },
            ],
          },
          {
            semesterNumber: 2,
            semesterLabel: 'Semester 2',
            units: [
              { id: 'mat-221', programmeId: 'bsc-math', unitCode: 'MAT 221', title: 'Statistical Inference & Hypothesis Testing', description: 'Maximum likelihood estimation, confidence intervals, p-values, ANOVA.', yearNumber: 2, semesterNumber: 2, credits: 3, coreSkills: ['Statistical Testing', 'Hypothesis Design', 'R Programming'], isDemo: true },
              { id: 'mat-222', programmeId: 'bsc-math', unitCode: 'MAT 222', title: 'Numerical Analysis & Computation', description: 'Root finding, numerical integration, error propagation in Python/Matlab.', yearNumber: 2, semesterNumber: 2, credits: 3, coreSkills: ['Numerical Methods', 'Scientific Python'], isDemo: true },
            ],
          },
        ],
      },
      {
        yearNumber: 3,
        yearLabel: 'Year 3',
        semesters: [
          {
            semesterNumber: 1,
            semesterLabel: 'Semester 1',
            units: [
              { id: 'mat-311', programmeId: 'bsc-math', unitCode: 'MAT 311', title: 'Operations Research & Linear Programming', description: 'Simplex algorithm, duality, transport problems, network flows.', yearNumber: 3, semesterNumber: 1, credits: 3, coreSkills: ['Optimization', 'Simplex Method', 'Linear Programming'], isDemo: true },
              { id: 'mat-312', programmeId: 'bsc-math', unitCode: 'MAT 312', title: 'Real Analysis', description: 'Metric spaces, completeness, compactness, Cauchy sequences.', yearNumber: 3, semesterNumber: 1, credits: 3, coreSkills: ['Real Analysis', 'Topology Basics'], isDemo: true },
            ],
          },
          {
            semesterNumber: 2,
            semesterLabel: 'Semester 2',
            units: [
              { id: 'mat-321', programmeId: 'bsc-math', unitCode: 'MAT 321', title: 'Stochastic Processes & Time Series', description: 'Markov chains, Poisson processes, ARIMA models, forecasting.', yearNumber: 3, semesterNumber: 2, credits: 3, coreSkills: ['Stochastic Modeling', 'Time Series Forecasting'], isDemo: true },
            ],
          },
        ],
      },
      {
        yearNumber: 4,
        yearLabel: 'Year 4',
        semesters: [
          {
            semesterNumber: 1,
            semesterLabel: 'Semester 1',
            units: [
              { id: 'mat-411', programmeId: 'bsc-math', unitCode: 'MAT 411', title: 'Financial Mathematics & Risk Modeling', description: 'Compound interest theory, annuities, Black-Scholes formula, portfolio risk.', yearNumber: 4, semesterNumber: 1, credits: 3, coreSkills: ['Quantitative Finance', 'Black-Scholes', 'Risk Analysis'], isDemo: true },
            ],
          },
          {
            semesterNumber: 2,
            semesterLabel: 'Semester 2',
            units: [
              { id: 'mat-421', programmeId: 'bsc-math', unitCode: 'MAT 421', title: 'Mathematical Modeling & Capstone Research', description: 'Real-world simulation of biological and economic phenomena.', yearNumber: 4, semesterNumber: 2, credits: 4, coreSkills: ['Mathematical Simulation', 'Research Thesis'], isDemo: true },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'bsc-nursing',
    universityId: 'maseno',
    facultyId: 'maseno-health',
    name: 'BSc Nursing',
    code: 'NRS',
    level: 'Undergraduate' as const,
    durationYears: 4,
    description: 'Clinical nursing care, physiology, pharmacology, patient health informatics, community health, and evidence-based practice.',
    isDemo: true,
    targetIndustries: ['Clinical Healthcare', 'Nursing Informatics', 'Public Health Administration', 'Medical Research'],
    academicYears: [
      {
        yearNumber: 1,
        yearLabel: 'Year 1',
        semesters: [
          {
            semesterNumber: 1,
            semesterLabel: 'Semester 1',
            units: [
              { id: 'nrs-111', programmeId: 'bsc-nursing', unitCode: 'NRS 111', title: 'Human Anatomy & Histology I', description: 'Skeletal, muscular, and nervous system anatomical structures.', yearNumber: 1, semesterNumber: 1, credits: 4, coreSkills: ['Anatomy', 'Clinical Terminology'], isDemo: true },
              { id: 'nrs-112', programmeId: 'bsc-nursing', unitCode: 'NRS 112', title: 'Medical Physiology I', description: 'Cell physiology, nerve conduction, cardiovascular mechanics.', yearNumber: 1, semesterNumber: 1, credits: 4, coreSkills: ['Physiology', 'Vital Signs Interpretation'], isDemo: true },
            ],
          },
          {
            semesterNumber: 2,
            semesterLabel: 'Semester 2',
            units: [
              { id: 'nrs-121', programmeId: 'bsc-nursing', unitCode: 'NRS 121', title: 'Foundations of Nursing Practice', description: 'Infection control, sterile technique, patient hygiene, ethical code.', yearNumber: 1, semesterNumber: 2, credits: 3, coreSkills: ['Patient Care', 'Clinical Ethics', 'Infection Control'], isDemo: true },
              { id: 'nrs-122', programmeId: 'bsc-nursing', unitCode: 'NRS 122', title: 'Medical Biochemistry & Nutrition', description: 'Metabolic pathways, clinical nutrition, electrolyte balance.', yearNumber: 1, semesterNumber: 2, credits: 3, coreSkills: ['Biochemistry', 'Clinical Nutrition'], isDemo: true },
            ],
          },
        ],
      },
      {
        yearNumber: 2,
        yearLabel: 'Year 2',
        semesters: [
          {
            semesterNumber: 1,
            semesterLabel: 'Semester 1',
            units: [
              { id: 'nrs-211', programmeId: 'bsc-nursing', unitCode: 'NRS 211', title: 'Clinical Pharmacology I', description: 'Pharmacokinetics, pharmacodynamics, dosage calculations, antibiotics.', yearNumber: 2, semesterNumber: 1, credits: 3, coreSkills: ['Pharmacology', 'Dosage Calculation', 'Drug Safety'], isDemo: true },
              { id: 'nrs-212', programmeId: 'bsc-nursing', unitCode: 'NRS 212', title: 'Medical Microbiology & Immunology', description: 'Pathogens, antibiotic resistance, vaccine immunology.', yearNumber: 2, semesterNumber: 1, credits: 3, coreSkills: ['Microbiology', 'Immunology'], isDemo: true },
            ],
          },
          {
            semesterNumber: 2,
            semesterLabel: 'Semester 2',
            units: [
              { id: 'nrs-221', programmeId: 'bsc-nursing', unitCode: 'NRS 221', title: 'Medical-Surgical Nursing I', description: 'Care of patients undergoing major medical interventions.', yearNumber: 2, semesterNumber: 2, credits: 4, coreSkills: ['Perioperative Care', 'Triage Assessment'], isDemo: true },
              { id: 'nrs-222', programmeId: 'bsc-nursing', unitCode: 'NRS 222', title: 'Health Assessment & Diagnostics', description: 'Physical examination, ECG interpretation basics, laboratory tests.', yearNumber: 2, semesterNumber: 2, credits: 3, coreSkills: ['Diagnostic Interpretation', 'Physical Examination'], isDemo: true },
            ],
          },
        ],
      },
      {
        yearNumber: 3,
        yearLabel: 'Year 3',
        semesters: [
          {
            semesterNumber: 1,
            semesterLabel: 'Semester 1',
            units: [
              { id: 'nrs-311', programmeId: 'bsc-nursing', unitCode: 'NRS 311', title: 'Community Health & Epidemiology', description: 'Public health surveys, disease prevention, epidemiology metrics.', yearNumber: 3, semesterNumber: 1, credits: 3, coreSkills: ['Epidemiology', 'Public Health Strategy'], isDemo: true },
              { id: 'nrs-312', programmeId: 'bsc-nursing', unitCode: 'NRS 312', title: 'Healthcare Informatics & Digital Records', description: 'Electronic health records (EHR), telemedicine systems, clinical confidentiality.', yearNumber: 3, semesterNumber: 1, credits: 3, coreSkills: ['Health Informatics', 'EHR Systems', 'Patient Privacy'], isDemo: true },
            ],
          },
          {
            semesterNumber: 2,
            semesterLabel: 'Semester 2',
            units: [
              { id: 'nrs-321', programmeId: 'bsc-nursing', unitCode: 'NRS 321', title: 'Maternal & Child Health Nursing', description: 'Antenatal care, obstetric emergencies, neonatal intensive care.', yearNumber: 3, semesterNumber: 2, credits: 4, coreSkills: ['Obstetrics', 'Pediatric Care'], isDemo: true },
            ],
          },
        ],
      },
      {
        yearNumber: 4,
        yearLabel: 'Year 4',
        semesters: [
          {
            semesterNumber: 1,
            semesterLabel: 'Semester 1',
            units: [
              { id: 'nrs-411', programmeId: 'bsc-nursing', unitCode: 'NRS 411', title: 'Nursing Leadership, Management & Law', description: 'Clinical audit, healthcare leadership, regulatory law, staff coordination.', yearNumber: 4, semesterNumber: 1, credits: 3, coreSkills: ['Clinical Leadership', 'Healthcare Policy', 'Medical Jurisprudence'], isDemo: true },
            ],
          },
          {
            semesterNumber: 2,
            semesterLabel: 'Semester 2',
            units: [
              { id: 'nrs-421', programmeId: 'bsc-nursing', unitCode: 'NRS 421', title: 'Clinical Internship & Evidence-Based Practicum', description: 'Final hospital clinical rotation, patient cohort management, audit presentation.', yearNumber: 4, semesterNumber: 2, credits: 4, coreSkills: ['Clinical Decision Making', 'Patient Advocacy'], isDemo: true },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'b-com',
    universityId: 'maseno',
    facultyId: 'maseno-business',
    name: 'Bachelor of Commerce',
    code: 'BCOM',
    level: 'Undergraduate' as const,
    durationYears: 4,
    description: 'Financial management, strategic accounting, marketing analytics, supply chain, and organizational leadership.',
    isDemo: true,
    targetIndustries: ['Corporate Finance', 'Management Consulting', 'Business Analytics', 'Banking', 'Supply Chain Management'],
    academicYears: [
      {
        yearNumber: 1,
        yearLabel: 'Year 1',
        semesters: [
          {
            semesterNumber: 1,
            semesterLabel: 'Semester 1',
            units: [
              { id: 'bcom-111', programmeId: 'b-com', unitCode: 'BMS 111', title: 'Financial Accounting Principles I', description: 'Double entry, journals, trial balance, financial statements.', yearNumber: 1, semesterNumber: 1, credits: 3, coreSkills: ['Financial Accounting', 'Ledger Balancing'], isDemo: true },
              { id: 'bcom-112', programmeId: 'b-com', unitCode: 'BMS 112', title: 'Business Economics & Market Dynamics', description: 'Supply, demand, price elasticity, market structures.', yearNumber: 1, semesterNumber: 1, credits: 3, coreSkills: ['Microeconomics', 'Market Analysis'], isDemo: true },
            ],
          },
          {
            semesterNumber: 2,
            semesterLabel: 'Semester 2',
            units: [
              { id: 'bcom-121', programmeId: 'b-com', unitCode: 'BMS 121', title: 'Cost Accounting Fundamentals', description: 'Cost allocation, break-even analysis, job and process costing.', yearNumber: 1, semesterNumber: 2, credits: 3, coreSkills: ['Cost Accounting', 'Variance Analysis'], isDemo: true },
              { id: 'bcom-122', programmeId: 'b-com', unitCode: 'BMS 122', title: 'Commercial Law & Contracts', description: 'Contract law, agency, sale of goods, company law basics.', yearNumber: 1, semesterNumber: 2, credits: 3, coreSkills: ['Commercial Law', 'Contract Governance'], isDemo: true },
            ],
          },
        ],
      },
      {
        yearNumber: 2,
        yearLabel: 'Year 2',
        semesters: [
          {
            semesterNumber: 1,
            semesterLabel: 'Semester 1',
            units: [
              { id: 'bcom-211', programmeId: 'b-com', unitCode: 'BMS 211', title: 'Corporate Financial Management', description: 'Capital budgeting, DCF valuation, cost of capital (WACC), dividend policy.', yearNumber: 2, semesterNumber: 1, credits: 3, coreSkills: ['DCF Valuation', 'Capital Budgeting', 'WACC'], isDemo: true },
              { id: 'bcom-212', programmeId: 'b-com', unitCode: 'BMS 212', title: 'Marketing Management & Brand Strategy', description: 'Segmentation, targeting, positioning, digital customer acquisition.', yearNumber: 2, semesterNumber: 1, credits: 3, coreSkills: ['Market Segmentation', 'Brand Strategy'], isDemo: true },
            ],
          },
          {
            semesterNumber: 2,
            semesterLabel: 'Semester 2',
            units: [
              { id: 'bcom-221', programmeId: 'b-com', unitCode: 'BMS 221', title: 'Business Statistics & Quantitative Methods', description: 'Regression, forecasting, hypothesis tests for commercial research.', yearNumber: 2, semesterNumber: 2, credits: 3, coreSkills: ['Excel Modeling', 'Quantitative Analysis'], isDemo: true },
              { id: 'bcom-222', programmeId: 'b-com', unitCode: 'BMS 222', title: 'Supply Chain & Operations Strategy', description: 'Procurement, inventory control (EOQ), logistics network planning.', yearNumber: 2, semesterNumber: 2, credits: 3, coreSkills: ['Supply Chain', 'Logistics Strategy'], isDemo: true },
            ],
          },
        ],
      },
      {
        yearNumber: 3,
        yearLabel: 'Year 3',
        semesters: [
          {
            semesterNumber: 1,
            semesterLabel: 'Semester 1',
            units: [
              { id: 'bcom-311', programmeId: 'b-com', unitCode: 'BMS 311', title: 'Investment Analysis & Portfolio Theory', description: 'Modern portfolio theory, CAPM, bond pricing, equity research.', yearNumber: 3, semesterNumber: 1, credits: 3, coreSkills: ['Equity Research', 'Portfolio Management', 'CAPM'], isDemo: true },
              { id: 'bcom-312', programmeId: 'b-com', unitCode: 'BMS 312', title: 'Management Information Systems & BI', description: 'ERP systems, dashboard design, Power BI, database querying.', yearNumber: 3, semesterNumber: 1, credits: 3, coreSkills: ['Business Intelligence', 'Power BI', 'ERP Strategy'], isDemo: true },
            ],
          },
          {
            semesterNumber: 2,
            semesterLabel: 'Semester 2',
            units: [
              { id: 'bcom-321', programmeId: 'b-com', unitCode: 'BMS 321', title: 'Auditing & Forensic Assurance', description: 'Audit risk, internal controls, statutory reporting, fraud detection.', yearNumber: 3, semesterNumber: 2, credits: 3, coreSkills: ['Internal Controls', 'Audit Risk Assessment'], isDemo: true },
            ],
          },
        ],
      },
      {
        yearNumber: 4,
        yearLabel: 'Year 4',
        semesters: [
          {
            semesterNumber: 1,
            semesterLabel: 'Semester 1',
            units: [
              { id: 'bcom-411', programmeId: 'b-com', unitCode: 'BMS 411', title: 'Strategic Management & Business Policy', description: 'Porter five forces, blue ocean strategy, mergers, competitive advantage.', yearNumber: 4, semesterNumber: 1, credits: 3, coreSkills: ['Competitive Strategy', 'Executive Decision Making'], isDemo: true },
            ],
          },
          {
            semesterNumber: 2,
            semesterLabel: 'Semester 2',
            units: [
              { id: 'bcom-421', programmeId: 'b-com', unitCode: 'BMS 421', title: 'Entrepreneurship & Business Incubation', description: 'Business pitch deck, pro-forma financials, venture scaling, investor negotiation.', yearNumber: 4, semesterNumber: 2, credits: 4, coreSkills: ['Venture Modeling', 'Pitch Presentation'], isDemo: true },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'b-ed-sci',
    universityId: 'maseno',
    facultyId: 'maseno-education',
    name: 'Bachelor of Education (Science)',
    code: 'BED-SCI',
    level: 'Undergraduate' as const,
    durationYears: 4,
    description: 'Pedagogy, curriculum development, instructional design, science laboratory instruction, and educational psychology.',
    isDemo: true,
    targetIndustries: ['Secondary & Tertiary Education', 'Instructional Design', 'EdTech Content Development', 'Curriculum Policy'],
    academicYears: [
      {
        yearNumber: 1,
        yearLabel: 'Year 1',
        semesters: [
          {
            semesterNumber: 1,
            semesterLabel: 'Semester 1',
            units: [
              { id: 'bed-111', programmeId: 'b-ed-sci', unitCode: 'EDU 111', title: 'Introduction to Educational Psychology', description: 'Developmental milestones, cognitive theories of learning, student motivation.', yearNumber: 1, semesterNumber: 1, credits: 3, coreSkills: ['Learning Theories', 'Child Psychology'], isDemo: true },
            ],
          },
          {
            semesterNumber: 2,
            semesterLabel: 'Semester 2',
            units: [
              { id: 'bed-121', programmeId: 'b-ed-sci', unitCode: 'EDU 121', title: 'Curriculum Theory & Instructional Planning', description: 'Lesson plan architecture, syllabus mapping, Bloom taxonomy.', yearNumber: 1, semesterNumber: 2, credits: 3, coreSkills: ['Lesson Planning', 'Bloom Taxonomy'], isDemo: true },
            ],
          },
        ],
      },
      {
        yearNumber: 2,
        yearLabel: 'Year 2',
        semesters: [
          {
            semesterNumber: 1,
            semesterLabel: 'Semester 1',
            units: [
              { id: 'bed-211', programmeId: 'b-ed-sci', unitCode: 'EDU 211', title: 'Educational Media & Technology Integration', description: 'Digital teaching tools, flipped classrooms, virtual labs.', yearNumber: 2, semesterNumber: 1, credits: 3, coreSkills: ['EdTech Tools', 'Digital Learning Design'], isDemo: true },
            ],
          },
          {
            semesterNumber: 2,
            semesterLabel: 'Semester 2',
            units: [
              { id: 'bed-221', programmeId: 'b-ed-sci', unitCode: 'EDU 221', title: 'Science Laboratory Pedagogy & Safety', description: 'Experiment design, chemical handling, risk mitigation, inquiry-based learning.', yearNumber: 2, semesterNumber: 2, credits: 3, coreSkills: ['Lab Safety', 'Inquiry-Based Teaching'], isDemo: true },
            ],
          },
        ],
      },
      {
        yearNumber: 3,
        yearLabel: 'Year 3',
        semesters: [
          {
            semesterNumber: 1,
            semesterLabel: 'Semester 1',
            units: [
              { id: 'bed-311', programmeId: 'b-ed-sci', unitCode: 'EDU 311', title: 'Educational Assessment, Measurement & Rubrics', description: 'Item analysis, grading rubrics, standardized test construction.', yearNumber: 3, semesterNumber: 1, credits: 3, coreSkills: ['Assessment Rubrics', 'Psychometrics Basics'], isDemo: true },
            ],
          },
          {
            semesterNumber: 2,
            semesterLabel: 'Semester 2',
            units: [
              { id: 'bed-321', programmeId: 'b-ed-sci', unitCode: 'EDU 321', title: 'Teaching Practice Practicum I', description: 'Supervised classroom instruction and peer review.', yearNumber: 3, semesterNumber: 2, credits: 4, coreSkills: ['Classroom Management', 'Instructional Delivery'], isDemo: true },
            ],
          },
        ],
      },
      {
        yearNumber: 4,
        yearLabel: 'Year 4',
        semesters: [
          {
            semesterNumber: 1,
            semesterLabel: 'Semester 1',
            units: [
              { id: 'bed-411', programmeId: 'b-ed-sci', unitCode: 'EDU 411', title: 'Education Administration & School Governance', description: 'Institutional leadership, budget administration, parent-teacher relations.', yearNumber: 4, semesterNumber: 1, credits: 3, coreSkills: ['Educational Leadership', 'Governance'], isDemo: true },
            ],
          },
          {
            semesterNumber: 2,
            semesterLabel: 'Semester 2',
            units: [
              { id: 'bed-421', programmeId: 'b-ed-sci', unitCode: 'EDU 421', title: 'Advanced Instructional Design Capstone', description: 'Interactive digital STEM curriculum package with assessments.', yearNumber: 4, semesterNumber: 2, credits: 4, coreSkills: ['Curriculum Engineering', 'EdTech Delivery'], isDemo: true },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'bsc-mech-eng',
    universityId: 'maseno',
    facultyId: 'maseno-engineering',
    name: 'BSc Mechanical Engineering',
    code: 'MEE',
    level: 'Undergraduate' as const,
    durationYears: 5,
    description: 'Thermodynamics, fluid mechanics, machine design, CAD/CAM manufacturing, materials science, and robotics automation.',
    isDemo: true,
    targetIndustries: ['Manufacturing & Automotive', 'Energy & Power Systems', 'Aerospace', 'Industrial Automation', 'HVAC Engineering'],
    academicYears: [
      {
        yearNumber: 1,
        yearLabel: 'Year 1',
        semesters: [
          {
            semesterNumber: 1,
            semesterLabel: 'Semester 1',
            units: [
              { id: 'mee-111', programmeId: 'bsc-mech-eng', unitCode: 'MEE 111', title: 'Engineering Mechanics (Statics)', description: 'Force vectors, particle equilibrium, trusses, shear force and bending moments.', yearNumber: 1, semesterNumber: 1, credits: 3, coreSkills: ['Statics', 'Vector Mechanics'], isDemo: true },
              { id: 'mee-112', programmeId: 'bsc-mech-eng', unitCode: 'MEE 112', title: 'Engineering Drawing & CAD Drafting', description: 'Orthographic projections, isometric views, tolerance standards, AutoCAD basics.', yearNumber: 1, semesterNumber: 1, credits: 3, coreSkills: ['AutoCAD', 'Technical Drawing', 'Geometric Tolerancing'], isDemo: true },
            ],
          },
          {
            semesterNumber: 2,
            semesterLabel: 'Semester 2',
            units: [
              { id: 'mee-121', programmeId: 'bsc-mech-eng', unitCode: 'MEE 121', title: 'Engineering Materials & Metallurgy', description: 'Atomic bonding, phase diagrams, heat treatments, polymers and composites.', yearNumber: 1, semesterNumber: 2, credits: 3, coreSkills: ['Materials Science', 'Phase Diagrams'], isDemo: true },
            ],
          },
        ],
      },
      {
        yearNumber: 2,
        yearLabel: 'Year 2',
        semesters: [
          {
            semesterNumber: 1,
            semesterLabel: 'Semester 1',
            units: [
              { id: 'mee-211', programmeId: 'bsc-mech-eng', unitCode: 'MEE 211', title: 'Thermodynamics I', description: 'First and second laws, ideal gas cycles, Carnot engine, steam tables.', yearNumber: 2, semesterNumber: 1, credits: 3, coreSkills: ['Thermodynamics', 'Carnot Cycles', 'Energy Conservation'], isDemo: true },
              { id: 'mee-212', programmeId: 'bsc-mech-eng', unitCode: 'MEE 212', title: 'Fluid Mechanics I', description: 'Fluid statics, Bernoulli equation, pipe flow, Reynolds number.', yearNumber: 2, semesterNumber: 1, credits: 3, coreSkills: ['Fluid Dynamics', 'Bernoulli Analysis'], isDemo: true },
            ],
          },
          {
            semesterNumber: 2,
            semesterLabel: 'Semester 2',
            units: [
              { id: 'mee-221', programmeId: 'bsc-mech-eng', unitCode: 'MEE 221', title: 'Mechanics of Machines & Kinematics', description: 'Linkages, gear trains, cams, balancing of rotating masses.', yearNumber: 2, semesterNumber: 2, credits: 3, coreSkills: ['Kinematics', 'Gear Design'], isDemo: true },
            ],
          },
        ],
      },
      {
        yearNumber: 3,
        yearLabel: 'Year 3',
        semesters: [
          {
            semesterNumber: 1,
            semesterLabel: 'Semester 1',
            units: [
              { id: 'mee-311', programmeId: 'bsc-mech-eng', unitCode: 'MEE 311', title: 'Heat Transfer & Heat Exchangers', description: 'Conduction, convection, radiation, log mean temperature difference (LMTD).', yearNumber: 3, semesterNumber: 1, credits: 3, coreSkills: ['Heat Transfer Modeling', 'LMTD Analysis'], isDemo: true },
            ],
          },
          {
            semesterNumber: 2,
            semesterLabel: 'Semester 2',
            units: [
              { id: 'mee-321', programmeId: 'bsc-mech-eng', unitCode: 'MEE 321', title: 'Mechanical System Design & FEA', description: 'Stress concentrations, fatigue failure, SolidWorks FEA simulations.', yearNumber: 3, semesterNumber: 2, credits: 4, coreSkills: ['FEA Simulation', 'SolidWorks', 'Fatigue Analysis'], isDemo: true },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'bsc-elec-eng',
    universityId: 'maseno',
    facultyId: 'maseno-engineering',
    name: 'BSc Electrical Engineering',
    code: 'EEE',
    level: 'Undergraduate' as const,
    durationYears: 5,
    description: 'Electric circuits, power systems, analog/digital electronics, signal processing, telecommunications, and microcontrollers.',
    isDemo: true,
    targetIndustries: ['Electrical Power Grid', 'Embedded Systems', 'Telecommunications', 'Renewable Energy', 'Automation'],
    academicYears: [
      {
        yearNumber: 1,
        yearLabel: 'Year 1',
        semesters: [
          {
            semesterNumber: 1,
            semesterLabel: 'Semester 1',
            units: [
              { id: 'eee-111', programmeId: 'bsc-elec-eng', unitCode: 'EEE 111', title: 'Electrical Circuit Analysis I', description: 'Ohm law, Kirchhoff laws, Thevenin and Norton equivalents, nodal analysis.', yearNumber: 1, semesterNumber: 1, credits: 3, coreSkills: ['Kirchhoff Laws', 'Nodal Circuit Analysis'], isDemo: true },
            ],
          },
          {
            semesterNumber: 2,
            semesterLabel: 'Semester 2',
            units: [
              { id: 'eee-121', programmeId: 'bsc-elec-eng', unitCode: 'EEE 121', title: 'Digital Electronics & Logic Gates', description: 'Boolean algebra, Karnaugh maps, flip-flops, synchronous counters.', yearNumber: 1, semesterNumber: 2, credits: 3, coreSkills: ['Digital Logic', 'K-Maps', 'HDL Basics'], isDemo: true },
            ],
          },
        ],
      },
      {
        yearNumber: 2,
        yearLabel: 'Year 2',
        semesters: [
          {
            semesterNumber: 1,
            semesterLabel: 'Semester 1',
            units: [
              { id: 'eee-211', programmeId: 'bsc-elec-eng', unitCode: 'EEE 211', title: 'Electromagnetic Field Theory', description: 'Maxwell equations, electrostatic fields, magnetic vector potential.', yearNumber: 2, semesterNumber: 1, credits: 3, coreSkills: ['Maxwell Equations', 'Electromagnetics'], isDemo: true },
            ],
          },
          {
            semesterNumber: 2,
            semesterLabel: 'Semester 2',
            units: [
              { id: 'eee-221', programmeId: 'bsc-elec-eng', unitCode: 'EEE 221', title: 'Signals & Linear Systems', description: 'Continuous and discrete signals, Fourier transforms, z-transforms, filtering.', yearNumber: 2, semesterNumber: 2, credits: 3, coreSkills: ['Signal Processing', 'Fourier Transform', 'Matlab'], isDemo: true },
            ],
          },
        ],
      },
      {
        yearNumber: 3,
        yearLabel: 'Year 3',
        semesters: [
          {
            semesterNumber: 1,
            semesterLabel: 'Semester 1',
            units: [
              { id: 'eee-311', programmeId: 'bsc-elec-eng', unitCode: 'EEE 311', title: 'Microprocessors & Embedded C', description: 'ARM Cortex/AVR architectures, GPIO interrupts, timers, ADC, SPI/I2C.', yearNumber: 3, semesterNumber: 1, credits: 4, coreSkills: ['Embedded C', 'Microcontrollers', 'Hardware Protocols'], isDemo: true },
            ],
          },
          {
            semesterNumber: 2,
            semesterLabel: 'Semester 2',
            units: [
              { id: 'eee-321', programmeId: 'bsc-elec-eng', unitCode: 'EEE 321', title: 'Power Systems & Renewable Energy', description: 'Three-phase power, transmission lines, solar PV inverter integration.', yearNumber: 3, semesterNumber: 2, credits: 3, coreSkills: ['Power Grid Analysis', 'Renewable Integration'], isDemo: true },
            ],
          },
        ],
      },
    ],
  },
];

// Populate faculties in universities
UNIVERSITIES[0].faculties[0].programmes = [DEMO_PROGRAMMES[0], DEMO_PROGRAMMES[1]];
UNIVERSITIES[0].faculties[1].programmes = [DEMO_PROGRAMMES[2]];
UNIVERSITIES[0].faculties[2].programmes = [DEMO_PROGRAMMES[4]];
UNIVERSITIES[0].faculties[3].programmes = [DEMO_PROGRAMMES[3]];
UNIVERSITIES[0].faculties[4].programmes = [DEMO_PROGRAMMES[5]];
UNIVERSITIES[0].faculties[5].programmes = [DEMO_PROGRAMMES[6], DEMO_PROGRAMMES[7]];

// Synthetic comprehensive careers catalogue
export const CAREERS: Career[] = [
  {
    id: 'career-software-eng',
    slug: 'software-engineer',
    title: 'Software Engineer / Full-Stack Developer',
    category: 'Technology & Computing',
    summary: 'Designs, develops, tests, and deploys high-performance web, cloud, and distributed software systems.',
    responsibilities: [
      'Architect robust web applications using modern client frameworks and server runtimes.',
      'Design relational and document database schemas with concurrency control and caching.',
      'Implement secure RESTful and GraphQL APIs with automated unit and integration tests.',
      'Configure CI/CD pipelines for zero-downtime containerized deployments.'
    ],
    workEnvironments: ['Tech Startups', 'Enterprise SaaS Corporations', 'Fintech & Digital Banking', 'Remote Distributed Teams'],
    entryRoles: ['Junior Full-Stack Developer', 'Frontend Engineer', 'Backend Developer', 'Software QA Automation Associate'],
    advancementRoles: ['Senior Software Engineer', 'Staff Engineer', 'Engineering Manager', 'VP of Engineering'],
    relevantProgrammes: ['bsc-cs', 'bsc-it'],
    relevantUnitCodes: ['CSC 111', 'CSC 121', 'CSC 211', 'CSC 212', 'CSC 222', 'CSC 223', 'BIT 121', 'BIT 211'],
    technicalSkills: ['TypeScript / JavaScript', 'Node.js & Express', 'React / Next.js', 'PostgreSQL / SQL', 'Docker', 'Git Version Control'],
    transferableSkills: ['Systems Thinking', 'Code Review Empathy', 'Asynchronous Collaboration', 'Technical Documentation'],
    recommendedCertifications: [
      { name: 'AWS Certified Developer - Associate', provider: 'Amazon Web Services', isMandatory: false, note: 'Valuable for cloud backend roles' },
      { name: 'Meta Full-Stack Engineer Certificate', provider: 'Meta / Coursera', isMandatory: false, note: 'Demonstrates practical product building' }
    ],
    portfolioProjects: [
      {
        id: 'proj-se-1',
        title: 'Real-Time Collaborative Markdown Workspace',
        level: 'Intermediate',
        summary: 'Build a multi-tenant document editor with operational transformation or CRDT sync, WebSocket connections, and user authorization.',
        skillsExercised: ['WebSockets', 'React', 'Node.js', 'State Synchronization'],
        deliverables: ['GitHub repository with CI pipeline', 'Live deployed web application', 'Architecture diagram README'],
        estimatedWeeks: 3
      },
      {
        id: 'proj-se-2',
        title: 'Distributed Rate-Limited API Gateway',
        level: 'Advanced',
        summary: 'Build a reverse proxy with token bucket rate limiting, Redis caching layer, JWT verification, and Prometheus metrics.',
        skillsExercised: ['Go or Node.js', 'Redis', 'Concurrency', 'Network Protocols'],
        deliverables: ['Benchmark performance report', 'Docker Compose deployment setup', 'Automated test suite'],
        estimatedWeeks: 4
      }
    ],
    roadmapSteps: [
      {
        id: 'step-se-1',
        stepNumber: 1,
        title: 'Master Programming Foundations & Data Structures',
        description: 'Solidify algorithmic complexity, memory representation, and object-oriented patterns in TypeScript or Java.',
        phase: 'Foundation (Year 1-2)',
        recommendedResources: [
          { title: 'Full Stack Open - University of Helsinki', type: 'Course', url: 'https://fullstackopen.com' },
          { title: 'TypeScript Official Handbook', type: 'Documentation', url: 'https://www.typescriptlang.org/docs/' }
        ],
        practicalActions: ['Solve 50+ medium LeetCode/HackerRank algorithm problems.', 'Build a command-line tool with clean modular architecture and unit tests.']
      },
      {
        id: 'step-se-2',
        stepNumber: 2,
        title: 'Build Full-Stack Applications with Relational Persistence',
        description: 'Connect React clients to typed Express/Node APIs and PostgreSQL with migrations and ACID compliance.',
        phase: 'Specialization (Year 3)',
        recommendedResources: [
          { title: 'The Odin Project Full Stack Path', type: 'Interactive Tutorial', url: 'https://www.theodinproject.com' },
          { title: 'PostgreSQL Tutorial & Documentation', type: 'Documentation', url: 'https://www.postgresqltutorial.com' }
        ],
        practicalActions: ['Build and ship a production-grade full-stack project with user authentication.', 'Implement database migrations and write automated integration tests.']
      },
      {
        id: 'step-se-3',
        stepNumber: 3,
        title: 'Production Readiness, Cloud Containers & CI/CD',
        description: 'Containerize applications with Docker, write automated GitHub Actions workflows, and deploy to cloud platforms.',
        phase: 'Industry Readiness (Year 4+)',
        recommendedResources: [
          { title: 'Docker Documentation & Get Started Guide', type: 'Documentation', url: 'https://docs.docker.com/get-started/' },
          { title: 'GitHub Actions CI/CD Guides', type: 'Documentation', url: 'https://docs.github.com/en/actions' }
        ],
        practicalActions: ['Setup automated linting, test runs, and continuous deployment on every pull request.', 'Contribute to an active open-source repository or build your senior capstone.']
      }
    ],
    postgraduateOptions: ['MSc Computer Science', 'MSc Software Engineering', 'MSc Distributed Systems'],
    dataLimitationNotice: 'Salary metrics and job growth percentages vary by geographic region and seniority; figures are omitted to prevent misleading claims.',
    isDemo: false
  },
  {
    id: 'career-data-scientist',
    slug: 'data-scientist',
    title: 'Data Scientist / Machine Learning Engineer',
    category: 'Technology & Computing',
    summary: 'Analyzes complex datasets, engineers statistical models, and deploys predictive machine learning solutions.',
    responsibilities: [
      'Extract, clean, and transform unstructured and structured data pipelines.',
      'Train supervised, unsupervised, and deep learning algorithms with rigorous validation.',
      'Translate business questions into statistical hypothesis tests and actionable metrics.',
      'Serve ML models via low-latency inference APIs and monitor data drift.'
    ],
    workEnvironments: ['Data Science Labs', 'Fintech Credit Risk Units', 'E-Commerce Recommendation Teams', 'Healthcare Analytics'],
    entryRoles: ['Junior Data Analyst', 'Associate ML Engineer', 'Business Intelligence Analyst'],
    advancementRoles: ['Senior Data Scientist', 'Lead AI Researcher', 'Head of Data Science'],
    relevantProgrammes: ['bsc-cs', 'bsc-math', 'bsc-it'],
    relevantUnitCodes: ['CSC 211', 'CSC 311', 'CSC 321', 'MAT 121', 'MAT 122', 'MAT 221', 'MAT 222', 'MAT 321'],
    technicalSkills: ['Python (NumPy, Pandas, Scikit-learn)', 'SQL Query Optimization', 'PyTorch / TensorFlow', 'Statistical Modeling', 'Tableau / Matplotlib', 'Model Evaluation & Metrics'],
    transferableSkills: ['Scientific Rigor', 'Quantitative Storytelling', 'Hypothesis Formulation', 'Ethical Data Awareness'],
    recommendedCertifications: [
      { name: 'Google Professional Data Engineer', provider: 'Google Cloud', isMandatory: false, note: 'Validates scalable data pipeline mastery' },
      { name: 'DeepLearning.AI Machine Learning Specialization', provider: 'Coursera / Stanford Online', isMandatory: false }
    ],
    portfolioProjects: [
      {
        id: 'proj-ds-1',
        title: 'End-to-End Hospital Readmission Predictor',
        level: 'Intermediate',
        summary: 'Train a tree-based model on clinical feature data, evaluate ROC-AUC, handle class imbalance via SMOTE, and explain outputs with SHAP.',
        skillsExercised: ['Pandas', 'Scikit-learn', 'SHAP Explainability', 'Feature Engineering'],
        deliverables: ['Jupyter Notebook with EDA findings', 'Streamlit interactive diagnostic dashboard', 'Model card evaluation summary'],
        estimatedWeeks: 3
      }
    ],
    roadmapSteps: [
      {
        id: 'step-ds-1',
        stepNumber: 1,
        title: 'Master Linear Algebra, Probability & Python Data Stack',
        description: 'Build intuition for matrix transformations, eigenvalues, probability density functions, and Pandas dataframes.',
        phase: 'Foundation (Year 1-2)',
        recommendedResources: [
          { title: '3Blue1Brown Essence of Linear Algebra', type: 'Interactive Tutorial', url: 'https://www.3blue1brown.com' },
          { title: 'Python Data Science Handbook', type: 'Documentation', url: 'https://jakevdp.github.io/PythonDataScienceHandbook/' }
        ],
        practicalActions: ['Complete real-world data cleaning and exploratory analysis on Kaggle datasets.', 'Implement gradient descent from scratch in pure Python and NumPy.']
      },
      {
        id: 'step-ds-2',
        stepNumber: 2,
        title: 'Classical Machine Learning & Statistical Inference',
        description: 'Train logistic regressions, random forests, and gradient boosted trees with cross-validation and feature selection.',
        phase: 'Specialization (Year 3)',
        recommendedResources: [
          { title: 'Scikit-learn Official User Guide', type: 'Documentation', url: 'https://scikit-learn.org/stable/user_guide.html' }
        ],
        practicalActions: ['Build an end-to-end predictive pipeline with cross-validation and parameter tuning.', 'Write a technical writeup analyzing trade-offs between precision, recall, and false discovery.']
      }
    ],
    postgraduateOptions: ['MSc Data Science & AI', 'MSc Statistics & Machine Learning', 'PhD Computational Mathematics'],
    dataLimitationNotice: 'Localized compensation varies across sectors; consult reputable regional employment databases for verified figures.',
    isDemo: false
  },
  {
    id: 'career-cybersecurity',
    slug: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst / Information Security Specialist',
    category: 'Technology & Computing',
    summary: 'Protects critical IT infrastructure, monitors security operations centers, investigates vulnerabilities, and manages incident response.',
    responsibilities: [
      'Monitor networks and endpoint logs using SIEM tools for suspicious activity.',
      'Perform vulnerability assessments, penetration testing, and risk audits.',
      'Formulate security policies adhering to ISO 27001 and NIST frameworks.',
      'Investigate security breaches and coordinate incident response containment.'
    ],
    workEnvironments: ['Security Operations Centers (SOC)', 'Financial Institutions', 'Government & Defense', 'Cybersecurity Consultancies'],
    entryRoles: ['SOC Tier 1 Analyst', 'Junior Penetration Tester', 'Security Operations Specialist', 'Information Security Officer'],
    advancementRoles: ['SOC Manager', 'Lead Security Architect', 'Chief Information Security Officer (CISO)'],
    relevantProgrammes: ['bsc-cs', 'bsc-it'],
    relevantUnitCodes: ['CSC 123', 'CSC 312', 'BIT 112', 'BIT 212', 'BIT 221', 'BIT 222', 'BIT 411'],
    technicalSkills: ['Network Packet Analysis (Wireshark)', 'SIEM & Log Analysis', 'Linux CLI & Scripting', 'OWASP Top 10', 'Vulnerability Scanning', 'Cryptography'],
    transferableSkills: ['Adversarial Mindset', 'Crisis Communication', 'Detailed Investigative Reporting', 'Compliance Governance'],
    recommendedCertifications: [
      { name: 'CompTIA Security+', provider: 'CompTIA', isMandatory: false, note: 'Industry baseline certification for entry SOC roles' },
      { name: 'Certified Information Systems Auditor (CISA)', provider: 'ISACA', isMandatory: false, note: 'High value for IT audit pathways' }
    ],
    portfolioProjects: [
      {
        id: 'proj-sec-1',
        title: 'Home Lab SOC with Elastic Stack & Suricata IDS',
        level: 'Intermediate',
        summary: 'Set up an isolated virtual network, simulate brute-force and port scan attacks, and configure alert detection rules in Kibana.',
        skillsExercised: ['Suricata IDS', 'Elasticsearch / Kibana', 'Linux Virtualization', 'Alert Tuning'],
        deliverables: ['SOC architecture schematic', 'Incident response playbook documentation', 'PCAP packet analysis writeup'],
        estimatedWeeks: 4
      }
    ],
    roadmapSteps: [
      {
        id: 'step-sec-1',
        stepNumber: 1,
        title: 'Master Networking Protocols & Linux Hardening',
        description: 'Understand TCP three-way handshake, DNS, ARP poisoning, iptables, and Linux file permissions.',
        phase: 'Foundation (Year 1-2)',
        recommendedResources: [
          { title: 'Professor Messer CompTIA Security+ Training', type: 'Course', url: 'https://www.professormesser.com' },
          { title: 'OverTheWire Bandit Wargames', type: 'Interactive Tutorial', url: 'https://overthewire.org/wargames/bandit/' }
        ],
        practicalActions: ['Complete OverTheWire Bandit challenges to master Linux command-line skills.', 'Capture and analyze HTTP vs HTTPS traffic in Wireshark.']
      }
    ],
    postgraduateOptions: ['MSc Information Security & Digital Forensics', 'MSc Cybersecurity Engineering'],
    dataLimitationNotice: 'Security clearances and jurisdictional requirements influence access to government-adjacent roles.',
    isDemo: false
  },
  {
    id: 'career-cloud-devops',
    slug: 'cloud-devops-architect',
    title: 'Cloud & DevOps Solutions Architect',
    category: 'Technology & Computing',
    summary: 'Automates cloud infrastructure, manages resilient distributed platforms, and establishes continuous delivery pipelines.',
    responsibilities: [
      'Provision scalable infrastructure using Terraform and Infrastructure as Code (IaC).',
      'Manage container orchestration clusters using Kubernetes and Docker.',
      'Build resilient CI/CD delivery pipelines with automated testing and rollbacks.',
      'Monitor system availability, latency, and observability using Prometheus and Grafana.'
    ],
    workEnvironments: ['Cloud Native Enterprises', 'Fintech Infrastructure', 'Telecommunications Providers', 'Global SaaS Platforms'],
    entryRoles: ['Junior DevOps Engineer', 'Cloud Support Associate', 'Site Reliability Engineer I', 'Infrastructure Specialist'],
    advancementRoles: ['Principal DevOps Engineer', 'Lead Cloud Architect', 'VP of Cloud Infrastructure'],
    relevantProgrammes: ['bsc-cs', 'bsc-it'],
    relevantUnitCodes: ['CSC 123', 'CSC 221', 'CSC 313', 'BIT 212', 'BIT 311', 'BIT 312'],
    technicalSkills: ['Terraform / OpenTofu', 'Docker & Kubernetes', 'AWS / Google Cloud / Azure', 'Linux Server Administration', 'Bash & Python Scripting', 'CI/CD Automation'],
    transferableSkills: ['Reliability Engineering', 'Incident Post-Mortems', 'Cost Optimization Discipline', 'Cross-Team Enablement'],
    recommendedCertifications: [
      { name: 'AWS Solutions Architect - Associate', provider: 'Amazon Web Services', isMandatory: false },
      { name: 'Certified Kubernetes Administrator (CKA)', provider: 'Cloud Native Computing Foundation', isMandatory: false }
    ],
    portfolioProjects: [
      {
        id: 'proj-cloud-1',
        title: 'Multi-Region High Availability Web Cluster with Terraform',
        level: 'Intermediate',
        summary: 'Write declarative Terraform modules to provision a load-balanced VPC, auto-scaling compute group, and managed PostgreSQL with automated backups.',
        skillsExercised: ['Terraform', 'VPC Architecture', 'Auto-Scaling', 'Cost Estimation'],
        deliverables: ['Modular Terraform codebase with variable validation', 'Cost breakdown report', 'Stress testing demonstration'],
        estimatedWeeks: 3
      }
    ],
    roadmapSteps: [
      {
        id: 'step-cloud-1',
        stepNumber: 1,
        title: 'Linux Systems, Networking & Containerization',
        description: 'Learn systemd processes, cgroups, network namespaces, Dockerfile optimization, and multi-stage builds.',
        phase: 'Foundation (Year 1-2)',
        recommendedResources: [
          { title: 'Docker Official Documentation', type: 'Documentation', url: 'https://docs.docker.com' },
          { title: 'Linux Journey Tutorials', type: 'Interactive Tutorial', url: 'https://linuxjourney.com' }
        ],
        practicalActions: ['Containerize a multi-service web app (frontend, backend, Redis, database) using Docker Compose.']
      }
    ],
    postgraduateOptions: ['MSc Cloud Computing Architecture', 'MSc Distributed Systems Engineering'],
    dataLimitationNotice: 'Official certifications significantly enhance early interview screening in enterprise cloud hiring.',
    isDemo: false
  },
  {
    id: 'career-financial-analyst',
    slug: 'financial-analyst',
    title: 'Financial Analyst / Quantitative Modeler',
    category: 'Business & Finance',
    summary: 'Evaluates capital investments, builds financial models, assesses market risk, and guides corporate strategy.',
    responsibilities: [
      'Construct discounted cash flow (DCF), 3-statement, and scenario financial models.',
      'Perform variance analysis comparing actual departmental spend against budgets.',
      'Assess equity, debt, and venture capital investment opportunities.',
      'Present executive briefing reports on financial health and market risks.'
    ],
    workEnvironments: ['Commercial & Investment Banks', 'Asset Management Firms', 'Corporate Finance Departments', 'Private Equity & Venture Funds'],
    entryRoles: ['Junior Financial Analyst', 'Budget Analyst', 'Credit Analyst', 'Equity Research Associate'],
    advancementRoles: ['Senior Financial Analyst', 'Finance Director', 'Portfolio Manager', 'Chief Financial Officer (CFO)'],
    relevantProgrammes: ['b-com', 'bsc-math'],
    relevantUnitCodes: ['BMS 111', 'BMS 121', 'BMS 211', 'BMS 221', 'BMS 311', 'MAT 122', 'MAT 221', 'MAT 411'],
    technicalSkills: ['Financial Modeling (Excel / Sheets)', 'DCF & WACC Valuation', 'Financial Statement Analysis', 'Python / R for Finance', 'Power BI / Tableau', 'Bloomberg / Reuters Terminal Basics'],
    transferableSkills: ['Executive Presentation', 'Commercial Due Diligence', 'Attention to Variance Detail', 'Risk Sensitivity'],
    recommendedCertifications: [
      { name: 'CFA Charter (Level 1 Candidate)', provider: 'CFA Institute', isMandatory: false, note: 'Global benchmark for investment and asset management careers' },
      { name: 'Certified Public Accountant (CPA / ACCA)', provider: 'KASNEB / ACCA', isMandatory: false, note: 'Standard requirement for corporate audit & controller paths' }
    ],
    portfolioProjects: [
      {
        id: 'proj-fin-1',
        title: '3-Statement Financial Model & Valuation of a Public Firm',
        level: 'Intermediate',
        summary: 'Build an integrated Income Statement, Balance Sheet, and Cash Flow model with dynamic debt schedule and sensitivity tables.',
        skillsExercised: ['Excel Modeling', 'Financial Statements', 'WACC Calculation', 'Scenario Analysis'],
        deliverables: ['Audited Excel workbook with zero hardcoded formula errors', 'Executive pitch deck PDF with investment recommendation'],
        estimatedWeeks: 3
      }
    ],
    roadmapSteps: [
      {
        id: 'step-fin-1',
        stepNumber: 1,
        title: 'Master Accounting Mechanics & Financial Statements',
        description: 'Understand the linkage between the P&L, balance sheet, and working capital cycles.',
        phase: 'Foundation (Year 1-2)',
        recommendedResources: [
          { title: 'Corporate Finance Institute Free Resources', type: 'Interactive Tutorial', url: 'https://corporatefinanceinstitute.com' }
        ],
        practicalActions: ['Read and summarize the 10-K annual report of three publicly listed companies.']
      }
    ],
    postgraduateOptions: ['MSc Finance & Investment', 'MBA in Finance', 'MSc Financial Engineering'],
    dataLimitationNotice: 'Regulatory licenses (e.g., CPA, CFA) are legally mandated for statutory auditing and discretionary asset management.',
    isDemo: false
  },
  {
    id: 'career-nurse-specialist',
    slug: 'clinical-nurse-specialist',
    title: 'Clinical Nurse Specialist / Health Informatics Lead',
    category: 'Healthcare & Clinical Sciences',
    summary: 'Delivers advanced patient care, coordinates clinical protocols, and champions clinical information systems and evidence-based practice.',
    responsibilities: [
      'Provide expert clinical patient assessment, care coordination, and emergency triage.',
      'Audit clinical nursing outcomes against national health standards.',
      'Bridge clinical workflows with electronic medical record (EMR) implementation.',
      'Mentor and train nursing students and hospital care teams.'
    ],
    workEnvironments: ['Referral & Teaching Hospitals', 'County Health Departments', 'Specialized Medical Clinics', 'Healthcare NGO Programs'],
    entryRoles: ['Staff Nurse', 'Ward Charge Nurse', 'Community Health Officer', 'Clinical Research Nurse'],
    advancementRoles: ['Clinical Nurse Specialist', 'Nurse Manager / Matron', 'Director of Nursing Services', 'Health Informatics Specialist'],
    relevantProgrammes: ['bsc-nursing'],
    relevantUnitCodes: ['NRS 111', 'NRS 112', 'NRS 121', 'NRS 211', 'NRS 221', 'NRS 222', 'NRS 311', 'NRS 312', 'NRS 411'],
    technicalSkills: ['Clinical Patient Assessment', 'Pharmacology & Medication Administration', 'Electronic Medical Records (EMR)', 'Infection Control Protocols', 'Emergency Triage & BLS/ACLS', 'Clinical Audit'],
    transferableSkills: ['Patient Empathy & Compassion', 'High-Stress Crisis Composure', 'Interdisciplinary Team Leadership', 'Advocacy for Vulnerable Patients'],
    recommendedCertifications: [
      { name: 'Nursing Council of Kenya (NCK) License', provider: 'Nursing Council of Kenya', isMandatory: true, note: 'Mandatory professional practicing license in Kenya' },
      { name: 'Advanced Cardiac Life Support (ACLS)', provider: 'American Heart Association / ERC', isMandatory: false, note: 'Highly regarded for intensive care and emergency units' }
    ],
    portfolioProjects: [
      {
        id: 'proj-nrs-1',
        title: 'Evidence-Based Hospital Handover Checklist & EMR Workflow',
        level: 'Intermediate',
        summary: 'Design a structured SBAR (Situation, Background, Assessment, Recommendation) digital shift-handover protocol to reduce communication errors.',
        skillsExercised: ['SBAR Protocol', 'Clinical Workflow Design', 'Patient Safety Audit'],
        deliverables: ['Clinical audit guideline document', 'Digital checklist prototype template', 'Staff training presentation'],
        estimatedWeeks: 3
      }
    ],
    roadmapSteps: [
      {
        id: 'step-nrs-1',
        stepNumber: 1,
        title: 'Master Anatomy, Physiology & Core Clinical Skills',
        description: 'Establish thorough foundations in physiology, medical microbiology, sterile procedure, and patient assessment.',
        phase: 'Foundation (Year 1-2)',
        recommendedResources: [
          { title: 'Khan Academy Health & Medicine Modules', type: 'Course', url: 'https://www.khanacademy.org' }
        ],
        practicalActions: ['Log clinical hours in university skills lab and pass core OSCE practical assessments.']
      }
    ],
    postgraduateOptions: ['MSc Clinical Nursing', 'MSc Health Systems Management', 'MSc Public Health & Epidemiology'],
    regulatedProfessionNote: 'Nursing is a strictly regulated profession. Practicing requires official council registration, internship completion, and valid board licensing in your jurisdiction.',
    dataLimitationNotice: 'Public healthcare salary structures are determined by government civil service pay scales.',
    isDemo: false
  },
  {
    id: 'career-embedded-systems',
    slug: 'embedded-systems-engineer',
    title: 'Embedded Systems & IoT Hardware Engineer',
    category: 'Engineering & Physical Sciences',
    summary: 'Designs firmware, microcontroller circuits, and connected Internet of Things devices bridging hardware and software.',
    responsibilities: [
      'Write bare-metal and RTOS firmware in C/C++ for ARM and RISC-V processors.',
      'Design printed circuit boards (PCBs) and simulate electrical schematics in KiCAD/Altium.',
      'Implement communication protocols: I2C, SPI, UART, CAN bus, and Bluetooth LE.',
      'Debug hardware using oscilloscopes, logic analyzers, and digital multimeters.'
    ],
    workEnvironments: ['Hardware Startups', 'Automotive Electronics', 'Industrial Automation & Robotics', 'Consumer Electronics Manufacturers'],
    entryRoles: ['Junior Firmware Engineer', 'Hardware Test Engineer', 'Embedded Software Associate'],
    advancementRoles: ['Senior Embedded Systems Engineer', 'Lead Hardware Architect', 'Director of Hardware Engineering'],
    relevantProgrammes: ['bsc-elec-eng', 'bsc-mech-eng', 'bsc-cs'],
    relevantUnitCodes: ['EEE 111', 'EEE 121', 'EEE 211', 'EEE 221', 'EEE 311', 'CSC 111', 'CSC 113', 'CSC 221'],
    technicalSkills: ['Embedded C / C++', 'Microcontroller Architectures (ARM, ESP32, STM32)', 'RTOS (FreeRTOS)', 'PCB Design (KiCAD)', 'Hardware Debugging (Oscilloscope)', 'Hardware Communication (I2C, SPI, CAN)'],
    transferableSkills: ['Root Cause Hardware Diagnosis', 'Safety-Critical Diligence', 'Cross-Disciplinary Empathy', 'Resource Constraint Optimization'],
    recommendedCertifications: [
      { name: 'ARM Accredited Engineer (AAE)', provider: 'Arm', isMandatory: false },
      { name: 'Engineers Board of Kenya (EBK) Graduate Engineer Registration', provider: 'EBK', isMandatory: true, note: 'Required for recognized professional engineering practice in Kenya' }
    ],
    portfolioProjects: [
      {
        id: 'proj-emb-1',
        title: 'Solar Inverter Telemetry Logger with FreeRTOS & MQTT',
        level: 'Intermediate',
        summary: 'Design custom firmware for an ESP32 or STM32 that samples voltage/current sensors via ADC, runs FreeRTOS tasks, and transmits telemetry over WiFi via MQTT.',
        skillsExercised: ['FreeRTOS', 'Embedded C', 'ADC Sampling', 'MQTT Protocol'],
        deliverables: ['Firmware GitHub repository with modular driver code', 'KiCAD schematic and PCB layout files', 'Bench test measurement log'],
        estimatedWeeks: 4
      }
    ],
    roadmapSteps: [
      {
        id: 'step-emb-1',
        stepNumber: 1,
        title: 'Digital Electronics, Circuits & C Foundations',
        description: 'Understand circuit theorems, logic gates, pointers, bitwise manipulation, and memory-mapped registers.',
        phase: 'Foundation (Year 1-2)',
        recommendedResources: [
          { title: 'Embedded Systems - Shape the World (UT Austin)', type: 'Course', url: 'https://www.edx.org' }
        ],
        practicalActions: ['Program an Arduino or STM32 Nucleo board using register-level C rather than high-level libraries.']
      }
    ],
    postgraduateOptions: ['MSc Embedded Systems & Robotics', 'MSc Electrical & Computer Engineering'],
    regulatedProfessionNote: 'Engineering practice and signing off public designs requires registration with professional engineering regulatory boards.',
    dataLimitationNotice: 'Hardware prototype component costs and local manufacturing access vary widely by country.',
    isDemo: false
  },
  {
    id: 'career-stem-educator',
    slug: 'stem-educator',
    title: 'STEM Educator & Instructional Designer',
    category: 'Education & Learning Design',
    summary: 'Designs innovative curricula, teaches mathematics/sciences, and authors interactive educational technology resources.',
    responsibilities: [
      'Deliver engaging classroom and laboratory instruction in science, technology, and mathematics.',
      'Develop criterion-referenced assessment rubrics and psychometric item evaluations.',
      'Author digital learning modules and interactive simulation guides for secondary and tertiary students.',
      'Incorporate assistive technologies and inclusive universal design for learning (UDL).'
    ],
    workEnvironments: ['Secondary Schools & High Schools', 'EdTech Companies', 'Universities & Technical Colleges', 'Educational Publishing Houses'],
    entryRoles: ['Science Teacher', 'Assistant Curriculum Developer', 'EdTech Content Specialist', 'Instructional Design Associate'],
    advancementRoles: ['Head of Science Department', 'Senior Instructional Designer', 'Curriculum Policy Specialist', 'School Principal'],
    relevantProgrammes: ['b-ed-sci', 'bsc-math'],
    relevantUnitCodes: ['EDU 111', 'EDU 121', 'EDU 211', 'EDU 221', 'EDU 311', 'EDU 321', 'EDU 411', 'MAT 111', 'MAT 112'],
    technicalSkills: ['Curriculum Engineering', 'Rubric & Assessment Construction', 'Educational Technology (LMS Platforms)', 'Laboratory Safety Oversight', 'Inquiry-Based Learning Methodologies', 'Bloom Taxonomy Mapping'],
    transferableSkills: ['Clear Concept Verbalization', 'Empathetic Classroom Mentorship', 'Conflict Resolution', 'Patience & Adaptive Communication'],
    recommendedCertifications: [
      { name: 'Teachers Service Commission (TSC) Registration', provider: 'TSC Kenya', isMandatory: true, note: 'Mandatory license for teaching in Kenyan public and private institutions' }
    ],
    portfolioProjects: [
      {
        id: 'proj-edu-1',
        title: 'Interactive Physics Simulation Unit with Formative Rubric',
        level: 'Intermediate',
        summary: 'Develop a 4-week digital science module incorporating open educational resources (OER), interactive PhET simulations, and an automated grading rubric.',
        skillsExercised: ['Instructional Design', 'Rubric Architecture', 'Digital Media Selection'],
        deliverables: ['Complete teacher guide and lesson plans', 'Student interactive workbook PDF', 'Formative evaluation rubric'],
        estimatedWeeks: 3
      }
    ],
    roadmapSteps: [
      {
        id: 'step-edu-1',
        stepNumber: 1,
        title: 'Pedagogical Foundations & Educational Psychology',
        description: 'Understand developmental stages, memory consolidation, cognitive load theory, and formative assessment.',
        phase: 'Foundation (Year 1-2)',
        recommendedResources: [
          { title: 'Instructional Design Central Guides', type: 'Documentation', url: 'https://www.instructionaldesigncentral.com' }
        ],
        practicalActions: ['Design and peer-teach three mock STEM lessons using inquiry-based instructional strategies.']
      }
    ],
    postgraduateOptions: ['Master of Education (Curriculum & Instruction)', 'MSc Educational Technology'],
    regulatedProfessionNote: 'Teaching in formal educational institutions requires state/national educator registration and criminal background clearance.',
    dataLimitationNotice: 'Public educator compensation is governed by civil service collective bargaining agreements.',
    isDemo: false
  }
];

// Synthetic Comparison Cohorts (Demonstration Only)
export const DEMO_COMPARISON_COHORTS: AcademicComparisonCohort[] = [
  {
    cohortId: 'cohort-csc-211-2025',
    cohortLabel: 'BSc Computer Science - Year 2 Cohort (Synthetic Demo)',
    unitCode: 'CSC 211',
    unitTitle: 'Data Structures & Algorithms',
    isDemo: true,
    sampleSize: 84,
    meanMark: 64.2,
    medianMark: 63.0,
    highestMark: 88.0,
    lowestMark: 41.0,
    distribution: [
      { band: 'First Class (70-100%)', percentage: 22 },
      { band: 'Second Upper (60-69%)', percentage: 46 },
      { band: 'Second Lower (50-59%)', percentage: 24 },
      { band: 'Pass (40-49%)', percentage: 8 },
    ],
    commonRevisionAreas: [
      'Graph Traversal Algorithms (Dijkstra vs A* heuristics)',
      'Balancing AVL and Red-Black Search Trees',
      'Dynamic Programming Tabulation vs Memoization'
    ]
  },
  {
    cohortId: 'cohort-csc-212-2025',
    cohortLabel: 'BSc Computer Science - Year 2 Cohort (Synthetic Demo)',
    unitCode: 'CSC 212',
    unitTitle: 'Database Systems & SQL Modeling',
    isDemo: true,
    sampleSize: 80,
    meanMark: 67.5,
    medianMark: 66.0,
    highestMark: 91.0,
    lowestMark: 44.0,
    distribution: [
      { band: 'First Class (70-100%)', percentage: 31 },
      { band: 'Second Upper (60-69%)', percentage: 44 },
      { band: 'Second Lower (50-59%)', percentage: 19 },
      { band: 'Pass (40-49%)', percentage: 6 },
    ],
    commonRevisionAreas: [
      'Boyce-Codd Normal Form (BCNF) decomposition proofs',
      'Transaction Isolation Levels (ACID, Phantom Reads)',
      'B-Tree vs Hash Indexing query cost plans'
    ]
  },
  {
    cohortId: 'cohort-mat-121-2025',
    cohortLabel: 'BSc Mathematics - Year 1 Cohort (Synthetic Demo)',
    unitCode: 'MAT 121',
    unitTitle: 'Linear Algebra I',
    isDemo: true,
    sampleSize: 62,
    meanMark: 59.8,
    medianMark: 58.0,
    highestMark: 85.0,
    lowestMark: 38.0,
    distribution: [
      { band: 'First Class (70-100%)', percentage: 16 },
      { band: 'Second Upper (60-69%)', percentage: 32 },
      { band: 'Second Lower (50-59%)', percentage: 38 },
      { band: 'Pass / Below (0-49%)', percentage: 14 },
    ],
    commonRevisionAreas: [
      'Vector Subspace Proofs & Linear Independence',
      'Finding Eigenvectors & Diagonalization Conditions',
      'Gram-Schmidt Orthonormalization Procedure'
    ]
  }
];

// Synthetic BrainMate Peer Matches (Clearly labelled demonstration records)
export const DEMO_PEER_MATCHES: BrainMatePeerMatch[] = [
  {
    id: 'peer-1',
    peerDisplayName: 'Faith A.',
    universityName: 'Maseno University',
    programmeName: 'BSc Computer Science',
    sharedUnits: ['CSC 211', 'CSC 212', 'CSC 222'],
    learningStrengths: ['Data Structures & Tree Traversal', 'PostgreSQL Schema Normalization'],
    learningChallenges: ['Asymptotic Big-O Proofs', 'Dynamic Programming Optimization'],
    studyPreferences: 'Prefers quiet pair-coding sessions on weekends, active on Git and VS Code Live Share.',
    matchReason: 'You both share CSC 211 & CSC 212 and complementary strengths in algorithms and database modeling.',
    connectionStatus: 'Not Connected',
    isDemo: true
  },
  {
    id: 'peer-2',
    peerDisplayName: 'Brian O.',
    universityName: 'Maseno University',
    programmeName: 'BSc Computer Science',
    sharedUnits: ['CSC 211', 'CSC 223'],
    learningStrengths: ['Web Application APIs', 'Full-Stack Architecture'],
    learningChallenges: ['Graph Theory', 'Discrete Mathematics'],
    studyPreferences: 'Evening study group sessions (via Google Meet / Discord), focused on hands-on project building.',
    matchReason: 'Targeting Software Engineering career path with aligned roadmap project milestones.',
    connectionStatus: 'Not Connected',
    isDemo: true
  },
  {
    id: 'peer-3',
    peerDisplayName: 'Cynthia M.',
    universityName: 'Maseno University',
    programmeName: 'BSc Information Technology',
    sharedUnits: ['BIT 212', 'BIT 221'],
    learningStrengths: ['Linux Shell Scripting', 'Cisco Network Subnetting'],
    learningChallenges: ['Python Automation Scripts', 'SQL Query Tuning'],
    studyPreferences: 'Weekly library study check-ins and lab test practice.',
    matchReason: 'Enrolled in matching IT systems units and pursuing Cloud & Cybersecurity paths.',
    connectionStatus: 'Request Received',
    isDemo: true
  }
];

// Course Community Resources (Public & Demo labelled)
export const COMMUNITY_RESOURCES: CommunityResource[] = [
  {
    id: 'res-1',
    title: 'Data Structures & Algorithms Visual Study Compendium',
    type: 'Study Guide',
    unitCode: 'CSC 211',
    unitTitle: 'Data Structures & Algorithms',
    programmeName: 'BSc Computer Science',
    authorLabel: 'UniPath Academic Committee (Curated Demo)',
    verifiedStatus: 'Synthetic Demo',
    downloadsCount: 342,
    description: 'Comprehensive chapter notes on Big-O notation, linked lists, binary heaps, balanced trees, and graph algorithms with clean TypeScript/Python snippets.'
  },
  {
    id: 'res-2',
    title: 'PostgreSQL Relational Normalization & SQL Practice Bank',
    type: 'Lecture Notes',
    unitCode: 'CSC 212',
    unitTitle: 'Database Systems & SQL Modeling',
    programmeName: 'BSc Computer Science',
    authorLabel: 'Student Contributor Collective (Demo)',
    verifiedStatus: 'Student Contributed',
    downloadsCount: 289,
    description: '40 sample schema problem sets covering 1NF through BCNF, with explained SQL queries, indexing benchmarks, and transaction rollback patterns.'
  },
  {
    id: 'res-3',
    title: 'Discrete Mathematics & Logic Proof Formula Sheet',
    type: 'Study Guide',
    unitCode: 'CSC 112',
    unitTitle: 'Discrete Mathematics for Computing',
    programmeName: 'BSc Computer Science',
    authorLabel: 'Department of Computing (Curated Demo)',
    verifiedStatus: 'Department Approved',
    downloadsCount: 512,
    description: 'Concise reference sheet for propositional equivalences, set identities, Pigeonhole Principle, induction templates, and graph isomorphism tests.'
  },
  {
    id: 'res-4',
    title: 'Linux Systems Administration & Bash Automation Cheatsheet',
    type: 'Study Guide',
    unitCode: 'BIT 212',
    unitTitle: 'Linux System Administration',
    programmeName: 'BSc Information Technology',
    authorLabel: 'Maseno Linux User Group (Demo)',
    verifiedStatus: 'Student Contributed',
    downloadsCount: 198,
    description: 'Essential commands for file permissions, systemctl services, grep/awk/sed text filtering, cron schedules, and SSH security configs.'
  }
];
