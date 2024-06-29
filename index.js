const apiUrl = 'https://crudcrud.com/api/0ccc0743f86b4bd4886c390a6a6b80f2/passwordKeeper';

// load passwords and display on page load
document.addEventListener('DOMContentLoaded', () => {
  displayPasswords();
});

function handleFormSubmit(event) {
  event.preventDefault();
  
  const title = document.getElementById('title').value;
  const password = document.getElementById('password').value;
  
//   if (title && password) {
    const newPassword = { title, password };
    savePassword(newPassword);
//   }
}


// display passwords in list and count functionality
async function displayPasswords() {

  const passwordList = document.getElementById('passwordList');
  passwordList.innerHTML = '';//clearing list
  
  const passwords = await loadPasswords();//displaying
  
  console.log(passwords);

  passwords.forEach((item) => {
    const li = document.createElement('li');
  
    li.innerHTML = `${item.title}: ${item.password} <button onclick="deleteItem('${item._id}')">Delete</button> <button onclick="editItem('${item._id}')">Edit</button>`;
    li.classList.add('password-item');  // Added class
  
    passwordList.appendChild(li); //added to list
  });

  document.querySelector('p').textContent = `Total Passwords: ${passwords.length}`;//count changed
}


// clear the form
function clearForm() {
  document.getElementById('title').value = '';
  document.getElementById('password').value = '';
}



// search!!!!!
document.getElementById('search').addEventListener('keyup', function(event) {
  event.preventDefault();
  const filterValue = event.target.value.toLowerCase();
  const items = document.getElementsByClassName('password-item');
  
  for (let i = 0; i < items.length; i++) {
    const currPasswordText = items[i].textContent.toLowerCase();
    
    if (currPasswordText.includes(filterValue)) {
      items[i].style.display = "block";
    } else {
      items[i].style.display = "none";
    }
  }
});





// save password to the API// POST


async function savePassword(newPassword) {
  try {
    await axios.post(apiUrl, newPassword);
    displayPasswords();
    clearForm();
  } catch (error) {
    console.error('Error saving password:', error);
  }
}



// Load passwords from the API// GET
async function loadPasswords() {
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error('Error loading passwords:', error);
    return [];
  }
}

// Delete password
async function deleteItem(id) {
  try {
    await axios.delete(`${apiUrl}/${id}`);
    displayPasswords();
  } catch (error) {
    console.error('Error deleting password:', error);
  }
}




//   editing 
async function editItem(id) {

  try {

    const passwords = await loadPasswords();// returned with  _id 
    const passwordToEdit = passwords.find(item => item._id === id);
  
    if (passwordToEdit) {

      document.getElementById('title').value = passwordToEdit.title;

      document.getElementById('password').value = passwordToEdit.password;

      await deleteItem(id);  // Remove the item from the list
    }
  } catch (error) {
    console.error('Error editing:', error);
  }
}
