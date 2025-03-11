// Replace with your Supabase credentials
const SUPABASE_URL = "https://mhnefongznvkumehifto.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1obmVmb25nem52a3VtZWhpZnRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MTk1NTcsImV4cCI6MjA1NzI5NTU1N30.dzcBeszo9F-IXSvbgdTM87KNlUH9wZQIYDrqkdQUIDs";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Sign up a new user
async function signUp() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    const { user, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        alert(error.message);
    } else {
        alert("Check your email for confirmation!");
    }
}

// Login user
async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { user, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        alert(error.message);
    } else {
        alert("Logged in successfully!");
        document.getElementById("dashboard").style.display = "block";
        loadAssignments();
    }
}

// Logout user
async function logout() {
    await supabase.auth.signOut();
    alert("Logged out!");
    document.getElementById("dashboard").style.display = "none";
}

// Save assignment to Supabase
async function saveAssignment() {
    const dateGiven = document.getElementById("dateGiven").value;
    const dueDate = document.getElementById("dueDate").value;
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
        alert("Please log in first!");
        return;
    }

    const { data, error } = await supabase
        .from("assignments")
        .insert([{ 
            user_id: user.data.user.id, 
            date_given: dateGiven, 
            due_date: dueDate 
        }]);

    if (error) {
        console.error(error);
        alert("Error saving assignment.");
    } else {
        alert("Assignment saved!");
        loadAssignments();
    }
}

// Load assignments for the logged-in user
async function loadAssignments() {
    const user = await supabase.auth.getUser();

    if (!user.data.user) return;

    const { data, error } = await supabase
        .from("assignments")
        .select("*")
        .eq("user_id", user.data.user.id);

    if (error) {
        console.error(error);
        alert("Error loading assignments.");
        return;
    }

    const assignmentList = document.getElementById("assignmentList");
    assignmentList.innerHTML = "";
    data.forEach(assignment => {
        const li = document.createElement("li");
        li.textContent = `Given: ${assignment.date_given} | Due: ${assignment.due_date}`;
        assignmentList.appendChild(li);
    });
}

// Auto-load assignments when logged in
supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
        document.getElementById("dashboard").style.display = "block";
        loadAssignments();
    } else {
        document.getElementById("dashboard").style.display = "none";
    }
});

