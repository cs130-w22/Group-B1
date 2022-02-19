import logo from "./logo.svg";
import "./App.css";

// helpers
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// stub data
const firstnames = [
  "John",
  "Joe",
  "Katie",
  "Lauren",
  "Mariana",
  "Katniss",
  "Peter",
  "Tyler",
  "Tara",
  "Ezekiel",
];
const lastnames = [
  "Smith",
  "Cooper",
  "Westfield",
  "Everdeen",
  "Rennel",
  "Miller",
  "Steinbech",
  "Reinhardt",
];
const personalities = [
  "extrovert, party-lover | 2-bedroom, urban",
  "introvert, gamer | 2-bedroom, suburban",
  "introvert, bookworm | 2-bedroom, urban",
  "extrovert, foodie | bunk beds, urban",
];
let myList = [];
for (let i = 0; i < 30; i++) {
  myList.push({
    firstname: firstnames[randInt(0, firstnames.length - 1)],
    lastname: lastnames[randInt(0, lastnames.length - 1)],
    personality: personalities[randInt(0, personalities.length - 1)],
  });
}
function getMyList() {
  return myList;
}
let userProfile = {
  firstname: firstnames[randInt(0, firstnames.length - 1)],
  lastname: lastnames[randInt(0, lastnames.length - 1)],
  personality: personalities[randInt(0, personalities.length - 1)],
};
function getUserProfile() {
  return userProfile;
}

//////////////////////////////////////////

function UserProfilePanel() {
  const user = getUserProfile();
  return (
    <div className="user-profile-panel">
      <div className="profilePicture"></div>
      <p className="profileName">Firstname Lastname</p>
      <div className="settingsButton"></div>
    </div>
  );
}

/////////////////////////////////////

function RoommateSelectionPanel() {
  const myList = getMyList();
  return (
    <div className="roommate-selection-panel">
      <div className="roommate-list-panel">
        {myList.map((profile) => (
          <div className="miniProfile">
            <div class="miniProfilePicture"></div>
            <div class="miniProfilePreference"></div>
            <p class="miniProfileName">
              {profile.firstname} {profile.lastname}
            </p>
            <p class="miniProfileText">{profile.personality}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ListSelectionPanel() {
  return <div>//</div>;
}

/////////////////////////////////

function ViewedProfilePanel() {
  return <div className="viewed-profile-panel"></div>;
}

/////////////////////////////////

function App() {
  return (
    <div className="App">
      <UserProfilePanel />
      <RoommateSelectionPanel />
      <ViewedProfilePanel />
    </div>
  );
}

// function App() {
//   const profiles = getMyList();
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//       <div className="test-class">
//         {profiles.map((profile) =>
//           <div className="miniProfile">
//             <div class="miniProfilePicture"></div>
//             <div class="miniProfilePreference"></div>
//             <p class="miniProfileName">{profile.firstname} {profile.lastname}</p>
//             <p class="miniProfileText">{profile.personality}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

export default App;
