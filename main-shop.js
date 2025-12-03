(function(){
  const $ = s => document.querySelector(s);
  const usersKey = 'vice_users';
  const sessionKey = 'vice_session_email';

  const loginCard = $('#login-card');
  const registerCard = $('#register-card');
  const catalogCard = $('#catalog-card');

  const goRegister = $('#go-register');
  const goLogin = $('#go-login');
  const loginForm = $('#login-form');
  const registerForm = $('#register-form');
  const loginMsg = $('#login-msg');
  const registerMsg = $('#register-msg');
  const welcomeName = $('#welcome-name');
  const logoutBtn = $('#logout-btn');

  const menuLogin = $('#menu-login');
  const menuItems = $('#menu-items');

  // NEW ELEMENTS
  const cardTitle = document.getElementById('card-title');
  const menuLoginText = document.getElementById('menu-login-text');
  const userInfoPanel = document.getElementById('user-info-panel');

  function getUsers(){
    try { return JSON.parse(localStorage.getItem(usersKey)) || []; }
    catch(e){ return []; }
  }
  function saveUsers(list){ localStorage.setItem(usersKey, JSON.stringify(list)); }

  function setSession(email){ localStorage.setItem(sessionKey, email); }
  function getSession(){ return localStorage.getItem(sessionKey); }
  function clearSession(){ localStorage.removeItem(sessionKey); }

  function show(view){
    [loginCard, registerCard, catalogCard].forEach(el=>{
      el.classList.add('hidden'); 
      el.setAttribute('aria-hidden','true');
    });

    if(view==='login'){
      loginCard.classList.remove('hidden');
      loginCard.setAttribute('aria-hidden','false');

      // SET LOGIN TITLE + LEFT MENU
      cardTitle.textContent = "LOGIN";
      menuLoginText.textContent = "Login";

      // show login form, hide user info
      loginForm.classList.remove('hidden');
      userInfoPanel.classList.add('hidden');

      menuActive('login');
    }

    if(view==='register'){
      registerCard.classList.remove('hidden');
      registerCard.setAttribute('aria-hidden','false');
      menuActive('login');
    }

    if(view==='catalog'){
      catalogCard.classList.remove('hidden');
      catalogCard.setAttribute('aria-hidden','false');
      menuActive('items');
    }
  }

  function menuActive(which){
    [menuLogin, menuItems].forEach(m => m && m.classList.remove('active'));
    if(which==='login' && menuLogin) menuLogin.classList.add('active');
    if(which==='items' && menuItems) menuItems.classList.add('active');
  }

  // NEW FUNCTION — USER INFO PAGE
  function showUserInfo(email){
    const users = getUsers();
    const user = users.find(u=>u.email.toLowerCase() === email.toLowerCase());

    // Change UI title + text
    cardTitle.textContent = "USER INFORMATION";
    menuLoginText.textContent = "User Information";

    // Fill user info fields
    document.getElementById('ui-name').textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById('ui-email').textContent = user.email;
    document.getElementById('ui-address').textContent = `${user.firstName} ${user.lastName}, Philippines`;

    // Show container
    show('login');

    // Swap panels
    loginForm.classList.add('hidden');
    userInfoPanel.classList.remove('hidden');
  }

  // Switchers
  goRegister && goRegister.addEventListener('click', e=>{
    e.preventDefault(); show('register'); 
    document.getElementById('firstName')?.focus();
  });

  goLogin && goLogin.addEventListener('click', e=>{
    e.preventDefault(); show('login'); 
    document.getElementById('email')?.focus();
  });

  menuLogin && menuLogin.addEventListener('click', e=>{
    e.preventDefault();
    if(getSession()) showUserInfo(getSession());
    else show('login');
  });

  menuItems && menuItems.addEventListener('click', e=>{
    e.preventDefault();
    if(getSession()) show('catalog');
    else{
      show('login');
      if(loginMsg){
        loginMsg.style.color = '#b33';
        loginMsg.textContent = "Please log in to view items.";
      }
    }
  });

  // Register handler
  registerForm && registerForm.addEventListener('submit', e=>{
    e.preventDefault();
    const firstName = $('#firstName').value.trim();
    const lastName = $('#lastName').value.trim();
    const email = $('#regEmail').value.trim();
    const pass = $('#regPassword').value.trim();
    const confirm = $('#confirmPassword').value.trim();

    if(pass !== confirm){
      registerMsg.textContent = "Passwords do not match.";
      registerMsg.style.color = "#b33";
      return;
    }

    let users = getUsers();
    if(users.some(u=>u.email.toLowerCase() === email.toLowerCase())){
      registerMsg.textContent = "Email already registered.";
      registerMsg.style.color = "#b33";
      return;
    }

    users.push({ firstName, lastName, email, password: pass });
    saveUsers(users);
    setSession(email);

    showUserInfo(email);
  });

  // Login handler
  loginForm && loginForm.addEventListener('submit', e=>{
    e.preventDefault();
    const email = $('#email').value.trim();
    const pass = $('#password').value.trim();

    const users = getUsers();
    const user = users.find(u=>u.email.toLowerCase()===email.toLowerCase() && u.password===pass);

    if(!user){
      loginMsg.style.color = "#b33";
      loginMsg.textContent = "Invalid email or password.";
      return;
    }

    setSession(email);
    loginMsg.textContent = "Logged in!";
    showUserInfo(email);
  });

  // Logout
  logoutBtn && logoutBtn.addEventListener('click', ()=>{
    clearSession();
    show('login');
    
    cardTitle.textContent = "LOGIN";
    menuLoginText.textContent = "Login";

    loginMsg.style.color = "#3a3";
    loginMsg.textContent = "You have been logged out.";
  });

  // Initial load
  const current = getSession();
  if(current) showUserInfo(current);
  else show('login');
})();
