//  // Mobile menu toggle
//  document.getElementById('menu-toggle').addEventListener('click', function() {
//     const menu = document.getElementById('mobile-menu');
//     menu.classList.toggle('hidden');
// });

// // Close menu when clicking outside
// document.addEventListener('click', function(event) {
//     const menu = document.getElementById('mobile-menu');
//     const toggle = document.getElementById('menu-toggle');
    
//     if (!menu.contains(event.target) && !toggle.contains(event.target)) {
//         menu.classList.add('hidden');
//     }
// });


//  // Desktop Case Tracker Dropdown
//  const caseTrackerBtn = document.querySelector('.relative.font-sans button');
//  const caseTrackerMenu = document.querySelector('.relative.font-sans .hidden');

//  caseTrackerBtn.addEventListener('click', (e) => {
//      e.stopPropagation();
//      caseTrackerMenu.classList.toggle('hidden');
//  });

//  // Mobile menu toggle
//  const menuToggle = document.getElementById('menu-toggle');
//  const mobileMenu = document.getElementById('mobile-menu');
 
//  menuToggle.addEventListener('click', () => {
//      mobileMenu.classList.toggle('hidden');
//  });

//  // Mobile Case Tracker Dropdown
//  const mobileCaseTrackerToggle = document.getElementById('mobile-case-tracker-toggle');
//  const mobileCaseTrackerMenu = document.getElementById('mobile-case-tracker-menu');
 
//  mobileCaseTrackerToggle.addEventListener('click', (e) => {
//      e.stopPropagation();
//      mobileCaseTrackerMenu.classList.toggle('hidden');
//  });

//  // Close dropdowns when clicking outside
//  document.addEventListener('click', () => {
//      caseTrackerMenu.classList.add('hidden');
//      mobileCaseTrackerMenu.classList.add('hidden');
//  });

//  // Supreme Court Cases functionality
//  document.getElementById('supreme-court-link').addEventListener('click', function(e) {
//      e.preventDefault();
//      alert('Supreme Court Cases functionality would be implemented here');
//      caseTrackerMenu.classList.add('hidden');
//  });



 // Desktop Case Tracker Dropdown
 const caseTrackerBtn = document.querySelector('.relative.font-sans button');
 const caseTrackerMenu = document.querySelector('.relative.font-sans .hidden');

 caseTrackerBtn.addEventListener('click', (e) => {
     e.stopPropagation();
     caseTrackerMenu.classList.toggle('hidden');
 });

 // Mobile menu toggle
 const menuToggle = document.getElementById('menu-toggle');
 const mobileMenu = document.getElementById('mobile-menu');
 
 menuToggle.addEventListener('click', () => {
     mobileMenu.classList.toggle('hidden');
 });

 // Mobile Case Tracker Dropdown
 const mobileCaseTrackerToggle = document.getElementById('mobile-case-tracker-toggle');
 const mobileCaseTrackerMenu = document.getElementById('mobile-case-tracker-menu');
 
 mobileCaseTrackerToggle.addEventListener('click', (e) => {
     e.stopPropagation();
     mobileCaseTrackerMenu.classList.toggle('hidden');
 });

 // Close dropdowns when clicking outside
 document.addEventListener('click', () => {
     caseTrackerMenu.classList.add('hidden');
     mobileCaseTrackerMenu.classList.add('hidden');
 });