const fs = require('fs');
const path = require('path');

// Unique Indian boys' names extracted from the Excel sheet
const uniqueBoysNames = [
    "Aarav Sharma", "Aditya Verma", "Aman Gupta", "Ankit Yadav", "Arjun Singh",
    "Ashish Meena", "Ayush Jain", "Bharat Saini", "Bhavesh Patel", "Deepak Choudhary",
    "Devendra Rathore", "Gaurav Mishra", "Harsh Vardhan", "Himanshu Solanki", "Ishaan Kapoor",
    "Jatin Malhotra", "Karan Chauhan", "Kartik Bansal", "Lokesh Prajapati", "Manish Kumar",
    "Mohit Sharma", "Nikhil Gupta", "Pankaj Singh", "Pradeep Kumar", "Rahul Verma",
    "Rajat Joshi", "Ravi Kumar", "Rohan Patel", "Rohit Sharma", "Sachin Yadav",
    "Sanjay Meena", "Sandeep Singh", "Shubham Jain", "Siddharth Chauhan", "Suresh Rathore",
    "Tarun Mishra", "Varun Solanki", "Vikas Kapoor", "Vinay Malhotra", "Vishal Bansal",
    "Yash Prajapati", "Yogesh Saini", "Abhishek Kumar", "Ajay Sharma", "Akash Verma",
    "Amit Gupta", "Anil Yadav", "Ankur Singh", "Anurag Meena", "Arun Jain",
    "Chetan Patel", "Dinesh Choudhary", "Gopal Rathore", "Harish Mishra", "Kamal Vardhan",
    "Kapil Solanki", "Kiran Kapoor", "Kunal Malhotra", "Lalit Chauhan", "Manoj Bansal",
    "Mukesh Prajapati", "Naveen Kumar", "Neeraj Sharma", "Nitesh Verma", "Pawan Gupta",
    "Prakash Yadav", "Praveen Singh", "Puneet Meena", "Raghav Jain", "Rakesh Saini",
    "Ramesh Patel", "Ranjan Choudhary", "Ritesh Rathore", "Sagar Mishra", "Sahil Vardhan",
    "Sameer Solanki", "Saurabh Kapoor", "Shailesh Malhotra", "Shivam Chauhan", "Sumit Bansal",
    "Sunil Prajapati", "Tushar Kumar", "Uday Sharma", "Umesh Verma", "Vijay Gupta",
    "Vikram Yadav", "Vivek Singh", "Yuvraj Meena", "Abhay Jain", "Adarsh Saini",
    "Aditya Patel", "Alok Choudhary", "Amitabh Rathore", "Anand Mishra", "Anuj Vardhan",
    "Aryan Solanki", "Ashok Kapoor", "Atul Malhotra", "Brijesh Chauhan", "Chirag Bansal",
    "Daksh Prajapati", "Darshan Kumar", "Dheeraj Sharma", "Dilip Verma", "Divyansh Gupta",
    "Gagan Yadav", "Gautam Singh", "Girish Meena", "Hardik Jain", "Hemant Saini",
    "Hitesh Patel", "Indrajit Choudhary", "Jagdish Rathore", "Jai Mishra", "Jayesh Vardhan",
    "Kailash Solanki", "Keshav Kapoor", "Kishore Malhotra", "Krishna Chauhan", "Lakshay Bansal",
    "Mahesh Prajapati", "Mayank Kumar", "Mohan Sharma", "Nakul Verma", "Narendra Gupta",
    "Nitin Yadav", "Om Singh", "Paras Meena", "Parth Jain", "Piyush Saini",
    "Prashant Patel", "Pritam Choudhary", "Rajeev Rathore", "Raman Mishra", "Rishabh Vardhan",
    "Rishi Solanki", "Roshan Kapoor", "Rupesh Malhotra", "Saksham Chauhan", "Samarth Bansal",
    "Sanket Prajapati", "Sarthak Kumar", "Satish Sharma", "Shekhar Verma", "Shreyas Gupta",
    "Sourabh Yadav", "Subhash Singh", "Sushil Meena", "Tanmay Jain", "Tanuj Saini",
    "Tejas Patel", "Udit Choudhary", "Ujjwal Rathore", "Utkarsh Mishra", "Veer Vardhan",
    "Vimal Solanki", "Vineet Kapoor", "Vipin Malhotra", "Yatin Chauhan", "Yuvaan Bansal",
    "Aakarsh Prajapati", "Aakash Kumar", "Abhinav Sharma", "Aditya Verma", "Advait Gupta",
    "Agastya Yadav", "Akshay Singh", "Aniket Meena", "Anirudh Jain", "Anmol Saini",
    "Arnav Patel", "Arush Choudhary", "Atharv Rathore", "Avi Mishra", "Ayaan Vardhan",
    "Bhuvan Solanki", "Dhruv Kapoor", "Ekansh Malhotra", "Garvit Chauhan", "Harsh Bansal",
    "Ishan Prajapati", "Kabir Kumar", "Krish Sharma", "Laksh Verma", "Madhav Gupta",
    "Manan Yadav", "Naman Singh", "Navya Meena", "Neil Jain", "Nirav Saini",
    "Ojas Patel", "Pranav Choudhary", "Reyansh Rathore", "Rudra Mishra", "Saanvi Vardhan",
    "Shivansh Solanki", "Shourya Kapoor", "Tanish Malhotra", "Vedant Chauhan", "Vihaan Bansal"
];

function fixDuplicateNames() {
    try {
        // Read the current students data
        const filePath = path.join(__dirname, 'students_data.json');
        const studentsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        console.log(`Total students: ${studentsData.length}`);
        console.log(`Available unique names: ${uniqueBoysNames.length}`);

        if (uniqueBoysNames.length < studentsData.length) {
            console.error(`ERROR: Not enough unique names! Need ${studentsData.length}, have ${uniqueBoysNames.length}`);
            process.exit(1);
        }

        // Create a shuffled copy of unique names to randomize assignment
        const shuffledNames = [...uniqueBoysNames].sort(() => Math.random() - 0.5);

        // Replace each student's name with a unique name
        const updatedStudents = studentsData.map((student, index) => {
            return {
                ...student,
                name: shuffledNames[index]
            };
        });

        // Verify all names are unique
        const nameSet = new Set(updatedStudents.map(s => s.name));
        console.log(`Unique names after update: ${nameSet.size}`);

        if (nameSet.size !== updatedStudents.length) {
            console.error('ERROR: Duplicate names still exist!');
            process.exit(1);
        }

        // Write back to file
        fs.writeFileSync(filePath, JSON.stringify(updatedStudents, null, 4));
        console.log('\n✅ Successfully updated students_data.json with unique names!');
        console.log(`✅ All ${updatedStudents.length} students now have unique names.`);

    } catch (error) {
        console.error('Error fixing duplicate names:', error);
        process.exit(1);
    }
}

// Run the fix
fixDuplicateNames();
