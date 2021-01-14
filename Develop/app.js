const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
let users = [];
async function runTime() {
    await buildUsers();

    console.log(users);

    let finRender = render(users);

    writeToFile(finRender);
}

async function buildUsers() {
    await initQuestions();

    await inquirer
        .prompt({
            type: "confirm",
            message: "Do you want to add another person?",
            name: "addMore",
        })
        .then(async (resp) => {
            if (resp.addMore) {
                await buildUsers();
            }
        });
}

async function initQuestions() {
    let newUser = {};
    await inquirer
        .prompt([
            {
                type: "list",
                message: "what type of employee?",
                name: "employeeType",
                choices: ["Manager", "Engineer", "Intern", "Employee"],
            },
            {
                type: "input",
                message: "What is his/her name?",
                name: "name",
            },
            {
                type: "input",
                message: "What ID do they have?",
                name: "id",
            },
            {
                type: "email",
                message: "What is their email address?",
                name: "email",
            },
        ])
        .then(async (resp) => {
            newUser["employeeType"] = resp.employeeType;
            newUser["name"] = resp.name;
            newUser["id"] = resp.id;
            newUser["email"] = resp.email;

            switch (resp.employeeType) {
                case "Manager":
                    let officeNum = await managerQuestions();
                    newUser["officeNum"] = officeNum;
                    break;
                case "Engineer":
                    let githubName = await EngineerQuestions();
                    newUser["githubName"] = githubName;
                    break;
                case "Intern":
                    let schoolName = await InternQuestions();
                    newUser["schoolName"] = schoolName;
                    break;

                default:
                    console.log("that is not a valid option");
                    break;
            }
        });
    await createUser(newUser);
}

async function managerQuestions() {
    additionalQuestion = await inquirer.prompt([
        {
            type: "input",
            message: "What is their office number",
            name: "officeNum",
        },
    ]);
    return additionalQuestion.officeNum;
}
async function EngineerQuestions() {
    additionalQuestion = await inquirer.prompt([
        {
            type: "input",
            message: "What is their Github name",
            name: "githubName",
        },
    ]);
    return additionalQuestion.githubName;
}
async function InternQuestions() {
    additionalQuestion = await inquirer.prompt([
        {
            type: "input",
            message: "What school do they come from?",
            name: "schoolName",
        },
    ]);
    return additionalQuestion.schoolName;
}

async function createUser(data) {
    let newUser;
    if (data.employeeType === "Manager") {
        newUser = new Manager(data.name, data.id, data.email, data.officeNum);
    } else if (data.employeeType === "Engineer") {
        newUser = new Engineer(data.name, data.id, data.email, data.githubName);
    } else if (data.employeeType === "Intern") {
        newUser = new Intern(data.name, data.id, data.email, data.schoolName);
    } else {
        console.log("no else");
    }
    users.push(newUser);
}

function writeToFile(render) {
    fs.writeFile("team.html", render, (err) => {
        if (err) throw err;
        console.log("The file has been saved!");
    });
}

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```

runTime();
