import mongoose from 'mongoose';

import dotenv from 'dotenv';
import User from '../src/features/auth/models/UserModels.js';
import Problem from '../src/features/problems/models/ProblemModel.js';
import Submission from '../src/features/submissions/models/submissionModel.js';
import bcrypt from 'bcryptjs';


dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

const generateUsers = async (count = 100) => {
  const users = [];
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  for (let i = 1; i <= count; i++) {
    users.push({
      name: `User ${i}`,
      email: `user${i}@example.com`,
      password: hashedPassword,
      role: i <= 5 ? 'admin' : 'learner',
      isActive: Math.random() > 0.1, // 90% active
      solvedProblemsCount: Math.floor(Math.random() * 50),
      totalSubmissionsCount: Math.floor(Math.random() * 200),
      acceptedSubmissionsCount: Math.floor(Math.random() * 150),
      easyProblemsSolved: Math.floor(Math.random() * 20),
      mediumProblemsSolved: Math.floor(Math.random() * 15),
      hardProblemsSolved: Math.floor(Math.random() * 10),
      rankPoints: Math.floor(Math.random() * 1000),
      currentStreak: Math.floor(Math.random() * 30),
      longestStreak: Math.floor(Math.random() * 60),
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
    });
  }

  return users;
};

const generateProblems = (count = 150) => {
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const tags = ['arrays', 'strings', 'dynamic-programming', 'graphs', 'trees', 'sorting', 'searching', 'math'];
  const problems = [];
  
  for (let i = 1; i <= count; i++) {
    const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    problems.push({
      title: `Problem ${i}: ${difficulty} Challenge`,
      slug: `problem-${i}-${difficulty.toLowerCase()}-challenge`,
      description: `This is a ${difficulty.toLowerCase()} level problem that tests your algorithmic thinking. Solve this to improve your skills.`,
      difficulty,
      tags: [tags[Math.floor(Math.random() * tags.length)], tags[Math.floor(Math.random() * tags.length)]],
      sampleInput: '5\n1 2 3 4 5',
      sampleOutput: '15',
      timeLimitSec: difficulty === 'Hard' ? 2 : 1,
      memoryLimitMB: 256,
      examples: [
        {
          input: '3\n1 2 3',
          output: '6',
          explanation: 'Sum of numbers'
        }
      ],
       constraints: ['1 ≤ n ≤ 1000', '1 ≤ arr[i] ≤ 1000'],
      hints: ['Try using a loop', 'Think about edge cases'],
      testCases: [
        { input: '5\n1 2 3 4 5', expectedOutput: '15', isHidden: false }
      ],
      totalSubmissions: Math.floor(Math.random() * 500),
      acceptedSubmissions: Math.floor(Math.random() * 300),
      views: Math.floor(Math.random() * 1000),
      createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000)
    });
  }
  
  return problems;
};

const generateSubmissions = async (users, problems, count = 500) => {
  const verdicts = ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error'];
  const languages = ['javascript', 'python', 'java', 'c++', 'c'];
  const submissions = [];
  
  for (let i = 0; i < count; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const problem = problems[Math.floor(Math.random() * problems.length)];
    const verdict = verdicts[Math.floor(Math.random() * verdicts.length)];
    const isAccepted = verdict === 'Accepted';
    
    submissions.push({
      userId: user._id,
      problemId: problem._id,
      code: `function solution() { return "test"; }`,
      language: languages[Math.floor(Math.random() * languages.length)],
      verdict,
      status: isAccepted ? 3 : Math.floor(Math.random() * 6) + 4,
      output: isAccepted ? 'Correct output' : 'Wrong output',
      executionTime: `${Math.floor(Math.random() * 500)}ms`,
      memoryUsed: `${Math.floor(Math.random() * 50000)}KB`,
      isAccepted,
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
    });
  }
  return submissions;
};

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('Clearing existing data...');
    await User.deleteMany({ email: { $regex: /^user\d+@example\.com$/ } });
    await Problem.deleteMany({ slug: { $regex: /^problem-\d+/ } });
    await Submission.deleteMany({});
    
    // Generate and insert users
    console.log('Generating users...');
    const usersData = await generateUsers(100);
    const users = await User.insertMany(usersData);
    console.log(`✓ Created ${users.length} users`);
    
    // Generate and insert problems
    console.log('Generating problems...');
    const problemsData = generateProblems(150);
    // Add createdBy field from first admin user
    const adminUser = users.find(u => u.role === 'admin');
    problemsData.forEach(p => p.createdBy = adminUser._id);
    const problems = await Problem.insertMany(problemsData);
    console.log(`✓ Created ${problems.length} problems`);
    
    // Generate and insert submissions
    console.log('Generating submissions...');
    const submissionsData = await generateSubmissions(users, problems, 500);
    const submissions = await Submission.insertMany(submissionsData);
    console.log(`✓ Created ${submissions.length} submissions`);
    
    console.log('\n✅ Seeding completed successfully!');
    console.log('\nTest Accounts:');
    console.log('Admin: user1@example.com / password123');
    console.log('Learner: user6@example.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();

